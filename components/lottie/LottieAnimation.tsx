'use client';

import { useEffect, useRef } from 'react';
import lottie from 'lottie-web';

interface LottieAnimationProps {
  src: string;
  className?: string;
}

export default function LottieAnimation({ src, className }: LottieAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const anim = lottie.loadAnimation({
      container: containerRef.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: src,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid meet',
      },
    });

    // Override the inline pixel dimensions lottie-web sets on the SVG element
    // so it scales responsively with the container.
    anim.addEventListener('DOMLoaded', () => {
      const svg = containerRef.current?.querySelector('svg');
      if (svg) {
        svg.style.width = '100%';
        svg.style.height = 'auto';
      }
    });

    return () => anim.destroy();
  }, [src]);

  return <div ref={containerRef} className={className} />;
}
