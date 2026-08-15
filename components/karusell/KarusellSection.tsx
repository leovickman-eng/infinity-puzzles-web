'use client';

import { useState, useEffect } from 'react';

const DESKTOP = [
  '/images/hero/karusell/d1.webp',
  '/images/hero/karusell/d2.webp',
  '/images/hero/karusell/d3-c.webp',
  '/images/hero/karusell/d4-c.webp',
];

const MOBILE = [
  '/images/hero/karusell/m1.webp',
  '/images/hero/karusell/m2.webp',
  '/images/hero/karusell/m3.webp',
];

const SLIDE_MS = 5000;
const FADE_MS  = 1000;

export default function KarusellSection() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [current, setCurrent]   = useState(0);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    setIsMobile(mq.matches);
    const h = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);

  const images = isMobile ? MOBILE : DESKTOP;

  useEffect(() => {
    const id = setInterval(() => setCurrent(c => (c + 1) % images.length), SLIDE_MS);
    return () => clearInterval(id);
  }, [images.length]);

  return (
    <section aria-label="Photo showcase" style={{ position: 'relative', width: '100%', background: '#0d0a12', overflow: 'hidden' }}>
      <style>{`
        /* Ken Burns zoom/pan variants */
        @keyframes kb-zoom-in    { from { transform: scale(1)    translate(0,0);       } to { transform: scale(1.08) translate(0,0);       } }
        @keyframes kb-pan-right  { from { transform: scale(1.04) translate(-1.5%,0);   } to { transform: scale(1.08) translate(1.5%,0);    } }
        @keyframes kb-zoom-out   { from { transform: scale(1.08) translate(0,0);       } to { transform: scale(1)    translate(0,0);       } }
        @keyframes kb-pan-left   { from { transform: scale(1.04) translate(1.5%,0);   } to { transform: scale(1.08) translate(-1.5%,0);   } }

        .ks-wrap { position: relative; width: 100%; height: 85vh; }
        @media (max-width: 767px) { .ks-wrap { height: 90svh; } }

        .ks-slide {
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity ${FADE_MS}ms ease-in-out;
        }
        .ks-slide.ks-active { opacity: 1; }

        .ks-slide img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
        }
        /* Each active img gets its own KB anim — key remount restarts it */
        .ks-slide[data-kb="0"] img { animation: kb-zoom-in   ${SLIDE_MS + FADE_MS}ms ease-out both; }
        .ks-slide[data-kb="1"] img { animation: kb-pan-right ${SLIDE_MS + FADE_MS}ms ease-out both; }
        .ks-slide[data-kb="2"] img { animation: kb-zoom-out  ${SLIDE_MS + FADE_MS}ms ease-out both; }
        .ks-slide[data-kb="3"] img { animation: kb-pan-left  ${SLIDE_MS + FADE_MS}ms ease-out both; }
      `}</style>

      <div className="ks-wrap">
        {images.map((src, i) => {
          const isActive = i === current;
          return (
            <div
              key={src}
              className={`ks-slide${isActive ? ' ks-active' : ''}`}
              data-kb={String(i % 4)}
            >
              {/* key remount when slide becomes active → restarts KB animation */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={isActive ? `${src}-on` : `${src}-off`}
                src={src}
                alt=""
                loading={i === 0 ? 'eager' : 'lazy'}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
