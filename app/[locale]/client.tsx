'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { Target, Clock, Globe } from 'lucide-react';
import { AnimatedSection } from '@/components/AnimatedSection';
import { CTAStrip } from '@/components/CTAStrip';
import { ArtworkRail, type ArtworkMedia } from '@/components/artwork-display';

const valueIcons = [Target, Clock, Globe];

interface FeaturedArtwork {
  id: string;
  slug: string;
  title: string;
  imageUrl: string;
  imageWidth: number | null;
  imageHeight: number | null;
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

  const bannerContent = banner ? (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      className="text-center px-6 max-w-4xl"
    >
      <h2 className="font-display text-4xl md:text-6xl lg:text-7xl text-blanc tracking-[0.04em] leading-tight">
        {banner.title}
      </h2>
      {banner.subtitle && (
        <p className="text-blanc/85 text-base md:text-lg mt-6 tracking-[0.12em] uppercase">
          {banner.subtitle}
        </p>
      )}
      {banner.linkUrl && (
        <span className="inline-block mt-10 text-xs tracking-[0.25em] uppercase text-blanc border-b border-blanc/60 pb-1 hover:border-blanc transition-colors">
          {t('gallery.cta')}
        </span>
      )}
    </motion.div>
  ) : null;

  return (
    <div className="flex flex-col">
      {banner && (
        <section
          className="relative h-screen overflow-hidden"
          data-testid="home-banner"
        >
          <Image
            src={banner.imageUrl}
            alt={banner.title}
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-noir/30 via-noir/40 to-noir/60" />
          <div className="absolute inset-0 flex items-center justify-center">
            {banner.linkUrl ? (
              <Link href={banner.linkUrl} aria-label={banner.title}>
                {bannerContent}
              </Link>
            ) : (
              bannerContent
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
              priority={!banner}
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
        container={false}
      >
        <div className="text-center mb-20 px-6 md:px-12 lg:px-20">
          <h2 className="title-section text-noir">{t('gallery.title')}</h2>
        </div>
        {featuredArtworks.length > 0 ? (
          <div style={{ ['--rail-h' as string]: '420px' } as React.CSSProperties}>
            <ArtworkRail
              items={featuredArtworks.slice(0, 10).map<ArtworkMedia>((artwork) => ({
                id: artwork.id,
                title: artwork.title,
                imageUrl: artwork.imageUrl,
                imageWidth: artwork.imageWidth,
                imageHeight: artwork.imageHeight,
                caption: artwork.artistName,
                href: `/artworks/${artwork.slug}`,
              }))}
              rowHeightClass="h-[280px] md:h-[360px] lg:h-[420px]"
              linkRenderer={(href, children, className) => (
                <Link href={href} className={className}>
                  {children}
                </Link>
              )}
            />
            <div className="text-center mt-24">
              <Link
                href="/artists"
                className="inline-flex items-center gap-3 text-noir/60 text-sm tracking-[0.1em] uppercase transition-colors duration-300 hover:text-noir"
              >
                {t('gallery.cta')} <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 px-6 md:px-12 lg:px-20">
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
                      sizes="(max-width: 768px) 100vw, 50vw"
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
                sizes="(max-width: 1024px) 100vw, 50vw"
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
              {(() => { const Icon = valueIcons[index]; return <Icon className="w-8 h-8 mx-auto mb-6 stroke-[1.5]" style={{ color: '#4A7C6F' }} />; })()}
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
