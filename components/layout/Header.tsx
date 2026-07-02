'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useCart } from '@/components/shop/CartContext';

type Props = {
  locale: string;
};

function InfinityKnot() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34.4 23.9" width="32" height="22" aria-hidden="true">
      <path fill="#ae84ea" d="M22.4,22c-3.7,2-8.4,2.3-12.4,1.3s-5.2-1.9-7-3.9S.7,16.4.3,14.5,0,12.1,0,10.9c.2-1.9,1.1-3.6,2.9-4.3,1.3-.5,2.8-.4,4.2-.1C9.1,3,12.7,1.1,16.5.3s8.8-.2,12.5,2.1,4.7,4.3,5.3,7.5.2,2.1.1,3.2c-.2,2.1-1.2,3.7-3.2,4.4-1.2.4-2.6.3-3.9,0-1.1,2-2.8,3.5-4.8,4.6ZM28.5,10.1c.2,1.5.2,3-.1,4.4.6,0,1.3.1,2,0,.4-.1.6-.4.8-.7.4-1,.3-2.5,0-3.5-.7-3.5-3.8-5.7-7.1-6.6s-5.3-.7-7.8,0-2.3.8-3.4,1.4c-1,.6-1.9,1.4-2.6,2.4l2.8,1.1,4,1.8,2.4-1.6,1.7-1c1.2-.6,2.5-1.2,3.9-1.1s2.2.7,2.8,1.7.5,1.2.6,1.9ZM24.2,16.6l-2.9-1.1-3.9-1.7-2.6,1.7c-.7.5-1.5.9-2.2,1.2-1.1.5-2.3.9-3.6.7s-2.2-1.1-2.7-2.3-.6-4-.2-5.7c-.7,0-1.4-.1-2,0-.3.1-.5.3-.7.6-.4.9-.4,2.5-.2,3.5.5,2.5,2,4.3,4.2,5.6,3.9,2.2,9.5,2.3,13.5.3,1-.5,1.9-1.1,2.6-1.9l.7-.8ZM23.9,13.2l1.5.6c.2-1,.2-2.1.1-3.1s-.1-.6-.3-.9-.8-.2-1.3,0c-.5.2-1,.4-1.5.7l-2.2,1.3,3.6,1.5ZM10.4,14.2c1.3-.5,2.5-1.2,3.7-2l-3.5-1.5-1.5-.6c-.2,1-.2,2-.1,3.1s.1.6.3.9.8.2,1.2,0Z"/>
    </svg>
  );
}

function HamburgerIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="18" viewBox="0 0 22 18" aria-hidden="true">
      <line x1="1" y1="2"  x2="21" y2="2"  stroke="#ae84ea" strokeWidth="3" strokeLinecap="round" />
      <line x1="1" y1="9"  x2="21" y2="9"  stroke="#ae84ea" strokeWidth="3" strokeLinecap="round" />
      <line x1="1" y1="16" x2="21" y2="16" stroke="#ae84ea" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export default function Header({ locale }: Props) {
  const t = useTranslations('nav');
  const { cart, openCart } = useCart();
  const itemCount = cart?.totalQuantity ?? 0;
  const otherLocale = locale === 'en' ? 'sv' : 'en';
  const pathname = usePathname();

  // Hide header on /universe routes — feels like a standalone app
  if (pathname.includes('/universe')) return null;

  const router = useRouter();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        dropdownRef.current?.contains(target)
      ) return;
      setOpen(false);
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [open]);

  const scrollTo = (id: string) => {
    setOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      router.push(`/${locale}#${id}`);
    }
  };

  const navLinks: Array<
    { href: string; label: string; scrollTo?: undefined } |
    { scrollTo: string; label: string; href?: undefined }
  > = [
    { href: `/${locale}/universe/stories`,  label: t('characters') },
    { scrollTo: 'story',              label: t('story') },
    { scrollTo: 'shop',               label: 'Shop' },
    { href: `/${locale}/WILD_NETWORK`, label: 'Wild Network' },
  ];

  const dropdown = (
    <div
      ref={dropdownRef}
      style={{
        position: 'fixed',
        top: 68,
        left: 20,
        zIndex: 200,
        background: '#1C1917',
        borderRadius: 14,
        padding: '8px 0',
        minWidth: 188,
        boxShadow: '0 8px 32px rgba(0,0,0,0.45), 0 1px 0 rgba(255,255,255,0.06) inset',
        border: '1px solid rgba(255,255,255,0.07)',
        opacity: open ? 1 : 0,
        transform: open ? 'translateY(0) scale(1)' : 'translateY(-6px) scale(0.97)',
        transition: 'opacity 0.18s ease, transform 0.18s ease',
        pointerEvents: open ? 'auto' : 'none',
      }}
    >
      {navLinks.map((item) => {
        const itemStyle = {
          display: 'block',
          padding: '10px 20px',
          fontFamily: 'Nakone, Georgia, serif',
          fontSize: '1.05rem',
          color: 'rgba(255,251,245,0.82)' as const,
          textDecoration: 'none',
          letterSpacing: '0.01em',
          transition: 'color 0.12s',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          width: '100%',
          textAlign: 'left' as const,
        };
        const hoverOn  = (e: React.MouseEvent<HTMLElement>) => (e.currentTarget.style.color = '#ae84ea');
        const hoverOff = (e: React.MouseEvent<HTMLElement>) => (e.currentTarget.style.color = 'rgba(255,251,245,0.82)');

        return item.scrollTo ? (
          <button
            key={item.scrollTo}
            onClick={() => scrollTo(item.scrollTo!)}
            style={itemStyle}
            onMouseEnter={hoverOn}
            onMouseLeave={hoverOff}
          >
            {item.label}
          </button>
        ) : (
          <Link
            key={item.href}
            href={item.href!}
            onClick={() => setOpen(false)}
            style={itemStyle}
            onMouseEnter={hoverOn}
            onMouseLeave={hoverOff}
          >
            {item.label}
          </Link>
        );
      })}

      <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '6px 0' }} />

      <Link
        href={`/${otherLocale}`}
        onClick={() => setOpen(false)}
        style={{
          display: 'block',
          padding: '8px 20px',
          fontFamily: 'Nakone, Georgia, serif',
          fontSize: '0.75rem',
          color: 'rgba(255,251,245,0.35)',
          textDecoration: 'none',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          transition: 'color 0.12s',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,251,245,0.65)')}
        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,251,245,0.35)')}
      >
        {otherLocale === 'en' ? 'English' : 'Svenska'}
      </Link>
    </div>
  );

  return (
    <header className="fixed top-0 inset-x-0 z-30 px-6 py-5 flex items-center justify-between">
      <div className="absolute inset-0 mx-4 my-2 rounded-full bg-background/70 backdrop-blur-md border border-foreground/8 shadow-sm" />

      <div className="relative flex items-center gap-2 w-full">
        {/* Infinity knot — home link */}
        <Link
          href={`/${locale}`}
          aria-label="Home"
          className="flex items-center justify-center p-1 opacity-90 hover:opacity-100 transition-opacity"
        >
          <InfinityKnot />
        </Link>

        {/* Menu trigger */}
        <button
          ref={triggerRef}
          onClick={() => setOpen(o => !o)}
          aria-label="Open menu"
          aria-expanded={open}
          className="flex items-center justify-center w-7 h-7 rounded-full text-foreground/40 hover:text-foreground/70 hover:bg-foreground/6 transition-colors"
        >
          <HamburgerIcon />
        </button>

        {/* Dropdown portal */}
        {typeof document !== 'undefined' && createPortal(dropdown, document.body)}

        {/* Right: cart + locale */}
        <div className="ml-auto flex items-center gap-4">
          <Link
            href={`/${otherLocale}`}
            className="font-display text-xs uppercase tracking-widest text-foreground/40 hover:text-foreground/70 transition-colors"
          >
            {otherLocale}
          </Link>

          <button
            onClick={openCart}
            className="relative flex items-center gap-2 font-body text-sm text-foreground/70 hover:text-foreground transition-colors"
            aria-label={t('cart')}
          >
            <img src="/images/SVG/Korg-01.svg" alt="" width={28} height={28} style={{ display: 'block' }} />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 w-4 h-4 bg-primary rounded-full text-white text-[10px] font-bold flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
