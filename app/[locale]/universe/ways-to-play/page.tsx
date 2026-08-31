'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import Image from 'next/image';

const BG     = '#FFFBF5';
const ACCENT = '#FF8C42';
const MUTED  = 'rgba(13,10,18,0.4)';
const DIVIDER = 'rgba(13,10,18,0.1)';
const TEXT   = '#0d0a12';

const CONTENT = {
  sv: {
    back: 'Universum',
    intro: 'Pusslet har inga fasta regler. Men det finns sätt att spela det som är svårare — och roligare — än du tror.',
    split: {
      label: 'Spelläge 1',
      title: 'The Split',
      intro: 'En oändlig utmaning.',
      body: 'Blanda alla 19 bitarna. Dela dem i två slumpmässiga högar. Sätt sedan ihop varje hög för sig — som sitt eget lilla pussel. Det låter omöjligt, men förvånansvärt ofta går det ihop, oavsett vilka bitar som hamnar var. Ny fördelning, ny lösning, varje gång du blandar.',
      steps: ['Blanda alla bitar', 'Dela upp i två högar', 'Sätt ihop varje hög för sig'],
    },
    chain: {
      label: 'Spelläge 2',
      title: 'The Impossible Chain',
      intro: '19 bitar. En enda oavbruten linje.',
      body: 'Länka ihop alla 19 bitarna, en efter en, tills hela samlingen bildar en enda sammanhängande kedja. Det tar tålamod — och några försök innan det klaffar.',
      steps: ['Ta alla bitar', 'Länka ihop dem en efter en', 'Fortsätt tills alla 19 bildar en enda kedja'],
    },
  },
  en: {
    back: 'Universe',
    intro: 'The puzzle has no fixed rules. But there are ways to play it that are harder — and more fun — than you think.',
    split: {
      label: 'Mode 1',
      title: 'The Split',
      intro: 'An infinite challenge.',
      body: 'Mix all 19 pieces together. Split them into two random piles. Then put each pile together on its own — like its own tiny puzzle. It sounds impossible, but surprisingly often it works out, no matter how the pieces land. New split, new solution, every time you shuffle.',
      steps: ['Mix all the pieces', 'Split into two piles', 'Put each pile together on its own'],
    },
    chain: {
      label: 'Mode 2',
      title: 'The Impossible Chain',
      intro: '19 pieces. One unbroken line.',
      body: 'Link all 19 pieces together, one by one, until the whole set forms a single connected chain. It takes patience — and a few tries before it clicks.',
      steps: ['Take all the pieces', 'Link them together one by one', 'Keep going until all 19 form one chain'],
    },
  },
};

function Step({ n, text }: { n: number; text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 12 }}>
      <div style={{
        flexShrink: 0,
        width: 28, height: 28, borderRadius: '50%',
        border: `1px solid ${ACCENT}55`,
        background: `${ACCENT}12`,
        color: ACCENT,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '12px', fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
      }}>
        {n}
      </div>
      <p style={{
        margin: '4px 0 0',
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 'clamp(0.92rem, 2.4vw, 1rem)',
        color: TEXT, opacity: 0.8, lineHeight: 1.5,
      }}>
        {text}
      </p>
    </div>
  );
}

export default function WaysToPlayPage() {
  const params = useParams();
  const locale = (params?.locale as string) ?? 'en';
  const isSv   = locale === 'sv';
  const c      = isSv ? CONTENT.sv : CONTENT.en;

  return (
    <div style={{ minHeight: '100svh', background: BG, color: TEXT }}>

      {/* Top bar */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 20,
        padding: '18px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: `linear-gradient(to bottom, ${BG}f5 60%, transparent)`,
      }}>
        <Link href={`/${locale}/universe`} style={{
          color: MUTED, fontSize: '13px', textDecoration: 'none',
          fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.06em', transition: 'color 0.15s',
        }}
          onMouseEnter={e => (e.currentTarget.style.color = ACCENT)}
          onMouseLeave={e => (e.currentTarget.style.color = MUTED)}
        >
          ← {c.back}
        </Link>
        <Link href={`/${isSv ? 'en' : 'sv'}/universe/ways-to-play`} style={{
          color: MUTED, fontSize: '10px', letterSpacing: '2px',
          textDecoration: 'none',
          padding: '4px 10px',
          border: '1px solid rgba(240,234,248,0.15)',
          borderRadius: '20px',
          fontFamily: "'DM Sans', sans-serif",
          transition: 'color 0.15s, border-color 0.15s',
        }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLAnchorElement).style.color = ACCENT;
            (e.currentTarget as HTMLAnchorElement).style.borderColor = `${ACCENT}55`;
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLAnchorElement).style.color = MUTED;
            (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(240,234,248,0.15)';
          }}
        >
          {isSv ? 'ENG' : 'SWE'}
        </Link>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '96px 28px 80px' }}>

        {/* Page heading */}
        <div style={{
          fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase',
          color: MUTED, fontFamily: "'DM Sans', sans-serif", marginBottom: '10px',
        }}>
          {c.split.label.split(' ')[0] === 'Spelläge' ? 'Spellägen' : 'Modes'}
        </div>
        <h1 style={{
          fontFamily: "'eight-condensed', sans-serif",
          fontSize: 'clamp(2.6rem, 9vw, 4.5rem)',
          fontWeight: 400, color: ACCENT,
          margin: '0 0 20px', letterSpacing: '0.04em', lineHeight: 1,
        }}>
          WAYS TO PLAY
        </h1>
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 'clamp(0.95rem, 2.5vw, 1.05rem)',
          lineHeight: 1.75, color: TEXT, opacity: 0.65,
          margin: '0 0 48px',
        }}>
          {c.intro}
        </p>

        <div style={{ height: '1px', background: DIVIDER, marginBottom: '48px' }} />

        {/* ── The Split ── */}
        <section style={{ marginBottom: '64px' }}>
          <div style={{
            fontSize: '10px', letterSpacing: '2.5px', textTransform: 'uppercase',
            color: MUTED, fontFamily: "'DM Sans', sans-serif", marginBottom: '8px',
          }}>
            {c.split.label}
          </div>
          <h2 style={{
            fontFamily: "'eight-condensed', sans-serif",
            fontSize: 'clamp(1.8rem, 6vw, 2.8rem)',
            fontWeight: 400, color: TEXT,
            margin: '0 0 6px', letterSpacing: '0.04em', lineHeight: 1,
          }}>
            {c.split.title}
          </h2>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 'clamp(0.9rem, 2.3vw, 1rem)',
            color: ACCENT, opacity: 0.85,
            margin: '0 0 18px', letterSpacing: '0.04em',
          }}>
            {c.split.intro}
          </p>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 'clamp(0.95rem, 2.5vw, 1.05rem)',
            lineHeight: 1.75, color: TEXT, opacity: 0.8,
            margin: '0 0 28px',
          }}>
            {c.split.body}
          </p>

          {/* Split images */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
            {[
              { src: '/images/How%20to%20play/split_1.png', alt: isSv ? 'Alla 19 bitar blandade' : 'All 19 pieces mixed' },
              { src: '/images/How%20to%20play/split_2.png', alt: isSv ? 'Bitarna uppdelade i två högar' : 'Pieces split into two piles' },
              { src: '/images/How%20to%20play/split_3.png', alt: isSv ? 'Varje hög ihopsatt' : 'Each pile assembled' },
            ].map((img, i) => (
              <div key={i} style={{
                borderRadius: '14px', overflow: 'hidden',
                border: `1px solid ${DIVIDER}`,
                position: 'relative',
              }}>
                <div style={{
                  position: 'absolute', top: 10, left: 14,
                  fontSize: '10px', letterSpacing: '2px',
                  color: 'rgba(13,10,18,0.35)',
                  fontFamily: "'DM Sans', sans-serif",
                  zIndex: 1,
                }}>
                  {i + 1}
                </div>
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={1200}
                  height={800}
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                  unoptimized
                />
              </div>
            ))}
          </div>

          {/* Steps */}
          <div>
            {c.split.steps.map((step, i) => (
              <Step key={i} n={i + 1} text={step} />
            ))}
          </div>
        </section>

        <div style={{ height: '1px', background: DIVIDER, marginBottom: '48px' }} />

        {/* ── The Impossible Chain ── */}
        <section style={{ marginBottom: '48px' }}>
          <div style={{
            fontSize: '10px', letterSpacing: '2.5px', textTransform: 'uppercase',
            color: MUTED, fontFamily: "'DM Sans', sans-serif", marginBottom: '8px',
          }}>
            {c.chain.label}
          </div>
          <h2 style={{
            fontFamily: "'eight-condensed', sans-serif",
            fontSize: 'clamp(1.8rem, 6vw, 2.8rem)',
            fontWeight: 400, color: TEXT,
            margin: '0 0 6px', letterSpacing: '0.04em', lineHeight: 1,
          }}>
            {c.chain.title}
          </h2>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 'clamp(0.9rem, 2.3vw, 1rem)',
            color: ACCENT, opacity: 0.85,
            margin: '0 0 18px', letterSpacing: '0.04em',
          }}>
            {c.chain.intro}
          </p>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 'clamp(0.95rem, 2.5vw, 1.05rem)',
            lineHeight: 1.75, color: TEXT, opacity: 0.8,
            margin: '0 0 28px',
          }}>
            {c.chain.body}
          </p>

          {/* Chain image */}
          <div style={{
            borderRadius: '14px', overflow: 'hidden',
            border: `1px solid ${DIVIDER}`,
            marginBottom: 32,
          }}>
            <Image
              src="/images/How%20to%20play/impossible_1.png"
              alt={isSv ? 'Alla 19 bitar i en kedja' : 'All 19 pieces in one chain'}
              width={1200}
              height={800}
              style={{ width: '100%', height: 'auto', display: 'block' }}
              unoptimized
            />
          </div>

          {/* Steps */}
          <div>
            {c.chain.steps.map((step, i) => (
              <Step key={i} n={i + 1} text={step} />
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
