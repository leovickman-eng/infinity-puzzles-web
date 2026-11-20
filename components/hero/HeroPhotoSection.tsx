'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect, useRef, useCallback } from 'react';

const WILD_FRAMES = Array.from({ length: 13 }, (_, i) =>
  `/WILD_logo_Frames_HERO/PNGSet/PNG_${String(i + 1).padStart(4, '0')}.png`
);
const WILD_FPS = 10; // frames per second

const DESKTOP_SLIDES = [
  '/images/hero/karusell/d1.webp',
  '/images/hero/karusell/d5.webp',
  '/images/hero/karusell/d2.webp',
  '/images/hero/karusell/d3-c.webp',
  '/images/hero/karusell/d4-c.webp',
];

const MOBILE_SLIDES = [
  '/images/hero/karusell/m1.webp',
  '/images/hero/karusell/m5.webp',
  '/images/hero/karusell/m2.webp',
  '/images/hero/karusell/m3.webp',
];

const SLIDE_MS = 5000;
const FADE_MS  = 900;

export default function HeroPhotoSection() {
  const params  = useParams();
  const locale  = (params?.locale as string) ?? 'en';
  const isSv    = locale === 'sv';

  const [isMobile, setIsMobile]     = useState(false);
  const [current, setCurrent]       = useState(0);
  const [wildFrame, setWildFrame]   = useState(0);
  const touchStartX  = useRef<number | null>(null);
  const intervalRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const wildRef      = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    setIsMobile(mq.matches);
    const h = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);

  const slides = isMobile ? MOBILE_SLIDES : DESKTOP_SLIDES;

  const startAutoPlay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(
      () => setCurrent(c => (c + 1) % slides.length),
      SLIDE_MS,
    );
  }, [slides.length]);

  useEffect(() => {
    startAutoPlay();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [startAutoPlay]);

  // WILD logo frame animation
  useEffect(() => {
    wildRef.current = setInterval(
      () => setWildFrame(f => (f + 1) % WILD_FRAMES.length),
      1000 / WILD_FPS,
    );
    return () => { if (wildRef.current) clearInterval(wildRef.current); };
  }, []);

  const goTo = useCallback((index: number) => {
    setCurrent((index + slides.length) % slides.length);
    startAutoPlay(); // reset timer on manual nav
  }, [slides.length, startAutoPlay]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < 40) return; // ignore tiny taps
    goTo(current + (delta < 0 ? 1 : -1));
  };

  const scrollToShop = () => {
    const el = document.getElementById('shop');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <style>{`
        /* Ken Burns variants */
        @keyframes kb-zoom-in   { from { transform: scale(1);    } to { transform: scale(1.08); } }
        @keyframes kb-pan-right { from { transform: scale(1.04) translate(-1.5%,0); } to { transform: scale(1.08) translate(1.5%,0); } }
        @keyframes kb-zoom-out  { from { transform: scale(1.08); } to { transform: scale(1);    } }
        @keyframes kb-pan-left  { from { transform: scale(1.04) translate(1.5%,0); } to { transform: scale(1.08) translate(-1.5%,0); } }

        @keyframes hero-pulse {
          0%   { box-shadow: 0 0 0 0   rgba(174,132,234,0.75), 0 4px 20px rgba(174,132,234,0.35); }
          60%  { box-shadow: 0 0 0 28px rgba(174,132,234,0),   0 4px 20px rgba(174,132,234,0.35); }
          100% { box-shadow: 0 0 0 0   rgba(174,132,234,0),    0 4px 20px rgba(174,132,234,0.35); }
        }
        @keyframes hero-pulse-2 {
          0%   { box-shadow: 0 0 0 0    rgba(220,193,255,0.6); }
          60%  { box-shadow: 0 0 0 28px rgba(220,193,255,0); }
          100% { box-shadow: 0 0 0 0    rgba(220,193,255,0); }
        }
        @keyframes hero-pulse-3 {
          0%   { box-shadow: 0 0 0 0    rgba(91,74,138,0.6); }
          60%  { box-shadow: 0 0 0 28px rgba(91,74,138,0); }
          100% { box-shadow: 0 0 0 0    rgba(91,74,138,0); }
        }
        .hero-buy-btn { animation: hero-pulse 2.2s ease-out infinite; position: relative; }
        .hero-buy-btn::before, .hero-buy-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          pointer-events: none;
        }
        .hero-buy-btn::before { animation: hero-pulse-2 2.2s ease-out 0.7s infinite; }
        .hero-buy-btn::after  { animation: hero-pulse-3 2.2s ease-out 1.4s infinite; }
        .hero-buy-btn:hover {
          animation: none;
          background: #c09ef0 !important;
          transform: translateY(-2px) scale(1.04);
          box-shadow: 0 6px 28px rgba(174,132,234,0.55) !important;
        }
        .hero-buy-btn:hover::before, .hero-buy-btn:hover::after { animation: none; }
        @keyframes hero-center-in {
          0%   { opacity: 0; transform: translateX(-50%) translateY(calc(-50% + 20px)); }
          100% { opacity: 1; transform: translateX(-50%) translateY(-50%); }
        }
        .hero-center-block {
          position: absolute; top: 42%; left: 50%;
          transform: translateX(-50%) translateY(-50%);
          animation: hero-center-in 0.9s ease-out 0.4s both;
          z-index: 5;
          display: flex; flex-direction: column; align-items: center;
          gap: clamp(6px, 1.4vh, 12px);
          width: max-content;
          max-width: 90vw;
          padding: clamp(14px, 2.5vh, 24px) clamp(20px, 4vw, 40px);
          background: none;
          backdrop-filter: none;
          -webkit-backdrop-filter: none;
          border-radius: 0;
          border: none;
        }
        .hero-tagline {
          font-family: 'tumb', serif;
          font-size: clamp(0.75rem, 2vw, 1.25rem);
          letter-spacing: 0.08em;
          color: #ae84ea;
          text-shadow: 0 2px 8px rgba(0,0,0,0.5);
          text-align: center;
          line-height: 1.3;
          white-space: nowrap;
        }
        .hero-btn-mid {
          position: absolute; bottom: 24%; left: 50%;
          transform: translateX(-50%);
          animation: hero-center-in 0.9s ease-out 0.6s both;
          z-index: 5;
        }
        .hero-logo-wrap {
          position: absolute; bottom: 6%; left: 50%;
          transform: translateX(-50%);
          animation: hero-bounce-in-logo 0.8s ease-out 0.8s both;
          z-index: 5;
        }
        @media (max-width: 767px) {
          .hero-center-block { top: 40%; gap: clamp(5px, 1.2vh, 10px); }
          .hero-tagline { font-size: clamp(0.9rem, 4vw, 1.3rem); white-space: normal; text-align: center; max-width: 60vw; }
          .hero-btn-mid { bottom: 16%; }
          .hero-wild-logo { width: clamp(640px, 128vw, 1680px) !important; }
        }
        @keyframes hero-bounce-in-logo {
          0%   { opacity: 0; transform: translateX(-50%) translateY(12px); }
          100% { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes hero-scroll-bounce {
          0%, 100% { transform: translateY(0); opacity: 0.45; }
          50%       { transform: translateY(6px); opacity: 0.85; }
        }
        .hero-arrow { animation: hero-scroll-bounce 1.4s ease-in-out infinite; }
        .hero-arrow:nth-child(2) { animation-delay: 0.18s; }
        .hero-arrow:nth-child(3) { animation-delay: 0.36s; }

        .hero-wrap { position: relative; width: 100%; height: 100vh; overflow: hidden; }
        @media (max-width: 767px) { .hero-wrap { height: 100svh; } }

        .hero-slide {
          position: absolute; inset: 0;
          opacity: 0;
          transition: opacity ${FADE_MS}ms ease-in-out;
        }
        .hero-slide.active { opacity: 1; }
        .hero-slide img {
          width: 100%; height: 100%;
          object-fit: cover; object-position: center;
          display: block;
          /* Animation name is set when slide is active — restarts naturally when class toggles */
          animation-duration: ${SLIDE_MS + FADE_MS}ms;
          animation-timing-function: ease-out;
          animation-fill-mode: both;
          animation-name: none;
        }
        .hero-slide[data-kb="0"].active img { animation-name: kb-zoom-in;   }
        .hero-slide[data-kb="1"].active img { animation-name: kb-pan-right; }
        .hero-slide[data-kb="2"].active img { animation-name: kb-zoom-out;  }
        .hero-slide[data-kb="3"].active img { animation-name: kb-pan-left;  }

        @keyframes marquee-rtl {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .hero-ticker-track {
          display: flex;
          width: max-content;
          animation: marquee-rtl 28s linear infinite;
        }
        .hero-ticker-seg {
          display: flex;
          align-items: center;
          white-space: nowrap;
          padding: 0 5em;
          font-family: 'cc-pixel-arcade-display', sans-serif;
          font-weight: 400;
          font-style: normal;
          font-size: 11px;
          letter-spacing: 0.12em;
          color: #F8F060;
          user-select: none;
        }
        .hero-ticker-seg .pink { color: #f6b8bd; }
      `}</style>

      {/* ── S1: Hero karusell ── */}
      <section style={{ position: 'relative', width: '100%', background: '#1a1208', lineHeight: 0 }}>
        <div
          className="hero-wrap"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >

          {/* Promo ticker — sits over hero images, scrolls away with section */}
          <div style={{
            position: 'absolute',
            top: 68,
            left: 0, right: 0,
            height: 30,
            zIndex: 3,
            overflow: 'hidden',
            background: 'rgba(84, 69, 80, 0.5)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
          }}>
            <div className="hero-ticker-track">
              {Array.from({ length: 16 }).map((_, i) => (
                <span key={i} className="hero-ticker-seg">
                  BUY 3 PUZZLES GET <span className="pink">&nbsp;10%&nbsp;</span> OFF
                </span>
              ))}
            </div>
          </div>

          {/* Slides */}
          {slides.map((src, i) => (
            <div
              key={src}
              className={`hero-slide${i === current ? ' active' : ''}`}
              data-kb={String(i % 4)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt="Infinity Puzzles Wild"
                loading={i === 0 ? 'eager' : 'lazy'}
              />
            </div>
          ))}

          {/* Gradient overlay */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, transparent 20%, transparent 65%, rgba(0,0,0,0.25) 100%)',
          }} />


          {/* Center block: WILD logo + tagline */}
          <div className="hero-center-block">
            {/* WILD animated logo */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={WILD_FRAMES[wildFrame]}
              alt="WILD"
              className="hero-wild-logo"
              style={{
                width: 'clamp(160px, 32vw, 420px)',
                height: 'auto',
                display: 'block',
                filter: 'drop-shadow(0 0 12px rgba(0,0,0,0.9)) drop-shadow(0 2px 4px rgba(0,0,0,0.8))',
              }}
            />

            {/* Tagline */}
            <p className="hero-tagline">
              {isSv ? 'Ett träpussel utan slut' : 'A wooden puzzle without end'}
            </p>
          </div>

          {/* Buy button — between center block and bottom logo */}
          <div className="hero-btn-mid">
            <button
              className="hero-buy-btn"
              onClick={scrollToShop}
              style={{
                fontFamily: "'eight-condensed', sans-serif",
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

          {/* Dot indicators */}
          <div style={{
            position: 'absolute', bottom: 18, left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex', gap: 7, zIndex: 6,
          }}>
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Slide ${i + 1}`}
                style={{
                  width: i === current ? 22 : 7,
                  height: 7,
                  borderRadius: 999,
                  background: i === current ? '#ae84ea' : 'rgba(255,251,245,0.45)',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  transition: 'width 0.3s, background 0.3s',
                }}
              />
            ))}
          </div>

          {/* Logo — bottom of hero */}
          <div className="hero-logo-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/SVG/infinity-puzzles-logo.png"
              alt="Infinity Puzzles"
              style={{
                width: 'clamp(110px, 26vw, 160px)',
                display: 'block',
                filter: 'none',
              }}
            />
          </div>

        </div>
      </section>

      {/* ── Scroll arrows ── */}
      <section style={{
        background: '#FFFBF5',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '14px 0 10px', lineHeight: 0,
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
