'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { PageHero } from '@/components/PageHero';
import { AnimatedSection } from '@/components/AnimatedSection';
import { CTAStrip } from '@/components/CTAStrip';

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
      <section className="bg-blanc-muted section-padding-lg">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 1 }}
              className="aspect-[16/9] lg:aspect-[4/3] relative overflow-hidden"
            >
              <Image
                src="/images/gallery/vision-artwork.jpeg"
                alt="Contemporary artwork in gallery setting"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                style={{ objectPosition: 'center 30%' }}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 1, delay: 0.2 }}
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
      <section className="bg-blanc section-padding-lg">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 1 }}
              className="order-2 lg:order-1"
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
              className="order-1 lg:order-2"
            >
              <div className="aspect-[3/2] lg:aspect-[3/4] relative overflow-hidden">
                <Image
                  src="/images/gallery/discussion.png"
                  alt="Discussion devant une oeuvre"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 4 — COLLECTIONNEURS & INSTITUTIONS ===== */}
      <section className="bg-blanc-muted section-padding-lg">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 1 }}
              className="aspect-[3/2] lg:aspect-[3/4] relative overflow-hidden"
            >
              <Image
                src="/images/gallery/Secretariat.png"
                alt="ORUS Gallery reception"
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

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="aspect-[4/3] relative overflow-hidden mb-6">
              <Image
                src="https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&q=80"
                alt="Paris"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-noir/40" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-blanc font-display text-4xl tracking-[0.2em]">PARIS</span>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="aspect-[4/3] relative overflow-hidden mb-6">
              <Image
                src="https://images.unsplash.com/photo-1470004914212-05527e49370b?w=800&q=80"
                alt="Taipei"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-noir/40" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-blanc font-display text-4xl tracking-[0.2em]">TAIPEI</span>
              </div>
            </div>
          </motion.div>
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
