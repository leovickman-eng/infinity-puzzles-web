import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Script from 'next/script';
import type { Metadata } from 'next';
import {
  CharacterCarousel,
  FormationMorph,
  HeroPhotoSection,
  PlayModes,
  ProductSection,
  StoryTimeline,
  WildStats,
} from './HomeClientSections';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Infinity Puzzle Wild | Wooden Puzzle with 19 Characters',
    description: 'Infinity Puzzle Wild — 19 handcrafted wooden characters with endless formations. No right answer. Just creativity, flow, and play. Order now.',
  };
}


export default function HomePage() {
  const t = useTranslations();

  return (
    <>
      <h1 className="sr-only">Infinity Puzzle Wild — Wooden Puzzle with 19 Unique Characters</h1>
      <Script
        id="product-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: 'Infinity Puzzle Wild',
            description: '19 handcrafted wooden characters with endless formations. No right answer. Just creativity, flow, and play.',
            brand: { '@type': 'Brand', name: 'Infinity Puzzles' },
            image: 'https://infinity-puzzle.com/images/hero/og-image.png',
            offers: {
              '@type': 'Offer',
              availability: 'https://schema.org/InStock',
              priceCurrency: 'SEK',
              url: 'https://infinity-puzzle.com/en',
            },
          }),
        }}
      />

      {/* ── S1: Photo hero ── */}
      <HeroPhotoSection />

      {/* ── S2: Formation morph — sticky canvas, scrolls away into S3 ── */}
      <FormationMorph />

      {/* ── S2.5: Stats — 4 cards (sphere, 19, diameter, Sweden) ── */}
      <WildStats />

      {/* ── S2.6: Play modes — scroll-driven text ── */}
      <PlayModes />

      {/* ── S3: The physical object ── */}
      {/* ── S3: The physical object — full-bleed image triptych ── */}
      <section className="bg-background">
        {/* Image 1: full bleed — natural 4:3 */}
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4/3' }}>
          <Image
            src="/images/hero/nya/Infinity-puzzle_1.jpg"
            alt="Infinity Puzzles Wild"
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
          />
        </div>
        {/* Images 2 + 3: side by side, square crop */}
        <div className="grid grid-cols-2 gap-2 p-2">
          <div className="relative rounded-xl overflow-hidden bg-stone-100" style={{ aspectRatio: '1/1' }}>
            <Image
              src="/images/hero/nya/Infinity-puzzle_2.jpg"
              alt="Infinity Puzzles detail"
              fill
              className="object-cover object-center"
              sizes="50vw"
            />
          </div>
          <div className="relative rounded-xl overflow-hidden bg-stone-100" style={{ aspectRatio: '1/1' }}>
            <Image
              src="/images/hero/nya/Infinity-puzzle_3.jpg"
              alt="Infinity Puzzles detail"
              fill
              className="object-cover object-center"
              sizes="50vw"
            />
          </div>
        </div>
      </section>

      {/* ── S6: Shop ── */}
      <section id="shop" className="py-24 px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
              {t('shop.title')}
            </h2>
          </div>
          <ProductSection />
        </div>
      </section>

      {/* ── S4: Characters ── */}
      <section className="py-24 px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="font-display text-sm uppercase tracking-widest text-primary mb-3">
              The Cast
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground text-balance">
              {t('characters.title')}
            </h2>
            <p className="font-body text-lg text-foreground/75 mt-4 max-w-xl mx-auto">
              {t('characters.subtitle')}
            </p>
          </div>

          <CharacterCarousel />

          <div className="text-center mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
            <a
              href="universe/stories"
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
            <a
              href="WILD_NETWORK"
              className="inline-flex items-center gap-2 font-body text-sm text-foreground/50 hover:text-foreground transition-colors group"
            >
              Wild Network
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

      {/* ── S7: Story timeline ── */}
      <div id="story"><StoryTimeline /></div>
    </>
  );
}
