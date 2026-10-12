import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  ChevronRight,
  Sparkles,
  MapPin,
  AlertTriangle,
  ShieldCheck,
  Building2,
  CheckCircle2,
  Crosshair,
} from 'lucide-react';
import { BloodGroup, Urgency, EmergencyRequest } from '../../types';
import { dataStore } from '../../services/dataStore';
import { matchDonorsForEmergency } from '../../lib/matching';
import { notificationService } from '../../lib/whatsapp';

export const FindBloodPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Multi-step state: 1 (Requirement) -> 2 (Location) -> 3 (Review & Consent) -> 4 (Submitting)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Form states with optional prefill from Gemma AI Assistant query params
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>(
    (searchParams.get('bloodGroup') as BloodGroup) || 'B+'
  );
  const [unitsRequired, setUnitsRequired] = useState<number>(
    parseInt(searchParams.get('units') || '1', 10)
  );
  const [hospitalName, setHospitalName] = useState<string>(
    searchParams.get('hospital') || 'Capital Hospital'
  );
  const [locality, setLocality] = useState<string>(
    searchParams.get('locality') || 'Unit 6, Bhubaneswar'
  );
  const [city, setCity] = useState<string>('Bhubaneswar');
  const [urgency, setUrgency] = useState<Urgency>(
    (searchParams.get('urgency') as Urgency) || 'critical'
  );

  // Location coordinates
  const [latitude, setLatitude] = useState<number>(20.2642);
  const [longitude, setLongitude] = useState<number>(85.8281);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Consent
  const [consentGiven, setConsentGiven] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  // Geolocation request
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
        setIsLocating(false);
      },
      (err) => {
        setIsLocating(false);
        setLocationError(`Location permission denied or unavailable (${err.message}). Using manual location.`);
      },
      { timeout: 8000 }
    );
  };

  // Step 1 -> Step 2 validation
  const handleProceedToLocation = () => {
    if (!hospitalName.trim()) {
      setValidationError('Please enter the hospital or treatment facility name.');
      return;
    }
    setValidationError(null);
    setCurrentStep(2);
  };

  // Step 2 -> Step 3 validation
  const handleProceedToReview = () => {
    if (!locality.trim()) {
      setValidationError('Please specify the locality or area.');
      return;
    }
    setValidationError(null);
    setCurrentStep(3);
  };

  // Step 4: Final Submission
  const handleSubmitEmergency = async () => {
    if (!consentGiven) {
      setValidationError('Please provide the required consent to proceed.');
      return;
    }
    setValidationError(null);
    setCurrentStep(4);

    const currentUser = dataStore.getCurrentUser();

    // Prevent duplicate spam requests if user already submitted within 60 seconds
    const existing = dataStore.getEmergencies();
    const isDuplicate = existing.some(
      (e) =>
        e.requesterId === currentUser.userId &&
        e.bloodGroup === bloodGroup &&
        e.hospitalName.toLowerCase() === hospitalName.trim().toLowerCase() &&
        Date.now() - new Date(e.createdAt).getTime() < 60000
    );

    if (isDuplicate) {
      setValidationError('A similar emergency request was just submitted. Please wait before creating duplicates.');
      setCurrentStep(3);
      return;
    }

    // Create Emergency Record
    const emergency = dataStore.createEmergency({
      requesterId: currentUser.userId,
      requesterName: currentUser.displayName,
      requesterContactReference: currentUser.phoneNumber,
      bloodGroup,
      unitsRequired,
      hospitalName: hospitalName.trim(),
      hospitalAddress: `${hospitalName.trim()}, ${locality.trim()}, ${city}`,
      city,
      locality: locality.trim(),
      approximateLocation: { latitude, longitude },
      urgency,
      patientInformationSharedConsent: consentGiven,
    });

    // Run Backend Matching Engine
    const allDonors = dataStore.getDonors();
    const candidateMatches = matchDonorsForEmergency(emergency, allDonors, { maxRadiusKm: 25 });

    // Generate Notifications & Initial Response Records for top matches
    candidateMatches.slice(0, 5).forEach((match) => {
      const responseId = `resp_${Date.now()}_${match.donor.userId}`;
      const secureToken = `tok_${Math.random().toString(36).substring(2, 9)}`;
      const secureUrl = `${window.location.origin}/donor/invitation/${responseId}?token=${secureToken}`;

      // Create response record in data store
      dataStore.createEmergencyResponse({
        responseId,
        emergencyId: emergency.emergencyId,
        donorId: match.donor.userId,
        donorNameMasked: match.donor.displayName,
        donorBloodGroup: match.donor.bloodGroup,
        distanceKm: match.distanceKm,
        responseStatus: 'invited',
        notificationStatus: 'sent',
        notifiedAt: new Date().toISOString(),
        screeningStatus: 'not_started',
        coordinatorReviewStatus: 'pending',
        secureToken,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      // Enqueue notification job via WhatsApp adapter
      notificationService.createNotificationJob(emergency, match.donor, secureUrl);
    });

    // Small delay for smooth transition then redirect to emergency live tracking
    setTimeout(() => {
      navigate(`/emergency/${emergency.emergencyId}`);
    }, 600);
  };

  return (
    <div className="min-h-screen pb-20 px-4 pt-4 max-w-md mx-auto animate-in fade-in">
      
      {/* Header with Back Button */}
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-stone-200/60">
        <button
          onClick={() => (currentStep > 1 ? setCurrentStep((prev) => (prev - 1) as any) : navigate('/'))}
          className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 p-1.5 -ml-1 rounded-lg hover:bg-stone-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{currentStep === 1 ? 'Home' : 'Back'}</span>
        </button>

        <div className="text-center">
          <h1 className="text-sm font-extrabold text-stone-900">Emergency Blood Request</h1>
          <div className="text-[10px] text-stone-400">Step {currentStep} of 3</div>
        </div>

        {/* Shortcut to Discover Blood Banks immediately */}
        <button
          onClick={() => navigate('/blood-banks')}
          className="text-[11px] font-semibold text-crimson-600 hover:text-crimson-700 underline"
        >
          Blood Banks
        </button>
      </div>

      {/* Gemma 4 AI Assistant Smart Intake Card */}
      {currentStep === 1 && (
        <div
          onClick={() => navigate('/assistant')}
          className="mb-4 p-3 bg-gradient-to-r from-purple-50 via-rose-50 to-amber-50 border border-purple-200/80 rounded-2xl cursor-pointer hover:border-purple-300 transition-all flex items-center justify-between shadow-soft-sm group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-stone-900 flex items-center gap-1">
                Gemma 4 AI Quick-Fill
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-purple-200 text-purple-800 font-semibold">
                  NEW
                </span>
              </div>
              <div className="text-[10.5px] text-stone-600">
                Dictate or paste emergency details into structured fields
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-purple-600 group-hover:translate-x-0.5 transition-transform" />
        </div>
      )}

      {/* Step Indicators */}
      <div className="flex gap-1.5 mb-5">
        <div className={`h-1.5 rounded-full flex-1 transition-all ${currentStep >= 1 ? 'bg-crimson-600' : 'bg-stone-200'}`} />
        <div className={`h-1.5 rounded-full flex-1 transition-all ${currentStep >= 2 ? 'bg-crimson-600' : 'bg-stone-200'}`} />
        <div className={`h-1.5 rounded-full flex-1 transition-all ${currentStep >= 3 ? 'bg-crimson-600' : 'bg-stone-200'}`} />
      </div>

      {/* Error alert if validation fails */}
      {validationError && (
        <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-600" />
          <span>{validationError}</span>
        </div>
      )}

      {/* --- STEP 1: REQUIREMENT --- */}
      {currentStep === 1 && (
        <div className="space-y-4 animate-in fade-in">
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-2">
              Select Required Blood Group *
            </label>
            <div className="grid grid-cols-4 gap-2">
              {bloodGroups.map((group) => (
                <button
                  key={group}
                  type="button"
                  onClick={() => setBloodGroup(group)}
                  className={`py-3 rounded-2xl font-black text-sm transition-all ${
                    bloodGroup === group
                      ? 'bg-crimson-600 text-white shadow-md scale-102 ring-2 ring-crimson-600/30'
                      : 'bg-white border border-stone-200 text-stone-800 hover:border-crimson-200 hover:bg-rose-50/50'
                  }`}
                >
                  {group}
                </button>
              ))}
            </div>
          </div>

          {/* Units Required & Urgency */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1.5">
                Units Needed *
              </label>
              <div className="flex items-center border border-stone-200 rounded-xl bg-white p-1">
                <button
                  type="button"
                  onClick={() => setUnitsRequired((u) => Math.max(1, u - 1))}
                  className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 font-bold text-sm flex items-center justify-center text-stone-700"
                >
                  -
                </button>
                <div className="flex-1 text-center font-bold text-sm text-stone-900">
                  {unitsRequired} {unitsRequired === 1 ? 'Unit' : 'Units'}
                </div>
                <button
                  type="button"
                  onClick={() => setUnitsRequired((u) => Math.min(8, u + 1))}
                  className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 font-bold text-sm flex items-center justify-center text-stone-700"
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1.5">
                Urgency Level *
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as Urgency)}
                className="w-full h-10 px-2.5 rounded-xl border border-stone-200 bg-white text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-crimson-500"
              >
                <option value="critical">Critical (Immediate / ICU)</option>
                <option value="high">High (Within 6 Hours)</option>
                <option value="moderate">Moderate (Scheduled / 24h)</option>
              </select>
            </div>
          </div>

          {/* Hospital / Facility */}
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1.5">
              Hospital or Treatment Facility *
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
                placeholder="e.g. Apollo Hospitals, Capital Hospital, AIIMS"
                className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-crimson-500 text-stone-900"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleProceedToLocation}
            className="w-full mt-3 py-3 rounded-2xl bg-crimson-600 hover:bg-crimson-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <span>Continue to Location</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* --- STEP 2: LOCATION --- */}
      {currentStep === 2 && (
        <div className="space-y-4 animate-in fade-in">
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1.5">
              Locality / Area *
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                placeholder="e.g. Unit 6, Sainik School Road, Patia"
                className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-crimson-500 text-stone-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1.5">
              City
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3 py-2.5 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-crimson-500 text-stone-900"
            />
          </div>

          {/* GPS Quick Pin */}
          <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                <Crosshair className="w-4 h-4 text-crimson-600" />
                Precise Coordinate Search
              </span>
              <button
                type="button"
                onClick={handleDetectLocation}
                disabled={isLocating}
                className="text-xs px-2.5 py-1 bg-white border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-100 font-semibold"
              >
                {isLocating ? 'Detecting...' : 'Use My GPS'}
              </button>
            </div>
            <div className="text-[11px] text-stone-500">
              Current Lat: {latitude.toFixed(4)}, Lon: {longitude.toFixed(4)}
            </div>
            {locationError && (
              <div className="text-[10px] text-amber-700">{locationError}</div>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="py-3 px-4 rounded-2xl border border-stone-300 bg-white text-stone-700 font-bold text-sm"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleProceedToReview}
              className="flex-1 py-3 rounded-2xl bg-crimson-600 hover:bg-crimson-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <span>Review Details</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* --- STEP 3: REVIEW & PRIVACY CONSENT --- */}
      {currentStep === 3 && (
        <div className="space-y-4 animate-in fade-in">
          {/* Summary Card */}
          <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-soft-sm space-y-3">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <span className="text-xs text-stone-500">Blood Requirement:</span>
              <span className="text-sm font-black text-crimson-600">
                {bloodGroup} ({unitsRequired} {unitsRequired === 1 ? 'Unit' : 'Units'})
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <span className="text-xs text-stone-500">Urgency:</span>
              <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded-md ${
                urgency === 'critical' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {urgency}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <span className="text-xs text-stone-500">Hospital:</span>
              <span className="text-xs font-bold text-stone-800 text-right">
                {hospitalName}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-stone-500">Location:</span>
              <span className="text-xs text-stone-700 text-right">
                {locality}, {city}
              </span>
            </div>
          </div>

          {/* Privacy & Minimization Explanation */}
          <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-3.5 space-y-2 text-xs text-stone-600">
            <div className="font-bold text-stone-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              What information will be shared?
            </div>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-stone-600 pl-1">
              <li>Only required blood group, hospital locality, and urgency are sent to nearby matched donors.</li>
              <li>Patient name and full phone numbers are <strong>never</strong> broadcast.</li>
              <li>Donors only receive a private, expiring token link to indicate interest.</li>
            </ul>
          </div>

          {/* Mandatory Consent Checkbox */}
          <label className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-stone-200 cursor-pointer">
            <input
              type="checkbox"
              checked={consentGiven}
              onChange={(e) => setConsentGiven(e.target.checked)}
              className="mt-0.5 w-4 h-4 text-crimson-600 rounded border-stone-300 focus:ring-crimson-500"
            />
            <span className="text-[11.5px] text-stone-700 leading-snug">
              I authorize BloodBridge to notify potential registered donors and nearby facilities regarding this blood requirement. I acknowledge BloodBridge is a coordination tool and not a clinical provider.
            </span>
          </label>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="py-3 px-4 rounded-2xl border border-stone-300 bg-white text-stone-700 font-bold text-sm"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleSubmitEmergency}
              disabled={!consentGiven}
              className={`flex-1 py-3 rounded-2xl text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-1.5 ${
                consentGiven
                  ? 'bg-crimson-600 hover:bg-crimson-700'
                  : 'bg-stone-300 cursor-not-allowed text-stone-500'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Submit Emergency Request</span>
            </button>
          </div>
        </div>
      )}

      {/* --- STEP 4: SUBMITTING / MATCHING ANIMATION --- */}
      {currentStep === 4 && (
        <div className="py-16 text-center space-y-4 animate-in fade-in">
          <div className="w-16 h-16 rounded-full bg-crimson-100 text-crimson-600 flex items-center justify-center mx-auto animate-pulse">
            <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-crimson-600">
              <path
                d="M12 2.5C12 2.5 5 11 5 16C5 19.866 8.134 23 12 23C15.866 23 19 19.866 19 16C19 11 12 2.5 12 2.5Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-base font-extrabold text-stone-900">
              Matching Potential Donors...
            </h2>
            <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
              Running geospatial compatibility engine and creating secure notification jobs.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
