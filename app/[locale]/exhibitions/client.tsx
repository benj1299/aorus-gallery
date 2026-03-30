'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { PageHero } from '@/components/PageHero';
import { AnimatedSection } from '@/components/AnimatedSection';
import { CTAStrip } from '@/components/CTAStrip';

interface Exhibition {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  type: string;
  status: string;
  startDate: string | null;
  endDate: string | null;
  location: string | null;
  imageUrl: string | null;
  artists: { name: string; slug: string }[];
}

type TabKey = 'EXHIBITION' | 'ART_FAIR' | 'OFFSITE';

const LOCALE_MAP: Record<string, string> = {
  fr: 'fr-FR',
  en: 'en-US',
  zh: 'zh-TW',
};

function formatDateRange(startDate: string | null, endDate: string | null, locale: string): string {
  if (!startDate) return '';
  const intlLocale = LOCALE_MAP[locale] || locale;
  const start = new Date(startDate);
  const opts: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  if (!endDate) return start.toLocaleDateString(intlLocale, opts);
  const end = new Date(endDate);
  return `${start.toLocaleDateString(intlLocale, opts)} — ${end.toLocaleDateString(intlLocale, opts)}`;
}

export function ExhibitionsPageClient({ exhibitions, locale }: { exhibitions: Exhibition[]; locale: string }) {
  const t = useTranslations('exhibitions');
  const tNav = useTranslations('nav');
  const [activeTab, setActiveTab] = useState<TabKey>('EXHIBITION');

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'EXHIBITION', label: t('types.exhibition') },
    { key: 'ART_FAIR', label: t('types.art_fair') },
    { key: 'OFFSITE', label: t('types.offsite') },
  ];

  const filteredExhibitions = exhibitions.filter((ex) => ex.type === activeTab);

  const statusGroups: { key: string; label: string; items: Exhibition[] }[] = [
    { key: 'CURRENT', label: t('status.current'), items: filteredExhibitions.filter((e) => e.status === 'CURRENT') },
    { key: 'UPCOMING', label: t('status.upcoming'), items: filteredExhibitions.filter((e) => e.status === 'UPCOMING') },
    { key: 'PAST', label: t('status.past'), items: filteredExhibitions.filter((e) => e.status === 'PAST') },
  ].filter((g) => g.items.length > 0);

  return (
    <div className="flex flex-col">
      <PageHero title={tNav('exhibitions')} />

      <AnimatedSection
        initial={{ opacity: 0, y: 40 }}
        transition={{ duration: 1 }}
        viewportMargin="-100px"
      >
        <div className="flex justify-center gap-6 mb-16">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`text-sm tracking-[0.15em] uppercase pb-2 border-b-2 transition-colors duration-300 ${
                activeTab === tab.key
                  ? 'border-or text-noir'
                  : 'border-transparent text-noir/40 hover:text-noir/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {statusGroups.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-noir/50 text-sm tracking-[0.1em] uppercase">{t('noExhibitions')}</p>
          </div>
        ) : (
          statusGroups.map((group) => (
            <div key={group.key} className="mb-16 last:mb-0">
              <h2 className="font-display text-2xl text-noir mb-8 tracking-wide">{group.label}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {group.items.map((exhibition) => (
                  <div key={exhibition.id} className="group">
                    {exhibition.imageUrl && (
                      <div className="aspect-[4/3] relative overflow-hidden mb-4">
                        <Image
                          src={exhibition.imageUrl}
                          alt={exhibition.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <h3 className="font-display text-lg text-noir tracking-wide mb-2">
                      {exhibition.title}
                    </h3>
                    {exhibition.artists.length > 0 && (
                      <p className="text-or text-sm tracking-[0.1em] uppercase mb-2">
                        {exhibition.artists.map((a) => a.name).join(', ')}
                      </p>
                    )}
                    {(exhibition.startDate || exhibition.location) && (
                      <p className="text-noir/50 text-sm">
                        {formatDateRange(exhibition.startDate, exhibition.endDate, locale)}
                        {exhibition.startDate && exhibition.location && ' — '}
                        {exhibition.location}
                      </p>
                    )}
                    {exhibition.description && (
                      <p className="text-noir/60 text-sm mt-3 leading-relaxed line-clamp-3">
                        {exhibition.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </AnimatedSection>

      <CTAStrip
        title={t('title')}
        primaryLink={{ href: '/contact', label: t('cta') }}
      />
    </div>
  );
}
