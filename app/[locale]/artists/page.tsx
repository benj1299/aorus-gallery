import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getArtistsForFrontend } from '@/lib/queries/artists';
import { ArtistsPageClient } from './client';
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
    title: t('artistsTitle'),
    description: t('artistsDescription'),
    alternates: {
      languages: {
        en: `${BASE_URL}/en/artists`,
        fr: `${BASE_URL}/fr/artists`,
        zh: `${BASE_URL}/zh/artists`,
      },
    },
    openGraph: {
      title: t('artistsTitle'),
      description: t('artistsDescription'),
      type: 'website',
      siteName: 'ORUS Gallery',
    },
  };
}

export default async function ArtistsPage({ params }: Props) {
  const { locale } = await params;
  const artists = await getArtistsForFrontend(locale as Locale);
  return <ArtistsPageClient artists={artists} />;
}
