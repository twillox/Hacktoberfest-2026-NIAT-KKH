import React from 'react';
import { NavLink } from 'react-router-dom';
import { Clock, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-white/95 backdrop-blur-md border-t border-stone-200/70 px-6 py-2 z-40 flex items-center justify-around shadow-[0_-4px_20px_rgba(0,0,0,0.03)] select-none">
      {/* Home Tab */}
      <NavLink
        to="/"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center py-1 px-4 relative transition-all duration-200 ${
            isActive ? 'text-[#C81E3B] font-semibold' : 'text-stone-500 hover:text-stone-800'
          }`
        }
      >
        {({ isActive }) => (
          <>
            {/* Filled house icon matching reference image */}
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 transition-transform active:scale-90"
              fill={isActive ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth={isActive ? '0' : '2'}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 10.5L12 3l9 7.5V20a1.5 1.5 0 0 1-1.5 1.5H4.5A1.5 1.5 0 0 1 3 20v-9.5z" />
            </svg>
            <span className="text-[11px] mt-0.5 tracking-tight">Home</span>
            {isActive && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#C81E3B] mt-0.5 animate-in fade-in" />
            )}
          </>
        )}
      </NavLink>

      {/* Activity Tab */}
      <NavLink
        to="/activity"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center py-1 px-4 relative transition-all duration-200 ${
            isActive ? 'text-[#C81E3B] font-semibold' : 'text-stone-500 hover:text-stone-800'
          }`
        }
      >
        {({ isActive }) => (
          <>
            <Clock className="w-5 h-5 transition-transform active:scale-90 stroke-[1.8]" />
            <span className="text-[11px] mt-0.5 tracking-tight">Activity</span>
            {isActive && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#C81E3B] mt-0.5 animate-in fade-in" />
            )}
          </>
        )}
      </NavLink>

      {/* Profile Tab */}
      <NavLink
        to="/profile"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center py-1 px-4 relative transition-all duration-200 ${
            isActive ? 'text-[#C81E3B] font-semibold' : 'text-stone-500 hover:text-stone-800'
          }`
        }
      >
        {({ isActive }) => (
          <>
            <User className="w-5 h-5 transition-transform active:scale-90 stroke-[1.8]" />
            <span className="text-[11px] mt-0.5 tracking-tight">Profile</span>
            {isActive && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#C81E3B] mt-0.5 animate-in fade-in" />
            )}
          </>
        )}
      </NavLink>
    </nav>
  );
};
