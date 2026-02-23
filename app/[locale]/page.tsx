'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';

// Featured artworks for the gallery preview
const featuredWorks = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80',
    title: 'Contemporary Abstract',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=800&q=80',
    title: 'Gallery Exhibition',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1541367777708-7905fe3296c0?w=800&q=80',
    title: 'Modern Sculpture',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=800&q=80',
    title: 'Abstract Expression',
  },
];

export default function HomePage() {
  const t = useTranslations('home');

  return (
    <div className="flex flex-col">
      {/* ===== HERO SECTION ===== */}
      <section className="bg-blanc min-h-screen flex items-center justify-center relative">
        {/* Background - Logo watermark */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src="/logo.png"
              alt=""
              className="w-[50vw] max-w-[600px] opacity-[0.04]"
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
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mb-12"
          >
            <div className="flex flex-col items-center">
              <span
                className="font-display text-5xl md:text-7xl lg:text-8xl tracking-[0.15em] uppercase leading-none"
                style={{ color: '#C9A227' }}
              >
                ORUS
              </span>
              <span
                className="font-display text-xl md:text-2xl lg:text-3xl tracking-[0.3em] uppercase text-noir/40 mt-2"
                style={{ fontWeight: 300 }}
              >
                gallery
              </span>
            </div>
          </motion.div>

          {/* Gold Separator */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="divider-gold mx-auto mb-8"
          />

          {/* Positioning statement */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="text-noir/50 text-base md:text-lg tracking-[0.15em] uppercase mb-6"
          >
            {t('hero.positioning')}
          </motion.p>

          {/* 24h response promise */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.1 }}
            className="inline-flex items-center gap-3 px-6 py-3 border border-or/30"
          >
            <span className="text-or text-sm tracking-[0.12em] uppercase font-medium">
              {t('hero.response')}
            </span>
          </motion.div>
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

      {/* ===== GALLERY PREVIEW ===== */}
      <section className="bg-blanc-muted section-padding">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1 }}
          className="container-wide"
        >
          {/* Grid of featured works */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
            {featuredWorks.map((work, index) => (
              <motion.div
                key={work.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="aspect-square relative overflow-hidden group"
              >
                <Image
                  src={work.image}
                  alt={work.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-noir/0 group-hover:bg-noir/20 transition-colors duration-500" />
              </motion.div>
            ))}
          </div>

          {/* View Artists Link */}
          <div className="text-center mt-12">
            <Link
              href="/artists"
              className="btn-text group inline-flex items-center gap-3"
            >
              <span>View All Artists</span>
              <svg
                className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ===== DIRECTION CURATORIALE ===== */}
      <section className="bg-blanc section-padding-lg">
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
                src="https://images.unsplash.com/photo-1577720643272-265f09367456?w=800&q=80"
                alt="Gallery space"
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
              <p className="text-or text-sm tracking-[0.2em] uppercase font-medium mb-6">
                {t('curatorial.eyebrow')}
              </p>

              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-noir mb-10 tracking-[0.04em]">
                {t('curatorial.title')}
              </h2>

              <div className="w-20 h-px bg-gradient-to-r from-transparent via-or to-transparent mx-auto lg:mx-0 mb-10" />

              <p className="text-noir/70 text-lg leading-relaxed mb-6">
                {t('curatorial.text1')}
              </p>

              <p className="text-noir/50 text-base leading-relaxed">
                {t('curatorial.text2')}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== PROPOSITION DE VALEUR ===== */}
      <section className="bg-blanc-muted section-padding-lg">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1 }}
          className="container-wide"
        >
          <div className="text-center mb-16">
            <p className="text-or text-sm tracking-[0.2em] uppercase font-medium mb-4">{t('value.eyebrow')}</p>
            <h2 className="title-section text-noir">{t('value.title')}</h2>
          </div>

          {/* 3 Value Pillars */}
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {[
              { key: 'pillar1', num: '01' },
              { key: 'pillar2', num: '02' },
              { key: 'pillar3', num: '03' },
            ].map((pillar, index) => (
              <motion.div
                key={pillar.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 * (index + 1) }}
                className="text-center p-8 bg-blanc border border-noir/10"
              >
                <div className="w-16 h-16 mx-auto mb-6 border border-or flex items-center justify-center">
                  <span className="text-or text-2xl font-display">{pillar.num}</span>
                </div>
                <h3 className="font-display text-xl text-noir mb-4 tracking-wide">
                  {t(`value.${pillar.key}.title`)}
                </h3>
                <p className="text-noir/60 text-sm leading-relaxed">
                  {t(`value.${pillar.key}.text`)}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ===== CONTACT CTA ===== */}
      <section className="bg-blanc section-padding-lg">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="container-narrow text-center"
        >
          <h2 className="font-display text-3xl md:text-4xl text-noir mb-6 tracking-wide">
            {t('cta.title')}
          </h2>
          <p className="text-noir/50 text-lg mb-12 max-w-xl mx-auto">
            {t('cta.subtitle')}
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
            Taipei — Paris
          </p>
        </motion.div>
      </section>
    </div>
  );
}
