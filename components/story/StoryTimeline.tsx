'use client';

import { useRef, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function StoryTimeline() {
  const t = useTranslations('story');
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const chapters = [
    {
      title: t('chapter1.title'),
      period: t('chapter1.period'),
      text: t('chapter1.text'),
      image: '/images/story/chapter1.jpg',
    },
    {
      title: t('chapter2.title'),
      period: t('chapter2.period'),
      text: t('chapter2.text'),
      image: '/images/story/chapter2.jpg',
    },
    {
      title: t('chapter3.title'),
      period: t('chapter3.period'),
      text: t('chapter3.text'),
      image: '/images/story/chapter3.jpg',
    },
    {
      title: t('chapter4.title'),
      period: t('chapter4.period'),
      text: t('chapter4.text'),
      image: '/images/story/chapter4.jpg',
    },
  ];

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add('(min-width: 768px)', () => {
        track.style.flexDirection = 'row';
        track.style.width = `${chapters.length * 100}vw`;

        track.querySelectorAll<HTMLElement>('.chapter-panel').forEach((panel, i) => {
          panel.style.display = 'flex';
          panel.style.width = '100vw';
          panel.style.minHeight = '';
          panel.style.height = '100%';
          panel.style.flexDirection = i % 2 === 0 ? 'row' : 'row-reverse';
          panel.style.alignItems = 'center';
          panel.style.padding = 'clamp(3rem, 7vw, 7rem)';
          panel.style.gap = 'clamp(3rem, 5vw, 5rem)';

          const imgWrap = panel.querySelector<HTMLElement>('.chapter-image');
          const txtWrap = panel.querySelector<HTMLElement>('.chapter-text');
          if (imgWrap) {
            imgWrap.style.flex = '0 0 45%';
            imgWrap.style.width = '45%';
            imgWrap.style.aspectRatio = 'auto';
            imgWrap.style.height = '68%';
          }
          if (txtWrap) {
            txtWrap.style.flex = '1 1 auto';
            txtWrap.style.maxWidth = '520px';
            txtWrap.style.overflowY = 'auto';
          }
        });

        gsap.to(track, {
          x: () => -(track.scrollWidth - window.innerWidth),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${track.scrollWidth - window.innerWidth}`,
            pin: true,
            scrub: 1.5,
            invalidateOnRefresh: true,
            snap: {
              snapTo: 1 / (chapters.length - 1),
              duration: { min: 0.3, max: 0.9 },
              ease: 'power2.inOut',
            },
          },
        });

        return () => {
          track.style.flexDirection = '';
          track.style.width = '';
          track.querySelectorAll<HTMLElement>('.chapter-panel').forEach((panel) => {
            panel.style.display = '';
            panel.style.width = '';
            panel.style.minHeight = '';
            panel.style.height = '';
            panel.style.flexDirection = '';
            panel.style.alignItems = '';
            panel.style.padding = '';
            panel.style.gap = '';
            const imgWrap = panel.querySelector<HTMLElement>('.chapter-image');
            const txtWrap = panel.querySelector<HTMLElement>('.chapter-text');
            if (imgWrap) {
              imgWrap.style.flex = '';
              imgWrap.style.width = '';
              imgWrap.style.aspectRatio = '';
              imgWrap.style.height = '';
            }
            if (txtWrap) {
              txtWrap.style.flex = '';
              txtWrap.style.maxWidth = '';
              txtWrap.style.overflowY = '';
            }
          });
        };
      });
    }, section);

    return () => ctx.revert();
  }, [chapters.length]);

  const goTo = (index: number) => {
    setActiveIndex(Math.max(0, Math.min(chapters.length - 1, index)));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 50) goTo(activeIndex + (delta < 0 ? 1 : -1));
  };

  const trykker: React.CSSProperties = { fontFamily: 'var(--font-trykker, Georgia, serif)' };
  const trykkerBold: React.CSSProperties = { fontFamily: 'var(--font-trykker, Georgia, serif)', fontWeight: 700 };

  return (
    <div style={trykker}>

      {/* Section header — normal scroll, not pinned */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-[680px] mx-auto">
          <p
            className="uppercase tracking-widest text-primary mb-4"
            style={{ fontSize: '11px' }}
          >
            {t('eyebrow')}
          </p>
          <h2
            className="text-foreground leading-tight"
            style={{ ...trykkerBold, fontSize: 'clamp(26px, 4vw, 40px)' }}
          >
            {t('title')}
          </h2>
          <div className="mt-10 h-px bg-foreground/10" />
        </div>
      </section>

      {/* Horizontal scroll section — pinned on desktop, carousel on mobile */}
      <section
        ref={sectionRef}
        className="relative overflow-hidden bg-background"
        style={{ height: '100svh' }}
        onTouchStart={isMobile ? handleTouchStart : undefined}
        onTouchEnd={isMobile ? handleTouchEnd : undefined}
      >
        <div ref={trackRef} className="flex flex-col h-full">
          {chapters.map((ch, i) => (
            <div
              key={i}
              className="chapter-panel flex flex-col bg-background"
              style={{
                minHeight: '100svh',
                padding: 'clamp(2rem, 5vw, 5rem)',
                paddingBottom: isMobile ? '7rem' : undefined,
                gap: 'clamp(1.5rem, 3vw, 3rem)',
                ...(isMobile && activeIndex !== i ? { display: 'none' } : {}),
              }}
            >
              {/* Image */}
              <div
                className="chapter-image relative overflow-hidden rounded-2xl shadow-md bg-stone-100 w-full aspect-[4/3]"
              >
                <Image
                  src={ch.image}
                  alt={ch.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 90vw, 45vw"
                />
              </div>

              {/* Text */}
              <div className="chapter-text">
                <p
                  className="uppercase tracking-widest text-foreground mb-3"
                  style={{
                    ...trykkerBold,
                    fontSize: isMobile ? '17px' : '13px',
                  }}
                >
                  {ch.period}
                </p>
                <h3
                  className="text-foreground leading-snug mb-4"
                  style={{
                    ...trykkerBold,
                    fontSize: isMobile ? 'clamp(22px, 5vw, 26px)' : '19px',
                  }}
                >
                  {ch.title}
                </h3>
                <p
                  className="text-foreground/65 leading-[1.75]"
                  style={{ fontSize: '15px' }}
                >
                  {ch.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile carousel navigation */}
        {isMobile && (
          <div
            className="absolute bottom-0 left-0 right-0 flex flex-col items-center gap-3 bg-background/90 backdrop-blur-sm"
            style={{ paddingTop: '1rem', paddingBottom: 'env(safe-area-inset-bottom, 1.5rem)' }}
          >
            {/* Dots */}
            <div className="flex items-center gap-2">
              {chapters.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Kapitel ${i + 1}`}
                  style={{
                    width: i === activeIndex ? '24px' : '8px',
                    height: '8px',
                    borderRadius: '4px',
                    background: i === activeIndex ? '#1C1917' : 'rgba(28,25,23,0.2)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'width 0.2s ease, background 0.2s ease',
                    padding: 0,
                  }}
                />
              ))}
            </div>

            {/* Prev / Next arrows */}
            <div className="flex gap-3" style={{ paddingBottom: '1rem' }}>
              <button
                onClick={() => goTo(activeIndex - 1)}
                disabled={activeIndex === 0}
                aria-label="Föregående kapitel"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  border: '1px solid rgba(28,25,23,0.2)',
                  background: 'transparent',
                  cursor: activeIndex === 0 ? 'not-allowed' : 'pointer',
                  opacity: activeIndex === 0 ? 0.3 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'opacity 0.2s ease',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10 4L6 8l4 4" stroke="#1C1917" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                onClick={() => goTo(activeIndex + 1)}
                disabled={activeIndex === chapters.length - 1}
                aria-label="Nästa kapitel"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  border: '1px solid rgba(28,25,23,0.2)',
                  background: 'transparent',
                  cursor: activeIndex === chapters.length - 1 ? 'not-allowed' : 'pointer',
                  opacity: activeIndex === chapters.length - 1 ? 0.3 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'opacity 0.2s ease',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 4l4 4-4 4" stroke="#1C1917" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
