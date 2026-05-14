'use client';

import { useEffect, useRef } from 'react';
import { Ribeye } from 'next/font/google';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ribeye = Ribeye({ weight: '400', subsets: ['latin'] });

export default function WildTextSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    gsap.fromTo(
      sectionRef.current,
      { opacity: 0, y: 48 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      className="flex flex-col items-center justify-center py-40 px-6 bg-[#f5f0e8] opacity-0"
    >
      <p className={`${ribeye.className} text-lg md:text-xl text-stone-500 mb-4 tracking-wide`}>
        Here&apos;s the Infinity-puzzle
      </p>
      <h2 className={`${ribeye.className} text-[clamp(6rem,20vw,16rem)] leading-none text-stone-900`}>
        WILD
      </h2>
    </section>
  );
}
