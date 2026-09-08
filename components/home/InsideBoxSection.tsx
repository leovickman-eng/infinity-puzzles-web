'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

/* ── Star canvas (same as universe page) ─────────────────────── */
function rnd(min: number, max: number) { return min + Math.random() * (max - min); }
function genStars() {
  const small:  { x: number; y: number; r: number; a: number }[] = [];
  const medium: { x: number; y: number; r: number; a: number }[] = [];
  const bright: { x: number; y: number; r: number; baseA: number; phase: number }[] = [];
  for (let i = 0; i < 220; i++) small.push({ x: Math.random(), y: Math.random(), r: rnd(0.2, 0.8), a: rnd(0.15, 0.5) });
  for (let i = 0; i < 40;  i++) medium.push({ x: Math.random(), y: Math.random(), r: rnd(0.8, 1.4), a: rnd(0.4, 0.8) });
  for (let i = 0; i < 12;  i++) bright.push({ x: Math.random(), y: Math.random(), r: rnd(1.4, 2.0), baseA: rnd(0.7, 1.0), phase: rnd(0, Math.PI * 2) });
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
      const rect = canvas!.parentElement!.getBoundingClientRect();
      W = canvas!.width  = rect.width;
      H = canvas!.height = rect.height;
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
      position: 'absolute', inset: 0, width: '100%', height: '100%',
      pointerEvents: 'none', zIndex: 0,
    }} />
  );
}

/* ── Section ─────────────────────────────────────────────────── */
export default function InsideBoxSection() {
  const t = useTranslations('insideBox');
  const tn = useTranslations('nav');

  return (
    <section style={{ background: '#0d0a12', color: '#f0eaf8', position: 'relative', overflow: 'hidden', padding: '96px 24px' }}>
      <StarCanvas />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '896px', margin: '0 auto', textAlign: 'center' }}>
        <p style={{
          fontFamily: "'eight-condensed', sans-serif",
          fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase',
          color: '#ae84ea', marginBottom: '12px',
        }}>
          {t('eyebrow')}
        </p>
        <h2 style={{
          fontFamily: "'eight-condensed', sans-serif",
          fontSize: 'clamp(2.2rem, 6vw, 3.5rem)', fontWeight: 400,
          color: '#f0eaf8', margin: '0 0 20px', lineHeight: 1.1,
        }}>
          {t('title')}
        </h2>
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '1.1rem', color: 'rgba(240,234,248,0.6)',
          lineHeight: 1.7, maxWidth: '520px', margin: '0 auto 56px',
        }}>
          {t('subtitle')}
        </p>

        {/* Three cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', textAlign: 'left' }}>
          {/* SAGOR / STORIES */}
          <a href="universe/stories" style={{ textDecoration: 'none' }}>
            <div className="ib-card ib-card-purple" style={{ borderRadius: '16px', padding: '28px 24px', height: '100%' }}>
              <Image src="/images/planeter/P2.PNG" alt="Sagor" width={72} height={72} style={{ marginBottom: '16px' }} unoptimized />
              <div style={{ fontFamily: "'eight-condensed', sans-serif", fontSize: '1.6rem', color: '#5DCCA0', marginBottom: '6px' }}>
                {t('stories.heading')}
              </div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: 'rgba(240,234,248,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
                {t('stories.label')}
              </div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", color: 'rgba(240,234,248,0.65)', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
                {t('stories.desc')}
              </p>
            </div>
          </a>

          {/* WILD NETWORK */}
          <a href="WILD_NETWORK" style={{ textDecoration: 'none' }}>
            <div className="ib-card ib-card-mint" style={{ borderRadius: '16px', padding: '28px 24px', height: '100%' }}>
              <Image src="/images/planeter/P1.PNG" alt="Wild Network" width={72} height={72} style={{ marginBottom: '16px' }} unoptimized />
              <div style={{ fontFamily: "'eight-condensed', sans-serif", fontSize: '1.6rem', color: '#ae84ea', marginBottom: '6px' }}>
                WILD NETWORK
              </div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: 'rgba(240,234,248,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
                {t('network.label')}
              </div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", color: 'rgba(240,234,248,0.65)', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
                {t('network.desc')}
              </p>
            </div>
          </a>

          {/* LEKAR / WAYS TO PLAY */}
          <a href="universe/ways-to-play" style={{ textDecoration: 'none' }}>
            <div className="ib-card ib-card-orange" style={{ borderRadius: '16px', padding: '28px 24px', height: '100%' }}>
              <Image src="/images/planeter/P5.PNG" alt="Lekar" width={72} height={72} style={{ marginBottom: '16px' }} unoptimized />
              <div style={{ fontFamily: "'eight-condensed', sans-serif", fontSize: '1.6rem', color: '#FF8C42', marginBottom: '6px' }}>
                {t('play.heading')}
              </div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: 'rgba(240,234,248,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
                {t('play.label')}
              </div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", color: 'rgba(240,234,248,0.65)', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
                {t('play.desc')}
              </p>
            </div>
          </a>
        </div>

        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          marginTop: '40px', fontSize: '12px',
          color: 'rgba(240,234,248,0.3)', letterSpacing: '0.06em',
        }}>
          {t('qrHint')}
        </p>
      </div>

      <style>{`
        .ib-card { transition: border-color 0.2s; }
        .ib-card-purple { background: rgba(174,132,234,0.08); border: 1px solid rgba(174,132,234,0.2); }
        .ib-card-purple:hover { border-color: rgba(174,132,234,0.5); }
        .ib-card-mint { background: rgba(93,204,160,0.08); border: 1px solid rgba(93,204,160,0.2); }
        .ib-card-mint:hover { border-color: rgba(93,204,160,0.5); }
        .ib-card-orange { background: rgba(255,140,66,0.08); border: 1px solid rgba(255,140,66,0.2); }
        .ib-card-orange:hover { border-color: rgba(255,140,66,0.5); }
      `}</style>
    </section>
  );
}
