import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getFeaturedArtworks } from '@/lib/queries/artworks';
import { getArtistsListForFrontend } from '@/lib/queries/artists';
import { getActiveBanner } from '@/lib/queries/banner';
import { getSiteSettings } from '@/lib/queries/settings';
import { HomePageClient } from './client';
import type { Locale } from '@/i18n/routing';
import { BASE_URL, OG_LOCALE, generateAlternates } from '@/lib/seo';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  return {
    title: t('title'),
    description: t('description'),
    alternates: generateAlternates(locale),
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website',
      siteName: 'ORUS Gallery',
      locale: OG_LOCALE[locale],
      images: [{ url: '/images/gallery/logo.jpeg', width: 800, height: 800, alt: 'ORUS Gallery' }],
    },
    twitter: { card: 'summary_large_image' as const },
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const featuredArtworks = await getFeaturedArtworks(locale as Locale);
  const allArtists = await getArtistsListForFrontend(locale as Locale);
  const featuredArtists = allArtists.slice(0, 4);
  const settings = await getSiteSettings();
  const banner = settings.showBanner ? await getActiveBanner(locale as Locale) : null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ArtGallery',
    name: 'ORUS Gallery',
    url: BASE_URL,
    description: 'Contemporary art gallery between Paris and Taipei',
    address: [
      { '@type': 'PostalAddress', addressLocality: 'Paris', addressCountry: 'FR' },
      { '@type': 'PostalAddress', addressLocality: 'Taipei', addressCountry: 'TW' },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomePageClient featuredArtworks={featuredArtworks} featuredArtists={featuredArtists} banner={banner} />
    </>
  );
}
