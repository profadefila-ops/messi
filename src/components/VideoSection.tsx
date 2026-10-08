import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Play, Pause, Volume2, VolumeX, Maximize2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const VIDEO_SRC = 'https://pub-e7569c5a864248bbbb54a97b92d506f2.r2.dev/ssstwitter.com_1791472171699.mp4';

export const VideoSection: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);

  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);

  // ---- Controls ----
  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  }, []);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    video.currentTime = x * video.duration;
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      video.requestFullscreen?.();
    }
  };

  // ---- Progress ----
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const update = () => {
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100);
      }
    };
    video.addEventListener('timeupdate', update);
    return () => video.removeEventListener('timeupdate', update);
  }, []);

  // ---- Autoplay muted when in view (and loop safely) ----
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !sectionRef.current) return;

    // Force muted before play — browsers only allow autoplay when muted
    video.muted = true;
    setIsMuted(true);

    // Try to play immediately on mount too
    video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
        } else {
          video.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // ---- GSAP scroll-driven reveal (smoother) ----
  useEffect(() => {
    if (!sectionRef.current || !pinRef.current || !frameRef.current) return;

    const ctx = gsap.context(() => {
      gsap.set(frameRef.current, {
        scale: 0.55,
        y: 30,
        opacity: 0,
        borderRadius: '32px',
      });
      gsap.set(controlsRef.current, { opacity: 0, y: 16 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${window.innerHeight * 1.6}`,
          pin: pinRef.current,
          pinSpacing: true,
          scrub: 1.2,                 // higher = smoother, more lag = silkier
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progressBarRef.current) {
              progressBarRef.current.style.transform = `scaleX(${self.progress})`;
            }
          },
        },
      });

      // Phase 1: scale up
      tl.to(
        frameRef.current,
        {
          scale: 1,
          y: 0,
          opacity: 1,
          borderRadius: '24px',
          duration: 0.6,
          ease: 'power2.out',
        },
        0
      );

      // Phase 2: controls fade in
      tl.to(
        controlsRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: 'power2.out',
        },
        0.5
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
   <section
  ref={sectionRef}
  className="relative w-full bg-white pb-24 sm:pb-32"
>
      {/* Pinned viewport */}
      <div
        ref={pinRef}
        className="relative w-screen h-screen overflow-hidden flex items-center justify-center"
      >
        {/* ===== Ambient background ===== */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute inset-0 bg-white" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[1300px] max-h-[1300px] rounded-full bg-[radial-gradient(circle,rgba(104,167,221,0.10)_0%,transparent_65%)] blur-[140px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[55vw] h-[55vw] max-w-[900px] max-h-[900px] rounded-full bg-[radial-gradient(circle,rgba(251,191,36,0.07)_0%,transparent_65%)] blur-[110px]" />
          <div className="absolute inset-0 bg-grain opacity-[0.04]" />
        </div>

        {/* ===== Progress bar ===== */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-slate-200 z-40">
          <div
            ref={progressBarRef}
            className="h-full bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300 origin-left shadow-[0_0_12px_rgba(251,191,36,0.6)]"
            style={{ transform: 'scaleX(0)' }}
          />
        </div>

        {/* ===== Animated video frame ===== */}
        <div
          ref={frameRef}
          className="relative w-[90vw] max-w-[1400px] aspect-video rounded-[24px] overflow-hidden border border-slate-200 shadow-[0_60px_140px_-40px_rgba(15,23,42,0.35)]"
          style={{ background: '#0b1220', willChange: 'transform, opacity' }}
        >
          {/* Video */}
          <video
            ref={videoRef}
            src={VIDEO_SRC}
            muted
            loop
            playsInline
            preload="auto"
            autoPlay
            className="absolute inset-0 w-full h-full object-cover"
            onClick={togglePlay}
          />

          {/* Subtle bottom gradient ONLY for controls legibility (no overlay text) */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent" />

          {/* Gold hairline inner ring */}
          <div className="pointer-events-none absolute inset-[2px] rounded-[22px] ring-1 ring-inset ring-amber-200/25" />

          {/* ===== Controls ===== */}
          <div
            ref={controlsRef}
            className="absolute bottom-0 inset-x-0 p-4 sm:p-6 z-20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Timeline scrubber */}
            <div
              className="relative h-1 bg-white/20 rounded-full overflow-hidden cursor-pointer mb-4 group/scrub"
              onClick={handleSeek}
            >
              <div
                className="h-full bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 shadow-[0_0_8px_rgba(251,191,36,0.6)] transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-amber-300 shadow-[0_0_8px_rgba(251,191,36,0.9)] opacity-0 group-hover/scrub:opacity-100 transition-opacity"
                style={{ left: `${progress}%` }}
              />
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                  className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 flex items-center justify-center transition-all duration-300 hover:scale-105 cursor-pointer"
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 text-white fill-white" />
                  ) : (
                    <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                  )}
                </button>

                <button
                  onClick={toggleMute}
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                  className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 flex items-center justify-center transition-all duration-300 hover:scale-105 cursor-pointer"
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 text-white" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-white" />
                  )}
                </button>
              </div>

              <div className="flex items-center gap-3">
                <span className="hidden sm:inline text-[10px] tracking-[0.3em] uppercase font-bold text-white/70 tabular-nums">
                  {Math.round(progress)}%
                </span>

                <button
                  onClick={toggleFullscreen}
                  aria-label="Fullscreen"
                  className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 flex items-center justify-center transition-all duration-300 hover:scale-105 cursor-pointer"
                >
                  <Maximize2 className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};