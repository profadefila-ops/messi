import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Crown } from 'lucide-react';

interface HeroSectionProps { }

// Deterministic pseudo-random generator so crown layout is stable across renders
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

export const HeroSection: React.FC<HeroSectionProps> = () => {
  const portraitRef = useRef<HTMLDivElement>(null);
  const maskDivRef = useRef<HTMLDivElement>(null);
  const haloDivRef = useRef<HTMLDivElement>(null);

  const [isPositioned, setIsPositioned] = useState(false);

  const currentPosRef = useRef({ x: 0, y: 0 });
  const targetPosRef = useRef({ x: 0, y: 0 });
  const lastFrameTimeRef = useRef(performance.now());

  // Pre-generate crown configuration — memoized so it never changes
  const crowns = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => {
      const r1 = seededRandom(i * 1.1 + 1);
      const r2 = seededRandom(i * 2.3 + 7);
      const r3 = seededRandom(i * 3.7 + 13);
      const r4 = seededRandom(i * 5.1 + 19);
      return {
        id: i,
        left: r1 * 100,                          // 0-100% across viewport
        size: 14 + r2 * 18,                      // 14-32px
        delay: r3 * 12,                          // 0-12s stagger
        duration: 14 + r4 * 12,                  // 14-26s fall speed
        opacity: 0.3 + r2 * 0.3,                 // 0.3-0.6
        rotate: (r3 - 0.5) * 60,                 // -30 to +30 deg tilt
        drift: (r1 - 0.5) * 120,                 // horizontal drift px
      };
    });
  }, []);

  const applyMask = useCallback((x: number, y: number) => {
    const maskStr = `radial-gradient(circle 185px at ${x}px ${y}px, black 0%, rgba(0,0,0,0.96) 45%, rgba(0,0,0,0.15) 75%, transparent 100%)`;
    if (maskDivRef.current) {
      maskDivRef.current.style.maskImage = maskStr;
      maskDivRef.current.style.webkitMaskImage = maskStr;
    }
    if (haloDivRef.current) {
      haloDivRef.current.style.background = `radial-gradient(circle 195px at ${x}px ${y}px, rgba(254, 240, 138, 0.25) 0%, rgba(104, 167, 221, 0.15) 50%, transparent 100%)`;
    }
  }, []);

  useEffect(() => {
    let animId: number;
    const BASE_LERP = 0.35;

    const updateFrame = (now: number) => {
      const delta = now - lastFrameTimeRef.current;
      lastFrameTimeRef.current = now;

      const clampedDelta = Math.min(delta, 32);
      const lerpFactor = 1 - Math.pow(1 - BASE_LERP, clampedDelta / 16.67);

      const dx = targetPosRef.current.x - currentPosRef.current.x;
      const dy = targetPosRef.current.y - currentPosRef.current.y;

      if (Math.abs(dx) > 0.05 || Math.abs(dy) > 0.05) {
        currentPosRef.current = {
          x: currentPosRef.current.x + dx * lerpFactor,
          y: currentPosRef.current.y + dy * lerpFactor,
        };
        applyMask(currentPosRef.current.x, currentPosRef.current.y);
      } else if (Math.abs(dx) > 0 || Math.abs(dy) > 0) {
        currentPosRef.current = { ...targetPosRef.current };
        applyMask(currentPosRef.current.x, currentPosRef.current.y);
      }

      animId = requestAnimationFrame(updateFrame);
    };

    animId = requestAnimationFrame(updateFrame);
    return () => cancelAnimationFrame(animId);
  }, [applyMask]);

  useEffect(() => {
    const initCenter = () => {
      if (portraitRef.current) {
        const rect = portraitRef.current.getBoundingClientRect();
        const initial = {
          x: rect.width * 0.5,
          y: rect.height * 0.42,
        };

        if (!isPositioned) {
          currentPosRef.current = initial;
          applyMask(initial.x, initial.y);
          setIsPositioned(true);
        }

        targetPosRef.current = initial;
      }
    };

    initCenter();
    window.addEventListener('resize', initCenter);
    return () => window.removeEventListener('resize', initCenter);
  }, [isPositioned, applyMask]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!portraitRef.current) return;
    const rect = portraitRef.current.getBoundingClientRect();
    targetPosRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!portraitRef.current || e.touches.length === 0) return;
    const touch = e.touches[0];
    const rect = portraitRef.current.getBoundingClientRect();
    targetPosRef.current = {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    };
  }, []);

  return (
    <div
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      className="relative flex-1 w-full flex flex-col justify-between overflow-hidden select-none cursor-default"
    >
      {/* ============================================================ */}
      {/* 0. FALLING CROWNS — ambient atmosphere (z-5)                 */}
      {/* Sits above marquee bg, below portrait                        */}
      {/* ============================================================ */}
      <div className="pointer-events-none absolute inset-0 z-[5] overflow-hidden">
        {crowns.map((c) => (
          <div
            key={c.id}
            className="absolute top-0 will-change-transform"
            style={{
              left: `${c.left}%`,
              opacity: c.opacity,
              animation: `crown-fall ${c.duration}s linear ${c.delay}s infinite`,
              // CSS custom properties read by the keyframe below
              ['--crown-drift' as any]: `${c.drift}px`,
              ['--crown-rotate' as any]: `${c.rotate}deg`,
            }}
          >
            <Crown
              className="fill-amber-300 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.85)]"
              style={{ width: `${c.size}px`, height: `${c.size}px` }}
              strokeWidth={1.5}
            />
          </div>
        ))}
      </div>

      {/* ============================================================ */}
      {/* 1. ANIMATED MOVING MARQUEE                                   */}
      {/* ============================================================ */}
      <div className="absolute inset-x-0 top-[42%] sm:top-[45%] md:top-[48%] -translate-y-1/2 z-10 pointer-events-none flex flex-col gap-2 overflow-hidden select-none">
        <div className="overflow-hidden whitespace-nowrap opacity-40">
          <div
            className="animate-marquee-reverse flex items-center gap-8 text-xs sm:text-sm font-bold tracking-[0.25em] text-white/90 uppercase font-mono"
            style={{ animationDuration: '35s' }}
          >
            {[...Array(6)].map((_, i) => (
              <span key={i} className="flex items-center gap-6">
                <span>WORLD CHAMPION</span>
                <span className="text-amber-300">★</span>
                <span>ARGENTINA #10</span>
                <span className="text-amber-300">★</span>
                <span>G.O.A.T</span>
                <span className="text-amber-300">★</span>
                <span>8x BALLON D'OR</span>
                <span className="text-amber-300">★</span>
              </span>
            ))}
          </div>
        </div>

        <div className="overflow-hidden whitespace-nowrap py-2 sm:py-4">
          <div
            className="animate-marquee flex items-center"
            style={{ animationDuration: '45s' }}
          >
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="flex items-center shrink-0">
                <span
                  className="font-display font-black tracking-tighter text-white uppercase leading-none whitespace-nowrap select-none drop-shadow-[0_8px_32px_rgba(255,255,255,0.45)] animate-text-glow"
                  style={{ fontSize: 'clamp(4rem, 9vw, 11rem)' }}
                >
                  LIONEL ANDRES MESSI
                </span>

                <div className="inline-flex items-center justify-center mx-6 sm:mx-10 md:mx-12 shrink-0">
                  <img
                    src="/src/assets/images/goat_emblem_clean.png"
                    alt="GOAT Greatest Of All Time emblem"
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 sm:w-22 sm:h-22 md:w-28 md:h-28 lg:w-32 lg:h-32 object-contain animate-goat-gleam select-none pointer-events-none filter drop-shadow-[0_0_24px_rgba(245,158,11,0.85)]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. CENTRAL PORTRAIT                                           */}
      {/* ============================================================ */}
      <div className="relative z-20 flex-1 flex items-center justify-center pointer-events-none">
        <div
          ref={portraitRef}
          className="relative w-[820px] sm:w-[1040px] md:w-[1280px] lg:w-[1480px] xl:w-[1680px] 
          2xl:w-[1860px] h-[90vh] sm:h-[93vh] md:h-[95vh] lg:h-[98vh]
           xl:h-[100vh] flex items-center justify-center pointer-events-auto -translate-y-[8%]"
        >
          <img
            src="/src/assets/images/hero_silhouette_clean.png"
            alt="Lionel Messi raising both hands celebration silhouette"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-contain object-center pointer-events-none select-none"
          />

          <div
            ref={maskDivRef}
            className={`absolute inset-0 w-full h-full pointer-events-none select-none transition-opacity duration-300 ${isPositioned ? 'opacity-100' : 'opacity-0'
              }`}
            style={{
              WebkitMaskImage: 'radial-gradient(circle 185px at 0px 0px, transparent 0%, transparent 100%)',
              maskImage: 'radial-gradient(circle 185px at 0px 0px, transparent 0%, transparent 100%)',
            }}
          >
            <img
              src="/src/assets/images/hero_portrait_clean.png"
              alt="Lionel Messi in Argentina jersey celebrating with raised hands"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain object-center select-none"
            />

            <div
              ref={haloDivRef}
              className="absolute inset-0 pointer-events-none mix-blend-screen opacity-60"
            />
          </div>
        </div>
      </div>
    </div>
  );
};