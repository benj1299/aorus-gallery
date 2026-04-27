'use client';

import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { PageHero } from '@/components/PageHero';
import { AnimatedSection } from '@/components/AnimatedSection';

interface PressArticle {
  id: string;
  slug: string;
  title: string;
  publication: string;
  publishedAt: Date;
  url: string | null;
  imageUrl: string | null;
  excerpt: string | null;
}

const LOCALE_DATE_MAP: Record<string, string> = {
  fr: 'fr-FR',
  en: 'en-GB',
  zh: 'zh-TW',
};

export function PressPageClient({ articles }: { articles: PressArticle[] }) {
  const t = useTranslations('press');
  const locale = useLocale();
  const dateLocale = LOCALE_DATE_MAP[locale] ?? 'en-GB';

  return (
    <div className="flex flex-col">
      <PageHero title={t('hero.title')} dividerClassName="mt-10" />

      <AnimatedSection
        bg="blanc"
        padding="lg"
        container="narrow"
        initial={{ opacity: 0, y: 40 }}
        transition={{ duration: 1 }}
        viewportMargin="-100px"
      >
        {articles.length > 0 ? (
          <div className="divide-y divide-noir/10">
            {articles.map((article, index) => {
              const formattedDate = new Date(article.publishedAt).toLocaleDateString(dateLocale, {
                year: 'numeric',
                month: 'long',
              });
              const titleNode = (
                <h3 className="font-display text-2xl md:text-3xl lg:text-4xl text-noir leading-[1.15] tracking-wide">
                  {article.title}
                </h3>
              );
              return (
                <motion.article
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.8, delay: 0.05 * index }}
                  className="grid md:grid-cols-12 gap-8 md:gap-12 py-14 md:py-20 first:pt-0 last:pb-0"
                >
                  {article.imageUrl ? (
                    <div className="md:col-span-4">
                      <div className="aspect-[4/3] relative overflow-hidden bg-blanc-muted">
                        <Image
                          src={article.imageUrl}
                          alt={article.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover transition-opacity duration-500 hover:opacity-90"
                        />
                      </div>
                    </div>
                  ) : null}
                  <div className={article.imageUrl ? 'md:col-span-8' : 'md:col-span-12'}>
                    <p className="text-[0.7rem] tracking-[0.25em] uppercase text-noir/55">
                      <span className="text-noir">{article.publication}</span>
                      <span className="text-noir/35 mx-3">/</span>
                      {formattedDate}
                    </p>
                    <div className="mt-5">
                      {article.url ? (
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block group"
                        >
                          <span className="block transition-opacity duration-300 group-hover:opacity-70">
                            {titleNode}
                          </span>
                        </a>
                      ) : (
                        titleNode
                      )}
                    </div>
                    {article.excerpt && (
                      <div
                        className="text-noir/65 text-base md:text-lg leading-relaxed font-body mt-6 max-w-2xl"
                        dangerouslySetInnerHTML={{ __html: article.excerpt }}
                      />
                    )}
                    {article.url && (
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-8 inline-block border-b border-noir/40 pb-1.5 text-[0.7rem] tracking-[0.25em] uppercase text-noir hover:border-noir transition-colors duration-300"
                      >
                        {t('readArticle', { defaultValue: 'Lire l’article' })}
                      </a>
                    )}
                  </div>
                </motion.article>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="text-noir/50 text-sm tracking-[0.1em] uppercase">
              {t('coverage.placeholder')}
            </p>
          </div>
        )}
      </AnimatedSection>

      <AnimatedSection
        bg="blanc-muted"
        padding="lg"
        container="narrow"
        containerClassName="text-center"
        initial={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        animateOnMount
      >
        <p className="text-noir/55 text-[0.7rem] tracking-[0.25em] uppercase mb-6">
          {t('contact.title')}
        </p>
        <p className="font-display text-noir text-2xl md:text-3xl tracking-wide leading-tight max-w-2xl mx-auto">
          {t('contact.instruction')}
        </p>
        <a
          href={`mailto:${t('contact.email')}`}
          className="mt-10 inline-block border-b border-noir/40 pb-1.5 text-sm tracking-[0.2em] uppercase text-noir hover:border-noir transition-colors duration-300"
        >
          {t('contact.email')}
        </a>
        <p className="text-noir/55 text-sm leading-relaxed max-w-xl mx-auto mt-12">
          {t('contact.text')}
        </p>
      </AnimatedSection>
    </div>
  );
}
