'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import lottie from 'lottie-web';
import { gsap } from 'gsap';

// ── Desktop geometry ──────────────────────────────────────────────────────────
const PIECE_H          = 120;
const BODY             = 150;
const KNOB             = 30;
const A_W              = BODY + KNOB;   // 180
const B_W              = KNOB + BODY;   // 180
const CONTAINER_HEIGHT = 240;
const PIECE_TOP        = Math.round((CONTAINER_HEIGHT - PIECE_H) / 2);
const DRAG_GAP         = 110;

// ── Mobile geometry ───────────────────────────────────────────────────────────
const PIECE_H_SM          = 80;
const BODY_SM             = 100;
const KNOB_SM             = 20;
const A_W_SM              = BODY_SM + KNOB_SM;   // 120
const B_W_SM              = KNOB_SM + BODY_SM;   // 120
const CONTAINER_HEIGHT_SM = 160;
const PIECE_TOP_SM        = Math.round((CONTAINER_HEIGHT_SM - PIECE_H_SM) / 2);
const DRAG_GAP_SM         = 75;

const SNAP_THRESHOLD = 15;
const STAR_COLORS    = ['#faef85', '#57d494', '#dac1ff', '#9b84bc'];

// ── Parametric path functions ─────────────────────────────────────────────────
function makePathA(body: number, knob: number, pieceH: number): string {
  const aw = body + knob;
  return `M 0,0 L ${body},0 L ${body},${(pieceH - knob) / 2} C ${aw},${(pieceH - knob) / 2} ${aw},${(pieceH + knob) / 2} ${body},${(pieceH + knob) / 2} L ${body},${pieceH} L 0,${pieceH} Z`;
}

function makePathB(knob: number, pieceH: number, bw: number): string {
  return `M 0,0 L ${bw},0 L ${bw},${pieceH} L 0,${pieceH} L 0,${(pieceH + knob) / 2} C ${knob},${(pieceH + knob) / 2} ${knob},${(pieceH - knob) / 2} 0,${(pieceH - knob) / 2} L 0,0 Z`;
}

// ── SVG piece components ──────────────────────────────────────────────────────
function PuzzleA({ body, knob, pieceH }: { body: number; knob: number; pieceH: number }) {
  const aw   = body + knob;
  const path = makePathA(body, knob, pieceH);
  const sx   = body / 150;
  const sy   = pieceH / 120;
  return (
    <svg width={aw} height={pieceH} viewBox={`0 0 ${aw} ${pieceH}`} style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id="sg-gradA" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#57d494" />
          <stop offset="100%" stopColor="#57d494" />
        </linearGradient>
        <filter id="sg-glowA" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="5" floodColor="#57d494" floodOpacity="0.55" />
        </filter>
      </defs>
      <path d={path} fill="url(#sg-gradA)" filter="url(#sg-glowA)" />
      <path d={path} fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" />
      <circle cx={70 * sx} cy={pieceH / 2} r={22 * sx} fill="rgba(255,255,255,0.12)" />
      <circle cx={70 * sx} cy={pieceH / 2} r={10 * sx} fill="rgba(255,255,255,0.22)" />
      <circle cx={25 * sx} cy={25 * sy} r={7 * sx} fill="rgba(255,255,255,0.13)" />
      <circle cx={25 * sx} cy={95 * sy} r={7 * sx} fill="rgba(255,255,255,0.13)" />
      <circle cx={125 * sx} cy={25 * sy} r={5 * sx} fill="rgba(255,255,255,0.1)" />
      <circle cx={125 * sx} cy={95 * sy} r={5 * sx} fill="rgba(255,255,255,0.1)" />
      <text x={70 * sx} y={66 * sy} fontSize={Math.round(14 * sx)} textAnchor="middle" dominantBaseline="middle" fill="rgba(255,255,255,0.55)" style={{ userSelect: 'none' }}>✦</text>
      <text x={115 * sx} y={40 * sy} fontSize={Math.round(9 * sx)} textAnchor="middle" fill="rgba(255,255,255,0.35)" style={{ userSelect: 'none' }}>✦</text>
      <text x={115 * sx} y={85 * sy} fontSize={Math.round(9 * sx)} textAnchor="middle" fill="rgba(255,255,255,0.35)" style={{ userSelect: 'none' }}>✦</text>
      <text x={30 * sx} y={62 * sy} fontSize={Math.round(8 * sx)} textAnchor="middle" fill="rgba(255,255,255,0.25)" style={{ userSelect: 'none' }}>★</text>
    </svg>
  );
}

function PuzzleB({ body, knob, pieceH, snapped }: { body: number; knob: number; pieceH: number; snapped: boolean }) {
  const bw   = knob + body;
  const path = makePathB(knob, pieceH, bw);
  const sw   = bw / 180;
  const sy   = pieceH / 120;
  return (
    <svg width={bw} height={pieceH} viewBox={`0 0 ${bw} ${pieceH}`} style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id="sg-gradB" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#b790ec" />
          <stop offset="100%" stopColor="#b790ec" />
        </linearGradient>
        <filter id="sg-glowB" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation={snapped ? 8 : 5}
            floodColor={snapped ? '#b790ec' : '#9060d8'} floodOpacity={snapped ? 0.9 : 0.55} />
        </filter>
      </defs>
      <path d={path} fill="url(#sg-gradB)" filter="url(#sg-glowB)" />
      <path d={path} fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" />
      <circle cx={110 * sw} cy={pieceH / 2} r={22 * sw} fill="rgba(255,255,255,0.12)" />
      <circle cx={110 * sw} cy={pieceH / 2} r={10 * sw} fill="rgba(255,255,255,0.22)" />
      <circle cx={155 * sw} cy={25 * sy} r={7 * sw} fill="rgba(255,255,255,0.13)" />
      <circle cx={155 * sw} cy={95 * sy} r={7 * sw} fill="rgba(255,255,255,0.13)" />
      <circle cx={60 * sw} cy={25 * sy} r={5 * sw} fill="rgba(255,255,255,0.1)" />
      <circle cx={60 * sw} cy={95 * sy} r={5 * sw} fill="rgba(255,255,255,0.1)" />
      <text x={110 * sw} y={66 * sy} fontSize={Math.round(14 * sw)} textAnchor="middle" dominantBaseline="middle" fill="rgba(255,255,255,0.55)" style={{ userSelect: 'none' }}>✦</text>
      <text x={65 * sw} y={40 * sy} fontSize={Math.round(9 * sw)} textAnchor="middle" fill="rgba(255,255,255,0.35)" style={{ userSelect: 'none' }}>✦</text>
      <text x={65 * sw} y={85 * sy} fontSize={Math.round(9 * sw)} textAnchor="middle" fill="rgba(255,255,255,0.35)" style={{ userSelect: 'none' }}>✦</text>
      <text x={150 * sw} y={62 * sy} fontSize={Math.round(8 * sw)} textAnchor="middle" fill="rgba(255,255,255,0.25)" style={{ userSelect: 'none' }}>★</text>
    </svg>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function SignupForm() {
  const lottieRef    = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging     = useRef(false);
  const dragOffsetX  = useRef(0);
  const xRef         = useRef(0);
  const snapXRef     = useRef(0);
  const isMobileRef  = useRef(false);

  const [aLeft, setALeft]       = useState(0);
  const [dragX, setDragX]       = useState(0);
  const [snapped, setSnapped]   = useState(false);
  const [email, setEmail]       = useState('');
  const [status, setStatus]     = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [isMobile, setIsMobile] = useState(false);

  // isMobile detection
  useEffect(() => {
    const check = () => {
      const mob = window.innerWidth < 640;
      isMobileRef.current = mob;
      setIsMobile(mob);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Compute centered positions from container width
  useEffect(() => {
    const compute = () => {
      if (!containerRef.current) return;
      const mob     = isMobileRef.current;
      const aw      = mob ? A_W_SM   : A_W;
      const bw      = mob ? B_W_SM   : B_W;
      const knob    = mob ? KNOB_SM  : KNOB;
      const body    = mob ? BODY_SM  : BODY;
      const dragGap = mob ? DRAG_GAP_SM : DRAG_GAP;
      const cw      = containerRef.current.clientWidth;
      const al      = Math.round((cw - (aw + bw - knob)) / 2);
      const sx      = al + body;
      setALeft(al);
      snapXRef.current = sx;
      if (!snapped) {
        const initX = sx + dragGap;
        xRef.current = initX;
        setDragX(initX);
      }
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, [snapped, isMobile]);

  // Lottie background
  useEffect(() => {
    if (!lottieRef.current) return;
    const anim = lottie.loadAnimation({
      container: lottieRef.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: '/lottie/test.json',
    });
    return () => anim.destroy();
  }, []);

  // Star-burst explosion
  const triggerStars = useCallback(() => {
    if (!containerRef.current) return;
    const mob      = isMobileRef.current;
    const pieceH   = mob ? PIECE_H_SM : PIECE_H;
    const body     = mob ? BODY_SM    : BODY;
    const knob     = mob ? KNOB_SM    : KNOB;
    const aw       = body + knob;
    const cntH     = mob ? CONTAINER_HEIGHT_SM : CONTAINER_HEIGHT;
    const pieceTop = Math.round((cntH - pieceH) / 2);
    const cx       = snapXRef.current + (aw - body / 2);
    const cy       = pieceTop + pieceH / 2;
    for (let i = 0; i < 36; i++) {
      const el   = document.createElement('div');
      const size = 8 + (i % 5) * 4;
      el.textContent = i % 3 === 0 ? '✦' : '★';
      el.style.cssText = `
        position:absolute; left:${cx}px; top:${cy}px;
        font-size:${size}px; line-height:1;
        color:${STAR_COLORS[i % STAR_COLORS.length]};
        pointer-events:none; z-index:30;
        transform:translate(-50%,-50%);
        user-select:none; white-space:nowrap;
      `;
      containerRef.current.appendChild(el);
      const angle = (i / 36) * Math.PI * 2;
      const dist  = 45 + (i % 5) * 22;
      gsap.to(el, {
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        opacity: 0,
        scale: 0.1,
        duration: 1.0,
        ease: 'power2.out',
        delay: (i % 6) * 0.035,
        onComplete: () => el.remove(),
      });
    }
  }, []);

  const checkSnap = useCallback((x: number) => {
    if (Math.abs(x - snapXRef.current) < SNAP_THRESHOLD) {
      xRef.current = snapXRef.current;
      setDragX(snapXRef.current);
      setSnapped(true);
      triggerStars();
    }
  }, [triggerStars]);

  // Mouse drag (X-axis only)
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (snapped || !containerRef.current) return;
    dragging.current = true;
    const rect = containerRef.current.getBoundingClientRect();
    dragOffsetX.current = e.clientX - rect.left - xRef.current;
    e.preventDefault();
  }, [snapped]);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (snapped || !containerRef.current) return;
    dragging.current = true;
    const rect = containerRef.current.getBoundingClientRect();
    dragOffsetX.current = e.touches[0].clientX - rect.left - xRef.current;
  }, [snapped]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x    = e.clientX - rect.left - dragOffsetX.current;
      xRef.current = x;
      setDragX(x);
    };
    const onMouseUp = () => {
      if (!dragging.current) return;
      dragging.current = false;
      checkSnap(xRef.current);
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [checkSnap]);

  useEffect(() => {
    const onTouchMove = (e: TouchEvent) => {
      if (!dragging.current || !containerRef.current) return;
      e.preventDefault();
      const rect = containerRef.current.getBoundingClientRect();
      const x    = e.touches[0].clientX - rect.left - dragOffsetX.current;
      xRef.current = x;
      setDragX(x);
    };
    const onTouchEnd = () => {
      if (!dragging.current) return;
      dragging.current = false;
      checkSnap(xRef.current);
    };
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
    return () => {
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [checkSnap]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!snapped || !email || status !== 'idle') return;
    setStatus('loading');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setStatus(res.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  };

  const curPieceH   = isMobile ? PIECE_H_SM          : PIECE_H;
  const curBody     = isMobile ? BODY_SM              : BODY;
  const curKnob     = isMobile ? KNOB_SM              : KNOB;
  const curContH    = isMobile ? CONTAINER_HEIGHT_SM  : CONTAINER_HEIGHT;
  const curPieceTop = isMobile ? PIECE_TOP_SM         : PIECE_TOP;

  return (
    <div data-page="signup" className="min-h-screen bg-background flex flex-col items-center pt-10 md:pt-20 pb-6">

      {/* Lottie — fullscreen background */}
      <div
        ref={lottieRef}
        style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', opacity: 0.35, zIndex: 0, pointerEvents: 'none' }}
      />

      <div className="relative flex flex-col items-center w-full" style={{ zIndex: 1 }}>

        {/* Text */}
        <div className="max-w-lg w-full px-6 text-center mt-0">
          <h1
            className="text-3xl md:text-6xl text-foreground mb-4 leading-tight"
            style={{ fontFamily: 'tumb, serif' }}
          >
            You found us.<br />The story starts here.
          </h1>
          <p
            className="text-sm md:text-lg text-foreground/65 leading-relaxed"
            style={{ fontFamily: 'var(--font-trykker)' }}
          >
            One email a week — honest, unfiltered, and occasionally a little
            chaotic. Just how we like it.
          </p>
        </div>

        {/* Captcha */}
        <div className="w-full max-w-lg px-6 mt-3 md:mt-6">
          <p
            className="text-center mb-3 transition-colors duration-300"
            style={{
              fontFamily: 'var(--font-trykker)',
              fontSize: '1.1rem',
              fontWeight: 700,
              color: snapped ? '#16a34a' : '#ae84ea',
            }}
          >
            {snapped ? "✓ Unlocked — you're in" : 'Slide the purple piece into place to unlock'}
          </p>

          <div
            ref={containerRef}
            className="relative w-full"
            style={{ height: curContH, userSelect: 'none', overflow: 'visible' }}
          >
            {/* Puzzle A — fixed left piece */}
            <div style={{ position: 'absolute', top: curPieceTop, left: aLeft, pointerEvents: 'none' }}>
              <PuzzleA body={curBody} knob={curKnob} pieceH={curPieceH} />
            </div>

            {/* Puzzle B — draggable right piece (X-axis only) */}
            <div
              onMouseDown={onMouseDown}
              onTouchStart={onTouchStart}
              style={{
                position: 'absolute',
                top: curPieceTop,
                left: dragX,
                cursor: snapped ? 'default' : 'grab',
                transition: snapped ? 'left 0.18s ease-out' : undefined,
                zIndex: 10,
              }}
            >
              <PuzzleB body={curBody} knob={curKnob} pieceH={curPieceH} snapped={snapped} />
            </div>
          </div>
        </div>

        {/* Email form */}
        <div className="max-w-lg w-full px-6 mt-2 md:mt-3">
          {status === 'success' ? (
            <p
              className="text-center text-xl text-foreground/70 py-8"
              style={{ fontFamily: 'var(--font-trykker)' }}
            >
              You&apos;re in. See you on the other side.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!snapped}
                placeholder="your@email.com"
                required
                className="w-full px-5 py-4 rounded-xl border outline-none transition-all duration-300"
                style={{
                  fontFamily: 'var(--font-trykker)',
                  fontSize: '1rem',
                  background: snapped ? '#fff' : '#f0ebe0',
                  borderColor: snapped ? '#1C1917' : 'rgba(28,25,23,0.12)',
                  color: snapped ? '#1C1917' : '#b0a898',
                  cursor: snapped ? 'text' : 'not-allowed',
                }}
              />
              <button
                type="submit"
                disabled={!snapped || status === 'loading'}
                className="w-full py-4 rounded-xl bg-foreground text-background transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-foreground/90"
                style={{ fontFamily: 'var(--font-trykker)', fontSize: '1.1rem', letterSpacing: '0.03em' }}
              >
                {status === 'loading' ? 'Sending...' : "I'm in"}
              </button>
              {status === 'error' && (
                <p className="text-center text-sm text-red-500" style={{ fontFamily: 'var(--font-trykker)' }}>
                  Something went wrong. Try again.
                </p>
              )}
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
