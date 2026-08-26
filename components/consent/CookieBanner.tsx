'use client';

import { useEffect, useState } from 'react';

const CONSENT_KEY = 'ip_cookie_consent';

declare function gtag(...args: unknown[]): void;

type Props = { locale: string };

export default function CookieBanner({ locale }: Props) {
  const isSv = locale === 'sv';
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(CONSENT_KEY)) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem(CONSENT_KEY, 'granted');
    setVisible(false);
    if (typeof gtag !== 'undefined') {
      gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted',
      });
    }
    window.dataLayer = window.dataLayer || [];
    (window.dataLayer as unknown[]).push({ event: 'consent_granted' });
  }

  function decline() {
    localStorage.setItem(CONSENT_KEY, 'denied');
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label={isSv ? 'Cookie-inställningar' : 'Cookie settings'}
      style={{
        position: 'fixed',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        background: '#0d0a12',
        color: '#FFFBF5',
        borderRadius: 16,
        padding: '20px 24px',
        maxWidth: 480,
        width: 'calc(100vw - 32px)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.45)',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, opacity: 0.85 }}>
        {isSv
          ? 'Vi använder cookies för analys och marknadsföring. Du väljer om du vill delta.'
          : 'We use cookies for analytics and marketing. You choose whether to participate.'}
      </p>
      <div style={{ display: 'flex', gap: 10 }}>
        <button
          onClick={accept}
          style={{
            flex: 1,
            background: '#ae84ea',
            color: '#0d0a12',
            border: 'none',
            borderRadius: 999,
            padding: '10px 20px',
            fontWeight: 700,
            fontSize: 14,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          {isSv ? 'Godkänn' : 'Accept'}
        </button>
        <button
          onClick={decline}
          style={{
            flex: 1,
            background: 'transparent',
            color: '#FFFBF5',
            border: '1px solid rgba(255,251,245,0.25)',
            borderRadius: 999,
            padding: '10px 20px',
            fontWeight: 600,
            fontSize: 14,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          {isSv ? 'Avvisa' : 'Decline'}
        </button>
      </div>
    </div>
  );
}
