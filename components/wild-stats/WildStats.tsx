'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

const TEAL = '#5DCCA0';

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

// ─── Sphere canvas ────────────────────────────────────────────────────

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

      const proj = SPHERE_PTS.map(([x, y, z]) => {
        const rx = x * cosA - z * sinA;
        const rz = x * sinA + z * cosA;
        const fov = 2.5;
        const s = fov / (fov + rz);
        return { sx: cx + rx * R * s, sy: cy - y * R * s, z: rz };
      });

      // Edges
      for (const [i, j] of SPHERE_EDGES) {
        const avgZ = (proj[i].z + proj[j].z) / 2;
        const alpha = Math.max(0.06, 0.08 + ((avgZ + 1) / 2) * 0.28);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = TEAL;
        ctx.lineWidth = 0.75;
        ctx.beginPath();
        ctx.moveTo(proj[i].sx, proj[i].sy);
        ctx.lineTo(proj[j].sx, proj[j].sy);
        ctx.stroke();
        ctx.restore();
      }

      // Nodes back-to-front
      const sorted = proj.map((p, idx) => ({ ...p, idx })).sort((a, b) => a.z - b.z);
      for (const { sx, sy, z } of sorted) {
        const alpha = Math.min(1, 0.3 + ((z + 1) / 2) * 0.7);
        const r = Math.max(0.8, 1.1 + ((z + 1) / 2) * 2.0);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = TEAL;
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
    <canvas ref={canvasRef} width={72} height={72} aria-hidden="true" style={{ display: 'block' }} />
  );
}

// ─── 19 dot grid ─────────────────────────────────────────────────────

function DotGrid() {
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
        return <circle key={i} cx={cx} cy={cy} r={R} fill={TEAL} opacity={opacity} />;
      })}
    </svg>
  );
}

// ─── Diameter icon ────────────────────────────────────────────────────

function DiameterIcon() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" aria-hidden="true">
      <circle cx="36" cy="36" r="27" stroke={TEAL} strokeWidth="1.3" strokeOpacity="0.4" />
      <line x1="9" y1="36" x2="63" y2="36" stroke={TEAL} strokeWidth="1.9" strokeDasharray="5 3.5" />
      <line x1="9"  y1="30" x2="9"  y2="42" stroke={TEAL} strokeWidth="1.4" strokeOpacity="0.6" />
      <line x1="63" y1="30" x2="63" y2="42" stroke={TEAL} strokeWidth="1.4" strokeOpacity="0.6" />
    </svg>
  );
}

// ─── Dalahäst — original colours, 80% bigger ─────────────────────────

function DalaIcon() {
  // Original was 66×43 px; ×1.8 = 119×77 px
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Image
        src="/images/DALAHÄST.png"
        alt=""
        width={119}
        height={77}
        style={{ objectFit: 'contain' }}
        aria-hidden="true"
      />
    </div>
  );
}

// ─── Section ─────────────────────────────────────────────────────────

export default function WildStats() {
  const t = useTranslations('stats');

  const cards = [
    {
      icon: <SphereCanvas />,
      text: t('formations'),
      label: null,
    },
    {
      icon: <DotGrid />,
      text: t('characters'),
      label: null,
    },
    {
      icon: <DiameterIcon />,
      text: t('diameter'),
      label: null,
    },
    {
      icon: <DalaIcon />,
      text: t('sweden'),
      label: null,
    },
  ];

  return (
    <section style={{ background: '#FFFBF5', padding: '0 0 80px' }}>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 16px' }}>
        <div className="grid grid-cols-2 md:grid-cols-4">
          {cards.map((card, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 14,
                padding: 'clamp(16px, 2.5vw, 28px) clamp(12px, 3vw, 28px)',
              }}
            >
              {/* Icon */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 80 }}>
                {card.icon}
              </div>

              {/* Main text */}
              <div
                style={{
                  fontFamily: "'eight-condensed', Georgia, serif",
                  fontWeight: 900,
                  fontSize: 'clamp(1.15rem, 2.4vw, 1.65rem)',
                  letterSpacing: '0.04em',
                  color: TEAL,
                  textAlign: 'center',
                  lineHeight: 1.15,
                }}
              >
                {card.text}
              </div>

              {/* Small label (card 4 only) */}
              {card.label && (
                <div
                  style={{
                    fontSize: '0.68rem',
                    letterSpacing: '0.13em',
                    textTransform: 'uppercase',
                    color: TEAL,
                    opacity: 0.55,
                    textAlign: 'center',
                  }}
                >
                  {card.label}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
