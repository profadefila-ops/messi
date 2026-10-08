export interface CarouselItem {
  id: string;
  title: string;
  subtitle: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  category?: string;
  aspectRatio?: string;
}

export interface RopeConfig {
  sag: number;
  ropeY: number;
  cardWidth: number;
  cardHeight: number;
  cardGap: number;
  speed: number;
  shakeIntensity: 'subtle' | 'medium' | 'energetic';
  pauseOnHover: boolean;
  theme: 'framer-clean' | 'sky-clouds' | 'editorial-warm' | 'twilight-dark';
}