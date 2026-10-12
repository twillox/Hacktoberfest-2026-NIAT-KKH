import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ShieldCheck,
  Activity,
  Users,
  Building2,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  RefreshCw,
} from 'lucide-react';
import { dataStore } from '../../services/dataStore';
import { EmergencyRequest, AuditEvent } from '../../types';

export const CoordinatorPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'emergencies' | 'audit'>('emergencies');
  const [emergencies, setEmergencies] = useState<EmergencyRequest[]>(() =>
    dataStore.getEmergencies()
  );
  const [auditLogs, setAuditLogs] = useState<AuditEvent[]>(() =>
    dataStore.getAuditLogs()
  );

  useEffect(() => {
    const unsub = dataStore.subscribe(() => {
      setEmergencies(dataStore.getEmergencies());
      setAuditLogs(dataStore.getAuditLogs());
    });
    return unsub;
  }, []);

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

        <h1 className="text-sm font-extrabold text-stone-900 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Coordinator Console</span>
        </h1>

        <div className="w-8" />
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="p-2.5 rounded-2xl bg-white border border-stone-200 text-center shadow-soft-sm">
          <span className="text-[10px] text-stone-400 uppercase font-semibold block">Active</span>
          <span className="text-lg font-black text-crimson-600">
            {emergencies.filter((e) => e.status === 'active').length}
          </span>
        </div>

        <div className="p-2.5 rounded-2xl bg-white border border-stone-200 text-center shadow-soft-sm">
          <span className="text-[10px] text-stone-400 uppercase font-semibold block">Donors</span>
          <span className="text-lg font-black text-stone-800">
            {dataStore.getDonors().length}
          </span>
        </div>

        <div className="p-2.5 rounded-2xl bg-white border border-stone-200 text-center shadow-soft-sm">
          <span className="text-[10px] text-stone-400 uppercase font-semibold block">Audits</span>
          <span className="text-lg font-black text-stone-800">
            {auditLogs.length}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-stone-100 p-1 rounded-xl mb-4 text-xs font-bold text-stone-600">
        <button
          onClick={() => setActiveTab('emergencies')}
          className={`flex-1 py-1.5 rounded-lg transition-all ${
            activeTab === 'emergencies' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
          }`}
        >
          Active Emergencies
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`flex-1 py-1.5 rounded-lg transition-all ${
            activeTab === 'audit' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
          }`}
        >
          Security Audit Log
        </button>
      </div>

      {activeTab === 'emergencies' ? (
        <div className="space-y-3">
          {emergencies.map((em) => (
            <div
              key={em.emergencyId}
              onClick={() => navigate(`/emergency/${em.emergencyId}`)}
              className="bg-white rounded-2xl border border-stone-200 p-3.5 shadow-soft hover:border-crimson-200 transition-all cursor-pointer space-y-2"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-crimson-600">{em.bloodGroup}</span>
                    <span className="text-xs font-bold text-stone-800">{em.unitsRequired} Units</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full uppercase font-bold bg-rose-100 text-rose-800">
                      {em.urgency}
                    </span>
                  </div>
                  <div className="text-[11.5px] text-stone-600 font-medium mt-0.5">
                    {em.hospitalName}
                  </div>
                </div>

                <span className="text-[10px] text-stone-400 font-mono">
                  {new Date(em.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-stone-500 pt-2 border-t border-stone-100">
                <span>{em.locality}, {em.city}</span>
                <span className="font-semibold text-crimson-600">
                  {em.interestedCount || 0} Donors Responded →
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Audit Log */
        <div className="space-y-2 font-mono text-[11px]">
          {auditLogs.map((log) => (
            <div
              key={log.eventId}
              className="p-2.5 bg-white rounded-xl border border-stone-200 shadow-xs space-y-1"
            >
              <div className="flex items-center justify-between text-[10px] text-stone-400">
                <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                <span className="font-bold text-stone-600">{log.action}</span>
              </div>
              <div className="text-stone-800 font-sans text-xs">
                <strong>{log.userName || log.userId}</strong>
              </div>
              {log.details && (
                <div className="text-[10px] text-stone-500 bg-stone-50 p-1.5 rounded border border-stone-100 truncate">
                  {JSON.stringify(log.details)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
