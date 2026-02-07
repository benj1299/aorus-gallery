'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';

const localeNames: Record<Locale, string> = {
  en: 'EN',
  fr: 'FR',
  zh: '中文',
};

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = (newLocale: Locale) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="flex items-center gap-3">
      {routing.locales.map((loc, index) => (
        <span key={loc} className="flex items-center gap-3">
          <button
            onClick={() => handleLocaleChange(loc)}
            className={`text-sm tracking-wider transition-colors duration-300 ${
              locale === loc
                ? 'text-or'
                : 'text-ivoire/50 hover:text-ivoire/80'
            }`}
          >
            {localeNames[loc]}
          </button>
          {index < routing.locales.length - 1 && (
            <span className="text-ivoire/20">|</span>
          )}
        </span>
      ))}
    </div>
  );
}
