import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

const BASE_URL = 'https://aorus-gallery.vercel.app';

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  return {
    title: t('aboutTitle'),
    description: t('aboutDescription'),
    alternates: {
      languages: {
        en: `${BASE_URL}/en/about`,
        fr: `${BASE_URL}/fr/about`,
        zh: `${BASE_URL}/zh/about`,
      },
    },
    openGraph: {
      title: t('aboutTitle'),
      description: t('aboutDescription'),
      type: 'website',
      siteName: 'ORUS Gallery',
    },
  };
}

export default function AboutLayout({ children }: Props) {
  return children;
}
