'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

const CANVAS_W   = 550;
const CANVAS_H   = 1265;
const BASE       = '/formations/GASP/F1';
const BREAKPOINT = 768;

const PX_PER_F1    = 60;
const F1_PAUSE     = 150;
const PX_PER_F2    = 120;
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

function setCue(el: HTMLElement | null, visible: boolean, mobile: boolean) {
  if (!el) return;
  el.style.opacity   = visible ? '1' : '0';
  el.style.transform = mobile
    ? visible ? 'translateX(-50%)'           : 'translateX(-50%) translateY(36px)'
    : visible ? 'translate(-50%, -50%)'      : 'translate(-50%, calc(-50% + 36px))';
}

export default function FormationMorph() {
  const t = useTranslations('formationCues');

  const wrapperRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const wrapRef    = useRef<HTMLDivElement>(null);
  const cue1Ref    = useRef<HTMLDivElement>(null);
  const cue2Ref    = useRef<HTMLDivElement>(null);
  const cue3Ref    = useRef<HTMLDivElement>(null);
  const cue4Ref    = useRef<HTMLDivElement>(null);

  const f1ImgRefs = useRef<(HTMLImageElement | null)[]>(Array(19).fill(null));
  const f2ImgRefs = useRef<(HTMLImageElement | null)[]>(Array(19).fill(null));

  const scaleRef     = useRef(1);
  const isMobileRef  = useRef(false);
  const prevF2       = useRef(-2);
  const frameSkipRef = useRef(0);
  const [scale, setScale] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const compute = () => {
      const mobile = window.innerWidth < BREAKPOINT;
      const s = mobile
        ? Math.min((window.innerWidth * 0.9) / CANVAS_W, 1)
        : Math.min(window.innerWidth / CANVAS_W * 2, window.innerHeight / CANVAS_H * 1.5, 3);
      scaleRef.current    = s;
      isMobileRef.current = mobile;
      setScale(s);
      setIsMobile(mobile);
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

      wrap.style.transform = inF2
        ? `translateY(${f2Progress * (window.innerHeight - 280 - CANVAS_H * scaleRef.current)}px)`
        : 'translateY(0)';

      const inF1Anim  = !inF2;
      const f2Changed = f2Step !== prevF2.current;
      frameSkipRef.current += 1;
      if (f2Changed) frameSkipRef.current = 0;
      const skipFrame = isMobileRef.current && frameSkipRef.current % 2 !== 0;

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

      const mob = isMobileRef.current;
      if (!inF2) {
        const p = scrolled / F1_SCROLL;
        setCue(cue1Ref.current, p > 0.04 && p < 0.44, mob);
        setCue(cue2Ref.current, p > 0.63 && p < 0.97, mob);
        setCue(cue3Ref.current, false, mob);
        setCue(cue4Ref.current, false, mob);
      } else {
        setCue(cue1Ref.current, false, mob);
        setCue(cue2Ref.current, false, mob);
        setCue(cue3Ref.current, f2Progress > 0.04 && f2Progress < 0.44, mob);
        setCue(cue4Ref.current, f2Progress > 0.63 && f2Progress < 0.97, mob);
      }
    };

    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); };
    window.addEventListener('scroll', onScroll, { passive: true });
    raf = requestAnimationFrame(update);
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, []);

  const cueStyle: React.CSSProperties = {
    position: 'absolute',
    left: '50%',
    ...(isMobile
      ? { bottom: '80px',  transform: 'translateX(-50%) translateY(36px)' }
      : { top: '50%',      transform: 'translate(-50%, calc(-50% + 36px))' }
    ),
    maxWidth: 'min(320px, 80vw)',
    textAlign: 'center',
    zIndex: 10,
    opacity: 0,
    transition: 'opacity 0.6s ease, transform 0.6s ease',
    pointerEvents: 'none',
    background: 'rgba(255,251,245,0.7)',
    backdropFilter: 'blur(6px)',
    WebkitBackdropFilter: 'blur(6px)',
    padding: '12px 24px',
    borderRadius: '8px',
  };

  const cueText: React.CSSProperties = {
    fontFamily: 'Nakone, Georgia, serif',
    fontSize: 'clamp(1.2rem, 2vw, 1.5rem)',
    color: '#4a464b',
    lineHeight: 1.45,
  };

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

        <div ref={cue1Ref} style={cueStyle}><span style={cueText}>{t('f1Start')}</span></div>
        <div ref={cue2Ref} style={cueStyle}><span style={cueText}>{t('f1End')}</span></div>
        <div ref={cue3Ref} style={cueStyle}><span style={cueText}>{t('f2Start')}</span></div>
        <div ref={cue4Ref} style={cueStyle}><span style={cueText}>{t('f2End')}</span></div>
      </div>
    </div>
  );
}
