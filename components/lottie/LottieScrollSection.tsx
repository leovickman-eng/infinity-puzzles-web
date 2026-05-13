'use client';

import { useEffect, useRef } from 'react';
import lottie, { AnimationItem } from 'lottie-web';

interface LottieScrollSectionProps {
  idleSrc: string;
  src: string;
  className?: string;
  scrollLength?: number;
}

export default function LottieScrollSection({
  idleSrc,
  src,
  className,
}: LottieScrollSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const switched = useRef(false);
  const idleAnimRef = useRef<AnimationItem | null>(null);
  const scrollAnimRef = useRef<AnimationItem | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Fas 1 — idle loop
    containerRef.current.innerHTML = '';
    idleAnimRef.current = lottie.loadAnimation({
      container: containerRef.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: idleSrc,
    });

    function loadIdle() {
      if (!containerRef.current) return;
      containerRef.current.innerHTML = '';
      idleAnimRef.current = lottie.loadAnimation({
        container: containerRef.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: idleSrc,
      });
    }

    // Fas 2 — byt animation beroende på scroll-position
    function onScroll() {
      if (!containerRef.current) return;

      if (!switched.current && window.scrollY > 10) {
        switched.current = true;

        idleAnimRef.current?.destroy();
        containerRef.current.innerHTML = '';

        scrollAnimRef.current = lottie.loadAnimation({
          container: containerRef.current,
          renderer: 'svg',
          loop: false,
          autoplay: true,
          path: src,
        });
      } else if (switched.current && window.scrollY <= 10) {
        switched.current = false;

        scrollAnimRef.current?.destroy();
        loadIdle();
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      idleAnimRef.current?.destroy();
      scrollAnimRef.current?.destroy();
    };
  }, [idleSrc, src]);

  return (
    <section className="flex justify-center items-center h-screen">
      <div
        ref={containerRef}
        className={className}
        style={{ width: '100vw', height: '100vh' }}
      />
    </section>
  );
}
