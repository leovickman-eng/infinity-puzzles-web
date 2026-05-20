import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('characters_page');
  return { title: t('title') };
}

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const result = [...arr];
  let s = seed;
  for (let i = result.length - 1; i > 0; i--) {
    s = (Math.imul(s, 1664525) + 1013904223) | 0;
    const j = Math.abs(s) % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

const CHARS = seededShuffle(
  Array.from({ length: 19 }, (_, i) => ({
    id: i + 1,
    src: `/images/characters/WILD_characters-${String(i + 1).padStart(2, '0')}.webp`,
    alt: `Character ${i + 1}`,
  })),
  42,
);

export default async function CharactersPage() {
  const t = await getTranslations('characters_page');

  return (
    <div className="min-h-screen bg-background pt-32 pb-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-20">
          <p className="font-display text-sm uppercase tracking-widest text-primary mb-4">Wild Collection</p>
          <h1 className="font-display text-5xl md:text-7xl font-bold text-foreground leading-tight text-balance">
            {t('title')}
          </h1>
          <p className="font-display text-lg text-foreground/50 mt-6 max-w-xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap">
        {CHARS.map((char) => (
          <img
            key={char.id}
            src={char.src}
            alt={char.alt}
            className="block h-auto w-1/3 md:w-1/5"
          />
        ))}
      </div>
    </div>
  );
}
