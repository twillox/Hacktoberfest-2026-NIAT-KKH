import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Phone,
  Shield,
  Trash2,
  RefreshCw,
  LogOut,
  CheckCircle,
  Sliders,
  ExternalLink,
} from 'lucide-react';
import { dataStore, DEMO_USERS } from '../../services/dataStore';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = dataStore.getCurrentUser();
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const handleReset = () => {
    dataStore.resetAll();
    setResetMessage('All demo records reset to initial state.');
    setTimeout(() => setResetMessage(null), 3000);
  };

  return (
    <div className="min-h-screen pb-24 px-4 pt-4 max-w-md mx-auto animate-in fade-in">
      
      {/* Header */}
      <div className="pb-3 mb-4 border-b border-stone-200/60">
        <h1 className="text-base font-extrabold text-stone-900">Your Profile</h1>
        <p className="text-xs text-stone-500">Manage account, privacy, and active roles</p>
      </div>

      {resetMessage && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{resetMessage}</span>
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white rounded-3xl border border-stone-200 p-5 shadow-soft mb-4 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-rose-100 text-crimson-700 font-extrabold text-lg flex items-center justify-center border border-rose-200 shadow-sm">
          {currentUser.avatarInitials || 'AJ'}
        </div>
        <div>
          <h2 className="text-base font-extrabold text-stone-900">{currentUser.displayName}</h2>
          <div className="text-xs text-stone-500">{currentUser.phoneNumber}</div>
          <div className="flex gap-1.5 mt-1.5">
            {currentUser.roles.map((r) => (
              <span
                key={r}
                className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700"
              >
                {r}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Switch Demo Role Account */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-soft mb-4 space-y-2">
        <h3 className="text-xs font-bold text-stone-800">Quick Switch Demo Persona:</h3>
        <div className="grid grid-cols-3 gap-2">
          {Object.values(DEMO_USERS).map((user) => (
            <button
              key={user.userId}
              onClick={() => {
                dataStore.setCurrentUser(user.userId);
              }}
              className={`p-2 rounded-xl text-center border text-xs transition-all ${
                currentUser.userId === user.userId
                  ? 'border-crimson-600 bg-rose-50 text-crimson-800 font-bold shadow-xs'
                  : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
              }`}
            >
              <div className="font-semibold truncate">{user.displayName.split(' ')[0]}</div>
              <div className="text-[9px] text-stone-400 capitalize">{user.roles[0]}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation Options */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-soft mb-4 divide-y divide-stone-100 text-xs">
        <button
          onClick={() => navigate('/donor/dashboard')}
          className="w-full p-3.5 flex items-center justify-between text-stone-800 hover:bg-stone-50 transition-colors"
        >
          <span className="font-semibold">Donor Control Center</span>
          <ExternalLink className="w-4 h-4 text-stone-400" />
        </button>
        <button
          onClick={() => navigate('/coordinator')}
          className="w-full p-3.5 flex items-center justify-between text-stone-800 hover:bg-stone-50 transition-colors"
        >
          <span className="font-semibold">Coordinator & Audit Dashboard</span>
          <ExternalLink className="w-4 h-4 text-stone-400" />
        </button>
        <button
          onClick={() => navigate('/privacy')}
          className="w-full p-3.5 flex items-center justify-between text-stone-800 hover:bg-stone-50 transition-colors"
        >
          <span className="font-semibold">Privacy Policy & Data Minimization</span>
          <Shield className="w-4 h-4 text-stone-400" />
        </button>
      </div>

      {/* Reset State Button */}
      <div className="pt-2">
        <button
          onClick={handleReset}
          className="w-full py-3 rounded-2xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Reset Demo Data & Records</span>
        </button>
      </div>
    </div>
  );
};
