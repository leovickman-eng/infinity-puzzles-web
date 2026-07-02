'use client';

import dynamic from 'next/dynamic';

export const FormationMorph = dynamic(
  () => import('@/components/formation-morph/FormationMorph'),
  { ssr: false },
);

export const LottieScrollSection = dynamic(
  () => import('@/components/lottie/LottieScrollSection'),
  { ssr: false },
);

export const HeroPhotoSection = dynamic(
  () => import('@/components/hero/HeroPhotoSection'),
  { ssr: false },
);

export const ProductSection = dynamic(
  () => import('@/components/shop/ProductSection'),
  { ssr: false },
);

export const CharacterCarousel = dynamic(
  () => import('@/components/character-carousel/CharacterCarousel'),
  { ssr: false },
);

export const StoryTimeline = dynamic(
  () => import('@/components/story/StoryTimeline'),
  { ssr: false },
);

export const PlayModes = dynamic(
  () => import('@/components/play-modes/PlayModes'),
  { ssr: false },
);

export const WildStats = dynamic(
  () => import('@/components/wild-stats/WildStats'),
  { ssr: false },
);

export const ThreeImageGrid = dynamic(
  () => import('@/components/three-image-grid/ThreeImageGrid'),
  { ssr: false },
);
