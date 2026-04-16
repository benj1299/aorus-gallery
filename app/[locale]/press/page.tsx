import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getPressArticles } from '@/lib/queries/press';
import { PressPageClient } from './client';
import type { Locale } from '@/i18n/routing';
import { OG_LOCALE, generateAlternates } from '@/lib/seo';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  return {
    title: t('pressTitle'),
    description: t('pressDescription'),
    alternates: generateAlternates(locale, '/press'),
    openGraph: {
      title: t('pressTitle'),
      description: t('pressDescription'),
      type: 'website',
      siteName: 'ORUS Gallery',
      locale: OG_LOCALE[locale],
      images: [{ url: '/images/gallery/logo.jpeg', width: 800, height: 800, alt: 'ORUS Gallery' }],
    },
    twitter: { card: 'summary_large_image' as const },
  };
}

export default async function PressPage({ params }: Props) {
  const { locale } = await params;
  const articles = await getPressArticles(locale as Locale);
  return <PressPageClient articles={articles} />;
}
