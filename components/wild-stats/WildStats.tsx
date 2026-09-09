'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function WildStats() {
  const t = useTranslations('stats');

  const cards = [
    {
      img:   '/images/stats_illustrations/infinite_formations.png',
      value: t('formations'),
    },
    {
      img:   '/images/stats_illustrations/19_characters.png',
      value: t('characters'),
    },
    {
      img:   '/images/stats_illustrations/diameter.png',
      value: '30 cm diameter',
    },
    {
      img:   '/images/stats_illustrations/made_in_swden.png',
      value: t('sweden'),
      label: t('wood'),
    },
  ];

  return (
    <section style={{ background: '#FFFBF5', padding: '0 0 8px' }}>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 16px' }}>
        <div className="grid grid-cols-2 md:grid-cols-4">
          {cards.map((card, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 12,
                padding: 'clamp(12px, 2vw, 20px) clamp(10px, 2vw, 24px) clamp(16px, 2.5vw, 28px)',
              }}
            >
              <div style={{ height: 104, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Image
                  src={card.img}
                  alt=""
                  width={117}
                  height={104}
                  unoptimized
                  style={{ objectFit: 'contain', width: 'auto', height: '100%' }}
                  aria-hidden="true"
                />
              </div>

              <div style={{
                fontFamily: 'counterpress, sans-serif',
                fontWeight: 700,
                fontSize: 'clamp(1rem, 2vw, 1.4rem)',
                letterSpacing: '0.03em',
                color: '#5B4A8A',
                textAlign: 'center',
                lineHeight: 1.05,
              }}>
                {card.value}
              </div>

              {card.label && (
                <div style={{
                  fontFamily: 'counterpress, sans-serif',
                  fontWeight: 700,
                  fontSize: 'clamp(0.85rem, 1.6vw, 1.05rem)',
                  letterSpacing: '0.04em',
                  color: '#5B4A8A',
                  textAlign: 'center',
                  lineHeight: 1.3,
                }}>
                  {card.label}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
