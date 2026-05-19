'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useCart } from '@/components/shop/CartContext';

type Props = {
  locale: string;
};

function MenuIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34.4 23.9" width="34" height="24" aria-hidden="true">
      <path fill="#ae84ea" d="M22.4,22c-3.7,2-8.4,2.3-12.4,1.3s-5.2-1.9-7-3.9S.7,16.4.3,14.5,0,12.1,0,10.9c.2-1.9,1.1-3.6,2.9-4.3,1.3-.5,2.8-.4,4.2-.1C9.1,3,12.7,1.1,16.5.3s8.8-.2,12.5,2.1,4.7,4.3,5.3,7.5.2,2.1.1,3.2c-.2,2.1-1.2,3.7-3.2,4.4-1.2.4-2.6.3-3.9,0-1.1,2-2.8,3.5-4.8,4.6ZM28.5,10.1c.2,1.5.2,3-.1,4.4.6,0,1.3.1,2,0,.4-.1.6-.4.8-.7.4-1,.3-2.5,0-3.5-.7-3.5-3.8-5.7-7.1-6.6s-5.3-.7-7.8,0-2.3.8-3.4,1.4c-1,.6-1.9,1.4-2.6,2.4l2.8,1.1,4,1.8,2.4-1.6,1.7-1c1.2-.6,2.5-1.2,3.9-1.1s2.2.7,2.8,1.7.5,1.2.6,1.9ZM24.2,16.6l-2.9-1.1-3.9-1.7-2.6,1.7c-.7.5-1.5.9-2.2,1.2-1.1.5-2.3.9-3.6.7s-2.2-1.1-2.7-2.3-.6-4-.2-5.7c-.7,0-1.4-.1-2,0-.3.1-.5.3-.7.6-.4.9-.4,2.5-.2,3.5.5,2.5,2,4.3,4.2,5.6,3.9,2.2,9.5,2.3,13.5.3,1-.5,1.9-1.1,2.6-1.9l.7-.8ZM23.9,13.2l1.5.6c.2-1,.2-2.1.1-3.1s-.1-.6-.3-.9-.8-.2-1.3,0c-.5.2-1,.4-1.5.7l-2.2,1.3,3.6,1.5ZM10.4,14.2c1.3-.5,2.5-1.2,3.7-2l-3.5-1.5-1.5-.6c-.2,1-.2,2-.1,3.1s.1.6.3.9.8.2,1.2,0Z"/>
    </svg>
  );
}

export default function Header({ locale }: Props) {
  const t = useTranslations('nav');
  const { cart, openCart } = useCart();
  const itemCount = cart?.totalQuantity ?? 0;
  const otherLocale = locale === 'en' ? 'sv' : 'en';
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: `/${locale}/characters`, label: t('characters') },
    { href: `/${locale}/about`, label: t('about') },
    { href: `/${locale}/WILD_NETWORK`, label: 'Wild Network' },
  ];

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-30 px-6 py-5 flex items-center justify-between">
        {/* Glassmorphism pill */}
        <div className="absolute inset-0 mx-4 my-2 rounded-full bg-background/70 backdrop-blur-md border border-foreground/8 shadow-sm" />

        <div className="relative flex items-center gap-8 w-full">
          {/* Menu toggle — left side */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
            className="flex items-center justify-center p-1 opacity-90 hover:opacity-100 transition-opacity"
          >
            <MenuIcon />
          </button>

          {/* Right actions */}
          <div className="ml-auto flex items-center gap-4">
            {/* Locale switcher */}
            <Link
              href={`/${otherLocale}`}
              className="font-display text-xs uppercase tracking-widest text-foreground/40 hover:text-foreground/70 transition-colors"
            >
              {otherLocale}
            </Link>

            {/* Cart button */}
            <button
              onClick={openCart}
              className="relative flex items-center gap-2 font-display text-sm text-foreground/70 hover:text-foreground transition-colors"
              aria-label={t('cart')}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M1 1h3l2.68 13.39a2 2 0 001.99 1.61h8.72a2 2 0 001.97-1.67l1.38-7.33H4.24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="8.5" cy="17.5" r="1" fill="currentColor" />
                <circle cx="15.5" cy="17.5" r="1" fill="currentColor" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-primary rounded-full text-white text-[10px] font-bold flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen overlay menu */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-20 bg-background/95 backdrop-blur-md flex flex-col items-center justify-center gap-8"
          onClick={() => setMenuOpen(false)}
        >
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="font-display text-2xl text-foreground/70 hover:text-foreground transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
          <Link
            href={`/${otherLocale}`}
            className="font-display text-sm uppercase tracking-widest text-foreground/40 hover:text-foreground/70 transition-colors mt-4"
            onClick={() => setMenuOpen(false)}
          >
            {otherLocale}
          </Link>
        </div>
      )}
    </>
  );
}
