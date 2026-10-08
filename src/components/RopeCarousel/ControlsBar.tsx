import React from 'react';
import { RopeConfig } from './types';
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Sliders,
  RotateCcw,
  Sparkles,
  Sun,
  Moon,
  CloudSun,
} from 'lucide-react';

interface ControlsBarProps {
  config: RopeConfig;
  onChange: (updates: Partial<RopeConfig>) => void;
  onStep: (direction: 'left' | 'right') => void;
  onReset: () => void;
}

export const ControlsBar: React.FC<ControlsBarProps> = ({
  config,
  onChange,
  onStep,
  onReset,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const isPlaying = config.speed !== 0;

  const togglePlay = () => {
    if (isPlaying) {
      onChange({ speed: 0 });
    } else {
      onChange({ speed: 1.2 });
    }
  };

  return (
    <>
      {/* Floating Bottom Quick Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 p-1.5 bg-white/85 dark:bg-neutral-900/85 backdrop-blur-xl border border-neutral-200/80 dark:border-neutral-800 rounded-full shadow-[0_12px_32px_-6px_rgba(0,0,0,0.18)]">
        {/* Step Prev */}
        <button
          onClick={() => onStep('left')}
          className="w-9 h-9 rounded-full flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          title="Scroll Left"
          aria-label="Scroll Left"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Play / Pause Toggle */}
        <button
          onClick={togglePlay}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:scale-105 active:scale-95 transition-all shadow-sm"
          title={isPlaying ? 'Pause auto-scroll' : 'Resume auto-scroll'}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 fill-current" />
          ) : (
            <Play className="w-4 h-4 fill-current ml-0.5" />
          )}
        </button>

        {/* Step Next */}
        <button
          onClick={() => onStep('right')}
          className="w-9 h-9 rounded-full flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          title="Scroll Right"
          aria-label="Scroll Right"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <div className="h-5 w-px bg-neutral-200 dark:bg-neutral-800 mx-1" />

        {/* Tuning Drawer Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            isOpen
              ? 'bg-neutral-200/80 dark:bg-neutral-800 text-neutral-900 dark:text-white'
              : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
          aria-label="Customize settings"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Physics</span>
        </button>
      </div>

      {/* Slide-out Customization Panel */}
      {isOpen && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 w-[92vw] max-w-md p-5 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-2xl border border-neutral-200/90 dark:border-neutral-800 rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
                Rope & Shake Physics
              </h4>
            </div>
            <button
              onClick={onReset}
              className="flex items-center gap-1 text-[11px] font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>

          <div className="space-y-4 text-xs">
            {/* Shake Intensity */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-medium text-neutral-700 dark:text-neutral-300">
                  Hover Shake Intensity
                </span>
                <span className="text-neutral-500 capitalize">{config.shakeIntensity}</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl">
                {(['subtle', 'medium', 'energetic'] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => onChange({ shakeIntensity: level })}
                    className={`py-1.5 text-center font-medium rounded-lg transition-all capitalize ${
                      config.shakeIntensity === level
                        ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm'
                        : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Rope Sag / Tension */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-medium text-neutral-700 dark:text-neutral-300">
                  Rope Curve Sag (Dip)
                </span>
                <span className="text-neutral-500 font-mono">{config.sag}px</span>
              </div>
              <input
                type="range"
                min="40"
                max="260"
                step="5"
                value={config.sag}
                onChange={(e) => onChange({ sag: Number(e.target.value) })}
                className="w-full accent-neutral-900 dark:accent-white cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-neutral-400 mt-0.5">
                <span>Tight Cable</span>
                <span>Deep Catenary</span>
              </div>
            </div>

            {/* Scroll Speed */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-medium text-neutral-700 dark:text-neutral-300">
                  Auto-Scroll Speed
                </span>
                <span className="text-neutral-500 font-mono">
                  {config.speed.toFixed(1)} px/f
                </span>
              </div>
              <input
                type="range"
                min="-3"
                max="3"
                step="0.2"
                value={config.speed}
                onChange={(e) => onChange({ speed: Number(e.target.value) })}
                className="w-full accent-neutral-900 dark:accent-white cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-neutral-400 mt-0.5">
                <span>Reverse</span>
                <span>Pause</span>
                <span>Forward</span>
              </div>
            </div>

            {/* Pause on Hover Option */}
            <div className="flex items-center justify-between pt-1">
              <span className="font-medium text-neutral-700 dark:text-neutral-300">
                Pause Scroll When Hovered
              </span>
              <button
                onClick={() => onChange({ pauseOnHover: !config.pauseOnHover })}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  config.pauseOnHover ? 'bg-neutral-900 dark:bg-white' : 'bg-neutral-200 dark:bg-neutral-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white dark:bg-neutral-900 shadow ring-0 transition duration-200 ease-in-out ${
                    config.pauseOnHover ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Atmosphere / Theme */}
            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <span className="block font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Atmosphere Theme
              </span>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { id: 'framer-clean', label: 'Clean', icon: Sun },
                  { id: 'sky-clouds', label: 'Sky', icon: CloudSun },
                  { id: 'editorial-warm', label: 'Warm', icon: Sparkles },
                  { id: 'twilight-dark', label: 'Dark', icon: Moon },
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => onChange({ theme: id as RopeConfig['theme'] })}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl border text-[11px] font-medium transition-all ${
                      config.theme === id
                        ? 'border-neutral-900 dark:border-white bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm'
                        : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-neutral-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
