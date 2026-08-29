'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

type State = 'idle' | 'loading' | 'success' | 'error';

export default function NewsletterSection() {
  const t = useTranslations('newsletter');
  const [email, setEmail]     = useState('');
  const [consent, setConsent] = useState(false);
  const [state, setState]     = useState<State>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !consent || state === 'loading') return;
    setState('loading');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, consent }),
      });
      setState(res.ok ? 'success' : 'error');
    } catch {
      setState('error');
    }
  }

  const font     = { fontFamily: 'eight-condensed, Georgia, serif' } as React.CSSProperties;
  const fontBold = { ...font, fontWeight: 700 }                      as React.CSSProperties;

  return (
    <section style={{ background: '#FFFBF5', padding: '0 24px 80px' }}>
      <div style={{
        maxWidth: 560,
        margin: '0 auto',
        borderTop: '1px solid rgba(13,10,18,0.08)',
        paddingTop: 56,
        textAlign: 'center',
      }}>
        <p style={{ ...font, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#ae84ea', margin: '0 0 12px' }}>
          {t('eyebrow')}
        </p>

        <h2 style={{ ...fontBold, fontSize: 'clamp(28px, 5vw, 42px)', color: '#0d0a12', margin: '0 0 16px', lineHeight: 1.1 }}>
          {t('title')}
        </h2>

        <p style={{ fontFamily: 'var(--font-trykker, Georgia, serif)', fontSize: 15, lineHeight: 1.8, color: 'rgba(13,10,18,0.55)', margin: '0 0 32px', maxWidth: 420, marginLeft: 'auto', marginRight: 'auto' }}>
          {t('body')}
        </p>

        {state === 'success' ? (
          <p style={{ ...fontBold, fontSize: 18, color: '#ae84ea', letterSpacing: '0.04em' }}>
            {t('success')}
          </p>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, maxWidth: 400, margin: '0 auto' }}>
            <div style={{ display: 'flex', gap: 8, width: '100%', flexWrap: 'wrap', justifyContent: 'center' }}>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={t('placeholder')}
                disabled={state === 'loading'}
                style={{
                  fontFamily: 'var(--font-trykker, Georgia, serif)',
                  fontSize: 14,
                  flex: '1 1 200px',
                  padding: '13px 18px',
                  borderRadius: 9999,
                  border: '1.5px solid rgba(174,132,234,0.35)',
                  background: '#fff',
                  color: '#0d0a12',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e  => (e.target.style.borderColor = '#ae84ea')}
                onBlur={e   => (e.target.style.borderColor = 'rgba(174,132,234,0.35)')}
              />
              <button
                type="submit"
                disabled={state === 'loading' || !consent}
                style={{
                  ...fontBold,
                  fontSize: 14,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  background: (state === 'loading' || !consent) ? 'rgba(174,132,234,0.4)' : '#ae84ea',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 9999,
                  padding: '13px 28px',
                  cursor: (state === 'loading' || !consent) ? 'default' : 'pointer',
                  transition: 'background 0.2s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => { if (state !== 'loading' && consent) e.currentTarget.style.background = '#c09ef0'; }}
                onMouseLeave={e => { if (state !== 'loading' && consent) e.currentTarget.style.background = '#ae84ea'; }}
              >
                {state === 'loading' ? '…' : t('cta')}
              </button>
            </div>

            {/* Consent checkbox */}
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, cursor: 'pointer', maxWidth: 380 }}>
              <input
                type="checkbox"
                required
                checked={consent}
                onChange={e => setConsent(e.target.checked)}
                style={{ marginTop: 3, accentColor: '#ae84ea', flexShrink: 0 }}
              />
              <span style={{ fontFamily: 'var(--font-trykker, Georgia, serif)', fontSize: 12, color: 'rgba(13,10,18,0.45)', lineHeight: 1.5, textAlign: 'left' }}>
                {t('consentLabel')}
              </span>
            </label>

            {state === 'error' && (
              <p style={{ textAlign: 'center', fontFamily: 'var(--font-trykker, Georgia, serif)', fontSize: 13, color: '#e81317', margin: 0 }}>
                {t('error')}
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
