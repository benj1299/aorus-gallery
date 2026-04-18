'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import { AnimatedSection } from '@/components/AnimatedSection';
import { CTAStrip } from '@/components/CTAStrip';
import { AdaptiveImage } from '@/components/ui/adaptive-image';

interface Artwork {
  id: string;
  slug: string;
  title: string;
  medium: string | null;
  dimensions: string | null;
  year: number | null;
  imageUrl: string;
  artistName: string;
  artistSlug: string;
}

interface Artist {
  name: string;
  slug: string;
  imageUrl: string;
}

interface ExhibitionData {
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
  artists: Artist[];
  artworks: Artwork[];
}

export function ExhibitionDetailClient({ exhibition }: { exhibition: ExhibitionData }) {
  const t = useTranslations('exhibitions');
  const locale = useLocale();

  const formatDate = (iso: string | null) => {
    if (!iso) return '';
    return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso));
  };

  const dateRange = exhibition.startDate && exhibition.endDate
    ? `${formatDate(exhibition.startDate)} — ${formatDate(exhibition.endDate)}`
    : exhibition.startDate
    ? formatDate(exhibition.startDate)
    : '';

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-blanc hero-offset">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <Link
              href="/exhibitions"
              className="text-noir/60 hover:text-noir transition-colors duration-300 text-sm tracking-[0.1em] uppercase inline-flex items-center gap-2 group"
            >
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
              {t('title')}
            </Link>
          </motion.div>

          {/* Image + title */}
          {exhibition.imageUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="aspect-[16/9] relative overflow-hidden border border-noir/10 mb-12"
            >
              <AdaptiveImage src={exhibition.imageUrl} alt={exhibition.title} priority sizes="100vw" />
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-3xl"
          >
            <p className="text-jade text-xs tracking-[0.25em] uppercase font-medium mb-4">
              {t(`status.${exhibition.status.toLowerCase()}`)}
            </p>
            <h1 className="font-display text-4xl md:text-5xl text-noir tracking-wide leading-[1.1] mb-6">
              {exhibition.title}
            </h1>
            {dateRange && (
              <p className="text-noir/60 text-lg mb-4">{dateRange}</p>
            )}
            {exhibition.location && (
              <p className="text-noir/50 text-sm tracking-[0.1em] uppercase mb-10">{exhibition.location}</p>
            )}
            {exhibition.description && (
              <div
                className="text-noir/70 text-base leading-relaxed prose prose-noir max-w-none"
                dangerouslySetInnerHTML={{ __html: exhibition.description }}
              />
            )}
          </motion.div>
        </div>
      </section>

      {/* Artists */}
      {exhibition.artists.length > 0 && (
        <AnimatedSection bg="blanc-muted" container="wide" className="py-24" initial={{ opacity: 0, y: 40 }} transition={{ duration: 1 }} viewportMargin="-100px">
          <div className="text-center mb-16">
            <p className="text-jade text-xs tracking-[0.25em] uppercase font-medium mb-4">{t('artists')}</p>
            <h2 className="font-display text-3xl md:text-4xl text-noir tracking-wide">
              {exhibition.artists.length > 1 ? t('participatingArtists') : t('artist')}
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {exhibition.artists.map((artist, i) => (
              <motion.div
                key={artist.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
              >
                <Link href={`/artists/${artist.slug}`} className="group block">
                  <div className="aspect-[3/4] relative overflow-hidden bg-blanc">
                    <AdaptiveImage src={artist.imageUrl} alt={artist.name} sizes="(max-width: 768px) 50vw, 25vw" className="transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <p className="font-display text-base text-noir tracking-wide mt-4 group-hover:text-jade transition-colors">{artist.name}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>
      )}

      {/* Artworks */}
      {exhibition.artworks.length > 0 && (
        <AnimatedSection bg="blanc" container="wide" className="py-24" initial={{ opacity: 0, y: 40 }} transition={{ duration: 1 }} viewportMargin="-100px">
          <div className="text-center mb-16">
            <p className="text-jade text-xs tracking-[0.25em] uppercase font-medium mb-4">{t('works')}</p>
            <h2 className="font-display text-3xl md:text-4xl text-noir tracking-wide">{t('exhibitedWorks')}</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
            {exhibition.artworks.map((artwork, i) => (
              <motion.div
                key={artwork.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
              >
                <Link href={`/artworks/${artwork.slug}`} className="group block">
                  <div className="aspect-[3/4] relative overflow-hidden bg-blanc-muted">
                    <AdaptiveImage src={artwork.imageUrl} alt={artwork.title} sizes="(max-width: 768px) 50vw, 33vw" className="transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <div className="mt-4">
                    <p className="font-display text-base text-noir tracking-wide group-hover:text-jade transition-colors">{artwork.title}</p>
                    <p className="text-noir/50 text-xs mt-1">{artwork.artistName}</p>
                    {artwork.medium && <p className="text-noir/40 text-xs mt-0.5">{artwork.medium}</p>}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>
      )}

      <CTAStrip title={t('inquire')} primaryLink={{ href: '/contact', label: t('contactUs') }} />
    </div>
  );
}
