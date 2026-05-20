'use client';

import { useEffect, useRef } from 'react';
import lottie from 'lottie-web';

interface LottieScrollSectionProps {
  idleSrc: string;
  src?: string;
  className?: string;
  scrollLength?: number;
  children?: React.ReactNode;
}

export default function LottieScrollSection({
  idleSrc,
  children,
}: LottieScrollSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const idleRef    = useRef<HTMLDivElement>(null);
  const childrenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section    = sectionRef.current;
    const idleEl     = idleRef.current;
    if (!section || !idleEl) return;

    // Fade out as section exits upward after unsticking
    const handleScroll = () => {
      const top = section.getBoundingClientRect().top;
      idleEl.style.opacity = top >= 0
        ? '1'
        : String(Math.max(0, 1 + top / (window.innerHeight * 0.6)));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    const anim = lottie.loadAnimation({
      container: idleEl,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: idleSrc,
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      anim.destroy();
    };
  }, [idleSrc]);

  return (
    <section
      ref={sectionRef}
      id="lottie-s1"
      className="relative flex justify-center items-center"
      style={{ height: '100svh', position: 'sticky', top: 0, zIndex: 10 }}
    >
      <div
        ref={idleRef}
        className="lottie-idle-layer"
        style={{ position: 'absolute', inset: 0, zIndex: 0 }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(255,251,245,0.5)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />
      <div ref={childrenRef} style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
        {children}
      </div>
    </section>
  );
}
