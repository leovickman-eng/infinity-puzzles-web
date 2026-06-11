'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

const CANVAS_W        = 550;
const CANVAS_H        = 1265;
const MOBILE_CANVAS_W = 275;
const MOBILE_CANVAS_H = 633;
const BASE        = '/formations/GASP/F1';
const BASE_MOBILE = '/formations/GASP/F1-mobile';
const BREAKPOINT  = 768;

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
  const prevF2          = useRef(-1);
  const frameSkipRef    = useRef(0);
  const prevTranslateY  = useRef<number | null>(null);
  const bgCanvasRef     = useRef<HTMLCanvasElement>(null);
  const bgTranslateRef  = useRef(0);
  const [scale, setScale] = useState(1);
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < BREAKPOINT
  );

  const base = isMobile ? BASE_MOBILE : BASE;

  const f1Srcs = useMemo(() =>
    Array.from({ length: 19 }, (_, i) => `${base}/1_${i + 1}.webp`),
    [base]
  );

  const f2Seq = useMemo(() => [
    { add: `${base}/2_1.webp`,  remove: `${base}/1_12.webp` },
    { add: `${base}/2_2.webp`,  remove: `${base}/1_16.webp` },
    { add: `${base}/2_3.webp`,  remove: `${base}/1_18.webp` },
    { add: `${base}/2_4.webp`,  remove: `${base}/1_15.webp` },
    { add: `${base}/2_5.webp`,  remove: `${base}/1_8.webp`  },
    { add: `${base}/2_6.webp`,  remove: `${base}/1_7.webp`  },
    { add: `${base}/2_7.webp`,  remove: `${base}/1_13.webp` },
    { add: `${base}/2_8.webp`,  remove: `${base}/1_14.webp` },
    { add: `${base}/2_9.webp`,  remove: `${base}/1_6.webp`  },
    { add: `${base}/2_10.webp`, remove: `${base}/1_4.webp`  },
    { add: `${base}/2_11.webp`, remove: `${base}/1_3.webp`  },
    { add: `${base}/2_12.webp`, remove: `${base}/1_19.webp` },
    { add: `${base}/2_13.webp`, remove: `${base}/1_11.webp` },
    { add: `${base}/2_14.webp`, remove: `${base}/1_17.webp` },
    { add: `${base}/2_15.webp`, remove: `${base}/1_9.webp`  },
    { add: `${base}/2_16.webp`, remove: `${base}/1_10.webp` },
    { add: `${base}/2_17.webp`, remove: `${base}/1_5.webp`  },
    { add: `${base}/2_18.webp`, remove: `${base}/1_2.webp`  },
    { add: `${base}/2_19.webp`, remove: `${base}/1_1.webp`  },
  ], [base]);

  const f1Idx = useMemo(() =>
    new Map(f1Srcs.map((src, i) => [src, i])),
    [f1Srcs]
  );

  useEffect(() => {
    const compute = () => {
      const mobile = window.innerWidth < BREAKPOINT;
      const s = mobile
        ? Math.min((window.innerWidth * 0.9) / MOBILE_CANVAS_W, 1.5)
        : Math.min(window.innerWidth / CANVAS_W * 2, window.innerHeight / CANVAS_H * 1.5, 3);
      scaleRef.current       = s;
      isMobileRef.current    = mobile;
      innerHeightRef.current = window.innerHeight;
      setScale(s);
      setIsMobile(mobile);
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, []);

  useEffect(() => {
    const canvas = bgCanvasRef.current;
    if (!canvas) return;
    const W = CANVAS_W;
    const H = CANVAS_H * 2;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < 1200; i++) {
      const x = Math.random() * W;
      const y = Math.random() * H;
      const r = 0.8 + Math.random() * 1.8;
      const a = 0.06 + Math.random() * 0.14;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(83,63,126,${a})`;
      ctx.fill();
    }
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

      const f1Progresses = f1Srcs.map((_, i) => {
        if (i === 0) return Math.min(1, Math.max(0, scrolled / P0_SCROLL));
        const start = P0_SCROLL + (i - 1) * PX_PER_F1;
        return Math.min(1, Math.max(0, (scrolled - start) / PX_PER_F1));
      });

      let f2Step = -1, f2Progress = 0;
      if (inF2) {
        f2Progress = Math.min(1, (scrolled - F1_SCROLL) / F2_SCROLL);
        f2Step     = Math.min(18, Math.floor(f2Progress * 19));
      }

      // Bakgrunds-canvas: stilla under F1, rör sig uppåt under F2
      const bgEl = bgCanvasRef.current;
      if (bgEl) {
        const bgTY = inF2 ? -f2Progress * CANVAS_H : 0;
        if (Math.abs(bgTY - bgTranslateRef.current) >= 1) {
          bgEl.style.transform = `translateY(${bgTY}px)`;
          bgTranslateRef.current = bgTY;
        }
      }

      if (inF2) {
        const canvasH = isMobileRef.current ? MOBILE_CANVAS_H : CANVAS_H;
        const ty = f2Progress * (innerHeightRef.current - 280 - canvasH * scaleRef.current);
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
        inF2 ? frameSkipRef.current % 4 !== 0 : frameSkipRef.current % 3 !== 0
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

            const removeIdx = f1Idx.get(f2Seq[i].remove);
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
            width: (isMobile ? MOBILE_CANVAS_W : CANVAS_W) * scale,
            height: (isMobile ? MOBILE_CANVAS_H : CANVAS_H) * scale,
          }}
        >
          <canvas
            ref={bgCanvasRef}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: 'auto',
              zIndex: -1,
              pointerEvents: 'none',
              willChange: 'transform',
            }}
          />
          {f1Srcs.map((src, i) => (
            <img
              key={src}
              ref={el => { f1ImgRefs.current[i] = el; }}
              src={src}
              alt=""
              decoding="async"
              draggable={false}
              style={{
                ...imgBase,
                transform: `translateY(${i === 0 ? SLIDE_P0 : SLIDE_PX}px)`,
              }}
            />
          ))}
          {f2Seq.map(({ add }, i) => (
            <img
              key={add}
              ref={el => { f2ImgRefs.current[i] = el; }}
              src={add}
              alt=""
              loading="lazy"
              decoding="async"
              draggable={false}
              style={{ ...imgBase, transition: 'opacity 0.3s ease' }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
