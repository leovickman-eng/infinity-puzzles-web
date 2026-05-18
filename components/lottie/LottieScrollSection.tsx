'use client';

import { useEffect, useRef } from 'react';
import lottie, { AnimationItem } from 'lottie-web';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface LottieScrollSectionProps {
  idleSrc: string;
  src: string;
  className?: string;
  scrollLength?: number;
  children?: React.ReactNode;
}

export default function LottieScrollSection({
  idleSrc,
  src,
  children,
}: LottieScrollSectionProps) {
  const sectionRef     = useRef<HTMLElement>(null);
  const idleRef        = useRef<HTMLDivElement>(null);
  const scrollRef      = useRef<HTMLDivElement>(null);
  const childrenRef    = useRef<HTMLDivElement>(null);
  const scrollAnimRef  = useRef<AnimationItem | null>(null);
  const crossfadedRef  = useRef(false);

  useEffect(() => {
    const section    = sectionRef.current;
    const idleEl     = idleRef.current;
    const scrollEl   = scrollRef.current;
    const childrenEl = childrenRef.current;
    if (!section || !idleEl || !scrollEl || !childrenEl) return;

    const mobile = window.innerWidth < 768;

    // Shared animation handlers used by both mobile and desktop ScrollTriggers
    const handleUpdate = (self: ScrollTrigger) => {
      const anim = scrollAnimRef.current;
      if (!anim || !anim.totalFrames) return;

      if (!crossfadedRef.current && self.progress > 0.005) {
        crossfadedRef.current = true;
        gsap.to(idleEl,   { opacity: 0, duration: 0.45, ease: 'power1.inOut' });
        gsap.to(scrollEl, { opacity: 1, duration: 0.45, ease: 'power1.inOut' });
      }

      const p = self.progress;
      const textAlpha = p < 0.20 ? 1 : p > 0.45 ? 0 : 1 - (p - 0.20) / 0.25;
      gsap.set(childrenEl, { opacity: textAlpha });

      const frame = Math.round(self.progress * (anim.totalFrames - 1));
      anim.goToAndStop(frame, true);
    };

    const handleLeaveBack = () => {
      crossfadedRef.current = false;
      const anim = scrollAnimRef.current;
      if (anim?.totalFrames) anim.goToAndStop(0, true);
      gsap.to(scrollEl,   { opacity: 0, duration: 0.3 });
      gsap.to(idleEl,     { opacity: 1, duration: 0.3 });
      gsap.to(childrenEl, { opacity: 1, duration: 0.3 });
    };

    // Desktop: pin section; animation plays over scrollDist px of scroll.
    // Mobile: no pin — section scrolls naturally; animation plays over section height.
    let scrollDist = window.innerHeight * 1.5;

    const st = mobile
      ? ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          end: 'bottom top',   // section height = 100svh of scroll, no pin spacer
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: handleUpdate,
          onLeaveBack: handleLeaveBack,
        })
      : ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          end: () => `+=${scrollDist}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: handleUpdate,
          onLeaveBack: handleLeaveBack,
        });

    // Idle loop
    const idleAnim = lottie.loadAnimation({
      container: idleEl,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: idleSrc,
    });

    // Scroll animation (hidden until crossfade)
    const scrollAnim = lottie.loadAnimation({
      container: scrollEl,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      path: src,
    });
    scrollAnimRef.current = scrollAnim;

    scrollAnim.addEventListener('DOMLoaded', () => {
      if (!mobile) {
        // Replace overestimate with exact frame-based distance, then refresh
        // so S2 (FormationMorph) updates to the precise pin spacer position.
        scrollDist = Math.max(scrollAnim.totalFrames * 14, window.innerHeight);
      }
      ScrollTrigger.refresh();
    });

    return () => {
      st.kill();
      idleAnim.destroy();
      scrollAnim.destroy();
      scrollAnimRef.current = null;
    };
  }, [idleSrc, src]);

  return (
    <section
      ref={sectionRef}
      id="lottie-s1"
      className="relative flex justify-center items-center"
      style={{ height: '100svh' }}
    >
      <div ref={idleRef}   style={{ position: 'absolute', inset: 0, zIndex: 0 }} />
      <div ref={scrollRef} style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0 }} />
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
