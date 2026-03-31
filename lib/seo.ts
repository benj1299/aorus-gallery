export const BASE_URL = 'https://aorus-gallery.vercel.app';

export const OG_LOCALE: Record<string, string> = { en: 'en_US', fr: 'fr_FR', zh: 'zh_TW' };

export function generateAlternates(locale: string, path: string = '') {
  return {
    canonical: `${BASE_URL}/${locale}${path}`,
    languages: {
      en: `${BASE_URL}/en${path}`,
      fr: `${BASE_URL}/fr${path}`,
      zh: `${BASE_URL}/zh${path}`,
      'x-default': `${BASE_URL}/en${path}`,
    },
  };
}
