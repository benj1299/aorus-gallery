import { notFound } from 'next/navigation';
import { getArtistBySlugForFrontend } from '@/lib/queries/artists';
import { ArtistDetailClient } from './client';
import type { Locale } from '@/i18n/routing';

interface Props {
  params: Promise<{ id: string; locale: string }>;
}

export default async function ArtistPage({ params }: Props) {
  const { id, locale } = await params;
  const artist = await getArtistBySlugForFrontend(id, locale as Locale);

  if (!artist) notFound();

  return <ArtistDetailClient artist={artist} />;
}
