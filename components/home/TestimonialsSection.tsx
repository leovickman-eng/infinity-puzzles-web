'use client';

import { useParams } from 'next/navigation';

const REVIEWS = [
  {
    name: 'Konrad Hill',
    stars: 5,
    quote: 'These puzzles are the best! So much fun! Really relaxing to just endlessly add pieces in new ways with no end goal to chase and no right way to do things. Wish I could have all of these!',
  },
  {
    name: 'Jonathan Kärre',
    stars: 5,
    quote: 'Fantastiskt pussel! Får en att tänka utanför de vanliga ramarna och komma in i formens värld. Vackert, roligt, kreativt. Rekommenderas till både barn och vuxna.',
  },
];

const SINGAPORE_QUOTE = 'The most intriguing feature of the infinity puzzle was the absence of borders. Even when assembled, it did not feel complete — it seemed possible to keep adding new pieces indefinitely. This serves as a powerful metaphor for leadership and organisational growth.';

const CONTENT = {
  sv: {
    eyebrow: 'RECENSIONER',
    heading: 'Vad folk säger',
    googleLabel: 'Google Recension',
    singaporeTag: 'Ledarskapsutbildning · Singapore',
    singaporeAttr: 'Change Leadership Journal',
  },
  en: {
    eyebrow: 'REVIEWS',
    heading: 'What people say',
    googleLabel: 'Google Review',
    singaporeTag: 'Leadership Training · Singapore',
    singaporeAttr: 'Change Leadership Journal',
  },
};

function Stars({ count }: { count: number }) {
  return (
    <div style={{ display: 'flex', gap: '3px', marginBottom: '14px' }}>
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 16 16" fill="#FF8C42">
          <path d="M8 1.2l1.75 3.55 3.92.57-2.84 2.77.67 3.9L8 10.1l-3.5 1.84.67-3.9L2.33 5.32l3.92-.57L8 1.2z" />
        </svg>
      ))}
    </div>
  );
}

function GoogleBadge({ label }: { label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '20px' }}>
      {/* Google G */}
      <svg width="16" height="16" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
      <span style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '11px',
        color: 'rgba(36,32,40,0.35)',
        letterSpacing: '0.06em',
      }}>
        {label}
      </span>
    </div>
  );
}

export default function TestimonialsSection() {
  const params = useParams();
  const locale = (params?.locale as string) ?? 'en';
  const c = locale === 'sv' ? CONTENT.sv : CONTENT.en;

  return (
    <section style={{ background: '#FFFBF5', padding: '96px 24px' }}>
      <div style={{ maxWidth: '896px', margin: '0 auto' }}>

        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <p style={{
            fontFamily: "'eight-condensed', sans-serif",
            fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase',
            color: '#ae84ea', marginBottom: '12px',
          }}>
            {c.eyebrow}
          </p>
          <h2 style={{
            fontFamily: "'eight-condensed', sans-serif",
            fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 400,
            color: '#242028', margin: 0, lineHeight: 1.1,
          }}>
            {c.heading}
          </h2>
        </div>

        {/* Google review cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px',
          marginBottom: '20px',
        }}>
          {REVIEWS.map((r) => (
            <div key={r.name} style={{
              background: '#fff',
              borderRadius: '16px',
              padding: '28px 28px 24px',
              boxShadow: '0 2px 16px rgba(36,32,40,0.06)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
              <div>
                <Stars count={r.stars} />
                <p style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '15px',
                  lineHeight: 1.65,
                  color: '#242028',
                  margin: '0 0 16px',
                }}>
                  "{r.quote}"
                </p>
                <p style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'rgba(36,32,40,0.6)',
                  margin: 0,
                }}>
                  {r.name}
                </p>
              </div>
              <GoogleBadge label={c.googleLabel} />
            </div>
          ))}
        </div>

        {/* Singapore featured quote */}
        <div style={{
          background: '#242028',
          borderRadius: '16px',
          padding: '40px 40px 36px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Large quote mark */}
          <div style={{
            position: 'absolute', top: '20px', right: '32px',
            fontFamily: 'Georgia, serif',
            fontSize: '120px', lineHeight: 1,
            color: 'rgba(174,132,234,0.12)',
            pointerEvents: 'none',
            userSelect: 'none',
          }}>
            "
          </div>

          <p style={{
            fontFamily: "'eight-condensed', sans-serif",
            fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase',
            color: '#ae84ea', marginBottom: '20px',
          }}>
            {c.singaporeTag}
          </p>

          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 'clamp(15px, 2vw, 18px)',
            lineHeight: 1.7,
            color: 'rgba(240,234,248,0.85)',
            margin: '0 0 24px',
            maxWidth: '680px',
            position: 'relative',
          }}>
            "{SINGAPORE_QUOTE}"
          </p>

          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '13px',
            color: 'rgba(240,234,248,0.35)',
            margin: 0,
          }}>
            — {c.singaporeAttr}
          </p>
        </div>

      </div>
    </section>
  );
}
