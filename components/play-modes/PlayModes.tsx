'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';

// Golden angle → staggerar blink-faserna så bara 1-2 prickar dimmar åt gången
const GOLDEN  = 2.399963;
const BLINK_W = 1.38;   // ≈ 0.22 Hz → period ~4.5 s per pricka

// ─── Slow blink helper ─────────────────────────────────────────────────────
// Normalt alpha ~0.9, smala kortvariga dipp ned mot ~0.15, max 1-2 åt gången
function blinkAlpha(now: number, i: number): number {
  const narrow = Math.pow(Math.max(0, Math.sin(now * BLINK_W + i * GOLDEN)), 8);
  return 0.9 - 0.75 * narrow;
}

// ─── Hjälp: kvadratisk grid med avtrimmade hörn ────────────────────────────
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

// ─── Kolumn 1: 19 prickar, slow blink, #0d8137 ────────────────────────────

function DotsAlone() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const [r, g, b] = hexToRgb('#ae84ea');
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
        const alpha = blinkAlpha(now, i);
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha.toFixed(2)})`;
        ctx.beginPath(); ctx.arc(x + 6, y + 6, 2.5, 0, Math.PI * 2); ctx.fill();
      });
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return <canvas ref={canvasRef} width={W} height={H} aria-hidden="true" style={{ display: 'block' }} />;
}

// ─── Kolumn 2: 9 prickar (#ae84ea) + 10 prickar (#dac1ff), dashed divider ──

function DotsSplit() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const [r9, g9, b9]    = hexToRgb('#ae84ea'); // vänster kluster — lila
  const [r10, g10, b10] = hexToRgb('#ae84ea'); // höger kluster

  const max9X  = Math.max(...PTS_9.map(p => p[0]));
  const max9Y  = Math.max(...PTS_9.map(p => p[1]));
  const max10X = Math.max(...PTS_10.map(p => p[0]));
  const max10Y = Math.max(...PTS_10.map(p => p[1]));
  const GAP = 14;
  const W   = max9X + 12 + GAP + max10X + 12;
  const H   = Math.max(max9Y, max10Y) + 12;
  const OFF = max9X + 12 + GAP;

  // Centrera varje kluster vertikalt i canvas-höjden
  const oy9  = (H - max9Y)  / 2;
  const oy10 = (H - max10Y) / 2;

  useEffect(() => {
    const cv = canvasRef.current; if (!cv) return;
    const ctx = cv.getContext('2d')!;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const now = performance.now() / 1000;

      // Streckad mittlinje
      const divX = max9X + 12 + GAP / 2;
      ctx.save();
      ctx.strokeStyle = 'rgba(35,30,34,0.15)';
      ctx.lineWidth = 0.6;
      ctx.setLineDash([2, 2]);
      ctx.beginPath(); ctx.moveTo(divX, 3); ctx.lineTo(divX, H - 3); ctx.stroke();
      ctx.restore();

      PTS_9.forEach(([x, y], i) => {
        const alpha = blinkAlpha(now, i);
        ctx.fillStyle = `rgba(${r9},${g9},${b9},${alpha.toFixed(2)})`;
        ctx.beginPath(); ctx.arc(x + 6, y + oy9, 2.5, 0, Math.PI * 2); ctx.fill();
      });
      PTS_10.forEach(([x, y], i) => {
        const alpha = blinkAlpha(now, i + 9);
        ctx.fillStyle = `rgba(${r10},${g10},${b10},${alpha.toFixed(2)})`;
        ctx.beginPath(); ctx.arc(x + OFF + 6, y + oy10, 2.5, 0, Math.PI * 2); ctx.fill();
      });
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return <canvas ref={canvasRef} width={W} height={H} aria-hidden="true" style={{ display: 'block' }} />;
}

// ─── Kolumn 3: rullande band (seamless loop), #544550 ─────────────────────

const BAND_SP  = 13;
const BAND_N   = 19;
const BAND_TOT = BAND_N * BAND_SP;
const BAND_W   = 120;
const BAND_H   = 14;
const BAND_FADE = BAND_W * 0.28;
const [BR, BG, BB] = hexToRgb('#ae84ea');

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

// ─── Huvud-komponent ──────────────────────────────────────────────────────

export default function PlayModes() {
  const t = useTranslations('playModes');

  const cols = [
    { symbol: <DotsAlone />, text: t('alone'), color: '#ae84ea' },
    { symbol: <DotsSplit />, text: t('split'), color: '#ae84ea' },
    { symbol: <DotsChain />, text: t('chain'), color: '#ae84ea' },
  ];

  return (
    <section style={{ background: '#FFFBF5', padding: '0 0 72px' }}>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 16px' }}>
        {/* Mobile: 2 kolumner, sista centrerad på egen rad. Desktop: 3 kolumner */}
        <div className="grid grid-cols-2 sm:grid-cols-3">
          {cols.map(({ symbol, text, color }, i) => (
            <div
              key={i}
              className={i === 2 ? 'col-span-2 sm:col-span-1' : ''}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 12,
                padding: 'clamp(8px, 1.5vw, 14px) clamp(10px, 2vw, 24px) clamp(20px, 3vw, 36px)',
              }}
            >
              <div style={{ minHeight: 68, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {symbol}
              </div>
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 500,
                fontSize: 'clamp(0.85rem, 1.6vw, 1.05rem)',
                color,
                margin: 0,
                letterSpacing: '0.01em',
                lineHeight: 1.4,
                textAlign: 'center',
              }}>
                {text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
