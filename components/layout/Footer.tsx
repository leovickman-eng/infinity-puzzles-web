import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('footer');
  const year = new Date().getFullYear();

  return (
    <footer style={{ background: '#0d0a12', borderTop: '1px solid rgba(255,255,255,0.08)' }} className="px-6 py-12">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <img src="/images/SVG/infinity-puzzles-logo (1).svg" alt="Infinity Puzzles" style={{ width: '120px', height: 'auto', filter: 'brightness(0) invert(1)' }} />
          <p className="font-body text-sm mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>{t('tagline')}</p>
        </div>

        <nav className="flex items-center gap-6">
          <a href="#" className="font-body text-sm transition-colors" style={{ color: 'rgba(255,255,255,0.35)' }}>
            {t('links.privacy')}
          </a>
          <a href="#" className="font-body text-sm transition-colors" style={{ color: 'rgba(255,255,255,0.35)' }}>
            {t('links.terms')}
          </a>
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
