import React from 'react';
import { Crown } from 'lucide-react';

interface NavbarProps {
  onOpenGoatModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenGoatModal }) => {
  return (
    <header className="relative z-40 w-full max-w-7xl mx-auto px-6 sm:px-8 pt-6 pb-2 flex items-center justify-between">
      {/* Zone 1: Constantly Moving Head of Messi Logo */}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className="group flex items-center gap-3.5 select-none transition-transform hover:scale-105 active:scale-95"
        title="Lionel Messi #10"
      >
        {/* Constantly Moving Animated Head Container */}
        <div className="relative animate-head-moving">
          {/* Subtle Golden Crown Aura */}
          <div className="absolute -top-2 -right-1 z-10 w-4 h-4 text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.9)]">
            <Crown className="w-4 h-4 fill-amber-300 text-amber-400" />
          </div>

          {/* Argentina Flag Golden Ring Frame */}
          <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full p-[2px] bg-gradient-to-tr from-amber-400 via-white to-[#68a7dd] shadow-[0_0_16px_rgba(104,167,221,0.6)]">
            <div className="w-full h-full rounded-full overflow-hidden bg-slate-900 border border-white/60">
              <img
                src="/images/messi_head_avatar_1791395513045.jpg"
                alt="Moving head of Lionel Messi"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top select-none pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* Text wordmark with 3 World Cup stars */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-display leading-none drop-shadow-sm">
              MESSI
            </span>
            <span className="text-[10px] text-amber-300 tracking-widest font-black">
              ★★★
            </span>
          </div>
          <span className="text-[10px] font-semibold text-white/80 tracking-widest uppercase">
            Argentina #10
          </span>
        </div>
      </a>

      {/* Zone 2: All menu text removed as requested */}
      <div className="hidden" />

      {/* Zone 3: Premium White "THE G.O.A.T" Button */}
      <button
        onClick={onOpenGoatModal}
        className="group relative overflow-hidden px-6 sm:px-7 py-3 rounded-full font-bold cursor-pointer transition-all duration-500 ease-out active:scale-[0.97] hover:scale-[1.03] bg-white"
        style={{
          boxShadow:
            '0 0 0 1px rgba(251,191,36,0.6), 0 0 0 3px rgba(255,255,255,0.9), 0 0 0 4px rgba(251,191,36,0.3), 0 10px 28px -8px rgba(11,27,46,0.35), inset 0 -2px 4px rgba(11,27,46,0.06), inset 0 1px 0 rgba(255,255,255,1)',
        }}
        title="View Lionel Messi G.O.A.T Legacy"
      >
        {/* Soft Gold Ambient Glow on Hover */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-full"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, rgba(251,191,36,0.18) 0%, transparent 70%)',
          }}
        />

        {/* Button Content */}
        <div className="relative z-10 flex items-center gap-2.5">
          {/* Mini 3D GOAT Emblem */}
          <img
            src="/images/goat_emblem_clean.png"
            alt="GOAT"
            referrerPolicy="no-referrer"
            className="w-4 h-4 object-contain group-hover:rotate-12 transition-transform duration-500"
          />

          <span className="tracking-[0.22em] uppercase font-black text-[11px] sm:text-xs font-display text-slate-900">
            The G.O.A.T
          </span>

          {/* Sol de Mayo Golden Star */}
          <span className="text-amber-500 font-black text-[10px]">★</span>
        </div>
      </button>
    </header>
  );
};