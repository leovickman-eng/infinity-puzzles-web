'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

export default function Footer() {
  const t = useTranslations('footer');
  const year = new Date().getFullYear();
  const params = useParams();
  const locale = (params?.locale as string) ?? 'en';

  return (
    <footer style={{ background: '#242028', borderTop: '1px solid rgba(255,255,255,0.08)' }} className="px-6 py-12">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <img src="/images/SVG/infinity-puzzles-logo (1).svg" alt="Infinity Puzzles" style={{ width: '120px', height: 'auto', filter: 'brightness(0) invert(1)' }} />
          <p className="font-body text-sm mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>{t('tagline')}</p>
        </div>

        <nav className="flex items-center gap-6 flex-wrap justify-center">
          <a href={`/${locale}/privacy`} className="font-body text-sm transition-colors" style={{ color: 'rgba(255,255,255,0.35)' }}>
            {t('links.privacy')}
          </a>
          <a href={`/${locale}/terms`} className="font-body text-sm transition-colors" style={{ color: 'rgba(255,255,255,0.35)' }}>
            {t('links.terms')}
          </a>
          <button
            onClick={() => window.dispatchEvent(new Event('open-cookie-settings'))}
            className="font-body text-sm transition-colors bg-transparent border-none p-0 cursor-pointer"
            style={{ color: 'rgba(255,255,255,0.35)' }}
          >
            {t('links.cookies')}
          </button>
          <a href="mailto:hello@infinity-puzzle.com" className="font-body text-sm transition-colors" style={{ color: 'rgba(255,255,255,0.35)' }}>
            {t('links.contact')}
          </a>
        </nav>

        <p className="font-body text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
          {t('copyright', { year })}
        </p>
      </div>
    </footer>
  );
}
