'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

export default function PressPage() {
  const t = useTranslations('press');

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
          <h1 className="title-section text-noir mb-6">{t('hero.title')}</h1>
          <div className="divider-gold mx-auto mt-10" />
        </motion.div>
      </section>

      {/* Press Articles — Placeholder Cards */}
      <section className="bg-blanc-muted section-padding-lg">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1 }}
          className="container-wide"
        >
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 * (index + 1) }}
                className="bg-blanc border border-noir/10 p-10"
              >
                <div className="w-full h-48 bg-noir/5 mb-6 flex items-center justify-center">
                  <div className="w-12 h-px bg-noir/15" />
                </div>
                <p className="text-noir/30 text-sm tracking-[0.1em] uppercase font-display">
                  {t('coverage.placeholder')}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Press Contact Section */}
      <section className="bg-blanc section-padding-lg">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="container-narrow text-center"
        >
          <h2 className="font-display text-3xl md:text-4xl text-noir mb-8 tracking-wide">
            {t('contact.title')}
          </h2>

          <p className="text-noir/60 text-lg leading-relaxed mb-6 max-w-2xl mx-auto">
            {t('contact.instruction')}
          </p>

          <a
            href="mailto:contact@orusgallery.com"
            className="text-noir hover:text-noir/70 text-xl font-display transition-colors duration-300"
          >
            contact@orusgallery.com
          </a>

          <div className="w-16 h-px bg-noir/10 mx-auto my-10" />

          <p className="text-noir/50 text-base leading-relaxed max-w-2xl mx-auto">
            {t('contact.text')}
          </p>
        </motion.div>
      </section>
    </div>
  );
}
