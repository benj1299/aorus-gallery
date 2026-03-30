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
    title: t('contactTitle'),
    description: t('contactDescription'),
    alternates: {
      languages: {
        en: `${BASE_URL}/en/contact`,
        fr: `${BASE_URL}/fr/contact`,
        zh: `${BASE_URL}/zh/contact`,
      },
    },
    openGraph: {
      title: t('contactTitle'),
      description: t('contactDescription'),
      type: 'website',
      siteName: 'ORUS Gallery',
    },
  };
}

export default function ContactLayout({ children }: Props) {
  return children;
}
