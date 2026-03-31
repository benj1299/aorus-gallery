import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getFeaturedArtworks } from '@/lib/queries/artworks';
import { getArtistsForFrontend } from '@/lib/queries/artists';
import { getActiveBanner } from '@/lib/queries/banner';
import { getSiteSettings } from '@/lib/queries/settings';
import { HomePageClient } from './client';
import type { Locale } from '@/i18n/routing';

const BASE_URL = 'https://aorus-gallery.vercel.app';

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
    alternates: {
      languages: {
        en: `${BASE_URL}/en`,
        fr: `${BASE_URL}/fr`,
        zh: `${BASE_URL}/zh`,
      },
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website',
      siteName: 'ORUS Gallery',
    },
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const featuredArtworks = await getFeaturedArtworks(locale as Locale);
  const allArtists = await getArtistsForFrontend(locale as Locale);
  const featuredArtists = allArtists.slice(0, 4);
  const settings = await getSiteSettings();
  const banner = settings.showBanner ? await getActiveBanner(locale as Locale) : null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ArtGallery',
    name: 'ORUS Gallery',
    url: 'https://aorus-gallery.vercel.app',
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
