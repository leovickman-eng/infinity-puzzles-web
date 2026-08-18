'use client';

import { useTranslations } from 'next-intl';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// ── Map projection ─────────────────────────────────────────────────────────
// ViewBox 0 0 1000 560  |  lon: −115→45  |  lat: 5→75
const toX = (lon: number) => ((lon + 115) / 160) * 1000;
const toY = (lat: number) => ((75 - lat)  / 70)  * 560;

// ── City pins ──────────────────────────────────────────────────────────────
const CITIES = [
  { lon: 18.07,  lat: 59.33, label: 'Stockholm',    sub: '2017 & 2025', anchor: 'chapter1' },
  { lon: -8.68,  lat: 38.0,  label: 'Portugal',     sub: '2017',        anchor: 'chapter1' },
  { lon: -77.6,  lat: 43.15, label: 'Rochester, NY', sub: '2023–24',    anchor: 'chapter3' },
] as const;

// ── Simplified land polygons ───────────────────────────────────────────────
// Equirectangular, hand-traced approximate coastlines
const LAND = {
  greenland: `M ${toX(-75)} ${toY(75)} L ${toX(-22)} ${toY(75)}
    L ${toX(-18)} ${toY(70)} L ${toX(-18)} ${toY(65)}
    L ${toX(-22)} ${toY(62)} L ${toX(-30)} ${toY(60)}
    L ${toX(-42)} ${toY(59)} L ${toX(-52)} ${toY(61)}
    L ${toX(-60)} ${toY(64)} L ${toX(-68)} ${toY(68)}
    L ${toX(-75)} ${toY(75)} Z`,

  iceland: `M ${toX(-24)} ${toY(65.5)} L ${toX(-13)} ${toY(65.5)}
    L ${toX(-13)} ${toY(63.5)} L ${toX(-24)} ${toY(63.5)} Z`,

  northAmerica: `
    M ${toX(-115)} ${toY(75)}
    L ${toX(-80)}  ${toY(75)}
    L ${toX(-75)}  ${toY(71)}
    L ${toX(-64)}  ${toY(66)}
    L ${toX(-59)}  ${toY(62)}
    L ${toX(-56)}  ${toY(56)}
    L ${toX(-60)}  ${toY(51)}
    L ${toX(-64)}  ${toY(48)}
    L ${toX(-70)}  ${toY(44)}
    L ${toX(-74)}  ${toY(41)}
    L ${toX(-76)}  ${toY(38)}
    L ${toX(-76)}  ${toY(35)}
    L ${toX(-80)}  ${toY(31)}
    L ${toX(-81)}  ${toY(26)}
    L ${toX(-82)}  ${toY(25)}
    L ${toX(-84)}  ${toY(30)}
    L ${toX(-90)}  ${toY(29)}
    L ${toX(-97)}  ${toY(26)}
    L ${toX(-97)}  ${toY(22)}
    L ${toX(-115)} ${toY(22)}
    Z`,

  southAmerica: `
    M ${toX(-80)} ${toY(11)}
    L ${toX(-63)} ${toY(11)}
    L ${toX(-60)} ${toY(8)}
    L ${toX(-50)} ${toY(5)}
    L ${toX(-35)} ${toY(5)}
    L ${toX(-35)} ${toY(8)}
    L ${toX(-50)} ${toY(10)}
    L ${toX(-63)} ${toY(12)}
    L ${toX(-75)} ${toY(11)}
    L ${toX(-80)} ${toY(11)} Z`,

  europe: `
    M ${toX(-10)} ${toY(75)}
    L ${toX(40)}  ${toY(75)}
    L ${toX(40)}  ${toY(36)}
    L ${toX(28)}  ${toY(36)}
    L ${toX(20)}  ${toY(38)}
    L ${toX(14)}  ${toY(38)}
    L ${toX(13)}  ${toY(41)}
    L ${toX(16)}  ${toY(44)}
    L ${toX(14)}  ${toY(46)}
    L ${toX(7)}   ${toY(44)}
    L ${toX(3)}   ${toY(43)}
    L ${toX(0)}   ${toY(43)}
    L ${toX(-1)}  ${toY(44)}
    L ${toX(-2)}  ${toY(44)}
    L ${toX(-2)}  ${toY(43.5)}
    L ${toX(-5)}  ${toY(43.5)}
    L ${toX(-9)}  ${toY(43.7)}
    L ${toX(-9)}  ${toY(42)}
    L ${toX(-9)}  ${toY(38.5)}
    L ${toX(-9)}  ${toY(37)}
    L ${toX(-7)}  ${toY(37)}
    L ${toX(-5)}  ${toY(36)}
    L ${toX(0)}   ${toY(36)}
    L ${toX(5)}   ${toY(37)}
    L ${toX(5)}   ${toY(38)}
    L ${toX(0)}   ${toY(40)}
    L ${toX(3)}   ${toY(41)}
    L ${toX(3)}   ${toY(43)}
    L ${toX(13)}  ${toY(41)}
    L ${toX(14)}  ${toY(38)}
    L ${toX(24)}  ${toY(38)}
    L ${toX(40)}  ${toY(36)}
    Z`,

  // Scandinavia / Norway-Sweden jutting north
  scandinavia: `
    M ${toX(4)}  ${toY(58)}
    L ${toX(5)}  ${toY(57)}
    L ${toX(8)}  ${toY(57.5)}
    L ${toX(10)} ${toY(57)}
    L ${toX(12)} ${toY(56)}
    L ${toX(12)} ${toY(55.5)}
    L ${toX(10)} ${toY(55.5)}
    L ${toX(10)} ${toY(56)}
    L ${toX(8)}  ${toY(56.5)}
    L ${toX(8)}  ${toY(58)}
    L ${toX(5)}  ${toY(59)}
    L ${toX(5)}  ${toY(62)}
    L ${toX(7)}  ${toY(63)}
    L ${toX(8)}  ${toY(65)}
    L ${toX(14)} ${toY(67)}
    L ${toX(16)} ${toY(69)}
    L ${toX(18)} ${toY(70)}
    L ${toX(25)} ${toY(71)}
    L ${toX(27)} ${toY(70)}
    L ${toX(30)} ${toY(70)}
    L ${toX(28)} ${toY(68)}
    L ${toX(22)} ${toY(65)}
    L ${toX(18)} ${toY(64)}
    L ${toX(14)} ${toY(63)}
    L ${toX(12)} ${toY(61)}
    L ${toX(12)} ${toY(59)}
    L ${toX(18)} ${toY(59)}
    L ${toX(18)} ${toY(58)}
    L ${toX(12)} ${toY(57.5)}
    L ${toX(12)} ${toY(56)}
    L ${toX(10)} ${toY(56)}
    L ${toX(10)} ${toY(57)}
    L ${toX(12)} ${toY(57.5)}
    Z`,

  // NW Africa
  africa: `
    M ${toX(-6)}  ${toY(36)}
    L ${toX(5)}   ${toY(36)}
    L ${toX(10)}  ${toY(37)}
    L ${toX(15)}  ${toY(37)}
    L ${toX(25)}  ${toY(36)}
    L ${toX(40)}  ${toY(36)}
    L ${toX(40)}  ${toY(5)}
    L ${toX(-17)} ${toY(5)}
    L ${toX(-17)} ${toY(21)}
    L ${toX(-13)} ${toY(28)}
    L ${toX(-9)}  ${toY(30)}
    L ${toX(-6)}  ${toY(33)}
    L ${toX(-6)}  ${toY(36)} Z`,

  uk: `M ${toX(-6)} ${toY(50)} L ${toX(-2)} ${toY(51)}
    L ${toX(1)} ${toY(51.5)} L ${toX(2)} ${toY(53)}
    L ${toX(0)} ${toY(54)} L ${toX(-2)} ${toY(55)}
    L ${toX(-4)} ${toY(57)} L ${toX(-5)} ${toY(58.5)}
    L ${toX(-3)} ${toY(59)} L ${toX(-2)} ${toY(57)}
    L ${toX(0)} ${toY(56)} L ${toX(0)} ${toY(54)}
    L ${toX(-2)} ${toY(53)} L ${toX(-3)} ${toY(51.5)}
    L ${toX(-5)} ${toY(50)} L ${toX(-6)} ${toY(50)} Z`,

  ireland: `M ${toX(-10)} ${toY(51.5)} L ${toX(-6)} ${toY(51.5)}
    L ${toX(-6)} ${toY(55)} L ${toX(-10)} ${toY(54.5)} Z`,
};

// ── Arc paths between cities ───────────────────────────────────────────────
// Great-circle approximation using quadratic Bézier, arcing northward over Atlantic
const sx = toX(18.07), sy = toY(59.33);   // Stockholm
const lx = toX(-8.68), ly = toY(38.0);    // Lisbon
const nx = toX(-77.6), ny = toY(43.15);   // Rochester/NY

// Arc 1: Stockholm → Lisbon  (curves slightly SW)
const arc1 = `M ${sx} ${sy} Q ${toX(2)} ${toY(55)} ${lx} ${ly}`;
// Arc 2: Lisbon → New York  (arcs north through Atlantic)
const arc2 = `M ${lx} ${ly} Q ${toX(-40)} ${toY(53)} ${nx} ${ny}`;
// Arc 3: New York → Stockholm (return, arcs south)
const arc3 = `M ${nx} ${ny} Q ${toX(-30)} ${toY(65)} ${sx} ${sy}`;

function extractTeaser(text: string, n = 2) {
  const parts = text.match(/[^.!?—]+[.!?]+/g) ?? [text];
  return parts.slice(0, n).join(' ').trim();
}

export default function JourneyPage() {
  const t  = useTranslations('story');
  const params = useParams();
  const locale = (params?.locale as string) ?? 'en';
  const isSv = locale === 'sv';

  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [drawn, setDrawn] = useState(false);
  const arc1Ref = useRef<SVGPathElement>(null);
  const arc2Ref = useRef<SVGPathElement>(null);
  const arc3Ref = useRef<SVGPathElement>(null);
  const [len1, setLen1] = useState(0);
  const [len2, setLen2] = useState(0);
  const [len3, setLen3] = useState(0);

  useEffect(() => {
    if (arc1Ref.current) setLen1(arc1Ref.current.getTotalLength());
    if (arc2Ref.current) setLen2(arc2Ref.current.getTotalLength());
    if (arc3Ref.current) setLen3(arc3Ref.current.getTotalLength());
    const id = setTimeout(() => setDrawn(true), 400);
    return () => clearTimeout(id);
  }, []);

  const toggle = (i: number) =>
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  const chapters = [
    { number: t('chapter1.number'), title: t('chapter1.title'), period: t('chapter1.period'), text: t('chapter1.text'), image: '/images/story/chapter1.webp', city: 'Stockholm → Portugal' },
    { number: t('chapter2.number'), title: t('chapter2.title'), period: t('chapter2.period'), text: t('chapter2.text'), image: '/images/story/chapter2.webp', city: 'Sweden' },
    { number: t('chapter3.number'), title: t('chapter3.title'), period: t('chapter3.period'), text: t('chapter3.text'), image: '/images/story/chapter3.webp', city: 'Rochester, NY' },
    { number: t('chapter4.number'), title: t('chapter4.title'), period: t('chapter4.period'), text: t('chapter4.text'), image: '/images/story/chapter4.webp', city: 'Stockholm' },
  ];

  const font = { fontFamily: 'eight-condensed, Georgia, serif' } as React.CSSProperties;
  const fontBold = { ...font, fontWeight: 700 } as React.CSSProperties;

  return (
    <div style={{ background: '#FFFBF5', minHeight: '100svh' }}>

      {/* ── Hero header ── */}
      <section style={{ paddingTop: '120px', paddingBottom: '48px', paddingLeft: '24px', paddingRight: '24px', background: '#FFFBF5' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <p style={{ ...font, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#ae84ea', marginBottom: 16 }}>
            {isSv ? 'Berättelsen' : 'The Story'}
          </p>
          <h1 style={{ ...fontBold, fontSize: 'clamp(32px, 6vw, 64px)', color: '#0d0a12', lineHeight: 1.05, margin: 0 }}>
            {isSv ? '9 År som Pusselmakare' : '9 Years Puzzlemaking'}
          </h1>
          <p style={{ ...font, fontSize: 'clamp(14px, 2vw, 18px)', color: 'rgba(13,10,18,0.5)', marginTop: 16, maxWidth: 560 }}>
            {isSv
              ? 'Stockholm. Portugal. New York. Och tillbaka igen.'
              : 'Stockholm. Portugal. New York. And back again.'}
          </p>
        </div>
      </section>

      {/* ── World map ── */}
      <section style={{ width: '100%', background: '#07101e', position: 'relative', overflow: 'hidden' }}>
        <style>{`
          @keyframes draw-arc {
            to { stroke-dashoffset: 0; }
          }
          @keyframes pin-pulse {
            0%,100% { r: 6; opacity: 1; }
            50%      { r: 11; opacity: 0; }
          }
          .journey-pin-ring { animation: pin-pulse 2.4s ease-out infinite; }
          .journey-pin-ring:nth-of-type(2) { animation-delay: 0.4s; }
        `}</style>

        <svg
          viewBox="0 0 1000 560"
          width="100%"
          preserveAspectRatio="xMidYMid meet"
          style={{ display: 'block', maxHeight: '70vh' }}
          aria-label="World map showing the journey"
        >
          <defs>
            {/* Ocean gradient */}
            <radialGradient id="ocean-grad" cx="55%" cy="45%" r="60%">
              <stop offset="0%"   stopColor="#0d1e35" />
              <stop offset="100%" stopColor="#04090f" />
            </radialGradient>

            {/* Pin glow filter */}
            <filter id="pin-glow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>

            {/* Arc glow */}
            <filter id="arc-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>

            {/* Land shadow */}
            <filter id="land-shadow">
              <feDropShadow dx="0" dy="1" stdDeviation="3" floodColor="#ae84ea" floodOpacity="0.08" />
            </filter>
          </defs>

          {/* Ocean */}
          <rect width="1000" height="560" fill="url(#ocean-grad)" />

          {/* Graticule — very subtle grid */}
          <g stroke="rgba(174,132,234,0.06)" strokeWidth="0.5" fill="none">
            {[-80,-60,-40,-20,0,20,40].map(lon => (
              <line key={`v${lon}`} x1={toX(lon)} y1="0" x2={toX(lon)} y2="560" />
            ))}
            {[20,30,40,50,60,70].map(lat => (
              <line key={`h${lat}`} x1="0" y1={toY(lat)} x2="1000" y2={toY(lat)} />
            ))}
          </g>

          {/* Land masses */}
          <g fill="#0e2535" stroke="rgba(174,132,234,0.18)" strokeWidth="0.8" filter="url(#land-shadow)">
            <path d={LAND.northAmerica} />
            <path d={LAND.southAmerica} />
            <path d={LAND.greenland} />
            <path d={LAND.iceland} />
            <path d={LAND.europe} />
            <path d={LAND.scandinavia} />
            <path d={LAND.africa} />
            <path d={LAND.uk} />
            <path d={LAND.ireland} />
          </g>

          {/* Journey arcs */}
          <g filter="url(#arc-glow)">
            {/* Arc 1: Stockholm → Lisbon */}
            <path
              ref={arc1Ref}
              d={arc1}
              fill="none"
              stroke="#5DCCA0"
              strokeWidth="1.8"
              strokeDasharray={len1 || 9999}
              strokeDashoffset={drawn ? 0 : (len1 || 9999)}
              style={{ transition: drawn ? 'stroke-dashoffset 1.8s ease-in-out 0.2s' : 'none' }}
            />
            {/* Arc 2: Lisbon → New York */}
            <path
              ref={arc2Ref}
              d={arc2}
              fill="none"
              stroke="#5DCCA0"
              strokeWidth="1.8"
              strokeDasharray={len2 || 9999}
              strokeDashoffset={drawn ? 0 : (len2 || 9999)}
              style={{ transition: drawn ? 'stroke-dashoffset 2.2s ease-in-out 1.6s' : 'none' }}
            />
            {/* Arc 3: New York → Stockholm (return) */}
            <path
              ref={arc3Ref}
              d={arc3}
              fill="none"
              stroke="#ae84ea"
              strokeWidth="1.2"
              strokeDasharray="6 5"
              strokeDashoffset={drawn ? 0 : (len3 || 9999)}
              opacity="0.5"
              style={{ transition: drawn ? 'stroke-dashoffset 2s ease-in-out 3.4s' : 'none' }}
            />
          </g>

          {/* City pins */}
          {CITIES.map((city, i) => {
            const cx = toX(city.lon);
            const cy = toY(city.lat);
            return (
              <g key={i} filter="url(#pin-glow)">
                {/* Pulse rings */}
                <circle className="journey-pin-ring" cx={cx} cy={cy} r="6" fill="none" stroke="#ae84ea" strokeWidth="1.2" opacity="0.6" style={{ animationDelay: `${i * 0.5}s` }} />
                {/* Core dot */}
                <circle cx={cx} cy={cy} r="4" fill="#ae84ea" />
                <circle cx={cx} cy={cy} r="2" fill="#dac1ff" />
              </g>
            );
          })}

          {/* City labels */}
          {CITIES.map((city, i) => {
            const cx = toX(city.lon);
            const cy = toY(city.lat);
            // Offset labels to avoid overlap
            const dx = i === 0 ? 10 : i === 1 ? 10 : -10;
            const anchor = i === 2 ? 'end' : 'start';
            return (
              <g key={`label-${i}`}>
                <text
                  x={cx + dx}
                  y={cy - 6}
                  textAnchor={anchor}
                  fill="#FFFBF5"
                  fontSize="10"
                  fontFamily="eight-condensed, Georgia, serif"
                  fontWeight="700"
                  letterSpacing="0.08em"
                >
                  {city.label.toUpperCase()}
                </text>
                <text
                  x={cx + dx}
                  y={cy + 6}
                  textAnchor={anchor}
                  fill="#ae84ea"
                  fontSize="8.5"
                  fontFamily="eight-condensed, Georgia, serif"
                  letterSpacing="0.06em"
                >
                  {city.sub}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        <div style={{ position: 'absolute', bottom: 16, right: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="28" height="8"><line x1="0" y1="4" x2="28" y2="4" stroke="#5DCCA0" strokeWidth="1.8" /></svg>
            <span style={{ fontFamily: 'eight-condensed, Georgia, serif', fontSize: 9, color: 'rgba(255,251,245,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              {isSv ? 'Resan' : 'The Journey'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="28" height="8"><line x1="0" y1="4" x2="28" y2="4" stroke="#ae84ea" strokeWidth="1.2" strokeDasharray="5 4" /></svg>
            <span style={{ fontFamily: 'eight-condensed, Georgia, serif', fontSize: 9, color: 'rgba(255,251,245,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              {isSv ? 'Hemvändaren' : 'Return'}
            </span>
          </div>
        </div>
      </section>

      {/* ── Chapter timeline ── */}
      <section style={{ padding: '80px 24px', background: '#FFFBF5' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>

          {/* Timeline line */}
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 1, background: 'linear-gradient(to bottom, #ae84ea, rgba(174,132,234,0.1))' }} />

            {chapters.map((ch, i) => {
              const isOpen = expanded.has(i);
              const teaser = extractTeaser(ch.text);
              return (
                <div
                  key={i}
                  id={`chapter${i + 1}`}
                  style={{ paddingLeft: 32, paddingBottom: i === chapters.length - 1 ? 0 : 64, position: 'relative' }}
                >
                  {/* Timeline dot */}
                  <div style={{
                    position: 'absolute', left: -5, top: 4,
                    width: 11, height: 11, borderRadius: '50%',
                    background: '#ae84ea',
                    boxShadow: '0 0 12px rgba(174,132,234,0.6)',
                  }} />

                  {/* Chapter image */}
                  <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: 16, overflow: 'hidden', marginBottom: 20, boxShadow: '0 4px 24px rgba(13,10,18,0.1)' }}>
                    <Image
                      src={ch.image}
                      alt={ch.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 90vw, 648px"
                    />
                  </div>

                  {/* Meta: number + period + city */}
                  <p style={{ ...font, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#ae84ea', margin: '0 0 8px' }}>
                    {ch.number} · {ch.period} · {ch.city}
                  </p>

                  {/* Title */}
                  <h2 style={{ ...fontBold, fontSize: 'clamp(20px, 3vw, 28px)', color: '#0d0a12', margin: '0 0 16px', lineHeight: 1.15 }}>
                    {ch.title}
                  </h2>

                  {/* Text */}
                  <p style={{ fontFamily: 'var(--font-trykker, Georgia, serif)', fontSize: 15, lineHeight: 1.85, color: 'rgba(13,10,18,0.65)', margin: 0 }}>
                    {isOpen ? ch.text : teaser}
                  </p>

                  {/* Read more */}
                  <button
                    onClick={() => toggle(i)}
                    style={{ ...font, fontSize: 13, color: 'rgba(13,10,18,0.35)', background: 'none', border: 'none', cursor: 'pointer', marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 6, padding: 0 }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#ae84ea')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(13,10,18,0.35)')}
                  >
                    {isOpen ? (isSv ? 'Läs mindre' : 'Read less') : (isSv ? 'Läs mer' : 'Read more')}
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
                      style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                      <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Back to home */}
          <div style={{ marginTop: 80, borderTop: '1px solid rgba(13,10,18,0.08)', paddingTop: 32 }}>
            <Link
              href={`/${locale}`}
              style={{ ...font, fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(13,10,18,0.35)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}
            >
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                <path d="M13 5H1M1 5l4-4M1 5l4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {isSv ? 'Tillbaka' : 'Back to home'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
