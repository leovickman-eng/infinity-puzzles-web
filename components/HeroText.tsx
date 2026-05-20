'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

function ArtWord() {
  const [on, setOn] = useState(false);
  return (
    <span
      onMouseEnter={() => setOn(true)}
      onMouseLeave={() => setOn(false)}
      style={{
        color: on ? '#57d494' : 'inherit',
        transition: 'color 0.35s ease',
        cursor: 'default',
      }}
    >
      Art
    </span>
  );
}

function MathWord() {
  const [on, setOn] = useState(false);
  return (
    <span
      onMouseEnter={() => setOn(true)}
      onMouseLeave={() => setOn(false)}
      style={{ position: 'relative', cursor: 'default' }}
    >
      Math
      <span
        aria-hidden
        style={{
          position: 'absolute',
          inset: '-2px -3px',
          opacity: on ? 1 : 0,
          transition: 'opacity 0.3s ease',
          pointerEvents: 'none',
          backgroundImage: `
            repeating-linear-gradient(0deg, rgba(74,70,75,0.09) 0px, rgba(74,70,75,0.09) 1px, transparent 1px, transparent 10px),
            repeating-linear-gradient(90deg, rgba(74,70,75,0.09) 0px, rgba(74,70,75,0.09) 1px, transparent 1px, transparent 10px)
          `,
        }}
      />
    </span>
  );
}

function MagicWord() {
  const [on, setOn] = useState(false);
  return (
    <span
      onMouseEnter={() => setOn(true)}
      onMouseLeave={() => setOn(false)}
      style={{
        textShadow: on
          ? '0 0 16px rgba(218,193,255,0.9), 0 0 36px rgba(154,132,188,0.55)'
          : 'none',
        transition: 'text-shadow 0.35s ease',
        cursor: 'default',
      }}
    >
      Magic
    </span>
  );
}

export default function HeroText() {
  const blockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      blockRef.current,
      { opacity: 0, y: 26 },
      { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out', delay: 0.25 },
    );
  }, []);

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
      style={{ zIndex: 10 }}
    >
      <div className="max-w-[700px] w-full px-6 text-center flex flex-col gap-8">

        {/* All three beats appear as one block */}
        <div ref={blockRef} style={{ display: 'flex', flexDirection: 'column', gap: '2rem', pointerEvents: 'auto' }}>

          {/* Beat 1 — logo */}
          <img
            src="/images/SVG/Logga_gradient.svg"
            alt="Infinity Puzzles"
            style={{ width: 'min(480px, 80vw)', height: 'auto', display: 'block', margin: '0 auto' }}
          />

          {/* Beat 2 — Art. Math. Magic. */}
          <span
            style={{
              fontFamily: 'Nakone, Georgia, serif',
              fontSize: 'clamp(1.6rem, 4vw, 3rem)',
              color: '#4a464b',
              lineHeight: 1.2,
              display: 'block',
            }}
          >
            <ArtWord />, <MathWord />, and a bit of <MagicWord />.
          </span>

          {/* Beat 3 — softer line */}
          <span
            style={{
              fontFamily: 'Nakone, Georgia, serif',
              fontSize: 'clamp(1.1rem, 2.2vw, 1.75rem)',
              color: 'rgba(74,70,75,0.55)',
              lineHeight: 1.45,
              display: 'block',
              fontWeight: 300,
            }}
          >
            Shapes, colors, stories you haven&apos;t seen before.
          </span>

        </div>

        {/* Beat 4 — always visible, pulsing */}
        <div>
          <span
            className="animate-pulse"
            style={{
              fontFamily: 'Nakone, Georgia, serif',
              fontSize: '0.95rem',
              color: 'rgba(74,70,75,0.38)',
              letterSpacing: '0.08em',
              display: 'inline-block',
            }}
          >
            Scroll. ↓
          </span>
        </div>

      </div>
    </div>
  );
}
