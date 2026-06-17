import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Syne, DM_Sans, Playfair_Display, Trykker, Bebas_Neue, Cormorant_Garamond } from 'next/font/google';
import type { Metadata } from 'next';
import { routing } from '@/i18n/routing';
import { CartProvider } from '@/components/shop/CartContext';
import Header from '@/components/layout/HeaderClient';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/shop/CartDrawer';
import '@/app/globals.css';

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600'],
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
});

const trykker = Trykker({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-trykker',
  display: 'swap',
});

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-bebas',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  title: {
    default: 'Infinity Puzzle Wild | Wooden Puzzle with 19 Characters',
    template: '%s | Infinity Puzzles',
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  description: 'Infinity Puzzle Wild — 19 handcrafted wooden characters with endless formations. No right answer. Just creativity, flow, and play.',
  metadataBase: new URL('https://infinity-puzzle.com'),
  openGraph: {
    siteName: 'Infinity Puzzles',
    type: 'website',
    images: [
      {
        url: '/images/hero/og-image.png',
        width: 1376,
        height: 768,
        alt: 'Infinity Puzzle Wild — 19 wooden characters',
      },
    ],
  },
  alternates: {
    canonical: 'https://infinity-puzzle.com/en',
    languages: {
      'en': 'https://infinity-puzzle.com/en',
      'sv': 'https://infinity-puzzle.com/sv',
    },
  },
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as 'en' | 'sv')) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className={`${syne.variable} ${dmSans.variable} ${playfair.variable} ${trykker.variable} ${bebasNeue.variable} ${cormorant.variable}`}>
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/mnz1cmc.css" />
      </head>
      <body className="bg-background text-foreground antialiased">
        <NextIntlClientProvider messages={messages}>
          <CartProvider>
            <Header locale={locale} />
            <main>{children}</main>
            <Footer />
            <CartDrawer />
          </CartProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
