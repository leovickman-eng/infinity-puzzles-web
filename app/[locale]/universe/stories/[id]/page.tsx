import type { Metadata } from 'next';
import CharacterPageClient from './CharacterPageClient';

const CHARACTER_NAMES: Record<number, string> = {
  1: 'Dolores', 2: 'Zuki', 3: 'Mani', 4: 'Ziggy-Lou', 5: 'Lana',
  6: 'Tanya', 7: 'Mambo Viento', 8: 'Dali', 9: 'Pinto', 10: 'Sixten',
  11: 'Coco', 12: 'Mona Moon', 13: 'Borro', 14: 'Pepe', 15: 'Ronda',
  16: 'Rumi', 17: 'Daffy Giraffy', 18: 'Jerry', 19: 'Silvana',
};

export async function generateMetadata(
  { params }: { params: Promise<{ id: string; locale: string }> }
): Promise<Metadata> {
  const { id, locale } = await params;
  const numId = Number(id);
  const name  = CHARACTER_NAMES[numId] ?? 'Character';
  const title = `Infinity Puzzle WILD – ${name}`;
  const imageUrl = `https://www.infinity-puzzle.com/images/character-png/${numId}.webp`;
  const description = locale === 'sv'
    ? `Möt ${name} — en av de 19 karaktärerna i Infinity Puzzle WILD.`
    : `Meet ${name} — one of the 19 characters in Infinity Puzzle WILD.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://www.infinity-puzzle.com/${locale}/universe/stories/${id}`,
      images: [{ url: imageUrl, width: 800, height: 800, alt: name }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default function CharacterPage() {
  return <CharacterPageClient />;
}
