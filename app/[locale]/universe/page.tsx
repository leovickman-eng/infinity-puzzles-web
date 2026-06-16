'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

const NAV = [
  {
    key: 'cheat',
    label: 'CHEAT',
    sub: 'Utforska nätverket',
    href: '/WILD_NETWORK',
    color: '#ae84ea',
    border: 'rgba(174,132,234,0.45)',
    bg: 'rgba(174,132,234,0.08)',
  },
  {
    key: 'stories',
    label: 'STORIES',
    sub: 'Möt karaktärerna',
    href: '/universe/stories',
    color: '#0EC7B4',
    border: 'rgba(14,199,180,0.45)',
    bg: 'rgba(14,199,180,0.07)',
  },
  {
    key: 'shop',
    label: 'SHOP',
    sub: 'Infinity Puzzles',
    href: '/',
    color: '#FFD23F',
    border: 'rgba(255,210,63,0.45)',
    bg: 'rgba(255,210,63,0.07)',
  },
];

export default function UniversePage() {
  const params = useParams();
  const locale = (params?.locale as string) ?? 'en';

  return (
    <div style={{
      minHeight: '100svh',
      background: '#0d0a12',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      fontFamily: "'DM Sans', sans-serif",
      overflow: 'hidden',
      position: 'relative',
    }}>

      {/* Subtle background glow */}
      <div style={{
        position: 'absolute',
        top: '30%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px', height: '400px',
        background: 'radial-gradient(ellipse, rgba(174,132,234,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '64px', position: 'relative' }}>
        <h1 style={{
          fontFamily: "'tumb', serif",
          fontSize: 'clamp(2.8rem, 10vw, 6rem)',
          fontWeight: 400,
          color: '#ae84ea',
          margin: 0,
          letterSpacing: '0.04em',
          lineHeight: 1,
        }}>
          WILD UNIVERSE
        </h1>
        <div style={{
          width: '48px', height: '1px',
          background: 'rgba(174,132,234,0.3)',
          margin: '24px auto 0',
        }} />
      </div>

      {/* Buttons */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '100%',
        maxWidth: '360px',
      }}>
        {NAV.map(({ key, label, sub, href, color, border, bg }) => (
          <Link
            key={key}
            href={`/${locale}${href}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '20px 28px',
              background: bg,
              border: `1px solid ${border}`,
              borderRadius: '14px',
              textDecoration: 'none',
              transition: 'background 0.2s, border-color 0.2s, transform 0.15s',
              cursor: 'pointer',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget;
              el.style.background = bg.replace('0.07', '0.14').replace('0.08', '0.16');
              el.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              const el = e.currentTarget;
              el.style.background = bg;
              el.style.transform = 'translateY(0)';
            }}
          >
            <div>
              <div style={{
                fontFamily: "'tumb', serif",
                fontSize: '1.5rem',
                color,
                letterSpacing: '0.06em',
                lineHeight: 1,
                marginBottom: '4px',
              }}>
                {label}
              </div>
              <div style={{
                fontSize: '11px',
                color: 'rgba(240,234,248,0.35)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}>
                {sub}
              </div>
            </div>
            <div style={{ color, opacity: 0.6, fontSize: '18px' }}>→</div>
          </Link>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        position: 'absolute',
        bottom: '24px',
        fontSize: '10px',
        color: 'rgba(240,234,248,0.15)',
        letterSpacing: '2px',
        textTransform: 'uppercase',
      }}>
        Infinity Puzzles
      </div>
    </div>
  );
}
