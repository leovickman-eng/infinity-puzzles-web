import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import Script from 'next/script';
import type { Metadata } from 'next';
import {
  BuyButton,
  CharacterCarousel,
  FormationMorph,
  HeroPhotoSection,
  InsideBoxSection,
  NewsletterSection,
  TestimonialsSection,
  ProductSection,
  StoryTimeline,
  ThreeImageGrid,
  WildStats,
} from './HomeClientSections';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Infinity Puzzle Wild | Wooden Puzzle with 19 Characters',
    description: 'Infinity Puzzle Wild — 19 handcrafted wooden characters with endless formations. No right answer. Just creativity, flow, and play. Order now.',
  };
}


export default async function HomePage() {
  const t = await getTranslations();

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

      {/* ── Buy button floating above Stats (sits in FormationMorph tail) ── */}
      <div style={{ position: 'relative', height: 0, zIndex: 5, display: 'flex', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', bottom: '100px' }}>
          <BuyButton label={t('hero.cta')} small />
        </div>
      </div>

      {/* ── S2.5: Stats — pull up to overlap S2 ── */}
      <div style={{ marginTop: '-72px', position: 'relative', zIndex: 2 }}>
        <WildStats />
      </div>

      {/* ── S3: The physical object — full-bleed panoramics + 3-col grid ── */}
      <section className="bg-background" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {/* Top panoramic: CR5_1192 — 2400×687 ≈ 3.49:1 */}
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: '2400/687' }}>
          <Image
            src="/images/hero/nya/CR5_1192.webp"
            alt="Infinity Puzzles Wild"
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
          />
        </div>

        {/* 3 interactive images — click to expand */}
        <ThreeImageGrid />

        {/* Bottom panoramic: CR5_1177 — 2400×828 ≈ 2.90:1 */}
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: '2400/828' }}>
          <Image
            src="/images/hero/nya/CR5_1177.webp"
            alt="Infinity Puzzles Wild"
            fill
            className="object-cover object-center"
            sizes="100vw"
          />
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

      {/* ── Inside the box ── */}
      <InsideBoxSection />

      {/* ── Testimonials ── */}
      <TestimonialsSection />

      {/* ── Newsletter ── */}
      <NewsletterSection />

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
        </div>
      </section>

      {/* ── S7: Story timeline ── */}
      <div id="story"><StoryTimeline /></div>
    </>
  );
}
