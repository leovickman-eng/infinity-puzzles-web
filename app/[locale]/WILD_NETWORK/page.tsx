'use client';

import { useRouter } from 'next/navigation';
import { useRef, useEffect } from 'react';

export default function WildNetworkPage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const overlay = overlayRef.current;
    const iframe = iframeRef.current;
    if (!container || !overlay || !iframe) return;

    let scale = 1;
    let baseScale = 1;
    let translateX = 0;
    let translateY = 0;
    let baseTranslateX = 0;
    let baseTranslateY = 0;
    let initialDist = 0;
    let initialMidX = 0;
    let initialMidY = 0;

    function dist(t: TouchList) {
      const dx = t[0].clientX - t[1].clientX;
      const dy = t[0].clientY - t[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    }

    function applyTransform() {
      iframe.style.transformOrigin = '0 0';
      iframe.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    }

    function clamp(val: number, min: number, max: number) {
      return Math.min(max, Math.max(min, val));
    }

    function onTouchStart(e: TouchEvent) {
      if (e.touches.length === 2) {
        // Block iframe interaction during pinch
        overlay.style.pointerEvents = 'all';
        initialDist = dist(e.touches);
        initialMidX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        initialMidY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        baseScale = scale;
        baseTranslateX = translateX;
        baseTranslateY = translateY;
      }
    }

    function onTouchMove(e: TouchEvent) {
      if (e.touches.length !== 2) return;
      e.preventDefault();

      const newDist = dist(e.touches);
      const pinchScale = newDist / initialDist;
      const newScale = clamp(baseScale * pinchScale, 1, 5);

      const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;

      // Zoom towards pinch midpoint
      const scaleRatio = newScale / baseScale;
      let newX = midX - scaleRatio * (initialMidX - baseTranslateX);
      let newY = midY - scaleRatio * (initialMidY - baseTranslateY);

      // Clamp so we don't pan past edges
      const w = container.clientWidth;
      const h = container.clientHeight;
      newX = clamp(newX, w * (1 - newScale), 0);
      newY = clamp(newY, h * (1 - newScale), 0);

      scale = newScale;
      translateX = newX;
      translateY = newY;
      applyTransform();
    }

    function onTouchEnd(e: TouchEvent) {
      if (e.touches.length < 2) {
        // Re-enable iframe interaction
        overlay.style.pointerEvents = 'none';

        // Snap back if nearly at 1x
        if (scale < 1.1) {
          scale = 1;
          translateX = 0;
          translateY = 0;
          applyTransform();
        }
      }
    }

    overlay.addEventListener('touchstart', onTouchStart, { passive: false });
    overlay.addEventListener('touchmove', onTouchMove, { passive: false });
    overlay.addEventListener('touchend', onTouchEnd, { passive: false });
    container.addEventListener('touchstart', onTouchStart, { passive: false });

    return () => {
      overlay.removeEventListener('touchstart', onTouchStart);
      overlay.removeEventListener('touchmove', onTouchMove);
      overlay.removeEventListener('touchend', onTouchEnd);
      container.removeEventListener('touchstart', onTouchStart);
    };
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: '#242028', overflow: 'hidden' }}>
      <div ref={containerRef} style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <iframe
          ref={iframeRef}
          src="https://leovickman-eng.github.io/WILD_NETWORK/"
          allow="fullscreen"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            border: 'none',
            transformOrigin: '0 0',
            willChange: 'transform',
          }}
          title="Wild Network"
        />

        {/* Transparent overlay — blocks iframe during pinch, invisible otherwise */}
        <div
          ref={overlayRef}
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
      </div>

      {/* Back button */}
      <button
        onClick={() => router.back()}
        aria-label="Go back"
        style={{
          position: 'absolute',
          top: '20px',
          left: '24px',
          zIndex: 10,
          background: 'rgba(255,251,245,0.12)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '50%',
          width: '44px',
          height: '44px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'rgba(255,251,245,0.75)',
          transition: 'background 0.15s, color 0.15s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(255,251,245,0.2)';
          e.currentTarget.style.color = '#fff';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'rgba(255,251,245,0.12)';
          e.currentTarget.style.color = 'rgba(255,251,245,0.75)';
        }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M11 4L6 9l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
