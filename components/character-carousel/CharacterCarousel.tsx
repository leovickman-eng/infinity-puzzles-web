'use client';

import { useState } from 'react';

const N = 19;
const CHARS = Array.from({ length: N }, (_, i) => ({
  id: i + 1,
  src: `/images/posters/poster_${String(i + 1).padStart(2, '0')}.webp`,
  alt: `Character ${i + 1}`,
}));

function mod(n: number, m: number) { return ((n % m) + m) % m; }

export default function CharacterCarousel() {
  const [current, setCurrent] = useState(0);

  const go = (delta: number) => setCurrent(c => mod(c + delta, N));

  return (
    <div style={{ overflow: 'hidden' }}>
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

          return (
            <div
              key={char.id}
              onClick={() => visible && offset !== 0 && setCurrent(idx)}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: '200px',
                transform: `translate(-50%, -50%) translateX(${translateX}px) rotateY(${rotateY}deg) scale(${scale})`,
                transition: 'transform 0.4s ease, opacity 0.4s ease',
                zIndex,
                opacity,
                cursor: visible && offset !== 0 ? 'pointer' : 'default',
                pointerEvents: visible && offset !== 0 ? 'auto' : 'none',
              }}
            >
              <img
                src={char.src}
                alt={char.alt}
                draggable={false}
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', marginTop: '2.5rem' }}>
        <button
          onClick={() => go(-1)}
          aria-label="Previous character"
          style={{
            fontSize: '1.8rem',
            color: '#5B4A8A',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            lineHeight: 1,
            padding: '0.25rem 0.75rem',
          }}
        >←</button>
        <button
          onClick={() => go(1)}
          aria-label="Next character"
          style={{
            fontSize: '1.8rem',
            color: '#5B4A8A',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            lineHeight: 1,
            padding: '0.25rem 0.75rem',
          }}
        >→</button>
      </div>
    </div>
  );
}
