import React from 'react';

export const HeroDropBackground: React.FC = () => {
  return (
    <div className="absolute right-0 top-10 w-52 h-64 pointer-events-none select-none z-0 overflow-hidden">
      <svg viewBox="0 0 220 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Soft pastel water-drop silhouette */}
        <path
          d="M150 15 C150 15, 215 105, 215 155 C215 195, 185 225, 145 225 C105 225, 75 195, 75 155 C75 105, 150 15, 150 15 Z"
          fill="#FDF1F2"
        />
        {/* Gentle inner layer */}
        <path
          d="M150 35 C150 35, 200 110, 200 150 C200 182, 175 208, 145 208 C115 208, 90 182, 90 150 C90 110, 150 35, 150 35 Z"
          fill="#FFE8EB"
          opacity="0.45"
        />
        {/* Curving heart thread entering from left */}
        <path
          d="M75 175 C95 155, 125 145, 145 130"
          stroke="#9F1239"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
        {/* Heart emblem */}
        <path
          d="M147 127 C144 122, 137 123, 136 128 C135 133, 147 141, 147 141 C147 141, 159 133, 158 128 C157 123, 150 122, 147 127 Z"
          fill="#BE123C"
        />
        {/* Curving thread exiting downward right */}
        <path
          d="M147 141 C150 152, 180 168, 215 160"
          stroke="#9F1239"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};
