'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';

export default function AboutPage() {
  const t = useTranslations('about');

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-blanc min-h-[60vh] flex items-center justify-center hero-offset">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="container-narrow text-center"
        >
          <h1 className="title-section text-noir mb-6">{t('title')}</h1>
          <p className="text-or text-lg tracking-[0.15em] uppercase font-medium">
            {t('tagline')}
          </p>
          <div className="divider-gold-wide mx-auto mt-12" />
        </motion.div>
      </section>

      {/* Mission Section with Image */}
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
                src="https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=800&q=80"
                alt="Gallery exhibition space"
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
            >
              <p className="text-or text-sm tracking-[0.2em] uppercase font-medium mb-4">
                {t('mission.eyebrow')}
              </p>
              <h2 className="font-display text-3xl md:text-4xl text-noir mb-8 tracking-wide">
                {t('mission.title')}
              </h2>
              <p className="text-noir text-lg leading-relaxed">
                {t('mission.text')}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-blanc section-padding-lg">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1 }}
          className="container-wide"
        >
          <div className="text-center mb-16">
            <p className="text-or text-sm tracking-[0.2em] uppercase font-medium mb-4">{t('team.eyebrow')}</p>
            <h2 className="title-section text-noir">{t('team.title')}</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Paris */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-[4/3] relative overflow-hidden mb-6">
                <Image
                  src="https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&q=80"
                  alt="Paris"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-noir/40" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-blanc font-display text-4xl tracking-[0.2em]">PARIS</span>
                </div>
              </div>
              <p className="text-noir/60 leading-relaxed text-center">
                {t('team.paris')}
              </p>
            </motion.div>

            {/* Taiwan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
              <div className="aspect-[4/3] relative overflow-hidden mb-6">
                <Image
                  src="https://images.unsplash.com/photo-1470004914212-05527e49370b?w=800&q=80"
                  alt="Taipei"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-noir/40" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-blanc font-display text-4xl tracking-[0.2em]">TAIPEI</span>
                </div>
              </div>
              <p className="text-noir/60 leading-relaxed text-center">
                {t('team.taiwan')}
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Curatorial Direction with Image */}
      <section className="bg-blanc-muted section-padding-lg">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Text */}
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
                {t('curatorial.title')}
              </h2>

              <div className="space-y-8 mb-12">
                <div className="border-l-2 border-noir pl-6">
                  <h3 className="font-display text-xl text-noir mb-2">
                    {t('curatorial.value1.title')}
                  </h3>
                  <p className="text-noir/70 text-sm leading-relaxed">
                    {t('curatorial.value1.text')}
                  </p>
                </div>
                <div className="border-l-2 border-noir pl-6">
                  <h3 className="font-display text-xl text-noir mb-2">
                    {t('curatorial.value2.title')}
                  </h3>
                  <p className="text-noir/70 text-sm leading-relaxed">
                    {t('curatorial.value2.text')}
                  </p>
                </div>
              </div>

              <blockquote className="text-noir/80 text-xl font-display italic leading-relaxed">
                &ldquo;{t('curatorial.quote')}&rdquo;
              </blockquote>
            </motion.div>

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 1, delay: 0.2 }}
              className="order-1 lg:order-2"
            >
              <div className="aspect-[3/4] relative overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80"
                  alt="Contemporary artwork"
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Approach Section */}
      <section className="bg-blanc section-padding-lg">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1 }}
          className="container-narrow text-center"
        >
          <p className="text-or text-sm tracking-[0.2em] uppercase font-medium mb-4">{t('approach.eyebrow')}</p>
          <h2 className="font-display text-3xl md:text-4xl text-or mb-8 tracking-wide">
            {t('approach.title')}
          </h2>
          <p className="text-noir/60 text-lg leading-relaxed max-w-2xl mx-auto">
            {t('approach.text')}
          </p>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="bg-blanc-muted section-padding">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="container-narrow text-center"
        >
          <h2 className="font-display text-2xl md:text-3xl text-noir mb-6">
            {t('cta.title')}
          </h2>
          <p className="text-noir/70 mb-12 tracking-wide">
            {t('cta.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link href="/artists" className="btn-primary">
              {t('cta.artists')}
            </Link>
            <Link href="/contact" className="btn-secondary-dark">
              {t('cta.contact')}
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
