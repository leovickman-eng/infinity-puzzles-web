'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

function extractTeaser(text: string, sentenceCount = 3): string {
  const parts = text.match(/[^.!?—]+[.!?]+/g) ?? [text];
  return parts.slice(0, sentenceCount).join(' ').trim();
}

export default function StoryTimeline() {
  const t  = useTranslations('story');
  const tp = useTranslations('physical');
  const tc = useTranslations('catalog');
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const chapters = [
    {
      number: '',
      title:  `${tp('title')} ${tp('subtitle')}`,
      period: tc('collection'),
      text:   tp('body'),
      image:  '/images/story/portrait_leo_vickman_infinity-puzzle.JPG',
    },
    {
      number: t('chapter1.number'),
      title: t('chapter1.title'),
      period: t('chapter1.period'),
      text: t('chapter1.text'),
      image: '/images/story/chapter1.jpg',
    },
    {
      number: t('chapter2.number'),
      title: t('chapter2.title'),
      period: t('chapter2.period'),
      text: t('chapter2.text'),
      image: '/images/story/chapter2.jpg',
    },
    {
      number: t('chapter3.number'),
      title: t('chapter3.title'),
      period: t('chapter3.period'),
      text: t('chapter3.text'),
      image: '/images/story/chapter3.jpg',
    },
    {
      number: t('chapter4.number'),
      title: t('chapter4.title'),
      period: t('chapter4.period'),
      text: t('chapter4.text'),
      image: '/images/story/chapter4.jpg',
    },
  ];

  const toggle = (i: number) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  const trykker: React.CSSProperties = { fontFamily: 'eight-condensed, Georgia, serif' };
  const trykkerBold: React.CSSProperties = { ...trykker, fontWeight: 700 };

  return (
    <div>
      {/* Section header */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-[680px] mx-auto">
          <p className="font-body uppercase tracking-widest text-primary mb-4" style={{ fontSize: '11px' }}>
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

      {/* Chapters */}
      <section className="px-6 pb-24 bg-background">
        <div className="max-w-[680px] mx-auto flex flex-col gap-0">
          {chapters.map((ch, i) => {
            const isOpen = expanded.has(i);
            const teaser = extractTeaser(ch.text);
            const isLast = i === chapters.length - 1;

            return (
              <div key={i} className="relative">
                {/* Vertical connector line */}
                {!isLast && (
                  <div className="absolute left-0 top-full w-px h-12 bg-foreground/10" />
                )}

                <div className="py-10">
                  {/* Image */}
                  <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-stone-100 mb-6 shadow-sm">
                    <Image
                      src={ch.image}
                      alt={ch.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 90vw, 680px"
                    />
                  </div>

                  {/* Meta */}
                  <p
                    className="font-body uppercase tracking-widest text-primary mb-2"
                    style={{ fontSize: '11px' }}
                  >
                    {ch.number ? <>{ch.number} &nbsp;·&nbsp; {ch.period}</> : ch.period}
                  </p>

                  {/* Title */}
                  <h3
                    className="text-foreground leading-snug mb-4"
                    style={{ ...trykkerBold, fontSize: 'clamp(20px, 3vw, 26px)' }}
                  >
                    {ch.title}
                  </h3>

                  {/* Teaser / full text */}
                  <p className="font-body text-foreground/65 leading-[1.8]" style={{ fontSize: '15px' }}>
                    {isOpen ? ch.text : teaser}
                  </p>

                  {/* Read more / less */}
                  <button
                    onClick={() => toggle(i)}
                    className="font-body mt-4 inline-flex items-center gap-1.5 text-foreground/40 hover:text-foreground transition-colors"
                    style={{ fontSize: '13px' }}
                  >
                    {isOpen ? 'Read less' : 'Read more'}
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      style={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease',
                      }}
                    >
                      <path
                        d="M2 4l4 4 4-4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>

                {!isLast && <div className="h-px bg-foreground/8" />}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
