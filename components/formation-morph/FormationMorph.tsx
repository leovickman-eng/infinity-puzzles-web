'use client';

import { useEffect, useRef, useState } from 'react';

const CANVAS_W   = 550;
const CANVAS_H   = 1265;
const BASE       = '/formations/GASP/F1';
const BREAKPOINT = 768;

const PX_PER_F1    = 60;
const F1_PAUSE     = 150;
const PX_PER_F2    = 60;
const POST_F2_HOLD = 200;
const P0_SCROLL    = 90;
const SLIDE_P0     = 250;
const SLIDE_PX     = 80;

const F1_SCROLL  = P0_SCROLL + 18 * PX_PER_F1 + F1_PAUSE;
const F2_SCROLL  = 19 * PX_PER_F2;
const TOTAL_ANIM = F1_SCROLL + F2_SCROLL + POST_F2_HOLD;

const F1_SRCS = Array.from({ length: 19 }, (_, i) => `${BASE}/1_${i + 1}.webp`);

const F2_SEQ: { add: string; remove: string }[] = [
  { add: `${BASE}/2_1.webp`,  remove: `${BASE}/1_12.webp` },
  { add: `${BASE}/2_2.webp`,  remove: `${BASE}/1_16.webp` },
  { add: `${BASE}/2_3.webp`,  remove: `${BASE}/1_18.webp` },
  { add: `${BASE}/2_4.webp`,  remove: `${BASE}/1_15.webp` },
  { add: `${BASE}/2_5.webp`,  remove: `${BASE}/1_8.webp`  },
  { add: `${BASE}/2_6.webp`,  remove: `${BASE}/1_7.webp`  },
  { add: `${BASE}/2_7.webp`,  remove: `${BASE}/1_13.webp` },
  { add: `${BASE}/2_8.webp`,  remove: `${BASE}/1_14.webp` },
  { add: `${BASE}/2_9.webp`,  remove: `${BASE}/1_6.webp`  },
  { add: `${BASE}/2_10.webp`, remove: `${BASE}/1_4.webp`  },
  { add: `${BASE}/2_11.webp`, remove: `${BASE}/1_3.webp`  },
  { add: `${BASE}/2_12.webp`, remove: `${BASE}/1_19.webp` },
  { add: `${BASE}/2_13.webp`, remove: `${BASE}/1_11.webp` },
  { add: `${BASE}/2_14.webp`, remove: `${BASE}/1_17.webp` },
  { add: `${BASE}/2_15.webp`, remove: `${BASE}/1_9.webp`  },
  { add: `${BASE}/2_16.webp`, remove: `${BASE}/1_10.webp` },
  { add: `${BASE}/2_17.webp`, remove: `${BASE}/1_5.webp`  },
  { add: `${BASE}/2_18.webp`, remove: `${BASE}/1_2.webp`  },
  { add: `${BASE}/2_19.webp`, remove: `${BASE}/1_1.webp`  },
];

const F1_IDX = new Map(F1_SRCS.map((src, i) => [src, i]));

function easeOut(t: number) { return 1 - (1 - t) ** 2; }

export default function FormationMorph() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const wrapRef    = useRef<HTMLDivElement>(null);

  const f1ImgRefs = useRef<(HTMLImageElement | null)[]>(Array(19).fill(null));
  const f2ImgRefs = useRef<(HTMLImageElement | null)[]>(Array(19).fill(null));

  const scaleRef        = useRef(1);
  const isMobileRef     = useRef(false);
  const innerHeightRef  = useRef(0);
  const prevF2          = useRef(-2);
  const frameSkipRef    = useRef(0);
  const prevTranslateY  = useRef<number | null>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const compute = () => {
      const mobile = window.innerWidth < BREAKPOINT;
      const s = mobile
        ? Math.min((window.innerWidth * 0.9) / CANVAS_W, 1)
        : Math.min(window.innerWidth / CANVAS_W * 2, window.innerHeight / CANVAS_H * 1.5, 3);
      scaleRef.current       = s;
      isMobileRef.current    = mobile;
      innerHeightRef.current = window.innerHeight;
      setScale(s);
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, []);

  useEffect(() => {
    let raf = 0;

    const update = () => {
      const overlay = overlayRef.current;
      const wrap    = wrapRef.current;
      const wrapper = wrapperRef.current;
      if (!overlay || !wrap || !wrapper) return;

      const scrolled = -wrapper.getBoundingClientRect().top;

      if (scrolled < 0) {
        overlay.style.opacity = '0';
        return;
      }

      overlay.style.opacity = '1';

      const inF2 = scrolled >= F1_SCROLL;

      const f1Progresses = F1_SRCS.map((_, i) => {
        if (i === 0) return Math.min(1, Math.max(0, scrolled / P0_SCROLL));
        const start = P0_SCROLL + (i - 1) * PX_PER_F1;
        return Math.min(1, Math.max(0, (scrolled - start) / PX_PER_F1));
      });

      let f2Step = -1, f2Progress = 0;
      if (inF2) {
        f2Progress = Math.min(1, (scrolled - F1_SCROLL) / F2_SCROLL);
        f2Step     = Math.min(18, Math.floor(f2Progress * 19));
      }

      if (inF2) {
        const ty = f2Progress * (innerHeightRef.current - 280 - CANVAS_H * scaleRef.current);
        if (prevTranslateY.current === null || Math.abs(ty - prevTranslateY.current) >= 1) {
          wrap.style.transform = `translateY(${ty}px)`;
          prevTranslateY.current = ty;
        }
      } else {
        if (prevTranslateY.current !== 0) {
          wrap.style.transform = 'translateY(0)';
          prevTranslateY.current = 0;
        }
      }

      const inF1Anim  = !inF2;
      const f2Changed = f2Step !== prevF2.current;
      frameSkipRef.current += 1;
      if (f2Changed) frameSkipRef.current = 0;
      const skipFrame = isMobileRef.current && (
        inF2 ? frameSkipRef.current % 3 !== 0 : frameSkipRef.current % 2 !== 0
      );

      if (!skipFrame) {
        if (inF1Anim) {
          for (let i = 0; i < 19; i++) {
            const el = f1ImgRefs.current[i];
            if (!el) continue;
            const raw   = f1Progresses[i] ?? 0;
            const e     = easeOut(Math.max(0, Math.min(1, raw)));
            const slide = i === 0 ? SLIDE_P0 : SLIDE_PX;
            el.style.opacity   = raw <= 0 ? '0' : String(e);
            el.style.transform = raw >= 1 ? 'translateY(0px)' : `translateY(${(1 - e) * slide}px)`;
          }
        }

        if (f2Changed) {
          prevF2.current = f2Step;
          for (let i = 0; i < 19; i++) {
            const done  = i <= f2Step;
            const f2Img = f2ImgRefs.current[i];
            if (f2Img) f2Img.style.opacity = done ? '1' : '0';

            const removeIdx = F1_IDX.get(F2_SEQ[i].remove);
            if (removeIdx !== undefined) {
              const f1El = f1ImgRefs.current[removeIdx];
              if (f1El) {
                f1El.style.transition = done ? 'opacity 0.3s ease' : '';
                f1El.style.opacity    = done ? '0' : '1';
              }
            }
          }
        }
      }
    };

    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); };
    window.addEventListener('scroll', onScroll, { passive: true });
    raf = requestAnimationFrame(update);
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, []);

  const imgBase: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'block',
    opacity: 0,
    pointerEvents: 'none',
  };

  return (
    <div ref={wrapperRef} style={{ height: `calc(100svh + ${TOTAL_ANIM}px)` }}>
      <div
        ref={overlayRef}
        style={{
          position: 'sticky',
          top: 0,
          height: '100svh',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          paddingTop: '140px',
          opacity: 0,
          pointerEvents: 'none',
          zIndex: 5,
        }}
      >
        <div
          ref={wrapRef}
          style={{
            flexShrink: 0,
            willChange: 'transform',
            position: 'relative',
            width: CANVAS_W * scale,
            height: CANVAS_H * scale,
          }}
        >
          {F1_SRCS.map((src, i) => (
            <img
              key={src}
              ref={el => { f1ImgRefs.current[i] = el; }}
              src={src}
              alt=""
              draggable={false}
              style={{
                ...imgBase,
                transform: `translateY(${i === 0 ? SLIDE_P0 : SLIDE_PX}px)`,
              }}
            />
          ))}
          {F2_SEQ.map(({ add }, i) => (
            <img
              key={add}
              ref={el => { f2ImgRefs.current[i] = el; }}
              src={add}
              alt=""
              draggable={false}
              style={{ ...imgBase, transition: 'opacity 0.3s ease' }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
