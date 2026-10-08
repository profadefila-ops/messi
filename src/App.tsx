import React from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { VideoSection } from './components/VideoSection';
import { RopeCurveSection } from './components/RopeCurveSection';
import { FallingImages } from './components/FallingImages';
import { MessiCarousel } from './components/MessiCarousel';
import { Footer } from './components/Footer';
import { MessiStats } from './components/MessiStats';

export default function App() {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden flex flex-col font-body text-neutral-900 select-none bg-[#68a7dd]">
      {/* Hero Atmosphere */}
      <div className="pointer-events-none absolute top-0 inset-x-0 h-screen z-0 overflow-hidden">
        <div className="absolute -top-[25%] -left-[15%] w-[75vw] h-[75vw] rounded-full bg-gradient-to-br from-white/20 via-[#8ec5f5]/30 to-transparent blur-[100px] animate-orb-1" />
        <div className="absolute -bottom-[20%] -right-[15%] w-[70vw] h-[70vw] rounded-full bg-gradient-to-tl from-[#79b4e5]/40 via-[#68a7dd]/20 to-transparent blur-[110px] animate-orb-2" />
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] rounded-full bg-[radial-gradient(circle,rgba(251,191,36,0.22)_0%,rgba(245,158,11,0.06)_50%,transparent_75%)] blur-[70px] animate-sun-radiance" />
        <div className="absolute inset-0 bg-grain opacity-25 mix-blend-overlay" />
      </div>

      {/* Hero */}
      <div className="relative z-10 w-full h-[100vh] flex flex-col justify-between overflow-hidden">
        <Navbar onOpenGoatModal={handleScrollToTop} />
        <HeroSection />
      </div>

      {/* Rope Curve Carousel — moved up ⭐ */}
      <RopeCurveSection />

      {/* Editorial Grid Carousel */}
      <MessiCarousel />

      {/* Stat Count-Up Section */}
      <MessiStats />

       {/* Falling Images with Centered Text */}
      <FallingImages />

       {/* Video Section — NEW */}

      <VideoSection />
<Footer />
    </div>
  );
}