'use client';

import { useEffect, useState, useCallback } from 'react';

const CONSENT_KEY = 'ip_cookie_consent';

/* ── Consent update ────────────────────────────────────────────────────────
   MUST push the *arguments* object (not an array) so GTM/GA reads it right.
   Recreates the same pattern as the inline script in layout.tsx.
────────────────────────────────────────────────────────────────────────── */
/* eslint-disable prefer-rest-params, @typescript-eslint/no-explicit-any */
function sendConsentUpdate(granted: boolean) {
  const dl: any[] = ((window as any).dataLayer = (window as any).dataLayer || []);
  const state = granted ? 'granted' : 'denied';
  const params = {
    analytics_storage:      state,
    ad_storage:             state,
    ad_user_data:           state,
    ad_personalization:     state,
    functionality_storage:  state,
    personalization_storage: state,
  };
  // Push as Arguments object — not an array
  (function gtag() { dl.push(arguments); })('consent', 'update', params);
  (function gtag() { dl.push(arguments); })({ event: 'consent_updated', consent_choice: state });
}
/* eslint-enable prefer-rest-params, @typescript-eslint/no-explicit-any */

function tryGet(): string | null {
  try { return localStorage.getItem(CONSENT_KEY); } catch { return null; }
}
function trySave(val: string) {
  try { localStorage.setItem(CONSENT_KEY, val); } catch { /* noop */ }
}

type Props = { locale: string };

export default function CookieBanner({ locale }: Props) {
  const isSv = locale === 'sv';
  const [visible, setVisible] = useState(false);

  // On mount: if choice already saved → send update silently, no banner.
  useEffect(() => {
    const saved = tryGet();
    if (saved === 'granted' || saved === 'denied') {
      sendConsentUpdate(saved === 'granted');
    } else {
      // Small delay so the hero/buy button renders first
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  // Re-open via window.dispatchEvent(new Event('open-cookie-settings'))
  useEffect(() => {
    const handler = () => setVisible(true);
    window.addEventListener('open-cookie-settings', handler);
    return () => window.removeEventListener('open-cookie-settings', handler);
  }, []);

  const handleChoice = useCallback((granted: boolean) => {
    trySave(granted ? 'granted' : 'denied');
    sendConsentUpdate(granted);
    setVisible(false);
  }, []);

  if (!visible) return null;

  const btn: React.CSSProperties = {
    flex: 1,
    padding: '11px 18px',
    borderRadius: 999,
    fontSize: 13,
    fontWeight: 600,
    fontFamily: 'inherit',
    cursor: 'pointer',
    transition: 'opacity 0.15s, transform 0.15s',
    letterSpacing: '0.03em',
    whiteSpace: 'nowrap',
  };

  return (
    <>
      <style>{`
        @keyframes cb-slide-up {
          from { opacity: 0; transform: translateX(-50%) translateY(16px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        .cb-btn:hover  { opacity: 0.85; }
        .cb-btn:active { transform: scale(0.97); }
      `}</style>

      <div
        role="dialog"
        aria-modal="true"
        aria-label={isSv ? 'Cookie-inställningar' : 'Cookie settings'}
        style={{
          position: 'fixed',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
          width: 'calc(100vw - 32px)',
          maxWidth: 460,
          background: 'rgba(22, 18, 28, 0.88)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(174, 132, 234, 0.22)',
          borderRadius: 20,
          padding: '18px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          boxShadow: '0 8px 48px rgba(0,0,0,0.55), 0 0 0 1px rgba(174,132,234,0.08)',
          animation: 'cb-slide-up 0.4s cubic-bezier(0.34,1.56,0.64,1) both',
        }}
      >
        {/* Copy */}
        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.65, color: 'rgba(255,251,245,0.75)' }}>
          {isSv
            ? <>Vi använder cookies för analys och marknadsföring. Du väljer om du vill delta. <a href="/sv/privacy" style={{ color: '#ae84ea', textDecoration: 'underline', textUnderlineOffset: 3 }}>Integritetspolicy</a></>
            : <>We use cookies for analytics and marketing. You choose whether to participate. <a href="/en/privacy" style={{ color: '#ae84ea', textDecoration: 'underline', textUnderlineOffset: 3 }}>Privacy policy</a></>
          }
        </p>

        {/* Buttons — equal visual weight per IMY/GDPR */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className="cb-btn"
            onClick={() => handleChoice(true)}
            style={{
              ...btn,
              background: '#ae84ea',
              color: '#16101e',
              border: '1.5px solid #ae84ea',
            }}
          >
            {isSv ? 'Acceptera alla' : 'Accept all'}
          </button>
          <button
            className="cb-btn"
            onClick={() => handleChoice(false)}
            style={{
              ...btn,
              background: 'rgba(255,251,245,0.07)',
              color: 'rgba(255,251,245,0.85)',
              border: '1.5px solid rgba(255,251,245,0.2)',
            }}
          >
            {isSv ? 'Bara nödvändiga' : 'Necessary only'}
          </button>
        </div>
      </div>
    </>
  );
}
