import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Syne, DM_Sans, Playfair_Display, Trykker, Bebas_Neue, Cormorant_Garamond } from 'next/font/google';
import type { Metadata } from 'next';
import Script from 'next/script';
import { GoogleTagManager } from '@next/third-parties/google';
import { routing } from '@/i18n/routing';
import { CartProvider } from '@/components/shop/CartContext';
import Header from '@/components/layout/HeaderClient';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/shop/CartDrawer';
import NavigationLoader from '@/components/layout/NavigationLoader';
import CookieBanner from '@/components/consent/CookieBanner';
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
    icon: '/icon.png',
    shortcut: '/icon.png',
  },
  description: 'Infinity Puzzle Wild — 19 handcrafted wooden characters with endless formations. No right answer. Just creativity, flow, and play.',
  metadataBase: new URL('https://infinity-puzzle.com'),
  openGraph: {
    siteName: 'Infinity Puzzles',
    type: 'website',
    images: [
      {
        url: '/images/hero/og-image.jpg',
        width: 1200,
        height: 630,
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
      {/* Consent Mode v2 — must run BEFORE GTM */}
      <Script id="consent-default" strategy="beforeInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            analytics_storage: 'denied',
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            functionality_storage: 'denied',
            security_storage: 'granted',
            wait_for_update: 500
          });
        `}
      </Script>
      <GoogleTagManager gtmId="GTM-T5MWRQBH" />
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/mnz1cmc.css" />
      </head>
      <body className="bg-background text-foreground antialiased">
        <NextIntlClientProvider messages={messages}>
          <CartProvider>
            <NavigationLoader />
            <Header locale={locale} />
            <main>{children}</main>
            <Footer />
            <CartDrawer />
            <CookieBanner locale={locale} />
          </CartProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
