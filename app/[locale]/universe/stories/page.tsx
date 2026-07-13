'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

export const CHARACTERS = [
  { id: 1,  name: 'Dolores',       animal: 'Narval',     audio: false },
  { id: 2,  name: 'Zuki',          animal: 'Rådjur',     audio: false },
  { id: 3,  name: 'Mani',          animal: 'Tukan',      audio: false },
  { id: 4,  name: 'Ziggy-Lou',     animal: 'Räv',        audio: true  },
  { id: 5,  name: 'Lana',           animal: 'Lama',       audio: true  },
  { id: 6,  name: 'Tanya',         animal: 'Tiger',      audio: false },
  { id: 7,  name: 'Mambo Viento',  animal: 'Drake',      audio: true  },
  { id: 8,  name: 'Dali',          animal: 'Kamelont',   audio: true  },
  { id: 9,  name: 'Pinto',         animal: 'Leopard',    audio: true  },
  { id: 10, name: 'Sixten',        animal: 'Katt',       audio: false },
  { id: 11, name: 'Coco',          animal: 'Fågel',      audio: false },
  { id: 12, name: 'Mona Moon',     animal: 'Ko',         audio: false },
  { id: 13, name: 'Borro',         animal: 'Noshörning', audio: true  },
  { id: 14, name: 'Pepe',          animal: 'Pingvin',    audio: false },
  { id: 15, name: 'Ronda',         animal: 'Krokodil',   audio: true  },
  { id: 16, name: 'Rumi',          animal: 'Papegoja',   audio: true  },
  { id: 17, name: 'Daffy Giraffy', animal: 'Giraff',     audio: false },
  { id: 18, name: 'Jerry',         animal: 'Hund',       audio: false },
  { id: 19, name: 'Mira',          animal: 'Kamel',      audio: false },
];

export default function StoriesPage() {
  const params = useParams();
  const locale = (params?.locale as string) ?? 'en';

  return (
    <div style={{
      minHeight: '100svh',
      background: '#0d0a12',
      color: '#f0eaf8',
      padding: '0 0 80px',
    }}>
      {/* Top bar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        padding: '18px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'linear-gradient(to bottom, rgba(13,10,18,0.98) 60%, transparent)',
      }}>
        <Link href={`/${locale}/universe`} style={{
          color: 'rgba(240,234,248,0.4)', fontSize: '13px',
          textDecoration: 'none', fontFamily: "'DM Sans', sans-serif",
          letterSpacing: '0.06em', transition: 'color 0.15s',
        }}
          onMouseEnter={e => (e.currentTarget.style.color = '#ae84ea')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(240,234,248,0.4)')}
        >
          ← Universe
        </Link>
        <span style={{
          fontFamily: "'eight-condensed', sans-serif",
          fontSize: '1.1rem', color: '#ae84ea', letterSpacing: '0.06em',
        }}>
          STORIES
        </span>
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: '2px',
        padding: '16px 2px',
        maxWidth: '900px',
        margin: '0 auto',
      }}>
        {CHARACTERS.map(ch => (
          <Link
            key={ch.id}
            href={`/${locale}/universe/stories/${ch.id}`}
            style={{ textDecoration: 'none', display: 'block', position: 'relative' }}
          >
            <div style={{
              position: 'relative',
              overflow: 'hidden',
              aspectRatio: '3/4',
              background: '#1a1530',
              borderRadius: '10px',
            }}>
              <img
                src={`/images/posters/poster_${String(ch.id).padStart(2, '0')}.webp`}
                alt={ch.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.3s ease' }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
              />

              {/* Gradient overlay */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(13,10,18,0.85) 0%, transparent 50%)',
                pointerEvents: 'none',
              }} />

              {/* Audio indicator */}
              {ch.audio && (
                <div style={{
                  position: 'absolute', top: '10px', right: '10px',
                  width: '22px', height: '22px',
                  background: 'rgba(174,132,234,0.85)',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '10px',
                }}>
                  ♪
                </div>
              )}

              {/* Name */}
              <div style={{
                position: 'absolute', bottom: '12px', left: '12px', right: '12px',
              }}>
                <div style={{
                  fontFamily: "'eight-condensed', sans-serif",
                  fontSize: '1rem', color: '#f0eaf8',
                  letterSpacing: '0.04em', lineHeight: 1.1,
                }}>
                  {ch.name}
                </div>
                <div style={{
                  fontSize: '9px', color: 'rgba(240,234,248,0.4)',
                  letterSpacing: '1.5px', textTransform: 'uppercase',
                  fontFamily: "'DM Sans', sans-serif", marginTop: '3px',
                }}>
                  {ch.animal}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
