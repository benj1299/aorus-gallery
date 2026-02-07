'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');

  return (
    <footer className="bg-noir border-t border-blanc/10">
      {/* Minimal Footer - Single Row Layout */}
      <div className="py-12 md:py-16 px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">
          {/* Main content row */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Logo - 2 lines */}
            <Link
              href="/"
              className="flex flex-col items-center md:items-start"
            >
              <span
                className="font-display text-xl tracking-[0.15em] uppercase leading-none"
                style={{ color: '#C9A227' }}
              >
                ORUS
              </span>
              <span
                className="font-display text-xs tracking-[0.25em] uppercase text-blanc/50"
                style={{ fontWeight: 300 }}
              >
                gallery
              </span>
            </Link>

            {/* Navigation links - horizontal */}
            <nav className="flex items-center gap-6 md:gap-8">
              <Link
                href="/artists"
                className="text-blanc/60 hover:text-blanc text-xs tracking-[0.12em] uppercase transition-colors duration-300"
              >
                {tNav('artists')}
              </Link>
              <Link
                href="/about"
                className="text-blanc/60 hover:text-blanc text-xs tracking-[0.12em] uppercase transition-colors duration-300"
              >
                {tNav('about')}
              </Link>
              <Link
                href="/contact"
                className="text-blanc/60 hover:text-blanc text-xs tracking-[0.12em] uppercase transition-colors duration-300"
              >
                {tNav('contact')}
              </Link>
            </nav>

            {/* Email contact */}
            <a
              href="mailto:info@orusgallery.com"
              className="text-blanc/60 hover:text-or text-xs tracking-[0.08em] transition-colors duration-300"
            >
              info@orusgallery.com
            </a>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-blanc/10 my-8" />

          {/* Bottom row - copyright */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-blanc/40 text-xs tracking-wider">
            <p>{t('copyright')}</p>
            <p className="tracking-[0.15em] uppercase">Taiwan — Paris</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
