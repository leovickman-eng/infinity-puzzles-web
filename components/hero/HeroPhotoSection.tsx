'use client';

import Image from 'next/image';
import { useParams } from 'next/navigation';

function InfinityPuzzlesLogo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1920 1080"
      fill="#ae84ea"
      aria-label="Infinity Puzzles"
      style={{ width: 'min(220px, 55vw)', height: 'auto', display: 'block' }}
    >
      <path d="M504.7,703.1c0-82.5-93.4-108.6-184.2-108.6s-11.7.5-17.3,1v334.4h74.2v-122.6c70.5-5.3,127.4-47.8,127.4-104.2ZM432.3,703.1c0,27-20.4,49.7-55,55.5v-111c34.6,5.3,55,28.5,55,55.5Z"/>
      <path d="M770.5,599.8h-74.2v246.1c0,13.5-1.9,34.7-24.7,34.7s-24.7-21.2-24.7-34.7v-246.1h-74.2v246.1c0,49.2,30.3,88.8,98.9,88.8s98.9-39.6,98.9-88.8v-246.1Z"/>
      <path fillRule="evenodd" d="M1094.4,873.2s-35.7-205.9-51.7-298.4c-1.9-10.9,1.1-22.1,8.3-30.6,7.2-8.5,17.7-13.4,28.8-13.4h544.9c0,12.9-5.1,25.3-14.3,34.5-9.1,9.1-21.5,14.3-34.5,14.3h-455.5l59.3,358.3h-343.1l59.3-358.3H311.7c-12.9,0-25.3-5.1-34.5-14.3-9.1-9.1-14.3-21.5-14.3-34.5h0s674.4,0,674.4,0c10.9,0,21.3,4.8,28.3,13.2,7,8.4,10,19.4,8.2,30.1-16,92.1-51.8,299.1-51.8,299.1h172.5Z"/>
      <path d="M1384.4,878.7h-62.4v-278.9h-74.2v330.1h136.6v-51.2Z"/>
      <path d="M1579.7,878.7h-62.4v-96h62.4v-45.8h-62.4v-88.3h62.4v-48.7h-136.6v330.1h136.6v-51.2Z"/>
      <path d="M357.8,154.9h-3.7c-32.6,0-58.9,26.4-58.9,58.9v298h62.6V154.9Z"/>
      <path d="M593.7,154.9h-62.6v168.6l-42.8-168.6h-62.6v356.9h62.6v-171.2l42.8,171.2h62.6V154.9Z"/>
      <path d="M900.5,154.9h-62.6v356.9h62.6V154.9ZM776.8,303.1h-52.7v-95.5h52.7v-52.7h-115.3v356.9h62.6v-159.2h52.7v-49.6Z"/>
      <path d="M1136.4,154.9h-62.6v168.6l-42.8-168.6h-62.6v356.9h62.6v-171.2l42.8,171.2h62.6V154.9Z"/>
      <rect x="1204.2" y="154.9" width="62.6" height="356.9"/>
      <path d="M1470.4,154.9h-151.3v52.7h44.4v304.2h62.6V207.6h44.4v-52.7Z"/>
      <path d="M1622.7,154.9l-30.3,134.6-30.3-134.6h-63.2l62.1,214.5-36.9,146.1h62.6l36.9-146.1,62.1-214.5h-63.1Z"/>
      <circle cx="829.2" cy="642.1" r="35.6"/>
      <circle cx="1182.6" cy="642.1" r="35.6"/>
    </svg>
  );
}

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
      <section style={{ position: 'relative', width: '100%', background: '#FFFBF5', lineHeight: 0 }}>
        <div style={{ position: 'relative', width: '100%', aspectRatio: '4032 / 2503' }}>
          <Image
            src="/images/hero/hero-main.webp"
            alt="Infinity Puzzle Wild"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />

          {/* Gradient: fade bottom toward light background */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, transparent 20%, transparent 55%, rgba(255,251,245,0.85) 100%)',
          }} />

          {/* Pulsing buy button — bottom center */}
          <div className="hero-buy-wrap" style={{
            position: 'absolute',
            bottom: 'clamp(48px, 10%, 96px)',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 5,
          }}>
            <button
              className="hero-buy-btn"
              onClick={scrollToShop}
              style={{
                fontFamily: "'tumb', serif",
                fontSize: 'clamp(1.3rem, 3vw, 1.8rem)',
                letterSpacing: '0.14em',
                color: '#fff',
                background: '#ae84ea',
                border: 'none',
                borderRadius: '9999px',
                padding: 'clamp(16px, 2.5vw, 22px) clamp(32px, 4.5vw, 48px)',
                cursor: 'pointer',
                transition: 'background 0.2s, transform 0.2s, box-shadow 0.2s',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isSv ? 'Köp ditt' : 'Get Yours'}
            </button>
          </div>
        </div>
      </section>

      {/* ── Branding + scroll arrows below image ── */}
      <section style={{
        background: '#FFFBF5',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 'clamp(24px, 4vw, 44px) 24px clamp(20px, 3vw, 36px)',
        textAlign: 'center',
        gap: '12px',
      }}>

        {/* "This is WILD by" */}
        <p style={{
          fontFamily: "'tumb', serif",
          fontSize: 'clamp(0.85rem, 1.8vw, 1.2rem)',
          color: '#ae84ea',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          margin: 0,
          fontWeight: 400,
          opacity: 0.75,
        }}>
          {isSv ? 'Det här är WILD av' : 'This is WILD by'}
        </p>

        {/* Logo */}
        <InfinityPuzzlesLogo />

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
