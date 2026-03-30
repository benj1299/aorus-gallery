'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { AnimatedSection } from '@/components/AnimatedSection';
import { CTAStrip } from '@/components/CTAStrip';

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

export function ArtistDetailClient({ artist }: { artist: Artist }) {
  const t = useTranslations('artist');

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-blanc hero-offset">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid md:grid-cols-3 gap-12 items-start"
          >
            <div className="md:col-span-1">
              <div className="aspect-[3/4] relative overflow-hidden">
                <Image src={artist.image} alt={artist.name} fill priority className="object-cover" />
              </div>
            </div>
            <div className="md:col-span-2">
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-noir mb-4 tracking-wide">
                {artist.name}
              </h1>
              <p className="text-or text-sm tracking-[0.15em] uppercase mb-8">{artist.nationality}</p>
              <div className="divider-gold mb-8" />
              <p className="text-noir/60 text-lg leading-relaxed">{artist.bio}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Selected Works Section */}
      <AnimatedSection
        bg="blanc-muted"
        initial={{ opacity: 0, y: 40 }}
        transition={{ duration: 1 }}
        viewportMargin="-100px"
      >
        <div className="text-center mb-16">
          <p className="text-or text-sm tracking-[0.2em] uppercase font-medium mb-4">{t('works')}</p>
          <h2 className="font-display text-3xl md:text-4xl text-noir tracking-wide">{t('selectedWorks')}</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {artist.artworks.length > 0 ? (
            artist.artworks.map((artwork, index) => (
              <motion.div
                key={artwork.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                className="group"
              >
                <div className="aspect-square relative overflow-hidden border border-noir/10">
                  <Image
                    src={artwork.imageUrl}
                    alt={artwork.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-noir/0 group-hover:bg-noir/40 transition-colors duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Link
                      href="/contact"
                      className="bg-blanc text-noir text-xs tracking-[0.15em] uppercase px-6 py-3 hover:bg-or hover:text-blanc transition-colors duration-300"
                    >
                      {t('inquireButton')}
                    </Link>
                  </div>
                </div>
                <div className="p-3 bg-blanc border-x border-b border-noir/10">
                  <p className="text-noir/50 text-xs tracking-[0.1em] uppercase">{artwork.title}</p>
                  {artwork.medium && (
                    <p className="text-noir/50 text-xs mt-1">{artwork.medium}</p>
                  )}
                  {artwork.dimensions && (
                    <p className="text-noir/50 text-xs mt-0.5">{artwork.dimensions}</p>
                  )}
                  {artwork.showPrice && artwork.price ? (
                    <p className="text-noir/70 text-sm mt-1">
                      {new Intl.NumberFormat('en', { style: 'currency', currency: artwork.currency }).format(artwork.price)}
                    </p>
                  ) : (
                    <p className="text-noir/40 text-xs italic mt-1">{t('priceOnRequest')}</p>
                  )}
                  <Link
                    href="/contact"
                    className="text-jade text-xs tracking-[0.1em] uppercase mt-2 inline-block hover:underline"
                  >
                    {t('inquireButton')}
                  </Link>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <p className="text-noir/50 text-sm tracking-[0.1em] uppercase">{t('works')} — {t('comingSoon', { defaultValue: 'Coming soon' })}</p>
            </div>
          )}
        </div>
      </AnimatedSection>

      {/* CV Section */}
      <AnimatedSection
        container="narrow"
        initial={{ opacity: 0, y: 40 }}
        transition={{ duration: 1 }}
        viewportMargin="-100px"
      >
        <div className="text-center mb-16">
          <p className="text-or text-sm tracking-[0.2em] uppercase font-medium mb-4">{t('cv')}</p>
          <h2 className="title-section text-noir">{t('career')}</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-12">
          {[
            { key: 'soloShows', label: t('soloShows'), items: artist.cv.soloShows },
            { key: 'groupShows', label: t('groupShows'), items: artist.cv.groupShows },
            { key: 'artFairs', label: t('artFairs'), items: artist.cv.artFairs },
            { key: 'residencies', label: t('residencies'), items: artist.cv.residencies },
            { key: 'awards', label: t('awards'), items: artist.cv.awards },
            { key: 'collections', label: t('collections'), items: artist.cv.collections },
          ]
            .filter((s) => s.items.length > 0)
            .map((section) => (
              <div key={section.key}>
                <h3 className="font-display text-xl mb-6 tracking-wide text-jade">
                  {section.label}
                </h3>
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

      {/* Inquire CTA */}
      <CTAStrip
        title={t('inquire')}
        primaryLink={{ href: '/contact', label: t('contactUs') }}
      />
    </div>
  );
}
