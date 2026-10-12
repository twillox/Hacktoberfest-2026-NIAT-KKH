import React from 'react';

export const CommunityBannerSvg: React.FC<{ className?: string }> = ({ className = 'w-full h-28' }) => {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#FFF5F5] to-[#FEE2E2]/40 ${className}`}>
      <svg
        viewBox="0 0 500 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-cover"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Soft skyline background silhouette */}
        <g opacity="0.25">
          <rect x="30" y="80" width="25" height="60" fill="#E11D48" rx="2" />
          <rect x="60" y="65" width="20" height="75" fill="#E11D48" rx="2" />
          <rect x="85" y="90" width="30" height="50" fill="#E11D48" rx="2" />
          <rect x="195" y="75" width="24" height="65" fill="#E11D48" rx="2" />
          <rect x="225" y="55" width="28" height="85" fill="#E11D48" rx="2" />
          <rect x="260" y="80" width="22" height="60" fill="#E11D48" rx="2" />
          <rect x="380" y="70" width="30" height="70" fill="#E11D48" rx="2" />
          <rect x="415" y="60" width="25" height="80" fill="#E11D48" rx="2" />
          <rect x="445" y="85" width="35" height="55" fill="#E11D48" rx="2" />
        </g>

        {/* Soft ground / hills curve */}
        <path
          d="M0 145 C150 135, 350 155, 500 140 L500 160 L0 160 Z"
          fill="#FED7AA"
          opacity="0.3"
        />

        {/* Connecting Red Ribbon */}
        <path
          d="M130 115 Q190 125, 250 112 T370 120"
          stroke="#991B1B"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Floating blood drop at center */}
        <g transform="translate(250, 110)">
          <path
            d="M0 -22 C-6 -10, -11 -3, -11 5 C-11 11, -6 16, 0 16 C6 16, 11 11, 11 5 C11 -3, 6 -10, 0 -22 Z"
            fill="#E11D48"
          />
          <path
            d="M-2 2 C-4 0, -4 -3, -1 -8"
            stroke="#FFF"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.7"
          />
        </g>

        {/* Person 1 (Left - Male donor) */}
        <g transform="translate(100, 75)">
          {/* Head */}
          <circle cx="20" cy="15" r="10" fill="#78350F" />
          {/* Hair */}
          <path d="M10 14 C10 8, 15 5, 24 5 C28 5, 31 8, 30 14 Z" fill="#1C1917" />
          {/* Torso / Shirt */}
          <path d="M7 32 C7 26, 13 25, 20 25 C27 25, 33 26, 33 32 L35 70 L5 70 Z" fill="#DC2626" />
          {/* Arm holding ribbon */}
          <path d="M28 35 Q40 45, 48 40" stroke="#78350F" strokeWidth="4" strokeLinecap="round" fill="none" />
        </g>

        {/* Person 2 (Center - Female donor) */}
        <g transform="translate(200, 78)">
          {/* Head */}
          <circle cx="20" cy="14" r="9.5" fill="#A16207" />
          {/* Long Hair */}
          <path d="M9 14 C9 6, 15 4, 25 4 C31 4, 32 8, 32 20 C29 26, 26 30, 24 35 C20 30, 12 30, 9 20 Z" fill="#0F172A" />
          {/* Torso / Top */}
          <path d="M8 32 C8 26, 14 26, 20 26 C26 26, 32 26, 32 32 L34 70 L6 70 Z" fill="#F1F5F9" />
          {/* Arms holding ribbon */}
          <path d="M9 36 Q-5 42, -8 38" stroke="#A16207" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <path d="M30 36 Q42 42, 48 36" stroke="#A16207" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        </g>

        {/* Person 3 (Right - Male community partner) */}
        <g transform="translate(330, 75)">
          {/* Head */}
          <circle cx="20" cy="15" r="10" fill="#573318" />
          {/* Hair */}
          <path d="M10 13 C11 7, 16 5, 25 5 C29 5, 31 7, 30 13 Z" fill="#1C1917" />
          {/* Torso / Shirt */}
          <path d="M7 32 C7 26, 13 25, 20 25 C27 25, 33 26, 33 32 L35 70 L5 70 Z" fill="#78716C" />
          {/* Arm holding ribbon */}
          <path d="M12 35 Q-2 45, -10 40" stroke="#573318" strokeWidth="4" strokeLinecap="round" fill="none" />
        </g>
      </svg>
    </div>
  );
};
