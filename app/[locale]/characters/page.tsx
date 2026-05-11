import { useTranslations } from 'next-intl';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import CharacterCard from '@/components/character-card/CharacterCard';
import type { Character } from '@/components/character-card/CharacterCard';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('characters_page');
  return { title: t('title') };
}

const CHARACTER_COLORS = [
  '#FF6B35', '#7B2FBE', '#0EC7B4', '#FFD23F', '#FF4B8B',
  '#4BBAFF', '#FF8C42', '#A8EB12', '#F7B731', '#2BCADD',
  '#FF6B6B', '#845EC2', '#00C9A7', '#FFC75F', '#F9F871',
  '#D65DB1', '#FF9671', '#4FFBDF', '#FF8066',
];

const CHARACTER_NAMES = [
  'The Wanderer', 'The Dreamer', 'The Explorer', 'The Keeper',
  'The Rebel', 'The Sage', 'The Trickster', 'The Guardian',
  'The Artist', 'The Oracle', 'The Shadow', 'The Radiant',
  'The Ancient', 'The Spark', 'The Tide', 'The Storm',
  'The Still', 'The Echo', 'The Bloom',
];

const ALL_CHARACTERS: Character[] = Array.from({ length: 19 }, (_, i) => ({
  id: i + 1,
  name: CHARACTER_NAMES[i],
  description: '',
  color: CHARACTER_COLORS[i],
  imageUrl: `https://res.cloudinary.com/dk3ftfygx/image/upload/v1776889732/infinitypuzzles/karaktarer/karaktar_${i + 1}.png`,
}));

export default function CharactersPage() {
  const t = useTranslations('characters_page');

  return (
    <div className="min-h-screen bg-background pt-32 pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <p className="font-body text-sm uppercase tracking-widest text-primary mb-4">Wild Collection</p>
          <h1 className="font-display text-5xl md:text-7xl font-bold text-foreground leading-tight text-balance">
            {t('title')}
          </h1>
          <p className="font-body text-lg text-foreground/50 mt-6 max-w-xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        {/* Grid of all 19 characters */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-12 justify-items-center">
          {ALL_CHARACTERS.map((char) => (
            <CharacterCard key={char.id} character={char} size="md" />
          ))}
        </div>
      </div>
    </div>
  );
}
