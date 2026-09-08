'use client';

import { useState, useRef } from 'react';

const CHARACTERS = [
  { id: 1,  name: 'Dolores',       animal: 'Narval',     desc: 'Lever djupt under ytan och vet saker ingen annan vet.' },
  { id: 2,  name: 'Zuki',          animal: 'Rådjur',     desc: 'Alltid först att märka när något håller på att förändras.' },
  { id: 3,  name: 'Mani',          animal: 'Tukan',      desc: 'Klär sig för livet, inte för tillfället.' },
  { id: 4,  name: 'Ziggy-Lou',     animal: 'Räv',        desc: 'Har alltid tre planer — och den bästa är den ingen ser.' },
  { id: 5,  name: 'Lana',          animal: 'Lama',       desc: 'Bär på mer än den ser ut att klara av, utan att klaga.' },
  { id: 6,  name: 'Tanya',         animal: 'Tiger',      desc: 'Rör sig tyst men lämnar spår som syns länge.' },
  { id: 7,  name: 'Mambo Viento',  animal: 'Drake',      desc: 'Kommer in som ett väder och lämnar rummet annorlunda.' },
  { id: 8,  name: 'Dali',          animal: 'Kamelont',   desc: 'Anpassar sig till allt — men förlorar aldrig sig själv.' },
  { id: 9,  name: 'Pinto',         animal: 'Leopard',    desc: 'Snabbare än du hinner tänka, men aldrig utan avsikt.' },
  { id: 10, name: 'Sixten',        animal: 'Katt',       desc: 'Bryr sig djupt, men alltid på sina egna villkor.' },
  { id: 11, name: 'Coco',          animal: 'Fågel',      desc: 'Sjunger inte för att bli hörd — sjunger för att det känns rätt.' },
  { id: 12, name: 'Mona Moon',     animal: 'Ko',         desc: 'Drömmer om natten och minns det på morgonen.' },
  { id: 13, name: 'Borro',         animal: 'Noshörning', desc: 'Ger sig inte — och har oftast rätt i att inte göra det.' },
  { id: 14, name: 'Pepe',          animal: 'Pingvin',    desc: 'Tar varje steg med en värdighet som ingen kan ta ifrån hen.' },
  { id: 15, name: 'Ronda',         animal: 'Krokodil',   desc: 'Har sett tillräckligt för att veta när man ska vara still.' },
  { id: 16, name: 'Rumi',          animal: 'Papegoja',   desc: 'Upprepar det som är värt att säga — och vet alltid skillnaden.' },
  { id: 17, name: 'Daffy Giraffy', animal: 'Giraff',     desc: 'Ser saker ovanifrån som ingen annan ens letar efter.' },
  { id: 18, name: 'Jerry',         animal: 'Hund',       desc: 'Trofast tills slutet, och sedan lite till.' },
  { id: 19, name: 'Mira',          animal: 'Kamel',      desc: 'Klarar av längre än någon förväntade sig — och vet om det.' },
];

const N = CHARACTERS.length;

function mod(n: number, m: number) { return ((n % m) + m) % m; }

const SWIPE_THRESHOLD = 40;

export default function CharacterCarousel() {
  const [current, setCurrent] = useState(0);
  const [hovered, setHovered] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const go = (delta: number) => {
    setHovered(false);
    setCurrent(c => mod(c + delta, N));
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > SWIPE_THRESHOLD) go(dx < 0 ? 1 : -1);
    touchStartX.current = null;
  };

  return (
    <div
      style={{ overflow: 'hidden', touchAction: 'pan-y' }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div style={{ perspective: '1200px', position: 'relative', height: '320px', overflow: 'hidden' }}>
        {CHARACTERS.map((char, idx) => {
          let offset = idx - current;
          if (offset >  N / 2) offset -= N;
          if (offset < -N / 2) offset += N;

          const abs      = Math.abs(offset);
          const visible  = abs <= 2;
          const isCenter = offset === 0;
          const scale    = isCenter ? 1 : abs === 1 ? 0.82 : 0.65;
          const rotateY  = isCenter ? 0 : -(offset / abs) * (abs === 1 ? 35 : 55);
          const translateX = offset * 210;
          const opacity  = !visible ? 0 : abs === 2 ? 0.65 : abs === 1 ? 0.88 : 1;
          const zIndex   = visible ? 3 - abs : 0;
          const isSide   = visible && !isCenter;

          return (
            <div
              key={char.id}
              onClick={isSide ? () => { setHovered(false); setCurrent(idx); } : undefined}
              onMouseEnter={isCenter ? () => setHovered(true) : undefined}
              onMouseLeave={isCenter ? () => setHovered(false) : undefined}
              style={{
                position:    'absolute',
                left:        '50%',
                top:         '50%',
                width:       '190px',
                transform:   `translate(-50%, -50%) translateX(${translateX}px) rotateY(${rotateY}deg) scale(${scale})`,
                transition:  'transform 0.4s ease, opacity 0.4s ease',
                zIndex,
                opacity,
                cursor:        isSide ? 'pointer' : 'default',
                pointerEvents: visible ? 'auto' : 'none',
              }}
            >
              {/* Card — stories-page style */}
              <div style={{
                position:     'relative',
                overflow:     'hidden',
                aspectRatio:  '3/4',
                borderRadius: '14px',
                boxShadow: isCenter
                  ? '0 20px 56px rgba(0,0,0,0.32), 0 4px 12px rgba(0,0,0,0.18)'
                  : '0 8px 24px rgba(0,0,0,0.2)',
              }}>
                <img
                  src={`/images/posters/poster_${String(char.id).padStart(2, '0')}.webp`}
                  alt={char.name}
                  draggable={false}
                  style={{
                    width:      '100%',
                    height:     '100%',
                    objectFit:  'cover',
                    display:    'block',
                    transition: 'transform 0.35s ease',
                    transform:  isCenter && hovered ? 'scale(1.05)' : 'scale(1)',
                  }}
                />

                {/* Hover overlay — name + animal */}
                {isCenter && (
                  <div style={{
                    position:   'absolute',
                    bottom:     0,
                    left:       0,
                    right:      0,
                    padding:    '40px 14px 14px',
                    background: 'linear-gradient(to top, rgba(13,10,18,0.88) 0%, transparent 100%)',
                    opacity:    hovered ? 1 : 0,
                    transition: 'opacity 0.22s ease',
                  }}>
                    <div style={{
                      fontFamily:    "'eight-condensed', Georgia, serif",
                      fontSize:      '18px',
                      color:         '#f0eaf8',
                      letterSpacing: '0.02em',
                      lineHeight:    1,
                      marginBottom:  '3px',
                    }}>
                      {char.name}
                    </div>
                    <div style={{
                      fontFamily:    "'DM Sans', sans-serif",
                      fontSize:      '10px',
                      color:         'rgba(240,234,248,0.5)',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      marginBottom:  '6px',
                    }}>
                      {char.animal}
                    </div>
                    <div style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize:   '11px',
                      color:      'rgba(240,234,248,0.75)',
                      lineHeight: 1.5,
                    }}>
                      {char.desc}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', marginTop: '2rem' }}>
        <button
          onClick={() => go(-1)}
          aria-label="Previous character"
          style={{ fontSize: '1.8rem', color: '#5B4A8A', background: 'none', border: 'none', cursor: 'pointer', lineHeight: 1, padding: '0.25rem 0.75rem' }}
        >←</button>
        <button
          onClick={() => go(1)}
          aria-label="Next character"
          style={{ fontSize: '1.8rem', color: '#5B4A8A', background: 'none', border: 'none', cursor: 'pointer', lineHeight: 1, padding: '0.25rem 0.75rem' }}
        >→</button>
      </div>
    </div>
  );
}
