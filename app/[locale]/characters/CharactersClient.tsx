'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const CHARACTERS = [
  { id: 1,  name: 'Dolores',       animal: 'Narval',     desc: 'Rör sig utan förklaring. Har alltid vetat vart hon ska — frågan är om du håller tempot.',                                                                  audio: null,                                                                                                                    chapterLink: null },
  { id: 2,  name: 'Zuki',          animal: 'Rådjur',     desc: 'Tvivlar på sin plats men är den första alla söker upp. Hennes närvaro är ett faktum världen anpassar sig efter.',                                          audio: null,                                                                                                                    chapterLink: null },
  { id: 3,  name: 'Mani',          animal: 'Tukan',      desc: 'Litar på sin intuition mer än på bevis. Har fel ibland. Ändrar sig aldrig utan att tänka noga.',                                                           audio: null,                                                                                                                    chapterLink: null },
  { id: 4,  name: 'Ziggy-Lou',     animal: 'Räv',        desc: 'Lyssnar djupare än de flesta pratar. Vad hon gör med det hon hör — det vet bara hon.',                                                                    audio: 'https://res.cloudinary.com/dk3ftfygx/video/upload/q_auto/f_auto/v1779967173/Ziggue_Lou_01_zvkgdw.mp3',                chapterLink: null },
  { id: 5,  name: 'Lana Manana',   animal: 'Lama',       desc: 'Observerar allting med lugn nyfikenhet. Hon är aldrig brådskande — världen kan vänta medan hon tittar.',                                                   audio: 'https://res.cloudinary.com/dk3ftfygx/video/upload/q_auto/f_auto/v1779967172/Lana_01_xn4st0.mp3',                      chapterLink: null },
  { id: 6,  name: 'Tarah',         animal: 'Tiger',      desc: 'Rör sig alltid med avsikt. Inte aggressiv — fokuserad. Hennes riktning är ett beslut som redan är fattat.',                                               audio: null,                                                                                                                    chapterLink: null },
  { id: 7,  name: 'Mambo Viento',  animal: 'Drake',      desc: 'Lever i en annan tidslinje än de flesta. Vad han ser som minne är för andra ännu en möjlighet.',                                                          audio: 'https://res.cloudinary.com/dk3ftfygx/video/upload/q_auto/f_auto/v1779967176/Mamo_viento_01_chcngh.mp3',               chapterLink: null },
  { id: 8,  name: 'Salvador',      animal: 'Okänt',      desc: 'Ser lager under lager. Vad han skapar är aldrig det uppenbara — det är frågan som gömmer sig bakom svaret.',                                              audio: 'https://res.cloudinary.com/dk3ftfygx/video/upload/q_auto/f_auto/v1779967173/Salvador_01_mgx68f.mp3',                  chapterLink: null },
  { id: 9,  name: 'Pinto',         animal: 'Leopard',    desc: 'Tider och avstånd förhandlar med honom, inte tvärtom. Ingen känner sig stressad i hans närvaro.',                                                         audio: 'https://res.cloudinary.com/dk3ftfygx/video/upload/q_auto/f_auto/v1779967171/Pinto_01_jx1xyz.mp3',                     chapterLink: null },
  { id: 10, name: 'Sixten',        animal: 'Katt',       desc: 'Känner alla i Vildmarken. Han kopplar ihop världar utan att märka det — men vem kopplar ihop honom?',                                                     audio: null,                                                                                                                    chapterLink: '/book/chapter-1' },
  { id: 11, name: 'Coco',          animal: 'Okänt',      desc: 'Rapporterar alltid att allt är normalt. Det stämmer aldrig riktigt — men det är just det som är normalt för Coco.',                                      audio: null,                                                                                                                    chapterLink: null },
  { id: 12, name: 'Mona Moon',     animal: 'Ko',         desc: 'Hennes tystnad väger mer än de flesta meningars ord. Folk lämnar hennes sällskap och vet saker de inte visste att de visste.',                            audio: null,                                                                                                                    chapterLink: null },
  { id: 13, name: 'Borro',         animal: 'Noshorning', desc: 'Kronologiskt ofelbar. Bokstavligen. Ingen i Vildmarken har någonsin fått honom att ljuga — men sanningen kan formas.',                                    audio: 'https://res.cloudinary.com/dk3ftfygx/video/upload/q_auto/f_auto/v1779967171/Borro_01_qhfkbi.mp3',                     chapterLink: null },
  { id: 14, name: 'Pepe',          animal: 'Pingvin',    desc: 'Ställer frågor som råkar vara exakt rätt. Han vet inte alltid varför han frågar — men svaren visar sig alltid vara viktiga.',                             audio: null,                                                                                                                    chapterLink: null },
  { id: 15, name: 'Ronda',         animal: 'Krokodil',   desc: 'Har en gåva för att hitta det enda felaktiga i ett annars perfekt resonemang. Hennes kritik är en present, om du klarar av att ta emot den.',             audio: 'https://res.cloudinary.com/dk3ftfygx/video/upload/q_auto/f_auto/v1779967172/Ronda_01_jzed46.mp3',                     chapterLink: null },
  { id: 16, name: 'Rumi',          animal: 'Papegoja',   desc: 'Sitter i sitt träd och ser allt. Hennes perspektiv sträcker sig bakåt och framåt på ett sätt som gör att nuet känns bredare.',                           audio: 'https://res.cloudinary.com/dk3ftfygx/video/upload/q_auto/f_auto/v1779967174/Rumi_01_tcwd2u.mp3',                      chapterLink: '/book/chapter-1', extraAudios: [{ url: 'https://res.cloudinary.com/dk3ftfygx/video/upload/q_auto/f_auto/v1781285810/Rumi_F%C3%B6rklarar_pusslet_uzhfgv.wav', label: 'Rumi förklarar pusslet' }] },
  { id: 17, name: 'Daffy Giraffy', animal: 'Giraff',     desc: 'Ser längre än de flesta — bokstavligen och bildligt. Hans lugn är inte passivitet, det är förtroende för tid.',                                          audio: null,                                                                                                                    chapterLink: null },
  { id: 18, name: 'Jerry',         animal: 'Hund',       desc: 'Följer instinkter som inte har namn. Hans fynd verkar slumpmässiga tills mönstret plötsligt är uppenbarat.',                                              audio: null,                                                                                                                    chapterLink: null },
  { id: 19, name: 'Silvana',       animal: 'Kamel',      desc: 'Har överlevt det omöjliga och kommit ut på andra sidan med en vild tilltro till det som ännu inte hänt.',                                                 audio: null,                                                                                                                    chapterLink: null },
];

function fmt(s: number) {
  if (isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

function AudioPlayer({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying]       = useState(false);
  const [current, setCurrent]       = useState(0);
  const [duration, setDuration]     = useState(0);
  const [dragging, setDragging]     = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) { a.pause(); setPlaying(false); }
    else { a.play(); setPlaying(true); }
  };

  const seek = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const a = audioRef.current;
    const bar = barRef.current;
    if (!a || !bar || !duration) return;
    const rect = bar.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    a.currentTime = pct * duration;
    setCurrent(pct * duration);
  };

  const pct = duration > 0 ? (current / duration) * 100 : 0;

  return (
    <div style={{ marginTop: '14px' }}>
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={e => { if (!dragging) setCurrent(e.currentTarget.currentTime); }}
        onLoadedMetadata={e => setDuration(e.currentTarget.duration)}
        onEnded={() => { setPlaying(false); setCurrent(0); }}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Play/pause */}
        <button
          onClick={toggle}
          style={{
            flexShrink: 0,
            width: '36px', height: '36px',
            borderRadius: '50%',
            background: 'rgba(174,132,234,0.15)',
            border: '1px solid rgba(174,132,234,0.4)',
            color: '#ae84ea',
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(174,132,234,0.28)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(174,132,234,0.15)')}
        >
          {playing ? '⏸' : '▶'}
        </button>

        {/* Timeline */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div
            ref={barRef}
            onClick={seek}
            onMouseDown={() => setDragging(true)}
            onMouseMove={e => { if (dragging) seek(e); }}
            onMouseUp={() => setDragging(false)}
            onMouseLeave={() => setDragging(false)}
            onTouchStart={seek}
            onTouchMove={seek}
            style={{
              height: '3px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '2px',
              cursor: 'pointer',
              position: 'relative',
            }}
          >
            {/* Filled portion */}
            <div style={{
              position: 'absolute', left: 0, top: 0,
              height: '100%',
              width: `${pct}%`,
              background: '#ae84ea',
              borderRadius: '2px',
              transition: dragging ? 'none' : 'width 0.1s linear',
            }} />
            {/* Scrubber dot */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: `${pct}%`,
              transform: 'translate(-50%, -50%)',
              width: '10px', height: '10px',
              borderRadius: '50%',
              background: '#ae84ea',
              opacity: playing || pct > 0 ? 1 : 0,
              transition: 'opacity 0.2s',
            }} />
          </div>

          {/* Time */}
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            fontSize: '10px', color: 'rgba(240,234,248,0.35)',
            fontFamily: "'DM Sans', sans-serif",
            letterSpacing: '0.05em',
          }}>
            <span>{fmt(current)}</span>
            <span>{fmt(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CharactersClient({ title, subtitle }: { title: string; subtitle: string }) {
  const params  = useParams();
  const locale  = (params?.locale as string) ?? 'en';

  return (
    <div style={{ minHeight: '100vh', background: '#0d0a12', color: '#f0eaf8', padding: '0 0 120px' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', padding: '120px 24px 72px', maxWidth: '680px', margin: '0 auto' }}>
        <p style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', color: '#ae84ea', marginBottom: '16px', fontFamily: "'DM Sans', sans-serif" }}>
          Wild Collection
        </p>
        <h1 style={{ fontSize: 'clamp(2.4rem, 7vw, 4.5rem)', fontWeight: 400, margin: '0 0 16px', fontFamily: "'eight-condensed', sans-serif", lineHeight: 1.05 }}>
          {title}
        </h1>
        <p style={{ fontSize: '1rem', color: 'rgba(240,234,248,0.45)', lineHeight: 1.7, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
          {subtitle}
        </p>
      </div>

      {/* Grid */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '24px',
      }}>
        {CHARACTERS.map(ch => (
          <div
            key={ch.id}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '16px',
              overflow: 'hidden',
              transition: 'border-color 0.2s',
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(174,132,234,0.3)')}
            onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.07)')}
          >
            {/* Image */}
            <img
              src={`/images/characters/WILD_characters-${String(ch.id).padStart(2, '0')}.webp`}
              alt={ch.name}
              style={{ width: '100%', display: 'block', aspectRatio: '1/1', objectFit: 'cover' }}
            />

            {/* Content */}
            <div style={{ padding: '20px 20px 22px' }}>
              <div style={{ fontSize: '10px', letterSpacing: '2.5px', textTransform: 'uppercase', color: 'rgba(240,234,248,0.3)', fontFamily: "'DM Sans', sans-serif", marginBottom: '6px' }}>
                {ch.animal}
              </div>
              <div style={{ fontSize: '20px', fontWeight: 600, fontFamily: "'eight-condensed', sans-serif", marginBottom: '10px', color: '#f0eaf8' }}>
                {ch.name}
              </div>
              <p style={{ fontSize: '14px', lineHeight: 1.7, color: 'rgba(240,234,248,0.6)', margin: '0 0 4px', fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                {ch.desc}
              </p>

              {/* Audio timeline */}
              {ch.audio && <AudioPlayer src={ch.audio} />}

              {/* Extra audio clips */}
              {'extraAudios' in ch && (ch as { extraAudios: { url: string; label: string }[] }).extraAudios.map(({ url, label }) => (
                <div key={url}>
                  <div style={{ fontSize: '10px', color: 'rgba(240,234,248,0.3)', fontFamily: "'DM Sans', sans-serif", letterSpacing: '1px', textTransform: 'uppercase', marginTop: '14px', marginBottom: '4px' }}>
                    {label}
                  </div>
                  <AudioPlayer src={url} />
                </div>
              ))}

              {/* Chapter link */}
              {ch.chapterLink && (
                <Link
                  href={`/${locale}${ch.chapterLink}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '7px',
                    marginTop: '16px',
                    fontSize: '12px',
                    color: '#ae84ea',
                    textDecoration: 'none',
                    fontFamily: "'DM Sans', sans-serif",
                    letterSpacing: '0.05em',
                    opacity: 0.8,
                    transition: 'opacity 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '0.8')}
                >
                  📖 Läs kapitel 1
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
