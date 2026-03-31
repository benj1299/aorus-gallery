import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { OG_LOCALE, generateAlternates } from '@/lib/seo';

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
    alternates: generateAlternates(locale, '/contact'),
    openGraph: {
      title: t('contactTitle'),
      description: t('contactDescription'),
      type: 'website',
      siteName: 'ORUS Gallery',
      locale: OG_LOCALE[locale],
      images: [{ url: '/images/gallery/logo.jpeg', width: 800, height: 800, alt: 'ORUS Gallery' }],
    },
    twitter: { card: 'summary_large_image' as const },
  };
}

export default function ContactLayout({ children }: Props) {
  return children;
}
