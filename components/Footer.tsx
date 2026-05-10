'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export function Footer() {
  const t = useTranslations('footer');

  return (
    <footer
      className="border-t"
      style={{ backgroundColor: '#FAFAFA', borderColor: '#E6E6E6' }}
    >
      <div className="px-edge py-16 md:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12">
            <div className="md:col-span-4">
              <p
                className="font-display text-xl tracking-[0.04em] mb-3"
                style={{ color: '#0B0B0B' }}
              >
                {t('gallery.name')}
              </p>
              <p
                className="text-sm leading-relaxed max-w-xs"
                style={{ color: '#6E6E6E' }}
              >
                {t('gallery.tagline')}
              </p>
            </div>

            <div className="md:col-span-3">
              <p
                className="text-[11px] tracking-[0.2em] uppercase mb-4"
                style={{ color: 'rgba(11, 11, 11, 0.45)' }}
              >
                {t('contact.title')}
              </p>
              <ul className="space-y-2 text-sm" style={{ color: '#0B0B0B' }}>
                <li>
                  <a
                    href="mailto:contact@orusgallery.com"
                    className="hover:opacity-70 transition-opacity"
                  >
                    contact@orusgallery.com
                  </a>
                </li>
                <li style={{ color: '#6E6E6E' }}>{t('contact.appointment')}</li>
                <li style={{ color: '#6E6E6E' }}>{t('contact.cities')}</li>
              </ul>
            </div>

            <div className="md:col-span-3">
              <p
                className="text-[11px] tracking-[0.2em] uppercase mb-4"
                style={{ color: 'rgba(11, 11, 11, 0.45)' }}
              >
                {t('press.title')}
              </p>
              <ul className="space-y-2 text-sm" style={{ color: '#0B0B0B' }}>
                <li>
                  <a
                    href="mailto:press@orusgallery.com"
                    className="hover:opacity-70 transition-opacity"
                  >
                    press@orusgallery.com
                  </a>
                </li>
              </ul>
            </div>

            <div className="md:col-span-2">
              <p
                className="text-[11px] tracking-[0.2em] uppercase mb-4"
                style={{ color: 'rgba(11, 11, 11, 0.45)' }}
              >
                {t('social.title')}
              </p>
              <ul className="space-y-2 text-sm" style={{ color: '#0B0B0B' }}>
                <li>
                  <a
                    href="https://instagram.com/orusgallery"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-70 transition-opacity"
                  >
                    {t('social.instagram')}
                  </a>
                </li>
                <li style={{ color: '#6E6E6E' }}>{t('social.handle')}</li>
              </ul>
            </div>
          </div>

          <div
            className="w-full h-px mt-14 md:mt-16"
            style={{ backgroundColor: '#E6E6E6' }}
          />

          <div
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pt-6 text-xs tracking-wide"
            style={{ color: 'rgba(11, 11, 11, 0.4)' }}
          >
            <span>{t('copyright')}</span>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <Link
                href="/privacy"
                className="hover:text-noir transition-colors duration-300"
              >
                {t('privacy')}
              </Link>
              <span aria-hidden="true">·</span>
              <Link
                href="/terms"
                className="hover:text-noir transition-colors duration-300"
              >
                {t('terms')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
