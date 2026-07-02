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
  ThreeImageGrid,
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

      {/* ── S2.5: Stats — pull up to overlap S2 ── */}
      <div style={{ marginTop: '-72px', position: 'relative', zIndex: 2 }}>
        <WildStats />
      </div>

      {/* ── S2.6: Play modes — scroll-driven text ── */}
      <PlayModes />

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

          <div className="text-center mt-12 flex flex-col sm:flex-row items-center justify-center gap-8">
            {/* View all characters — 19-dots icon */}
            <a
              href="universe/stories"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                fontFamily: "'eight-condensed', Georgia, serif",
                fontWeight: 900, fontSize: 'clamp(1rem, 2vw, 1.3rem)',
                letterSpacing: '0.03em', color: '#ae84ea',
                textDecoration: 'none', transition: 'opacity 0.15s',
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = '0.7')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}
            >
              {/* 19-dot grid (same layout as WildStats card 2) */}
              <svg width="28" height="28" viewBox="0 0 48 48" fill="none" aria-hidden="true">
                {([
                  [18,18],[18,9],[9,18],[27,18],[18,27],
                  [9,9],[27,9],[9,27],[27,27],[0,18],
                  [36,18],[18,0],[18,36],[0,9],[36,9],
                  [0,27],[36,27],[9,0],[27,0],
                ] as [number,number][]).map(([x, y], i) => (
                  <circle key={i} cx={x + 6} cy={y + 6} r="3" fill="#ae84ea" />
                ))}
              </svg>
              {t('characters.viewAll')}
            </a>

            {/* Wild Network — infinity knot icon */}
            <a
              href="WILD_NETWORK"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                fontFamily: "'eight-condensed', Georgia, serif",
                fontWeight: 900, fontSize: 'clamp(1rem, 2vw, 1.3rem)',
                letterSpacing: '0.03em', color: '#ae84ea',
                textDecoration: 'none', transition: 'opacity 0.15s',
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = '0.7')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34.4 23.9" width="34" height="23" aria-hidden="true">
                <path fill="#ae84ea" d="M22.4,22c-3.7,2-8.4,2.3-12.4,1.3s-5.2-1.9-7-3.9S.7,16.4.3,14.5,0,12.1,0,10.9c.2-1.9,1.1-3.6,2.9-4.3,1.3-.5,2.8-.4,4.2-.1C9.1,3,12.7,1.1,16.5.3s8.8-.2,12.5,2.1,4.7,4.3,5.3,7.5.2,2.1.1,3.2c-.2,2.1-1.2,3.7-3.2,4.4-1.2.4-2.6.3-3.9,0-1.1,2-2.8,3.5-4.8,4.6ZM28.5,10.1c.2,1.5.2,3-.1,4.4.6,0,1.3.1,2,0,.4-.1.6-.4.8-.7.4-1,.3-2.5,0-3.5-.7-3.5-3.8-5.7-7.1-6.6s-5.3-.7-7.8,0-2.3.8-3.4,1.4c-1,.6-1.9,1.4-2.6,2.4l2.8,1.1,4,1.8,2.4-1.6,1.7-1c1.2-.6,2.5-1.2,3.9-1.1s2.2.7,2.8,1.7.5,1.2.6,1.9ZM24.2,16.6l-2.9-1.1-3.9-1.7-2.6,1.7c-.7.5-1.5.9-2.2,1.2-1.1.5-2.3.9-3.6.7s-2.2-1.1-2.7-2.3-.6-4-.2-5.7c-.7,0-1.4-.1-2,0-.3.1-.5.3-.7.6-.4.9-.4,2.5-.2,3.5.5,2.5,2,4.3,4.2,5.6,3.9,2.2,9.5,2.3,13.5.3,1-.5,1.9-1.1,2.6-1.9l.7-.8ZM23.9,13.2l1.5.6c.2-1,.2-2.1.1-3.1s-.1-.6-.3-.9-.8-.2-1.3,0c-.5.2-1,.4-1.5.7l-2.2,1.3,3.6,1.5ZM10.4,14.2c1.3-.5,2.5-1.2,3.7-2l-3.5-1.5-1.5-.6c-.2,1-.2,2-.1,3.1s.1.6.3.9.8.2,1.2,0Z"/>
              </svg>
              Wild Network
            </a>
          </div>
        </div>
      </section>

      {/* ── S7: Story timeline ── */}
      <div id="story"><StoryTimeline /></div>
    </>
  );
}
