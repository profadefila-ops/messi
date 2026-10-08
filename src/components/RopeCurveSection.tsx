import React from 'react';
import { RopeCurveCarousel } from './RopeCarousel/RopeCurveCarousel';
import { CAROUSEL_ITEMS } from './RopeCarousel/items';
import type { RopeConfig, CarouselItem } from './RopeCarousel/types';

// Default config — matches the "framer-clean" theme from AI Studio
const DEFAULT_CONFIG: RopeConfig = {
  sag: 120,
  ropeY: 80,
  cardWidth: 380,     // ⬅️ was 260 — bigger cards
  cardHeight: 520,    // ⬅️ was 360 — proportionally taller
  cardGap: 440,       // ⬅️ was 320 — more space so bigger cards don't overlap
  speed: 0.6,
  shakeIntensity: 'subtle',
  pauseOnHover: true,
  theme: 'framer-clean',
};

export const RopeCurveSection: React.FC = () => {
  const handleItemSelect = (item: CarouselItem) => {
    console.log('Selected:', item);
    // Optional: open a modal, navigate, etc.
  };

  return (
    <section className="relative w-full h-screen bg-white overflow-hidden">
      <RopeCurveCarousel
        items={CAROUSEL_ITEMS}
        config={DEFAULT_CONFIG}
        onItemSelect={handleItemSelect}
      />
    </section>
  );
};