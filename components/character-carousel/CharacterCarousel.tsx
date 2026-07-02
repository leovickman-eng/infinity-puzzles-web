'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

const N = 19;
const CHARS = Array.from({ length: N }, (_, i) => ({
  id: i + 1,
  src: `/images/posters/poster_${String(i + 1).padStart(2, '0')}.webp`,
  alt: `Character ${i + 1}`,
}));

function mod(n: number, m: number) { return ((n % m) + m) % m; }

export default function CharacterCarousel() {
  const [current, setCurrent] = useState(0);
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) ?? 'en';

  const go = (delta: number) => setCurrent(c => mod(c + delta, N));

  return (
    <div style={{ overflow: 'hidden' }}>
      <div style={{ perspective: '1200px', position: 'relative', height: '300px', overflow: 'hidden' }}>
        {CHARS.map((char, idx) => {
          let offset = idx - current;
          if (offset >  N / 2) offset -= N;
          if (offset < -N / 2) offset += N;

          const abs       = Math.abs(offset);
          const visible   = abs <= 2;
          const isCenter  = offset === 0;
          const scale     = isCenter ? 1 : abs === 1 ? 0.82 : 0.65;
          const rotateY   = isCenter ? 0 : -(offset / abs) * (abs === 1 ? 35 : 55);
          const translateX = offset * 200;
          const opacity   = !visible ? 0 : abs === 2 ? 0.7 : abs === 1 ? 0.9 : 1;
          const zIndex    = visible ? 3 - abs : 0;
          const isClickable = visible && (isCenter || offset !== 0);

          const handleClick = () => {
            if (isCenter) {
              router.push(`/${locale}/universe/stories/${char.id}`);
            } else if (visible && offset !== 0) {
              setCurrent(idx);
            }
          };

          return (
            <div
              key={char.id}
              onClick={isClickable ? handleClick : undefined}
              style={{
                position:  'absolute',
                left:      '50%',
                top:       '50%',
                width:     '200px',
                transform: `translate(-50%, -50%) translateX(${translateX}px) rotateY(${rotateY}deg) scale(${scale})`,
                transition: 'transform 0.4s ease, opacity 0.4s ease',
                zIndex,
                opacity,
                cursor:      isClickable ? 'pointer' : 'default',
                pointerEvents: isClickable ? 'auto' : 'none',
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
                  transition: 'box-shadow 0.2s ease',
                }}
                onMouseEnter={e => {
                  if (isCenter) (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(91,74,138,0.45), 0 2px 8px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.12)';
                }}
              />
              {/* Subtle "tap to visit" hint on center card */}
              {isCenter && (
                <div style={{
                  position:  'absolute',
                  bottom:    10,
                  left:      '50%',
                  transform: 'translateX(-50%)',
                  background: 'rgba(0,0,0,0.45)',
                  backdropFilter: 'blur(6px)',
                  borderRadius: 20,
                  padding: '3px 10px',
                  fontSize: '10px',
                  letterSpacing: '0.08em',
                  color: 'rgba(255,255,255,0.75)',
                  fontFamily: "'DM Sans', sans-serif",
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none',
                }}>
                  Explore ↗
                </div>
              )}
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
