'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';


// Slow blink for DiameterIcon dots
const GOLDEN_S = 2.399963;
const BLINK_W  = 1.38;
function blinkAlpha(now: number, i: number): number {
  const narrow = Math.pow(Math.max(0, Math.sin(now * BLINK_W + i * GOLDEN_S)), 8);
  return 0.9 - 0.75 * narrow;
}

// ─── Endless formations reel (card 1) ────────────────────────────────

const ENDLESS_SRCS = [
  '/images/stats_illustrations/1_endless.png',
  '/images/stats_illustrations/2_endless.png',
  '/images/stats_illustrations/3_endless.png',
  '/images/stats_illustrations/4_endless.png',
];
const ENDLESS_DURATION = 300; // ms per frame

function EndlessReel() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIdx(i => (i + 1) % 4), ENDLESS_DURATION);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ position: 'relative', width: 68, height: 68, flexShrink: 0 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={ENDLESS_SRCS[idx]}
        alt=""
        style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
      />
    </div>
  );
}

// ─── Character reel (card 2) — TV frame + swishing character PNGs ────

const CHAR_PNG_SRCS = Array.from({ length: 19 }, (_, i) =>
  `/images/character-png/${i + 1}.webp`
);
const REEL_DURATION = 1600; // ms per character

// TV.png is 209×209. Screen (white area) sits at approx:
// left 13%, top 17%, width 74%, height 58% of the TV size.
const TV_SIZE   = 135;
const SCR_LEFT  = '13%';
const SCR_TOP   = '17%';
const SCR_W     = '74%';
const SCR_H     = '58%';

function CharacterReel() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIdx(i => (i + 1) % 19), REEL_DURATION);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <style>{`
        @keyframes tv-char-swish {
          0%   { transform: translateX(110%); }
          12%  { transform: translateX(0%);   }
          82%  { transform: translateX(0%);   }
          100% { transform: translateX(-110%); }
        }
        .tv-char-wrap {
          animation: tv-char-swish ${REEL_DURATION}ms cubic-bezier(0.4,0,0.2,1) 1 forwards;
        }
      `}</style>
      <div style={{
        position: 'relative',
        width: TV_SIZE,
        height: TV_SIZE,
        flexShrink: 0,
      }}>
        {/* Screen area — clip + slide characters here */}
        <div style={{
          position: 'absolute',
          left: SCR_LEFT, top: SCR_TOP,
          width: SCR_W, height: SCR_H,
          overflow: 'hidden',
          borderRadius: 3,
          background: '#544550',
        }}>
          <div
            key={idx}
            className="tv-char-wrap"
            style={{
              position: 'absolute', inset: 0,
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={CHAR_PNG_SRCS[idx]}
              alt=""
              style={{
                height: '92%',
                width: 'auto',
                objectFit: 'contain',
              }}
            />
          </div>
        </div>

        {/* TV frame overlay — sits on top of the character */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/stats_illustrations/TV.png"
          alt=""
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            pointerEvents: 'none',
          }}
        />
      </div>
    </>
  );
}

// ─── Diameter circle (card 3) — thick ring + dot row ─────────────────

function DiameterIcon() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const W = 60, H = 60, cx = 30, cy = 30, R = 24;
  const DOT_N = 9;

  useEffect(() => {
    const cv = canvasRef.current; if (!cv) return;
    const ctx = cv.getContext('2d')!;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const now = performance.now() / 1000;

      // Thick outer ring
      ctx.save();
      ctx.strokeStyle = 'rgba(91,74,138,0.55)';
      ctx.lineWidth = 3.5;
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();

      // End tick marks
      ctx.save();
      ctx.strokeStyle = 'rgba(91,74,138,0.7)';
      ctx.lineWidth = 1.8;
      ctx.beginPath(); ctx.moveTo(cx - R, cy - 6); ctx.lineTo(cx - R, cy + 6); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx + R, cy - 6); ctx.lineTo(cx + R, cy + 6); ctx.stroke();
      ctx.restore();

      // Dots in a row along diameter
      for (let i = 0; i < DOT_N; i++) {
        const x = (cx - R) + (2 * R) * (i / (DOT_N - 1));
        const alpha = blinkAlpha(now, i);
        ctx.fillStyle = `rgba(91,74,138,${alpha.toFixed(2)})`;
        ctx.beginPath(); ctx.arc(x, cy, 1.8, 0, Math.PI * 2); ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return <canvas ref={canvasRef} width={W} height={H} aria-hidden="true" style={{ display: 'block' }} />;
}

// ─── Dalahäst with red duotone (card 4) ──────────────────────────────
// Two filter strengths — swap constant to switch
// A = bolder duotone, B = subtler (keeps more texture)
const DALA_FILTER_A = 'grayscale(1) sepia(1) hue-rotate(320deg) saturate(3) brightness(0.88)';
const DALA_FILTER_B = 'grayscale(0.7) sepia(0.8) hue-rotate(315deg) saturate(2.2) brightness(0.93)';
const DALA_FILTER   = 'grayscale(1) sepia(1) hue-rotate(225deg) saturate(2.5) brightness(0.75)'; // #5B4A8A lila

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
      icon:         <EndlessReel />,
      value:        t('formations'),
      valueColor:   '#5B4A8A',
      label:        null as string | null,
      valueSz:      'clamp(1rem, 2vw, 1.4rem)',
      labelDisplay: false,
    },
    {
      icon:         <CharacterReel />,
      value:        t('characters'),
      valueColor:   '#5B4A8A',
      label:        null as string | null,
      valueSz:      'clamp(1rem, 2vw, 1.4rem)',
      labelDisplay: false,
    },
    {
      icon:         <DiameterIcon />,
      value:        '30 cm diameter',
      valueColor:   '#5B4A8A',
      label:        null as string | null,
      valueSz:      'clamp(1rem, 2vw, 1.4rem)',
      labelDisplay: false,
    },
    {
      icon:         <DalaIcon />,
      value:        t('sweden'),
      valueColor:   '#5B4A8A',
      label:        t('wood') as string | null,
      valueSz:      'clamp(1rem, 2.2vw, 1.4rem)',
      labelDisplay: true,
      labelColor:   '#5B4A8A' as string | undefined,
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
                fontFamily: 'counterpress, sans-serif',
                fontWeight: 700,
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
                  fontFamily: 'counterpress, sans-serif',
                  fontWeight: 700,
                  fontSize: 'clamp(0.85rem, 1.6vw, 1.05rem)',
                  letterSpacing: '0.04em',
                  color: (card as {labelColor?: string}).labelColor ?? 'rgba(28,25,23,0.45)',
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
