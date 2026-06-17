'use client';

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
          60%  { box-shadow: 0 0 0 28px rgba(174,132,234,0),   0 4px 20px rgba(174,132,234,0.35); }
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
          0%   { opacity: 0; transform: translate(-50%, calc(-50% + 16px)); }
          60%  { opacity: 1; transform: translate(-50%, calc(-50% - 4px)); }
          100% { opacity: 1; transform: translate(-50%, -50%); }
        }
        .hero-buy-wrap {
          animation: hero-bounce-in 0.7s cubic-bezier(0.34,1.56,0.64,1) 0.5s both;
        }
        @keyframes hero-scroll-bounce {
          0%, 100% { transform: translateY(0); opacity: 0.45; }
          50%       { transform: translateY(6px); opacity: 0.85; }
        }
        .hero-arrow { animation: hero-scroll-bounce 1.4s ease-in-out infinite; }
        .hero-arrow:nth-child(2) { animation-delay: 0.18s; }
        .hero-arrow:nth-child(3) { animation-delay: 0.36s; }

        /* Responsive aspect ratio */
        .hero-img-wrap { aspect-ratio: 4032 / 2503; }
        @media (max-width: 767px) { .hero-img-wrap { aspect-ratio: 900 / 1350; } }
      `}</style>

      {/* ── Full-width image ── */}
      <section style={{ position: 'relative', width: '100%', background: '#FFFBF5', lineHeight: 0 }}>
        <div className="hero-img-wrap" style={{ position: 'relative', width: '100%' }}>

          {/* Responsive image — mobile gets hero-mobile.webp, desktop hero-main.webp */}
          <picture style={{ position: 'absolute', inset: 0, display: 'block' }}>
            <source media="(max-width: 767px)" srcSet="/images/hero/hero-mobile.webp" />
            <img
              src="/images/hero/hero-main.webp"
              alt="Infinity Puzzle Wild"
              fetchPriority="high"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                display: 'block',
              }}
            />
          </picture>

          {/* Gradient: fade bottom toward light background */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, transparent 25%, transparent 50%, rgba(255,251,245,0.9) 100%)',
          }} />

          {/* Buy button — centered in image */}
          <div className="hero-buy-wrap" style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 5,
          }}>
            <button
              className="hero-buy-btn"
              onClick={scrollToShop}
              style={{
                fontFamily: "'tumb', serif",
                fontSize: 'clamp(1.1rem, 2.4vw, 1.5rem)',
                letterSpacing: '0.18em',
                color: '#fff',
                background: '#ae84ea',
                border: 'none',
                borderRadius: '9999px',
                padding: 'clamp(13px, 2vw, 18px) clamp(28px, 3.5vw, 42px)',
                cursor: 'pointer',
                transition: 'background 0.2s, transform 0.2s, box-shadow 0.2s',
                whiteSpace: 'nowrap',
              }}
            >
              {isSv ? 'KÖP DITT' : 'GET YOURS'}
            </button>
          </div>
        </div>
      </section>

      {/* ── Scroll arrows — tight strip directly below image ── */}
      <section style={{
        background: '#FFFBF5',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '14px 0 10px',
        lineHeight: 0,
      }}>
        {[0, 1, 2].map(i => (
          <svg
            key={i}
            className="hero-arrow"
            width="22" height="13" viewBox="0 0 22 13" fill="none"
            style={{ animationDelay: `${i * 0.18}s`, display: 'block' }}
          >
            <path d="M1 1l10 10 10-10" stroke="#ae84ea" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ))}
      </section>
    </>
  );
}
