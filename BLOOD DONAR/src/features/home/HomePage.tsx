import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ShieldCheck } from 'lucide-react';
import { HeroDropBackground } from '../../components/illustrations/HeroDropBackground';
import { CommunityBannerSvg } from '../../components/illustrations/CommunityBannerSvg';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative pb-20 px-5 pt-1 animate-in fade-in duration-300">
      {/* Background Graphic: Soft Blush Drop with Heart Thread */}
      <HeroDropBackground />

      {/* Hero Headline & Subtitle matching the reference screen */}
      <section className="relative z-10 pt-2 mb-4">
        <h1 className="text-[31px] leading-[1.1] font-black tracking-tight text-stone-900 max-w-[270px]">
          Every drop<br />
          brings{' '}
          <span className="text-[#C81E3B] font-black">
            hope.
          </span>
        </h1>
        <p className="mt-2 text-[12.5px] leading-relaxed text-stone-500 max-w-[250px]">
          Find nearby blood banks or connect with potential donors.
        </p>
      </section>

      {/* Two Main Progressive Disclosure Action Cards (Side-by-Side Grid) */}
      <section className="grid grid-cols-2 gap-3 mb-4 relative z-10">
        
        {/* Action Card 1: Find Blood */}
        <div
          onClick={() => navigate('/find-blood')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && navigate('/find-blood')}
          className="group relative bg-[#FFF1F2] hover:bg-[#FFE8EC] border border-[#FEE2E2] rounded-[24px] p-3.5 flex flex-col justify-between transition-all duration-200 cursor-pointer shadow-soft hover:shadow-soft-md active:scale-[0.98]"
        >
          {/* Top Icon Badge */}
          <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-xs mb-3 group-hover:scale-105 transition-transform">
            {/* Blood Drop Icon in Crimson */}
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-[#C81E3B]">
              <path
                d="M12 2.5C12 2.5 5 11 5 16C5 19.866 8.134 23 12 23C15.866 23 19 19.866 19 16C19 11 12 2.5 12 2.5Z"
                fill="currentColor"
              />
              <path
                d="M9 14.5C9 13.5 10 11.5 11.5 10.5"
                stroke="white"
                strokeWidth="1.75"
                strokeLinecap="round"
                opacity="0.85"
              />
            </svg>
          </div>

          {/* Texts */}
          <div className="space-y-0.5 mb-3">
            <h2 className="text-[16px] font-extrabold text-stone-900 tracking-tight leading-snug">
              Find blood
            </h2>
            <p className="text-[11px] text-stone-500 leading-snug">
              Start an emergency request.
            </p>
          </div>

          {/* Round Crimson Action Arrow */}
          <div className="w-8 h-8 rounded-full bg-[#C81E3B] group-hover:bg-[#B91C1C] text-white flex items-center justify-center shadow-sm transition-all self-start group-hover:translate-x-0.5">
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </div>
        </div>

        {/* Action Card 2: Become a Donor */}
        <div
          onClick={() => navigate('/donor/register')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && navigate('/donor/register')}
          className="group relative bg-[#FDF8F7] hover:bg-[#FAF0EE] border border-[#FDEEEA] rounded-[24px] p-3.5 flex flex-col justify-between transition-all duration-200 cursor-pointer shadow-soft hover:shadow-soft-md active:scale-[0.98]"
        >
          {/* Top Icon Badge */}
          <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-xs mb-3 group-hover:scale-105 transition-transform">
            {/* Person with heart */}
            <div className="relative text-[#C81E3B]">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 stroke-current" strokeWidth="1.8">
                <circle cx="12" cy="7" r="4" />
                <path d="M5.5 21C5.5 16.5 8.5 14 12 14C15.5 14 18.5 16.5 18.5 21" strokeLinecap="round" />
              </svg>
              {/* Red heart emblem */}
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#C81E3B] rounded-full flex items-center justify-center text-white">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-1.5 h-1.5">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Texts */}
          <div className="space-y-0.5 mb-3">
            <h2 className="text-[16px] font-extrabold text-stone-900 tracking-tight leading-snug">
              Become a donor
            </h2>
            <p className="text-[11px] text-stone-500 leading-snug">
              Be there when it matters.
            </p>
          </div>

          {/* Round Blush Action Arrow */}
          <div className="w-8 h-8 rounded-full bg-[#FCECEE] group-hover:bg-[#FCDADF] text-[#9F1239] flex items-center justify-center shadow-xs transition-all self-start group-hover:translate-x-0.5">
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </div>
        </div>

      </section>

      {/* Middle Banner & Illustration */}
      <section className="mb-3.5 space-y-2">
        <div className="space-y-0.5">
          <h3 className="text-[14.5px] font-extrabold text-stone-900 tracking-tight">
            Your impact starts here.
          </h3>
          <p className="text-[11.5px] text-stone-500 font-normal">
            A stronger community. A healthier tomorrow.
          </p>
        </div>

        {/* Community Lifeline Ribbon Illustration */}
        <CommunityBannerSvg className="w-full h-[106px] shadow-soft-sm" />
      </section>

      {/* Trust & Privacy Statement Card */}
      <section>
        <div
          onClick={() => navigate('/privacy')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && navigate('/privacy')}
          className="group flex items-center justify-between p-3 rounded-2xl bg-white hover:bg-[#FFFDFD] border border-stone-200/80 shadow-soft-sm transition-all cursor-pointer hover:border-rose-200"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white border border-rose-100 shadow-xs text-[#C81E3B] flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-4 h-4 text-[#C81E3B]" />
            </div>
            <div>
              <div className="text-[12.5px] font-bold text-stone-900 tracking-tight leading-tight">
                Private by design.
              </div>
              <div className="text-[10.5px] text-stone-500 leading-tight mt-0.5">
                Every request matters. Your information is safe with us.
              </div>
            </div>
          </div>

          <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-[#C81E3B] group-hover:translate-x-0.5 transition-all" />
        </div>
      </section>
    </div>
  );
};
