'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="bg-noir border-t border-blanc/10">
      <div className="py-10 md:py-12 px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Line 1 — Info */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
            <a
              href="mailto:info@orusgallery.com"
              className="text-blanc hover:text-or text-sm tracking-[0.08em] transition-colors duration-300"
            >
              info@orusgallery.com
            </a>
            <div className="hidden md:block w-px h-4 bg-or" />
            <span className="text-blanc/60 text-sm tracking-[0.08em]">
              {t('appointment')}
            </span>
            <div className="hidden md:block w-px h-4 bg-or" />
            <span className="text-blanc/60 text-sm tracking-[0.08em]">
              {t('cities')}
            </span>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-blanc/10" />

          {/* Line 2 — Legal */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 text-blanc/40 text-xs tracking-wider">
            <span>{t('copyright')}</span>
            <span className="hidden md:inline">&middot;</span>
            <Link href="/privacy" className="hover:text-or transition-colors duration-300">
              {t('privacy')}
            </Link>
            <span className="hidden md:inline">&middot;</span>
            <Link href="/terms" className="hover:text-or transition-colors duration-300">
              {t('terms')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
