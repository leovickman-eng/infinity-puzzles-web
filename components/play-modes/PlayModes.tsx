export default function PlayModes() {
  return (
    <section style={{
      background: '#FFFBF5',
      padding: '0 clamp(24px, 6vw, 80px) clamp(48px, 8vw, 96px)',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'center',
      gap: 'clamp(24px, 4vw, 64px)',
      flexWrap: 'wrap',
    }}>
      {[
        { text: 'Build alone.',              color: '#dac1ff' },
        { text: 'Split it with a stranger.', color: '#ae84ea' },
        { text: 'Or try the impossible chain.', color: '#7B5EA7' },
      ].map(({ text, color }) => (
        <p key={text} style={{
          fontFamily: 'eight-condensed, sans-serif',
          fontSize: 'clamp(1.1rem, 2.5vw, 2rem)',
          color,
          margin: 0,
          letterSpacing: '0.02em',
          lineHeight: 1.3,
          maxWidth: '280px',
          textAlign: 'center',
        }}>
          {text}
        </p>
      ))}
    </section>
  );
}
