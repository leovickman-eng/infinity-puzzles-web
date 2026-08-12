'use client';

import { useState, useEffect, type CSSProperties } from 'react';
import Image from 'next/image';

const IMAGES = [
  { src: '/images/hero/nya/Infinity-puzzle_1.webp', pos: '70% 50%' },
  { src: '/images/hero/nya/Infinity-puzzle_2.webp', pos: 'center'   },
  { src: '/images/hero/nya/Infinity-puzzle_3.webp', pos: 'center'   },
];

const EASE = 'cubic-bezier(0.4, 0, 0.2, 1)';
const DUR  = '0.42s';

export default function ThreeImageGrid() {
  const [sel, setSel]           = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // ── Position helpers (desktop only) ───────────────────────────────────

  const defaultStyle = (i: number): CSSProperties => ({
    position:   'absolute',
    top:        0,
    left:       i === 0
                  ? '0px'
                  : i === 1
                  ? 'calc((100% - 8px) / 3 + 4px)'
                  : 'calc(2 * (100% - 8px) / 3 + 8px)',
    width:      'calc((100% - 8px) / 3)',
    height:     '100%',
    transition: `all ${DUR} ${EASE}`,
    cursor:     'pointer',
    overflow:   'hidden',
  });

  const expandedStyle = (i: number): CSSProperties => {
    if (i === sel) {
      return {
        position:   'absolute',
        top:        0,
        left:       0,
        width:      'calc(50% - 2px)',
        height:     '100%',
        transition: `all ${DUR} ${EASE}`,
        cursor:     'pointer',
        overflow:   'hidden',
        zIndex:     1,
      };
    }
    const otherIdx = [0, 1, 2].filter(j => j !== sel).indexOf(i);
    return {
      position:   'absolute',
      top:        otherIdx === 0 ? '0px' : 'calc(50% + 2px)',
      left:       'calc(50% + 2px)',
      width:      'calc(50% - 2px)',
      height:     'calc(50% - 2px)',
      transition: `all ${DUR} ${EASE}`,
      cursor:     'pointer',
      overflow:   'hidden',
    };
  };

  // ── Mobile: stacked vertically, full width ─────────────────────────────

  if (isMobile) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '4px', background: '#f5f5f4' }}>
        {IMAGES.map(({ src, pos }, i) => (
          <div
            key={i}
            style={{ position: 'relative', width: '100%', aspectRatio: '4/3', overflow: 'hidden' }}
          >
            <Image
              src={src}
              alt="Infinity Puzzles Wild"
              fill
              style={{ objectFit: 'cover', objectPosition: pos }}
              sizes="100vw"
            />
          </div>
        ))}
      </div>
    );
  }

  // ── Desktop placeholder while isMobile resolves ────────────────────────

  if (isMobile === null) {
    return <div style={{ width: '100%', aspectRatio: '3/1', background: '#f5f5f4' }} />;
  }

  // ── Desktop: interactive expand grid ──────────────────────────────────

  const toggle = (i: number) => setSel(prev => (prev === i ? null : i));

  return (
    <div
      style={{
        position:   'relative',
        width:      '100%',
        height:     sel !== null ? '50vw' : '33.33vw',
        transition: `height ${DUR} ${EASE}`,
        overflow:   'hidden',
        background: '#f5f5f4',
      }}
    >
      {IMAGES.map(({ src, pos }, i) => {
        const style      = sel === null ? defaultStyle(i) : expandedStyle(i);
        const isExpanded = sel === i;

        return (
          <button
            key={i}
            onClick={() => toggle(i)}
            style={style}
            aria-label={isExpanded ? 'Minimera bild' : 'Förstora bild'}
          >
            <Image
              src={src}
              alt="Infinity Puzzles Wild"
              fill
              style={{
                objectFit:      'cover',
                objectPosition: pos,
                transition:     `transform ${DUR} ${EASE}`,
                transform:      isExpanded ? 'scale(1.02)' : 'scale(1)',
              }}
              sizes="(max-width: 640px) 100vw, 50vw"
            />

            {isExpanded && (
              <div style={{
                position:       'absolute',
                top:            12,
                right:          12,
                width:          28,
                height:         28,
                borderRadius:   '50%',
                background:     'rgba(0,0,0,0.35)',
                backdropFilter: 'blur(6px)',
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                pointerEvents:  'none',
              }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 2l8 8M10 2l-8 8" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
