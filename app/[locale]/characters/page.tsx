import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import CharactersClient from './CharactersClient';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('characters_page');
  return { title: t('title') };
}

export default async function CharactersPage() {
  const t = await getTranslations('characters_page');
  return <CharactersClient title={t('title')} subtitle={t('subtitle')} />;
}
