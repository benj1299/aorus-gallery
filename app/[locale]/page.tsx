'use client';

import { useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { useRef } from 'react';
import { getArtists } from '@/lib/artists-data';

// ─── Animation helpers ────────────────────────────────────────────────────────

function FadeInUp({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ─── Roster data (filtered at module level) ───────────────────────────────────

const rosterArtists = getArtists()
  .filter((a) => a.contentStatus !== 'coming-soon')
  .slice(0, 6);

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const t = useTranslations('home');

  return (
    <div className="flex flex-col">

      {/* ═══════════════════════════════════════════════════════════════════════
          BLOC 1 — HERO
      ═══════════════════════════════════════════════════════════════════════ */}
      <section
        id="hero"
        className="relative min-h-screen overflow-hidden bg-ink"
      >
        {/* Full-bleed artwork image */}
        <Image
          src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1600&q=80"
          alt="ORUS Gallery — artwork"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />

        {/* Subtle vignette to make text legible */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(11,11,11,0.72) 0%, rgba(11,11,11,0.18) 50%, rgba(11,11,11,0.08) 100%)',
          }}
        />

        {/* Bottom-left: H1 + location tagline */}
        <div className="absolute bottom-0 left-0 px-edge pb-12 md:pb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
            className="text-paper font-display text-5xl md:text-[56px] leading-none tracking-[-0.02em] mb-4"
          >
            {t('hero.title')}
          </motion.h1>

          {/* Taipei — jade segment — Paris */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
            className="flex items-center gap-3"
          >
            <span className="text-stone text-[18px] tracking-[0.06em]">
              {t('hero.location')}
            </span>
            {/* Jade separator segment */}
            <span
              className="inline-block h-px w-6 bg-jade flex-shrink-0"
              aria-hidden="true"
            />
            <span className="text-stone text-[18px] tracking-[0.06em]">
              {t('hero.locationSeparator')}
            </span>
          </motion.div>
        </div>

        {/* Bottom-right: CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
          className="absolute bottom-0 right-0 px-edge pb-12 md:pb-16"
        >
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 border border-paper text-paper px-6 py-3 text-sm tracking-[0.12em] uppercase transition-all duration-[140ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:bg-paper hover:text-ink"
          >
            <span>{t('hero.cta')}</span>
            {/* Jade arrow icon */}
            <svg
              width="18"
              height="12"
              viewBox="0 0 18 12"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M0 6H16M11 1L16 6L11 11"
                stroke="#4BAF91"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          BLOC 2 — NOW / UPCOMING
      ═══════════════════════════════════════════════════════════════════════ */}
      <section
        id="activity"
        className="section-paper border-b border-hairline"
      >
        <div className="container-wide px-edge py-16 md:py-20">

          {/* Section micro-label */}
          <FadeInUp>
            <span className="text-micro block mb-10">{t('activity.sectionLabel')}</span>
          </FadeInUp>

          <div className="grid md:grid-cols-2 gap-0 md:gap-px">

            {/* Column A — Current */}
            <FadeInUp delay={0.05}>
              <div className="py-8 md:py-10 md:pr-12 border-b border-hairline md:border-b-0 md:border-r">
                <span className="text-micro block mb-6">{t('activity.currentLabel')}</span>
                <p className="text-stone text-sm tracking-[0.04em] uppercase mb-2">
                  {t('activity.currentFormat')}
                </p>
                <h3 className="font-display text-2xl md:text-3xl text-ink mb-6 tracking-[0.02em]">
                  {t('activity.currentTitle')}
                </h3>
                <Link
                  href="/contact"
                  className="btn-text"
                >
                  {t('activity.currentCta')}
                  <svg
                    width="16"
                    height="10"
                    viewBox="0 0 16 10"
                    fill="none"
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  >
                    <path
                      d="M0 5H14M9.5 1L14 5L9.5 9"
                      stroke="currentColor"
                      strokeWidth="1.25"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </div>
            </FadeInUp>

            {/* Column B — Upcoming */}
            <FadeInUp delay={0.1}>
              <div className="py-8 md:py-10 md:pl-12">
                <span className="text-micro block mb-6">{t('activity.upcomingLabel')}</span>
                <p className="text-stone text-sm tracking-[0.04em] uppercase mb-2">
                  {t('activity.upcomingDate')} — {t('activity.upcomingCity')}
                </p>
                <h3 className="font-display text-2xl md:text-3xl text-ink mb-1 tracking-[0.02em]">
                  {t('activity.upcomingTitle')}
                </h3>
                <p className="text-stone text-sm mb-6">{t('activity.upcomingFormat')}</p>
                <Link
                  href="/contact"
                  className="btn-text"
                >
                  {t('activity.upcomingCta')}
                  <svg
                    width="16"
                    height="10"
                    viewBox="0 0 16 10"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M0 5H14M9.5 1L14 5L9.5 9"
                      stroke="currentColor"
                      strokeWidth="1.25"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </div>
            </FadeInUp>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          BLOC 3 — ROSTER PREVIEW
      ═══════════════════════════════════════════════════════════════════════ */}
      <section id="roster" className="section-paper border-b border-hairline">
        <div className="container-wide px-edge py-16 md:py-20">

          <FadeInUp>
            <span className="text-micro block mb-10">{t('roster.sectionLabel')}</span>
          </FadeInUp>

          {/* Artist grid — monochrome cards, 4:5 ratio */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1">
            {rosterArtists.map((artist, index) => (
              <FadeInUp key={artist.id} delay={index * 0.06}>
                <Link href={`/artists/${artist.slug}`} className="block group">
                  <div className="relative aspect-[4/5] overflow-hidden bg-paper-muted">
                    {/* Artist photo — grayscale by default */}
                    <Image
                      src={artist.image}
                      alt={artist.name}
                      fill
                      className="object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                      onError={(e) => {
                        // fallback handled by placeholder div below
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />

                    {/* Placeholder for missing images */}
                    <div className="absolute inset-0 flex items-center justify-center bg-paper-muted -z-10">
                      <span className="font-display text-3xl text-ink/10 tracking-[0.2em]">
                        {artist.name
                          .split(' ')
                          .map((w) => w[0])
                          .join('')}
                      </span>
                    </div>

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/60 transition-colors duration-500 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100">
                      <p className="text-stone text-xs tracking-[0.08em] mb-1">
                        {t('roster.basedIn')} {artist.location.replace(/^Lives and works in\s*/i, '').replace(/^Lives and works between\s*/i, '')}
                      </p>
                      <span className="text-paper text-xs tracking-[0.1em] uppercase underline underline-offset-4 decoration-jade decoration-[1px]">
                        {t('roster.viewArtist')}
                      </span>
                    </div>
                  </div>

                  {/* Artist name below card */}
                  <p className="mt-2 text-ink text-sm tracking-[0.04em]">
                    {artist.name}
                  </p>
                  <p className="text-stone text-xs tracking-[0.02em]">
                    {artist.medium}
                  </p>
                </Link>
              </FadeInUp>
            ))}
          </div>

          {/* View all artists link */}
          <FadeInUp delay={0.15}>
            <div className="mt-10">
              <Link href="/artists" className="btn-text group inline-flex items-center gap-3">
                <span>View all artists</span>
                <svg
                  width="18"
                  height="12"
                  viewBox="0 0 18 12"
                  fill="none"
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  <path
                    d="M0 6H16M11 1L16 6L11 11"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>
          </FadeInUp>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          BLOC 4 — STATEMENT
      ═══════════════════════════════════════════════════════════════════════ */}
      <section id="statement" className="section-paper border-b border-hairline">
        <div className="container-wide px-edge py-16 md:py-20">

          <FadeInUp>
            <span className="text-micro block mb-10">{t('statement.sectionLabel')}</span>
          </FadeInUp>

          <FadeInUp delay={0.08}>
            <div className="max-w-[680px]">
              <div className="divider-jade mb-8" aria-hidden="true" />
              <p className="text-ink text-lg md:text-xl leading-[1.65] tracking-[0.01em]">
                {t('statement.text')}
              </p>
            </div>
          </FadeInUp>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          BLOC 5 — CONTACT STRIP
      ═══════════════════════════════════════════════════════════════════════ */}
      <section id="contact-strip" className="section-paper">
        <div className="container-wide px-edge py-10">

          <FadeInUp>
            <div className="flex flex-wrap items-center gap-y-3 gap-x-0 text-sm tracking-[0.04em]">

              {/* General inquiries */}
              <span className="text-stone">{t('contact.general')}:&nbsp;</span>
              <a
                href={`mailto:${t('contact.generalEmail')}`}
                className="text-ink hover:text-jade transition-colors duration-[140ms]"
              >
                {t('contact.generalEmail')}
              </a>

              {/* Jade vertical separator */}
              <span
                className="hidden md:block mx-6 w-px h-4 bg-jade flex-shrink-0"
                aria-hidden="true"
              />

              {/* Press */}
              <span className="text-stone md:hidden w-full" aria-hidden="true" />
              <span className="text-stone">{t('contact.press')}:&nbsp;</span>
              <a
                href={`mailto:${t('contact.pressEmail')}`}
                className="text-ink hover:text-jade transition-colors duration-[140ms]"
              >
                {t('contact.pressEmail')}
              </a>

              {/* Jade vertical separator */}
              <span
                className="hidden md:block mx-6 w-px h-4 bg-jade flex-shrink-0"
                aria-hidden="true"
              />

              {/* Appointment notice */}
              <span className="text-stone md:hidden w-full" aria-hidden="true" />
              <span className="text-stone">{t('contact.appointment')}</span>

              {/* Jade vertical separator */}
              <span
                className="hidden md:block mx-6 w-px h-4 bg-jade flex-shrink-0"
                aria-hidden="true"
              />

              {/* Response time */}
              <span className="text-stone md:hidden w-full" aria-hidden="true" />
              <span className="text-stone">{t('contact.response')}</span>

            </div>
          </FadeInUp>

        </div>
      </section>

    </div>
  );
}
