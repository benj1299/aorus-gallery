import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getGalleryExhibitions } from '@/lib/queries/exhibitions';
import { ExhibitionsPageClient } from './client';
import type { Locale } from '@/i18n/routing';

const BASE_URL = 'https://aorus-gallery.vercel.app';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  return {
    title: t('exhibitionsTitle'),
    description: t('exhibitionsDescription'),
    alternates: {
      languages: {
        en: `${BASE_URL}/en/exhibitions`,
        fr: `${BASE_URL}/fr/exhibitions`,
        zh: `${BASE_URL}/zh/exhibitions`,
      },
    },
    openGraph: {
      title: t('exhibitionsTitle'),
      description: t('exhibitionsDescription'),
      type: 'website',
      siteName: 'ORUS Gallery',
    },
  };
}

export default async function ExhibitionsPage({ params }: Props) {
  const { locale } = await params;
  const exhibitions = await getGalleryExhibitions(locale);
  return <ExhibitionsPageClient exhibitions={exhibitions} locale={locale} />;
}
