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

export function BuyButton({ label, small }: { label: string; small?: boolean }) {
  const scrollToShop = () => {
    const el = document.getElementById('shop');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <>
      <style>{`
        @keyframes buy-pulse {
          0%   { box-shadow: 0 0 0 0   rgba(174,132,234,0.75), 0 4px 20px rgba(174,132,234,0.35); }
          60%  { box-shadow: 0 0 0 28px rgba(174,132,234,0),   0 4px 20px rgba(174,132,234,0.35); }
          100% { box-shadow: 0 0 0 0   rgba(174,132,234,0),    0 4px 20px rgba(174,132,234,0.35); }
        }
        .buy-btn-float { animation: buy-pulse 2.2s ease-out infinite; }
        .buy-btn-float:hover {
          animation: none;
          background: #c09ef0 !important;
          transform: translateY(-2px) scale(1.04);
          box-shadow: 0 6px 28px rgba(174,132,234,0.55) !important;
        }
      `}</style>
      <button
        className="buy-btn-float"
        onClick={scrollToShop}
        style={{
          fontFamily: "'eight-condensed', sans-serif",
          fontSize: small ? 'clamp(0.85rem, 1.8vw, 1.15rem)' : 'clamp(1.1rem, 2.4vw, 1.5rem)',
          letterSpacing: '0.18em',
          color: '#fff',
          background: '#ae84ea',
          border: 'none',
          borderRadius: '9999px',
          padding: small
            ? 'clamp(10px, 1.5vw, 14px) clamp(21px, 2.6vw, 32px)'
            : 'clamp(13px, 2vw, 18px) clamp(28px, 3.5vw, 42px)',
          cursor: 'pointer',
          transition: 'background 0.2s, transform 0.2s, box-shadow 0.2s',
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </button>
    </>
  );
}
