import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { CarouselItem, RopeConfig } from './types';
import { getRopePoint } from './ropeMath';
import { RopePath } from './RopePath';
import { CarouselCard } from './CarouselCard';

interface RopeCurveCarouselProps {
  items: CarouselItem[];
  config: RopeConfig;
  onItemSelect: (item: CarouselItem) => void;
  onConfigChange?: (newConfig: Partial<RopeConfig>) => void;
}

export const RopeCurveCarousel: React.FC<RopeCurveCarouselProps> = ({
  items,
  config,
  onItemSelect,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 1400, height: 700 });

  // Continuous scroll offset in pixels
  const scrollOffsetRef = useRef<number>(0);
  const [, setRenderTrigger] = useState(0);

  // Dragging state
  const isDraggingRef = useRef<boolean>(false);
  const dragStartXRef = useRef<number>(0);
  const dragStartOffsetRef = useRef<number>(0);
  const dragVelocityRef = useRef<number>(0);
  const lastPointerXRef = useRef<number>(0);
  const lastPointerTimeRef = useRef<number>(0);

  // Hover state (pause or slow down auto-scroll when inspecting a card)
  const isCardHoveredRef = useRef<boolean>(false);

  // Resize listener
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Listen for manual step events from navigation controls
  useEffect(() => {
    const handleStepEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ delta: number }>;
      if (customEvent.detail && typeof customEvent.detail.delta === 'number') {
        dragVelocityRef.current = customEvent.detail.delta / 12;
      }
    };
    window.addEventListener('rope-step', handleStepEvent);
    return () => window.removeEventListener('rope-step', handleStepEvent);
  }, []);

  // Responsive card dimensions based on screen width
  const { cardWidth, cardHeight, cardGap } = useMemo(() => {
    const w = dimensions.width;
    if (w < 640) {
      // Mobile
      return { cardWidth: 230, cardHeight: 330, cardGap: 280 };
    } else if (w < 1024) {
      // Tablet
      return { cardWidth: 270, cardHeight: 380, cardGap: 330 };
    } else {
      // Desktop
      return { cardWidth: config.cardWidth, cardHeight: config.cardHeight, cardGap: config.cardGap };
    }
  }, [dimensions.width, config.cardWidth, config.cardHeight, config.cardGap]);

  // Main animation loop (60/120 FPS requestAnimationFrame)
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1); // Clamp delta time to max 100ms
      lastTime = currentTime;

      if (!isDraggingRef.current) {
        // Apply drag inertia if any remaining velocity
        if (Math.abs(dragVelocityRef.current) > 0.05) {
          scrollOffsetRef.current += dragVelocityRef.current * dt * 60;
          dragVelocityRef.current *= Math.pow(0.92, dt * 60); // Decay factor
        } else {
          dragVelocityRef.current = 0;
          // Apply continuous auto-scroll if enabled and not hovered (or slowed down)
          if (config.speed !== 0) {
            let currentSpeed = config.speed;
            if (isCardHoveredRef.current && config.pauseOnHover) {
              currentSpeed = 0; // Paused when inspecting hovered card
            }
            scrollOffsetRef.current -= currentSpeed * (dt * 60);
          }
        }
      }

      // Re-render carousel cards with updated coordinates
      setRenderTrigger((prev) => (prev + 1) % 100000);
      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [config.speed, config.pauseOnHover]);

  // Pointer drag event handlers for mouse and touch
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    // Only left clicks or touch
    if (e.button !== 0) return;
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragStartOffsetRef.current = scrollOffsetRef.current;
    lastPointerXRef.current = e.clientX;
    lastPointerTimeRef.current = performance.now();
    dragVelocityRef.current = 0;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const now = performance.now();
    const dt = Math.max((now - lastPointerTimeRef.current) / 1000, 0.001);
    const deltaX = e.clientX - lastPointerXRef.current;

    // Calculate instantaneous velocity (pixels per frame)
    dragVelocityRef.current = (deltaX / dt) / 60;

    lastPointerXRef.current = e.clientX;
    lastPointerTimeRef.current = now;

    const totalDrag = e.clientX - dragStartXRef.current;
    scrollOffsetRef.current = dragStartOffsetRef.current + totalDrag;
  }, []);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
  }, []);

  // Wheel horizontal scroll support
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) > 2 || Math.abs(e.deltaY) > 2) {
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      scrollOffsetRef.current -= delta * 0.8;
      dragVelocityRef.current = -delta * 0.2;
    }
  }, []);

  // Calculate visible slots across the infinite loop
  const totalItems = items.length;
  const currentOffset = scrollOffsetRef.current;
  const W = dimensions.width;
  const buffer = cardWidth * 1.5;

  const minSlot = Math.floor((-buffer - currentOffset) / cardGap);
  const maxSlot = Math.ceil((W + buffer - currentOffset) / cardGap);

  const visibleCards = useMemo(() => {
    if (totalItems === 0) return [];
    const cards = [];

    for (let slot = minSlot; slot <= maxSlot; slot++) {
      const x = slot * cardGap + currentOffset;
      // Get the corresponding item index wrapping infinitely
      const itemIndex = ((slot % totalItems) + totalItems) % totalItems;
      const item = items[itemIndex];

      // Calculate rope curve point and tilt angle
      const { y, angleDeg } = getRopePoint(x, W, config.sag, config.ropeY);

      cards.push({
        slot,
        item,
        x,
        y,
        angleDeg,
      });
    }
    return cards;
  }, [minSlot, maxSlot, currentOffset, cardGap, totalItems, items, W, config.sag, config.ropeY]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[580px] overflow-hidden select-none cursor-grab active:cursor-grabbing touch-pan-y"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onWheel={handleWheel}
      style={{ touchAction: 'pan-y' }}
    >
      {/* SVG Hanging Rope Path */}
      <RopePath
        width={dimensions.width}
        height={dimensions.height}
        sag={config.sag}
        ropeBaseY={config.ropeY}
      />

      {/* Hanging Carousel Cards */}
      <div className="absolute inset-0 pointer-events-auto">
        {visibleCards.map(({ slot, item, x, y, angleDeg }) => (
          <CarouselCard
            key={`slot-${slot}`}
            item={item}
            x={x}
            y={y}
            baseRotation={angleDeg}
            width={cardWidth}
            height={cardHeight}
            shakeIntensity={config.shakeIntensity}
            onClick={onItemSelect}
            onHoverChange={(hovered) => {
              isCardHoveredRef.current = hovered;
            }}
          />
        ))}
      </div>
    </div>
  );
};
