import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('footer');
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-foreground/10 bg-background px-6 py-12">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <img src="/images/SVG/infinity-puzzles-logo (1).svg" alt="Infinity Puzzles" style={{ width: '120px', height: 'auto' }} />
          <p className="font-body text-sm text-foreground/40 mt-1">{t('tagline')}</p>
        </div>

        <nav className="flex items-center gap-6">
          <a href="#" className="font-body text-sm text-foreground/40 hover:text-foreground/70 transition-colors">
            {t('links.privacy')}
          </a>
          <a href="#" className="font-body text-sm text-foreground/40 hover:text-foreground/70 transition-colors">
            {t('links.terms')}
          </a>
          <a href="mailto:hello@infinity-puzzle.com" className="font-body text-sm text-foreground/40 hover:text-foreground/70 transition-colors">
            {t('links.contact')}
          </a>
        </nav>

        <p className="font-body text-xs text-foreground/30">
          {t('copyright', { year })}
        </p>
      </div>
    </footer>
  );
}
