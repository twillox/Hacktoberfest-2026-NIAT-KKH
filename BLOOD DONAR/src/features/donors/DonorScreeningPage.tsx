import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Info,
  Building2,
} from 'lucide-react';
import { dataStore } from '../../services/dataStore';

export const DonorScreeningPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const response = dataStore.getResponseById(id || '');
  const emergency = response ? dataStore.getEmergencyById(response.emergencyId) : undefined;

  // Questionnaire questions
  const [donatedRecently, setDonatedRecently] = useState<boolean | null>(false);
  const [feelingWell, setFeelingWell] = useState<boolean | null>(true);
  const [hasInfection, setHasInfection] = useState<boolean | null>(false);
  const [recentTattoo, setRecentTattoo] = useState<boolean | null>(false);
  const [canTravel, setCanTravel] = useState<boolean | null>(true);
  const [acknowledgement, setAcknowledgement] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [passed, setPassed] = useState(true);

  if (!response) {
    return (
      <div className="min-h-screen p-6 text-center max-w-md mx-auto space-y-4">
        <h2 className="text-base font-bold text-stone-800">Invitation Not Found</h2>
        <button
          onClick={() => navigate('/donor/dashboard')}
          className="px-4 py-2 bg-crimson-600 text-white rounded-xl text-xs font-semibold"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check answers: if donated recently or feeling unwell or infection, needs clinical review
    const isClean = Boolean(!donatedRecently && feelingWell && !hasInfection && !recentTattoo && canTravel);
    setPassed(isClean);
    setSubmitted(true);

    dataStore.updateResponseStatus(
      response.responseId,
      'interested',
      isClean ? 'passed' : 'review_required'
    );
  };

  return (
    <div className="min-h-screen pb-24 px-4 pt-4 max-w-md mx-auto animate-in fade-in">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-200/60">
        <button
          onClick={() => navigate('/donor/dashboard')}
          className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 p-1.5 -ml-1 rounded-lg hover:bg-stone-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Dashboard</span>
        </button>

        <h1 className="text-sm font-extrabold text-stone-900">Safety Questionnaire</h1>

        <div className="w-8" />
      </div>

      {/* Emergency Target Card */}
      {emergency && (
        <div className="p-3.5 bg-rose-50/70 border border-rose-200 rounded-2xl mb-4 text-xs text-stone-800 space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-crimson-800">
            <Building2 className="w-3.5 h-3.5" />
            <span>Target: {emergency.hospitalName} ({emergency.bloodGroup})</span>
          </div>
          <div className="text-[11px] text-stone-500">
            {emergency.locality}, {emergency.city}
          </div>
        </div>
      )}

      {submitted ? (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 text-center space-y-4 shadow-soft">
          {passed ? (
            <>
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-base font-extrabold text-stone-900">
                Preliminary Screening Passed
              </h2>
              <p className="text-xs text-stone-600 leading-relaxed">
                Thank you! Your willingness has been notified to the coordination team. Please head to the hospital transfusion desk at your earliest convenience.
              </p>
            </>
          ) : (
            <>
              <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h2 className="text-base font-extrabold text-stone-900">
                Medical Consultation Needed
              </h2>
              <p className="text-xs text-stone-600 leading-relaxed">
                Based on one or more responses, the donation centre medical team will perform a direct physical assessment prior to any collection.
              </p>
            </>
          )}

          <div className="p-3 rounded-xl bg-stone-50 text-[11px] text-stone-500 border border-stone-200 leading-snug">
            <strong>Notice:</strong> This questionnaire is preliminary. Standard clinical hemoglobin tests, vitals, and blood typing will be performed on-site by certified medical staff.
          </div>

          <button
            onClick={() => navigate('/donor/dashboard')}
            className="w-full py-3 rounded-2xl bg-crimson-600 hover:bg-crimson-700 text-white font-bold text-xs"
          >
            Return to Dashboard
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Important Regulatory Disclaimer */}
          <div className="p-3 bg-stone-100 rounded-2xl border border-stone-200/80 text-[11px] text-stone-600 flex items-start gap-2">
            <Info className="w-4 h-4 text-stone-500 flex-shrink-0 mt-0.5" />
            <span>
              This self-assessment protects both your health and the recipient. It does not replace the official clinical donor screening performed by the hospital.
            </span>
          </div>

          {/* Question 1 */}
          <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-soft-sm space-y-2">
            <label className="text-xs font-bold text-stone-800 block">
              1. Have you donated whole blood within the last 90 days?
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDonatedRecently(true)}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold border ${
                  donatedRecently === true ? 'bg-crimson-600 text-white border-crimson-600' : 'bg-stone-50 border-stone-200 text-stone-700'
                }`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setDonatedRecently(false)}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold border ${
                  donatedRecently === false ? 'bg-crimson-600 text-white border-crimson-600' : 'bg-stone-50 border-stone-200 text-stone-700'
                }`}
              >
                No
              </button>
            </div>
          </div>

          {/* Question 2 */}
          <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-soft-sm space-y-2">
            <label className="text-xs font-bold text-stone-800 block">
              2. Are you feeling completely well and healthy today?
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setFeelingWell(true)}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold border ${
                  feelingWell === true ? 'bg-crimson-600 text-white border-crimson-600' : 'bg-stone-50 border-stone-200 text-stone-700'
                }`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setFeelingWell(false)}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold border ${
                  feelingWell === false ? 'bg-crimson-600 text-white border-crimson-600' : 'bg-stone-50 border-stone-200 text-stone-700'
                }`}
              >
                No
              </button>
            </div>
          </div>

          {/* Question 3 */}
          <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-soft-sm space-y-2">
            <label className="text-xs font-bold text-stone-800 block">
              3. Any fever, active infection, or antibiotic medication currently?
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setHasInfection(true)}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold border ${
                  hasInfection === true ? 'bg-crimson-600 text-white border-crimson-600' : 'bg-stone-50 border-stone-200 text-stone-700'
                }`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setHasInfection(false)}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold border ${
                  hasInfection === false ? 'bg-crimson-600 text-white border-crimson-600' : 'bg-stone-50 border-stone-200 text-stone-700'
                }`}
              >
                No
              </button>
            </div>
          </div>

          {/* Question 4 */}
          <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-soft-sm space-y-2">
            <label className="text-xs font-bold text-stone-800 block">
              4. Can you travel safely to the designated facility?
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setCanTravel(true)}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold border ${
                  canTravel === true ? 'bg-crimson-600 text-white border-crimson-600' : 'bg-stone-50 border-stone-200 text-stone-700'
                }`}
              >
                Yes, I can travel
              </button>
              <button
                type="button"
                onClick={() => setCanTravel(false)}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold border ${
                  canTravel === false ? 'bg-crimson-600 text-white border-crimson-600' : 'bg-stone-50 border-stone-200 text-stone-700'
                }`}
              >
                Need assistance
              </button>
            </div>
          </div>

          {/* Mandatory Checkbox */}
          <label className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-stone-200 cursor-pointer">
            <input
              type="checkbox"
              checked={acknowledgement}
              onChange={(e) => setAcknowledgement(e.target.checked)}
              className="mt-0.5 w-4 h-4 text-crimson-600 rounded"
              required
            />
            <span className="text-[11px] text-stone-700 leading-snug">
              I certify that I have answered honestly. I understand final eligibility is subject to physician evaluation at the donation facility.
            </span>
          </label>

          <button
            type="submit"
            disabled={!acknowledgement}
            className="w-full py-3.5 rounded-2xl bg-crimson-600 hover:bg-crimson-700 disabled:bg-stone-300 text-white font-bold text-xs shadow-md transition-all"
          >
            Submit Preliminary Answers
          </button>
        </form>
      )}
    </div>
  );
};
