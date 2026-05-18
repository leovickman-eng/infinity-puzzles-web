'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

const CANVAS_W   = 550;
const CANVAS_H   = 1265;
const BASE       = '/formations/GASP/F1';
const BREAKPOINT = 768;

const PX_PER_F1    = 25;   // px of scroll per F1 piece (18 pieces × 25 = 450px build)
const F1_PAUSE     = 150;  // px pause after all F1 pieces before F2 starts
const PX_PER_F2    = 120;
const POST_F2_HOLD = 800;
const POST_F2_FADE = 300;

const F1_SCROLL = 18 * PX_PER_F1 + F1_PAUSE; // 600px  (was 2070 — too far for f2Marker)
const F2_SCROLL = 19 * PX_PER_F2;            // 2280px

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

function renderCanvas(
  canvas: HTMLCanvasElement,
  images: Map<string, HTMLImageElement>,
  f1Count: number,
  f2Step: number,
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

  const removedF1 = new Set<string>();
  for (let i = 0; i <= f2Step; i++) removedF1.add(F2_SEQ[i].remove);

  for (let i = 0; i < f1Count; i++) {
    if (!removedF1.has(F1_SRCS[i])) {
      const img = images.get(F1_SRCS[i]);
      if (img?.complete && img.naturalWidth) ctx.drawImage(img, 0, 0, CANVAS_W, CANVAS_H);
    }
  }
  for (let i = 0; i <= f2Step; i++) {
    const img = images.get(F2_SEQ[i].add);
    if (img?.complete && img.naturalWidth) ctx.drawImage(img, 0, 0, CANVAS_W, CANVAS_H);
  }
}

function setCue(el: HTMLElement | null, visible: boolean) {
  if (!el) return;
  el.style.opacity    = visible ? '1' : '0';
  el.style.transform  = visible ? 'translateY(0)' : 'translateY(36px)';
}

export default function FormationMorph() {
  const t = useTranslations('formationCues');

  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const overlayRef  = useRef<HTMLDivElement>(null);
  const wrapRef     = useRef<HTMLDivElement>(null);
  const f1MarkerRef = useRef<HTMLDivElement>(null);
  const f2MarkerRef = useRef<HTMLDivElement>(null);
  const holdRef     = useRef<HTMLDivElement>(null); // F2 complete; hold starts
  const fadeRef     = useRef<HTMLDivElement>(null); // hold complete; fade starts
  const endRef      = useRef<HTMLDivElement>(null); // fade complete; canvas gone

  const cue1Ref = useRef<HTMLDivElement>(null);
  const cue2Ref = useRef<HTMLDivElement>(null);
  const cue3Ref = useRef<HTMLDivElement>(null);
  const cue4Ref = useRef<HTMLDivElement>(null);

  const imagesRef   = useRef<Map<string, HTMLImageElement>>(new Map());
  const loadedRef   = useRef(false);
  const scaleRef    = useRef(1);
  const prevF1      = useRef(-1);
  const prevF2      = useRef(-2);
  const [scale, setScale] = useState(1);

  // Responsive scale
  useEffect(() => {
    const compute = () => {
      const mobile = window.innerWidth < BREAKPOINT;
      const s = mobile
        ? Math.min((window.innerWidth * 0.9) / CANVAS_W, 1)
        : Math.min(window.innerWidth / CANVAS_W * 2, window.innerHeight / CANVAS_H * 1.5, 3);
      scaleRef.current = s;
      setScale(s);
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, []);

  // Preload all images, then prime the initial canvas state
  useEffect(() => {
    let cancelled = false;
    const map = new Map<string, HTMLImageElement>();
    let loaded = 0;

    const check = () => {
      loaded++;
      if (loaded < ALL_SRCS.length || cancelled) return;
      imagesRef.current = map;
      loadedRef.current = true;
      const canvas = canvasRef.current;
      if (canvas) {
        renderCanvas(canvas, map, 1, -1);
        prevF1.current = 1;
        prevF2.current = -1;
      }
      window.dispatchEvent(new Event('scroll'));
    };

    ALL_SRCS.forEach(src => {
      const img = new Image();
      img.onload = check;
      img.onerror = check;
      img.src = src;
      map.set(src, img);
    });

    return () => { cancelled = true; };
  }, []);

  // Scroll-driven update loop
  useEffect(() => {
    let raf = 0;

    const update = () => {
      const canvas   = canvasRef.current;
      const overlay  = overlayRef.current;
      const wrap     = wrapRef.current;
      const f1Marker = f1MarkerRef.current;
      const f2Marker = f2MarkerRef.current;
      const holdEl   = holdRef.current;
      const fadeEl   = fadeRef.current;
      const endEl    = endRef.current;
      if (!canvas || !overlay || !wrap || !f1Marker || !f2Marker || !holdEl || !fadeEl || !endEl) return;

      const f1Top   = f1Marker.getBoundingClientRect().top;
      const f2Top   = f2Marker.getBoundingClientRect().top;
      const fadeTop = fadeEl.getBoundingClientRect().top;
      const endTop  = endEl.getBoundingClientRect().top;

      // Not yet in the animation zone, or images not ready
      if (f1Top > 0 || !loadedRef.current) {
        overlay.style.opacity = '0';
        return;
      }

      // Fully faded out — stop updating
      if (endTop <= 0) {
        overlay.style.opacity = '0';
        return;
      }

      // Scroll-driven fade: hold at 1.0 until fadeRef, then linear to 0 at endRef
      let opacity = 1;
      if (fadeTop < 0) {
        opacity = Math.max(0, 1 + fadeTop / POST_F2_FADE);
      }
      overlay.style.opacity = String(opacity);

      // F1 piece count (1_1 always shown; 1_2..1_19 build as user scrolls)
      let f1Count: number;
      if (f2Top > 0) {
        const scrolled = -f1Top; // 0 → F1_SCROLL
        f1Count = 1 + Math.min(18, Math.floor(scrolled / PX_PER_F1));
      } else {
        f1Count = 19;
      }

      // F2 step (-1 = none yet; 0..18 = swaps done so far)
      let f2Step = -1;
      let f2Progress = 0;
      if (f2Top <= 0) {
        f2Progress = Math.min(1, (-f2Top) / F2_SCROLL);
        f2Step = Math.min(18, Math.floor(f2Progress * 19));
      }

      // Translate canvas wrap upward during F2 to reveal bottom of formation
      if (f2Top <= 0) {
        const targetY = window.innerHeight - 280 - CANVAS_H * scaleRef.current;
        wrap.style.transform = `translateY(${f2Progress * targetY}px)`;
      } else {
        wrap.style.transform = 'translateY(0)';
      }

      // Redraw only when visible state changes
      if (f1Count !== prevF1.current || f2Step !== prevF2.current) {
        prevF1.current = f1Count;
        prevF2.current = f2Step;
        renderCanvas(canvas, imagesRef.current, f1Count, f2Step);
      }

      // Text cues
      if (f2Top > 0 && f1Top <= 0) {
        const p = (-f1Top) / F1_SCROLL;
        setCue(cue1Ref.current, p > 0.04 && p < 0.44);
        setCue(cue2Ref.current, p > 0.63 && p < 0.97);
        setCue(cue3Ref.current, false);
        setCue(cue4Ref.current, false);
      } else if (f2Top <= 0) {
        setCue(cue1Ref.current, false);
        setCue(cue2Ref.current, false);
        setCue(cue3Ref.current, f2Progress > 0.04 && f2Progress < 0.44);
        setCue(cue4Ref.current, f2Progress > 0.63 && f2Progress < 0.97);
      } else {
        setCue(cue1Ref.current, false);
        setCue(cue2Ref.current, false);
        setCue(cue3Ref.current, false);
        setCue(cue4Ref.current, false);
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    raf = requestAnimationFrame(update);

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const cueStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: 'clamp(2rem, 5vh, 4rem)',
    right: 'clamp(1rem, 5vw, 4rem)',
    maxWidth: 'min(240px, 38vw)',
    textAlign: 'right',
    zIndex: 10,
    opacity: 0,
    transform: 'translateY(36px)',
    transition: 'opacity 0.6s ease, transform 0.6s ease',
    pointerEvents: 'none',
    background: 'rgba(255,251,245,0.9)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    padding: '0.75rem 1.1rem',
    borderRadius: '10px',
  };

  const cueText: React.CSSProperties = {
    fontFamily: 'var(--font-trykker, Georgia, serif)',
    fontSize: 'clamp(1.2rem, 2vw, 1.5rem)',
    color: '#4a464b',
    lineHeight: 1.45,
  };

  return (
    // Desktop: md:-mt-[250svh] overlaps with S1's pin zone.
    // Mobile: no margin — wrapper starts flush at S1's bottom (100svh, no pin spacer).
    <div className="relative md:-mt-[250svh]">

      {/* Scroll markers — invisible, used only for position tracking */}
      <div ref={f1MarkerRef} />
      <div style={{ height: F1_SCROLL }} />
      <div ref={f2MarkerRef} />
      <div style={{ height: F2_SCROLL }} />
      <div ref={holdRef} />
      <div style={{ height: POST_F2_HOLD }} />
      <div ref={fadeRef} />
      <div style={{ height: POST_F2_FADE }} />
      <div ref={endRef} />
      {/* 100svh tail: S3 enters viewport bottom exactly as fade completes */}
      <div style={{ height: '100svh' }} />

      {/* Fixed overlay — visible through both F1 and F2 phases */}
      <div
        ref={overlayRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
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
          style={{ flexShrink: 0, willChange: 'transform' }}
        >
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
