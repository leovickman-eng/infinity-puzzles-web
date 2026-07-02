'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';

// Golden angle → asynkron ("twinklande") fas-offset per pricka
const GOLDEN     = 2.399963;
const FADE_SPEED = 0.7;

// ─── Hjälp: kvadratisk grid med avtrimmade hörn ───────────────────────
// Skapar n punkter i ett kvadratiskt rutnät. Hörnen trimmas bort
// (de n punkter närmast mitten väljs) → lite rundad form.

function squareGridPoints(n: number, spacing: number): [number, number][] {
  const side = Math.ceil(Math.sqrt(n * 1.5));
  const pts: [number, number][] = [];
  for (let r = 0; r <= side; r++)
    for (let c = 0; c <= side; c++)
      pts.push([c * spacing, r * spacing]);
  const cx = (side * spacing) / 2, cy = (side * spacing) / 2;
  pts.sort((a, b) => Math.hypot(a[0]-cx, a[1]-cy) - Math.hypot(b[0]-cx, b[1]-cy));
  const chosen = pts.slice(0, n);
  const minX = Math.min(...chosen.map(p => p[0]));
  const minY = Math.min(...chosen.map(p => p[1]));
  return chosen.map(p => [p[0] - minX, p[1] - minY]);
}

const PTS_19 = squareGridPoints(19, 9);
const PTS_9  = squareGridPoints(9,  9);
const PTS_10 = squareGridPoints(10, 9);

function hexToRgb(hex: string): [number, number, number] {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

// ─── Rad 1: 19 prickar med golden-angle fade, #0d8137 ────────────────

function DotsAlone() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const [r, g, b] = hexToRgb('#0d8137');
  const maxX = Math.max(...PTS_19.map(p => p[0]));
  const maxY = Math.max(...PTS_19.map(p => p[1]));
  const W = maxX + 12, H = maxY + 12;

  useEffect(() => {
    const cv = canvasRef.current; if (!cv) return;
    const ctx = cv.getContext('2d')!;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const now = performance.now() / 1000;
      PTS_19.forEach(([x, y], i) => {
        const alpha = 0.45 + 0.275 * (1 + Math.sin(now * FADE_SPEED + i * GOLDEN));
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.beginPath(); ctx.arc(x + 6, y + 6, 2.5, 0, Math.PI * 2); ctx.fill();
      });
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return <canvas ref={canvasRef} width={W} height={H} aria-hidden="true" style={{ display: 'block' }} />;
}

// ─── Rad 2: 9 + 10 prickar sida vid sida, #dac1ff ───────────────────

function DotsSplit() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const [r, g, b] = hexToRgb('#dac1ff');

  const max9X  = Math.max(...PTS_9.map(p => p[0]));
  const max9Y  = Math.max(...PTS_9.map(p => p[1]));
  const max10X = Math.max(...PTS_10.map(p => p[0]));
  const max10Y = Math.max(...PTS_10.map(p => p[1]));
  const GAP  = 12;
  const W    = max9X + 12 + GAP + max10X + 12;
  const H    = Math.max(max9Y, max10Y) + 12;
  const OFF  = max9X + 12 + GAP;

  useEffect(() => {
    const cv = canvasRef.current; if (!cv) return;
    const ctx = cv.getContext('2d')!;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const now = performance.now() / 1000;
      // Faint dashed divider between the two groups
      const divX = max9X + 12 + GAP / 2;
      ctx.save();
      ctx.strokeStyle = 'rgba(35,30,34,0.15)';
      ctx.lineWidth = 0.6;
      ctx.setLineDash([2, 2]);
      ctx.beginPath(); ctx.moveTo(divX, 3); ctx.lineTo(divX, H - 3); ctx.stroke();
      ctx.restore();

      PTS_9.forEach(([x, y], i) => {
        const alpha = 0.45 + 0.275 * (1 + Math.sin(now * FADE_SPEED + i * GOLDEN));
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.beginPath(); ctx.arc(x + 6, y + 6, 2.5, 0, Math.PI * 2); ctx.fill();
      });
      PTS_10.forEach(([x, y], i) => {
        const alpha = 0.45 + 0.275 * (1 + Math.sin(now * FADE_SPEED + (i + 9) * GOLDEN));
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.beginPath(); ctx.arc(x + OFF + 6, y + 6, 2.5, 0, Math.PI * 2); ctx.fill();
      });
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return <canvas ref={canvasRef} width={W} height={H} aria-hidden="true" style={{ display: 'block' }} />;
}

// ─── Rad 3: rullande band (seamless loop), #544550 ───────────────────

const BAND_SP    = 20;   // avstånd mellan prickar
const BAND_N     = 19;
const BAND_TOT   = BAND_N * BAND_SP;   // 380 px total loop-längd
const BAND_W     = 120;
const BAND_H     = 14;
const BAND_FADE  = BAND_W * 0.28;      // fade-zon vid varje kant
const [BR, BG, BB] = hexToRgb('#544550');

function DotsChain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const offsetRef = useRef(0);

  useEffect(() => {
    const cv = canvasRef.current; if (!cv) return;
    const ctx = cv.getContext('2d')!;
    const draw = () => {
      ctx.clearRect(0, 0, BAND_W, BAND_H);
      const now = performance.now() / 1000;
      offsetRef.current = (offsetRef.current + 0.28) % BAND_TOT;
      const off = offsetRef.current;

      for (let i = 0; i < BAND_N; i++) {
        const x = ((i * BAND_SP - off) % BAND_TOT + BAND_TOT) % BAND_TOT;
        if (x < -3 || x > BAND_W + 3) continue;
        const edgeFade = Math.min(1, Math.min(x / BAND_FADE, (BAND_W - x) / BAND_FADE));
        const pulse    = 0.55 + 0.45 * (0.5 + 0.5 * Math.sin(now * 1.2 + i * 1.618));
        ctx.fillStyle  = `rgba(${BR},${BG},${BB},${Math.max(0, edgeFade * pulse)})`;
        ctx.beginPath(); ctx.arc(x, BAND_H / 2, 2.5, 0, Math.PI * 2); ctx.fill();
      }
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return <canvas ref={canvasRef} width={BAND_W} height={BAND_H} aria-hidden="true" style={{ display: 'block' }} />;
}

// ─── Huvud-komponent ─────────────────────────────────────────────────

export default function PlayModes() {
  const t = useTranslations('playModes');

  const rows = [
    { symbol: <DotsAlone />, text: t('alone'), color: '#0d8137'  },
    { symbol: <DotsSplit />, text: t('split'), color: '#dac1ff'  },
    { symbol: <DotsChain />, text: t('chain'), color: '#544550'  },
  ];

  return (
    <section style={{
      background: '#FFFBF5',
      padding: '0 clamp(24px, 6vw, 80px) clamp(48px, 7vw, 80px)',
    }}>
      <div style={{ maxWidth: 680, margin: '0 auto', display: 'flex', flexDirection: 'column' }}>
        {rows.map(({ symbol, text, color }, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(16px, 3vw, 28px)',
              padding: 'clamp(14px, 2.5vw, 22px) 0',
              borderBottom: i < rows.length - 1 ? '1px solid rgba(13,129,55,0.13)' : 'none',
            }}
          >
            {/* Symbol — fast bredd så texterna ligger i linje */}
            <div style={{
              flexShrink: 0,
              width: 132,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}>
              {symbol}
            </div>

            <p style={{
              fontFamily: "'eight-condensed', Georgia, serif",
              fontWeight: 900,
              fontSize: 'clamp(1.4rem, 3vw, 2.2rem)',
              color,
              margin: 0,
              letterSpacing: '0.02em',
              lineHeight: 1.2,
            }}>
              {text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
