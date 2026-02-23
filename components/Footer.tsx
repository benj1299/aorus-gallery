'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="bg-paper border-t border-hairline">
      <div className="container-wide px-edge py-6">
        {/* Line 1: Email | By appointment only | Taipei / Paris */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-0 text-stone text-xs tracking-[0.08em]">
          <a
            href="mailto:info@orusgallery.com"
            className="text-ink hover:text-jade transition-colors duration-200"
          >
            info@orusgallery.com
          </a>

          {/* Vertical jade separator */}
          <span
            className="hidden sm:block mx-4 bg-jade self-stretch"
            style={{ width: '1px', minHeight: '14px' }}
            aria-hidden="true"
          />

          <span>{t('appointment')}</span>

          {/* Vertical jade separator */}
          <span
            className="hidden sm:block mx-4 bg-jade self-stretch"
            style={{ width: '1px', minHeight: '14px' }}
            aria-hidden="true"
          />

          <span>{t('cities')}</span>
        </div>

        {/* Line 2: Copyright + Privacy / Terms */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mt-3 text-stone text-xs tracking-[0.06em]">
          <span className="text-ink">{t('copyright')}</span>

          <span className="hidden sm:inline text-hairline">·</span>

          <Link
            href="/privacy"
            className="hover:text-ink transition-colors duration-200"
          >
            {t('privacy')}
          </Link>

          <span className="hidden sm:inline text-hairline">·</span>

          <Link
            href="/terms"
            className="hover:text-ink transition-colors duration-200"
          >
            {t('terms')}
          </Link>
        </div>
      </div>
    </footer>
  );
}
