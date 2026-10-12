import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Lock, EyeOff, UserCheck } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  const navigate = useNavigate();

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

        <h1 className="text-sm font-extrabold text-stone-900">Privacy & Safety</h1>

        <div className="w-8" />
      </div>

      <div className="space-y-4 text-xs text-stone-700 leading-relaxed">
        
        {/* Banner */}
        <div className="p-4 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-sm text-emerald-900">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>Private by Design Architecture</span>
          </div>
          <p className="text-[11.5px] text-emerald-800 leading-snug">
            BloodBridge was designed to eliminate the public scraping, stalking, and spam that plagues legacy open blood lists.
          </p>
        </div>

        {/* Pillars */}
        <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-soft space-y-3">
          <div className="flex items-start gap-2.5">
            <EyeOff className="w-4 h-4 text-crimson-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-stone-900 block text-xs">No Public Donor Directories</strong>
              <span className="text-[11px] text-stone-500">
                Donor phone numbers, full names, and exact GPS coordinates are never published on web directories. Donors receive private emergency invites.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-crimson-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-stone-900 block text-xs">Data Minimization</strong>
              <span className="text-[11px] text-stone-500">
                We do not collect patient medical records, government ID cards, or sensitive diagnoses. Only the required blood group and hospital location are processed.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <UserCheck className="w-4 h-4 text-crimson-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-stone-900 block text-xs">Explicit Consent & Unsubscribe</strong>
              <span className="text-[11px] text-stone-500">
                Donors can pause emergency alerts or withdraw consent at any time from their dashboard or by replying STOP to WhatsApp notifications.
              </span>
            </div>
          </div>
        </div>

        {/* Clinical Disclaimer */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 space-y-1 text-[11px]">
          <strong className="block text-amber-950 font-bold">Medical Responsibility Disclaimer</strong>
          <p>
            BloodBridge is an emergency coordination platform, not a clinical blood bank or medical authority. We never guarantee that blood is physically in stock, that a donor is medically eligible, or that a donation will be accepted. All donations require standard on-site clinical screening by licensed healthcare personnel.
          </p>
        </div>
      </div>
    </div>
  );
};
