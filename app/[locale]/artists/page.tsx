'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';

// Artists data with images from Unsplash (contemporary portrait style)
const artists: Array<{
  id: string;
  name: string;
  image: string;
  nationality?: string;
}> = [
  {
    id: 'richard-mensah',
    name: 'Richard Mensah',
    nationality: 'Ghana / London',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
  },
  {
    id: 'jake-wood-evans',
    name: 'Jake Wood-Evans',
    nationality: 'British',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80',
  },
  {
    id: 'phoebe-boswell',
    name: 'Phoebe Boswell',
    nationality: 'Multidisciplinary',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80',
  },
  {
    id: 'renee-leblois-julienne',
    name: 'Renee Leblois-Julienne',
    nationality: 'French',
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80',
  },
  {
    id: 'rebekka-macht',
    name: 'Rebekka Macht',
    nationality: 'Germany / Ghana',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80',
  },
  {
    id: 'lanise-howard',
    name: 'Lanise Howard',
    nationality: 'American',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&q=80',
  },
  {
    id: 'qha-ma-na-nde',
    name: 'Qha-ma-na-nde',
    nationality: 'South African',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&q=80',
  },
  {
    id: 'bao-vuong',
    name: 'Bao Vuong',
    nationality: 'Franco-Vietnamese',
    image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&q=80',
  },
  {
    id: 'otis-quaicoe',
    name: 'Otis Quaicoe',
    nationality: 'Ghanaian',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&q=80',
  },
  {
    id: 'maku-azu',
    name: 'Maku Azu',
    nationality: 'Ghana',
    image: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=600&q=80',
  },
  {
    id: 'vanessa-raw',
    name: 'Vanessa Raw',
    nationality: 'British',
    image: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600&q=80',
  },
  {
    id: 'carlos-romano',
    name: 'Carlos Romano',
    nationality: 'London',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=80',
  },
  {
    id: 'matthieu-scheiffer',
    name: 'Matthieu Scheiffer',
    nationality: 'French',
    image: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=600&q=80',
  },
  {
    id: 'halee-roth',
    name: 'Halee Roth',
    nationality: 'American',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&q=80',
  },
  {
    id: 'ewa-gora',
    name: 'Ewa Gora',
    nationality: 'Polish',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&q=80',
  },
  {
    id: 'tatiana-gorgievski',
    name: 'Tatiana Gorgievski',
    nationality: 'International',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&q=80',
  },
  {
    id: 'owen-rival',
    name: 'Owen Rival',
    nationality: 'French',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80',
  },
];

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
          <p className="text-or text-sm tracking-[0.2em] uppercase font-medium mb-6">Gallery Roster</p>
          <h1 className="title-section text-noir mb-8">{t('title')}</h1>
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
