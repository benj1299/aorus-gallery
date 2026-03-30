'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { Target, Clock, Globe } from 'lucide-react';
import { AnimatedSection } from '@/components/AnimatedSection';
import { CTAStrip } from '@/components/CTAStrip';

const valueIcons = [Target, Clock, Globe];

interface FeaturedArtwork {
  id: string;
  slug: string;
  title: string;
  imageUrl: string;
  artistName: string;
  artistSlug: string;
}

interface Artist {
  id: string;
  name: string;
  nationality: string;
  image: string;
}

interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  imageUrl: string;
  linkUrl: string | null;
}

export function HomePageClient({ featuredArtworks, featuredArtists, banner }: { featuredArtworks: FeaturedArtwork[]; featuredArtists: Artist[]; banner: Banner | null }) {
  const t = useTranslations('home');

  return (
    <div className="flex flex-col">
      {banner && (
        <section className="relative h-[70vh] overflow-hidden">
          <Image src={banner.imageUrl} alt={banner.title} fill className="object-cover" />
          <div className="absolute inset-0 bg-noir/40" />
          <div className="absolute inset-0 flex items-center justify-center text-center px-6">
            {banner.linkUrl ? (
              <Link href={banner.linkUrl}>
                <div>
                  <h2 className="font-display text-4xl md:text-6xl text-blanc tracking-wide">{banner.title}</h2>
                  {banner.subtitle && <p className="text-blanc/80 text-lg mt-4 tracking-wide">{banner.subtitle}</p>}
                </div>
              </Link>
            ) : (
              <div>
                <h2 className="font-display text-4xl md:text-6xl text-blanc tracking-wide">{banner.title}</h2>
                {banner.subtitle && <p className="text-blanc/80 text-lg mt-4 tracking-wide">{banner.subtitle}</p>}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ===== BLOCK 1 — HERO ===== */}
      <section className="bg-blanc min-h-screen flex items-center justify-center relative">
        <div className="absolute inset-0">
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src="/images/gallery/logo.jpeg"
              alt=""
              width={700}
              height={700}
              className="w-[60vw] max-w-[700px] opacity-[0.05]"
              aria-hidden="true"
              priority
            />
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 text-center px-6"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mb-12"
          >
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl uppercase leading-none text-noir text-center">
              <span className="tracking-[0.45em] block">ORUS</span>
              <span className="tracking-[0.15em] block">GALLERY</span>
            </h1>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex items-center justify-center gap-6 mb-10"
          >
            <span className="font-display text-base md:text-lg tracking-[0.3em] uppercase text-noir">TAIPEI</span>
            <div className="w-12 h-px bg-or" />
            <span className="font-display text-base md:text-lg tracking-[0.3em] uppercase text-noir">PARIS</span>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="text-noir/50 text-base md:text-lg tracking-[0.15em] uppercase"
          >
            {t('hero.tagline')}
          </motion.p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="w-px h-16 bg-gradient-to-b from-or/60 to-transparent" />
          </motion.div>
        </motion.div>
      </section>

      {/* ===== BLOCK 2 — SELECTION D'OEUVRES ===== */}
      <AnimatedSection
        padding="lg"
        initial={{ opacity: 0 }}
        transition={{ duration: 1 }}
        viewportMargin="-100px"
      >
        <div className="text-center mb-20">
          <h2 className="title-section text-noir">{t('gallery.title')}</h2>
          {featuredArtworks.length > 0 && (
            <p className="text-sm tracking-wide italic mt-4 text-jade">{t('gallery.subtitle')}</p>
          )}
        </div>
        {featuredArtworks.length > 0 ? (
          <div className="space-y-12 md:space-y-16">
            {/* Row 1: Asymmetric masonry — large portrait left, two stacked right */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {/* Large artwork — 2/3 width, portrait format */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="group md:col-span-2"
              >
                <Link href={`/artists/${featuredArtworks[0].artistSlug}`}>
                  <div className="aspect-[3/4] relative overflow-hidden">
                    <Image
                      src={featuredArtworks[0].imageUrl}
                      alt={featuredArtworks[0].title}
                      fill
                      sizes="(max-width: 768px) 100vw, 66vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-noir/0 group-hover:bg-noir/40 transition-colors duration-500 flex items-end p-8 opacity-0 group-hover:opacity-100">
                      <p className="font-display text-xl text-blanc tracking-wide">{featuredArtworks[0].title}</p>
                    </div>
                  </div>
                  <p className="text-noir/60 text-sm tracking-wide mt-4">{featuredArtworks[0].artistName}</p>
                </Link>
              </motion.div>

              {/* Two stacked artworks — 1/3 width */}
              {featuredArtworks.length > 1 && (
                <div className="flex flex-col gap-6 md:gap-8">
                  {featuredArtworks.slice(1, 3).map((artwork, index) => (
                    <motion.div
                      key={artwork.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.1 * (index + 1) }}
                      className="group flex-1"
                    >
                      <Link href={`/artists/${artwork.artistSlug}`}>
                        <div className="aspect-[4/3] relative overflow-hidden">
                          <Image
                            src={artwork.imageUrl}
                            alt={artwork.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-noir/0 group-hover:bg-noir/40 transition-colors duration-500 flex items-end p-6 opacity-0 group-hover:opacity-100">
                            <p className="font-display text-lg text-blanc tracking-wide">{artwork.title}</p>
                          </div>
                        </div>
                        <p className="text-noir/60 text-sm tracking-wide mt-4">{artwork.artistName}</p>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Row 2: Three equal columns — remaining artworks */}
            {featuredArtworks.length > 3 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                {featuredArtworks.slice(3).map((artwork, index) => (
                  <motion.div
                    key={artwork.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className="group"
                  >
                    <Link href={`/artists/${artwork.artistSlug}`}>
                      <div className="aspect-[4/5] relative overflow-hidden">
                        <Image
                          src={artwork.imageUrl}
                          alt={artwork.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-noir/0 group-hover:bg-noir/40 transition-colors duration-500 flex items-end p-6 opacity-0 group-hover:opacity-100">
                          <p className="font-display text-lg text-blanc tracking-wide">{artwork.title}</p>
                        </div>
                      </div>
                      <p className="text-noir/60 text-sm tracking-wide mt-4">{artwork.artistName}</p>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}

            {/* "Voir les artistes" link */}
            <div className="text-center pt-4">
              <Link
                href="/artists"
                className="inline-flex items-center gap-3 text-noir/60 text-sm tracking-[0.1em] uppercase transition-colors duration-300 hover:text-noir"
              >
                {t('gallery.cta')} <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
            {featuredArtists.map((artist, index) => (
              <motion.div
                key={artist.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="group"
              >
                <Link href={`/artists/${artist.id}`}>
                  <div className="aspect-[4/3] relative overflow-hidden mb-6">
                    <Image
                      src={artist.image}
                      alt={artist.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <p className="font-display text-lg text-noir tracking-wide">{artist.name}</p>
                  <p className="text-noir/50 text-sm tracking-wide mt-1">{artist.nationality}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatedSection>

      {/* ===== BLOCK 3 — DIRECTION CURATORIALE ===== */}
      <section className="bg-blanc-muted section-padding-lg">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 1 }}
              className="aspect-[4/5] relative overflow-hidden"
            >
              <Image
                src="/images/gallery/Galerie 1.png"
                alt="ORUS Gallery facade"
                fill
                className="object-cover"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-center lg:text-left"
            >
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-noir mb-10 tracking-[0.04em]">
                {t('curatorial.title')}
              </h2>
              <div className="w-20 h-px bg-gradient-to-r from-transparent via-or to-transparent mx-auto lg:mx-0 mb-10" />
              <p className="text-noir/70 text-lg leading-relaxed mb-6">{t('curatorial.text1')}</p>
              <p className="text-noir/60 text-base leading-relaxed mb-6">{t('curatorial.text2')}</p>
              <p className="text-noir/50 text-base leading-relaxed">{t('curatorial.text3')}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== BLOCK 4 — POURQUOI ORUS ===== */}
      <AnimatedSection
        padding="lg"
        initial={{ opacity: 0 }}
        transition={{ duration: 1 }}
        viewportMargin="-100px"
      >
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 * (index + 1) }}
              className="text-center px-6 py-10"
            >
              {(() => { const Icon = valueIcons[index]; return <Icon className="w-8 h-8 mx-auto mb-6 stroke-[1.5]" style={{ color: '#2D7A5E' }} />; })()}
              <h3 className="font-display text-xl text-noir mb-4 tracking-wide">
                {t(`values.items.${index}.title`)}
              </h3>
              <p className="text-noir/60 text-sm leading-relaxed">
                {t(`values.items.${index}.description`)}
              </p>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>

      {/* ===== BLOCK 5 — CONTACT STRIP ===== */}
      <CTAStrip
        text={t('cta.text')}
        primaryLink={{ href: '/contact', label: t('cta.contact') }}
        secondaryLink={{ href: '/artists', label: t('cta.artists') }}
        locationTag={t('cta.location')}
      />
    </div>
  );
}
