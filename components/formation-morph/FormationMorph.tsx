'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

const CANVAS_W   = 550;
const CANVAS_H   = 1265;
const BREAKPOINT = 768;
const MAX_DPR    = 2; // cap device pixel ratio on mobile to save GPU memory

const PX_PER_F1    = 25;
const F1_PAUSE     = 150;
const PX_PER_F2    = 120;
const POST_F2_HOLD = 800;
const P0_SCROLL    = 90;
const SLIDE_P0     = 250;
const SLIDE_PX     = 80;

const F1_SCROLL  = P0_SCROLL + 18 * PX_PER_F1 + F1_PAUSE; // 690px
const F2_SCROLL  = 19 * PX_PER_F2;                         // 2280px
const TOTAL_ANIM = F1_SCROLL + F2_SCROLL + POST_F2_HOLD;   // 3770px

// Which F1 piece (0-based index) each F2 step removes — path-independent
const F2_REMOVE_IDX = [11, 15, 17, 14, 7, 6, 12, 13, 5, 3, 2, 18, 10, 16, 8, 9, 4, 1, 0];

type F2Entry = { add: string; remove: string };

function getSrcs(mobile: boolean): { f1Srcs: string[]; f2Seq: F2Entry[]; allSrcs: string[] } {
  const base   = mobile ? '/images/pieces/mobile' : '/images/pieces';
  const f1Srcs = Array.from({ length: 19 }, (_, i) => `${base}/piece_${i + 1}.png`);
  const f2Seq  = F2_REMOVE_IDX.map((removeIdx, i) => ({
    add:    `${base}/piece_f2_${i + 1}.png`,
    remove: f1Srcs[removeIdx],
  }));
  return { f1Srcs, f2Seq, allSrcs: [...f1Srcs, ...f2Seq.map(s => s.add)] };
}

function easeOut(t: number) { return 1 - (1 - t) ** 2; }

function renderCanvas(
  canvas: HTMLCanvasElement,
  images: Map<string, HTMLImageElement>,
  f1Srcs: string[],
  f2Seq: F2Entry[],
  f1Progresses: number[],
  f2Step: number,
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

  const removedF1 = new Set<string>();
  for (let i = 0; i <= f2Step; i++) removedF1.add(f2Seq[i].remove);

  for (let i = 0; i < 19; i++) {
    if (removedF1.has(f1Srcs[i])) continue;
    const raw = f1Progresses[i] ?? 0;
    if (raw <= 0) continue;
    const img = images.get(f1Srcs[i]);
    if (!img?.complete || !img.naturalWidth) continue;

    if (raw >= 1) {
      ctx.drawImage(img, 0, 0, CANVAS_W, CANVAS_H);
    } else {
      const e     = easeOut(raw);
      const slide = i === 0 ? SLIDE_P0 : SLIDE_PX;
      ctx.save();
      ctx.globalAlpha = e;
      ctx.drawImage(img, 0, (1 - e) * slide, CANVAS_W, CANVAS_H);
      ctx.restore();
    }
  }

  for (let i = 0; i <= f2Step; i++) {
    const img = images.get(f2Seq[i].add);
    if (img?.complete && img.naturalWidth) ctx.drawImage(img, 0, 0, CANVAS_W, CANVAS_H);
  }
}

function setCue(el: HTMLElement | null, visible: boolean, mobile: boolean) {
  if (!el) return;
  el.style.opacity   = visible ? '1' : '0';
  el.style.transform = mobile
    ? visible ? 'translateX(-50%)'      : 'translateX(-50%) translateY(36px)'
    : visible ? 'translate(-50%, -50%)' : 'translate(-50%, calc(-50% + 36px))';
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

  const imagesRef      = useRef<Map<string, HTMLImageElement>>(new Map());
  const f1SrcsRef      = useRef<string[]>([]);
  const f2SeqRef       = useRef<F2Entry[]>([]);
  const loadedRef      = useRef(false);
  const scaleRef       = useRef(1);
  const isMobileRef    = useRef(false);
  const prevF2Ref      = useRef(-2);
  const prevScrollRef  = useRef(-999); // dirty flag: last scrolled value that caused a redraw
  const [scale, setScale]     = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  // Responsive scale — caps DPR at MAX_DPR on mobile to limit canvas display resolution
  useEffect(() => {
    const compute = () => {
      const mobile = window.innerWidth < BREAKPOINT;
      const dpr    = Math.min(window.devicePixelRatio || 1, mobile ? MAX_DPR : 3);
      const s = mobile
        ? Math.min((window.innerWidth * 0.9) / CANVAS_W, 1) * (dpr / window.devicePixelRatio || 1)
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

  // Preload all images (mobile or desktop paths), then prime canvas
  useEffect(() => {
    let cancelled = false;
    const mobile = window.innerWidth < BREAKPOINT;
    const { f1Srcs, f2Seq, allSrcs } = getSrcs(mobile);
    f1SrcsRef.current = f1Srcs;
    f2SeqRef.current  = f2Seq;

    const map = new Map<string, HTMLImageElement>();
    let loaded = 0;

    const check = () => {
      loaded++;
      if (loaded < allSrcs.length || cancelled) return;
      // All images confirmed loaded before we enable the animation
      imagesRef.current = map;
      loadedRef.current = true;
      const canvas = canvasRef.current;
      if (canvas) {
        renderCanvas(canvas, map, f1Srcs, f2Seq, f1Srcs.map(() => 0), -1);
        prevF2Ref.current = -1;
      }
      window.dispatchEvent(new Event('scroll'));
    };

    allSrcs.forEach(src => {
      const img = new Image();
      img.onload  = check;
      img.onerror = check;
      img.src     = src;
      map.set(src, img);
    });

    return () => { cancelled = true; };
  }, []);

  // Scroll-driven update — RAF-throttled, dirty-flag guarded
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

      // Dirty flag: skip canvas work when scroll position hasn't changed
      const scrolledQ = Math.round(scrolled * 4) / 4; // 0.25px granularity
      const dirty     = scrolledQ !== prevScrollRef.current;
      if (dirty) prevScrollRef.current = scrolledQ;

      const inF2 = scrolled >= F1_SCROLL;

      // Per-piece F1 entrance progress
      const f1Progresses = f1SrcsRef.current.map((_, i) => {
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

      // Canvas translate during F2
      wrap.style.transform = inF2
        ? `translateY(${f2Progress * (window.innerHeight - 280 - CANVAS_H * scaleRef.current)}px)`
        : 'translateY(0)';

      // Redraw: F1 every dirty frame (pieces animating), F2 only on step change
      if (dirty) {
        const f2Changed = f2Step !== prevF2Ref.current;
        if (!inF2 || f2Changed) {
          prevF2Ref.current = f2Step;
          renderCanvas(canvas, imagesRef.current, f1SrcsRef.current, f2SeqRef.current, f1Progresses, f2Step);
        }
      }

      // Text cues (cheap DOM writes, always update)
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
            style={{
              display: 'block',
              width: CANVAS_W * scale,
              height: CANVAS_H * scale,
              willChange: 'transform',
            }}
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
