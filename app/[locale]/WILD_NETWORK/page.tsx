'use client';

import { useRouter } from 'next/navigation';

export default function WildNetworkPage() {
  const router = useRouter();

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: '#0d0a12' }}>
      <iframe
        src="https://leovickman-eng.github.io/WILD_NETWORK/"
        allow="fullscreen"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          border: 'none',
        }}
        title="Wild Network"
      />

      <button
        onClick={() => router.back()}
        aria-label="Go back"
        style={{
          position: 'absolute',
          top: '20px',
          left: '24px',
          zIndex: 10,
          background: 'rgba(255,251,245,0.12)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '50%',
          width: '44px',
          height: '44px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'rgba(255,251,245,0.75)',
          transition: 'background 0.15s, color 0.15s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(255,251,245,0.2)';
          e.currentTarget.style.color = '#fff';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'rgba(255,251,245,0.12)';
          e.currentTarget.style.color = 'rgba(255,251,245,0.75)';
        }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M11 4L6 9l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
