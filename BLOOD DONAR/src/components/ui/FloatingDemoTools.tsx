import React, { useState } from 'react';
import { Sparkles, MessageSquare, ShieldCheck, ChevronUp, ChevronDown, UserCheck, X } from 'lucide-react';
import { dataStore, DEMO_USERS } from '../../services/dataStore';
import { Link } from 'react-router-dom';

interface FloatingDemoToolsProps {
  onOpenWhatsAppSimulator: () => void;
}

export const FloatingDemoTools: React.FC<FloatingDemoToolsProps> = ({
  onOpenWhatsAppSimulator,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const currentUser = dataStore.getCurrentUser();

  return (
    <div className="fixed bottom-20 right-4 z-50 select-none">
      {/* Collapsed Pill Button */}
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-900/90 hover:bg-stone-900 text-white text-[11px] font-medium shadow-lg backdrop-blur-md border border-stone-700/50 transition-all hover:scale-105"
          title="Open Demo & Persona Tools"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Demo Hub</span>
          <span className="text-stone-400 text-[10px]">({currentUser.displayName.split(' ')[0]})</span>
        </button>
      ) : (
        /* Expanded Floating Popover */
        <div className="w-72 bg-stone-900/95 backdrop-blur-md text-stone-200 rounded-2xl p-3 shadow-2xl border border-stone-800 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-800">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-xs font-bold text-white">Demo Control Hub</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md text-stone-400 hover:text-white hover:bg-stone-800"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Persona Switcher */}
          <div className="mb-3">
            <div className="text-[10px] uppercase font-bold text-stone-400 mb-1.5 tracking-wider">
              Switch Test Account
            </div>
            <div className="space-y-1">
              {Object.values(DEMO_USERS).map((user) => (
                <button
                  key={user.userId}
                  onClick={() => {
                    dataStore.setCurrentUser(user.userId);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                    currentUser.userId === user.userId
                      ? 'bg-crimson-900/60 text-crimson-200 font-semibold border border-crimson-700/50'
                      : 'text-stone-300 hover:bg-stone-800/80'
                  }`}
                >
                  <div>
                    <div className="text-white text-[11.5px]">{user.displayName}</div>
                    <div className="text-[9.5px] text-stone-400 capitalize">{user.roles.join(', ')}</div>
                  </div>
                  {currentUser.userId === user.userId && (
                    <UserCheck className="w-3.5 h-3.5 text-crimson-400" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tools & Views */}
          <div className="pt-2 border-t border-stone-800 space-y-1.5">
            <button
              onClick={() => {
                onOpenWhatsAppSimulator();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-emerald-950/70 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-800/60 text-xs transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span>Launch WhatsApp Simulator</span>
            </button>

            <Link
              to="/assistant"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-purple-950/70 hover:bg-purple-900/80 text-purple-300 border border-purple-800/60 text-xs transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Gemma 4 AI Assistant</span>
            </Link>

            <Link
              to="/coordinator"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-stone-400" />
              <span>Coordinator & Audit Log</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
