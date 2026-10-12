import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Share2,
  Building2,
  MapPin,
  Clock,
  Phone,
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
  Compass,
  MessageSquare,
} from 'lucide-react';
import { dataStore } from '../../services/dataStore';
import { EmergencyRequest, EmergencyResponse } from '../../types';

export const EmergencyDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [emergency, setEmergency] = useState<EmergencyRequest | undefined>(() =>
    id ? dataStore.getEmergencyById(id) : undefined
  );
  const [responses, setResponses] = useState<EmergencyResponse[]>(() =>
    id ? dataStore.getResponsesForEmergency(id) : []
  );
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    // Reactive listener for real-time updates
    const unsubscribe = dataStore.subscribe(() => {
      if (id) {
        setEmergency(dataStore.getEmergencyById(id));
        setResponses(dataStore.getResponsesForEmergency(id));
      }
    });
    return unsubscribe;
  }, [id]);

  if (!emergency) {
    return (
      <div className="min-h-screen p-6 text-center max-w-md mx-auto space-y-4">
        <h2 className="text-base font-bold text-stone-800">Emergency Request Not Found</h2>
        <p className="text-xs text-stone-500">The requested record may have expired or been removed.</p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-crimson-600 text-white rounded-xl text-xs font-semibold"
        >
          Return to Home
        </button>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleCancelEmergency = () => {
    if (!cancelReason.trim()) return;
    dataStore.updateEmergencyStatus(emergency.emergencyId, 'cancelled', cancelReason.trim());
    setShowCancelModal(false);
  };

  const handleMarkFulfilled = () => {
    dataStore.updateEmergencyStatus(emergency.emergencyId, 'fulfilled');
  };

  const interestedResponses = responses.filter((r) => r.responseStatus === 'interested' || r.responseStatus === 'screening_passed');

  return (
    <div className="min-h-screen pb-24 px-4 pt-4 max-w-md mx-auto animate-in fade-in">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-200/60">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 p-1.5 -ml-1 rounded-lg hover:bg-stone-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Home</span>
        </button>

        <div className="text-center">
          <span className="text-[11px] text-stone-400 font-mono">#{emergency.emergencyId.slice(-6)}</span>
          <h1 className="text-xs font-extrabold text-stone-900">Request Status</h1>
        </div>

        <button
          onClick={handleShare}
          className="p-1.5 text-stone-600 hover:text-crimson-600 rounded-lg hover:bg-stone-100 transition-colors text-xs flex items-center gap-1"
        >
          <Share2 className="w-4 h-4" />
          {copiedLink && <span className="text-[10px] text-emerald-600 font-bold">Copied!</span>}
        </button>
      </div>

      {/* Main Status Header Card */}
      <div className={`p-4 rounded-3xl mb-4 border transition-all ${
        emergency.status === 'active'
          ? 'bg-gradient-to-br from-rose-50 via-white to-orange-50/40 border-rose-200'
          : emergency.status === 'fulfilled'
          ? 'bg-emerald-50 border-emerald-200'
          : 'bg-stone-100 border-stone-200'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
            Required Blood Group
          </span>
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full uppercase ${
            emergency.status === 'active'
              ? 'bg-rose-600 text-white animate-pulse'
              : emergency.status === 'fulfilled'
              ? 'bg-emerald-700 text-white'
              : 'bg-stone-600 text-white'
          }`}>
            {emergency.status}
          </span>
        </div>

        <div className="flex items-baseline justify-between mb-3">
          <div className="text-3xl font-black text-crimson-700 font-sans tracking-tight">
            {emergency.bloodGroup}
          </div>
          <div className="text-sm font-bold text-stone-800">
            {emergency.unitsRequired} {emergency.unitsRequired === 1 ? 'Unit' : 'Units'} Needed
          </div>
        </div>

        <div className="space-y-1.5 text-xs text-stone-600 pt-2 border-t border-rose-100">
          <div className="flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
            <span className="font-semibold text-stone-900">{emergency.hospitalName}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
            <span>{emergency.locality}, {emergency.city}</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-stone-400">
            <Clock className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Submitted {new Date(emergency.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      </div>

      {/* Donor Notification & Response Summary */}
      <div className="bg-white border border-stone-200/80 rounded-2xl p-4 shadow-soft-sm mb-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-crimson-600" />
            <h2 className="text-xs font-bold text-stone-900">Donor Responses</h2>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 font-bold">
            {interestedResponses.length} Interested
          </span>
        </div>

        {responses.length === 0 ? (
          <div className="text-center py-4 text-stone-400 text-xs">
            Matching engine is evaluating active donors...
          </div>
        ) : (
          <div className="space-y-2">
            {responses.map((resp) => (
              <div
                key={resp.responseId}
                className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/70 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-stone-800 flex items-center gap-1.5">
                    <span>{resp.donorNameMasked}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-100 text-crimson-800 font-black">
                      {resp.donorBloodGroup}
                    </span>
                  </div>
                  <div className="text-[10.5px] text-stone-500">
                    {resp.distanceKm ? `~${resp.distanceKm} km away` : 'Nearby'} • {resp.screeningStatus === 'passed' ? 'Screening Completed' : 'Pending screening'}
                  </div>
                </div>

                <div>
                  {resp.responseStatus === 'interested' || resp.responseStatus === 'screening_passed' ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      <CheckCircle className="w-3 h-3" /> Interested
                    </span>
                  ) : resp.responseStatus === 'declined' ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-stone-500 bg-stone-200 px-2 py-0.5 rounded-full">
                      <XCircle className="w-3 h-3" /> Declined
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                      <AlertCircle className="w-3 h-3" /> Invited
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons: Find Blood Banks & Coordination */}
      <div className="space-y-2.5">
        <button
          onClick={() => navigate('/blood-banks')}
          className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-stone-50 border border-stone-200 text-stone-800 font-bold text-xs flex items-center justify-center gap-2 shadow-soft-sm transition-all"
        >
          <Compass className="w-4 h-4 text-crimson-600" />
          <span>Discover Verified Blood Banks Near Hospital</span>
        </button>

        {emergency.status === 'active' && (
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={handleMarkFulfilled}
              className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-sm transition-all"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Mark as Fulfilled</span>
            </button>

            <button
              onClick={() => setShowCancelModal(true)}
              className="py-2.5 rounded-xl border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold text-xs flex items-center justify-center gap-1 transition-all"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Cancel Request</span>
            </button>
          </div>
        )}
      </div>

      {/* Cancellation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-3 shadow-xl">
            <h3 className="text-sm font-bold text-stone-900">Cancel Emergency Request</h3>
            <p className="text-xs text-stone-500">
              Please state why this request is being cancelled (e.g. arranged from another source, patient discharged).
            </p>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Reason for cancellation..."
              rows={3}
              className="w-full p-2.5 text-xs border border-stone-200 rounded-xl focus:ring-2 focus:ring-crimson-500 text-stone-900"
            />
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700"
              >
                Dismiss
              </button>
              <button
                onClick={handleCancelEmergency}
                disabled={!cancelReason.trim()}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold disabled:opacity-50"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
