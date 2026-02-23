'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.2, 0.8, 0.2, 1] as [number, number, number, number] },
};

const fadeUpDelayed = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 } as { opacity: number; y: number },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.8, delay, ease: [0.2, 0.8, 0.2, 1] as [number, number, number, number] },
});

export default function PressPage() {
  const t = useTranslations('press');

  return (
    <div className="flex flex-col bg-paper">
      {/* Page Header */}
      <section className="hero-offset section-paper">
        <motion.div
          {...fadeUp}
          className="container-narrow"
        >
          <p className="text-micro mb-6">{t('title')}</p>
          <h1 className="font-display text-5xl md:text-6xl text-ink tracking-[-0.01em] leading-tight mb-4">
            {t('subtitle')}
          </h1>
          <div className="divider-jade mt-8" />
        </motion.div>
      </section>

      {/* Press Contact */}
      <section className="section-paper section-padding">
        <div className="container-default">
          <motion.div {...fadeUpDelayed(0)} className="mb-20">
            <p className="text-micro mb-8">{t('contact.label')}</p>
            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div>
                <a
                  href="mailto:press@orusgallery.com"
                  className="font-display text-2xl md:text-3xl text-ink hover:text-jade transition-colors duration-200 block mb-4"
                >
                  {t('contact.email')}
                </a>
                <p className="text-stone text-sm leading-relaxed">
                  {t('contact.response')}
                </p>
              </div>
              {/* Media Assets */}
              <div className="border-l border-hairline pl-10">
                <p className="text-micro mb-3">{t('assets.label')}</p>
                <p className="text-stone text-sm leading-relaxed">
                  {t('assets.description')}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Divider */}
          <div className="border-t border-hairline" />
        </div>
      </section>

      {/* Press Kit */}
      <section className="section-paper py-20 px-6 md:px-12 lg:px-20">
        <div className="container-default">
          <motion.div {...fadeUpDelayed(0)}>
            <p className="text-micro mb-8">{t('kit.label')}</p>
            <div className="border border-hairline p-8 md:p-10 max-w-2xl">
              <p className="font-display text-xl text-ink mb-4">
                {t('kit.status')}
              </p>
              <p className="text-stone text-sm leading-relaxed mb-6">
                {t('kit.includes')}
              </p>
              <p className="text-xs text-stone tracking-[0.1em] uppercase">
                {t('kit.request')}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Press Releases */}
      <section className="section-paper py-20 px-6 md:px-12 lg:px-20 border-t border-hairline">
        <div className="container-default">
          <motion.div {...fadeUpDelayed(0)}>
            <p className="text-micro mb-8">{t('releases.label')}</p>
            <p className="text-stone text-base leading-relaxed max-w-xl">
              {t('releases.empty')}
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
