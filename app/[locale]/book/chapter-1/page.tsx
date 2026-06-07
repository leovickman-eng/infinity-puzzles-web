'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useRef, useState } from 'react';

const CHAPTER_AUDIO = 'https://res.cloudinary.com/dk3ftfygx/video/upload/q_auto/f_auto/v1779967174/WILD_CHAPTER_01_e0a9is.mp3';

const CHAPTER = {
  number: 1,
  title: 'Sixten',
  narrator: 'Rumi',
  sections: [
    `There are nineteen of us.`,

    `We think we are separate. We have names and colors and wounds and secrets and we move through the world as though the space between us is real, as though the borders of our bodies are where we end and everything else begins.

We are not separate.

But that is the end of the story, and you are not ready for the end yet.

So let us begin somewhere in the middle.`,

    `I have been sitting in this tree for a long time. Watching the Wild do what the Wild has always done. Move. Connect. Pull apart. Reach toward. Misunderstand. Try again.

I find it beautiful. Most of it.`,

    `The one I want to tell you about first is Sixten.

Not because he is the most important — importance is a hierarchy and I have lived long enough to find hierarchies tedious — but because Sixten is the one who makes the rest of them visible. Follow him for one day and you will meet everyone worth meeting in the Wild. Follow him for two and you will begin to understand how everything connects.

Follow him for three and you will start to wonder why a creature who knows everyone so well has never once stopped to know himself.`,

    `I watched him this morning.

He was up before the sun — Sixten is always up before the sun, sleep is an interruption he tolerates rather than seeks. He stopped at Mona Moon's tree first. He always stops at Mona Moon's tree first, though I don't think he knows that he always does. He brought her a small stone, unusual color, he'd found it the day before and thought of her immediately.

Mona took the stone and looked at it for a long time without speaking. Then she said something I couldn't hear from this distance.

Sixten laughed. Then his face did something complicated — a flicker, very fast, the kind of expression that arrives before the performer in us has time to arrange itself — and then the laugh was back and he was moving again, already looking ahead.

I have been watching that flicker for years. It is the most important thing about him and he has never once seen it himself.`,

    `He found Ziggy-Lou near the eastern watering hole. They talked for a long time. I watched Ziggy-Lou's face while Sixten talked — warm and open and giving nothing away — and I watched her file things carefully behind that warmth. Not maliciously. Ziggy-Lou is not malicious. She is simply always working.

Somewhere in the exchange, without either of them noticing, a small piece of Sixten's self was named out loud. Something real that slipped out between sentences the way true things sometimes do when you're not guarding them.

Ziggy-Lou caught it. Sixten walked away lighter.`,

    `That is one morning of Sixten.

There are nineteen of us and he touches most of us before the sun is fully up and he does it because he loves us — genuinely, completely, without agenda. And somewhere underneath all of that love is a question he has never asked himself.

Who am I when I am not connecting?

The answer is scattered across eight souls who know him better than he knows himself.

One day he will be ready to hear it. I am not rushing that day.

But I am watching. I am always watching.`,
  ],
};

export default function ChapterPage() {
  const params = useParams();
  const locale = params?.locale ?? 'en';
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggleAudio = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) { a.pause(); setPlaying(false); }
    else { a.play(); setPlaying(true); }
  };

  return (
    <div
      data-page="book-chapter"
      style={{
        minHeight: '100vh',
        background: '#0d0a12',
        color: '#f0eaf8',
        fontFamily: "'Cormorant Garamond', 'Georgia', serif",
        padding: '0 0 120px',
      }}
    >
      {/* Top bar */}
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 50,
        padding: '18px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'linear-gradient(to bottom, rgba(13,10,18,0.98) 60%, transparent)',
      }}>
        <Link
          href={`/${locale}/WILD_NETWORK`}
          style={{
            color: 'rgba(240,234,248,0.45)',
            fontSize: '13px',
            letterSpacing: '0.08em',
            textDecoration: 'none',
            fontFamily: "'DM Sans', sans-serif",
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#ae84ea')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(240,234,248,0.45)')}
        >
          ← Wild Network
        </Link>
        <span style={{
          color: 'rgba(240,234,248,0.2)',
          fontSize: '11px',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          fontFamily: "'DM Sans', sans-serif",
        }}>
          The Wild
        </span>
      </div>

      {/* Chapter header */}
      <div style={{
        textAlign: 'center',
        padding: '120px 24px 60px',
        maxWidth: '680px',
        margin: '0 auto',
      }}>
        <div style={{
          fontSize: '11px',
          letterSpacing: '3px',
          textTransform: 'uppercase',
          color: '#ae84ea',
          marginBottom: '16px',
          fontFamily: "'DM Sans', sans-serif",
        }}>
          Chapter {CHAPTER.number}
        </div>

        <h1 style={{
          fontSize: 'clamp(2.8rem, 8vw, 5rem)',
          fontWeight: '400',
          margin: '0 0 12px',
          letterSpacing: '-0.01em',
          lineHeight: 1.05,
          fontFamily: "'tumb', serif",
          color: '#f0eaf8',
        }}>
          {CHAPTER.title}
        </h1>

        <div style={{
          fontSize: '13px',
          color: 'rgba(240,234,248,0.35)',
          letterSpacing: '1.5px',
          fontFamily: "'DM Sans', sans-serif",
          textTransform: 'uppercase',
        }}>
          As told by {CHAPTER.narrator}
        </div>

        {/* Divider */}
        <div style={{
          width: '40px',
          height: '1px',
          background: 'rgba(174,132,234,0.3)',
          margin: '40px auto 0',
        }} />

        {/* Audio player */}
        <div style={{ marginTop: '32px' }}>
          <audio
            ref={audioRef}
            src={CHAPTER_AUDIO}
            onEnded={() => setPlaying(false)}
          />
          <button
            onClick={toggleAudio}
            style={{
              background: 'rgba(174,132,234,0.08)',
              border: '1px solid rgba(174,132,234,0.35)',
              borderRadius: '40px',
              color: '#ae84ea',
              padding: '10px 28px',
              fontSize: '13px',
              letterSpacing: '0.08em',
              fontFamily: "'DM Sans', sans-serif",
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(174,132,234,0.16)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(174,132,234,0.08)')}
          >
            <span style={{ fontSize: '15px' }}>{playing ? '⏹' : '▶'}</span>
            {playing ? 'Stoppa' : 'Lyssna på kapitlet'}
          </button>
        </div>
      </div>

      {/* Chapter body */}
      <div style={{
        maxWidth: '620px',
        margin: '0 auto',
        padding: '0 28px',
      }}>
        {CHAPTER.sections.map((section, i) => (
          <div key={i} style={{ marginBottom: '44px' }}>
            {section.split('\n\n').map((para, j) => {
              const isItalic = para.startsWith('Who am I');
              return (
                <p
                  key={j}
                  style={{
                    fontSize: 'clamp(1.05rem, 2.5vw, 1.18rem)',
                    lineHeight: 1.85,
                    color: isItalic ? '#ae84ea' : 'rgba(240,234,248,0.88)',
                    fontStyle: isItalic ? 'italic' : 'normal',
                    margin: '0 0 24px',
                    fontWeight: isItalic ? '500' : '400',
                  }}
                >
                  {para}
                </p>
              );
            })}
            {i < CHAPTER.sections.length - 1 && (
              <div style={{
                textAlign: 'center',
                color: 'rgba(174,132,234,0.25)',
                fontSize: '18px',
                margin: '8px 0 0',
                letterSpacing: '6px',
              }}>
                · · ·
              </div>
            )}
          </div>
        ))}

        {/* End mark */}
        <div style={{
          textAlign: 'center',
          marginTop: '60px',
          color: 'rgba(174,132,234,0.3)',
          fontSize: '22px',
          letterSpacing: '8px',
        }}>
          ∞
        </div>
      </div>
    </div>
  );
}
