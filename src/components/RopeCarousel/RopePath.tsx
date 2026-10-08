import React, { useMemo } from 'react';
import { generateRopeSvgPath } from './ropeMath';

interface RopePathProps {
  width: number;
  height: number;
  sag: number;
  ropeBaseY: number;
}

export const RopePath: React.FC<RopePathProps> = ({ width, sag, ropeBaseY }) => {
  const pathData = useMemo(() => {
    return generateRopeSvgPath(width, sag, ropeBaseY, 150, 100);
  }, [width, sag, ropeBaseY]);

  return (
    <svg
      className="absolute top-0 left-0 w-full h-full pointer-events-none select-none z-10"
      style={{ overflow: 'visible' }}
    >
      <defs>
        <linearGradient id="ropeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7a5b3a" />
          <stop offset="25%" stopColor="#98744d" />
          <stop offset="50%" stopColor="#b38e64" />
          <stop offset="75%" stopColor="#98744d" />
          <stop offset="100%" stopColor="#7a5b3a" />
        </linearGradient>

        <linearGradient id="ropeHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f7ddbc" />
          <stop offset="100%" stopColor="#876039" />
        </linearGradient>
      </defs>

      {/* Rope Ambient Cast Shadow */}
      <path
        d={pathData}
        fill="none"
        stroke="rgba(20, 12, 6, 0.22)"
        strokeWidth="7"
        strokeLinecap="round"
        transform="translate(0, 5)"
        filter="blur(3px)"
      />

      {/* Main Rope Twine Body */}
      <path
        d={pathData}
        fill="none"
        stroke="url(#ropeGrad)"
        strokeWidth="4.5"
        strokeLinecap="round"
      />

      {/* Twisted Twine Outer Light Strand */}
      <path
        d={pathData}
        fill="none"
        stroke="#f0d1aa"
        strokeWidth="2.2"
        strokeDasharray="6, 5"
        strokeLinecap="round"
        opacity="0.9"
      />

      {/* Twisted Twine Dark Fiber Groove */}
      <path
        d={pathData}
        fill="none"
        stroke="#482e14"
        strokeWidth="1.6"
        strokeDasharray="3, 8"
        strokeDashoffset="3"
        strokeLinecap="round"
        opacity="0.8"
      />

      {/* Subtle Specular Highlights on Rope Strands */}
      <path
        d={pathData}
        fill="none"
        stroke="#ffffff"
        strokeWidth="0.8"
        strokeDasharray="1, 8"
        strokeDashoffset="1"
        strokeLinecap="round"
        opacity="0.65"
      />
    </svg>
  );
};

