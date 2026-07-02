'use client';

import { useState, useRef } from 'react';

const N = 19;
const CHARS = Array.from({ length: N }, (_, i) => ({
  id: i + 1,
  src: `/images/posters/poster_${String(i + 1).padStart(2, '0')}.webp`,
  alt: `Character ${i + 1}`,
}));

function mod(n: number, m: number) { return ((n % m) + m) % m; }

const SWIPE_THRESHOLD = 40; // px

export default function CharacterCarousel() {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const go = (delta: number) => setCurrent(c => mod(c + delta, N));

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > SWIPE_THRESHOLD) go(dx < 0 ? 1 : -1);
    touchStartX.current = null;
  };

  return (
    <div
      style={{ overflow: 'hidden', touchAction: 'pan-y' }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div style={{ perspective: '1200px', position: 'relative', height: '300px', overflow: 'hidden' }}>
        {CHARS.map((char, idx) => {
          let offset = idx - current;
          if (offset >  N / 2) offset -= N;
          if (offset < -N / 2) offset += N;

          const abs      = Math.abs(offset);
          const visible  = abs <= 2;
          const scale    = abs === 0 ? 1 : abs === 1 ? 0.82 : 0.65;
          const rotateY  = abs === 0 ? 0 : -(offset / abs) * (abs === 1 ? 35 : 55);
          const translateX = offset * 200;
          const opacity  = !visible ? 0 : abs === 2 ? 0.7 : abs === 1 ? 0.9 : 1;
          const zIndex   = visible ? 3 - abs : 0;
          const isSide   = visible && offset !== 0;

          return (
            <div
              key={char.id}
              onClick={isSide ? () => setCurrent(idx) : undefined}
              style={{
                position:  'absolute',
                left:      '50%',
                top:       '50%',
                width:     '200px',
                transform: `translate(-50%, -50%) translateX(${translateX}px) rotateY(${rotateY}deg) scale(${scale})`,
                transition: 'transform 0.4s ease, opacity 0.4s ease',
                zIndex,
                opacity,
                cursor:        isSide ? 'pointer' : 'default',
                pointerEvents: visible ? 'auto' : 'none',
              }}
            >
              <img
                src={char.src}
                alt={char.alt}
                draggable={false}
                style={{
                  width: '100%', height: 'auto', display: 'block',
                  borderRadius: '10px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.12)',
                }}
              />
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', marginTop: '2.5rem' }}>
        <button
          onClick={() => go(-1)}
          aria-label="Previous character"
          style={{ fontSize: '1.8rem', color: '#5B4A8A', background: 'none', border: 'none', cursor: 'pointer', lineHeight: 1, padding: '0.25rem 0.75rem' }}
        >←</button>
        <button
          onClick={() => go(1)}
          aria-label="Next character"
          style={{ fontSize: '1.8rem', color: '#5B4A8A', background: 'none', border: 'none', cursor: 'pointer', lineHeight: 1, padding: '0.25rem 0.75rem' }}
        >→</button>
      </div>
    </div>
  );
}
