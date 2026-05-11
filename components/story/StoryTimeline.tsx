'use client';

import { useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function StoryTimeline() {
  const t = useTranslations('story');
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

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
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add('(min-width: 768px)', () => {
        // Horizontal layout
        track.style.flexDirection = 'row';
        track.style.width = `${chapters.length * 100}vw`;

        // Per-panel desktop styles
        track.querySelectorAll<HTMLElement>('.chapter-panel').forEach((panel, i) => {
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

        const totalTravel = track.scrollWidth - window.innerWidth;

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
          // Reset all desktop styles on breakpoint exit
          track.style.flexDirection = '';
          track.style.width = '';
          track.querySelectorAll<HTMLElement>('.chapter-panel').forEach((panel) => {
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

  return (
    <div style={{ fontFamily: 'var(--font-trykker, Georgia, serif)' }}>

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
            className="font-bold text-foreground leading-tight"
            style={{ fontSize: '22px' }}
          >
            {t('title')}
          </h2>
          <div className="mt-10 h-px bg-foreground/10" />
        </div>
      </section>

      {/* Horizontal scroll section — pinned on desktop */}
      <section
        ref={sectionRef}
        className="relative overflow-hidden bg-background"
        style={{ height: '100svh' }}
      >
        {/* Track: flex-col on mobile, flex-row on desktop (set by matchMedia) */}
        <div ref={trackRef} className="flex flex-col h-full">
          {chapters.map((ch, i) => (
            <div
              key={i}
              className="chapter-panel flex flex-col bg-background"
              style={{
                minHeight: '100svh',
                padding: 'clamp(2rem, 5vw, 5rem)',
                gap: 'clamp(1.5rem, 3vw, 3rem)',
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
                  className="font-bold text-foreground uppercase tracking-widest mb-2"
                  style={{ fontSize: '13px' }}
                >
                  {ch.period}
                </p>
                <h3
                  className="font-bold text-foreground leading-snug mb-4"
                  style={{ fontSize: '19px' }}
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
      </section>
    </div>
  );
}
