'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';

function extractTeaser(text: string, n = 2) {
  const parts = text.match(/[^.!?—]+[.!?]+/g) ?? [text];
  return parts.slice(0, n).join(' ').trim();
}

export default function JourneyPage() {
  const t   = useTranslations('story');
  const params = useParams();
  const locale = (params?.locale as string) ?? 'en';
  const isSv   = locale === 'sv';

  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const toggle = (i: number) =>
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  const chapters = [
    {
      number: t('chapter1.number'),
      title:  t('chapter1.title'),
      period: t('chapter1.period'),
      text:   t('chapter1.text'),
      image:  '/images/story/chapter1.webp',
      place:  isSv ? 'Stockholm → Portugal' : 'Stockholm → Portugal',
    },
    {
      number: t('chapter2.number'),
      title:  t('chapter2.title'),
      period: t('chapter2.period'),
      text:   t('chapter2.text'),
      image:  '/images/story/chapter2.webp',
      place:  isSv ? 'Sverige' : 'Sweden',
    },
    {
      number: t('chapter3.number'),
      title:  t('chapter3.title'),
      period: t('chapter3.period'),
      text:   t('chapter3.text'),
      image:  '/images/story/chapter3.webp',
      place:  'Rochester, New York',
    },
    {
      number: t('chapter4.number'),
      title:  t('chapter4.title'),
      period: t('chapter4.period'),
      text:   t('chapter4.text'),
      image:  '/images/story/chapter4.webp',
      place:  'Stockholm',
    },
  ];

  const font     = { fontFamily: 'eight-condensed, Georgia, serif' } as React.CSSProperties;
  const fontBold = { ...font, fontWeight: 700 }                      as React.CSSProperties;

  return (
    <div style={{ background: '#FFFBF5', minHeight: '100svh' }}>

      {/* ── Page header ── */}
      <section style={{ paddingTop: 120, paddingBottom: 56, paddingLeft: 24, paddingRight: 24 }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <p style={{ ...font, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#ae84ea', margin: '0 0 14px' }}>
            {isSv ? 'Berättelsen' : 'The Story'}
          </p>
          <h1 style={{ ...fontBold, fontSize: 'clamp(34px, 7vw, 68px)', color: '#0d0a12', lineHeight: 1.0, margin: 0 }}>
            {isSv ? '9 År som\nPusselmakare' : '9 Years\nPuzzlemaking'}
          </h1>
          <div style={{ marginTop: 32, height: 1, background: 'rgba(13,10,18,0.08)' }} />
        </div>
      </section>

      {/* ── Timeline ── */}
      <section style={{ paddingBottom: 96, paddingLeft: 24, paddingRight: 24 }}>
        <div style={{ maxWidth: 680, margin: '0 auto', position: 'relative' }}>

          {/* Vertical line */}
          <div style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 1,
            background: 'linear-gradient(to bottom, #ae84ea 60%, rgba(174,132,234,0.0) 100%)',
          }} />

          {chapters.map((ch, i) => {
            const isOpen = expanded.has(i);
            const teaser = extractTeaser(ch.text);
            const isLast = i === chapters.length - 1;

            return (
              <div
                key={i}
                style={{ paddingLeft: 36, paddingBottom: isLast ? 0 : 72, position: 'relative' }}
              >
                {/* Dot on the line */}
                <div style={{
                  position: 'absolute',
                  left: -5,
                  top: 6,
                  width: 11,
                  height: 11,
                  borderRadius: '50%',
                  background: '#ae84ea',
                  boxShadow: '0 0 0 3px #FFFBF5, 0 0 14px rgba(174,132,234,0.55)',
                }} />

                {/* Year — large display */}
                <p style={{ ...font, fontSize: 'clamp(52px, 10vw, 80px)', color: 'rgba(174,132,234,0.13)', lineHeight: 1, margin: '0 0 -16px', letterSpacing: '-0.02em' }}>
                  {ch.period}
                </p>

                {/* Image */}
                <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: 16, overflow: 'hidden', marginBottom: 20, boxShadow: '0 4px 28px rgba(13,10,18,0.09)' }}>
                  <Image
                    src={ch.image}
                    alt={ch.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 90vw, 644px"
                    priority={i === 0}
                  />
                </div>

                {/* Meta */}
                <p style={{ ...font, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#ae84ea', margin: '0 0 10px' }}>
                  {ch.number} · {ch.place}
                </p>

                {/* Title */}
                <h2 style={{ ...fontBold, fontSize: 'clamp(22px, 3.5vw, 30px)', color: '#0d0a12', margin: '0 0 14px', lineHeight: 1.15 }}>
                  {ch.title}
                </h2>

                {/* Body */}
                <p style={{ fontFamily: 'var(--font-trykker, Georgia, serif)', fontSize: 15, lineHeight: 1.85, color: 'rgba(13,10,18,0.62)', margin: 0 }}>
                  {isOpen ? ch.text : teaser}
                </p>

                {/* Read more / less */}
                <button
                  onClick={() => toggle(i)}
                  style={{
                    ...font, fontSize: 13, letterSpacing: '0.04em',
                    color: 'rgba(13,10,18,0.32)', background: 'none',
                    border: 'none', cursor: 'pointer', marginTop: 12,
                    display: 'inline-flex', alignItems: 'center', gap: 6, padding: 0,
                    transition: 'color 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#ae84ea')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(13,10,18,0.32)')}
                >
                  {isOpen
                    ? (isSv ? 'Läs mindre' : 'Read less')
                    : (isSv ? 'Läs mer' : 'Read more')}
                  <svg
                    width="12" height="12" viewBox="0 0 12 12" fill="none"
                    style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
                  >
                    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Back link ── */}
      <section style={{ paddingBottom: 64, paddingLeft: 24, paddingRight: 24 }}>
        <div style={{ maxWidth: 680, margin: '0 auto', borderTop: '1px solid rgba(13,10,18,0.08)', paddingTop: 32 }}>
          <Link
            href={`/${locale}`}
            style={{
              ...font, fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase',
              color: 'rgba(13,10,18,0.32)', textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', gap: 8,
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#ae84ea')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(13,10,18,0.32)')}
          >
            <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
              <path d="M13 5H1M1 5l4-4M1 5l4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {isSv ? 'Tillbaka' : 'Back to home'}
          </Link>
        </div>
      </section>

    </div>
  );
}
