'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

export default function EventsPage() {
  const t = useTranslations('events');

  return (
    <div className="flex flex-col">
      {/* Hero Header */}
      <section className="bg-blanc hero-offset">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="container-narrow text-center"
        >
          <h1 className="font-display text-4xl md:text-5xl text-noir tracking-wide mb-6">
            {t('title')}
          </h1>
          <p className="text-noir/50 text-lg tracking-wide">{t('subtitle')}</p>
          <div className="divider-gold mx-auto mt-10" />
        </motion.div>
      </section>

      {/* Coming Soon Section */}
      <section className="bg-blanc-muted section-padding-lg">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="container-narrow"
        >
          <div className="text-center py-20">
            {/* Calendar Icon */}
            <div className="w-24 h-24 mx-auto mb-12 border border-noir/15 flex items-center justify-center">
              <svg
                className="w-12 h-12 text-or"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>

            <p className="text-noir text-2xl font-display mb-4 tracking-wide">
              {t('comingSoon')}
            </p>
            <p className="text-noir/50 text-base mb-8 tracking-wide max-w-md mx-auto">
              {t('stayTuned')}
            </p>

            {/* Decorative element */}
            <div className="divider-gold mx-auto" />
          </div>
        </motion.div>
      </section>
    </div>
  );
}
