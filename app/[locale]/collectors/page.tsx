import type { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { OG_LOCALE, generateAlternates } from '@/lib/seo';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'collectors' });
  return {
    title: `${t('title')} | ORUS Gallery`,
    description: t('metaDescription'),
    alternates: generateAlternates(locale, '/collectors'),
    openGraph: {
      title: `${t('title')} | ORUS Gallery`,
      description: t('metaDescription'),
      type: 'website',
      siteName: 'ORUS Gallery',
      locale: OG_LOCALE[locale],
      images: [{ url: '/images/gallery/logo.jpeg', width: 800, height: 800, alt: 'ORUS Gallery' }],
    },
    twitter: { card: 'summary_large_image' as const },
  };
}

export default async function CollectorsPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'collectors' });

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-blanc hero-offset min-h-[50vh] flex items-center">
        <div className="container-wide text-center max-w-4xl mx-auto">
          <p className="text-jade text-xs tracking-[0.25em] uppercase font-medium mb-6">
            {t('eyebrow')}
          </p>
          <h1 className="font-display text-4xl md:text-6xl text-noir tracking-wide leading-[1.1] mb-8">
            {t('title')}
          </h1>
          <div className="w-20 h-px bg-or mx-auto mb-10" />
          <p className="text-noir/70 text-lg leading-relaxed">
            {t('intro')}
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="bg-blanc-muted section-padding-lg">
        <div className="container-wide">
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <p className="text-or text-xs tracking-[0.25em] uppercase font-medium mb-4">01</p>
              <h2 className="font-display text-2xl text-noir tracking-wide mb-4">{t('advisory.title')}</h2>
              <p className="text-noir/60 text-sm leading-relaxed">{t('advisory.text')}</p>
            </div>
            <div>
              <p className="text-or text-xs tracking-[0.25em] uppercase font-medium mb-4">02</p>
              <h2 className="font-display text-2xl text-noir tracking-wide mb-4">{t('curation.title')}</h2>
              <p className="text-noir/60 text-sm leading-relaxed">{t('curation.text')}</p>
            </div>
            <div>
              <p className="text-or text-xs tracking-[0.25em] uppercase font-medium mb-4">03</p>
              <h2 className="font-display text-2xl text-noir tracking-wide mb-4">{t('access.title')}</h2>
              <p className="text-noir/60 text-sm leading-relaxed">{t('access.text')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Approach */}
      <section className="bg-blanc section-padding-lg">
        <div className="container-wide max-w-3xl mx-auto text-center">
          <p className="text-jade text-xs tracking-[0.25em] uppercase font-medium mb-6">{t('approach.eyebrow')}</p>
          <h2 className="font-display text-3xl md:text-4xl text-noir tracking-wide mb-10">{t('approach.title')}</h2>
          <div className="divider-gold-wide mx-auto mb-10" />
          <p className="text-noir/70 text-base leading-relaxed mb-6">{t('approach.text1')}</p>
          <p className="text-noir/60 text-base leading-relaxed">{t('approach.text2')}</p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-noir section-padding-lg">
        <div className="container-wide text-center">
          <h2 className="font-display text-3xl md:text-4xl text-blanc tracking-wide mb-8">
            {t('cta.title')}
          </h2>
          <p className="text-blanc/70 text-base leading-relaxed max-w-2xl mx-auto mb-10">
            {t('cta.text')}
          </p>
          <Link
            href={`/${locale}/contact`}
            className="inline-flex items-center gap-2 px-8 py-3 bg-or text-noir text-sm font-medium tracking-[0.1em] uppercase hover:bg-or/90 transition-colors"
          >
            {t('cta.button')}
          </Link>
        </div>
      </section>
    </div>
  );
}
