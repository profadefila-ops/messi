import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface GalleryItem {
  id: string;
  image: string;
  year: string;
  title: string;
  achievement: string;
}

const ITEMS: GalleryItem[] = [
  {
    id: 'messi-1',
    image: 'https://pub-e7569c5a864248bbbb54a97b92d506f2.r2.dev/bar.jpeg',
    year: '2004–2021',
    title: 'FC Barcelona',
    achievement: '672 Goals · 35 Trophies',
  },
  {
    id: 'messi-2',
    image: 'https://pub-e7569c5a864248bbbb54a97b92d506f2.r2.dev/ball.jpeg',
    year: '2009',
    title: 'First Ballon d\u2019Or',
    achievement: 'The Rise Begins',
  },
  {
    id: 'messi-3',
    image: 'https://pub-e7569c5a864248bbbb54a97b92d506f2.r2.dev/download%20(1).jpeg',
    year: '2012',
    title: '91 Goals in a Year',
    achievement: 'The Impossible Record',
  },
  {
    id: 'messi-4',
    image: 'https://pub-e7569c5a864248bbbb54a97b92d506f2.r2.dev/Lionel%20Messi.jpeg',
    year: '2021',
    title: 'Copa Am\u00E9rica',
    achievement: 'Argentina Ends the Wait',
  },
  {
    id: 'messi-5',
    image: 'https://pub-e7569c5a864248bbbb54a97b92d506f2.r2.dev/Lionel%20Messi%20Argentina%202010.jpeg',
    year: '2010',
    title: 'Argentina No. 10',
    achievement: 'The Weight of a Nation',
  },
  {
    id: 'messi-6',
    image: 'https://pub-e7569c5a864248bbbb54a97b92d506f2.r2.dev/world.jpeg',
    year: '2022',
    title: 'World Cup',
    achievement: 'Champion of the World',
  },
  {
    id: 'messi-7',
    image: 'https://pub-e7569c5a864248bbbb54a97b92d506f2.r2.dev/eithf.jpeg',
    year: '2023',
    title: 'Eighth Ballon d\u2019Or',
    achievement: 'The Eternal King',
  },
];

// Editorial layout: each item has a column span, row span, and vertical offset.
// Using a 6-column grid; spans control width, offset shifts vertically for the "magazine" feel.
const LAYOUT: { col: string; offset: string; aspect: string; size: 'large' | 'medium' | 'small' }[] = [
  // Row 1
  { col: 'col-span-6 md:col-span-3', offset: 'md:mt-0',   aspect: 'aspect-[4/5]',  size: 'large' },
  { col: 'col-span-6 md:col-span-3', offset: 'md:mt-20',  aspect: 'aspect-[4/5]',  size: 'large' },
  // Row 2
  { col: 'col-span-6 md:col-span-2', offset: 'md:mt-0',   aspect: 'aspect-[3/4]',  size: 'medium' },
  { col: 'col-span-6 md:col-span-2', offset: 'md:mt-16',  aspect: 'aspect-[3/4]',  size: 'medium' },
  { col: 'col-span-6 md:col-span-2', offset: 'md:mt-4',   aspect: 'aspect-[3/4]',  size: 'medium' },
  // Row 3
  { col: 'col-span-6 md:col-span-3', offset: 'md:mt-0',   aspect: 'aspect-[4/5]',  size: 'large' },
  { col: 'col-span-6 md:col-span-3', offset: 'md:mt-24',  aspect: 'aspect-[4/5]',  size: 'large' },
];

export const MessiCarousel: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const captionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // GSAP: entrance + scroll reveals
  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Title reveal
      if (titleRef.current) {
        gsap.from(titleRef.current, {
          y: 30,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        });
      }

      // Each image reveals as it enters the viewport
      itemRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.from(el, {
          y: 80,
          opacity: 0,
          scale: 0.92,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
          delay: (i % 3) * 0.08,
        });
      });

      // Caption lines draw in after their image
      captionRefs.current.forEach((el) => {
        if (!el) return;
        gsap.from(el, {
          scaleX: 0,
          transformOrigin: 'left center',
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
  ref={sectionRef}
  className="relative w-full bg-white py-12 sm:py-36 overflow-hidden"
>
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[90vw] h-[90vw] max-w-[1400px] max-h-[1400px] rounded-full bg-[radial-gradient(circle,rgba(104,167,221,0.08)_0%,transparent_65%)] blur-[120px]" />
        <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[60vw] h-[60vw] max-w-[900px] max-h-[900px] rounded-full bg-[radial-gradient(circle,rgba(251,191,36,0.06)_0%,transparent_65%)] blur-[100px]" />
        <div className="absolute inset-0 bg-grain opacity-[0.04]" />
      </div>

      {/* ===== Header ===== */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 mb-10 sm:mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-200 bg-white/80 backdrop-blur-md mb-6 shadow-[0_2px_10px_-4px_rgba(15,23,42,0.08)]">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-900 animate-pulse" />
          <span className="text-[10px] tracking-[0.35em] uppercase font-bold text-slate-700">
            The Archive
          </span>
        </div>

        <h2
  ref={titleRef}
  className="font-display font-black text-5xl sm:text-7xl md:text-8xl text-slate-900 tracking-tight leading-[0.9] mb-8"
>
  <span className="block overflow-hidden">
    <span className="inline-block animate-title-slide-up">
      A Life in
    </span>
  </span>
  <span className="block overflow-hidden mt-2">
    <span className="inline-block animate-title-slide-up animate-title-slide-up-delay bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300 bg-clip-text text-transparent bg-[length:200%_100%] animate-title-shimmer">
      Frames
    </span>
  </span>
</h2>

{/* Gold underline accent */}
<div className="flex justify-center mt-2">
  <div className="h-[2px] w-24 bg-gradient-to-r from-transparent via-amber-400 to-transparent animate-title-line-grow" />
</div>

        <p className="max-w-xl mx-auto text-slate-500 text-sm sm:text-base leading-relaxed">
          Seven moments. One legend. Selected from two decades of the beautiful game.
        </p>
      </div>

      {/* ===== Editorial Grid ===== */}
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-6 gap-6 md:gap-8">
          {ITEMS.map((item, i) => {
            const layout = LAYOUT[i] ?? LAYOUT[0];
            return (
              <div
                key={item.id}
                className={`group ${layout.col} ${layout.offset} flex flex-col`}
              >
                {/* Image card */}
                <div
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  className={`relative ${layout.aspect} overflow-hidden rounded-xl border border-slate-200 bg-slate-100 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:shadow-[0_40px_80px_-30px_rgba(15,23,42,0.35)]`}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center select-none transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                    draggable={false}
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />

                  {/* Gold hairline inner frame — appears on hover */}
                  <div className="pointer-events-none absolute inset-[6px] rounded-lg ring-1 ring-inset ring-amber-200/0 transition-all duration-500 group-hover:ring-amber-300/60" />

                  {/* Year badge in the corner */}
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/85 backdrop-blur-md border border-white/40 shadow-[0_4px_12px_-4px_rgba(15,23,42,0.15)] transition-all duration-500 group-hover:bg-slate-900 group-hover:border-slate-900">
                    <span className="text-[10px] tracking-[0.25em] uppercase font-black text-slate-800 transition-colors duration-500 group-hover:text-amber-300">
                      {item.year}
                    </span>
                  </div>

                  {/* Bottom gradient for legibility on hover */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  {/* Hover-caption at the bottom of the image */}
                  <div className="absolute bottom-0 inset-x-0 p-5 text-left translate-y-3 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <h3 className="font-display font-bold text-lg text-white leading-tight mb-1">
                      {item.title}
                    </h3>
                    <p className="text-white/70 text-xs leading-snug">
                      {item.achievement}
                    </p>
                  </div>
                </div>

                {/* Caption line under the image */}
                <div className="mt-4 flex items-center gap-3">
                  <div
                    ref={(el) => {
                      captionRefs.current[i] = el;
                    }}
                    className="h-[1px] flex-1 bg-gradient-to-r from-slate-900 via-slate-400 to-transparent"
                  />
                  <span className="text-[10px] tracking-[0.4em] uppercase font-bold text-slate-400">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <div className="mt-2 text-slate-900 text-xs sm:text-sm font-medium tracking-wide">
                  {item.title}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ===== Closing statement ===== */}
      <div className="relative z-10 max-w-4xl mx-auto mt-28 px-6 text-center">
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-[1px] w-20 bg-gradient-to-r from-transparent to-slate-300" />
          <span className="text-[10px] tracking-[0.4em] uppercase font-bold text-slate-400">
            Est. Rosario · 1987
          </span>
          <div className="h-[1px] w-20 bg-gradient-to-l from-transparent to-slate-300" />
        </div>
        <p className="text-slate-500 text-sm sm:text-base leading-relaxed italic">
          &ldquo;Some players play the game. Others redefine it.&rdquo;
        </p>
      </div>
    </section>
  );
};