import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://www.infinity-puzzle.com/en', lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: 'https://www.infinity-puzzle.com/sv', lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: 'https://www.infinity-puzzle.com/en/characters', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://www.infinity-puzzle.com/sv/characters', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
  ];
}
