import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { OG_LOCALE, generateAlternates } from '@/lib/seo';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pressKit' });
  return {
    title: `${t('title')} | ORUS Gallery`,
    description: t('metaDescription'),
    alternates: generateAlternates(locale, '/press-kit'),
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

export default async function PressKitPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pressKit' });

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-blanc hero-offset min-h-[40vh] flex items-center">
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

      {/* About */}
      <section className="bg-blanc-muted section-padding-lg">
        <div className="container-wide max-w-3xl mx-auto">
          <p className="text-jade text-xs tracking-[0.25em] uppercase font-medium mb-6 text-center">
            {t('about.eyebrow')}
          </p>
          <h2 className="font-display text-3xl md:text-4xl text-noir tracking-wide mb-10 text-center">
            {t('about.title')}
          </h2>
          <div className="divider-gold-wide mx-auto mb-10" />
          <p className="text-noir/70 text-base leading-relaxed mb-6">{t('about.text1')}</p>
          <p className="text-noir/60 text-base leading-relaxed mb-6">{t('about.text2')}</p>
          <p className="text-noir/60 text-base leading-relaxed">{t('about.text3')}</p>
        </div>
      </section>

      {/* Key facts */}
      <section className="bg-blanc section-padding-lg">
        <div className="container-wide">
          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <p className="font-display text-4xl text-or tracking-wide mb-3">2024</p>
              <p className="text-noir/60 text-xs tracking-[0.15em] uppercase">{t('facts.founded')}</p>
            </div>
            <div className="text-center">
              <p className="font-display text-4xl text-or tracking-wide mb-3">2</p>
              <p className="text-noir/60 text-xs tracking-[0.15em] uppercase">{t('facts.locations')}</p>
            </div>
            <div className="text-center">
              <p className="font-display text-4xl text-or tracking-wide mb-3">17</p>
              <p className="text-noir/60 text-xs tracking-[0.15em] uppercase">{t('facts.artists')}</p>
            </div>
            <div className="text-center">
              <p className="font-display text-4xl text-or tracking-wide mb-3">3</p>
              <p className="text-noir/60 text-xs tracking-[0.15em] uppercase">{t('facts.continents')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Assets */}
      <section className="bg-blanc-muted section-padding-lg">
        <div className="container-wide max-w-4xl mx-auto">
          <p className="text-jade text-xs tracking-[0.25em] uppercase font-medium mb-6 text-center">
            {t('assets.eyebrow')}
          </p>
          <h2 className="font-display text-3xl md:text-4xl text-noir tracking-wide mb-12 text-center">
            {t('assets.title')}
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-blanc p-8 border border-noir/10">
              <div className="w-16 h-16 relative mb-6 mx-auto">
                <Image src="/images/gallery/logo.jpeg" alt="ORUS Gallery logo" fill className="object-contain" sizes="64px" />
              </div>
              <h3 className="font-display text-lg text-noir tracking-wide mb-3 text-center">{t('assets.logo.title')}</h3>
              <p className="text-noir/60 text-sm mb-4 text-center">{t('assets.logo.description')}</p>
              <div className="text-center">
                <a
                  href="/images/gallery/logo.jpeg"
                  download
                  className="inline-block text-xs tracking-[0.15em] uppercase text-jade hover:underline"
                >
                  {t('assets.download')}
                </a>
              </div>
            </div>

            <div className="bg-blanc p-8 border border-noir/10">
              <h3 className="font-display text-lg text-noir tracking-wide mb-3 text-center">{t('assets.colors.title')}</h3>
              <p className="text-noir/60 text-sm mb-6 text-center">{t('assets.colors.description')}</p>
              <div className="flex gap-3 justify-center flex-wrap">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full" style={{ backgroundColor: '#0A0A0A' }} />
                  <p className="text-xs text-noir/50 mt-2">Noir</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full" style={{ backgroundColor: '#C9A962' }} />
                  <p className="text-xs text-noir/50 mt-2">Or</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full" style={{ backgroundColor: '#4A7C6F' }} />
                  <p className="text-xs text-noir/50 mt-2">Jade</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full border border-noir/10" style={{ backgroundColor: '#F5F0E8' }} />
                  <p className="text-xs text-noir/50 mt-2">Ivoire</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="bg-noir section-padding-lg">
        <div className="container-wide text-center">
          <p className="text-blanc/50 text-xs tracking-[0.25em] uppercase font-medium mb-6">
            {t('contact.eyebrow')}
          </p>
          <h2 className="font-display text-3xl md:text-4xl text-blanc tracking-wide mb-8">
            {t('contact.title')}
          </h2>
          <p className="text-blanc/70 text-base leading-relaxed max-w-2xl mx-auto mb-10">
            {t('contact.text')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:press@orusgallery.com"
              className="inline-flex items-center gap-2 px-8 py-3 bg-or text-noir text-sm font-medium tracking-[0.1em] uppercase hover:bg-or/90 transition-colors"
            >
              press@orusgallery.com
            </a>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-2 px-8 py-3 border border-blanc/30 text-blanc text-sm font-medium tracking-[0.1em] uppercase hover:bg-blanc/10 transition-colors"
            >
              {t('contact.button')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
