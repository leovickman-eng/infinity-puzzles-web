'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

// ─── Fibonacci sphere ─────────────────────────────────────────────────

function fibonacciSphere(n: number): [number, number, number][] {
  const phi = Math.PI * (3 - Math.sqrt(5));
  return Array.from({ length: n }, (_, i) => {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const θ = phi * i;
    return [Math.cos(θ) * r, y, Math.sin(θ) * r];
  });
}

const SPHERE_PTS = fibonacciSphere(19);

function buildEdges(pts: [number, number, number][], k: number): [number, number][] {
  const edges: [number, number][] = [];
  for (let i = 0; i < pts.length; i++) {
    const sorted = pts
      .map((p, j) => ({
        j,
        d: Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1], p[2] - pts[i][2]),
      }))
      .filter(x => x.j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, k);
    for (const { j } of sorted) {
      if (j > i) edges.push([i, j]);
    }
  }
  return edges;
}

const SPHERE_EDGES = buildEdges(SPHERE_PTS, 3);

// ─── Sphere canvas component ──────────────────────────────────────────

function SphereCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const angleRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const W = 72, cx = 36, cy = 36, R = 26;

    const draw = () => {
      ctx.clearRect(0, 0, W, W);
      const a = angleRef.current;
      const cosA = Math.cos(a), sinA = Math.sin(a);

      // Project all 19 points onto 2D with simple perspective
      const proj = SPHERE_PTS.map(([x, y, z]) => {
        const rx = x * cosA - z * sinA;
        const rz = x * sinA + z * cosA;
        const fov = 2.5;
        const s = fov / (fov + rz);
        return { sx: cx + rx * R * s, sy: cy - y * R * s, z: rz };
      });

      // Draw edges first (behind nodes)
      for (const [i, j] of SPHERE_EDGES) {
        const avgZ = (proj[i].z + proj[j].z) / 2;
        const alpha = Math.max(0.06, 0.08 + ((avgZ + 1) / 2) * 0.28);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = '#ae84ea';
        ctx.lineWidth = 0.75;
        ctx.beginPath();
        ctx.moveTo(proj[i].sx, proj[i].sy);
        ctx.lineTo(proj[j].sx, proj[j].sy);
        ctx.stroke();
        ctx.restore();
      }

      // Draw nodes back-to-front (painter's algorithm)
      const sorted = proj.map((p, idx) => ({ ...p, idx })).sort((a, b) => a.z - b.z);
      for (const { sx, sy, z } of sorted) {
        const alpha = Math.min(1, 0.3 + ((z + 1) / 2) * 0.7);
        const r = Math.max(0.8, 1.1 + ((z + 1) / 2) * 2.0);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = '#ae84ea';
        ctx.beginPath();
        ctx.arc(sx, sy, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      angleRef.current += 0.005;
      rafRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={72}
      height={72}
      aria-hidden="true"
      style={{ display: 'block' }}
    />
  );
}

// ─── 19 dot grid ─────────────────────────────────────────────────────

function DotGrid() {
  // 4 cols × 5 rows = 20 spots, drop bottom-right → 19
  const COLS = 4, ROWS = 5, GAP = 13, R = 2.5, PAD = 6;
  const total = COLS * ROWS;
  const dots = Array.from({ length: total }, (_, i) => i).filter(i => i < total - 1);
  const W = PAD * 2 + (COLS - 1) * GAP + R * 2;
  const H = PAD * 2 + (ROWS - 1) * GAP + R * 2;

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
      {dots.map(i => {
        const col = i % COLS;
        const row = Math.floor(i / COLS);
        const cx = PAD + R + col * GAP;
        const cy = PAD + R + row * GAP;
        const opacity = 0.35 + (row / (ROWS - 1)) * 0.55;
        return (
          <circle key={i} cx={cx} cy={cy} r={R} fill="#ae84ea" opacity={opacity} />
        );
      })}
    </svg>
  );
}

// ─── Diameter icon ────────────────────────────────────────────────────

function DiameterIcon() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" aria-hidden="true">
      {/* Circle outline */}
      <circle cx="36" cy="36" r="27" stroke="#ae84ea" strokeWidth="1.3" strokeOpacity="0.4" />
      {/* Dashed diameter line — thicker per spec */}
      <line
        x1="9" y1="36" x2="63" y2="36"
        stroke="#ae84ea"
        strokeWidth="1.9"
        strokeDasharray="5 3.5"
      />
      {/* End ticks */}
      <line x1="9"  y1="30" x2="9"  y2="42" stroke="#ae84ea" strokeWidth="1.4" strokeOpacity="0.6" />
      <line x1="63" y1="30" x2="63" y2="42" stroke="#ae84ea" strokeWidth="1.4" strokeOpacity="0.6" />
    </svg>
  );
}

// ─── Dalahäst icon — two filter variants ─────────────────────────────
// Variant A (purple duotone): desaturated + purple tint
// Variant B (low contrast, keeps more original color): gentle desaturation
const DALA_FILTER_A =
  'grayscale(0.85) sepia(0.55) hue-rotate(225deg) saturate(0.65) brightness(0.88)';
const DALA_FILTER_B =
  'saturate(0.35) brightness(1.05) opacity(0.8)';

function DalaIcon() {
  return (
    <div
      style={{
        width: 72,
        height: 72,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Using variant A (purple duotone). Swap to DALA_FILTER_B to try low-contrast original. */}
      <Image
        src="/images/DALAHÄST.png"
        alt=""
        width={66}
        height={43}
        style={{ objectFit: 'contain', filter: DALA_FILTER_A }}
        aria-hidden="true"
      />
    </div>
  );
}

// ─── Card border helpers ──────────────────────────────────────────────
// On mobile (2-col): card 0 gets right+bottom, card 1 gets bottom, card 2 gets right
// On desktop (4-col): cards 0-2 get right border only
const CARD_BORDER_CLASSES = [
  'border-r border-b md:border-b-0',   // 0: top-left
  'border-b md:border-b-0 md:border-r',// 1: top-right (mobile) → middle (desktop)
  'border-r',                           // 2: bottom-left (mobile) → 3rd (desktop)
  '',                                   // 3: no border
] as const;

// ─── Section ─────────────────────────────────────────────────────────

export default function WildStats() {
  const t = useTranslations('stats');

  const cards = [
    {
      icon: <SphereCanvas />,
      value: '∞',
      label: t('formations'),
      valueFontSize: 'clamp(2.4rem, 5vw, 3.2rem)',
    },
    {
      icon: <DotGrid />,
      value: '19',
      label: t('characters'),
      valueFontSize: 'clamp(2.4rem, 5vw, 3.2rem)',
    },
    {
      icon: <DiameterIcon />,
      value: '~30 cm',
      label: t('diameter'),
      valueFontSize: 'clamp(1.7rem, 3.5vw, 2.4rem)',
    },
    {
      icon: <DalaIcon />,
      value: t('sweden'),
      label: t('design'),
      valueFontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)',
    },
  ];

  return (
    <section style={{ background: '#FFFBF5', padding: '0 0 80px' }}>
      {/* Thin top rule */}
      <div style={{ height: 1, background: 'rgba(174,132,234,0.15)', margin: '0 24px 0' }} />

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 16px' }}>
        <div
          className={[
            'grid grid-cols-2 md:grid-cols-4',
          ].join(' ')}
          style={{ borderBottom: '1px solid rgba(174,132,234,0.15)' }}
        >
          {cards.map((card, i) => (
            <div
              key={i}
              className={CARD_BORDER_CLASSES[i]}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 14,
                padding: 'clamp(32px, 5vw, 52px) clamp(16px, 3vw, 32px)',
                borderColor: 'rgba(174,132,234,0.15)',
              }}
            >
              {/* Icon area */}
              <div
                style={{
                  height: 72,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {card.icon}
              </div>

              {/* Value */}
              <div
                style={{
                  fontFamily: "'eight-condensed', Georgia, serif",
                  fontWeight: 900,
                  fontSize: card.valueFontSize,
                  letterSpacing: '0.03em',
                  color: '#1C1917',
                  textAlign: 'center',
                  lineHeight: 1.05,
                }}
              >
                {card.value}
              </div>

              {/* Label */}
              <div
                style={{
                  fontSize: '0.7rem',
                  letterSpacing: '0.13em',
                  textTransform: 'uppercase',
                  color: 'rgba(28,25,23,0.4)',
                  textAlign: 'center',
                  lineHeight: 1.4,
                }}
              >
                {card.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
