import React, { useState } from 'react';
import { Bell, MapPin, Check } from 'lucide-react';
import { dataStore } from '../../services/dataStore';
import { Link } from 'react-router-dom';

interface TopBarProps {
  onOpenNotifications?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenNotifications }) => {
  const currentUser = dataStore.getCurrentUser();
  const [selectedCity, setSelectedCity] = useState('Bhubaneswar, Odisha');
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);

  const cities = [
    'Bhubaneswar, Odisha',
    'Cuttack, Odisha',
    'Hyderabad, Telangana',
    'Bengaluru, Karnataka',
    'Delhi NCR',
  ];

  return (
    <header className="px-5 pt-4 pb-1 bg-transparent select-none">
      {/* Brand & Notifications Row */}
      <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          {/* BloodBridge Teardrop Bridge Logo */}
          <svg viewBox="0 0 32 36" fill="none" className="w-7 h-8 flex-shrink-0 group-hover:scale-105 transition-transform">
            <path
              d="M16 2 C16 2, 4 14.5, 4 23 C4 29.5, 9.5 34, 16 34 C22.5 34, 28 29.5, 28 23 C28 14.5, 16 2, 16 2 Z"
              fill="#C81E3B"
            />
            {/* White suspension bridge arch lines inside */}
            <path
              d="M16 10 V30"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path
              d="M9.5 25 C11.5 19.5, 14 16.5, 16 16.5 C18 16.5, 20.5 19.5, 22.5 25"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path
              d="M11 27.5 H21"
              stroke="white"
              strokeWidth="1.4"
              strokeLinecap="round"
              opacity="0.9"
            />
          </svg>

          <div className="flex flex-col">
            <span className="font-extrabold text-[18px] tracking-tight text-[#C81E3B] leading-none">
              BLOODBRIDGE
            </span>
            <span className="text-[7.5px] font-bold tracking-[0.16em] text-stone-400 block mt-1 uppercase">
              PEOPLE · BLOOD · BRIGHTER TOMORROWS
            </span>
          </div>
        </Link>

        {/* Bell Button */}
        <button
          onClick={onOpenNotifications}
          aria-label="Notifications"
          className="p-1 -mr-1 text-stone-800 hover:text-[#C81E3B] transition-colors relative"
        >
          <Bell className="w-6 h-6 stroke-[1.8]" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#C81E3B] ring-2 ring-[#FAF7F5]" />
        </button>
      </div>

      {/* User Greeting & Location Pill Row */}
      <div className="flex items-center justify-between mt-3.5">
        {/* User Avatar + Greeting */}
        <Link to="/profile" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-full bg-[#FFEAEB] text-[#9F1239] font-extrabold text-[14px] flex items-center justify-center group-hover:scale-105 transition-transform">
            {currentUser.avatarInitials || 'AJ'}
          </div>
          <div className="text-left">
            <span className="text-[11.5px] text-stone-500 block leading-tight font-normal">
              Good morning,
            </span>
            <span className="text-[15.5px] font-extrabold text-stone-900 block leading-tight mt-0.5">
              {currentUser.displayName}
            </span>
          </div>
        </Link>

        {/* Location Pill */}
        <div className="relative">
          <button
            onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F5EFEB] hover:bg-[#EFE7E2] transition-colors text-[11.5px] font-medium text-stone-800"
          >
            <MapPin className="w-3.5 h-3.5 text-[#C81E3B] fill-[#C81E3B] flex-shrink-0" />
            <span className="truncate max-w-[130px]">{selectedCity}</span>
          </button>

          {isCityDropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-48 bg-white rounded-2xl shadow-lg border border-stone-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-1 text-[10px] font-semibold text-stone-400 uppercase tracking-wider">
                Select City
              </div>
              {cities.map((city) => (
                <button
                  key={city}
                  onClick={() => {
                    setSelectedCity(city);
                    setIsCityDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-stone-700 hover:bg-rose-50 hover:text-rose-700 flex items-center justify-between transition-colors"
                >
                  <span>{city}</span>
                  {selectedCity === city && <Check className="w-3.5 h-3.5 text-[#C81E3B]" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
