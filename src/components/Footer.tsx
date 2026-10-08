import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CITIES = [
  { name: 'Rosario', year: '1987', note: 'Born' },
  { name: 'Barcelona', year: '2004', note: 'The Rise' },
  { name: 'Paris', year: '2021', note: 'New Chapter' },
  { name: 'Miami', year: '2023', note: 'Legacy' },
];

export const Footer: React.FC = () => {
  const footerRef = useRef<HTMLElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const messiLayerRef = useRef<HTMLHeadingElement>(null);
  const goatLayerRef = useRef<HTMLHeadingElement>(null);
  const starsRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const pathRef = useRef<HTMLDivElement>(null);
  const pathLineRef = useRef<HTMLDivElement>(null);
  const pathPulseRef = useRef<HTMLDivElement>(null);
  const returnStripRef = useRef<HTMLButtonElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);
  const cursorLineRef = useRef<HTMLDivElement>(null);

  const [hoveredReturn, setHoveredReturn] = useState(false);
  const [hoveredCity, setHoveredCity] = useState<number | null>(null);
  const [hoveredWordmark, setHoveredWordmark] = useState(false);

  // ---- GSAP entrance animations ----
  useEffect(() => {
    if (!footerRef.current) return;

    const ctx = gsap.context(() => {
      // 1. "MESSI" character reveal
      if (messiLayerRef.current) {
        const el = messiLayerRef.current;
        const text = el.textContent ?? '';
        el.innerHTML = text
          .split('')
          .map(
            (ch) =>
              `<span class="footer-char inline-block will-change-transform">${
                ch === ' ' ? '&nbsp;' : ch
              }</span>`
          )
          .join('');

        const chars = el.querySelectorAll('.footer-char');
        gsap.set(chars, { yPercent: 110, opacity: 0, rotateX: -75 });
        gsap.set(el, { overflow: 'hidden', perspective: 800 });

        gsap.to(chars, {
          yPercent: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1.4,
          stagger: 0.09,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 78%',
            toggleActions: 'play none none reverse',
          },
        });
      }

      // 2. Stars pop in
      if (starsRef.current) {
        gsap.from(starsRef.current.children, {
          scale: 0,
          opacity: 0,
          rotation: -180,
          duration: 0.9,
          stagger: 0.14,
          delay: 0.9,
          ease: 'back.out(2.4)',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 78%',
            toggleActions: 'play none none reverse',
          },
        });
      }

      // 3. Tagline word reveal
      if (taglineRef.current) {
        const tagEl = taglineRef.current;
        const tagText = tagEl.textContent ?? '';
        tagEl.innerHTML = tagText
          .split(' ')
          .map(
            (w) =>
              `<span class="inline-block overflow-hidden align-bottom"><span class="inline-block footer-tag-word">${w}&nbsp;</span></span>`
          )
          .join('');

        const words = tagEl.querySelectorAll('.footer-tag-word');
        gsap.set(words, { yPercent: 120, opacity: 0 });

        gsap.to(words, {
          yPercent: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.06,
          delay: 1.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 78%',
            toggleActions: 'play none none reverse',
          },
        });
      }

      // 4. Path rail draws + stops fade in
      if (pathLineRef.current) {
        gsap.from(pathLineRef.current, {
          scaleX: 0,
          transformOrigin: 'left center',
          duration: 1.4,
          delay: 1.3,
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 78%',
            toggleActions: 'play none none reverse',
          },
        });
      }

      if (pathRef.current) {
        gsap.from(pathRef.current.querySelectorAll('.path-stop'), {
          y: 30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.12,
          delay: 1.5,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 78%',
            toggleActions: 'play none none reverse',
          },
        });
      }

      // 5. Return strip
      if (returnStripRef.current) {
        gsap.from(returnStripRef.current, {
          y: 40,
          scale: 0.96,
          opacity: 0,
          duration: 1.1,
          delay: 1.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 78%',
            toggleActions: 'play none none reverse',
          },
        });
      }

      // 6. Bottom bar
      if (bottomBarRef.current) {
        gsap.from(bottomBarRef.current.children, {
          y: 20,
          opacity: 0,
          duration: 0.9,
          stagger: 0.12,
          delay: 1.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 78%',
            toggleActions: 'play none none reverse',
          },
        });
      }
    }, footerRef);

    return () => ctx.revert();
  }, []);

  // ---- Crossfade between MESSI and THE GOAT on hover ----
  useEffect(() => {
    if (!messiLayerRef.current || !goatLayerRef.current) return;

    const messi = messiLayerRef.current;
    const goat = goatLayerRef.current;
    const duration = 0.7;
    const ease = 'power2.inOut';

    if (hoveredWordmark) {
      gsap.to(messi, {
        opacity: 0,
        scale: 0.94,
        y: -8,
        duration,
        ease,
      });
      gsap.to(goat, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration,
        ease,
      });
    } else {
      gsap.to(messi, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration,
        ease,
      });
      gsap.to(goat, {
        opacity: 0,
        scale: 1.05,
        y: 8,
        duration,
        ease,
      });
    }
  }, [hoveredWordmark]);

  // ---- Cursor-following gold hairline ----
  useEffect(() => {
    const el = footerRef.current;
    const line = cursorLineRef.current;
    if (!el || !line) return;

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const y = e.clientY - rect.top;
      gsap.to(line, { y, duration: 0.6, ease: 'power2.out' });
    };
    const handleEnter = () => {
      gsap.to(line, { opacity: 0.6, duration: 0.4 });
    };
    const handleLeave = () => {
      gsap.to(line, { opacity: 0, duration: 0.4 });
    };

    el.addEventListener('mousemove', handleMove);
    el.addEventListener('mouseenter', handleEnter);
    el.addEventListener('mouseleave', handleLeave);
    return () => {
      el.removeEventListener('mousemove', handleMove);
      el.removeEventListener('mouseenter', handleEnter);
      el.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  // ---- Path pulse on stop hover ----
  useEffect(() => {
    const pulse = pathPulseRef.current;
    if (!pulse) return;

    if (hoveredCity === null) {
      gsap.to(pulse, { opacity: 0, duration: 0.3 });
      return;
    }

    gsap.set(pulse, { left: '0%', opacity: 1 });
    const tween = gsap.to(pulse, {
      left: '100%',
      duration: 1.8,
      ease: 'power2.inOut',
      repeat: -1,
      repeatDelay: 0.4,
    });

    // ✅ FIXED: braces make the cleanup return void, not the Tween
    return () => {
      tween.kill();
    };
  }, [hoveredCity]);

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      ref={footerRef}
      className="relative w-full pt-24 sm:pt-32 pb-10 bg-[#68a7dd] overflow-hidden"
    >
      {/* ===== Ambient background ===== */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#7bb5e3] via-[#68a7dd] to-[#3d6d99]" />
        <div
          className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[90vw] h-[50vw] max-w-[1400px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.28)_0%,transparent_65%)] blur-[130px]"
          style={{ animation: 'footerGlowPulse 8s ease-in-out infinite' }}
        />
        <div
          className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[60vw] h-[40vw] max-w-[900px] rounded-full bg-[radial-gradient(circle,rgba(251,191,36,0.22)_0%,transparent_60%)] blur-[110px]"
          style={{ animation: 'footerGoldPulse 6s ease-in-out infinite' }}
        />
        <div className="absolute inset-0 bg-grain opacity-[0.05] mix-blend-overlay" />
      </div>

      {/* ===== Cursor-following hairline ===== */}
      <div
        ref={cursorLineRef}
        className="pointer-events-none absolute left-0 right-0 h-[1px] z-0 opacity-0"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(251,191,36,0.6), transparent)',
          top: 0,
        }}
      />

      {/* ===== Floating gold particles ===== */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {Array.from({ length: 22 }).map((_, i) => {
          const r1 = Math.abs((Math.sin(i * 2.1) * 10000) % 1);
          const r2 = Math.abs((Math.sin(i * 3.7) * 10000) % 1);
          const r3 = Math.abs((Math.sin(i * 5.9) * 10000) % 1);
          return (
            <div
              key={i}
              className="absolute rounded-full bg-amber-700/40"
              style={{
                left: `${r1 * 100}%`,
                top: `${r2 * 100}%`,
                width: `${1 + r3 * 2.5}px`,
                height: `${1 + r3 * 2.5}px`,
                animation: `dust-float ${9 + r3 * 10}s ease-in-out ${r1 * 6}s infinite`,
              }}
            />
          );
        })}
      </div>

      {/* ===== Gold hairline top ===== */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-700/60 to-transparent" />

      {/* ===== Content ===== */}
      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* ===== Wordmark — MESSI ⇄ THE GOAT ===== */}
        <div
          ref={wordmarkRef}
          className="relative flex justify-center mb-6 cursor-pointer select-none"
          onMouseEnter={() => setHoveredWordmark(true)}
          onMouseLeave={() => setHoveredWordmark(false)}
        >
          <div
            className="relative flex items-center justify-center w-full"
            style={{ minHeight: 'clamp(5rem, 22vw, 20rem)' }}
          >
            {/* MESSI layer (initial visible) */}
            <h2
              ref={messiLayerRef}
              className="absolute inset-0 flex items-center justify-center font-display font-black tracking-tighter leading-[0.85]"
              style={{
                fontSize: 'clamp(5rem, 22vw, 20rem)',
              }}
            >
              <span className="bg-gradient-to-b from-amber-400 via-amber-600 to-amber-800 bg-clip-text text-transparent drop-shadow-[0_8px_30px_rgba(15,23,42,0.18)]">
                MESSI
              </span>
            </h2>

            {/* THE GOAT layer (hidden initially, crossfades in on hover) */}
            <h2
              ref={goatLayerRef}
              className="absolute inset-0 flex items-center justify-center font-display font-black tracking-tighter leading-[0.85] opacity-0"
              style={{
                fontSize: 'clamp(4rem, 17vw, 16rem)',
                transform: 'translateY(8px) scale(1.05)',
              }}
            >
              <span
                className="text-white"
                style={{
                  textShadow:
                    '0 0 40px rgba(255,255,255,0.5), 0 0 80px rgba(255,255,255,0.25)',
                }}
              >
                THE GOAT
              </span>
            </h2>
          </div>
        </div>

        {/* ===== Stars + Est. ===== */}
        <div className="flex flex-col items-center gap-3 mb-16">
          <div ref={starsRef} className="flex items-center gap-3">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="text-amber-800 text-base cursor-default transition-all duration-300 hover:scale-[1.4] hover:rotate-[20deg] hover:text-amber-600 hover:drop-shadow-[0_0_12px_rgba(251,191,36,0.9)] inline-block"
              >
                ★
              </span>
            ))}
          </div>
          <p className="text-[10px] tracking-[0.5em] uppercase font-bold text-slate-800">
            Est. Rosario · 1987
          </p>
        </div>

        {/* ===== Tagline ===== */}
        <p
          ref={taglineRef}
          className="max-w-2xl mx-auto text-center text-slate-800 text-base sm:text-lg leading-relaxed font-light mb-20"
        >
          Two decades. One legend. A story that will never be repeated.
        </p>

        {/* ===== Signature path ===== */}
        <div ref={pathRef} className="relative mb-24">
          <div className="hidden sm:block">
            <div className="relative h-24">
              <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-amber-900/20" />
              <div
                ref={pathLineRef}
                className="absolute top-1/2 left-0 right-0 h-[1px] bg-gradient-to-r from-amber-700/70 via-amber-700/70 to-amber-900/70"
              />
              <div
                ref={pathPulseRef}
                className="pointer-events-none absolute top-1/2 -translate-y-1/2 w-16 h-[3px] rounded-full opacity-0"
                style={{
                  background:
                    'linear-gradient(90deg, transparent, rgba(251,191,36,0.95), transparent)',
                  filter: 'blur(0.5px)',
                  boxShadow: '0 0 12px rgba(251,191,36,0.9)',
                }}
              />

              <div className="absolute inset-0 flex items-center justify-between">
                {CITIES.map((city, i) => {
                  const isActive = hoveredCity === i;
                  const isLast = i === CITIES.length - 1;
                  return (
                    <div
                      key={city.name}
                      className="path-stop relative flex flex-col items-center"
                      onMouseEnter={() => setHoveredCity(i)}
                      onMouseLeave={() => setHoveredCity(null)}
                    >
                      <span
                        className="absolute -top-7 text-[9px] tracking-[0.3em] uppercase font-bold text-amber-900 transition-all duration-300 whitespace-nowrap"
                        style={{
                          opacity: isActive ? 1 : 0.55,
                          transform: isActive ? 'translateY(-3px)' : 'translateY(0)',
                        }}
                      >
                        {city.year}
                      </span>

                      <div className="relative flex items-center justify-center w-3 h-3">
                        <span
                          className={`absolute inset-0 rounded-full bg-amber-600/60 ${
                            isActive ? 'animate-ping' : ''
                          }`}
                        />
                        <span
                          className={`relative rounded-full transition-all duration-300 ${
                            isLast
                              ? 'w-3 h-3 bg-amber-900 shadow-[0_0_16px_rgba(120,53,15,0.8)]'
                              : 'w-2.5 h-2.5 bg-amber-700 shadow-[0_0_10px_rgba(180,83,9,0.6)]'
                          }`}
                          style={{
                            transform: isActive ? 'scale(1.4)' : 'scale(1)',
                          }}
                        />
                      </div>

                      <span
                        className={`absolute top-6 text-[10px] tracking-[0.4em] uppercase font-black whitespace-nowrap transition-all duration-300 ${
                          isLast ? 'text-amber-900' : 'text-slate-700'
                        }`}
                        style={{
                          transform: isActive ? 'translateY(4px)' : 'translateY(0)',
                          letterSpacing: isActive ? '0.5em' : '0.4em',
                        }}
                      >
                        {city.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Mobile fallback */}
          <div className="sm:hidden flex flex-col items-center gap-6">
            {CITIES.map((city, i) => (
              <div
                key={city.name}
                className="flex flex-col items-center gap-1"
                onTouchStart={() => setHoveredCity(i)}
                onTouchEnd={() => setHoveredCity(null)}
              >
                <span className="text-[9px] tracking-[0.3em] uppercase font-bold text-amber-900">
                  {city.year}
                </span>
                <span className="text-[10px] tracking-[0.4em] uppercase font-black text-slate-700">
                  {city.name}
                </span>
                <span className="text-[9px] tracking-[0.3em] uppercase font-bold text-slate-600/70 mt-1">
                  {city.note}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ===== Return to top ===== */}
        <button
          ref={returnStripRef}
          onClick={handleScrollTop}
          onMouseEnter={() => setHoveredReturn(true)}
          onMouseLeave={() => setHoveredReturn(false)}
          aria-label="Return to top"
          className="group relative w-full flex items-center justify-between px-6 sm:px-10 py-6 sm:py-8 mb-10 rounded-2xl border border-slate-900/20 bg-white/30 backdrop-blur-md hover:bg-white/50 transition-colors duration-500 cursor-pointer overflow-hidden"
        >
          <span
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-amber-400/30 via-amber-500/20 to-transparent transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              transform: hoveredReturn ? 'translateX(0)' : 'translateX(-101%)',
            }}
          />

          <div className="relative z-10 flex items-center gap-4">
            <span className="relative flex items-center justify-center">
              <span className="absolute w-2 h-2 rounded-full bg-amber-800 animate-ping opacity-75" />
              <span className="w-2 h-2 rounded-full bg-amber-800" />
            </span>
            <span className="text-[11px] tracking-[0.4em] uppercase font-black text-slate-900 transition-all duration-500 group-hover:tracking-[0.5em]">
              Return to the beginning
            </span>
          </div>

          <div className="relative z-10 flex items-center gap-3">
            <span className="hidden sm:inline text-[10px] tracking-[0.4em] uppercase font-bold text-slate-700">
              Top
            </span>
            <span
              className="text-2xl font-black text-amber-800 transition-all duration-300 inline-block"
              style={{
                transform: hoveredReturn ? 'translateY(-8px)' : 'translateY(0)',
              }}
            >
              ↑
            </span>
          </div>
        </button>

        {/* ===== Bottom bar ===== */}
        <div
          ref={bottomBarRef}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-slate-900/20"
        >
          <p className="text-[10px] tracking-[0.3em] uppercase font-bold text-slate-700 text-center sm:text-left transition-all duration-300 hover:tracking-[0.4em] hover:text-slate-900 cursor-default">
            © {new Date().getFullYear()} The Messi Exhibit
          </p>

          <p className="text-[10px] tracking-[0.3em] uppercase font-bold text-slate-700 text-center sm:text-right transition-all duration-300 hover:tracking-[0.4em] hover:text-slate-900 cursor-default">
            Made with respect · A tribute
          </p>
        </div>

      </div>
    </footer>
  );
};