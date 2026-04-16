'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="border-t" style={{ backgroundColor: '#FAFAFA', borderColor: '#E6E6E6' }}>
      <div className="py-10 md:py-12 px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Line 1 — Info */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
            <a
              href="mailto:contact@orusgallery.com"
              className="text-sm tracking-[0.08em] transition-colors duration-300"
              style={{ color: '#0B0B0B' }}
            >
              contact@orusgallery.com
            </a>
            <div className="hidden md:block w-px h-4" style={{ backgroundColor: '#4A7C6F' }} />
            <span className="text-sm tracking-[0.08em]" style={{ color: '#6E6E6E' }}>
              {t('appointment')}
            </span>
            <div className="hidden md:block w-px h-4" style={{ backgroundColor: '#4A7C6F' }} />
            <span className="text-sm tracking-[0.08em]" style={{ color: '#6E6E6E' }}>
              {t('cities')}
            </span>
          </div>

          {/* Divider */}
          <div className="w-full h-px" style={{ backgroundColor: '#E6E6E6' }} />

          {/* Line 2 — Legal */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 text-xs tracking-wider" style={{ color: 'rgba(11, 11, 11, 0.4)' }}>
            <span className="hover:text-noir transition-colors duration-300">
              {t('copyright')}
            </span>
            <span className="hidden md:inline">&middot;</span>
            <Link href="/privacy" className="hover:text-noir transition-colors duration-300">
              {t('privacy')}
            </Link>
            <span className="hidden md:inline">&middot;</span>
            <Link href="/terms" className="hover:text-noir transition-colors duration-300">
              {t('terms')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
