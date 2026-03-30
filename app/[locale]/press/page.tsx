import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getPressArticles } from '@/lib/queries/press';
import { PressPageClient } from './client';
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
    title: t('pressTitle'),
    description: t('pressDescription'),
    alternates: {
      languages: {
        en: `${BASE_URL}/en/press`,
        fr: `${BASE_URL}/fr/press`,
        zh: `${BASE_URL}/zh/press`,
      },
    },
    openGraph: {
      title: t('pressTitle'),
      description: t('pressDescription'),
      type: 'website',
      siteName: 'ORUS Gallery',
    },
  };
}

export default async function PressPage({ params }: Props) {
  const { locale } = await params;
  const articles = await getPressArticles(locale as Locale);
  return <PressPageClient articles={articles} />;
}
