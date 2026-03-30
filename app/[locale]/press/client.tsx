'use client';

import { useTranslations } from 'next-intl';
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

export function PressPageClient({ articles }: { articles: PressArticle[] }) {
  const t = useTranslations('press');

  return (
    <div className="flex flex-col">
      <PageHero title={t('hero.title')} dividerClassName="mt-10" />

      <AnimatedSection
        bg="blanc-muted"
        padding="lg"
        container="narrow"
        initial={{ opacity: 0, y: 40 }}
        transition={{ duration: 1 }}
        viewportMargin="-100px"
      >
        {articles.length > 0 ? (
          <div className="space-y-6">
            {articles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 * (index + 1) }}
                className="bg-blanc border border-noir/10 p-8 flex items-start gap-8"
              >
                {article.imageUrl && (
                  <div className="w-20 h-20 md:w-32 md:h-32 shrink-0 relative overflow-hidden">
                    <Image src={article.imageUrl} alt={article.title} fill className="object-cover" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-or text-xs tracking-[0.15em] uppercase mb-2">
                    {article.publication} — {new Date(article.publishedAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })}
                  </p>
                  {article.url ? (
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-display text-lg text-noir hover:text-noir/70 transition-colors tracking-wide"
                    >
                      {article.title}
                    </a>
                  ) : (
                    <p className="font-display text-lg text-noir tracking-wide">{article.title}</p>
                  )}
                  {article.excerpt && (
                    <p className="text-noir/50 text-sm leading-relaxed mt-2">{article.excerpt}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-noir/50 text-sm tracking-[0.1em] uppercase">
              {t('coverage.placeholder')}
            </p>
          </div>
        )}
      </AnimatedSection>

      <AnimatedSection
        padding="lg"
        container="narrow"
        containerClassName="text-center"
        initial={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        animateOnMount
      >
        <h2 className="font-display text-3xl md:text-4xl text-noir mb-8 tracking-wide">
          {t('contact.title')}
        </h2>
        <p className="text-noir/60 text-lg leading-relaxed mb-6 max-w-2xl mx-auto">
          {t('contact.instruction')}
        </p>
        <a
          href={`mailto:${t('contact.email')}`}
          className="text-noir hover:text-noir/70 text-xl font-display transition-colors duration-300"
        >
          {t('contact.email')}
        </a>
        <div className="w-16 h-px bg-noir/10 mx-auto my-10" />
        <p className="text-noir/50 text-base leading-relaxed max-w-2xl mx-auto">
          {t('contact.text')}
        </p>
      </AnimatedSection>
    </div>
  );
}
