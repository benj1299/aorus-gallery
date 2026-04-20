'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import { AnimatedSection } from '@/components/AnimatedSection';
import { CTAStrip } from '@/components/CTAStrip';
import { AdaptiveImage } from '@/components/ui/adaptive-image';
import { Lightbox } from '@/components/ui/lightbox';

interface ArtworkData {
  id: string;
  slug: string;
  title: string;
  medium: string | null;
  dimensions: string | null;
  year: number | null;
  price: number | null;
  currency: string;
  showPrice: boolean;
  sold: boolean;
  imageUrl: string;
  images: string[];
  artist: {
    id: string;
    name: string;
    slug: string;
  };
  prevArtwork: { slug: string; title: string } | null;
  nextArtwork: { slug: string; title: string } | null;
}

export function ArtworkDetailClient({ artwork }: { artwork: ArtworkData }) {
  const t = useTranslations('artwork');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const allImages = [
    { src: artwork.imageUrl, alt: artwork.title },
    ...artwork.images.map((img, i) => ({ src: img, alt: `${artwork.title} — ${i + 1}` })),
  ];

  const activeImage = allImages[activeIndex] ?? allImages[0];
  const hasMultiple = allImages.length > 1;

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }, []);

  return (
    <div className="flex flex-col">
      {/* Back navigation */}
      <section className="bg-blanc hero-offset">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <Link
              href={`/artists/${artwork.artist.slug}`}
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
              {artwork.artist.name}
            </Link>
          </motion.div>

          {/* Main artwork image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-[70vh] md:h-[78vh] relative overflow-hidden bg-blanc-muted border border-noir/10 cursor-zoom-in"
            onClick={() => openLightbox(activeIndex)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') openLightbox(activeIndex); }}
            aria-label={t('viewFullscreen', { defaultValue: 'View fullscreen' })}
            data-testid="artwork-main-image"
          >
            <AdaptiveImage
              key={activeImage.src}
              src={activeImage.src}
              alt={activeImage.alt}
              priority
              sizes="100vw"
              fit="contain"
            />
          </motion.div>

          {/* Thumbnail strip */}
          {hasMultiple && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-6 flex gap-3 overflow-x-auto scrollbar-hide snap-x"
              data-testid="artwork-thumbnails"
            >
              {allImages.map((image, index) => (
                <button
                  key={image.src}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-label={`${t('details', { defaultValue: 'View photo' })} ${index + 1}`}
                  aria-current={activeIndex === index}
                  className={`relative shrink-0 w-20 h-20 md:w-24 md:h-24 snap-start overflow-hidden border transition-all duration-300 ${
                    activeIndex === index
                      ? 'border-noir opacity-100'
                      : 'border-noir/10 opacity-60 hover:opacity-100'
                  }`}
                >
                  <AdaptiveImage
                    src={image.src}
                    alt={image.alt}
                    sizes="96px"
                    fit="cover"
                  />
                </button>
              ))}
            </motion.div>
          )}

          {/* Cartel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-10 max-w-xl"
          >
            {/* 1. Artist name */}
            <Link
              href={`/artists/${artwork.artist.slug}`}
              className="font-display text-2xl md:text-3xl text-noir tracking-wide hover:text-or transition-colors duration-300"
            >
              {artwork.artist.name}
            </Link>

            {/* 2. Title + 3. Year */}
            <p className="text-noir/70 text-lg mt-3">
              <span className="italic">{artwork.title}</span>
              {artwork.year && <span>, {artwork.year}</span>}
            </p>

            {/* 4. Medium */}
            {artwork.medium && (
              <p className="text-noir/50 text-sm mt-2">{artwork.medium}</p>
            )}

            {/* 5. Dimensions */}
            {artwork.dimensions && (
              <p className="text-noir/50 text-sm mt-1">{artwork.dimensions}</p>
            )}

            {/* 6. Status */}
            {artwork.sold ? (
              <p className="text-noir/40 text-xs tracking-[0.1em] uppercase mt-3">{t('sold')}</p>
            ) : (
              <p className="text-noir/40 text-xs italic mt-3">{t('priceOnRequest')}</p>
            )}

            {/* Inquire link */}
            <Link
              href="/contact"
              className="inline-block mt-6 text-xs tracking-[0.15em] uppercase text-jade hover:underline transition-colors duration-300"
            >
              {t('inquire')}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Contextual images — horizontal snap carousel */}
      {artwork.images.length > 0 && (
        <AnimatedSection
          bg="blanc-muted"
          initial={{ opacity: 0, y: 40 }}
          transition={{ duration: 1 }}
          viewportMargin="-100px"
          container={false}
        >
          <div className="text-center mb-12 px-6">
            <p className="text-or text-sm tracking-[0.2em] uppercase font-medium">{t('details')}</p>
          </div>
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-r from-blanc-muted to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-l from-blanc-muted to-transparent z-10 pointer-events-none" />
            <div
              className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth px-6 md:px-12 lg:px-20 pb-4"
              data-testid="artwork-contextual-carousel"
            >
              {artwork.images.map((image, index) => (
                <motion.button
                  type="button"
                  key={image}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  onClick={() => openLightbox(index + 1)}
                  className="snap-start shrink-0 w-[80vw] sm:w-[60vw] md:w-[45vw] lg:w-[36vw] aspect-[4/3] relative overflow-hidden border border-noir/10 cursor-zoom-in group"
                  aria-label={`${t('detail', { defaultValue: 'Detail' })} ${index + 1}`}
                >
                  <AdaptiveImage
                    src={image}
                    alt={`${artwork.title} — ${t('detail', { defaultValue: 'detail' })} ${index + 1}`}
                    sizes="(max-width: 768px) 80vw, 40vw"
                    fit="cover"
                    className="transition-transform duration-700 group-hover:scale-105"
                  />
                </motion.button>
              ))}
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* Prev / Next navigation */}
      {(artwork.prevArtwork || artwork.nextArtwork) && (
        <AnimatedSection
          bg="blanc"
          initial={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          viewportMargin="-100px"
        >
          <div className="flex items-center justify-between">
            {artwork.prevArtwork ? (
              <Link
                href={`/artworks/${artwork.prevArtwork.slug}`}
                className="group inline-flex items-center gap-2 text-noir/60 hover:text-noir transition-colors duration-300"
              >
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="text-sm tracking-[0.1em] uppercase">{artwork.prevArtwork.title}</span>
              </Link>
            ) : (
              <div />
            )}
            {artwork.nextArtwork ? (
              <Link
                href={`/artworks/${artwork.nextArtwork.slug}`}
                className="group inline-flex items-center gap-2 text-noir/60 hover:text-noir transition-colors duration-300"
              >
                <span className="text-sm tracking-[0.1em] uppercase">{artwork.nextArtwork.title}</span>
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </AnimatedSection>
      )}

      {/* Inquire CTA */}
      <CTAStrip
        title={t('inquireAbout')}
        primaryLink={{ href: '/contact', label: t('contactUs') }}
      />

      {/* Lightbox */}
      <Lightbox
        images={allImages}
        index={lightboxIndex}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onIndexChange={setLightboxIndex}
      />
    </div>
  );
}
