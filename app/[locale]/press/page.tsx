'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';

// Placeholder press articles
const pressArticles = [
  {
    id: 1,
    publication: 'Art Basel',
    title: 'Emerging Galleries to Watch in Asia',
    date: '2024',
    image: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=600&q=80',
  },
  {
    id: 2,
    publication: 'Artnet News',
    title: 'The Rise of Taiwan\'s Contemporary Art Scene',
    date: '2024',
    image: 'https://images.unsplash.com/photo-1541367777708-7905fe3296c0?w=600&q=80',
  },
  {
    id: 3,
    publication: 'Frieze',
    title: 'Cross-Cultural Dialogues in Contemporary Art',
    date: '2024',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&q=80',
  },
];

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

      {/* Press Contact Section */}
      <section className="section-blanc section-padding">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="container-wide"
        >
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Contact Info */}
            <div>
              <p className="text-or text-sm tracking-[0.2em] uppercase font-medium mb-4">
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
              <div className="w-16 h-16 mb-6 border border-or/40 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-or"
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

      {/* Press Coverage Section */}
      <section className="section-noir section-padding-lg">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1 }}
          className="container-wide"
        >
          <div className="text-center mb-16">
            <p className="text-eyebrow mb-4">{t('articles')}</p>
            <h2 className="title-section text-blanc">Selected Coverage</h2>
          </div>

          {/* Articles Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {pressArticles.map((article, index) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div className="aspect-[4/3] relative overflow-hidden mb-6">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-noir/60 to-transparent" />
                </div>
                <p className="text-or text-xs tracking-[0.15em] uppercase mb-2">
                  {article.publication} — {article.date}
                </p>
                <h3 className="font-display text-xl text-blanc group-hover:text-or transition-colors duration-300">
                  {article.title}
                </h3>
              </motion.article>
            ))}
          </div>

          {/* Note */}
          <p className="text-blanc/40 text-sm text-center mt-16 tracking-wide">
            Press coverage examples. Full archive coming soon.
          </p>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="section-blanc section-padding">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="container-narrow text-center"
        >
          <h2 className="font-display text-2xl md:text-3xl text-noir mb-6">
            General Inquiries
          </h2>
          <p className="text-noir/70 mb-10 tracking-wide">
            For non-media inquiries, please visit our contact page
          </p>
          <Link href="/contact" className="btn-primary">
            Contact Us
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
