import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';


gsap.registerPlugin(ScrollTrigger);

interface StatItem {
  id: string;
  label: string;
  value: number;
  suffix: string;
  caption: string;
}

const STATS: StatItem[] = [
  { id: 'ballon', label: 'Ballon d\u2019Or', value: 8, suffix: '', caption: 'More than anyone in history' },
  { id: 'goals', label: 'Career Goals', value: 850, suffix: '+', caption: 'And still counting' },
  { id: 'ucl', label: 'Champions League', value: 4, suffix: '', caption: 'European crowns' },
  { id: 'worldcup', label: 'World Cup', value: 1, suffix: '', caption: 'The final piece' },
  { id: 'trophies', label: 'Major Trophies', value: 45, suffix: '+', caption: 'A cabinet beyond compare' },
];

export const MessiStats: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const statRefs = useRef<(HTMLDivElement | null)[]>([]);
  const valueRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const underlineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const captionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // ---- ScrollTrigger setup ----
  useEffect(() => {
    if (!sectionRef.current || !pinRef.current) return;

    const ctx = gsap.context(() => {
      // Set initial state for all stat elements
      statRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.set(el, { opacity: 0, y: 60, scale: 0.92 });
      });
      valueRefs.current.forEach((el) => {
        if (!el) return;
        gsap.set(el, { filter: 'blur(8px)' });
      });
      underlineRefs.current.forEach((el) => {
        if (!el) return;
        gsap.set(el, { scaleX: 0, transformOrigin: 'center' });
      });
      captionRefs.current.forEach((el) => {
        if (!el) return;
        gsap.set(el, { opacity: 0, y: 12 });
      });

      // Master timeline that will be scrubbed by scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${window.innerHeight * 3}`, // 3 screens of scroll = pin duration
          pin: pinRef.current,
          pinSpacing: true,
          scrub: 0.8, // smooth scrubbing
          anticipatePin: 1,
          onUpdate: (self) => {
            // Progress bar fill
            if (progressRef.current) {
              progressRef.current.style.transform = `scaleX(${self.progress})`;
            }
            // Rotate background grid subtly
            if (gridRef.current) {
              gridRef.current.style.transform = `rotate(${self.progress * 8}deg) scale(${1 + self.progress * 0.1})`;
            }
          },
        },
      });

      // Stagger: reveal each stat one at a time as scroll progresses
      STATS.forEach((stat, i) => {
        const statEl = statRefs.current[i];
        const valueEl = valueRefs.current[i];
        const underlineEl = underlineRefs.current[i];
        const captionEl = captionRefs.current[i];
        if (!statEl || !valueEl) return;

        // --- Card reveal ---
        tl.to(
          statEl,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: 'power3.out',
          },
          i * 0.5 // each stat starts staggered by 0.5 timeline units
        );

        // --- Number count-up (driven by timeline, using an object we mutate) ---
        const counter = { val: 0 };
        tl.to(
          counter,
          {
            val: stat.value,
            duration: 0.9,
            ease: 'power2.out',
            onUpdate: () => {
              if (valueEl) {
                valueEl.textContent = `${Math.round(counter.val)}${stat.suffix}`;
              }
            },
          },
          i * 0.5 + 0.15
        );

        // --- Un-blur number ---
        tl.to(
          valueEl,
          {
            filter: 'blur(0px)',
            duration: 0.6,
            ease: 'power2.out',
          },
          i * 0.5 + 0.15
        );

        // --- Underline draw ---
        if (underlineEl) {
          tl.to(
            underlineEl,
            {
              scaleX: 1,
              duration: 0.6,
              ease: 'power3.out',
            },
            i * 0.5 + 0.7
          );
        }

        // --- Caption reveal ---
        if (captionEl) {
          tl.to(
            captionEl,
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: 'power2.out',
            },
            i * 0.5 + 0.8
          );
        }
      });

      // Small trailing hold so the last stat settles before unpinning
      tl.to({}, { duration: 0.5 });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // ---- Magnetic hover + 3D tilt ----
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>, index: number) => {
      const el = statRefs.current[index];
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;

      gsap.to(el, {
        rotateY: dx * 10,
        rotateX: -dy * 10,
        x: dx * 8,
        y: dy * 8,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    },
    []
  );

  const handleMouseEnter = useCallback((index: number) => {
    setHoveredIndex(index);
    const el = statRefs.current[index];
    if (el) {
      gsap.to(el, { scale: 1.04, duration: 0.4, ease: 'power2.out' });
    }
  }, []);

  const handleMouseLeave = useCallback((index: number) => {
    setHoveredIndex(null);
    const el = statRefs.current[index];
    if (el) {
      gsap.to(el, {
        rotateX: 0,
        rotateY: 0,
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: 'power3.out',
      });
    }
  }, []);

  // Deterministic pseudo-random for stable trophy layout across renders
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

// Pre-generate falling trophy configuration — memoized so it never changes
const trophies = useMemo(() => {
  const TROPHY_URLS = [
    'https://pub-e7569c5a864248bbbb54a97b92d506f2.r2.dev/tro1.png',
    'https://pub-e7569c5a864248bbbb54a97b92d506f2.r2.dev/tro2.png',
  ];
  return Array.from({ length: 14 }, (_, i) => {
    const r1 = seededRandom(i * 1.3 + 1);
    const r2 = seededRandom(i * 2.7 + 5);
    const r3 = seededRandom(i * 3.9 + 11);
    const r4 = seededRandom(i * 5.3 + 17);
    const r5 = seededRandom(i * 7.1 + 23);
    return {
      id: i,
      src: TROPHY_URLS[i % TROPHY_URLS.length],
      left: 5 + r1 * 90,                 // 5–95% across viewport
      size: 32 + r2 * 40,                // 32–72px
      delay: r3 * 14,                    // 0–14s stagger
      duration: 18 + r4 * 14,            // 18–32s fall speed
      opacity: 0.15 + r2 * 0.2,          // 0.15–0.35 (very subtle)
      rotate: (r3 - 0.5) * 90,           // -45 to +45 deg tilt
      drift: (r5 - 0.5) * 180,           // horizontal drift px
    };
  });
}, []);

  return (
    <section ref={sectionRef} className="relative w-full bg-white">
      {/* Pinned container — this is what stays frozen while scrolling */}
      <div
        ref={pinRef}
        className="relative w-screen h-screen flex flex-col items-center justify-center overflow-hidden"
      >

        {/* ===== Falling Trophies — ambient atmosphere (z-0) ===== */}
<div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
  {trophies.map((t) => (
    <div
      key={t.id}
      className="absolute top-0 will-change-transform"
      style={{
        left: `${t.left}%`,
        opacity: t.opacity,
        animation: `crown-fall ${t.duration}s linear ${t.delay}s infinite`,
        ['--crown-drift' as any]: `${t.drift}px`,
        ['--crown-rotate' as any]: `${t.rotate}deg`,
      }}
    >
      <img
        src={t.src}
        alt=""
        referrerPolicy="no-referrer"
        className="object-contain select-none pointer-events-none"
        style={{
          width: `${t.size}px`,
          height: `${t.size}px`,
          filter: 'drop-shadow(0 0 8px rgba(251,191,36,0.4))',
        }}
        draggable={false}
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
    </div>
  ))}
</div>
        {/* ===== Ambient background ===== */}
        <div className="pointer-events-none absolute inset-0 z-0">
          {/* Cool radial wash */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110vw] h-[110vw] max-w-[1600px] max-h-[1600px] rounded-full bg-[radial-gradient(circle,rgba(104,167,221,0.10)_0%,transparent_65%)] blur-[130px]" />
          {/* Faint gold center */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[55vw] h-[55vw] max-w-[800px] max-h-[800px] rounded-full bg-[radial-gradient(circle,rgba(251,191,36,0.08)_0%,transparent_65%)] blur-[100px]" />

          {/* Rotating faint grid */}
          <div
            ref={gridRef}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] opacity-[0.04] will-change-transform"
            style={{
              backgroundImage:
                'linear-gradient(rgba(15,23,42,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.6) 1px, transparent 1px)',
              backgroundSize: '80px 80px',
            }}
          />

          {/* Film grain */}
          <div className="absolute inset-0 bg-grain opacity-[0.04]" />
        </div>

        {/* ===== Progress bar at the very top ===== */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-slate-200/50 z-30">
          <div
            ref={progressRef}
            className="h-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 origin-left shadow-[0_0_12px_rgba(251,191,36,0.7)]"
            style={{ transform: 'scaleX(0)', transition: 'transform 100ms linear' }}
          />
        </div>

        {/* ===== Header (fades slightly as you progress) ===== */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 mb-16 sm:mb-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-200 bg-white/80 backdrop-blur-md mb-6 shadow-[0_2px_10px_-4px_rgba(15,23,42,0.08)]">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-900 animate-pulse" />
            <span className="text-[10px] tracking-[0.35em] uppercase font-bold text-slate-700">
              The Numbers
            </span>
          </div>

          <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-slate-900 tracking-tight leading-[0.95] mb-6">
            A Career Measured
            <br />
            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent">
              In Records
            </span>
          </h2>

          <p className="max-w-xl mx-auto text-slate-500 text-sm sm:text-base leading-relaxed">
            Keep scrolling. The numbers speak for themselves.
          </p>
        </div>

        {/* ===== Stats grid ===== */}
        <div
          className="relative z-10 w-full max-w-7xl mx-auto px-6"
          style={{ perspective: '1200px' }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 sm:gap-6">
            {STATS.map((stat, i) => {
              const isHovered = hoveredIndex === i;
              return (
                <div
                  key={stat.id}
                  ref={(el) => {
                    statRefs.current[i] = el;
                  }}
                  onMouseEnter={() => handleMouseEnter(i)}
                  onMouseLeave={() => handleMouseLeave(i)}
                  onMouseMove={(e) => handleMouseMove(e, i)}
                  className="relative flex flex-col items-center text-center rounded-2xl border border-slate-200/70 bg-white/70 backdrop-blur-md px-5 py-8 will-change-transform"
                  style={{
                    transformStyle: 'preserve-3d',
                    transition: 'box-shadow 400ms ease, border-color 400ms ease',
                    boxShadow: isHovered
                      ? '0 30px 60px -20px rgba(15,23,42,0.25), 0 0 0 1px rgba(251,191,36,0.35)'
                      : '0 10px 30px -15px rgba(15,23,42,0.12)',
                    borderColor: isHovered
                      ? 'rgba(251,191,36,0.45)'
                      : 'rgba(226,232,240,0.7)',
                  }}
                >
                  {/* Hover glow ring */}
                  <div
                    className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-500"
                    style={{
                      opacity: isHovered ? 1 : 0,
                      background:
                        'radial-gradient(circle at 50% 0%, rgba(251,191,36,0.15), transparent 60%)',
                    }}
                  />

                  {/* Label */}
                  <div className="relative text-[10px] tracking-[0.4em] uppercase font-bold text-slate-500 mb-4">
                    {stat.label}
                  </div>

                  {/* Big number */}
                  <div className="relative">
                    <span
                      ref={(el) => {
                        valueRefs.current[i] = el;
                      }}
                      className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-slate-900 leading-none tabular-nums inline-block will-change-[filter]"
                    >
                      0{stat.suffix}
                    </span>

                    {/* Gold shimmer sweep while hovered */}
                    {isHovered && (
                      <div
                        className="pointer-events-none absolute inset-0 mix-blend-overlay"
                        style={{
                          background:
                            'linear-gradient(120deg, transparent 30%, rgba(251,191,36,0.6) 50%, transparent 70%)',
                          backgroundSize: '200% 100%',
                          animation: 'stat-shimmer 1.6s ease-in-out infinite',
                        }}
                      />
                    )}

                    {/* Underline */}
                    <div
                      ref={(el) => {
                        underlineRefs.current[i] = el;
                      }}
                      className="absolute -bottom-3 left-1/2 -translate-x-1/2 h-[2px] w-[80%] bg-gradient-to-r from-transparent via-amber-400 to-transparent"
                    />
                  </div>

                  {/* Caption */}
                  <div
                    ref={(el) => {
                      captionRefs.current[i] = el;
                    }}
                    className="mt-6 text-xs sm:text-sm text-slate-500 max-w-[180px] leading-snug"
                  >
                    {stat.caption}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ===== Footer hint ===== */}
        <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-4 z-10 pointer-events-none">
          <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-slate-300" />
          <span className="text-[10px] tracking-[0.4em] uppercase font-bold text-slate-400">
            Keep Scrolling
          </span>
          <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-slate-300" />
        </div>
      </div>
    </section>
  );
};