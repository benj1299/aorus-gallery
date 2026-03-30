import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PageHero } from '@/components/PageHero';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'legal' });
  return {
    title: `${t('privacyTitle')} | ORUS Gallery`,
    description: t('privacyIntro'),
  };
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'legal' });

  return (
    <div className="flex flex-col">
      <PageHero title={t('privacyTitle')} />
      <section className="section-padding">
        <div className="container-narrow">
          <div className="prose prose-lg text-noir/70 max-w-none space-y-8">
            <p>{t('privacyIntro')}</p>
            <h2 className="font-display text-2xl text-noir tracking-wide">{t('dataCollection')}</h2>
            <p>{t('dataCollectionText')}</p>
            <h2 className="font-display text-2xl text-noir tracking-wide">{t('dataUse')}</h2>
            <p>{t('dataUseText')}</p>
            <h2 className="font-display text-2xl text-noir tracking-wide">{t('dataRetention')}</h2>
            <p>{t('dataRetentionText')}</p>
            <h2 className="font-display text-2xl text-noir tracking-wide">{t('yourRights')}</h2>
            <p>{t('yourRightsText')}</p>
            <h2 className="font-display text-2xl text-noir tracking-wide">{t('contact')}</h2>
            <p>{t('contactText')}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
