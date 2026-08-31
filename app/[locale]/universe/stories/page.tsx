'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

/* ── Star canvas (same as universe page) ─────────────────────────────────── */
function rnd(min: number, max: number) { return min + Math.random() * (max - min); }

function genStars() {
  const small:  { x: number; y: number; r: number; a: number }[] = [];
  const medium: { x: number; y: number; r: number; a: number }[] = [];
  const bright: { x: number; y: number; r: number; baseA: number; phase: number }[] = [];
  for (let i = 0; i < 300; i++) small.push({ x: Math.random(), y: Math.random(), r: rnd(0.2, 0.8),  a: rnd(0.15, 0.5) });
  for (let i = 0; i < 60;  i++) medium.push({ x: Math.random(), y: Math.random(), r: rnd(0.8, 1.4),  a: rnd(0.4,  0.8) });
  for (let i = 0; i < 20;  i++) bright.push({ x: Math.random(), y: Math.random(), r: rnd(1.4, 2.2),  baseA: rnd(0.7, 1.0), phase: rnd(0, Math.PI * 2) });
  return { small, medium, bright };
}

function StarCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const STARS = genStars();
    let W = 0, H = 0, animId = 0;
    function resize() {
      W = canvas!.width  = window.innerWidth;
      H = canvas!.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);
    function draw(ts: number) {
      animId = requestAnimationFrame(draw);
      ctx.fillStyle = '#0d0a12';
      ctx.fillRect(0, 0, W, H);
      for (const s of STARS.small) {
        ctx.beginPath(); ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220,210,255,${s.a})`; ctx.fill();
      }
      for (const s of STARS.medium) {
        ctx.beginPath(); ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220,210,255,${s.a})`; ctx.fill();
      }
      for (const s of STARS.bright) {
        const a = Math.min(1, Math.max(0, s.baseA + 0.3 * Math.sin(ts * 0.0008 + s.phase)));
        ctx.beginPath(); ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220,210,255,${a.toFixed(3)})`; ctx.fill();
      }
    }
    animId = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);
  return (
    <canvas ref={canvasRef} style={{
      position: 'fixed', inset: 0, width: '100%', height: '100%',
      pointerEvents: 'none', zIndex: 0,
    }} />
  );
}

/* ── Character data ───────────────────────────────────────────────────────── */
export const CHARACTERS = [
  { id: 1,  name: 'Dolores',       animal: 'Narval',     audio: false },
  { id: 2,  name: 'Zuki',          animal: 'Rådjur',     audio: false },
  { id: 3,  name: 'Mani',          animal: 'Tukan',      audio: false },
  { id: 4,  name: 'Ziggy-Lou',     animal: 'Räv',        audio: true  },
  { id: 5,  name: 'Lana',          animal: 'Lama',       audio: true  },
  { id: 6,  name: 'Tanya',         animal: 'Tiger',      audio: false },
  { id: 7,  name: 'Mambo Viento',  animal: 'Drake',      audio: true  },
  { id: 8,  name: 'Dali',          animal: 'Kamelont',   audio: true  },
  { id: 9,  name: 'Pinto',         animal: 'Leopard',    audio: true  },
  { id: 10, name: 'Sixten',        animal: 'Katt',       audio: false },
  { id: 11, name: 'Coco',          animal: 'Fågel',      audio: false },
  { id: 12, name: 'Mona Moon',     animal: 'Ko',         audio: false },
  { id: 13, name: 'Borro',         animal: 'Noshörning', audio: true  },
  { id: 14, name: 'Pepe',          animal: 'Pingvin',    audio: false },
  { id: 15, name: 'Ronda',         animal: 'Krokodil',   audio: true  },
  { id: 16, name: 'Rumi',          animal: 'Papegoja',   audio: true  },
  { id: 17, name: 'Daffy Giraffy', animal: 'Giraff',     audio: false },
  { id: 18, name: 'Jerry',         animal: 'Hund',       audio: false },
  { id: 19, name: 'Mira',          animal: 'Kamel',      audio: false },
];

const gridCSS = `
  .stories-grid {
    grid-template-columns: repeat(4, 1fr);
  }
  @media (min-width: 500px) {
    .stories-grid { grid-template-columns: repeat(5, 1fr); }
  }
  @media (min-width: 680px) {
    .stories-grid { grid-template-columns: repeat(6, 1fr); }
  }
`;

/* ── Page ─────────────────────────────────────────────────────────────────── */
export default function StoriesPage() {
  const params = useParams();
  const locale = (params?.locale as string) ?? 'en';

  return (
    <div style={{
      minHeight: '100svh',
      background: '#0d0a12',
      color: '#f0eaf8',
      padding: '0 0 80px',
      position: 'relative',
    }}>
      <style>{gridCSS}</style>
      <StarCanvas />

      {/* Top bar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        padding: '18px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'linear-gradient(to bottom, rgba(13,10,18,0.98) 60%, transparent)',
      }}>
        <Link href={`/${locale}/universe`} style={{
          color: 'rgba(240,234,248,0.4)', fontSize: '13px',
          textDecoration: 'none', fontFamily: "'DM Sans', sans-serif",
          letterSpacing: '0.06em', transition: 'color 0.15s',
        }}
          onMouseEnter={e => (e.currentTarget.style.color = '#ae84ea')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(240,234,248,0.4)')}
        >
          ← Universe
        </Link>
        <span style={{
          fontFamily: "'eight-condensed', sans-serif",
          fontSize: '1.1rem', color: '#ae84ea', letterSpacing: '0.06em',
        }}>
          STORIES
        </span>
      </div>

      {/* Grid */}
      <div
        className="stories-grid"
        style={{
          display: 'grid',
          gap: '10px',
          padding: '16px 16px',
          maxWidth: '700px',
          margin: '0 auto',
          position: 'relative', zIndex: 1,
        }}
      >
        {CHARACTERS.map(ch => (
          <Link
            key={ch.id}
            href={`/${locale}/universe/stories/${ch.id}`}
            style={{ textDecoration: 'none', display: 'block', position: 'relative' }}
          >
            <div style={{
              position: 'relative',
              overflow: 'hidden',
              aspectRatio: '3/4',
              background: '#1a1530',
              borderRadius: '14px',
            }}>
              <img
                src={`/images/posters/poster_${String(ch.id).padStart(2, '0')}.webp`}
                alt={ch.name}
                style={{
                  width: '100%', height: '100%',
                  objectFit: 'cover', display: 'block',
                  transition: 'transform 0.35s ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.06)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
              />

              {/* Audio dot */}
              {ch.audio && (
                <div style={{
                  position: 'absolute', top: '8px', right: '8px',
                  width: '8px', height: '8px',
                  background: '#ae84ea',
                  borderRadius: '50%',
                }} />
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
