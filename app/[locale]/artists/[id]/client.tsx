'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { AnimatedSection } from '@/components/AnimatedSection';
import { CTAStrip } from '@/components/CTAStrip';
import { AdaptiveImage } from '@/components/ui/adaptive-image';

interface Artwork {
  id: string;
  slug: string;
  title: string;
  medium: string | null;
  dimensions: string | null;
  imageUrl: string;
  showPrice: boolean;
  price: number | null;
  currency: string;
}

interface Artist {
  id: string;
  name: string;
  nationality: string;
  bio: string;
  image: string;
  cv: {
    soloShows: string[];
    groupShows: string[];
    artFairs: string[];
    residencies: string[];
    awards: string[];
    collections: string[];
  };
  artworks: Artwork[];
}

const cvSectionKeys = [
  'soloShows',
  'groupShows',
  'artFairs',
  'residencies',
  'awards',
  'collections',
] as const;

export function ArtistDetailClient({ artist }: { artist: Artist }) {
  const t = useTranslations('artist');

  const cvSections = cvSectionKeys
    .map((key) => ({ key, label: t(key), items: artist.cv[key] }))
    .filter((s) => s.items.length > 0);

  return (
    <div className="flex flex-col">
      {/* ── Section 1: Hero Cover ── */}
      <section className="bg-blanc min-h-[70vh] flex flex-col">
        {/* Back link */}
        <div className="px-edge pt-28 md:pt-32 lg:pt-36">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/artists"
              className="text-noir/60 hover:text-noir transition-colors duration-300 text-sm tracking-[0.1em] uppercase inline-flex items-center gap-2 group"
            >
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
              {t('backToArtists')}
            </Link>
          </motion.div>
        </div>

        {/* Hero content */}
        <div className="flex-1 flex items-center px-edge pb-16 md:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="container-wide grid md:grid-cols-3 gap-12 md:gap-16 lg:gap-20 items-center w-full"
          >
            {/* Artist portrait */}
            <div className="md:col-span-1">
              <div className="aspect-[3/4] relative overflow-hidden">
                <Image
                  src={artist.image}
                  alt={artist.name}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
            </div>

            {/* Name + nationality */}
            <div className="md:col-span-2 flex flex-col justify-center">
              <h1 className="font-display text-5xl md:text-7xl text-noir tracking-wide leading-[1.05]">
                {artist.name}
              </h1>
              <div className="divider-gold-wide mt-8 mb-6" />
              <p className="text-jade text-sm tracking-[0.2em] uppercase font-medium">
                {artist.nationality}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Section 2: Biography ── */}
      <AnimatedSection
        bg="blanc-muted"
        container={false}
        className="py-24 md:py-32"
        initial={{ opacity: 0, y: 40 }}
        transition={{ duration: 1 }}
        viewportMargin="-100px"
      >
        <div className="max-w-3xl mx-auto px-6">
          <div className="divider-gold-wide mx-auto mb-10" />
          <p className="text-jade text-xs tracking-[0.25em] uppercase font-medium text-center mb-10">
            {t('bio', { defaultValue: 'Biography' })}
          </p>
          <div
            className="text-noir/70 text-lg leading-loose font-body"
            dangerouslySetInnerHTML={{ __html: artist.bio }}
          />
          <div className="divider-gold-wide mx-auto mt-10" />
        </div>
      </AnimatedSection>

      {/* ── Section 3: Selected Works ── */}
      <AnimatedSection
        bg="blanc"
        container="wide"
        className="py-24 md:py-32"
        initial={{ opacity: 0, y: 40 }}
        transition={{ duration: 1 }}
        viewportMargin="-100px"
      >
        <div className="text-center mb-16 md:mb-20">
          <p className="text-jade text-xs tracking-[0.25em] uppercase font-medium mb-4">
            {t('works')}
          </p>
          <h2 className="font-display text-3xl md:text-5xl text-noir tracking-wide">
            {t('selectedWorks')}
          </h2>
        </div>

        {artist.artworks.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
            {artist.artworks.map((artwork, index) => (
              <motion.div
                key={artwork.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
              >
                <Link href={`/artworks/${artwork.slug}`} className="group block">
                  <div className="aspect-[3/4] relative overflow-hidden bg-blanc-muted">
                    <AdaptiveImage
                      src={artwork.imageUrl}
                      alt={artwork.title}
                      sizes="(max-width: 768px) 50vw, 33vw"
                      className="transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-4">
                    <p className="font-display text-base md:text-lg text-noir tracking-wide group-hover:text-jade transition-colors duration-300">
                      {artwork.title}
                    </p>
                    {artwork.medium && (
                      <p className="text-noir/50 text-xs mt-1.5 leading-relaxed">
                        {artwork.medium}
                      </p>
                    )}
                    {artwork.dimensions && (
                      <p className="text-noir/40 text-xs mt-0.5">
                        {artwork.dimensions}
                      </p>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-noir/50 text-sm tracking-[0.1em] uppercase">
              {t('works')} — {t('comingSoon', { defaultValue: 'Coming soon' })}
            </p>
          </div>
        )}
      </AnimatedSection>

      {/* ── Section 4: Curriculum Vitae ── */}
      {cvSections.length > 0 && (
        <AnimatedSection
          bg="blanc-muted"
          container="wide"
          className="py-24 md:py-32"
          initial={{ opacity: 0, y: 40 }}
          transition={{ duration: 1 }}
          viewportMargin="-100px"
        >
          <div className="text-center mb-16 md:mb-20">
            <p className="text-jade text-xs tracking-[0.25em] uppercase font-medium mb-4">
              {t('cv')}
            </p>
            <h2 className="font-display text-3xl md:text-5xl text-noir tracking-wide">
              {t('career')}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12 md:gap-16">
            {cvSections.map((section) => (
              <div key={section.key}>
                <h3 className="font-display text-xl md:text-2xl text-jade tracking-wide mb-6">
                  {section.label}
                </h3>
                <div className="divider-gold mb-6" />
                <ul className="space-y-3">
                  {section.items.map((item, i) => (
                    <li key={i} className="text-noir/60 text-sm leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </AnimatedSection>
      )}

      {/* ── Section 5: Inquire CTA ── */}
      <CTAStrip
        title={t('inquire')}
        primaryLink={{ href: '/contact', label: t('contactUs') }}
      />
    </div>
  );
}
