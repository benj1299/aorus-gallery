import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PageHero } from '@/components/PageHero';
import { OG_LOCALE, generateAlternates } from '@/lib/seo';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'legal' });
  return {
    title: `${t('termsTitle')} | ORUS Gallery`,
    description: t('termsIntro'),
    alternates: generateAlternates(locale, '/terms'),
    openGraph: {
      title: `${t('termsTitle')} | ORUS Gallery`,
      description: t('termsIntro'),
      type: 'website',
      siteName: 'ORUS Gallery',
      locale: OG_LOCALE[locale],
      images: [{ url: '/images/gallery/logo.jpeg', width: 800, height: 800, alt: 'ORUS Gallery' }],
    },
    twitter: { card: 'summary_large_image' as const },
  };
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'legal' });

  return (
    <div className="flex flex-col">
      <PageHero title={t('termsTitle')} />
      <section className="section-padding">
        <div className="container-narrow">
          <div className="prose prose-lg text-noir/70 max-w-none space-y-8">
            <p>{t('termsIntro')}</p>
            <h2 className="font-display text-2xl text-noir tracking-wide">{t('intellectualProperty')}</h2>
            <p>{t('intellectualPropertyText')}</p>
            <h2 className="font-display text-2xl text-noir tracking-wide">{t('siteUse')}</h2>
            <p>{t('siteUseText')}</p>
            <h2 className="font-display text-2xl text-noir tracking-wide">{t('liability')}</h2>
            <p>{t('liabilityText')}</p>
            <h2 className="font-display text-2xl text-noir tracking-wide">{t('governingLaw')}</h2>
            <p>{t('governingLawText')}</p>
            <h2 className="font-display text-2xl text-noir tracking-wide">{t('contact')}</h2>
            <p>{t('contactText')}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
