'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

export default function PressPage() {
  const t = useTranslations('press');

  return (
    <div className="flex flex-col">
      {/* Hero Header */}
      <section className="section-noir hero-offset">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="container-narrow text-center"
        >
          <h1 className="title-section text-blanc mb-6">{t('title')}</h1>
          <p className="text-blanc/60 text-lg tracking-wide">{t('subtitle')}</p>
          <div className="divider-gold mx-auto mt-10" />
        </motion.div>
      </section>

      {/* Selected Coverage — Empty State */}
      <section className="section-noir section-padding-lg">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1 }}
          className="container-wide"
        >
          <div className="text-center mb-20">
            <p className="text-noir/50 text-sm tracking-[0.2em] uppercase font-medium mb-4">
              {t('articles')}
            </p>
            <h2 className="title-section text-blanc">Selected Coverage</h2>
          </div>

          {/* Empty state */}
          <div className="text-center py-16">
            <div className="w-16 h-px bg-blanc/10 mx-auto mb-8" />
            <p className="text-blanc/40 text-lg font-display tracking-wide mb-3">
              {t('comingSoon')}
            </p>
            <p className="text-blanc/25 text-sm tracking-wide">
              {t('stayTuned')}
            </p>
            <div className="w-16 h-px bg-blanc/10 mx-auto mt-8" />
          </div>
        </motion.div>
      </section>

      {/* Press Contact Section */}
      <section className="section-blanc section-padding-lg">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="container-wide"
        >
          <div className="grid md:grid-cols-2 gap-20 items-center">
            {/* Contact Info */}
            <div>
              <p className="text-noir/50 text-sm tracking-[0.2em] uppercase font-medium mb-4">
                {t('contact')}
              </p>
              <h2 className="font-display text-3xl md:text-4xl text-noir mb-6 tracking-wide">
                Media Inquiries
              </h2>
              <p className="text-noir/70 text-lg leading-relaxed mb-8">
                For press inquiries, interview requests, and media collaborations,
                please contact our press office. We respond within 24 hours.
              </p>
              <a
                href="mailto:press@orusgallery.com"
                className="text-noir hover:text-or text-xl font-display transition-colors duration-300"
              >
                press@orusgallery.com
              </a>
            </div>

            {/* Press Kit */}
            <div className="bg-blanc border border-noir/10 p-10 md:p-12">
              <div className="w-16 h-16 mb-6 border border-noir/15 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-noir/40"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="font-display text-2xl text-noir mb-4">{t('kit')}</h3>
              <p className="text-noir/60 text-base mb-8 leading-relaxed">
                Download our press kit including high-resolution images,
                gallery information, and artist biographies.
              </p>
              <button className="btn-secondary-dark opacity-50 cursor-not-allowed">
                Coming Soon
              </button>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
