import React, { useState, useRef } from 'react';
import { CarouselItem, RopeConfig } from './types';
import { Clothespin } from './Clothespin';

interface CarouselCardProps {
  item: CarouselItem;
  x: number; // Center X in viewport
  y: number; // Rope suspension point Y
  baseRotation: number; // Natural rope tilt in degrees
  width: number;
  height: number;
  shakeIntensity: RopeConfig['shakeIntensity'];
  onClick: (item: CarouselItem) => void;
  onHoverChange: (isHovered: boolean) => void;
}

export const CarouselCard: React.FC<CarouselCardProps> = ({
  item,
  x,
  y,
  baseRotation,
  width,
  height,
  shakeIntensity,
  onClick,
  onHoverChange,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [shakeCount, setShakeCount] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  // Map shake intensity to rotation degree amplitude
  const shakeAmp = shakeIntensity === 'subtle' ? 2.5 : shakeIntensity === 'energetic' ? 6.5 : 4.5;

  const handleMouseEnter = () => {
    setIsHovered(true);
    setShakeCount((prev) => prev + 1);
    onHoverChange(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onHoverChange(false);
  };

  return (
    <div
      ref={cardRef}
      className="absolute select-none cursor-pointer"
      style={{
        left: x - width / 2,
        top: y - 18, // Anchor aligns with clothespin jaw clamping rope
        width,
        height,
        // The rotation pivot is pinned exactly at the clothespin jaw
        transformOrigin: '50% 18px',
        transform: `rotate(${baseRotation}deg)`,
        transition: 'transform 0.15s ease-out',
        willChange: 'transform',
        zIndex: isHovered ? 40 : 20,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onClick(item)}
    >
      {/* Wooden Clothespin pinned on top edge */}
      <div
        className="absolute left-1/2 -top-6 -translate-x-1/2 z-30"
        style={{
          transformOrigin: '50% 36px',
        }}
      >
        <Clothespin isHovered={isHovered} />
      </div>

      {/* Hanging Card Container with dynamic shake on hover */}
      <div
        key={`shake-${shakeCount}`}
        className={`relative w-full h-full rounded-[22px] overflow-hidden bg-white shadow-[0_16px_36px_-8px_rgba(0,0,0,0.24),_0_0_0_1px_rgba(0,0,0,0.06)] transition-all duration-300 ${
          isHovered
            ? 'shadow-[0_24px_50px_-10px_rgba(0,0,0,0.32),_0_0_0_1px_rgba(255,255,255,0.2)]'
            : ''
        }`}
        style={{
          transformOrigin: '50% 18px',
          animation: isHovered
            ? `cardWobbleShake 1.4s cubic-bezier(0.36, 0.07, 0.19, 0.97) both`
            : undefined,
          // Custom property for shake amplitude
          ['--shake-amp' as string]: `${shakeAmp}deg`,
        }}
      >
               {/* Card Media — image or video */}
        {item.mediaType === 'video' ? (
          <video
            src={item.mediaUrl}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className={`w-full h-full object-cover transition-transform duration-700 ease-out ${
              isHovered ? 'scale-105' : 'scale-100'
            }`}
          />
        ) : (
          <img
            src={item.mediaUrl}
            alt={item.title}
            draggable={false}
            className={`w-full h-full object-cover transition-transform duration-700 ease-out ${
              isHovered ? 'scale-105' : 'scale-100'
            }`}
            loading="eager"
          />
        )}

        {/* Paper texture/gloss sheen overlay */}
        <div
          className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-25"
          style={{
            backgroundImage:
              'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.8), transparent 70%)',
          }}
        />

        {/* Clothespin Jaw Indent Shadow on Card */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-4 bg-gradient-to-b from-black/25 to-transparent pointer-events-none" />

        {/* Bottom Text Gradient & Caption Overlay */}
        <div
          className={`absolute inset-x-0 bottom-0 pt-16 pb-6 px-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end transition-all duration-300 ${
            isHovered
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-2 pointer-events-none'
          }`}
        >
          {item.category && (
            <span className="text-[11px] font-medium tracking-wider uppercase text-white/60 mb-1">
              {item.category}
            </span>
          )}
          <h3 className="text-2xl font-bold tracking-tight text-white leading-tight">
            {item.title}
          </h3>
          <p className="text-sm font-normal text-white/80 mt-1 leading-snug line-clamp-1">
            {item.subtitle}
          </p>
        </div>

        {/* Subtle resting caption indicator (hint before hover) */}
        <div
          className={`absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/35 backdrop-blur-md text-[11px] font-medium text-white/90 transition-opacity duration-200 pointer-events-none ${
            isHovered ? 'opacity-0' : 'opacity-80'
          }`}
        >
          {item.title}
        </div>
      </div>
    </div>
  );
};
