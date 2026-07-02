'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

// Slow blink: golden-angle stagger → bara 1-2 prickar dimmar åt gången
const GOLDEN_S = 2.399963;
const BLINK_W  = 1.38; // ~0.22 Hz → period ≈ 4.5 s per pricka
function blinkAlpha(now: number, i: number): number {
  const narrow = Math.pow(Math.max(0, Math.sin(now * BLINK_W + i * GOLDEN_S)), 8);
  return 0.9 - 0.75 * narrow;
}

// ─── Fibonacci sphere (card 1) ────────────────────────────────────────

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
    pts
      .map((p, j) => ({ j, d: Math.hypot(p[0]-pts[i][0], p[1]-pts[i][1], p[2]-pts[i][2]) }))
      .filter(x => x.j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, k)
      .forEach(({ j }) => { if (j > i) edges.push([i, j]); });
  }
  return edges;
}

const SPHERE_EDGES = buildEdges(SPHERE_PTS, 3);

function SphereCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const angleRef  = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const W = 60, cx = 30, cy = 30, R = 22;

    const draw = () => {
      ctx.clearRect(0, 0, W, W);
      const a = angleRef.current;
      const cosA = Math.cos(a), sinA = Math.sin(a);

      const proj = SPHERE_PTS.map(([x, y, z]) => {
        const rx = x * cosA - z * sinA;
        const rz = x * sinA + z * cosA;
        const fov = 2.5, s = fov / (fov + rz);
        return { sx: cx + rx * R * s, sy: cy - y * R * s, z: rz };
      });

      for (const [i, j] of SPHERE_EDGES) {
        const avgZ = (proj[i].z + proj[j].z) / 2;
        const alpha = Math.max(0.05, 0.07 + ((avgZ + 1) / 2) * 0.25);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = '#5B4A8A';
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.moveTo(proj[i].sx, proj[i].sy);
        ctx.lineTo(proj[j].sx, proj[j].sy);
        ctx.stroke();
        ctx.restore();
      }

      [...proj]
        .map((p, idx) => ({ ...p, idx }))
        .sort((a, b) => a.z - b.z)
        .forEach(({ sx, sy, z }) => {
          const alpha = Math.min(1, 0.3 + ((z + 1) / 2) * 0.7);
          const r     = Math.max(0.8, 1.0 + ((z + 1) / 2) * 1.8);
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.fillStyle = '#5B4A8A';
          ctx.beginPath();
          ctx.arc(sx, sy, r, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });

      angleRef.current += 0.005;
      rafRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <canvas ref={canvasRef} width={60} height={60} aria-hidden="true" style={{ display: 'block' }} />
  );
}

// ─── 19 dot grid (card 2) — animated slow blink ──────────────────────

function DotGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const pts: [number, number][] = [
    [18,18],[18,9],[9,18],[27,18],[18,27],
    [9,9],[27,9],[9,27],[27,27],[0,18],
    [36,18],[18,0],[18,36],[0,9],[36,9],
    [0,27],[36,27],[9,0],[27,0],
  ];
  const W = 48, H = 48;

  useEffect(() => {
    const cv = canvasRef.current; if (!cv) return;
    const ctx = cv.getContext('2d')!;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const now = performance.now() / 1000;
      pts.forEach(([x, y], i) => {
        const alpha = blinkAlpha(now, i);
        ctx.fillStyle = `rgba(93,204,160,${alpha.toFixed(2)})`;
        ctx.beginPath(); ctx.arc(x + 6, y + 6, 2.5, 0, Math.PI * 2); ctx.fill();
      });
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return <canvas ref={canvasRef} width={W} height={H} aria-hidden="true" style={{ display: 'block' }} />;
}

// ─── Diameter circle (card 3) ────────────────────────────────────────

function DiameterIcon() {
  return (
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none" aria-hidden="true">
      <circle cx="30" cy="30" r="24" stroke="#ae84ea" strokeWidth="2.2" strokeOpacity="0.5" />
      <line x1="6" y1="30" x2="54" y2="30" stroke="#ae84ea" strokeWidth="1.8" strokeDasharray="4.5 3" />
      <line x1="6"  y1="24" x2="6"  y2="36" stroke="#ae84ea" strokeWidth="1.8" strokeOpacity="0.7" />
      <line x1="54" y1="24" x2="54" y2="36" stroke="#ae84ea" strokeWidth="1.8" strokeOpacity="0.7" />
    </svg>
  );
}

// ─── Dalahäst with red duotone (card 4) ──────────────────────────────
// Two filter strengths — swap constant to switch
// A = bolder duotone, B = subtler (keeps more texture)
const DALA_FILTER_A = 'grayscale(1) sepia(1) hue-rotate(320deg) saturate(3) brightness(0.88)';
const DALA_FILTER_B = 'grayscale(0.7) sepia(0.8) hue-rotate(315deg) saturate(2.2) brightness(0.93)';
const DALA_FILTER   = DALA_FILTER_A; // ← swap to B for lighter tint

function DalaIcon() {
  return (
    <Image
      src="/images/DALAHÄST.png?v=2"
      alt=""
      width={110}
      height={71}
      unoptimized
      style={{ objectFit: 'contain', filter: DALA_FILTER }}
      aria-hidden="true"
    />
  );
}

// ─── Section ─────────────────────────────────────────────────────────

export default function WildStats() {
  const t = useTranslations('stats');

  const cards = [
    {
      icon:         <SphereCanvas />,
      value:        t('formations'),
      valueColor:   '#5B4A8A',
      label:        null as string | null,
      valueSz:      'clamp(1rem, 2vw, 1.4rem)',
      labelDisplay: false,
    },
    {
      icon:         <DotGrid />,
      value:        t('characters'),
      valueColor:   '#5DCCA0',
      label:        null as string | null,
      valueSz:      'clamp(1rem, 2vw, 1.4rem)',
      labelDisplay: false,
    },
    {
      icon:         <DiameterIcon />,
      value:        '39 cm diameter',
      valueColor:   '#ae84ea',
      label:        null as string | null,
      valueSz:      'clamp(1rem, 2vw, 1.4rem)',
      labelDisplay: false,
    },
    {
      icon:         <DalaIcon />,
      value:        t('sweden'),
      valueColor:   '#e81317',
      label:        t('wood') as string | null,
      valueSz:      'clamp(1rem, 2.2vw, 1.4rem)',
      labelDisplay: true,
    },
  ];

  return (
    <section style={{ background: '#FFFBF5', padding: '0 0 8px' }}>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 16px' }}>
        <div className="grid grid-cols-2 md:grid-cols-4">
          {cards.map((card, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 12,
                padding: 'clamp(12px, 2vw, 20px) clamp(10px, 2vw, 24px) clamp(16px, 2.5vw, 28px)',
              }}
            >
              <div style={{ minHeight: 68, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {card.icon}
              </div>

              <div style={{
                fontFamily: "'eight-condensed', Georgia, serif",
                fontWeight: 900,
                fontSize: card.valueSz,
                letterSpacing: '0.03em',
                color: card.valueColor,
                textAlign: 'center',
                lineHeight: 1.05,
              }}>
                {card.value}
              </div>

              {card.label && (
                <div style={card.labelDisplay ? {
                  fontFamily: "'eight-condensed', Georgia, serif",
                  fontWeight: 900,
                  fontSize: 'clamp(0.85rem, 1.6vw, 1.05rem)',
                  letterSpacing: '0.04em',
                  color: 'rgba(28,25,23,0.45)',
                  textAlign: 'center',
                  lineHeight: 1.3,
                } : {
                  fontSize: '0.66rem',
                  letterSpacing: '0.13em',
                  textTransform: 'uppercase' as const,
                  color: 'rgba(28,25,23,0.4)',
                  textAlign: 'center' as const,
                  lineHeight: 1.4,
                }}>
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
