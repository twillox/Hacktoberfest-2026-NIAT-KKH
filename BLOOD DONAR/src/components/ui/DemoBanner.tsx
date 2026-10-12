import React, { useState } from 'react';
import { Sparkles, MessageSquare, ShieldCheck, Smartphone, Monitor, ChevronDown } from 'lucide-react';
import { dataStore, DEMO_USERS } from '../../services/dataStore';
import { Link } from 'react-router-dom';

interface DemoBannerProps {
  onOpenWhatsAppSimulator: () => void;
  isMockupFrame: boolean;
  onToggleMockupFrame: () => void;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({
  onOpenWhatsAppSimulator,
  isMockupFrame,
  onToggleMockupFrame,
}) => {
  const currentUser = dataStore.getCurrentUser();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="bg-[#1C1917] text-stone-200 text-xs py-2 px-3 border-b border-stone-800 flex flex-wrap items-center justify-between gap-2 z-50">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-crimson-950 text-crimson-400 border border-crimson-800 font-medium text-[11px]">
          <span className="w-1.5 h-1.5 rounded-full bg-crimson-500 animate-ping" />
          Demo Mode
        </span>

        {/* User Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-stone-800 hover:bg-stone-700 text-stone-100 transition-colors"
          >
            <span>Role:</span>
            <strong className="text-white">{currentUser.displayName}</strong>
            <span className="text-stone-400">({currentUser.roles.join(', ')})</span>
            <ChevronDown className="w-3 h-3 text-stone-400 ml-0.5" />
          </button>

          {isDropdownOpen && (
            <div className="absolute left-0 mt-1 w-64 bg-stone-900 border border-stone-700 rounded-lg shadow-xl py-1 z-50">
              <div className="px-3 py-1 text-[10px] uppercase text-stone-400 font-semibold">
                Switch Test Account
              </div>
              {Object.values(DEMO_USERS).map((user) => (
                <button
                  key={user.userId}
                  onClick={() => {
                    dataStore.setCurrentUser(user.userId);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between transition-colors ${
                    currentUser.userId === user.userId
                      ? 'bg-crimson-900/50 text-crimson-200 font-medium'
                      : 'text-stone-300 hover:bg-stone-800'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-white">{user.displayName}</div>
                    <div className="text-[10px] text-stone-400">{user.roles.join(', ')} • {user.email}</div>
                  </div>
                  {currentUser.userId === user.userId && (
                    <span className="text-crimson-400 text-xs">Active</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Tool Links */}
      <div className="flex items-center gap-2">
        {/* WhatsApp Simulator trigger */}
        <button
          onClick={onOpenWhatsAppSimulator}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950 hover:bg-emerald-900 text-emerald-400 border border-emerald-800 transition-all text-[11px]"
        >
          <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-medium">WhatsApp Sim</span>
        </button>

        {/* Gemma AI Intake shortcut */}
        <Link
          to="/assistant"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-950 hover:bg-purple-900 text-purple-300 border border-purple-800 transition-all text-[11px]"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Gemma 4 AI</span>
        </Link>

        {/* Coordinator dashboard shortcut */}
        <Link
          to="/coordinator"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-stone-800 hover:bg-stone-700 text-stone-300 transition-all text-[11px]"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-stone-400" />
          <span>Coordinator</span>
        </Link>

        {/* Toggle Phone Frame vs Full Desktop */}
        <button
          onClick={onToggleMockupFrame}
          title={isMockupFrame ? 'Expand to Fullscreen' : 'Show in iPhone Mockup Frame'}
          className="p-1 rounded-md bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors ml-1"
        >
          {isMockupFrame ? (
            <Monitor className="w-3.5 h-3.5 text-stone-300" />
          ) : (
            <Smartphone className="w-3.5 h-3.5 text-stone-300" />
          )}
        </button>
      </div>
    </div>
  );
};
