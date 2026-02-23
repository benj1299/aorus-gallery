'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

const fadeUpDelayed = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 } as { opacity: number; y: number },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.8, delay, ease: [0.2, 0.8, 0.2, 1] as [number, number, number, number] },
});

export default function AboutPage() {
  const t = useTranslations('about');

  return (
    <div className="flex flex-col bg-paper">
      {/* Page Header */}
      <section className="hero-offset section-paper">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
          className="container-narrow"
        >
          <h1 className="font-display text-5xl md:text-6xl text-ink tracking-[-0.01em] leading-tight mb-4">
            {t('title')}
          </h1>
          <div className="divider-jade mt-8" />
        </motion.div>
      </section>

      {/* Mission */}
      <section className="section-paper section-padding">
        <div className="container-default">
          <motion.div {...fadeUpDelayed(0)} className="mb-20">
            <p className="text-micro mb-10">{t('mission.label')}</p>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl">
              <p className="text-ink text-base leading-relaxed">
                {t('mission.text1')}
              </p>
              <p className="text-stone text-base leading-relaxed">
                {t('mission.text2')}
              </p>
              <p className="text-stone text-base leading-relaxed">
                {t('mission.text3')}
              </p>
            </div>
          </motion.div>

          <div className="border-t border-hairline" />
        </div>
      </section>

      {/* Program + Method — two-column */}
      <section className="section-paper py-20 px-6 md:px-12 lg:px-20">
        <div className="container-default">
          <div className="grid md:grid-cols-2 gap-16 md:gap-24">
            {/* Program */}
            <motion.div {...fadeUpDelayed(0)}>
              <p className="text-micro mb-8">{t('program.label')}</p>
              <ul className="space-y-4">
                {(['item1', 'item2', 'item3', 'item4'] as const).map((key, index) => (
                  <li
                    key={key}
                    className="flex items-baseline gap-4 text-ink text-base"
                  >
                    <span className="text-xs text-stone tabular-nums w-5 shrink-0">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span>{t(`program.${key}`)}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Method */}
            <motion.div {...fadeUpDelayed(0.1)}>
              <p className="text-micro mb-8">{t('method.label')}</p>
              <ul className="space-y-5">
                {(['principle1', 'principle2', 'principle3'] as const).map((key) => (
                  <li
                    key={key}
                    className="border-l-2 border-jade pl-5 text-ink text-base leading-relaxed"
                  >
                    {t(`method.${key}`)}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Locations */}
      <section className="section-paper py-20 px-6 md:px-12 lg:px-20 border-t border-hairline">
        <div className="container-default">
          <motion.div {...fadeUpDelayed(0)}>
            <p className="text-micro mb-8">{t('locations.label')}</p>
            <div className="flex flex-col sm:flex-row gap-10 sm:gap-20">
              <div>
                <p className="font-display text-2xl text-ink mb-1">{t('locations.taipei')}</p>
                <p className="text-stone text-sm tracking-[0.08em] uppercase">
                  {t('locations.appointment')}
                </p>
              </div>
              <div className="hidden sm:block w-px bg-hairline self-stretch" />
              <div>
                <p className="font-display text-2xl text-ink mb-1">{t('locations.paris')}</p>
                <p className="text-stone text-sm tracking-[0.08em] uppercase">
                  {t('locations.appointment')}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Team */}
      <section className="section-paper py-20 px-6 md:px-12 lg:px-20 border-t border-hairline">
        <div className="container-default">
          <motion.div {...fadeUpDelayed(0)}>
            <p className="text-micro mb-8">{t('team.label')}</p>
            <p className="text-stone text-base leading-relaxed max-w-xl">
              {t('team.placeholder')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Partnerships */}
      <section className="section-paper py-20 px-6 md:px-12 lg:px-20 border-t border-hairline">
        <div className="container-default">
          <motion.div {...fadeUpDelayed(0)}>
            <p className="text-micro mb-8">{t('partnerships.label')}</p>
            <p className="text-stone text-base leading-relaxed max-w-2xl">
              {t('partnerships.description')}
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
