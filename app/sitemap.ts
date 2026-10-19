import { MetadataRoute } from 'next';

const BASE = 'https://www.infinity-puzzle.com';
const LOCALES = ['en', 'sv'];

const CHARACTER_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];

function urls(path: string, priority: number, changeFrequency: MetadataRoute.Sitemap[0]['changeFrequency']): MetadataRoute.Sitemap {
  return LOCALES.map(locale => ({
    url: `${BASE}/${locale}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const characterPages = CHARACTER_IDS.flatMap(id =>
    LOCALES.map(locale => ({
      url: `${BASE}/${locale}/universe/stories/${id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  );

  return [
    // Startsida
    ...urls('', 1.0, 'weekly'),
    // Universe
    ...urls('/universe', 0.9, 'monthly'),
    ...urls('/universe/stories', 0.9, 'monthly'),
    ...urls('/universe/ways-to-play', 0.7, 'monthly'),
    // Karaktärer
    ...urls('/characters', 0.8, 'monthly'),
    ...characterPages,
    // Övriga sidor
    ...urls('/journey', 0.7, 'monthly'),
    ...urls('/signup', 0.5, 'monthly'),
    ...urls('/privacy', 0.3, 'yearly'),
    ...urls('/terms', 0.3, 'yearly'),
  ];
}
