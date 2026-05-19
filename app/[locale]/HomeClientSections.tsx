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

export const ProductSection = dynamic(
  () => import('@/components/shop/ProductSection'),
  { ssr: false },
);

export const StoryTimeline = dynamic(
  () => import('@/components/story/StoryTimeline'),
  { ssr: false },
);
