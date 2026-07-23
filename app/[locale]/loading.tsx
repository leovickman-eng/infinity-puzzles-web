// Pure CSS-version — ingen extern import som kan krascha
// NavigationLoader hanterar Lottie-animationen för klient-navigering
export default function Loading() {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: '#0d0a12',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <style>{`
        @keyframes knotBreathe {
          0%, 100% { opacity: 0.2; transform: scale(0.88); }
          50%       { opacity: 0.9; transform: scale(1);   }
        }
        .loading-svg {
          animation: knotBreathe 2.2s ease-in-out infinite;
        }
      `}</style>
      <svg
        className="loading-svg"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 34.4 23.9"
        width="72" height="50"
        aria-hidden="true"
      >
        <path
          fill="#ae84ea"
          d="M22.4,22c-3.7,2-8.4,2.3-12.4,1.3s-5.2-1.9-7-3.9S.7,16.4.3,14.5,0,12.1,0,10.9c.2-1.9,1.1-3.6,2.9-4.3,1.3-.5,2.8-.4,4.2-.1C9.1,3,12.7,1.1,16.5.3s8.8-.2,12.5,2.1,4.7,4.3,5.3,7.5.2,2.1.1,3.2c-.2,2.1-1.2,3.7-3.2,4.4-1.2.4-2.6.3-3.9,0-1.1,2-2.8,3.5-4.8,4.6ZM28.5,10.1c.2,1.5.2,3-.1,4.4.6,0,1.3.1,2,0,.4-.1.6-.4.8-.7.4-1,.3-2.5,0-3.5-.7-3.5-3.8-5.7-7.1-6.6s-5.3-.7-7.8,0-2.3.8-3.4,1.4c-1,.6-1.9,1.4-2.6,2.4l2.8,1.1,4,1.8,2.4-1.6,1.7-1c1.2-.6,2.5-1.2,3.9-1.1s2.2.7,2.8,1.7.5,1.2.6,1.9ZM24.2,16.6l-2.9-1.1-3.9-1.7-2.6,1.7c-.7.5-1.5.9-2.2,1.2-1.1.5-2.3.9-3.6.7s-2.2-1.1-2.7-2.3-.6-4-.2-5.7c-.7,0-1.4-.1-2,0-.3.1-.5.3-.7.6-.4.9-.4,2.5-.2,3.5.5,2.5,2,4.3,4.2,5.6,3.9,2.2,9.5,2.3,13.5.3,1-.5,1.9-1.1,2.6-1.9l.7-.8ZM23.9,13.2l1.5.6c.2-1,.2-2.1.1-3.1s-.1-.6-.3-.9-.8-.2-1.3,0c-.5.2-1,.4-1.5.7l-2.2,1.3,3.6,1.5ZM10.4,14.2c1.3-.5,2.5-1.2,3.7-2l-3.5-1.5-1.5-.6c-.2,1-.2,2-.1,3.1s.1.6.3.9.8.2,1.2,0Z"
        />
      </svg>
    </div>
  );
}
