'use client';

import { useState } from 'react';
import Image from 'next/image';

const IMAGES = [
  '/images/hero/nya/Infinity-puzzle_1.webp',
  '/images/hero/nya/Infinity-puzzle_2.webp',
  '/images/hero/nya/Infinity-puzzle_3.webp',
];

const EASE = 'cubic-bezier(0.4, 0, 0.2, 1)';
const DUR  = '0.42s';

export default function ThreeImageGrid() {
  const [sel, setSel] = useState<number | null>(null);

  const toggle = (i: number) =>
    setSel(prev => (prev === i ? null : i));

  // ── Position helpers ───────────────────────────────────────────────────

  const defaultStyle = (i: number): React.CSSProperties => ({
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

  const expandedStyle = (i: number): React.CSSProperties => {
    if (i === sel) {
      // Left half — full height
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
    // Right half — two stacked
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

  // ── Container height: 33.33vw default → 50vw expanded ─────────────────

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
      {IMAGES.map((src, i) => {
        const style = sel === null ? defaultStyle(i) : expandedStyle(i);
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
              className="object-cover object-center"
              style={{
                transition: `transform ${DUR} ${EASE}`,
                transform:  isExpanded ? 'scale(1.02)' : 'scale(1)',
              }}
              sizes="(max-width: 640px) 100vw, 50vw"
            />

            {/* Subtle "close" hint on expanded image */}
            {isExpanded && (
              <div
                style={{
                  position:        'absolute',
                  top:             12,
                  right:           12,
                  width:           28,
                  height:          28,
                  borderRadius:    '50%',
                  background:      'rgba(0,0,0,0.35)',
                  backdropFilter:  'blur(6px)',
                  display:         'flex',
                  alignItems:      'center',
                  justifyContent:  'center',
                  pointerEvents:   'none',
                }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 2l8 8M10 2l-8 8"
                        stroke="white" strokeWidth="1.8"
                        strokeLinecap="round"/>
                </svg>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
