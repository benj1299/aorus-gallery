'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import { use, useState } from 'react';
import { getArtistById } from '@/lib/artists-data';
import Image from 'next/image';
import { Lightbox } from '@/components/Lightbox';

interface ArtistPageProps {
  params: Promise<{ id: string }>;
}

export default function ArtistPage({ params }: ArtistPageProps) {
  const { id } = use(params);
  const t = useTranslations('artist');
  const artist = getArtistById(id);

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // 404 state
  if (!artist) {
    return (
      <div className="min-h-screen pt-header bg-paper flex items-center justify-center px-edge">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="font-display text-3xl text-ink mb-4">
            {t('notFound')}
          </h1>
          <p className="text-stone text-base mb-10 max-w-md mx-auto">
            {t('notFoundMessage')}
          </p>
          <Link href="/artists" className="btn-primary">
            {t('backToArtists')}
          </Link>
        </motion.div>
      </div>
    );
  }

  // Coming-soon state — clean placeholder, no empty shells
  if (artist.contentStatus === 'coming-soon') {
    return (
      <div className="min-h-screen pt-header bg-paper px-edge">
        <div className="container-narrow py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Back */}
            <Link
              href="/artists"
              className="inline-flex items-center gap-2 text-stone hover:text-ink transition-colors duration-200 text-sm tracking-[0.1em] uppercase mb-16 group"
            >
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1"
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
              {t('backToArtists')}
            </Link>

            {/* Artist name */}
            <h1 className="font-display text-4xl md:text-5xl text-ink mb-4">
              {artist.name}
            </h1>
            {artist.nationality && (
              <p className="text-stone text-sm tracking-[0.12em] uppercase mb-12">
                {artist.nationality}
              </p>
            )}

            <div className="divider-jade mb-12" />

            {/* Profile in preparation */}
            <p className="text-stone text-base leading-relaxed max-w-lg mb-12">
              {t('comingSoonMessage')}
            </p>

            {/* Inquiry CTA */}
            <div>
              <p className="text-micro mb-6">{t('interestedInArtist')}</p>
              <Link href="/contact" className="btn-primary">
                {t('inquireAboutArtist', { name: artist.name })}
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Full profile
  const selectedWorks = artist.works.slice(0, 12);
  const hasWorks = selectedWorks.length > 0;
  const hasStatement = artist.statement && artist.statement.trim().length > 0;

  const hasExhibitions = artist.cv.exhibitions.length > 0;
  const hasFairs = artist.cv.fairs.length > 0;
  const hasResidencies = artist.cv.residencies.length > 0;
  const hasAwards = artist.cv.awards.length > 0;
  const hasCollections = artist.cv.collections.length > 0;
  const hasPress = artist.cv.press.length > 0;
  const hasCV = hasExhibitions || hasFairs || hasResidencies || hasAwards || hasCollections || hasPress;

  return (
    <div className="flex flex-col bg-paper min-h-screen">
      {/* Lightbox */}
      <Lightbox
        works={selectedWorks}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
        artistName={artist.name}
      />

      {/* ── Back link ──────────────────────────────────────────── */}
      <div className="pt-header px-edge">
        <div className="container-wide py-8">
          <Link
            href="/artists"
            className="inline-flex items-center gap-2 text-stone hover:text-ink transition-colors duration-200 text-sm tracking-[0.1em] uppercase group"
          >
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1"
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
            {t('backToArtists')}
          </Link>
        </div>
      </div>

      {/* ── 1. Artist Header ────────────────────────────────────── */}
      <section className="px-edge pb-16 md:pb-20">
        <div className="container-narrow">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="font-display text-ink mb-3">
              {artist.name}
            </h1>

            {/* Birth info */}
            {(artist.birthYear || artist.birthPlace) && (
              <p className="text-stone text-base mb-1">
                {artist.birthYear && artist.birthPlace
                  ? `(b. ${artist.birthYear}, ${artist.birthPlace})`
                  : artist.birthYear
                  ? `(b. ${artist.birthYear})`
                  : `(b. ${artist.birthPlace})`}
              </p>
            )}

            {/* Location */}
            {artist.location && (
              <p className="text-stone text-sm tracking-[0.05em] mb-8">
                {artist.location}
              </p>
            )}

            <div className="divider-jade" />
          </motion.div>
        </div>
      </section>

      {/* ── 2. Bio ──────────────────────────────────────────────── */}
      {artist.bio && (
        <section className="px-edge pb-16 md:pb-20">
          <div className="container-narrow">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-micro mb-6">{t('biography')}</p>
              <p className="text-ink/80 text-base leading-relaxed max-w-[68ch]">
                {artist.bio}
              </p>
            </motion.div>
          </div>
        </section>
      )}

      {/* ── 3. Artist Statement ─────────────────────────────────── */}
      {hasStatement && (
        <section className="px-edge pb-16 md:pb-20 bg-paper-muted border-t border-hairline border-b">
          <div className="container-narrow py-16 md:py-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-micro mb-6">{t('statement')}</p>
              <blockquote className="font-display text-xl md:text-2xl text-ink leading-relaxed italic">
                {artist.statement}
              </blockquote>
            </motion.div>
          </div>
        </section>
      )}

      {/* ── 4. Selected Works ───────────────────────────────────── */}
      {hasWorks && (
        <section className="px-edge py-16 md:py-20">
          <div className="container-wide">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-micro mb-10">{t('selectedWorks')}</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
              {selectedWorks.map((work, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.06 }}
                  onClick={() => setLightboxIndex(index)}
                  className="group text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jade focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
                  aria-label={`View ${work.title}`}
                >
                  {/* Image */}
                  <div className="card-artwork aspect-[4/3] relative overflow-hidden">
                    <Image
                      src={work.image}
                      alt={work.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/10 transition-colors duration-500" />
                    {/* Zoom icon */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-10 h-10 border border-paper/60 flex items-center justify-center">
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-paper" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Caption */}
                  <div className="pt-3 pb-6">
                    <p className="font-display italic text-ink text-base">{work.title}</p>
                    <p className="text-stone text-sm mt-0.5">
                      {[work.year, work.medium, work.dimensions].filter(Boolean).join(' · ')}
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 6. CV ───────────────────────────────────────────────── */}
      {hasCV && (
        <section className="px-edge py-16 md:py-20 border-t border-hairline">
          <div className="container-narrow">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-micro mb-10">{t('cv')}</p>

              <div className="space-y-10">
                {/* Exhibitions */}
                {hasExhibitions && (
                  <div>
                    <h3 className="font-display text-lg text-ink mb-4 tracking-wide">
                      {t('exhibitions')}
                    </h3>
                    <ul className="space-y-2">
                      {artist.cv.exhibitions.map((item, i) => (
                        <li key={i} className="text-stone text-sm leading-relaxed">
                          {[item.title, item.venue, item.city, item.year].filter(Boolean).join(', ')}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Fairs */}
                {hasFairs && (
                  <div>
                    <h3 className="font-display text-lg text-ink mb-4 tracking-wide">
                      {t('fairs')}
                    </h3>
                    <ul className="space-y-2">
                      {artist.cv.fairs.map((item, i) => (
                        <li key={i} className="text-stone text-sm leading-relaxed">
                          {[item.name, item.gallery, item.city, item.year].filter(Boolean).join(', ')}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Residencies */}
                {hasResidencies && (
                  <div>
                    <h3 className="font-display text-lg text-ink mb-4 tracking-wide">
                      {t('residencies')}
                    </h3>
                    <ul className="space-y-2">
                      {artist.cv.residencies.map((item, i) => (
                        <li key={i} className="text-stone text-sm leading-relaxed">
                          {[item.name, item.city, item.year].filter(Boolean).join(', ')}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Awards */}
                {hasAwards && (
                  <div>
                    <h3 className="font-display text-lg text-ink mb-4 tracking-wide">
                      {t('awards')}
                    </h3>
                    <ul className="space-y-2">
                      {artist.cv.awards.map((item, i) => (
                        <li key={i} className="text-stone text-sm leading-relaxed">
                          {[item.name, item.year].filter(Boolean).join(', ')}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Collections */}
                {hasCollections && (
                  <div>
                    <h3 className="font-display text-lg text-ink mb-4 tracking-wide">
                      {t('collections')}
                    </h3>
                    <ul className="space-y-2">
                      {artist.cv.collections.map((item, i) => (
                        <li key={i} className="text-stone text-sm leading-relaxed">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Press */}
                {hasPress && (
                  <div>
                    <h3 className="font-display text-lg text-ink mb-4 tracking-wide">
                      {t('press')}
                    </h3>
                    <ul className="space-y-2">
                      {artist.cv.press.map((item, i) => (
                        <li key={i} className="text-stone text-sm leading-relaxed">
                          {item.url ? (
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-ink transition-colors duration-200 underline underline-offset-2"
                            >
                              {[item.title, item.publication, item.year].filter(Boolean).join(', ')}
                            </a>
                          ) : (
                            [item.title, item.publication, item.year].filter(Boolean).join(', ')
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ── 7. Downloads ────────────────────────────────────────── */}
      <section className="px-edge py-12 border-t border-hairline">
        <div className="container-narrow">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7 }}
            className="flex flex-wrap gap-4"
          >
            <a
              href="#"
              className="btn-secondary-light inline-flex items-center gap-3 text-sm"
              aria-label={`Download CV for ${artist.name}`}
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
              {t('downloadCV')}
            </a>
            <a
              href="#"
              className="btn-secondary-light inline-flex items-center gap-3 text-sm"
              aria-label={`Download Press Kit for ${artist.name}`}
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
              {t('downloadPressKit')}
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── 8. Inquiry Module ───────────────────────────────────── */}
      <section className="px-edge py-16 md:py-24 bg-ink">
        <div className="container-narrow">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-micro mb-6" style={{ color: '#6E6E6E' }}>
              {t('inquireLabel')}
            </p>
            <h2 className="font-display text-2xl md:text-3xl text-paper mb-10 leading-snug">
              {t('inquireHeading', { name: artist.name })}
            </h2>

            <InquiryForm artistName={artist.name} t={t} />

            <p className="text-stone text-xs mt-6 max-w-md leading-relaxed">
              {t('rgpd')}
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

// ── Inquiry form (inline, no server action needed) ──────────────
interface InquiryFormProps {
  artistName: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: (key: string, values?: Record<string, string>) => string;
}

function InquiryForm({ artistName, t }: InquiryFormProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const name = (form.elements.namedItem('name') as HTMLInputElement).value;
        const email = (form.elements.namedItem('email') as HTMLInputElement).value;
        const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value;
        const subject = encodeURIComponent(`Inquiry about ${artistName}`);
        const body = encodeURIComponent(`Name: ${name}\n\n${message}`);
        window.location.href = `/contact?subject=${subject}&email=${encodeURIComponent(email)}&body=${body}`;
      }}
      className="space-y-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="inq-name" className="block text-paper/60 text-xs tracking-[0.1em] uppercase mb-2">
            {t('form.name')}
          </label>
          <input
            id="inq-name"
            name="name"
            type="text"
            required
            placeholder={t('form.namePlaceholder')}
            className="w-full bg-transparent border border-paper/20 text-paper placeholder-paper/30 px-4 py-3 text-sm focus:border-jade focus:outline-none transition-colors duration-200"
          />
        </div>
        <div>
          <label htmlFor="inq-email" className="block text-paper/60 text-xs tracking-[0.1em] uppercase mb-2">
            {t('form.email')}
          </label>
          <input
            id="inq-email"
            name="email"
            type="email"
            required
            placeholder={t('form.emailPlaceholder')}
            className="w-full bg-transparent border border-paper/20 text-paper placeholder-paper/30 px-4 py-3 text-sm focus:border-jade focus:outline-none transition-colors duration-200"
          />
        </div>
      </div>
      <div>
        <label htmlFor="inq-message" className="block text-paper/60 text-xs tracking-[0.1em] uppercase mb-2">
          {t('form.message')}
        </label>
        <textarea
          id="inq-message"
          name="message"
          rows={4}
          required
          placeholder={t('form.messagePlaceholder', { artist: artistName })}
          className="w-full bg-transparent border border-paper/20 text-paper placeholder-paper/30 px-4 py-3 text-sm focus:border-jade focus:outline-none transition-colors duration-200 resize-none"
        />
      </div>
      <button type="submit" className="btn-primary">
        {t('form.submit')}
      </button>
    </form>
  );
}
