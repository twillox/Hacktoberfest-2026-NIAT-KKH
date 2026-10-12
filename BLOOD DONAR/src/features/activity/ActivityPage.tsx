import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ArrowRight, Building2, CheckCircle2 } from 'lucide-react';
import { dataStore } from '../../services/dataStore';
import { EmergencyRequest, EmergencyResponse } from '../../types';

export const ActivityPage: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = dataStore.getCurrentUser();

  const [emergencies, setEmergencies] = useState<EmergencyRequest[]>(() =>
    dataStore.getEmergencies().filter((e) => e.requesterId === currentUser.userId)
  );

  const [responses, setResponses] = useState<EmergencyResponse[]>(() =>
    dataStore.getResponsesForDonor(currentUser.userId)
  );

  useEffect(() => {
    const unsub = dataStore.subscribe(() => {
      setEmergencies(
        dataStore.getEmergencies().filter((e) => e.requesterId === currentUser.userId)
      );
      setResponses(dataStore.getResponsesForDonor(currentUser.userId));
    });
    return unsub;
  }, [currentUser]);

  return (
    <div className="min-h-screen pb-24 px-4 pt-4 max-w-md mx-auto animate-in fade-in">
      {/* Header */}
      <div className="pb-3 mb-4 border-b border-stone-200/60">
        <h1 className="text-base font-extrabold text-stone-900">Your Activity</h1>
        <p className="text-xs text-stone-500">Track your emergency requests and donor contributions</p>
      </div>

      {/* Emergency Requests Created */}
      <div className="space-y-3 mb-6">
        <h2 className="text-xs font-bold uppercase tracking-wider text-stone-700">
          Your Emergency Requests
        </h2>

        {emergencies.length === 0 ? (
          <div className="p-4 bg-white rounded-2xl border border-stone-200 text-center text-xs text-stone-400">
            No emergency requests created yet.
          </div>
        ) : (
          emergencies.map((em) => (
            <div
              key={em.emergencyId}
              onClick={() => navigate(`/emergency/${em.emergencyId}`)}
              className="p-3.5 bg-white rounded-2xl border border-stone-200 shadow-soft hover:border-crimson-200 transition-all cursor-pointer space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-black text-crimson-600">{em.bloodGroup}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                  em.status === 'active' ? 'bg-rose-100 text-rose-800' : 'bg-stone-100 text-stone-600'
                }`}>
                  {em.status}
                </span>
              </div>
              <div className="text-xs font-semibold text-stone-800">
                {em.hospitalName} ({em.unitsRequired} Units)
              </div>
              <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1 border-t border-stone-100">
                <span>{new Date(em.createdAt).toLocaleDateString()}</span>
                <span className="text-crimson-600 font-medium flex items-center gap-1">
                  View Status <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Donor Inquiries & Responses */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-stone-700">
          Donor Responses
        </h2>

        {responses.length === 0 ? (
          <div className="p-4 bg-white rounded-2xl border border-stone-200 text-center text-xs text-stone-400">
            No donor invitations or response history.
          </div>
        ) : (
          responses.map((resp) => {
            const em = dataStore.getEmergencyById(resp.emergencyId);
            return (
              <div
                key={resp.responseId}
                onClick={() => navigate('/donor/dashboard')}
                className="p-3.5 bg-white rounded-2xl border border-stone-200 shadow-soft transition-all cursor-pointer space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-800">
                    {em?.hospitalName || 'Emergency Alert'}
                  </span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-[10px]">
                    {resp.responseStatus}
                  </span>
                </div>
                <div className="text-[11px] text-stone-500">
                  Target: {em?.bloodGroup} • {new Date(resp.notifiedAt).toLocaleDateString()}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
