import { useTranslations } from 'next-intl';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('about');
  return { title: t('title') };
}

export default function AboutPage() {
  const t = useTranslations('about');

  return (
    <div className="min-h-screen bg-background pt-32 pb-24 px-6">
      <div className="max-w-3xl mx-auto">
        <p className="font-body text-sm uppercase tracking-widest text-primary mb-6">
          Our story
        </p>
        <h1 className="font-display text-5xl md:text-6xl font-bold text-foreground leading-tight text-balance">
          {t('title')}
        </h1>
        <p className="font-display text-2xl text-foreground/40 mt-4 font-medium">
          {t('subtitle')}
        </p>

        <div className="mt-16 space-y-8">
          <p className="font-body text-lg text-foreground/70 leading-relaxed">
            {t('story')}
          </p>
          <p className="font-body text-lg text-foreground/70 leading-relaxed">
            {t('mission')}
          </p>
        </div>

        <div className="mt-16 pt-12 border-t border-foreground/10">
          <a
            href="mailto:hello@infinity-puzzle.com"
            className="
              inline-flex items-center gap-3
              font-display font-semibold text-foreground
              group
            "
          >
            {t('contact')}
            <svg
              width="20" height="20" viewBox="0 0 20 20" fill="none"
              className="transition-transform group-hover:translate-x-1"
            >
              <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
