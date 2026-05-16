'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from 'next-intl';

gsap.registerPlugin(ScrollTrigger);

const CANVAS_W = 550;
const CANVAS_H = 1265;
const BASE = '/formations/GASP/F1';

const F1 = Array.from({ length: 19 }, (_, i) => `${BASE}/1_${i + 1}.png`);

const F2_SEQUENCE: { add: string; remove: string }[] = [
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

const FADE   = 0.3;
const STEP   = 0.6;
const PAUSE  = 3;
const FLY_IN = 2.0;

const F1_BUILD = 19 * STEP;
const F1_END   = FLY_IN + F1_BUILD;
const P_END    = F1_END + PAUSE;
const PX       = 150;

const F1_PIN_SCROLL = P_END * PX;
const F2_PX         = PX * 1.3;           // F2 scrolls 30% slower than F1 build
const F2_SCROLL     = F1_BUILD * F2_PX;

const f1CueTimings = [
  { inPx: FLY_IN * PX,                         outPx: (FLY_IN + F1_BUILD * 0.42) * PX },
  { inPx: (FLY_IN + F1_BUILD * 0.68) * PX,     outPx: (P_END - 1) * PX              },
];
const f2CueTimings = [
  { inPx: 0.5 * F2_PX,              outPx: F1_BUILD * 0.42 * F2_PX  },
  { inPx: F1_BUILD * 0.68 * F2_PX,  outPx: (F1_BUILD - 1) * F2_PX  },
];

const allSrcs = [...F1, ...F2_SEQUENCE.map((s) => s.add)];

function CanvasImages({
  canvasRef,
  scale,
  // f2 = true means all F1 images start visible (end-of-F1 state)
  f2 = false,
}: {
  canvasRef: React.RefObject<HTMLDivElement>;
  scale: number;
  f2?: boolean;
}) {
  return (
    <div style={{ width: CANVAS_W * scale, height: CANVAS_H * scale, position: 'relative', flexShrink: 0 }}>
      <div
        ref={canvasRef}
        style={{
          width: CANVAS_W,
          height: CANVAS_H,
          position: 'absolute',
          top: 0,
          left: 0,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        {allSrcs.map((src) => (
          <img
            key={src}
            data-src={src}
            src={src}
            alt=""
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: CANVAS_W,
              height: CANVAS_H,
              opacity: f2
                // F2 canvas: all F1 pieces visible (formation complete), F2 pieces hidden
                ? (F1.includes(src) ? 1 : 0)
                // F1 canvas: first piece visible, rest build up on scroll
                : (src === F1[0] ? 1 : 0),
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function FormationMorph() {
  const t = useTranslations('formationCues');

  const f1Ref       = useRef<HTMLElement>(null);
  const f2Ref       = useRef<HTMLDivElement>(null);
  const overlayRef  = useRef<HTMLDivElement>(null);
  const f1CanvasRef = useRef<HTMLDivElement>(null);

  const cue1Ref = useRef<HTMLDivElement>(null);
  const cue2Ref = useRef<HTMLDivElement>(null);
  const cue3Ref = useRef<HTMLDivElement>(null);
  const cue4Ref = useRef<HTMLDivElement>(null);

  const [scale, setScale] = useState(1);
  const scaleRef = useRef(1);

  useEffect(() => {
    const compute = () => {
      const s = Math.min(window.innerWidth / CANVAS_W * 2, window.innerHeight / CANVAS_H * 1.5, 3);
      scaleRef.current = s;
      setScale(s);
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, []);

  useEffect(() => {
    const f1El     = f1Ref.current;
    const f2El     = f2Ref.current;
    const overlay  = overlayRef.current;
    const f1Canvas = f1CanvasRef.current;
    if (!f1El || !f2El || !overlay || !f1Canvas) return;

    const getF1Img = (src: string) => f1Canvas.querySelector<HTMLElement>(`img[data-src="${src}"]`);

    const allSTs: ScrollTrigger[] = [];

    // ── F1: GSAP pin ──────────────────────────────────────────────────────
    const tlF1 = gsap.timeline({
      scrollTrigger: {
        trigger: f1El,
        start: 'top top',
        end: `+=${F1_PIN_SCROLL}`,
        pin: true,
        scrub: 0.5,
        invalidateOnRefresh: true,
        onEnter:     () => gsap.to(overlay, { opacity: 1, duration: 0.4 }),
        onLeaveBack: () => gsap.to(overlay, { opacity: 0, duration: 0.3 }),
      },
    });

    // 1_1.png: fly in from bottom of screen, then settle before formation builds
    const f1FirstImg = getF1Img(F1[0]);
    if (f1FirstImg) {
      gsap.set(f1FirstImg, { y: () => window.innerHeight / scaleRef.current });
      tlF1.fromTo(
        f1FirstImg,
        { y: () => window.innerHeight / scaleRef.current },
        { y: 0, ease: 'power2.out', duration: FLY_IN },
        0,
      );
    }

    // 1_2..1_19: build formation only after 1_1.png has settled
    F1.slice(1).forEach((src, i) => {
      const img = getF1Img(src);
      if (img) tlF1.to(img, { opacity: 1, duration: FADE }, FLY_IN + (i + 1) * STEP);
    });
    tlF1.to({}, { duration: PAUSE }, F1_END);

    // ── F1 text cues ──────────────────────────────────────────────────────
    [cue1Ref.current, cue2Ref.current].forEach((el, i) => {
      if (!el) return;
      const { inPx, outPx } = f1CueTimings[i];
      allSTs.push(
        ScrollTrigger.create({
          trigger: f1El, start: `top+=${inPx} top`, invalidateOnRefresh: true,
          onEnter:     () => gsap.to(el, { y: 0,   opacity: 1, duration: 0.6, ease: 'power2.out' }),
          onLeaveBack: () => gsap.to(el, { y: 36,  opacity: 0, duration: 0.3 }),
        }),
        ScrollTrigger.create({
          trigger: f1El, start: `top+=${outPx} top`, invalidateOnRefresh: true,
          onEnter:     () => gsap.to(el, { y: -16, opacity: 0, duration: 0.4, ease: 'power2.in' }),
          onLeaveBack: () => gsap.to(el, { y: 0,   opacity: 1, duration: 0.3 }),
        }),
      );
    });

    // ── F2: scrubbed on scroll, same fixed overlay/canvas as F1 ──────────
    const tlF2 = gsap.timeline({
      scrollTrigger: {
        trigger: f2El,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
        invalidateOnRefresh: true,
        onLeave:     () => gsap.to(overlay, { opacity: 0, duration: 0.5 }),
        onEnterBack: () => gsap.to(overlay, { opacity: 1, duration: 0.3 }),
      },
    });

    // Scroll the overlay upward from F1's end position to canvas-bottom-140px-from-viewport-bottom.
    // y = 0 at F2 start matches F1's end exactly (no jump); function value re-evaluates on resize.
    const f2TotalDur = (F2_SEQUENCE.length - 1) * STEP + FADE;
    tlF2.fromTo(
      overlay,
      { y: 0 },
      { y: () => window.innerHeight - 280 - CANVAS_H * scaleRef.current, ease: 'none', duration: f2TotalDur },
      0,
    );

    F2_SEQUENCE.forEach(({ add, remove }, i) => {
      const addImg    = getF1Img(add);
      const removeImg = getF1Img(remove);
      if (addImg)    tlF2.to(addImg,    { opacity: 1, duration: FADE }, i * STEP);
      if (removeImg) tlF2.to(removeImg, { opacity: 0, duration: FADE }, i * STEP);
    });

    // ── F2 text cues ──────────────────────────────────────────────────────
    [cue3Ref.current, cue4Ref.current].forEach((el, i) => {
      if (!el) return;
      const { inPx, outPx } = f2CueTimings[i];
      allSTs.push(
        ScrollTrigger.create({
          trigger: f2El, start: `top+=${inPx} top`, invalidateOnRefresh: true,
          onEnter:     () => gsap.to(el, { y: 0,   opacity: 1, duration: 0.6, ease: 'power2.out' }),
          onLeaveBack: () => gsap.to(el, { y: 36,  opacity: 0, duration: 0.3 }),
        }),
        ScrollTrigger.create({
          trigger: f2El, start: `top+=${outPx} top`, invalidateOnRefresh: true,
          onEnter:     () => gsap.to(el, { y: -16, opacity: 0, duration: 0.4, ease: 'power2.in' }),
          onLeaveBack: () => gsap.to(el, { y: 0,   opacity: 1, duration: 0.3 }),
        }),
      );
    });

    return () => {
      tlF1.scrollTrigger?.kill(); tlF1.kill();
      tlF2.scrollTrigger?.kill(); tlF2.kill();
      allSTs.forEach((st) => st.kill());
    };
  }, []);

  const cueTexts = [t('f1Start'), t('f1End'), t('f2Start'), t('f2End')] as const;

  const cueStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: 'clamp(2rem, 5vh, 4rem)',
    right: 'clamp(1rem, 5vw, 4rem)',
    maxWidth: 'min(240px, 38vw)',
    textAlign: 'right',
    zIndex: 10,
    opacity: 0,
    transform: 'translateY(36px)',
    pointerEvents: 'none',
    background: 'rgba(255,251,245,0.9)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    padding: '0.75rem 1.1rem',
    borderRadius: '10px',
  };
  const cueText: React.CSSProperties = {
    fontFamily: 'var(--font-trykker, Georgia, serif)',
    fontSize: 'clamp(13px, 1.8vw, 16px)',
    color: '#4a464b',
    lineHeight: 1.45,
  };

  const viewportStyle: React.CSSProperties = {
    height: '100svh',
    overflow: 'visible',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingTop: '140px',
  };

  return (
    <div style={{ position: 'relative', marginTop: '-250svh' }}>

      {/* ── F1: GSAP-pinned section ──────────────────────────────── */}
      <section ref={f1Ref} style={{ height: '100svh', position: 'relative', overflow: 'visible' }}>
        <div ref={cue1Ref} style={cueStyle}><span style={cueText}>{cueTexts[0]}</span></div>
        <div ref={cue2Ref} style={cueStyle}><span style={cueText}>{cueTexts[1]}</span></div>
      </section>

      {/* ── F2: scroll zone — provides scroll distance for the morph ── */}
      {/* +100svh keeps end:'bottom bottom' = exactly F2_SCROLL px of animation */}
      <div ref={f2Ref} style={{ height: `calc(${F2_SCROLL}px + 100svh)`, position: 'relative' }} />

      {/* ── Fixed overlay — active through both F1 and F2 ────────── */}
      <div
        ref={overlayRef}
        style={{
          ...viewportStyle,
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 5,
          opacity: 0,
          pointerEvents: 'none',
        }}
      >
        <CanvasImages canvasRef={f1CanvasRef} scale={scale} />
        <div ref={cue3Ref} style={cueStyle}><span style={cueText}>{cueTexts[2]}</span></div>
        <div ref={cue4Ref} style={cueStyle}><span style={cueText}>{cueTexts[3]}</span></div>
      </div>

    </div>
  );
}
