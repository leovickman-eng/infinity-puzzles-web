'use client';

import { useEffect, useRef } from 'react';

const LINES = [
  'Build alone.',
  'Split it with a stranger.',
  'Or try the impossible chain.',
];

const COLORS = ['#ae84ea', '#16ade6', '#fb8f02'];

const IN_PX   = 60;
const HOLD_PX = 200;
const OUT_PX  = 60;
const SCROLL_PER_LINE = IN_PX + HOLD_PX + OUT_PX;
const TOTAL_SCROLL = SCROLL_PER_LINE * LINES.length + 500;

export default function PlayModes() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let raf = 0;

    const update = () => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;

      const scrolled = -wrapper.getBoundingClientRect().top;
      if (scrolled < 0) return;

      LINES.forEach((_, i) => {
        const el = lineRefs.current[i];
        if (!el) return;

        const start   = i * SCROLL_PER_LINE;
        const peakIn  = start + IN_PX;
        const peakOut = peakIn + HOLD_PX;
        const end     = peakOut + OUT_PX;
        const isLast  = i === LINES.length - 1;

        let opacity = 0;
        let translateY = 40;

        if (isLast) {
          const fadeStart = TOTAL_SCROLL - OUT_PX;
          if (scrolled >= start && scrolled < peakIn) {
            const t = (scrolled - start) / IN_PX;
            const e = 1 - Math.pow(1 - t, 2);
            opacity = e;
            translateY = (1 - e) * 40;
          } else if (scrolled >= peakIn && scrolled < fadeStart) {
            opacity = 1;
            translateY = 0;
          } else if (scrolled >= fadeStart) {
            const t = Math.min(1, (scrolled - fadeStart) / OUT_PX);
            opacity = 1 - t;
            translateY = -t * 20;
          }
        } else {
          if (scrolled >= start && scrolled < peakIn) {
            const t = (scrolled - start) / IN_PX;
            const e = 1 - Math.pow(1 - t, 2);
            opacity = e;
            translateY = (1 - e) * 40;
          } else if (scrolled >= peakIn && scrolled < peakOut) {
            opacity = 1;
            translateY = 0;
          } else if (scrolled >= peakOut && scrolled < end) {
            const t = (scrolled - peakOut) / OUT_PX;
            opacity = 1 - t;
            translateY = -t * 20;
          }
        }

        el.style.opacity = String(opacity);
        el.style.transform = `translateY(${translateY}px)`;
      });
    };

    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); };
    window.addEventListener('scroll', onScroll, { passive: true });
    raf = requestAnimationFrame(update);
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div ref={wrapperRef} style={{ height: TOTAL_SCROLL, position: 'relative', marginTop: '-50svh' }}>
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100svh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <div style={{ position: 'relative', width: '100%', textAlign: 'center' }}>
          {LINES.map((line, i) => (
            <div
              key={i}
              ref={el => { lineRefs.current[i] = el; }}
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                opacity: 0,
                transform: 'translateY(40px)',
                transition: 'none',
                padding: '0 24px',
              }}
            >
              <span
                style={{
                  fontFamily: 'tumb, serif',
                  fontSize: 'clamp(1.4rem, 3.5vw, 2.8rem)',
                  fontWeight: 700,
                  color: COLORS[i],
                  letterSpacing: '0.02em',
                  lineHeight: 1.2,
                }}
              >
                {line}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
