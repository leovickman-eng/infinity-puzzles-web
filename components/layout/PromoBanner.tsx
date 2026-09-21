export default function PromoBanner() {
  return (
    <div
      style={{
        position: 'fixed',
        top: '68px',
        left: 0,
        right: 0,
        zIndex: 29,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '32px',
        background: 'rgba(84, 69, 80, 0.5)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <p
        style={{
          fontFamily: '"cc-pixel-arcade-display", sans-serif',
          fontWeight: 400,
          fontStyle: 'normal',
          fontSize: '11px',
          letterSpacing: '0.12em',
          color: '#F8F060',
          margin: 0,
          userSelect: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        BUY 3 PUZZLES GET{' '}
        <span style={{ color: '#f6b8bd' }}>10%</span>
        {' '}OFF
      </p>
    </div>
  );
}
