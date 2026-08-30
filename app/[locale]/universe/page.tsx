'use client';

import { useParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import Image from 'next/image';

const floatKeyframes = `
@keyframes float0 { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-10px)} }
@keyframes float1 { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-8px)} }
@keyframes float2 { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-12px)} }
@keyframes float3 { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-9px)} }
`;

const FLOAT_DURATIONS = ['6s', '7.5s', '5.8s', '8.2s'];
const FLOAT_DELAYS    = ['0s', '1.4s', '0.7s', '2.1s'];

const NAV: {
  key: string; label: string; sub: string; href: string;
  color: string; glow: string; img: string; size: number; offset: number; external?: boolean;
}[] = [
  {
    key: 'cheat',
    label: 'CHEAT',
    sub: 'Utforska nätverket',
    href: '/WILD_NETWORK',
    color: '#ae84ea',
    glow: 'rgba(174,132,234,0.55)',
    img: '/images/planeter/P1.PNG',
    size: 115,
    offset: 0,
  },
  {
    key: 'stories',
    label: 'STORIES',
    sub: 'Möt karaktärerna',
    href: '/universe/stories',
    color: '#5DCCA0',
    glow: 'rgba(93,204,160,0.55)',
    img: '/images/planeter/P2.PNG',
    size: 104,
    offset: 8,
  },
  {
    key: 'shop',
    label: 'SHOP',
    sub: 'Infinity Puzzles',
    href: '/',
    color: '#FFD23F',
    glow: 'rgba(255,210,63,0.55)',
    img: '/images/planeter/P3.PNG',
    size: 122,
    offset: -6,
  },
  {
    key: 'instagram',
    label: 'INSTAGRAM',
    sub: '@infinitypuzzles',
    href: 'https://www.instagram.com/infinitypuzzles/',
    color: '#F06292',
    glow: 'rgba(240,98,146,0.55)',
    img: '/images/planeter/P4.PNG',
    size: 108,
    offset: 4,
    external: true,
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
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}
    />
  );
}

// ─── Planet button ────────────────────────────────────────────────────────────
function Planet({
  color, glow, label, sub, href, external, locale, img, size, offset, floatIndex,
}: {
  color: string; glow: string; label: string; sub: string;
  href: string; external?: boolean; locale: string;
  img: string; size: number; offset: number; floatIndex: number;
}) {
  return (
    <a
      href={external ? href : `/${locale}${href}`}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: 14, textDecoration: 'none', cursor: 'pointer',
        marginTop: offset,
      }}
    >
      {/* Planet image with glow + float */}
      <div style={{
        width: size, height: size,
        filter: `drop-shadow(0 0 18px ${glow}) drop-shadow(0 0 6px ${glow})`,
        transition: 'filter 0.25s',
        animation: `float${floatIndex} ${FLOAT_DURATIONS[floatIndex]} ${FLOAT_DELAYS[floatIndex]} ease-in-out infinite`,
      }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLDivElement).style.filter = `drop-shadow(0 0 28px ${glow}) drop-shadow(0 0 12px ${glow})`;
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLDivElement).style.filter = `drop-shadow(0 0 18px ${glow}) drop-shadow(0 0 6px ${glow})`;
        }}
      >
        <Image src={img} alt={label} width={size} height={size} style={{ width: '100%', height: '100%', objectFit: 'contain' }} unoptimized />
      </div>

      {/* Label */}
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontFamily: "'eight-condensed', sans-serif",
          fontSize: '1.25rem', color, letterSpacing: '0.07em', lineHeight: 1, marginBottom: 4,
        }}>
          {label}
        </div>
        <div style={{
          fontSize: '10px', color: 'rgba(240,234,248,0.35)',
          letterSpacing: '0.1em', textTransform: 'uppercase',
        }}>
          {sub}
        </div>
      </div>
    </a>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function UniversePage() {
  const params = useParams();
  const locale = (params?.locale as string) ?? 'en';

  return (
    <div style={{
      minHeight: '100svh', background: '#0d0a12',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '60px 24px 40px', fontFamily: "'DM Sans', sans-serif",
      overflow: 'hidden', position: 'relative',
    }}>
      <style>{floatKeyframes}</style>
      <StarCanvas />

      {/* Nebula glow */}
      <div style={{
        position: 'absolute', top: '30%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px', height: '400px',
        background: 'radial-gradient(ellipse, rgba(174,132,234,0.09) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 1,
      }} />

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '52px', position: 'relative', zIndex: 2 }}>
        <h1 style={{
          fontFamily: "'eight-condensed', sans-serif",
          fontSize: 'clamp(2.8rem, 10vw, 6rem)',
          fontWeight: 400, color: '#ae84ea',
          margin: 0, letterSpacing: '0.04em', lineHeight: 1,
        }}>
          WILD UNIVERSE
        </h1>
        <div style={{ width: '48px', height: '1px', background: 'rgba(174,132,234,0.3)', margin: '20px auto 24px' }} />
        {/* Logo */}
        <Image
          src="/images/SVG/infinity-puzzles-logo-200px.png"
          alt="Infinity Puzzles"
          width={90}
          height={30}
          style={{
            display: 'block',
            margin: '0 auto',
            filter: 'brightness(0) invert(1) sepia(1) saturate(2) hue-rotate(218deg) brightness(0.82)',
          }}
          unoptimized
        />
      </div>

      {/* Planets grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '48px 32px',
        position: 'relative', zIndex: 2,
        maxWidth: 480,
        width: '100%',
        justifyItems: 'center',
      }}>
        {NAV.map(({ key, img, size, offset, ...item }, i) => (
          <Planet key={key} locale={locale} img={img} size={size} offset={offset} floatIndex={i} {...item} />
        ))}
      </div>

    </div>
  );
}
