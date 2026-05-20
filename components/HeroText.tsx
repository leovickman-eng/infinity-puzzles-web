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
      Play
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

type Particle = {
  x: number; y: number;
  vx: number; vy: number;
  alpha: number; color: string; size: number;
};
const GLITTER_COLORS = ['#ae84ea', '#f6b8bd', '#5B4A8A'];
const CANVAS_W = 320;
const CANVAS_H = 210;

function MagicWord() {
  const [on, setOn]   = useState(false);
  const canvasRef     = useRef<HTMLCanvasElement>(null);
  const particles     = useRef<Particle[]>([]);
  const rafRef        = useRef(0);
  const hovering      = useRef(false);

  const spawnBurst = (count: number) => {
    for (let i = 0; i < count; i++) {
      particles.current.push({
        x:     CANVAS_W / 2 + (Math.random() - 0.5) * 90,
        y:     CANVAS_H * 0.42,
        vx:    (Math.random() - 0.5) * 7,
        vy:    -Math.random() * 6 - 0.5,
        alpha: 1,
        color: GLITTER_COLORS[Math.floor(Math.random() * GLITTER_COLORS.length)],
        size:  1.5 + Math.random() * 3,
      });
    }
  };

  const tick = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (hovering.current) spawnBurst(3);

    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
    particles.current = particles.current.filter(p => p.alpha > 0.02);

    for (const p of particles.current) {
      p.vy    += 0.22;
      p.x     += p.vx;
      p.y     += p.vy;
      p.alpha -= 0.022;
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle   = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    if (particles.current.length > 0) {
      rafRef.current = requestAnimationFrame(tick);
    } else {
      rafRef.current = 0;
    }
  };

  const handleEnter = () => {
    hovering.current = true;
    setOn(true);
    spawnBurst(18);
    if (!rafRef.current) rafRef.current = requestAnimationFrame(tick);
  };

  const handleLeave = () => {
    hovering.current = false;
    setOn(false);
  };

  useEffect(() => () => { cancelAnimationFrame(rafRef.current); }, []);

  return (
    <span style={{ position: 'relative', display: 'inline-block', cursor: 'default' }}>
      <canvas
        ref={canvasRef}
        width={CANVAS_W}
        height={CANVAS_H}
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -42%)',
          pointerEvents: 'none',
          zIndex: 20,
        }}
      />
      <span
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        style={{
          textShadow: on
            ? '0 0 16px rgba(218,193,255,0.9), 0 0 36px rgba(154,132,188,0.55)'
            : 'none',
          transition: 'text-shadow 0.35s ease',
        }}
      >
        Magic
      </span>
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1920 1080"
            fill="#5B4A8A"
            aria-label="Infinity Puzzles"
            style={{ width: 'min(300px, 80vw)', height: 'auto', display: 'block', margin: '0 auto' }}
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

          {/* Beat 2 — Art. Math. Magic. */}
          <span
            style={{
              fontFamily: 'Nakone, Georgia, serif',
              fontSize: 'clamp(1.6rem, 4vw, 3rem)',
              color: '#5B4A8A',
              lineHeight: 1.2,
              letterSpacing: '0.04em',
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
              color: '#5B4A8A',
              lineHeight: 1.45,
              letterSpacing: '0.04em',
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
              color: '#e81317',
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
