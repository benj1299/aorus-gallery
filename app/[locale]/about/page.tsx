'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { PageHero } from '@/components/PageHero';
import { AnimatedSection } from '@/components/AnimatedSection';
import { CTAStrip } from '@/components/CTAStrip';

// Unified image treatment for editorial sections.
// All About sections share the same desktop aspect-ratio (4:5 portrait — museum standard,
// matches David Zwirner / Gagosian / Pace) and the same object treatment.
// Mobile keeps a slightly more horizontal ratio for above-the-fold density.
const EDITORIAL_IMAGE = 'aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] relative overflow-hidden';

export default function AboutPage() {
  const t = useTranslations('about');

  return (
    <div className="flex flex-col">
      {/* ===== SECTION 1 — HEADER ===== */}
      <PageHero
        title={t('title')}
        subtitle={t('hero.subtitle')}
        subtitleClassName="text-or text-lg tracking-[0.15em] uppercase font-medium mb-8"
        divider="wide"
        dividerClassName="mb-12"
        className="min-h-[60vh] flex items-center justify-center"
      >
        <p className="text-noir/70 text-lg leading-relaxed max-w-3xl mx-auto">
          {t('foundation.text')}
        </p>
      </PageHero>

      {/* ===== SECTION 2 — UNE VISION ===== */}
      {/* Asymmetric 7/5 split — image dominant left, text right. */}
      <section className="bg-blanc-muted section-padding-lg">
        <div className="container-wide">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 1 }}
              className={`${EDITORIAL_IMAGE} lg:col-span-7`}
            >
              <Image
                src="/images/gallery/vision-artwork.jpeg"
                alt="Contemporary artwork in gallery setting"
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover object-center"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 1, delay: 0.2 }}
              className="lg:col-span-5"
            >
              <p className="text-or text-sm tracking-[0.2em] uppercase font-medium mb-4">
                {t('vision.eyebrow')}
              </p>
              <h2 className="font-display text-3xl md:text-4xl text-noir mb-8 tracking-wide">
                {t('vision.subtitle')}
              </h2>
              <div className="space-y-6">
                <p className="text-noir/70 text-lg leading-relaxed">{t('vision.text1')}</p>
                <p className="text-noir/60 text-base leading-relaxed">{t('vision.text2')}</p>
                {t('vision.text3') && (
                  <p className="text-noir/50 text-base leading-relaxed">{t('vision.text3')}</p>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 3 — DIRECTION CURATORIALE ===== */}
      {/* Mirrored 5/7 split — text left, image dominant right. Rhythm change vs section 2. */}
      <section className="bg-blanc section-padding-lg">
        <div className="container-wide">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 1 }}
              className="order-2 lg:order-1 lg:col-span-5"
            >
              <p className="text-or text-sm tracking-[0.2em] uppercase font-medium mb-4">
                {t('curatorial.eyebrow')}
              </p>
              <h2 className="font-display text-3xl md:text-4xl text-noir mb-10 tracking-wide">
                {t('curatorial.subtitle')}
              </h2>
              <div className="space-y-6">
                <p className="text-noir/70 text-lg leading-relaxed">{t('curatorial.text1')}</p>
                <p className="text-noir/60 text-base leading-relaxed">{t('curatorial.text2')}</p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 1, delay: 0.2 }}
              className={`${EDITORIAL_IMAGE} order-1 lg:order-2 lg:col-span-7`}
            >
              <Image
                src="/images/gallery/discussion.png"
                alt="Discussion devant une oeuvre"
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover object-center"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 4 — COLLECTIONNEURS & INSTITUTIONS ===== */}
      {/* Centered 6/5 with offset — text gravitates inward, leaves breathing room. */}
      <section className="bg-blanc-muted section-padding-lg">
        <div className="container-wide">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 1 }}
              className={`${EDITORIAL_IMAGE} lg:col-span-6`}
            >
              <Image
                src="/images/gallery/collectors-institutions.jpg"
                alt="ORUS Gallery portfolio — Collectors & Institutions"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 1, delay: 0.2 }}
              className="lg:col-span-5 lg:col-start-8"
            >
              <h2 className="font-display text-3xl md:text-4xl text-noir mb-8 tracking-wide">
                {t('collectors.title')}
              </h2>
              <p className="text-noir/60 text-lg leading-relaxed">{t('collectors.text')}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 5 — PRESENCE INTERNATIONALE ===== */}
      {/* Editorial diptych: clean images + city label as quiet caption (no on-image overlay text).
          Aspect ratio matches the rest of the page (4:5) for cohesion. */}
      <AnimatedSection
        padding="lg"
        initial={{ opacity: 0, y: 40 }}
        transition={{ duration: 1 }}
        viewportMargin="-100px"
      >
        <div className="text-center mb-16">
          <p className="text-or text-sm tracking-[0.2em] uppercase font-medium mb-4">
            {t('international.eyebrow')}
          </p>
          <h2 className="title-section text-noir">{t('international.subtitle')}</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 max-w-5xl mx-auto mb-20">
          <motion.figure
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className={EDITORIAL_IMAGE}>
              <Image
                src="https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=1200&q=80"
                alt="Paris"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-6 text-center">
              <p className="text-or text-xs tracking-[0.3em] uppercase font-medium mb-2">
                {t('international.city1Label')}
              </p>
              <p className="font-display text-2xl text-noir tracking-wide">Paris</p>
            </figcaption>
          </motion.figure>
          <motion.figure
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className={EDITORIAL_IMAGE}>
              <Image
                src="https://images.unsplash.com/photo-1470004914212-05527e49370b?w=1200&q=80"
                alt="Taipei"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-6 text-center">
              <p className="text-or text-xs tracking-[0.3em] uppercase font-medium mb-2">
                {t('international.city2Label')}
              </p>
              <p className="font-display text-2xl text-noir tracking-wide">Taipei</p>
            </figcaption>
          </motion.figure>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          <p className="text-noir/70 text-lg leading-relaxed">{t('international.text1')}</p>
          <p className="text-noir/60 text-base leading-relaxed">{t('international.text2')}</p>
          <p className="text-noir/50 text-base leading-relaxed">{t('international.text3')}</p>
        </div>
      </AnimatedSection>

      {/* ===== SECTION 6 — CTA ===== */}
      <CTAStrip
        title={t('cta.title')}
        primaryLink={{ href: '/artists', label: t('cta.artists') }}
        secondaryLink={{ href: '/contact', label: t('cta.contact') }}
      />
    </div>
  );
}
