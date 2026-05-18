'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import lottie from 'lottie-web';
import { gsap } from 'gsap';

// ── Geometry ────────────────────────────────────────────────────────────────
// Piece A (fixed, left):  body 0-150, knob protrudes RIGHT 150-180
// Piece B (draggable, right): socket carved-in on LEFT 0-30, body 30-180
//
// At snap: B_left = A_left + 150 (BODY)
//   A's knob (absolute x 150-172) fills B's socket (same absolute x range)
//   Both SVG viewBoxes are 180×120 — shapes are exact mirror images
// ────────────────────────────────────────────────────────────────────────────
const PIECE_H = 120;
const BODY = 150;
const KNOB = 30;
const A_W = BODY + KNOB;   // 180
const B_W = KNOB + BODY;   // 180
const CONTAINER_HEIGHT = 240;
const PIECE_TOP = Math.round((CONTAINER_HEIGHT - PIECE_H) / 2);
const SNAP_THRESHOLD = 15;
const DRAG_GAP = 110; // B starts this far right of snap

// Cubic bezier knob: peaks at ~x=172 (22px beyond body at midpoint)
const PATH_A = `M 0,0 L ${BODY},0 L ${BODY},${(PIECE_H - KNOB) / 2} C ${A_W},${(PIECE_H - KNOB) / 2} ${A_W},${(PIECE_H + KNOB) / 2} ${BODY},${(PIECE_H + KNOB) / 2} L ${BODY},${PIECE_H} L 0,${PIECE_H} Z`;
const PATH_B = `M 0,0 L ${B_W},0 L ${B_W},${PIECE_H} L 0,${PIECE_H} L 0,${(PIECE_H + KNOB) / 2} C ${KNOB},${(PIECE_H + KNOB) / 2} ${KNOB},${(PIECE_H - KNOB) / 2} 0,${(PIECE_H - KNOB) / 2} L 0,0 Z`;

const STAR_COLORS = ['#faef85', '#57d494', '#dac1ff', '#9b84bc'];

// ── SVG piece components ─────────────────────────────────────────────────────
function PuzzleA() {
  return (
    <svg width={A_W} height={PIECE_H} viewBox={`0 0 ${A_W} ${PIECE_H}`} style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id="sg-gradA" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#57d494" />
          <stop offset="100%" stopColor="#57d494" />
        </linearGradient>
        <filter id="sg-glowA" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="5" floodColor="#57d494" floodOpacity="0.55" />
        </filter>
      </defs>
      <path d={PATH_A} fill="url(#sg-gradA)" filter="url(#sg-glowA)" />
      {/* Overlay shine */}
      <path d={PATH_A} fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" />
      {/* Inner decorative circles */}
      <circle cx="70" cy="60" r="22" fill="rgba(255,255,255,0.12)" />
      <circle cx="70" cy="60" r="10" fill="rgba(255,255,255,0.22)" />
      <circle cx="25" cy="25" r="7" fill="rgba(255,255,255,0.13)" />
      <circle cx="25" cy="95" r="7" fill="rgba(255,255,255,0.13)" />
      <circle cx="125" cy="25" r="5" fill="rgba(255,255,255,0.1)" />
      <circle cx="125" cy="95" r="5" fill="rgba(255,255,255,0.1)" />
      {/* Star sparks */}
      <text x="70" y="66" fontSize="14" textAnchor="middle" dominantBaseline="middle" fill="rgba(255,255,255,0.55)" style={{ userSelect: 'none' }}>✦</text>
      <text x="115" y="40" fontSize="9" textAnchor="middle" fill="rgba(255,255,255,0.35)" style={{ userSelect: 'none' }}>✦</text>
      <text x="115" y="85" fontSize="9" textAnchor="middle" fill="rgba(255,255,255,0.35)" style={{ userSelect: 'none' }}>✦</text>
      <text x="30" y="62" fontSize="8" textAnchor="middle" fill="rgba(255,255,255,0.25)" style={{ userSelect: 'none' }}>★</text>
    </svg>
  );
}

function PuzzleB({ snapped }: { snapped: boolean }) {
  return (
    <svg width={B_W} height={PIECE_H} viewBox={`0 0 ${B_W} ${PIECE_H}`} style={{ display: 'block', overflow: 'visible' }}>
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
      <path d={PATH_B} fill="url(#sg-gradB)" filter="url(#sg-glowB)" />
      <path d={PATH_B} fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" />
      <circle cx="110" cy="60" r="22" fill="rgba(255,255,255,0.12)" />
      <circle cx="110" cy="60" r="10" fill="rgba(255,255,255,0.22)" />
      <circle cx="155" cy="25" r="7" fill="rgba(255,255,255,0.13)" />
      <circle cx="155" cy="95" r="7" fill="rgba(255,255,255,0.13)" />
      <circle cx="60" cy="25" r="5" fill="rgba(255,255,255,0.1)" />
      <circle cx="60" cy="95" r="5" fill="rgba(255,255,255,0.1)" />
      <text x="110" y="66" fontSize="14" textAnchor="middle" dominantBaseline="middle" fill="rgba(255,255,255,0.55)" style={{ userSelect: 'none' }}>✦</text>
      <text x="65" y="40" fontSize="9" textAnchor="middle" fill="rgba(255,255,255,0.35)" style={{ userSelect: 'none' }}>✦</text>
      <text x="65" y="85" fontSize="9" textAnchor="middle" fill="rgba(255,255,255,0.35)" style={{ userSelect: 'none' }}>✦</text>
      <text x="150" y="62" fontSize="8" textAnchor="middle" fill="rgba(255,255,255,0.25)" style={{ userSelect: 'none' }}>★</text>
    </svg>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
export default function SignupForm() {
  const lottieRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const dragOffsetX = useRef(0);
  const xRef = useRef(0);
  const snapXRef = useRef(0);

  const [aLeft, setALeft] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [snapped, setSnapped] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Compute centered positions from container width
  useEffect(() => {
    const compute = () => {
      if (!containerRef.current) return;
      const cw = containerRef.current.clientWidth;
      const al = Math.round((cw - (A_W + B_W - KNOB)) / 2);  // center joined pair
      const sx = al + BODY;
      setALeft(al);
      snapXRef.current = sx;
      if (!snapped) {
        const initX = sx + DRAG_GAP;
        xRef.current = initX;
        setDragX(initX);
      }
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, [snapped]);

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
    const cx = snapXRef.current + (A_W - BODY / 2);
    const cy = PIECE_TOP + PIECE_H / 2;
    for (let i = 0; i < 36; i++) {
      const el = document.createElement('div');
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
      const dist = 45 + (i % 5) * 22;
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
      const x = e.clientX - rect.left - dragOffsetX.current;
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
      const x = e.touches[0].clientX - rect.left - dragOffsetX.current;
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

  return (
    <div className="min-h-screen bg-background flex flex-col items-center pt-20 pb-6">

      {/* Lottie — fullscreen background */}
      <div
        ref={lottieRef}
        style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', opacity: 0.35, zIndex: 0, pointerEvents: 'none' }}
      />

      <div className="relative flex flex-col items-center w-full" style={{ zIndex: 1 }}>

        {/* Text */}
        <div className="max-w-lg w-full px-6 text-center mt-0">
          <h1
            className="text-5xl md:text-6xl text-foreground mb-4 leading-tight"
            style={{ fontFamily: 'var(--font-trykker)' }}
          >
            You found us.<br />The story starts here.
          </h1>
          <p
            className="text-lg text-foreground/65 leading-relaxed"
            style={{ fontFamily: 'var(--font-trykker)' }}
          >
            One email a week — honest, unfiltered, and occasionally a little
            chaotic. Just how we like it.
          </p>
        </div>

        {/* Captcha */}
        <div className="w-full max-w-lg px-6 mt-6">
          <p
            className="text-sm text-center mb-3 transition-colors duration-300"
            style={{
              fontFamily: 'var(--font-trykker)',
              color: snapped ? '#16a34a' : 'rgba(28,25,23,0.38)',
            }}
          >
            {snapped ? "✓ Unlocked — you're in" : 'Slide the piece into place to unlock'}
          </p>

          <div
            ref={containerRef}
            className="relative w-full"
            style={{ height: CONTAINER_HEIGHT, userSelect: 'none', overflow: 'visible' }}
          >
            {/* Puzzle A — fixed left piece */}
            <div style={{ position: 'absolute', top: PIECE_TOP, left: aLeft, pointerEvents: 'none' }}>
              <PuzzleA />
            </div>

            {/* Puzzle B — draggable right piece (X-axis only) */}
            <div
              onMouseDown={onMouseDown}
              onTouchStart={onTouchStart}
              style={{
                position: 'absolute',
                top: PIECE_TOP,
                left: dragX,
                cursor: snapped ? 'default' : 'grab',
                transition: snapped ? 'left 0.18s ease-out' : undefined,
                zIndex: 10,
              }}
            >
              <PuzzleB snapped={snapped} />
            </div>
          </div>
        </div>

        {/* Email form */}
        <div className="max-w-lg w-full px-6 mt-3">
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
