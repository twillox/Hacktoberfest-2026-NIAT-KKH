import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Heart,
  Power,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Sliders,
} from 'lucide-react';
import { dataStore } from '../../services/dataStore';
import { EmergencyResponse, DonorProfile } from '../../types';

export const DonorDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = dataStore.getCurrentUser();
  const [donorProfile, setDonorProfile] = useState<DonorProfile | undefined>(() =>
    dataStore.getDonorByUserId(currentUser.userId) || dataStore.getDonors()[0]
  );

  const [responses, setResponses] = useState<EmergencyResponse[]>(() =>
    donorProfile ? dataStore.getResponsesForDonor(donorProfile.userId) : []
  );

  useEffect(() => {
    const unsub = dataStore.subscribe(() => {
      if (donorProfile) {
        setDonorProfile(dataStore.getDonorByUserId(donorProfile.userId));
        setResponses(dataStore.getResponsesForDonor(donorProfile.userId));
      }
    });
    return unsub;
  }, [donorProfile]);

  const handleToggleAvailability = () => {
    if (!donorProfile) return;
    const newStatus = donorProfile.availabilityStatus === 'available' ? 'paused' : 'available';
    dataStore.saveDonorProfile({
      ...donorProfile,
      availabilityStatus: newStatus,
      lastUpdatedAt: new Date().toISOString(),
    });
  };

  const handleQuickResponse = (responseId: string, status: 'interested' | 'declined') => {
    dataStore.updateResponseStatus(responseId, status);
    if (status === 'interested') {
      navigate(`/donor/invitation/${responseId}/screening`);
    }
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

        <h1 className="text-sm font-extrabold text-stone-900">Donor Dashboard</h1>

        <button
          onClick={() => navigate('/donor/register')}
          className="text-stone-600 hover:text-crimson-600 p-1"
          title="Edit Profile"
        >
          <Sliders className="w-4 h-4" />
        </button>
      </div>

      {/* Donor Status Card */}
      {donorProfile && (
        <div className="bg-white rounded-3xl border border-stone-200/80 p-4 shadow-soft mb-4 space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-crimson-600 text-white font-black text-lg flex items-center justify-center shadow-sm">
                {donorProfile.bloodGroup}
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-stone-900">
                  {donorProfile.displayName}
                </h2>
                <div className="text-[11px] text-stone-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-stone-400" />
                  <span>{donorProfile.locality || donorProfile.city} • Radius {donorProfile.preferredTravelRadiusKm}km</span>
                </div>
              </div>
            </div>

            {/* Availability Toggle */}
            <button
              onClick={handleToggleAvailability}
              className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${
                donorProfile.availabilityStatus === 'available'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  : 'bg-stone-200 text-stone-600'
              }`}
            >
              <Power className="w-3.5 h-3.5" />
              <span>{donorProfile.availabilityStatus === 'available' ? 'Active' : 'Paused'}</span>
            </button>
          </div>

          <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-between text-xs text-stone-600">
            <span className="flex items-center gap-1.5 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Verified Contact Number
            </span>
            <span className="text-[11px] text-stone-400 font-mono">
              Alerts: WhatsApp {donorProfile.notificationPreferences.whatsapp ? '✓' : '✕'}
            </span>
          </div>
        </div>
      )}

      {/* Active Emergency Invitations */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold text-stone-900 uppercase tracking-wider">
            Emergency Invitations
          </h3>
          <span className="text-[11px] text-stone-400">
            {responses.length} {responses.length === 1 ? 'Alert' : 'Alerts'}
          </span>
        </div>

        {responses.length === 0 ? (
          <div className="p-8 bg-white rounded-2xl border border-stone-200 text-center text-xs text-stone-400">
            No emergency requests currently pending near your radius.
          </div>
        ) : (
          responses.map((resp) => {
            const emergency = dataStore.getEmergencyById(resp.emergencyId);

            return (
              <div
                key={resp.responseId}
                className="bg-white rounded-2xl border border-stone-200/80 p-4 shadow-soft space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-crimson-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                      Emergency Alert
                    </span>
                    <h4 className="font-bold text-sm text-stone-900 mt-1">
                      {emergency?.hospitalName || 'Treatment Facility'}
                    </h4>
                    <div className="text-[11px] text-stone-500">
                      {emergency?.locality}, {emergency?.city} • ~{resp.distanceKm || 3.2} km away
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-lg font-black text-crimson-600">
                      {emergency?.bloodGroup || 'B+'}
                    </span>
                    <div className="text-[10px] text-stone-400">
                      {emergency?.unitsRequired || 1} units needed
                    </div>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center justify-between text-xs pt-2 border-t border-stone-100">
                  <span className="text-[11px] text-stone-500">Your Response:</span>
                  {resp.responseStatus === 'interested' ? (
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Interested
                    </span>
                  ) : resp.responseStatus === 'declined' ? (
                    <span className="font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" /> Declined
                    </span>
                  ) : (
                    <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                      Awaiting response
                    </span>
                  )}
                </div>

                {/* Actions */}
                {resp.responseStatus === 'invited' && (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => handleQuickResponse(resp.responseId, 'interested')}
                      className="py-2.5 rounded-xl bg-crimson-600 hover:bg-crimson-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1"
                    >
                      <span>I'm Interested</span>
                    </button>
                    <button
                      onClick={() => handleQuickResponse(resp.responseId, 'declined')}
                      className="py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-colors"
                    >
                      <span>Can't Donate</span>
                    </button>
                  </div>
                )}

                {resp.responseStatus === 'interested' && (
                  <div className="pt-1">
                    <button
                      onClick={() => navigate(`/donor/invitation/${resp.responseId}/screening`)}
                      className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-crimson-700 font-bold text-xs rounded-xl border border-rose-200 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>Complete Preliminary Safety Screening</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
