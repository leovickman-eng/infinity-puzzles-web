'use client';

import { useParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

const NAV = [
  {
    key: 'cheat',
    label: 'CHEAT',
    sub: 'Utforska nätverket',
    href: '/WILD_NETWORK',
    color: '#ae84ea',
    border: 'rgba(174,132,234,0.45)',
    bg: 'rgba(174,132,234,0.08)',
  },
  {
    key: 'stories',
    label: 'STORIES',
    sub: 'Möt karaktärerna',
    href: '/universe/stories',
    color: '#0EC7B4',
    border: 'rgba(14,199,180,0.45)',
    bg: 'rgba(14,199,180,0.07)',
  },
  {
    key: 'shop',
    label: 'SHOP',
    sub: 'Infinity Puzzles',
    href: '/',
    color: '#FFD23F',
    border: 'rgba(255,210,63,0.45)',
    bg: 'rgba(255,210,63,0.07)',
  },
];

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

function buildNebula(w: number, h: number): HTMLCanvasElement {
  const nc = document.createElement('canvas');
  nc.width = w; nc.height = h;
  const ctx = nc.getContext('2d')!;
  const blobs = [
    { cx: 0.25, cy: 0.30, r: 0.35, col: '#1a0535', op: 0.35 },
    { cx: 0.75, cy: 0.65, r: 0.30, col: '#050a30', op: 0.30 },
    { cx: 0.50, cy: 0.50, r: 0.25, col: '#0d1525', op: 0.20 },
  ];
  ctx.filter = 'blur(80px)';
  for (const b of blobs) {
    const gr = ctx.createRadialGradient(b.cx * w, b.cy * h, 0, b.cx * w, b.cy * h, b.r * w);
    const rv = parseInt(b.col.slice(1, 3), 16);
    const gv = parseInt(b.col.slice(3, 5), 16);
    const bv = parseInt(b.col.slice(5, 7), 16);
    gr.addColorStop(0, `rgba(${rv},${gv},${bv},${b.op})`);
    gr.addColorStop(1, `rgba(${rv},${gv},${bv},0)`);
    ctx.fillStyle = gr;
    ctx.fillRect(0, 0, w, h);
  }
  ctx.filter = 'none';
  return nc;
}

function StarCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const STARS = genStars();
    let W = 0, H = 0;
    let nebula: HTMLCanvasElement | null = null;
    let animId = 0;

    function resize() {
      W = canvas!.width  = window.innerWidth;
      H = canvas!.height = window.innerHeight;
      nebula = buildNebula(W, H);
    }
    resize();
    window.addEventListener('resize', resize);

    function draw(ts: number) {
      animId = requestAnimationFrame(draw);
      ctx.fillStyle = '#0d0a12';
      ctx.fillRect(0, 0, W, H);
      if (nebula) ctx.drawImage(nebula, 0, 0);

      // Small + medium (static)
      for (const s of STARS.small) {
        ctx.beginPath(); ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220,210,255,${s.a})`; ctx.fill();
      }
      for (const s of STARS.medium) {
        ctx.beginPath(); ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220,210,255,${s.a})`; ctx.fill();
      }
      // Bright (twinkle)
      for (const s of STARS.bright) {
        const a = Math.min(1, Math.max(0, s.baseA + 0.3 * Math.sin(ts * 0.0008 + s.phase)));
        ctx.beginPath(); ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220,210,255,${a.toFixed(3)})`; ctx.fill();
      }
    }

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}

export default function UniversePage() {
  const params = useParams();
  const locale = (params?.locale as string) ?? 'en';

  return (
    <div style={{
      minHeight: '100svh',
      background: '#0d0a12',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      fontFamily: "'DM Sans', sans-serif",
      overflow: 'hidden',
      position: 'relative',
    }}>

      {/* Animated star background */}
      <StarCanvas />

      {/* Purple glow on top of stars */}
      <div style={{
        position: 'absolute',
        top: '30%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px', height: '400px',
        background: 'radial-gradient(ellipse, rgba(174,132,234,0.09) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 1,
      }} />

      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '64px', position: 'relative', zIndex: 2 }}>
        <h1 style={{
          fontFamily: "'benguiat-pro-itc', serif",
          fontSize: 'clamp(2.8rem, 10vw, 6rem)',
          fontWeight: 400,
          color: '#ae84ea',
          margin: 0,
          letterSpacing: '0.04em',
          lineHeight: 1,
        }}>
          WILD UNIVERSE
        </h1>
        <div style={{
          width: '48px', height: '1px',
          background: 'rgba(174,132,234,0.3)',
          margin: '24px auto 0',
        }} />
      </div>

      {/* Buttons */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '100%',
        maxWidth: '360px',
        position: 'relative',
        zIndex: 2,
      }}>
        {NAV.map(({ key, label, sub, href, color, border, bg }) => (
          <a
            key={key}
            href={`/${locale}${href}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '20px 28px',
              background: bg,
              border: `1px solid ${border}`,
              borderRadius: '14px',
              textDecoration: 'none',
              transition: 'background 0.2s, border-color 0.2s, transform 0.15s',
              cursor: 'pointer',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget;
              el.style.background = bg.replace('0.07', '0.14').replace('0.08', '0.16');
              el.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              const el = e.currentTarget;
              el.style.background = bg;
              el.style.transform = 'translateY(0)';
            }}
          >
            <div>
              <div style={{
                fontFamily: "'benguiat-pro-itc', serif",
                fontSize: '1.5rem',
                color,
                letterSpacing: '0.06em',
                lineHeight: 1,
                marginBottom: '4px',
              }}>
                {label}
              </div>
              <div style={{
                fontSize: '11px',
                color: 'rgba(240,234,248,0.35)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}>
                {sub}
              </div>
            </div>
            <div style={{ color, opacity: 0.6, fontSize: '18px' }}>→</div>
          </a>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        position: 'absolute',
        bottom: '24px',
        fontSize: '10px',
        color: 'rgba(240,234,248,0.15)',
        letterSpacing: '2px',
        textTransform: 'uppercase',
        zIndex: 2,
      }}>
        Infinity Puzzles
      </div>
    </div>
  );
}
