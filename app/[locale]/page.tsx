import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import type { Metadata } from 'next';
import CharacterCard from '@/components/character-card/CharacterCard';

// SSR-free dynamic imports for heavy client components
const FormationMorph = dynamic(() => import('@/components/formation-morph/FormationMorph'), {
  ssr: false,
});
const LottieScrollSection = dynamic(() => import('@/components/lottie/LottieScrollSection'), {
  ssr: false,
});
const ScrollCoordinator = dynamic(() => import('@/components/ScrollCoordinator'), {
  ssr: false,
});
// Defer ProductSection which needs Shopify API
const ProductSection = dynamic(() => import('@/components/shop/ProductSection'), { ssr: false });
const StoryTimeline = dynamic(() => import('@/components/story/StoryTimeline'), { ssr: false });

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('formation');
  return { title: t('title') };
}

// Placeholder character data (uses Cloudinary images from characters.json)
const PLACEHOLDER_CHARACTERS = [
  {
    id: 1,
    name: 'The Wanderer',
    description: 'Never stays in one place',
    color: '#FF6B35',
    imageUrl: 'https://res.cloudinary.com/dk3ftfygx/image/upload/v1776889732/infinitypuzzles/karaktarer/karaktar_1.png',
  },
  {
    id: 2,
    name: 'The Dreamer',
    description: 'Head always in the clouds',
    color: '#7B2FBE',
    imageUrl: 'https://res.cloudinary.com/dk3ftfygx/image/upload/v1776889733/infinitypuzzles/karaktarer/karaktar_2.png',
  },
  {
    id: 3,
    name: 'The Explorer',
    description: 'First to every new world',
    color: '#0EC7B4',
    imageUrl: 'https://res.cloudinary.com/dk3ftfygx/image/upload/v1776889734/infinitypuzzles/karaktarer/karaktar_3.png',
  },
  {
    id: 4,
    name: 'The Keeper',
    description: 'Remembers everything',
    color: '#FFD23F',
    imageUrl: 'https://res.cloudinary.com/dk3ftfygx/image/upload/v1776889735/infinitypuzzles/karaktarer/karaktar_4.png',
  },
];

export default function HomePage() {
  const t = useTranslations();

  return (
    <>
      {/* ── S1: Lottie hero — scroll-driven, pins until animation completes ── */}
      <LottieScrollSection
        idleSrc="/lottie/test.json"
        src="/lottie/test2.json"
        className="w-full max-w-[900px]"
        scrollLength={1}
      />

      {/* ── S2: Formation morph (scroll-driven) ── */}
      <FormationMorph />

      {/* Recalculates all ScrollTrigger positions after S1 + S2 have both registered their pins */}
      <ScrollCoordinator />

      {/* ── S3: The physical object ── */}
      <section className="py-24 px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="flex flex-col gap-6 order-2 md:order-1">
              <p className="font-body text-sm uppercase tracking-widest text-primary">Wild Collection</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground leading-tight text-balance">
                {t('physical.title')} <br />
                <span className="text-foreground/40">{t('physical.subtitle')}</span>
              </h2>
              <p className="font-body text-lg text-foreground/60 leading-relaxed max-w-md">
                {t('physical.description')}
              </p>
            </div>

            {/* Placeholder image grid */}
            <div className="order-1 md:order-2 grid grid-cols-2 gap-3">
              <div className="aspect-square rounded-2xl overflow-hidden bg-stone-100 col-span-2">
                <div className="w-full h-full bg-gradient-to-br from-stone-100 via-amber-50 to-stone-200 flex items-center justify-center">
                  <span className="font-display text-stone-300 text-sm">Hero image</span>
                </div>
              </div>
              <div className="aspect-square rounded-2xl overflow-hidden bg-stone-100">
                <div className="w-full h-full bg-gradient-to-br from-amber-50 to-stone-100 flex items-center justify-center">
                  <span className="font-display text-stone-300 text-xs">Detail</span>
                </div>
              </div>
              <div className="aspect-square rounded-2xl overflow-hidden bg-stone-100">
                <div className="w-full h-full bg-gradient-to-br from-stone-200 to-amber-50 flex items-center justify-center">
                  <span className="font-display text-stone-300 text-xs">Detail</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── S4: Characters ── */}
      <section className="py-24 px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="font-body text-sm uppercase tracking-widest text-primary mb-3">
              The Cast
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground text-balance">
              {t('characters.title')}
            </h2>
            <p className="font-body text-lg text-foreground/50 mt-4 max-w-xl mx-auto">
              {t('characters.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 justify-items-center">
            {PLACEHOLDER_CHARACTERS.map((char) => (
              <CharacterCard key={char.id} character={char} size="md" />
            ))}
          </div>

          <div className="text-center mt-12">
            <a
              href="characters"
              className="inline-flex items-center gap-2 font-body text-sm text-foreground/50 hover:text-foreground transition-colors group"
            >
              {t('characters.viewAll')}
              <svg
                width="16" height="16" viewBox="0 0 16 16" fill="none"
                className="transition-transform group-hover:translate-x-1"
              >
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* ── S5: Digital promise ── */}
      <section className="py-32 px-6 bg-canvas-dark text-white relative overflow-hidden">
        {/* Background accent */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(123,47,190,0.3)_0%,_transparent_70%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,_rgba(14,199,180,0.15)_0%,_transparent_50%)] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center">
          <p className="font-body text-sm uppercase tracking-widest text-accent-teal mb-6">
            {t('digitalPromise.eyebrow')}
          </p>
          <h2 className="font-display text-4xl md:text-6xl font-bold leading-tight text-balance whitespace-pre-line">
            {t('digitalPromise.title')}
          </h2>
          <p className="font-body text-lg text-white/50 mt-8 max-w-xl mx-auto leading-relaxed">
            {t('digitalPromise.description')}
          </p>

          {/* Visual accent: scan frame UI */}
          <div className="mt-16 mx-auto w-48 h-48 relative">
            <div className="absolute inset-0 rounded-2xl border-2 border-accent-teal/30" />
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-accent-teal rounded-tl-xl" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-accent-teal rounded-tr-xl" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-accent-teal rounded-bl-xl" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-accent-teal rounded-br-xl" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-secondary/40 to-accent-teal/20 animate-pulse-glow" />
            </div>
            {/* Scan line */}
            <div className="absolute inset-x-0 top-1/2 h-px bg-accent-teal/60 animate-float" />
          </div>
        </div>
      </section>

      {/* ── S6: Shop ── */}
      <section className="py-24 px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
              {t('shop.title')}
            </h2>
          </div>
          <ProductSection />
        </div>
      </section>

      {/* ── S7: Story timeline ── */}
      <StoryTimeline />
    </>
  );
}
