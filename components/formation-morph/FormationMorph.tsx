'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

const CANVAS_W   = 550;
const CANVAS_H   = 1265;
const BASE       = '/formations/GASP/F1';
const BREAKPOINT = 768;

const PX_PER_F1    = 25;
const F1_PAUSE     = 150;
const PX_PER_F2    = 120;
const POST_F2_HOLD = 800;
const P0_SCROLL    = 90;  // scroll px devoted to piece 0 alone before others start
const SLIDE_P0     = 250; // canvas-px slide distance for piece 0 (starts further below)
const SLIDE_PX     = 80;  // canvas-px slide distance for pieces 1-18

const F1_SCROLL  = P0_SCROLL + 18 * PX_PER_F1 + F1_PAUSE; // 690px
const F2_SCROLL  = 19 * PX_PER_F2;             // 2280px
const TOTAL_ANIM = F1_SCROLL + F2_SCROLL + POST_F2_HOLD; // 3680px

const F1_SRCS = Array.from({ length: 19 }, (_, i) => `${BASE}/1_${i + 1}.png`);

const F2_SEQ: { add: string; remove: string }[] = [
  { add: `${BASE}/2_1.png`,  remove: `${BASE}/1_12.png` },
  { add: `${BASE}/2_2.png`,  remove: `${BASE}/1_16.png` },
  { add: `${BASE}/2_3.png`,  remove: `${BASE}/1_18.png` },
  { add: `${BASE}/2_4.png`,  remove: `${BASE}/1_15.png` },
  { add: `${BASE}/2_5.png`,  remove: `${BASE}/1_8.png`  },
  { add: `${BASE}/2_6.png`,  remove: `${BASE}/1_7.png`  },
  { add: `${BASE}/2_7.png`,  remove: `${BASE}/1_13.png` },
  { add: `${BASE}/2_8.png`,  remove: `${BASE}/1_14.png` },
  { add: `${BASE}/2_9.png`,  remove: `${BASE}/1_6.png`  },
  { add: `${BASE}/2_10.png`, remove: `${BASE}/1_4.png`  },
  { add: `${BASE}/2_11.png`, remove: `${BASE}/1_3.png`  },
  { add: `${BASE}/2_12.png`, remove: `${BASE}/1_19.png` },
  { add: `${BASE}/2_13.png`, remove: `${BASE}/1_11.png` },
  { add: `${BASE}/2_14.png`, remove: `${BASE}/1_17.png` },
  { add: `${BASE}/2_15.png`, remove: `${BASE}/1_9.png`  },
  { add: `${BASE}/2_16.png`, remove: `${BASE}/1_10.png` },
  { add: `${BASE}/2_17.png`, remove: `${BASE}/1_5.png`  },
  { add: `${BASE}/2_18.png`, remove: `${BASE}/1_2.png`  },
  { add: `${BASE}/2_19.png`, remove: `${BASE}/1_1.png`  },
];

const ALL_SRCS = [...F1_SRCS, ...F2_SEQ.map(s => s.add)];

// Quadratic ease-out: slow deceleration as piece settles into place
function easeOut(t: number) { return 1 - (1 - t) ** 2; }

// f1Progresses: per-piece entrance progress [0..1] for each of 19 F1 pieces.
// Piece 0 = seed (always 1). Pieces 1-18 each animate over one PX_PER_F1 slot.
function renderCanvas(
  canvas: HTMLCanvasElement,
  images: Map<string, HTMLImageElement>,
  f1Progresses: number[],
  f2Step: number,
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

  const removedF1 = new Set<string>();
  for (let i = 0; i <= f2Step; i++) removedF1.add(F2_SEQ[i].remove);

  for (let i = 0; i < 19; i++) {
    if (removedF1.has(F1_SRCS[i])) continue;
    const raw = f1Progresses[i] ?? 0;
    if (raw <= 0) continue;
    const img = images.get(F1_SRCS[i]);
    if (!img?.complete || !img.naturalWidth) continue;

    if (raw >= 1) {
      ctx.drawImage(img, 0, 0, CANVAS_W, CANVAS_H);
    } else {
      const e    = easeOut(raw);
      const slide = i === 0 ? SLIDE_P0 : SLIDE_PX;
      ctx.save();
      ctx.globalAlpha = e;
      ctx.drawImage(img, 0, (1 - e) * slide, CANVAS_W, CANVAS_H);
      ctx.restore();
    }
  }

  for (let i = 0; i <= f2Step; i++) {
    const img = images.get(F2_SEQ[i].add);
    if (img?.complete && img.naturalWidth) ctx.drawImage(img, 0, 0, CANVAS_W, CANVAS_H);
  }
}

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
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const cue1Ref    = useRef<HTMLDivElement>(null);
  const cue2Ref    = useRef<HTMLDivElement>(null);
  const cue3Ref    = useRef<HTMLDivElement>(null);
  const cue4Ref    = useRef<HTMLDivElement>(null);

  const imagesRef    = useRef<Map<string, HTMLImageElement>>(new Map());
  const loadedRef    = useRef(false);
  const scaleRef     = useRef(1);
  const isMobileRef  = useRef(false);
  const prevF2       = useRef(-2);
  const [scale, setScale] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  // Responsive scale
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

  // Preload all images, then prime canvas with seed piece only
  useEffect(() => {
    let cancelled = false;
    const mobile = window.innerWidth < BREAKPOINT;
    isMobileRef.current = mobile;
    const timer = setTimeout(() => {
      if (cancelled) return;
      const map = new Map<string, HTMLImageElement>();
      let loaded = 0;
      const check = () => {
        loaded++;
        if (loaded < ALL_SRCS.length || cancelled) return;
        imagesRef.current = map;
        loadedRef.current = true;
        const canvas = canvasRef.current;
        if (canvas) {
          const initProgress = F1_SRCS.map(() => 0);
          renderCanvas(canvas, map, initProgress, -1);
          prevF2.current = -1;
        }
        window.dispatchEvent(new Event('scroll'));
      };
      ALL_SRCS.forEach(src => {
        const img = new Image();
        img.onload = check;
        img.onerror = check;
        const match = src.match(/\/1_(\d+)\.png$/);
        img.src = (mobile && match)
          ? `/images/pieces/mobile/piece_${match[1]}.png`
          : src;
        map.set(src, img);
      });
    }, 0);
    return () => { cancelled = true; clearTimeout(timer); };
  }, []);

  // Scroll-driven update
  useEffect(() => {
    let raf = 0;

    const update = () => {
      const canvas  = canvasRef.current;
      const overlay = overlayRef.current;
      const wrap    = wrapRef.current;
      const wrapper = wrapperRef.current;
      if (!canvas || !overlay || !wrap || !wrapper) return;

      const scrolled = -wrapper.getBoundingClientRect().top;

      if (scrolled < 0 || !loadedRef.current) {
        overlay.style.opacity = '0';
        return;
      }

      overlay.style.opacity = '1';

      const inF2 = scrolled >= F1_SCROLL;

      // Per-piece entrance progress for F1:
      // Piece 0 gets P0_SCROLL px of scroll all to itself (longer slide, starts further below).
      // Pieces 1-18 each animate over one PX_PER_F1 slot, starting only after piece 0 settles.
      const f1Progresses = F1_SRCS.map((_, i) => {
        if (i === 0) return Math.min(1, Math.max(0, scrolled / P0_SCROLL));
        const start = P0_SCROLL + (i - 1) * PX_PER_F1;
        return Math.min(1, Math.max(0, (scrolled - start) / PX_PER_F1));
      });

      // F2 phase
      let f2Step = -1, f2Progress = 0;
      if (inF2) {
        f2Progress = Math.min(1, (scrolled - F1_SCROLL) / F2_SCROLL);
        f2Step     = Math.min(18, Math.floor(f2Progress * 19));
      }

      wrap.style.transform = inF2
        ? `translateY(${f2Progress * (window.innerHeight - 280 - CANVAS_H * scaleRef.current)}px)`
        : 'translateY(0)';

      // Redraw every frame during F1 (pieces are mid-animation).
      // During F2, only redraw when the step index changes.
      const inF1Anim = !inF2;
      const f2Changed = f2Step !== prevF2.current;
      if (inF1Anim || f2Changed) {
        prevF2.current = f2Step;
        renderCanvas(canvas, imagesRef.current, f1Progresses, f2Step);
      }

      // Text cues
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
        <div ref={wrapRef} style={{ flexShrink: 0, willChange: 'transform' }}>
          <canvas
            ref={canvasRef}
            width={CANVAS_W}
            height={CANVAS_H}
            style={{ display: 'block', width: CANVAS_W * scale, height: CANVAS_H * scale }}
          />
        </div>

        <div ref={cue1Ref} style={cueStyle}><span style={cueText}>{t('f1Start')}</span></div>
        <div ref={cue2Ref} style={cueStyle}><span style={cueText}>{t('f1End')}</span></div>
        <div ref={cue3Ref} style={cueStyle}><span style={cueText}>{t('f2Start')}</span></div>
        <div ref={cue4Ref} style={cueStyle}><span style={cueText}>{t('f2End')}</span></div>
      </div>
    </div>
  );
}
