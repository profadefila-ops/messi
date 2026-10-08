import React, { useMemo } from 'react';

interface FallingImagesProps {}

// Image pool — reuses Messi URLs already in the site
const IMAGE_URLS = [
  'https://pub-e7569c5a864248bbbb54a97b92d506f2.r2.dev/download%20(2).jpeg',
  'https://pub-e7569c5a864248bbbb54a97b92d506f2.r2.dev/download.jpeg',
  'https://pub-e7569c5a864248bbbb54a97b92d506f2.r2.dev/download%20(1).jpeg',
  'https://pub-e7569c5a864248bbbb54a97b92d506f2.r2.dev/Lionel%20Messi.jpeg',
  'https://pub-e7569c5a864248bbbb54a97b92d506f2.r2.dev/Lionel%20Messi%20Argentina%202010.jpeg',
  'https://pub-e7569c5a864248bbbb54a97b92d506f2.r2.dev/33.jpeg',
  'https://pub-e7569c5a864248bbbb54a97b92d506f2.r2.dev/44.jpeg',
  'https://pub-e7569c5a864248bbbb54a97b92d506f2.r2.dev/de1.jpeg',
  'https://pub-e7569c5a864248bbbb54a97b92d506f2.r2.dev/de2.jpeg',
  'https://pub-e7569c5a864248bbbb54a97b92d506f2.r2.dev/de3.jpeg',
];

// Deterministic pseudo-random so layout is stable across renders
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

export const FallingImages: React.FC<FallingImagesProps> = () => {
  // Pre-generate falling image configuration
  const images = useMemo(() => {
    return Array.from({ length: 22 }, (_, i) => {
      const r1 = seededRandom(i * 1.7 + 1);
      const r2 = seededRandom(i * 2.9 + 5);
      const r3 = seededRandom(i * 4.3 + 11);
      const r4 = seededRandom(i * 6.1 + 17);
      const r5 = seededRandom(i * 8.3 + 23);
      return {
        id: i,
        src: IMAGE_URLS[i % IMAGE_URLS.length],
        left: r1 * 100,                    // 0–100% across viewport
        width: 70 + r2 * 70,               // 70–140px
        height: 90 + r2 * 90,              // 90–180px
        delay: r3 * 14,                    // 0–14s stagger
        duration: 16 + r4 * 14,            // 16–30s fall
        opacity: 0.45 + r2 * 0.35,         // 0.45–0.80
        rotate: (r3 - 0.5) * 120,          // -60 to +60 deg
        drift: (r5 - 0.5) * 220,           // horizontal drift px
        blur: r4 < 0.4 ? '1px' : '0px',    // some cards slightly blurred for depth
      };
    });
  }, []);

  return (
    <section className="relative w-full h-screen bg-[#68a7dd] overflow-hidden">
      {/* ===== Ambient backdrop ===== */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {/* Sky blue gradient based on the brand color */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#7bb5e3] via-[#68a7dd] to-[#4f8fc4]" />
        {/* Cool white glow behind text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[1200px] max-h-[1200px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.22)_0%,transparent_65%)] blur-[130px]" />
        {/* Warm gold glow behind text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] max-w-[800px] max-h-[800px] rounded-full bg-[radial-gradient(circle,rgba(251,191,36,0.20)_0%,transparent_60%)] blur-[100px]" />
        {/* Film grain */}
        <div className="absolute inset-0 bg-grain opacity-[0.06] mix-blend-overlay" />
      </div>

      {/* ===== Falling images (z-10) ===== */}
      <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
        {images.map((img) => (
          <div
            key={img.id}
            className="absolute top-0 will-change-transform"
            style={{
              left: `${img.left}%`,
              opacity: img.opacity,
              animation: `crown-fall ${img.duration}s linear ${img.delay}s infinite`,
              ['--crown-drift' as any]: `${img.drift}px`,
              ['--crown-rotate' as any]: `${img.rotate}deg`,
            }}
          >
            <div
              className="rounded-lg overflow-hidden border border-white/40 shadow-[0_8px_24px_-8px_rgba(15,23,42,0.35)]"
              style={{
                width: `${img.width}px`,
                height: `${img.height}px`,
                filter: `blur(${img.blur})`,
              }}
            >
              <img
                src={img.src}
                alt=""
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center select-none pointer-events-none"
                draggable={false}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* ===== Center content (z-20) ===== */}
      <div className="relative z-20 h-full flex items-center justify-center px-6">
        <div className="relative max-w-4xl text-center">
          {/* Decorative corner accents */}
          <div className="pointer-events-none absolute -top-8 -left-8 w-12 h-12 border-t border-l border-slate-900/30" />
          <div className="pointer-events-none absolute -top-8 -right-8 w-12 h-12 border-t border-r border-slate-900/30" />
          <div className="pointer-events-none absolute -bottom-8 -left-8 w-12 h-12 border-b border-l border-slate-900/30" />
          <div className="pointer-events-none absolute -bottom-8 -right-8 w-12 h-12 border-b border-r border-slate-900/30" />

          {/* Tag pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-900/20 bg-white/30 backdrop-blur-md mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
            <span className="text-[10px] tracking-[0.35em] uppercase font-bold text-slate-800">
              The Legacy
            </span>
          </div>

          {/* Big headline */}
          <h2 className="font-display font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-slate-900 tracking-tight leading-[0.95] mb-8">
            The Greatest
            <br />
            <span className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 bg-clip-text text-transparent">
              Of All Time
            </span>
          </h2>

          {/* Divider */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-slate-700/50" />
            <span className="text-amber-700 text-xs">★</span>
            <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-slate-700/50" />
          </div>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-slate-800/80 text-base sm:text-lg leading-relaxed font-light">
            Two decades of moments that changed the game. A legacy that will never be repeated.
          </p>

          {/* Bottom signature line */}
          <div className="mt-12 flex items-center justify-center gap-3 flex-wrap">
            <span className="text-[10px] tracking-[0.4em] uppercase font-bold text-slate-700">
              Rosario
            </span>
            <span className="text-amber-700 text-xs">→</span>
            <span className="text-[10px] tracking-[0.4em] uppercase font-bold text-slate-700">
              Barcelona
            </span>
            <span className="text-amber-700 text-xs">→</span>
            <span className="text-[10px] tracking-[0.4em] uppercase font-bold text-slate-700">
              Paris
            </span>
            <span className="text-amber-700 text-xs">→</span>
            <span className="text-[10px] tracking-[0.4em] uppercase font-bold text-amber-800">
              Miami
            </span>
          </div>
        </div>
      </div>

      {/* ===== Top-left brand mark ===== */}
      <div className="absolute top-8 left-8 z-30 pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
          <span className="text-[10px] tracking-[0.35em] uppercase font-bold text-slate-800">
            The Legend
          </span>
        </div>
      </div>

      {/* ===== Bottom hint ===== */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
        <div className="flex items-center gap-3">
          <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-slate-800/50" />
          <span className="text-[10px] tracking-[0.4em] uppercase font-bold text-slate-800/70">
            Scroll
          </span>
          <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-slate-800/50" />
        </div>
      </div>
    </section>
  );
};