'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

type State = 'idle' | 'loading' | 'success' | 'error';

export default function NewsletterSection() {
  const t = useTranslations('newsletter');
  const [email, setEmail]   = useState('');
  const [state, setState]   = useState<State>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || state === 'loading') return;
    setState('loading');
    try {
      // TODO: replace with your Klaviyo / Shopify newsletter endpoint
      // await fetch('/api/newsletter', { method: 'POST', body: JSON.stringify({ email }) });
      await new Promise(r => setTimeout(r, 800)); // placeholder delay
      setState('success');
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
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, maxWidth: 400, margin: '0 auto', flexWrap: 'wrap', justifyContent: 'center' }}>
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
              disabled={state === 'loading'}
              style={{
                ...fontBold,
                fontSize: 14,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                background: state === 'loading' ? 'rgba(174,132,234,0.5)' : '#ae84ea',
                color: '#fff',
                border: 'none',
                borderRadius: 9999,
                padding: '13px 28px',
                cursor: state === 'loading' ? 'default' : 'pointer',
                transition: 'background 0.2s, transform 0.15s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => { if (state !== 'loading') e.currentTarget.style.background = '#c09ef0'; }}
              onMouseLeave={e => { if (state !== 'loading') e.currentTarget.style.background = '#ae84ea'; }}
            >
              {state === 'loading' ? '…' : t('cta')}
            </button>
            {state === 'error' && (
              <p style={{ width: '100%', textAlign: 'center', fontFamily: 'var(--font-trykker, Georgia, serif)', fontSize: 13, color: '#e81317', margin: '8px 0 0' }}>
                {t('error')}
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
