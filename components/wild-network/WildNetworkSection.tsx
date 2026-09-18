'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function WildNetworkSection() {
  const params = useParams();
  const locale = (params?.locale as string) ?? 'en';

  return (
    <section
      style={{
        width: '100%',
        background: '#1a181c',
        padding: '72px 0 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 40, padding: '0 24px' }}>
        <p
          style={{
            fontFamily: "'eight-condensed', sans-serif",
            fontSize: 'clamp(0.7rem, 1.4vw, 0.85rem)',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: '#ae84ea',
            marginBottom: 10,
            margin: '0 0 10px',
          }}
        >
          Explore
        </p>
        <h2
          style={{
            fontFamily: "'eight-condensed', sans-serif",
            fontSize: 'clamp(2.2rem, 6vw, 4rem)',
            color: '#FFFBF5',
            fontWeight: 700,
            margin: '0 0 14px',
            lineHeight: 1,
          }}
        >
          Wild Network
        </h2>
        <p
          style={{
            fontFamily: 'inherit',
            fontSize: 'clamp(0.9rem, 1.8vw, 1.05rem)',
            color: 'rgba(255,251,245,0.6)',
            margin: 0,
            maxWidth: 420,
            lineHeight: 1.6,
          }}
        >
          All 19 characters — explore their connections and stories.
        </p>
      </div>

      {/* Iframe embed */}
      <div
        style={{
          width: '100%',
          height: 'clamp(420px, 65vh, 680px)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <iframe
          src="https://leovickman-eng.github.io/WILD_NETWORK/"
          allow="fullscreen"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            border: 'none',
          }}
          title="Wild Network"
        />

        {/* Fullscreen link overlay — bottom right */}
        <Link
          href={`/${locale}/WILD_NETWORK`}
          style={{
            position: 'absolute',
            bottom: 20,
            right: 20,
            background: 'rgba(255,251,245,0.1)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 999,
            padding: '8px 18px',
            color: 'rgba(255,251,245,0.85)',
            fontFamily: 'inherit',
            fontSize: '0.8rem',
            letterSpacing: '0.08em',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            zIndex: 2,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M5 2H2v10h10V9M9 2h3v3M8.5 5.5 12 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Fullscreen
        </Link>
      </div>
    </section>
  );
}
