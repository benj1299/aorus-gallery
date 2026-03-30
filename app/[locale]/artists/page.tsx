import { getArtistsForFrontend } from '@/lib/queries/artists';
import { ArtistsPageClient } from './client';
import type { Locale } from '@/i18n/routing';

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function ArtistsPage({ params }: Props) {
  const { locale } = await params;
  const artists = await getArtistsForFrontend(locale as Locale);
  return <ArtistsPageClient artists={artists} />;
}
