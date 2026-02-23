'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import { use } from 'react';
import { getArtistById } from '@/lib/artists-data';
import Image from 'next/image';

interface ArtistPageProps {
  params: Promise<{ id: string }>;
}

export default function ArtistPage({ params }: ArtistPageProps) {
  const { id } = use(params);
  const t = useTranslations('artist');
  const artist = getArtistById(id);

  if (!artist) {
    return (
      <div className="min-h-screen hero-offset bg-blanc">
        <div className="container-narrow text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Icon */}
            <div className="w-24 h-24 mx-auto mb-10 border border-noir/15 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-noir/30"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>

            <h1 className="font-display text-3xl text-noir mb-4">
              Page Not Found
            </h1>
            <p className="text-noir/50 text-base mb-10 max-w-md mx-auto">
              This page is being prepared. Please check back soon or explore our roster.
            </p>

            <Link
              href="/artists"
              className="btn-text group inline-flex items-center gap-3"
            >
              <svg
                className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              <span>{t('backToArtists')}</span>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-blanc hero-offset">
        <div className="container-wide">
          {/* Back Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <Link
              href="/artists"
              className="text-noir/40 hover:text-noir transition-colors duration-300 text-sm tracking-[0.1em] uppercase inline-flex items-center gap-2 group"
            >
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              {t('backToArtists')}
            </Link>
          </motion.div>

          {/* Artist Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid md:grid-cols-3 gap-12 items-start"
          >
            {/* Portrait */}
            <div className="md:col-span-1">
              <div className="aspect-[3/4] relative overflow-hidden">
                <Image
                  src={artist.image}
                  alt={artist.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Artist Details */}
            <div className="md:col-span-2">
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-noir mb-4 tracking-wide">
                {artist.name}
              </h1>
              <p className="text-or text-sm tracking-[0.15em] uppercase mb-8">
                {artist.nationality}
              </p>
              <div className="divider-gold mb-8" />
              <p className="text-noir/60 text-lg leading-relaxed">
                {artist.bio}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Works Section */}
      <section className="bg-blanc-muted section-padding-lg">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1 }}
          className="container-wide"
        >
          <div className="text-center mb-16">
            <p className="text-or text-sm tracking-[0.2em] uppercase font-medium mb-4">
              {t('works')}
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-noir tracking-wide">
              Portfolio
            </h2>
          </div>

          {/* Works Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="aspect-square bg-blanc border border-noir/10 flex items-center justify-center"
              >
                <span className="text-noir/20 text-sm tracking-[0.1em] uppercase">
                  Work {index}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CV Section */}
      <section className="bg-blanc section-padding-lg">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1 }}
          className="container-narrow"
        >
          <div className="text-center mb-16">
            <p className="text-or text-sm tracking-[0.2em] uppercase font-medium mb-4">{t('cv')}</p>
            <h2 className="title-section text-noir">Career</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Exhibitions */}
            <div>
              <h3 className="font-display text-xl text-or mb-6 tracking-wide">
                {t('exhibitions')}
              </h3>
              <ul className="space-y-3">
                {artist.cv.exhibitions.map((exhibition, index) => (
                  <li key={index} className="text-noir/60 text-sm leading-relaxed">
                    {exhibition}
                  </li>
                ))}
              </ul>
            </div>

            {/* Collections */}
            <div>
              <h3 className="font-display text-xl text-or mb-6 tracking-wide">
                {t('collections')}
              </h3>
              <ul className="space-y-3">
                {artist.cv.collections.map((collection, index) => (
                  <li key={index} className="text-noir/60 text-sm leading-relaxed">
                    {collection}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="text-noir/40 text-sm text-center mt-12">
            {t('placeholder.cv')}
          </p>
        </motion.div>
      </section>

      {/* Inquire CTA */}
      <section className="bg-blanc-muted section-padding">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="container-narrow text-center"
        >
          <h2 className="font-display text-2xl md:text-3xl text-noir mb-6">
            {t('inquire')}
          </h2>
          <Link href="/contact" className="btn-primary">
            Contact Us
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
