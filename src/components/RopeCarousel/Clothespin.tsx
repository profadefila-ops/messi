import React from 'react';

interface ClothespinProps {
  className?: string;
  isHovered?: boolean;
}

export const Clothespin: React.FC<ClothespinProps> = ({ className = '', isHovered = false }) => {
  return (
    <div
      className={`relative pointer-events-none select-none z-30 transition-transform duration-200 ${className}`}
      style={{
        width: 32,
        height: 60,
        filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.22)) drop-shadow(0 1px 2px rgba(0, 0, 0, 0.15))',
      }}
    >
      <svg
        viewBox="0 0 32 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          {/* Wood gradient - Left prong */}
          <linearGradient id="woodLeft" x1="6" y1="0" x2="16" y2="60" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#eed0a1" />
            <stop offset="25%" stopColor="#dfb782" />
            <stop offset="60%" stopColor="#c59860" />
            <stop offset="100%" stopColor="#a97c48" />
          </linearGradient>

          {/* Wood gradient - Right prong */}
          <linearGradient id="woodRight" x1="16" y1="0" x2="26" y2="60" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f3d8ad" />
            <stop offset="30%" stopColor="#e5be8a" />
            <stop offset="70%" stopColor="#caa067" />
            <stop offset="100%" stopColor="#b3844f" />
          </linearGradient>

          {/* Metal spring gradient */}
          <linearGradient id="metalSpring" x1="10" y1="24" x2="22" y2="34" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#94a3b8" />
            <stop offset="35%" stopColor="#e2e8f0" />
            <stop offset="65%" stopColor="#64748b" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>

          {/* Inner jaw shadow */}
          <linearGradient id="jawShadow" x1="16" y1="36" x2="16" y2="58" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="rgba(0,0,0,0.3)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.05)" />
          </linearGradient>
        </defs>

        {/* Peg Cast Shadow onto Card */}
        <ellipse cx="16" cy="56" rx="8" ry="3" fill="rgba(0,0,0,0.25)" filter="blur(2px)" />

        {/* Left Wooden Leg */}
        {/* Top Handle */}
        <path
          d="M10 2 C10 1 12 0 14 0 L15.5 0 L15.5 25 L9 25 C8 15 9 5 10 2 Z"
          fill="url(#woodLeft)"
        />
        {/* Left Thumb Indent Highlight */}
        <path
          d="M9.5 8 C8.8 12 8.8 16 9.3 20"
          stroke="#fde8c8"
          strokeWidth="0.8"
          strokeLinecap="round"
          opacity="0.8"
        />

        {/* Bottom Left Clamp Jaw */}
        <path
          d="M15.5 32 L15.5 58 C15.5 59.2 14.5 60 13.5 60 L11 60 C9.8 60 9 59 9.2 57.8 L11 32 Z"
          fill="url(#woodLeft)"
        />

        {/* Right Wooden Leg */}
        {/* Top Handle */}
        <path
          d="M22 2 C22 1 20 0 18 0 L16.5 0 L16.5 25 L23 25 C24 15 23 5 22 2 Z"
          fill="url(#woodRight)"
        />
        {/* Right Highlight */}
        <path
          d="M22.5 8 C23.2 12 23.2 16 22.7 20"
          stroke="#fff0db"
          strokeWidth="0.8"
          strokeLinecap="round"
          opacity="0.9"
        />

        {/* Bottom Right Clamp Jaw */}
        <path
          d="M16.5 32 L16.5 58 C16.5 59.2 17.5 60 18.5 60 L21 60 C22.2 60 23 59 22.8 57.8 L21 32 Z"
          fill="url(#woodRight)"
        />

        {/* Center Split Seam */}
        <line x1="16" y1="2" x2="16" y2="24" stroke="#785025" strokeWidth="0.8" opacity="0.6" />
        <line x1="16" y1="33" x2="16" y2="58" stroke="#684218" strokeWidth="0.9" opacity="0.7" />

        {/* Jaw inner bevel/shadow */}
        <rect x="15" y="36" width="2" height="20" fill="url(#jawShadow)" />

        {/* Metal Coiled Spring in Middle (24 to 34px) */}
        {/* Spring wire wrapped around center pivot */}
        <circle cx="16" cy="28.5" r="5" fill="#334155" />
        <circle cx="16" cy="28.5" r="4.2" fill="url(#metalSpring)" />
        <circle cx="16" cy="28.5" r="2.2" fill="#1e293b" />

        {/* Spring wire tension arm on left */}
        <path
          d="M13.5 25 C13 20 11.5 17 11 15"
          stroke="url(#metalSpring)"
          strokeWidth="2.2"
          strokeLinecap="round"
        />

        {/* Spring wire tension arm on right */}
        <path
          d="M18.5 32 C19 38 20.5 42 21 44"
          stroke="url(#metalSpring)"
          strokeWidth="2.2"
          strokeLinecap="round"
        />

        {/* Metal Spring Wire Ring Highlight */}
        <path
          d="M13.5 27 C14 26 18 26 18.5 27"
          stroke="#ffffff"
          strokeWidth="0.9"
          strokeLinecap="round"
          opacity="0.8"
        />

        {/* Rope notch indication (where the rope rests firmly inside the jaws) */}
        <line x1="9" y1="36" x2="23" y2="36" stroke="rgba(70,40,15,0.4)" strokeWidth="1.2" />
      </svg>
    </div>
  );
};
