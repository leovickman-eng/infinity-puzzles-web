'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useRef, useState, useMemo, useEffect, useCallback } from 'react';
import { CHARACTERS } from '../page';
import { getCharacterData } from '@/lib/characters-data';

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

// Seeded pseudo-random waveform — consistent per URL
function generateWaveform(url: string, bars: number): number[] {
  let seed = 0;
  for (let i = 0; i < url.length; i++) seed = (seed * 31 + url.charCodeAt(i)) % 1_000_000;
  const raw = Array.from({ length: bars }, (_, i) => {
    const x = Math.sin(seed + i * 127.1) * 43758.5453;
    const r = x - Math.floor(x);
    const s = Math.abs(Math.sin(i * 0.28)) * 0.35;
    return 0.08 + r * 0.62 + s;
  });
  // one-pass smooth
  return raw.map((h, i) => {
    const p = raw[i - 1] ?? h;
    const n = raw[i + 1] ?? h;
    return Math.min(1, (p * 0.2 + h * 0.6 + n * 0.2));
  });
}

const WAVEFORM_BARS = 72;

interface AudioPlayerProps {
  url: string;
  label: string;
  accentColor: string;
  mutedColor: string;
  light: boolean;
}

function AudioPlayer({ url, label, accentColor, mutedColor }: AudioPlayerProps) {
  const audioRef    = useRef<HTMLAudioElement>(null);
  const waveRef     = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);   // ref, not state — no async lag

  const [playing, setPlaying]   = useState(false);
  const [current, setCurrent]   = useState(0);
  const [duration, setDuration] = useState(0);

  const pct      = duration > 0 ? current / duration : 0;
  const waveform = useMemo(() => generateWaveform(url, WAVEFORM_BARS), [url]);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    playing ? (a.pause(), setPlaying(false)) : (a.play(), setPlaying(true));
  };

  const seekTo = useCallback((clientX: number) => {
    const a = audioRef.current; const el = waveRef.current;
    if (!a || !el || !duration) return;
    const rect = el.getBoundingClientRect();
    const p    = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    a.currentTime = p * duration;
    setCurrent(p * duration);
  }, [duration]);

  // Global mouse listeners so dragging works even outside the element
  useEffect(() => {
    const onMove = (e: MouseEvent) => { if (draggingRef.current) seekTo(e.clientX); };
    const onUp   = () => { draggingRef.current = false; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup',   onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup',   onUp);
    };
  }, [seekTo]);

  // Non-passive touchmove so we can preventDefault (prevent scroll while scrubbing)
  useEffect(() => {
    const el = waveRef.current;
    if (!el) return;
    const onTouchMove = (e: TouchEvent) => {
      if (!draggingRef.current) return;
      e.preventDefault();
      seekTo(e.touches[0].clientX);
    };
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    return () => el.removeEventListener('touchmove', onTouchMove);
  }, [seekTo]);

  const btnBg      = `${accentColor}18`;
  const btnBgHover = `${accentColor}30`;
  const unplayed   = `${accentColor}28`;

  return (
    <div style={{ marginBottom: '20px' }}>
      {/* Label */}
      <div style={{
        fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase',
        color: mutedColor, fontFamily: "'DM Sans', sans-serif", marginBottom: '12px',
      }}>
        {label}
      </div>

      {/* preload="metadata" loads duration immediately without buffering the file */}
      <audio
        ref={audioRef} src={url} preload="metadata"
        onTimeUpdate={e => { if (!draggingRef.current) setCurrent(e.currentTarget.currentTime); }}
        onLoadedMetadata={e => setDuration(e.currentTarget.duration)}
        onEnded={() => { setPlaying(false); setCurrent(0); }}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>

        {/* Play / pause */}
        <button
          onClick={toggle}
          style={{
            flexShrink: 0, width: '40px', height: '40px', borderRadius: '50%',
            background: btnBg, border: `1px solid ${accentColor}60`,
            color: accentColor, fontSize: '13px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = btnBgHover)}
          onMouseLeave={e => (e.currentTarget.style.background = btnBg)}
        >
          {playing ? '⏸' : '▶'}
        </button>

        {/* Waveform + time */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Waveform bars */}
          <div
            ref={waveRef}
            onMouseDown={e => { draggingRef.current = true; seekTo(e.clientX); }}
            onTouchStart={e => { draggingRef.current = true; seekTo(e.touches[0].clientX); }}
            onTouchEnd={() => { draggingRef.current = false; }}
            style={{
              display: 'flex', alignItems: 'center', gap: '2px',
              height: '44px', cursor: 'pointer', userSelect: 'none',
            }}
          >
            {waveform.map((h, i) => {
              const barPct = i / WAVEFORM_BARS;
              const played = barPct < pct;
              const atHead = pct > 0 && Math.abs(barPct - pct) < 0.018;
              return (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: `${Math.max(8, (atHead ? Math.min(1, h + 0.18) : h) * 100)}%`,
                    borderRadius: '2px',
                    background: played ? accentColor : unplayed,
                    transition: 'background 0.04s',
                  }}
                />
              );
            })}
          </div>

          {/* Time */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', marginTop: '5px',
            fontSize: '10px', color: mutedColor,
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
  const params  = useParams();
  const locale  = (params?.locale as string) ?? 'en';
  const isSv    = locale === 'sv';
  const id      = Number(params?.id);
  const ch      = CHARACTERS.find(c => c.id === id);
  const data    = getCharacterData(id);
  const audios  = AUDIO_MAP[id] ?? [];
  const chapter = CHAPTER_MAP[id];
  const bg      = BG[id] ?? '#0d0a12';
  const light   = isLight(bg);

  const textColor   = light ? '#1C1917'            : '#f0eaf8';
  const mutedColor  = light ? 'rgba(28,25,23,0.5)' : 'rgba(240,234,248,0.4)';
  const accentColor = light ? '#5B4A8A'             : '#ae84ea';
  const dividerColor = light ? 'rgba(28,25,23,0.1)' : 'rgba(240,234,248,0.1)';

  if (!ch || !data) return (
    <div style={{ minHeight: '100svh', background: '#0d0a12', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f0eaf8' }}>
      Karaktär hittades inte.
    </div>
  );

  const animalLabel = isSv ? data.animal.sv : data.animal.en;

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
          onMouseEnter={e => (e.currentTarget.style.color = accentColor)}
          onMouseLeave={e => (e.currentTarget.style.color = mutedColor)}
        >
          ← {isSv ? 'Alla karaktärer' : 'All characters'}
        </Link>
        <span style={{
          fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase',
          color: mutedColor, fontFamily: "'DM Sans', sans-serif",
        }}>
          № {id}
        </span>
      </div>

      {/* Character image — centered, no background */}
      <div style={{
        paddingTop: '72px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
      }}>
        <img
          src={`/images/character-png/${id}.webp`}
          alt={ch.name}
          style={{
            width: 'min(72vw, 320px)',
            height: 'auto',
            display: 'block',
            objectFit: 'contain',
            filter: 'drop-shadow(0 8px 32px rgba(0,0,0,0.22))',
          }}
        />
      </div>

      {/* Content */}
      <div style={{ maxWidth: '520px', margin: '0 auto', padding: '32px 28px 80px' }}>

        {/* Animal type */}
        <div style={{
          fontSize: '10px', letterSpacing: '2.5px', textTransform: 'uppercase',
          color: mutedColor, fontFamily: "'DM Sans', sans-serif", marginBottom: '8px',
        }}>
          {animalLabel}
        </div>

        {/* Name */}
        <h1 style={{
          fontFamily: "'eight-condensed', sans-serif",
          fontSize: 'clamp(2.4rem, 9vw, 4rem)',
          fontWeight: 400, color: accentColor,
          margin: '0 0 6px', letterSpacing: '0.03em', lineHeight: 1,
        }}>
          {ch.name}
        </h1>

        {/* Superpower */}
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 'clamp(0.8rem, 2.2vw, 0.92rem)',
          letterSpacing: '0.12em', textTransform: 'uppercase',
          color: accentColor, opacity: 0.75,
          margin: '0 0 20px',
        }}>
          {isSv ? data.superpower.sv : data.superpower.en}
        </p>

        {/* Tagline */}
        <p style={{
          fontFamily: "'eight-condensed', sans-serif",
          fontSize: 'clamp(1.1rem, 3.5vw, 1.4rem)',
          color: textColor, opacity: 0.85,
          margin: '0 0 28px', lineHeight: 1.35,
          fontStyle: 'italic',
        }}>
          {isSv ? data.tagline.sv : data.tagline.en}
        </p>

        <div style={{ height: '1px', background: dividerColor, margin: '0 0 28px' }} />

        {/* Audio */}
        {audios.length > 0 && (
          <div style={{
            padding: '20px',
            background: light ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)',
            border: `1px solid ${light ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.12)'}`,
            borderRadius: '14px',
            marginBottom: '28px',
          }}>
            {audios.map(a => <AudioPlayer key={a.url} url={a.url} label={a.label} accentColor={accentColor} mutedColor={mutedColor} light={light} />)}
          </div>
        )}

        {/* Description / story */}
        <div style={{ marginBottom: '28px' }}>
          {(isSv ? data.description.sv : data.description.en).split('\n\n').map((para, i) => (
            <p key={i} style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 'clamp(0.95rem, 2.5vw, 1.05rem)',
              lineHeight: 1.75, color: textColor, opacity: 0.9,
              margin: i === 0 ? '0 0 16px' : '0',
            }}>
              {para}
            </p>
          ))}
        </div>

        <div style={{ height: '1px', background: dividerColor, margin: '0 0 28px' }} />

        {/* Aura */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{
            fontSize: '10px', letterSpacing: '2.5px', textTransform: 'uppercase',
            color: mutedColor, fontFamily: "'DM Sans', sans-serif", marginBottom: '10px',
          }}>
            {isSv ? 'Aura' : 'Aura'}
          </div>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 'clamp(0.92rem, 2.4vw, 1rem)',
            lineHeight: 1.7, color: textColor, opacity: 0.75,
            margin: 0, fontStyle: 'italic',
          }}>
            {isSv ? data.aura.sv : data.aura.en}
          </p>
        </div>

        <div style={{ height: '1px', background: dividerColor, margin: '0 0 28px' }} />

        {/* Neighbors */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{
            fontSize: '10px', letterSpacing: '2.5px', textTransform: 'uppercase',
            color: mutedColor, fontFamily: "'DM Sans', sans-serif", marginBottom: '12px',
          }}>
            {isSv ? 'Grannar' : 'Neighbors'}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {data.neighbors.map(name => {
              const neighbor = CHARACTERS.find(c => c.name === name);
              return neighbor ? (
                <Link
                  key={name}
                  href={`/${locale}/universe/stories/${neighbor.id}`}
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '13px',
                    color: accentColor,
                    textDecoration: 'none',
                    padding: '5px 12px',
                    borderRadius: '20px',
                    border: `1px solid ${accentColor}40`,
                    background: `${accentColor}10`,
                    transition: 'background 0.15s',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = `${accentColor}22`)}
                  onMouseLeave={e => (e.currentTarget.style.background = `${accentColor}10`)}
                >
                  {name}
                </Link>
              ) : (
                <span key={name} style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '13px', color: mutedColor,
                  padding: '5px 12px', borderRadius: '20px',
                  border: `1px solid ${dividerColor}`,
                }}>
                  {name}
                </span>
              );
            })}
          </div>
        </div>

        {/* Chapter link */}
        {chapter && (
          <>
            <div style={{ height: '1px', background: dividerColor, margin: '0 0 28px' }} />
            <Link href={`/${locale}${chapter}`} style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '12px 22px', borderRadius: '10px',
              background: `${accentColor}10`,
              border: `1px solid ${accentColor}40`,
              color: accentColor, textDecoration: 'none',
              fontSize: '13px', fontFamily: "'DM Sans', sans-serif",
              letterSpacing: '0.05em', transition: 'background 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.background = `${accentColor}22`)}
              onMouseLeave={e => (e.currentTarget.style.background = `${accentColor}10`)}
            >
              📖 {isSv ? 'Läs kapitel 1' : 'Read chapter 1'}
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
