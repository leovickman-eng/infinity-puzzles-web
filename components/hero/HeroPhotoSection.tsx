'use client';

import Image from 'next/image';
import { useParams } from 'next/navigation';

export default function HeroPhotoSection() {
  const params = useParams();
  const locale = (params?.locale as string) ?? 'en';
  const isSv = locale === 'sv';

  const scrollToShop = () => {
    const el = document.getElementById('shop');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <style>{`
        @keyframes hero-pulse {
          0%   { box-shadow: 0 0 0 0   rgba(174,132,234,0.75), 0 4px 20px rgba(174,132,234,0.35); }
          60%  { box-shadow: 0 0 0 18px rgba(174,132,234,0),   0 4px 20px rgba(174,132,234,0.35); }
          100% { box-shadow: 0 0 0 0   rgba(174,132,234,0),    0 4px 20px rgba(174,132,234,0.35); }
        }
        .hero-buy-btn {
          animation: hero-pulse 2.2s ease-out infinite;
        }
        .hero-buy-btn:hover {
          animation: none;
          background: #c09ef0 !important;
          transform: translateY(-2px) scale(1.04);
          box-shadow: 0 6px 28px rgba(174,132,234,0.55) !important;
        }
        @keyframes hero-bounce-in {
          0%   { opacity: 0; transform: translateX(-50%) translateY(12px); }
          60%  { opacity: 1; transform: translateX(-50%) translateY(-4px); }
          100% { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        .hero-buy-wrap {
          animation: hero-bounce-in 0.7s cubic-bezier(0.34,1.56,0.64,1) 0.5s both;
        }
        @keyframes hero-scroll-bounce {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50%       { transform: translateY(6px); opacity: 0.8; }
        }
        .hero-arrow { animation: hero-scroll-bounce 1.4s ease-in-out infinite; }
        .hero-arrow:nth-child(2) { animation-delay: 0.18s; }
        .hero-arrow:nth-child(3) { animation-delay: 0.36s; }
      `}</style>

      {/* ── Full-width image ── */}
      <section style={{ position: 'relative', width: '100%', background: '#0d0a12', lineHeight: 0 }}>
        <div style={{ position: 'relative', width: '100%', aspectRatio: '4032 / 2503' }}>
          <Image
            src="/images/hero/hero-main.webp"
            alt="Infinity Puzzle Wild"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />

          {/* Gradient: dark at top (for header), dark at bottom (for button) */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'linear-gradient(to bottom, rgba(13,10,18,0.45) 0%, transparent 25%, transparent 60%, rgba(13,10,18,0.8) 100%)',
          }} />

          {/* Pulsing buy button — bottom center */}
          <div className="hero-buy-wrap" style={{
            position: 'absolute',
            bottom: 'clamp(20px, 5%, 48px)',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 5,
          }}>
            <button
              className="hero-buy-btn"
              onClick={scrollToShop}
              style={{
                fontFamily: "'tumb', serif",
                fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
                letterSpacing: '0.12em',
                color: '#fff',
                background: '#ae84ea',
                border: 'none',
                borderRadius: '100px',
                padding: 'clamp(12px, 2vw, 18px) clamp(36px, 6vw, 64px)',
                cursor: 'pointer',
                transition: 'background 0.2s, transform 0.2s, box-shadow 0.2s',
                whiteSpace: 'nowrap',
              }}
            >
              {isSv ? 'Köp' : 'Buy'}
            </button>
          </div>
        </div>
      </section>

      {/* ── Text + scroll arrows below image ── */}
      <section style={{
        background: '#0d0a12',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 'clamp(32px, 5vw, 64px) 24px clamp(24px, 4vw, 48px)',
        textAlign: 'center',
        gap: '16px',
      }}>
        <h2 style={{
          fontFamily: "'tumb', serif",
          fontSize: 'clamp(1.5rem, 4vw, 3rem)',
          color: '#ae84ea',
          lineHeight: 1.2,
          letterSpacing: '0.04em',
          margin: 0,
          fontWeight: 400,
        }}>
          Art, Play, and a bit of Magic.
        </h2>

        <p style={{
          fontFamily: "'tumb', serif",
          fontSize: 'clamp(0.95rem, 2vw, 1.5rem)',
          color: 'rgba(240,234,248,0.5)',
          lineHeight: 1.45,
          letterSpacing: '0.04em',
          margin: 0,
          fontWeight: 300,
          maxWidth: '600px',
        }}>
          Shapes, colors, stories you haven&apos;t seen before.
        </p>

        {/* Scroll arrows */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', marginTop: '8px' }}>
          {[0, 1, 2].map(i => (
            <svg
              key={i}
              className="hero-arrow"
              width="20" height="12" viewBox="0 0 20 12" fill="none"
              style={{ animationDelay: `${i * 0.18}s` }}
            >
              <path d="M1 1l9 9 9-9" stroke="#ae84ea" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ))}
        </div>
      </section>
    </>
  );
}
