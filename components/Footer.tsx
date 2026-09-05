'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export function Footer() {
  const t = useTranslations('footer');
  const cities = t('contact.cities').replace(/\s*\/\s*/g, ' · ');

  return (
    <footer className="border-t border-hairline bg-blanc">
      <div className="px-edge py-12 md:py-14 lg:py-16">
        <div className="max-w-[1480px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-x-8 md:gap-x-10 lg:gap-x-12 gap-y-9 md:gap-y-10 lg:gap-y-0">
            <div className="sm:col-span-2 lg:col-span-5">
              <p className="font-display text-[2rem] md:text-[2.25rem] leading-none tracking-[0.05em] text-noir">
                ORUS
              </p>
              <p className="mt-4 text-[10px] md:text-[11px] tracking-[0.24em] uppercase text-noir/45">
                {cities}
              </p>
            </div>

            <div className="lg:col-span-3">
              <p className="text-[10px] tracking-[0.22em] uppercase text-noir/40 mb-3">
                {t('contact.title')}
              </p>
              <a
                href="mailto:contact@orusgallery.com"
                className="inline-block text-[13px] md:text-sm text-noir/85 hover:text-jade transition-colors duration-300"
              >
                contact@orusgallery.com
              </a>
            </div>

            <div className="lg:col-span-2">
              <p className="text-[10px] tracking-[0.22em] uppercase text-noir/40 mb-3">
                {t('press.title')}
              </p>
              <a
                href="mailto:press@orusgallery.com"
                className="inline-block text-[13px] md:text-sm text-noir/85 hover:text-jade transition-colors duration-300"
              >
                press@orusgallery.com
              </a>
            </div>

            <div className="lg:col-span-2">
              <p className="text-[10px] tracking-[0.22em] uppercase text-noir/40 mb-3">
                {t('social.title')}
              </p>
              <a
                href="https://instagram.com/orusgallery"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 text-[13px] md:text-sm text-noir/85 hover:text-jade transition-colors duration-300"
              >
                <span>{t('social.instagram')}</span>
                <span aria-hidden="true" className="text-[0.85em] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
              </a>
              <p className="mt-1.5 text-[12px] md:text-[13px] text-noir/45">{t('social.handle')}</p>
            </div>
          </div>

          <div className="mt-11 md:mt-12 lg:mt-14 border-t border-hairline pt-5 md:pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <span className="text-[11px] tracking-[0.04em] text-noir/35">{t('copyright')}</span>
            <div className="flex flex-wrap items-center gap-x-3.5 gap-y-2 text-[11px] tracking-[0.04em] text-noir/40">
              <Link href="/privacy" className="hover:text-noir transition-colors duration-300">
                {t('privacy')}
              </Link>
              <span aria-hidden="true" className="text-noir/20">·</span>
              <Link href="/terms" className="hover:text-noir transition-colors duration-300">
                {t('terms')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
