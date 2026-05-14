'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CANVAS_SIZE = 550;
const PIECE_COUNT = 19;

export default function FormationMorph() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const compute = () =>
      setScale(Math.min(Math.min(window.innerWidth, window.innerHeight) / CANVAS_SIZE * 0.7, 1));
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    const imgs = Array.from(canvas.querySelectorAll<HTMLElement>('img'));

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=70%',
        pin: true,
        scrub: true,
        invalidateOnRefresh: true,
      },
    });

    imgs.forEach((img, i) => {
      const angle = (i / PIECE_COUNT) * Math.PI * 2;
      const dist = CANVAS_SIZE * 1.5;
      const fromX = CANVAS_SIZE / 2 + Math.cos(angle) * dist;
      const fromY = CANVAS_SIZE / 2 + Math.sin(angle) * dist;

      tl.fromTo(
        img,
        { left: fromX, top: fromY, opacity: 0 },
        { left: 0, top: 0, opacity: 1, duration: 1, ease: 'power2.out' },
        i * 0.05,
      );
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        height: '100vh',
        width: '100%',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '-75vh',
      }}
    >
      <div style={{ width: CANVAS_SIZE * scale, height: CANVAS_SIZE * scale, position: 'relative', flexShrink: 0 }}>
        <div
          ref={canvasRef}
          style={{
            width: CANVAS_SIZE,
            height: CANVAS_SIZE,
            position: 'absolute',
            top: 0,
            left: 0,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        >
          {Array.from({ length: PIECE_COUNT }, (_, i) => (
            <img
              key={i}
              src={`/images/pieces/piece_${i + 1}.png`}
              alt=""
              style={{ position: 'absolute', top: 0, left: 0, width: CANVAS_SIZE, height: CANVAS_SIZE }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
