'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { getArtists } from '@/lib/artists-data';

const MEDIUMS = ['Painting', 'Mixed Media', 'Resin'] as const;
const REGIONS = ['Europe', 'Africa', 'Americas', 'Asia'] as const;

type Medium = (typeof MEDIUMS)[number];
type Region = (typeof REGIONS)[number];

const MEDIUM_KEYS: Record<Medium, 'mediumPainting' | 'mediumMixedMedia' | 'mediumResin'> = {
  'Painting': 'mediumPainting',
  'Mixed Media': 'mediumMixedMedia',
  'Resin': 'mediumResin',
};

const REGION_KEYS: Record<Region, 'regionEurope' | 'regionAfrica' | 'regionAmericas' | 'regionAsia'> = {
  'Europe': 'regionEurope',
  'Africa': 'regionAfrica',
  'Americas': 'regionAmericas',
  'Asia': 'regionAsia',
};

export default function ArtistsPage() {
  const t = useTranslations('artists');
  const [activeMedium, setActiveMedium] = useState<Medium | null>(null);
  const [activeRegion, setActiveRegion] = useState<Region | null>(null);

  const allArtists = getArtists();

  const visibleArtists = useMemo(() => {
    return allArtists.filter((artist) => {
      if (artist.contentStatus === 'coming-soon') return false;
      if (activeMedium && artist.medium !== activeMedium) return false;
      if (activeRegion && artist.region !== activeRegion) return false;
      return true;
    });
  }, [allArtists, activeMedium, activeRegion]);

  return (
    <div className="bg-paper min-h-screen">
      {/* Page Header */}
      <section className="hero-offset">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
          className="container-wide"
        >
          <h1 className="font-display text-ink mb-3">{t('title')}</h1>
          <p className="text-stone text-sm tracking-wide">{t('subtitle')}</p>
        </motion.div>
      </section>

      {/* Filters */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
        className="py-6 border-b border-hairline px-5 lg:px-16"
      >
        <div className="container-wide">
          <div className="flex flex-wrap gap-x-8 gap-y-4">
            {/* Medium filters */}
            <div className="flex items-center gap-x-5">
              <span className="text-micro">{t('filterMedium')}</span>
              <div className="flex gap-x-4">
                {MEDIUMS.map((medium) => (
                  <button
                    key={medium}
                    onClick={() =>
                      setActiveMedium(activeMedium === medium ? null : medium)
                    }
                    className="relative text-[12px] uppercase tracking-[0.12em] transition-colors duration-200"
                    style={{ color: activeMedium === medium ? '#0B0B0B' : '#6E6E6E' }}
                  >
                    {t(MEDIUM_KEYS[medium])}
                    {activeMedium === medium && (
                      <motion.span
                        layoutId="medium-underline"
                        className="absolute -bottom-0.5 left-0 right-0 h-px bg-jade"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px bg-hairline self-stretch" />

            {/* Region filters */}
            <div className="flex items-center gap-x-5">
              <span className="text-micro">{t('filterRegion')}</span>
              <div className="flex gap-x-4">
                {REGIONS.map((region) => (
                  <button
                    key={region}
                    onClick={() =>
                      setActiveRegion(activeRegion === region ? null : region)
                    }
                    className="relative text-[12px] uppercase tracking-[0.12em] transition-colors duration-200"
                    style={{ color: activeRegion === region ? '#0B0B0B' : '#6E6E6E' }}
                  >
                    {t(REGION_KEYS[region])}
                    {activeRegion === region && (
                      <motion.span
                        layoutId="region-underline"
                        className="absolute -bottom-0.5 left-0 right-0 h-px bg-jade"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Artists Grid */}
      <section className="py-12 md:py-16 px-5 lg:px-16">
        <div className="container-wide">
          <AnimatePresence mode="popLayout">
            {visibleArtists.length === 0 ? (
              <motion.p
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-stone text-sm tracking-wide py-16 text-center"
              >
                {t('noResults')}
              </motion.p>
            ) : (
              <motion.div
                key="grid"
                className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8"
              >
                {visibleArtists.map((artist, index) => (
                  <motion.div
                    key={artist.slug}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.04 * Math.min(index, 9),
                      ease: [0.2, 0.8, 0.2, 1],
                    }}
                    layout
                  >
                    <Link href={`/artists/${artist.slug}`} className="group block">
                      {/* Image — 4:5 aspect ratio */}
                      <div className="relative aspect-[4/5] overflow-hidden bg-white">
                        <Image
                          src={artist.image}
                          alt={artist.name}
                          fill
                          sizes="(max-width: 768px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                          style={{
                            transitionTimingFunction: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
                          }}
                        />

                        {/* "View profile →" on hover */}
                        <div
                          className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{
                            transitionTimingFunction: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
                          }}
                        >
                          <span className="text-[11px] uppercase tracking-[0.12em] text-paper bg-ink px-3 py-1.5">
                            {t('viewProfile')} →
                          </span>
                        </div>
                      </div>

                      {/* Artist Info */}
                      <div className="mt-3">
                        <p className="font-display text-ink text-base md:text-lg tracking-wide relative inline-block">
                          {artist.name}
                          <span
                            className="absolute -bottom-0.5 left-0 right-0 h-px bg-jade scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"
                            style={{
                              transitionTimingFunction: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
                            }}
                          />
                        </p>
                        {artist.location && (
                          <p className="text-stone text-xs tracking-wide mt-1 truncate">
                            {artist.location
                              .replace('Lives and works in ', '')
                              .replace('Lives and works between ', '')}
                          </p>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
