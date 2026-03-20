'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { artists } from '@/lib/artists-data';

export default function ArtistsPage() {
  const t = useTranslations('artists');

  return (
    <div className="flex flex-col">
      {/* Hero Header */}
      <section className="hero-offset bg-blanc">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="container-narrow text-center"
        >
          <h1 className="title-section text-noir mb-6">{t('title')}</h1>
          <p className="text-noir/60 text-base tracking-[0.08em] mb-8">{t('subtitle')}</p>
          <div className="divider-gold mx-auto" />
        </motion.div>
      </section>

      {/* Artists Grid */}
      <section className="section-padding bg-blanc-muted">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="container-wide"
        >
          {/* Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {artists.map((artist, index) => (
              <motion.div
                key={artist.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.05 * Math.min(index, 12) }}
              >
                <Link href={`/artists/${artist.id}`} className="group block">
                  {/* Artist Card */}
                  <div className="card-artwork aspect-[3/4] relative">
                    <Image
                      src={artist.image}
                      alt={artist.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Gradient overlay at bottom */}
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-noir/60 via-noir/30 to-transparent" />
                  </div>

                  {/* Artist Info */}
                  <div className="p-4 bg-blanc">
                    <p className="text-noir text-sm md:text-base font-display tracking-wide">
                      {artist.name}
                    </p>
                    {artist.nationality && (
                      <p className="text-or text-xs tracking-[0.12em] uppercase mt-1">
                        {artist.nationality}
                      </p>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
}
