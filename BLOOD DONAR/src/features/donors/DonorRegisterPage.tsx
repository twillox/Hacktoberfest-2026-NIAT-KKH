import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Heart,
  ShieldCheck,
  MapPin,
  CheckCircle,
  AlertCircle,
  BellRing,
  Phone,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BloodGroup } from '../../types';
import { dataStore } from '../../services/dataStore';

export const DonorRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = dataStore.getCurrentUser();

  const [displayName, setDisplayName] = useState(currentUser.displayName || '');
  const [phoneNumber, setPhoneNumber] = useState(currentUser.phoneNumber || '+91 94370 11223');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [city, setCity] = useState('Bhubaneswar');
  const [locality, setLocality] = useState('Saheed Nagar');
  const [travelRadius, setTravelRadius] = useState<number>(15);
  const [notifyWhatsApp, setNotifyWhatsApp] = useState(true);
  const [notifyPush, setNotifyPush] = useState(true);
  const [emergencyAlertConsent, setEmergencyAlertConsent] = useState(true);
  const [validationError, setValidationError] = useState<string | null>(null);

  const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (!displayName.trim()) {
      setValidationError('Please enter your display name.');
      return;
    }
    if (!emergencyAlertConsent) {
      setValidationError('Explicit consent is required to receive emergency donation alerts.');
      return;
    }

    // Save profile to data store
    dataStore.saveDonorProfile({
      userId: currentUser.userId,
      displayName: displayName.trim(),
      bloodGroup,
      city,
      locality,
      approximateLocation: { latitude: 20.2882, longitude: 85.8451 },
      preferredTravelRadiusKm: travelRadius,
      availabilityStatus: 'available',
      notificationPreferences: {
        whatsapp: notifyWhatsApp,
        push: notifyPush,
        sms: false,
      },
      emergencyAlertConsent: true,
      consentUpdatedAt: new Date().toISOString(),
      profileVerificationStatus: 'phone_verified',
      lastUpdatedAt: new Date().toISOString(),
    });

    // Confetti effect
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#e11d48', '#be123c', '#fda4af'],
      });
    } catch {
      // Ignore if canvas confetti not supported
    }

    setTimeout(() => {
      navigate('/donor/dashboard');
    }, 500);
  };

  return (
    <div className="min-h-screen pb-24 px-4 pt-4 max-w-md mx-auto animate-in fade-in">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-200/60">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 p-1.5 -ml-1 rounded-lg hover:bg-stone-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Home</span>
        </button>

        <h1 className="text-sm font-extrabold text-stone-900">Become a Donor</h1>

        <div className="w-8" />
      </div>

      {/* Hero Badge */}
      <div className="p-4 bg-gradient-to-br from-rose-50 via-white to-orange-50/50 rounded-3xl border border-rose-200/80 mb-5 flex items-center gap-3.5 shadow-soft-sm">
        <div className="w-11 h-11 rounded-2xl bg-crimson-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
          <Heart className="w-6 h-6 fill-white" />
        </div>
        <div>
          <h2 className="text-sm font-extrabold text-stone-900 leading-snug">
            Join the Community Network
          </h2>
          <p className="text-[11.5px] text-stone-500 leading-snug">
            Respond to urgent requests when someone needs your blood group nearby.
          </p>
        </div>
      </div>

      {validationError && (
        <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
          <span>{validationError}</span>
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-4">
        
        {/* Name & Phone */}
        <div>
          <label className="block text-xs font-bold text-stone-800 mb-1.5">
            Your Name / Nickname *
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="e.g. Priya Sharma"
            className="w-full px-3 py-2.5 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-crimson-500 text-stone-900"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-800 mb-1.5">
            Verified Mobile Number *
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-crimson-500 text-stone-900"
              required
            />
          </div>
          <span className="text-[10px] text-stone-400 block mt-1">
            Used only for private emergency WhatsApp invites. Never displayed publicly.
          </span>
        </div>

        {/* Blood Group Grid */}
        <div>
          <label className="block text-xs font-bold text-stone-800 mb-2">
            Your Blood Group *
          </label>
          <div className="grid grid-cols-4 gap-2">
            {bloodGroups.map((group) => (
              <button
                key={group}
                type="button"
                onClick={() => setBloodGroup(group)}
                className={`py-2.5 rounded-xl font-black text-sm transition-all ${
                  bloodGroup === group
                    ? 'bg-crimson-600 text-white shadow-sm ring-2 ring-crimson-600/30'
                    : 'bg-white border border-stone-200 text-stone-800 hover:border-crimson-200'
                }`}
              >
                {group}
              </button>
            ))}
          </div>
        </div>

        {/* Location & Preferred Radius */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1.5">
              Locality
            </label>
            <input
              type="text"
              value={locality}
              onChange={(e) => setLocality(e.target.value)}
              className="w-full px-3 py-2.5 text-xs rounded-xl border border-stone-200 bg-white focus:ring-2 focus:ring-crimson-500 text-stone-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1.5">
              City
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3 py-2.5 text-xs rounded-xl border border-stone-200 bg-white focus:ring-2 focus:ring-crimson-500 text-stone-900"
            />
          </div>
        </div>

        {/* Travel Radius Slider */}
        <div>
          <div className="flex justify-between items-center text-xs font-bold text-stone-800 mb-1.5">
            <span>Preferred Travel Radius:</span>
            <span className="text-crimson-600 font-extrabold">{travelRadius} km</span>
          </div>
          <input
            type="range"
            min={2}
            max={40}
            step={1}
            value={travelRadius}
            onChange={(e) => setTravelRadius(parseInt(e.target.value, 10))}
            className="w-full accent-crimson-600"
          />
          <div className="flex justify-between text-[10px] text-stone-400">
            <span>2 km (Local)</span>
            <span>15 km (City)</span>
            <span>40 km (Wider)</span>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="p-3 bg-stone-50 border border-stone-200 rounded-2xl space-y-2">
          <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
            <BellRing className="w-3.5 h-3.5 text-crimson-600" />
            Alert Channels
          </span>
          <label className="flex items-center justify-between text-xs text-stone-700 cursor-pointer">
            <span>WhatsApp Emergency Invites</span>
            <input
              type="checkbox"
              checked={notifyWhatsApp}
              onChange={(e) => setNotifyWhatsApp(e.target.checked)}
              className="w-4 h-4 text-crimson-600 rounded"
            />
          </label>
          <label className="flex items-center justify-between text-xs text-stone-700 cursor-pointer">
            <span>In-App Push Notifications</span>
            <input
              type="checkbox"
              checked={notifyPush}
              onChange={(e) => setNotifyPush(e.target.checked)}
              className="w-4 h-4 text-crimson-600 rounded"
            />
          </label>
        </div>

        {/* Explicit Consent & Disclaimer */}
        <div className="space-y-2">
          <label className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-stone-200 cursor-pointer">
            <input
              type="checkbox"
              checked={emergencyAlertConsent}
              onChange={(e) => setEmergencyAlertConsent(e.target.checked)}
              className="mt-0.5 w-4 h-4 text-crimson-600 rounded"
              required
            />
            <span className="text-[11px] text-stone-700 leading-snug">
              I agree to receive emergency alerts when compatible blood is needed within my radius. I can pause notifications or withdraw consent at any time.
            </span>
          </label>

          <div className="p-2.5 rounded-xl bg-stone-100 text-[10.5px] text-stone-500 leading-tight">
            <strong>Medical Disclaimer:</strong> Registration does not determine clinical donor eligibility. Final eligibility is determined by the certified blood bank or hospital staff upon preliminary health screening.
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-2xl bg-crimson-600 hover:bg-crimson-700 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2"
        >
          <CheckCircle className="w-4 h-4" />
          <span>Save Donor Profile</span>
        </button>
      </form>
    </div>
  );
};
