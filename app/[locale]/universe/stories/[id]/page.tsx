'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useRef, useState } from 'react';
import { CHARACTERS } from '../page';

const AUDIO_MAP: Record<number, { url: string; label: string }[]> = {
  4:  [{ url: 'https://res.cloudinary.com/dk3ftfygx/video/upload/q_auto/f_auto/v1779967173/Ziggue_Lou_01_zvkgdw.mp3', label: 'Ziggy-Lou' }],
  5:  [{ url: 'https://res.cloudinary.com/dk3ftfygx/video/upload/q_auto/f_auto/v1779967172/Lana_01_xn4st0.mp3',        label: 'Lana' }],
  7:  [{ url: 'https://res.cloudinary.com/dk3ftfygx/video/upload/q_auto/f_auto/v1779967176/Mamo_viento_01_chcngh.mp3', label: 'Mambo Viento' }],
  8:  [{ url: 'https://res.cloudinary.com/dk3ftfygx/video/upload/q_auto/f_auto/v1779967173/Salvador_01_mgx68f.mp3',    label: 'Dali' }],
  9:  [{ url: 'https://res.cloudinary.com/dk3ftfygx/video/upload/q_auto/f_auto/v1779967171/Pinto_01_jx1xyz.mp3',       label: 'Pinto' }],
  13: [{ url: 'https://res.cloudinary.com/dk3ftfygx/video/upload/q_auto/f_auto/v1779967171/Borro_01_qhfkbi.mp3',       label: 'Borro' }],
  15: [{ url: 'https://res.cloudinary.com/dk3ftfygx/video/upload/q_auto/f_auto/v1779967172/Ronda_01_jzed46.mp3',       label: 'Ronda' }],
  16: [
    { url: 'https://res.cloudinary.com/dk3ftfygx/video/upload/q_auto/f_auto/v1779967174/Rumi_01_tcwd2u.mp3',                              label: 'Rumi' },
    { url: 'https://res.cloudinary.com/dk3ftfygx/video/upload/q_auto/f_auto/v1781285810/Rumi_F%C3%B6rklarar_pusslet_uzhfgv.wav',          label: 'Rumi förklarar pusslet' },
  ],
};

const CHAPTER_MAP: Record<number, string> = {
  10: '/book/chapter-1',
  16: '/book/chapter-1',
};

function fmt(s: number) {
  if (isNaN(s) || s === 0) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

function AudioPlayer({ url, label }: { url: string; label: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const barRef   = useRef<HTMLDivElement>(null);
  const [playing, setPlaying]   = useState(false);
  const [current, setCurrent]   = useState(0);
  const [duration, setDuration] = useState(0);
  const [dragging, setDragging] = useState(false);
  const pct = duration > 0 ? (current / duration) * 100 : 0;

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    playing ? (a.pause(), setPlaying(false)) : (a.play(), setPlaying(true));
  };

  const seek = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const a = audioRef.current; const bar = barRef.current;
    if (!a || !bar || !duration) return;
    const rect = bar.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const p = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    a.currentTime = p * duration;
    setCurrent(p * duration);
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{
        fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase',
        color: 'rgba(240,234,248,0.3)', fontFamily: "'DM Sans', sans-serif",
        marginBottom: '10px',
      }}>
        {label}
      </div>
      <audio
        ref={audioRef} src={url}
        onTimeUpdate={e => { if (!dragging) setCurrent(e.currentTarget.currentTime); }}
        onLoadedMetadata={e => setDuration(e.currentTarget.duration)}
        onEnded={() => { setPlaying(false); setCurrent(0); }}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button onClick={toggle} style={{
          flexShrink: 0, width: '38px', height: '38px', borderRadius: '50%',
          background: 'rgba(174,132,234,0.12)', border: '1px solid rgba(174,132,234,0.4)',
          color: '#ae84ea', fontSize: '13px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.15s',
        }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(174,132,234,0.25)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(174,132,234,0.12)')}
        >
          {playing ? '⏸' : '▶'}
        </button>
        <div style={{ flex: 1 }}>
          <div ref={barRef} onClick={seek}
            onMouseDown={() => setDragging(true)}
            onMouseMove={e => { if (dragging) seek(e); }}
            onMouseUp={() => setDragging(false)}
            onMouseLeave={() => setDragging(false)}
            onTouchStart={seek} onTouchMove={seek}
            style={{
              height: '3px', background: 'rgba(255,255,255,0.1)',
              borderRadius: '2px', cursor: 'pointer', position: 'relative',
            }}
          >
            <div style={{
              position: 'absolute', left: 0, top: 0, height: '100%',
              width: `${pct}%`, background: '#ae84ea', borderRadius: '2px',
              transition: dragging ? 'none' : 'width 0.1s linear',
            }} />
            <div style={{
              position: 'absolute', top: '50%', left: `${pct}%`,
              transform: 'translate(-50%, -50%)',
              width: '10px', height: '10px', borderRadius: '50%',
              background: '#ae84ea',
              opacity: playing || pct > 0 ? 1 : 0,
              transition: 'opacity 0.2s',
            }} />
          </div>
          <div style={{
            display: 'flex', justifyContent: 'space-between', marginTop: '4px',
            fontSize: '10px', color: 'rgba(240,234,248,0.3)',
            fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.05em',
          }}>
            <span>{fmt(current)}</span>
            <span>{fmt(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Returns true if hex color is light (needs dark text)
function isLight(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.45;
}

const BG: Record<number, string> = {
  1:  '#12a3e1', 2:  '#f9adbc', 3:  '#ac82e7', 4:  '#530000',
  5:  '#fdf07d', 6:  '#d3ef8b', 7:  '#7ed6cd', 8:  '#dac1ff',
  9:  '#0d8137', 10: '#f9adbc', 11: '#7ed6cd', 12: '#f8e1c3',
  13: '#fdf07d', 14: '#16ade6', 15: '#533f7e', 16: '#05375a',
  17: '#b38ced', 18: '#f35538', 19: '#544650',
};

export default function CharacterPage() {
  const params   = useParams();
  const locale   = (params?.locale as string) ?? 'en';
  const id       = Number(params?.id);
  const ch       = CHARACTERS.find(c => c.id === id);
  const audios   = AUDIO_MAP[id] ?? [];
  const chapter  = CHAPTER_MAP[id];
  const bg       = BG[id] ?? '#0d0a12';
  const light    = isLight(bg);
  const textColor  = light ? '#1C1917'              : '#f0eaf8';
  const mutedColor = light ? 'rgba(28,25,23,0.5)'   : 'rgba(240,234,248,0.4)';
  const accentColor = light ? '#5B4A8A'             : '#ae84ea';

  if (!ch) return (
    <div style={{ minHeight: '100svh', background: '#0d0a12', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f0eaf8' }}>
      Karaktär hittades inte.
    </div>
  );

  return (
    <div style={{ minHeight: '100svh', background: bg, color: textColor }}>

      {/* Top bar */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 20,
        padding: '18px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: `linear-gradient(to bottom, ${bg}f5 60%, transparent)`,
      }}>
        <Link href={`/${locale}/universe/stories`} style={{
          color: mutedColor, fontSize: '13px', textDecoration: 'none',
          fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.06em', transition: 'color 0.15s',
        }}
          onMouseEnter={e => (e.currentTarget.style.color = '#ae84ea')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(240,234,248,0.4)')}
        >
          ← Stories
        </Link>
      </div>

      {/* Poster — full width, fade to dark */}
      <div style={{ position: 'relative', width: '100%', maxWidth: '480px', margin: '0 auto', borderRadius: '14px', overflow: 'hidden' }}>
        <img
          src={`/images/posters/poster_${String(id).padStart(2, '0')}.webp`}
          alt={ch.name}
          style={{ width: '100%', display: 'block' }}
        />
      </div>

      {/* Content */}
      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '0 28px 80px' }}>

        {/* Name + animal */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{
            fontSize: '10px', letterSpacing: '2.5px', textTransform: 'uppercase',
            color: mutedColor, fontFamily: "'DM Sans', sans-serif", marginBottom: '8px',
          }}>
            {ch.animal}
          </div>
          <h1 style={{
            fontFamily: "'tumb', serif",
            fontSize: 'clamp(2.2rem, 8vw, 3.5rem)',
            fontWeight: 400, color: accentColor,
            margin: 0, letterSpacing: '0.03em', lineHeight: 1,
          }}>
            {ch.name}
          </h1>
        </div>

        {/* Audio */}
        {audios.length > 0 && (
          <div style={{
            padding: '20px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '14px',
            marginBottom: '24px',
          }}>
            {audios.map(a => <AudioPlayer key={a.url} url={a.url} label={a.label} />)}
          </div>
        )}

        {/* Chapter link */}
        {chapter && (
          <Link href={`/${locale}${chapter}`} style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '12px 22px', borderRadius: '10px',
            background: 'rgba(174,132,234,0.08)',
            border: '1px solid rgba(174,132,234,0.35)',
            color: accentColor, textDecoration: 'none',
            fontSize: '13px', fontFamily: "'DM Sans', sans-serif",
            letterSpacing: '0.05em', transition: 'background 0.2s',
          }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(174,132,234,0.16)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(174,132,234,0.08)')}
          >
            📖 Läs kapitel 1
          </Link>
        )}
      </div>
    </div>
  );
}
