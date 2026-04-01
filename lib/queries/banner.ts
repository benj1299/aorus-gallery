import { db } from '@/lib/db-typed';
import { resolveTranslation } from '@/lib/i18n-content';
import type { Locale } from '@/i18n/routing';

export async function getActiveBanner(locale: Locale = 'en') {
  const banner = await db.homeBanner.findFirst({ where: { visible: true } });
  if (!banner) return null;
  return {
    id: banner.id,
    title: resolveTranslation(banner.title, locale),
    subtitle: banner.subtitle ? resolveTranslation(banner.subtitle, locale) : null,
    imageUrl: banner.imageUrl,
    linkUrl: banner.linkUrl,
  };
}

export async function getBannerAdmin() {
  return db.homeBanner.findFirst();
}
