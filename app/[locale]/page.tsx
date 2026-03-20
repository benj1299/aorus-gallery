'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';

import { artists as allArtists } from '@/lib/artists-data';

const featuredArtists = allArtists.slice(0, 4);

export default function HomePage() {
  const t = useTranslations('home');

  return (
    <div className="flex flex-col">
      {/* ===== BLOCK 1 — HERO ===== */}
      <section className="bg-blanc min-h-screen flex items-center justify-center relative">
        {/* Background - Logo watermark */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src="/images/gallery/logo.jpeg"
              alt=""
              className="w-[60vw] max-w-[700px] opacity-[0.05]"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 text-center px-6"
        >
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mb-12"
          >
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl tracking-[0.15em] uppercase leading-none text-noir text-center">
              ORUS<br />GALLERY
            </h1>
          </motion.div>

          {/* TAIPEI — PARIS with jade line */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex items-center justify-center gap-6 mb-10"
          >
            <span className="font-display text-base md:text-lg tracking-[0.3em] uppercase text-noir">
              TAIPEI
            </span>
            <div className="w-12 h-px bg-or" />
            <span className="font-display text-base md:text-lg tracking-[0.3em] uppercase text-noir">
              PARIS
            </span>
          </motion.div>

          {/* International Art Gallery */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="text-noir/50 text-base md:text-lg tracking-[0.15em] uppercase"
          >
            {t('hero.tagline')}
          </motion.p>
        </motion.div>

        {/* Scroll indicator */}
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
      <section className="bg-blanc section-padding-lg">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1 }}
          className="container-wide"
        >
          <div className="text-center mb-16">
            <h2 className="title-section text-noir">
              {t('gallery.title')}
            </h2>
          </div>

          {/* Grid: 2 columns desktop, 1 mobile — 4 featured artists */}
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
                  <p className="font-display text-lg text-noir tracking-wide">
                    {artist.name}
                  </p>
                  <p className="text-noir/50 text-sm tracking-wide mt-1">
                    {artist.nationality}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ===== BLOCK 3 — DIRECTION CURATORIALE ===== */}
      <section className="bg-blanc-muted section-padding-lg">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Image */}
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

            {/* Text */}
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

              <p className="text-noir/70 text-lg leading-relaxed mb-6">
                {t('curatorial.text1')}
              </p>

              <p className="text-noir/60 text-base leading-relaxed mb-6">
                {t('curatorial.text2')}
              </p>

              <p className="text-noir/50 text-base leading-relaxed">
                {t('curatorial.text3')}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== BLOCK 4 — POURQUOI ORUS ===== */}
      <section className="bg-blanc section-padding-lg">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1 }}
          className="container-wide"
        >
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 * (index + 1) }}
                className="text-center p-8 bg-blanc-muted border border-noir/10"
              >
                <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <img
                    src="/images/gallery/logo.jpeg"
                    alt="ORUS"
                    className="w-12 h-12 object-contain"
                    style={{
                      filter: index === 0
                        ? 'sepia(1) saturate(3) brightness(0.8) hue-rotate(10deg)'
                        : index === 1
                          ? 'sepia(1) saturate(2) brightness(0.9) hue-rotate(100deg)'
                          : 'brightness(0) saturate(100%)',
                    }}
                  />
                </div>
                <h3 className="font-display text-xl text-noir mb-4 tracking-wide">
                  {t(`values.items.${index}.title`)}
                </h3>
                <p className="text-noir/60 text-sm leading-relaxed">
                  {t(`values.items.${index}.description`)}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ===== BLOCK 5 — CONTACT STRIP ===== */}
      <section className="bg-blanc-muted section-padding-lg">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="container-narrow text-center"
        >
          <p className="text-noir/60 text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
            {t('cta.text')}
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/contact"
              className="btn-primary"
            >
              {t('cta.contact')}
            </Link>
            <Link
              href="/artists"
              className="btn-secondary-dark"
            >
              {t('cta.artists')}
            </Link>
          </div>

          {/* Location tag */}
          <p className="text-noir/30 text-sm tracking-[0.15em] uppercase mt-16">
            {t('cta.location')}
          </p>
        </motion.div>
      </section>
    </div>
  );
}
