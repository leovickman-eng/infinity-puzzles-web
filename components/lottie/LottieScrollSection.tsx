'use client';

import { useEffect, useRef } from 'react';
import lottie from 'lottie-web';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface LottieScrollSectionProps {
  src: string;
  className?: string;
  // How many viewport-heights of scroll to consume while pinned
  scrollLength?: number;
}

export default function LottieScrollSection({
  src,
  className,
  scrollLength = 0.3,
}: LottieScrollSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !sectionRef.current) return;

    // Populated asynchronously once Lottie has parsed the JSON.
    // The ST is registered synchronously so GSAP knows about the pin
    // before sibling triggers calculate their positions.
    const totalFrames = { current: 0 };

    const anim = lottie.loadAnimation({
      container: containerRef.current,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      path: src,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid meet',
      },
    });

    anim.addEventListener('DOMLoaded', () => {
      const svg = containerRef.current?.querySelector('svg');
      if (svg) {
        svg.style.width = '100%';
        svg.style.height = 'auto';
      }
      totalFrames.current = anim.totalFrames;
    });

    // Create the ScrollTrigger synchronously so it is registered before
    // sibling effects (FormationMorph) run and before ScrollTrigger.refresh().
    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: `+=${window.innerHeight * scrollLength}`,
      pin: true,
      scrub: 0.5,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        if (totalFrames.current === 0) return;
        anim.goToAndStop(self.progress * (totalFrames.current - 1), true);
      },
      // scrub: 0.5 lags slightly — force the last frame when scroll reaches the end
      onLeave: () => {
        if (totalFrames.current > 0) {
          anim.goToAndStop(totalFrames.current - 1, true);
        }
      },
    });

    return () => {
      anim.destroy();
      st.kill();
    };
  }, [src, scrollLength]);

  return (
    <section
      ref={sectionRef}
      className="flex justify-center items-center bg-transparent h-screen"
    >
      <div
        ref={containerRef}
        className={className}
        style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)' }}
      />
    </section>
  );
}
