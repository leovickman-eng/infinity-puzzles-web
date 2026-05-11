'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useCart } from '@/components/shop/CartContext';

type Props = {
  locale: string;
};

export default function Header({ locale }: Props) {
  const t = useTranslations('nav');
  const { cart, openCart } = useCart();
  const itemCount = cart?.totalQuantity ?? 0;
  const otherLocale = locale === 'en' ? 'sv' : 'en';

  return (
    <header className="fixed top-0 inset-x-0 z-30 px-6 py-5 flex items-center justify-between">
      {/* Glassmorphism pill */}
      <div className="absolute inset-0 mx-4 my-2 rounded-full bg-background/70 backdrop-blur-md border border-foreground/8 shadow-sm" />

      <div className="relative flex items-center gap-8 w-full">
        {/* Logo */}
        <Link href={`/${locale}`} className="font-display font-bold text-lg text-foreground tracking-tight">
          ∞ Infinity
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-6 ml-4">
          <Link href={`/${locale}/characters`} className="font-body text-sm text-foreground/60 hover:text-foreground transition-colors">
            {t('characters')}
          </Link>
          <Link href={`/${locale}/about`} className="font-body text-sm text-foreground/60 hover:text-foreground transition-colors">
            {t('about')}
          </Link>
        </nav>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-4">
          {/* Locale switcher */}
          <Link
            href={`/${otherLocale}`}
            className="font-body text-xs uppercase tracking-widest text-foreground/40 hover:text-foreground/70 transition-colors"
          >
            {otherLocale}
          </Link>

          {/* Cart button */}
          <button
            onClick={openCart}
            className="relative flex items-center gap-2 font-body text-sm text-foreground/70 hover:text-foreground transition-colors"
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
  );
}
