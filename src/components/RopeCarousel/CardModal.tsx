import React, { useEffect } from 'react';
import { CarouselItem } from './types';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

interface CardModalProps {
  item: CarouselItem | null;
  items: CarouselItem[];
  onClose: () => void;
  onSelect: (item: CarouselItem) => void;
}

export const CardModal: React.FC<CardModalProps> = ({
  item,
  items,
  onClose,
  onSelect,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (!item) return;
      const currentIndex = items.findIndex((i) => i.id === item.id);
      if (e.key === 'ArrowLeft') {
        const prevIndex = (currentIndex - 1 + items.length) % items.length;
        onSelect(items[prevIndex]);
      }
      if (e.key === 'ArrowRight') {
        const nextIndex = (currentIndex + 1) % items.length;
        onSelect(items[nextIndex]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [item, items, onClose, onSelect]);

  if (!item) return null;

  const currentIndex = items.findIndex((i) => i.id === item.id);
  const prevItem = items[(currentIndex - 1 + items.length) % items.length];
  const nextItem = items[(currentIndex + 1) % items.length];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-md cursor-pointer"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-4xl max-h-[90vh] bg-white dark:bg-neutral-900 rounded-[28px] overflow-hidden shadow-2xl flex flex-col md:flex-row border border-neutral-200/50 dark:border-neutral-800 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Image Showcase */}
        <div className="relative md:w-3/5 bg-neutral-950 flex items-center justify-center overflow-hidden min-h-[360px] md:min-h-[500px]">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover max-h-[80vh]"
          />

          {/* Stepper buttons */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(prevItem);
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(nextItem);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md transition-colors"
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Details Panel */}
        <div className="md:w-2/5 p-8 flex flex-col justify-between bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
          <div>
            <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mb-3">
              <span>{item.category || 'Editorial'}</span>
              <span aria-hidden="true">·</span>
              <span>{currentIndex + 1} of {items.length}</span>
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white mb-2">
              {item.title}
            </h2>

            <p className="text-base text-neutral-600 dark:text-neutral-300 font-normal leading-relaxed">
              {item.subtitle}
            </p>

            <div className="mt-8 pt-6 border-t border-neutral-100 dark:border-neutral-800 space-y-3">
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span>Suspension Physics</span>
                <span className="font-medium text-neutral-800 dark:text-neutral-200">
                  Catenary Parabolic
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span>Fixture Mechanism</span>
                <span className="font-medium text-neutral-800 dark:text-neutral-200">
                  Spring Wood Peg
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span>Interaction State</span>
                <span className="font-medium text-neutral-800 dark:text-neutral-200">
                  Pendulum Hover Shake
                </span>
              </div>
            </div>
          </div>

          <div className="pt-8 flex items-center gap-3">
            <a
              href={item.imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              Open High-Res
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
