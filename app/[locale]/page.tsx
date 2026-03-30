import { getFeaturedArtworks } from '@/lib/queries/artworks';
import { getArtistsForFrontend } from '@/lib/queries/artists';
import { getActiveBanner } from '@/lib/queries/banner';
import { HomePageClient } from './client';
import type { Locale } from '@/i18n/routing';

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const featuredArtworks = await getFeaturedArtworks(locale as Locale);
  const allArtists = await getArtistsForFrontend(locale as Locale);
  const featuredArtists = allArtists.slice(0, 4);
  const banner = await getActiveBanner(locale as Locale);

  return <HomePageClient featuredArtworks={featuredArtworks} featuredArtists={featuredArtists} banner={banner} />;
}
