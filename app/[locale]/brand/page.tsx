'use client';

import { useState, useEffect } from 'react';

const PASSWORD    = 'Spagetti!23';
const SESSION_KEY = 'brand_auth';

const LOGO_SWATCHES = [
  { hex: '#1C1917', name: 'Svart' },
  { hex: '#5B4A8A', name: 'Lila' },
  { hex: '#5DCCA0', name: 'Mint' },
  { hex: '#1A3A4A', name: 'Navy' },
  { hex: '#F8F060', name: 'Gul' },
  { hex: '#ae84ea', name: 'Primär' },
  { hex: '#ffffff', name: 'Vit' },
];

const PALETTE = [
  { hex: '#5B4A8A', name: 'Lila' },
  { hex: '#5DCCA0', name: 'Mint' },
  { hex: '#1A3A4A', name: 'Navy' },
  { hex: '#F8F060', name: 'Gul' },
  { hex: '#ae84ea', name: 'Primär lila' },
];

const PALETTE_WILD = [
  { hex: '#544550' },
  { hex: '#f9ece4' },
  { hex: '#e81317' },
  { hex: '#05375a' },
  { hex: '#533f7e' },
  { hex: '#f6b8bd' },
  { hex: '#530100' },
  { hex: '#dac1ff' },
  { hex: '#16ade6' },
  { hex: '#57d494' },
  { hex: '#fb8f02' },
  { hex: '#fdf07d' },
  { hex: '#0d8137' },
  { hex: '#7ed6cd' },
];

const SIZES = [200, 400, 800, 1200, 1920];

const FONTS = [
  { name: 'Trykker',  family: 'var(--font-trykker, Georgia, serif)', useCase: 'Body text, UI, all general copy' },
  { name: 'Nakone',   family: 'eight-condensed, sans-serif',              useCase: 'Hero overlay (S1)' },
  { name: 'Brianne',  family: 'Brianne, Georgia, serif',             useCase: 'Scroll text cues (S2)' },
];

// The SVG paths have no explicit fill attrs — they inherit from the root <svg>.
// Setting fill on <svg> is enough to recolor the whole logo.
function recolorSvg(svg: string, color: string): string {
  // Remove any existing fill on <svg>, then add the new one
  return svg
    .replace(/(<svg\b[^>]*?)\s+fill="[^"]*"/i, '$1')
    .replace(/<svg\b/, `<svg fill="${color}"`);
}

// Strip explicit width/height attrs so the SVG scales to its container
function stripSvgDimensions(svg: string): string {
  return svg
    .replace(/(<svg[^>]*?)\s+width="[^"]*"/i,  '$1')
    .replace(/(<svg[^>]*?)\s+height="[^"]*"/i, '$1');
}

export default function BrandPage() {
  const [authed,     setAuthed]     = useState(false);
  const [pw,         setPw]         = useState('');
  const [shake,      setShake]      = useState(false);
  const [svgText,    setSvgText]    = useState('');
  const [logoColor,  setLogoColor]  = useState('#1C1917');
  const [customHex,  setCustomHex]  = useState('#1C1917');
  const [logoSize,   setLogoSize]   = useState(400);
  const [customSize, setCustomSize] = useState('');
  const [copied,     setCopied]     = useState<string | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === '1') setAuthed(true);
  }, []);

  useEffect(() => {
    if (!authed) return;
    fetch('/images/SVG/Logga_svart-02.svg')
      .then(r => r.text())
      .then(setSvgText)
      .catch(() => {});
  }, [authed]);

  function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pw === PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, '1');
      setAuthed(true);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 450);
      setPw('');
    }
  }

  function applyColor(hex: string) {
    setLogoColor(hex);
    setCustomHex(hex);
  }

  function handleCustomHex(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    setCustomHex(v);
    if (/^#[0-9a-fA-F]{6}$/.test(v)) setLogoColor(v);
  }

  const activeSize = (customSize && parseInt(customSize) > 0) ? parseInt(customSize) : logoSize;

  function downloadSvg() {
    if (!svgText) return;
    const blob = new Blob([recolorSvg(svgText, logoColor)], { type: 'image/svg+xml' });
    const a = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(blob),
      download: 'infinity-puzzles-logo.svg',
    });
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function downloadPng() {
    if (!svgText) return;
    const colored = recolorSvg(svgText, logoColor);
    const w = activeSize;

    // Derive aspect ratio from viewBox or original width/height attrs
    const parser = new DOMParser();
    const doc    = parser.parseFromString(colored, 'image/svg+xml');
    const svgEl  = doc.querySelector('svg');
    const vb     = svgEl?.getAttribute('viewBox')?.split(/[\s,]+/).map(Number);
    const vbW    = vb?.[2] ?? parseFloat(svgEl?.getAttribute('width')  ?? '1');
    const vbH    = vb?.[3] ?? parseFloat(svgEl?.getAttribute('height') ?? '1');
    const h      = Math.round(w * vbH / vbW);

    const sized = colored
      .replace(/(<svg[^>]*?)\s+width="[^"]*"/i,  '$1')
      .replace(/(<svg[^>]*?)\s+height="[^"]*"/i, '$1')
      .replace('<svg', `<svg width="${w}" height="${h}"`);

    const blob = new Blob([sized], { type: 'image/svg+xml' });
    const url  = URL.createObjectURL(blob);

    const canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      Object.assign(document.createElement('a'), {
        download: `infinity-puzzles-logo-${w}px.png`,
        href: canvas.toDataURL('image/png'),
      }).click();
    };
    img.src = url;
  }

  function copyHex(hex: string) {
    navigator.clipboard.writeText(hex).catch(() => {});
    setCopied(hex);
    setTimeout(() => setCopied(null), 1400);
  }

  // Flip preview background to dark when logo is white
  const previewBg = logoColor.toLowerCase() === '#ffffff' ? '#1C1917' : '#FFFBF5';

  const previewSvg = svgText
    ? stripSvgDimensions(recolorSvg(svgText, logoColor))
    : '';

  // ── PASSWORD GATE ──────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <>
        <style>{`
          @keyframes ip-shake {
            0%,100% { transform:translateX(0) }
            20%,60%  { transform:translateX(-8px) }
            40%,80%  { transform:translateX(8px) }
          }
          .ip-shake { animation: ip-shake 0.45s ease-in-out; }
        `}</style>
        <div style={{
          minHeight: '100svh', background: '#FFFBF5',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
            <span style={{ fontFamily: 'var(--font-trykker, Georgia, serif)', fontSize: '1.4rem', color: '#1C1917', letterSpacing: '0.04em' }}>
              Brand
            </span>
            <div className={shake ? 'ip-shake' : ''}>
              <input
                type="password"
                value={pw}
                onChange={e => setPw(e.target.value)}
                placeholder="Lösenord"
                autoFocus
                style={{
                  fontFamily: 'var(--font-trykker, Georgia, serif)',
                  fontSize: '1rem', padding: '0.75rem 1.25rem',
                  border: `1.5px solid ${shake ? '#ff4b8b' : '#ae84ea'}`,
                  borderRadius: '8px', background: '#fff', color: '#1C1917',
                  outline: 'none', width: '260px', textAlign: 'center',
                  transition: 'border-color 0.2s',
                }}
              />
            </div>
            <button type="submit" style={{
              fontFamily: 'var(--font-trykker, Georgia, serif)',
              background: '#ae84ea', color: '#fff', border: 'none',
              borderRadius: '8px', padding: '0.65rem 2rem',
              fontSize: '1rem', cursor: 'pointer',
            }}>
              Enter
            </button>
          </form>
        </div>
      </>
    );
  }

  // ── BRAND PAGE ─────────────────────────────────────────────────────────────
  return (
    <div style={{ background: '#FFFBF5', minHeight: '100svh', padding: '4rem 2rem', fontFamily: 'var(--font-trykker, Georgia, serif)' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '5rem' }}>

        <h1 style={{ margin: 0, fontSize: '2rem', color: '#1C1917', fontWeight: 400 }}>
          Brand
        </h1>

        {/* ── LOGO ── */}
        <section>
          <h2 style={sh}>Logo</h2>

          {/* Preview canvas */}
          <div style={{
            background: previewBg, borderRadius: '14px', padding: '3rem 2rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '2rem', transition: 'background 0.3s',
            minHeight: '180px',
          }}>
            {previewSvg
              ? <div
                  style={{ width: Math.min(activeSize, 700), maxWidth: '100%' }}
                  dangerouslySetInnerHTML={{ __html: previewSvg }}
                />
              : <span style={{ color: '#ccc', fontSize: '0.9rem' }}>Laddar logga…</span>
            }
          </div>

          {/* Color swatches */}
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '1rem', alignItems: 'center' }}>
            {LOGO_SWATCHES.map(s => (
              <button
                key={s.hex}
                title={s.name}
                onClick={() => applyColor(s.hex)}
                style={{
                  width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                  background: s.hex, cursor: 'pointer',
                  border: logoColor.toLowerCase() === s.hex.toLowerCase()
                    ? '2.5px solid #ae84ea'
                    : s.hex === '#ffffff' ? '1.5px solid #d0c8e0' : '1.5px solid transparent',
                  boxShadow: s.hex === '#ffffff' ? 'inset 0 0 0 1px #e0dae8' : 'none',
                  transition: 'border 0.15s',
                }}
              />
            ))}
          </div>

          {/* Custom hex + color picker */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <input
              type="color"
              value={logoColor}
              onChange={e => applyColor(e.target.value)}
              style={{ width: 34, height: 34, border: 'none', borderRadius: '6px', cursor: 'pointer', padding: 0, background: 'transparent' }}
            />
            <input
              type="text"
              value={customHex}
              onChange={handleCustomHex}
              placeholder="#000000"
              style={{
                fontFamily: 'monospace', fontSize: '0.9rem',
                padding: '0.4rem 0.75rem', width: '130px',
                border: '1.5px solid #d0c8e0', borderRadius: '6px',
                color: '#1C1917', background: '#fff', outline: 'none',
              }}
            />
          </div>

          {/* Size selector */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1.75rem' }}>
            {SIZES.map(s => (
              <button
                key={s}
                onClick={() => { setLogoSize(s); setCustomSize(''); }}
                style={{
                  fontFamily: 'var(--font-trykker, Georgia, serif)',
                  fontSize: '0.82rem', padding: '0.38rem 0.7rem',
                  borderRadius: '6px', border: 'none', cursor: 'pointer',
                  background: logoSize === s && !customSize ? '#ae84ea' : '#f0eaf8',
                  color:      logoSize === s && !customSize ? '#fff'    : '#5B4A8A',
                  transition: 'background 0.15s, color 0.15s',
                }}
              >
                {s}px
              </button>
            ))}
            <input
              type="number"
              min={1}
              placeholder="anpassad"
              value={customSize}
              onChange={e => setCustomSize(e.target.value)}
              style={{
                fontFamily: 'var(--font-trykker, Georgia, serif)',
                fontSize: '0.82rem', padding: '0.38rem 0.6rem',
                border: '1.5px solid #d0c8e0', borderRadius: '6px',
                width: '100px', color: '#1C1917', background: '#fff', outline: 'none',
              }}
            />
          </div>

          {/* Download buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button onClick={downloadSvg} style={dlBtn}>↓ SVG</button>
            <button onClick={downloadPng} style={dlBtn}>↓ PNG {activeSize}px</button>
          </div>
        </section>

        {/* ── COLORS ── */}
        <section>
          <h2 style={sh}>Färger</h2>
          <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
            {PALETTE.map(c => {
              const isYellow = c.hex === '#F8F060';
              return (
                <div
                  key={c.hex}
                  onClick={() => copyHex(c.hex)}
                  title="Klicka för att kopiera"
                  style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'center' }}
                >
                  <div style={{
                    width: 96, height: 96, borderRadius: '12px', background: c.hex,
                    border: '1.5px solid rgba(0,0,0,0.06)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {copied === c.hex && (
                      <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: isYellow ? '#1C1917' : '#fff' }}>
                        Kopierat
                      </span>
                    )}
                  </div>
                  <span style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#7A6B8A' }}>{c.hex}</span>
                  <span style={{ fontSize: '0.82rem', color: '#1C1917' }}>{c.name}</span>
                </div>
              );
            })}
          </div>

          <h3 style={{ ...sh, marginTop: '2.5rem' }}>Wild-palett</h3>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {PALETTE_WILD.map(c => {
              const isLight = ['#f9ece4','#f6b8bd','#dac1ff','#fdf07d'].includes(c.hex);
              return (
                <div
                  key={c.hex}
                  onClick={() => copyHex(c.hex)}
                  title="Klicka för att kopiera"
                  style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '0.35rem', alignItems: 'center' }}
                >
                  <div style={{
                    width: 72, height: 72, borderRadius: '10px', background: c.hex,
                    border: '1.5px solid rgba(0,0,0,0.07)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {copied === c.hex && (
                      <span style={{ fontSize: '0.65rem', fontFamily: 'monospace', color: isLight ? '#1C1917' : '#fff' }}>
                        ✓
                      </span>
                    )}
                  </div>
                  <span style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: '#7A6B8A' }}>{c.hex}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── TYPOGRAPHY ── */}
        <section>
          <h2 style={sh}>Typografi</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {FONTS.map(f => (
              <div key={f.name} style={{ borderLeft: '3px solid #ae84ea', paddingLeft: '1.5rem' }}>
                <div style={{ fontSize: '0.75rem', color: '#ae84ea', letterSpacing: '0.09em', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                  {f.name} — {f.useCase}
                </div>
                <div style={{ fontFamily: f.family, fontSize: 'clamp(1.5rem, 4vw, 2.4rem)', color: '#1C1917', lineHeight: 1.15 }}>
                  Infinity Puzzles
                </div>
                <div style={{ fontFamily: f.family, fontSize: '1.05rem', color: 'rgba(28,25,23,0.5)', marginTop: '0.3rem' }}>
                  Art, Math, and a bit of Magic.
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── VOICE & TONE ── */}
        <section style={{ paddingBottom: '5rem' }}>
          <h2 style={sh}>Voice &amp; Tone</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '560px' }}>
            {[
              ['Kort och träffsäkert',       'Art, math, magic. Inget fluff.'],
              ['Ärlig och lite kaotisk',      'Vi lovar inte perfektion. Vi lovar något du inte sett förut.'],
              ['Svenska först, globalt sen',  'Rötterna är svenska. Ambitionerna är globala.'],
            ].map(([label, text]) => (
              <div key={label}>
                <div style={{ fontSize: '0.75rem', color: '#ae84ea', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                  {label}
                </div>
                <div style={{ fontSize: '1.05rem', color: '#1C1917', lineHeight: 1.5 }}>
                  {text}
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

// ── Shared micro-styles ────────────────────────────────────────────────────
const sh: React.CSSProperties = {
  fontFamily: 'var(--font-trykker, Georgia, serif)',
  fontSize: '0.75rem', fontWeight: 400,
  color: '#ae84ea', letterSpacing: '0.12em',
  textTransform: 'uppercase', margin: '0 0 1.75rem 0',
};

const dlBtn: React.CSSProperties = {
  fontFamily: 'var(--font-trykker, Georgia, serif)',
  fontSize: '0.9rem', padding: '0.6rem 1.5rem',
  borderRadius: '8px', border: '1.5px solid #ae84ea',
  background: 'transparent', color: '#ae84ea', cursor: 'pointer',
};
