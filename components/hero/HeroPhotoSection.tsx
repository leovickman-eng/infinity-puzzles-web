'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

const DESKTOP_SLIDES = [
  '/images/hero/karusell/d1.webp',
  '/images/hero/karusell/d2.webp',
  '/images/hero/karusell/d3-c.webp',
  '/images/hero/karusell/d4-c.webp',
];

const MOBILE_SLIDES = [
  '/images/hero/karusell/m1.webp',
  '/images/hero/karusell/m2.webp',
  '/images/hero/karusell/m3.webp',
];

const SLIDE_MS = 5000;
const FADE_MS  = 1000;

export default function HeroPhotoSection() {
  const params  = useParams();
  const locale  = (params?.locale as string) ?? 'en';
  const isSv    = locale === 'sv';

  const [isMobile, setIsMobile] = useState(false);
  const [current, setCurrent]   = useState(0);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    setIsMobile(mq.matches);
    const h = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);

  const slides = isMobile ? MOBILE_SLIDES : DESKTOP_SLIDES;

  useEffect(() => {
    const id = setInterval(() => setCurrent(c => (c + 1) % slides.length), SLIDE_MS);
    return () => clearInterval(id);
  }, [slides.length]);

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
        .hero-buy-btn { animation: hero-pulse 2.2s ease-out infinite; }
        .hero-buy-btn:hover {
          animation: none;
          background: #c09ef0 !important;
          transform: translateY(-2px) scale(1.04);
          box-shadow: 0 6px 28px rgba(174,132,234,0.55) !important;
        }
        @keyframes hero-bounce-in {
          0%   { opacity: 0; transform: translateX(-50%) translateY(calc(-50% + 16px)); }
          60%  { opacity: 1; transform: translateX(-50%) translateY(calc(-50% - 4px)); }
          100% { opacity: 1; transform: translateX(-50%) translateY(-50%); }
        }
        .hero-btn-wrap {
          position: absolute; top: 45%; left: 50%;
          transform: translateX(-50%) translateY(-50%);
          animation: hero-bounce-in 0.7s cubic-bezier(0.34,1.56,0.64,1) 0.5s both;
          z-index: 5;
        }
        @keyframes hero-bounce-in-logo {
          0%   { opacity: 0; transform: translateX(-50%) translateY(12px); }
          100% { opacity: 0.88; transform: translateX(-50%) translateY(0); }
        }
        .hero-logo-wrap {
          position: absolute; bottom: 6%; left: 50%;
          transform: translateX(-50%);
          animation: hero-bounce-in-logo 0.8s ease-out 0.8s both;
          z-index: 5;
        }
        @keyframes hero-scroll-bounce {
          0%, 100% { transform: translateY(0); opacity: 0.45; }
          50%       { transform: translateY(6px); opacity: 0.85; }
        }
        .hero-arrow { animation: hero-scroll-bounce 1.4s ease-in-out infinite; }
        .hero-arrow:nth-child(2) { animation-delay: 0.18s; }
        .hero-arrow:nth-child(3) { animation-delay: 0.36s; }

        .hero-wrap { position: relative; width: 100%; height: 85vh; overflow: hidden; }
        @media (max-width: 767px) { .hero-wrap { height: 90svh; } }

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
        }
        .hero-slide[data-kb="0"] img { animation: kb-zoom-in   ${SLIDE_MS + FADE_MS}ms ease-out both; }
        .hero-slide[data-kb="1"] img { animation: kb-pan-right ${SLIDE_MS + FADE_MS}ms ease-out both; }
        .hero-slide[data-kb="2"] img { animation: kb-zoom-out  ${SLIDE_MS + FADE_MS}ms ease-out both; }
        .hero-slide[data-kb="3"] img { animation: kb-pan-left  ${SLIDE_MS + FADE_MS}ms ease-out both; }
      `}</style>

      {/* ── S1: Hero karusell ── */}
      <section style={{ position: 'relative', width: '100%', background: '#1a1208', lineHeight: 0 }}>
        <div className="hero-wrap">

          {/* Slides */}
          {slides.map((src, i) => (
            <div
              key={src}
              className={`hero-slide${i === current ? ' active' : ''}`}
              data-kb={String(i % 4)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={i === current ? `${src}-on` : `${src}-off`}
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

          {/* Buy button — centered */}
          <div className="hero-btn-wrap">
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

          {/* Logo — bottom of hero */}
          <div className="hero-logo-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/SVG/infinity-puzzles-logo.png"
              alt="Infinity Puzzles"
              style={{
                width: 'clamp(110px, 26vw, 160px)',
                opacity: 0.88,
                mixBlendMode: 'multiply',
                display: 'block',
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
