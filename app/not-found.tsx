export default function NotFound() {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#FFFBF5', color: '#1C1917', fontFamily: 'sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>404</h1>
          <p style={{ opacity: 0.5 }}>Page not found</p>
          <a href="/" style={{ display: 'inline-block', marginTop: '1.5rem', color: '#ae84ea' }}>Go home</a>
        </div>
      </body>
    </html>
  );
}
