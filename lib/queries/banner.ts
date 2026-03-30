import { prisma } from '@/lib/db';
import { resolveTranslation, type TranslatableField } from '@/lib/i18n-content';
import type { Locale } from '@/i18n/routing';

export async function getActiveBanner(locale: Locale = 'en') {
  const banner = await prisma.homeBanner.findFirst({ where: { visible: true } });
  if (!banner) return null;
  return {
    id: banner.id,
    title: resolveTranslation(banner.title as TranslatableField, locale),
    subtitle: banner.subtitle ? resolveTranslation(banner.subtitle as TranslatableField, locale) : null,
    imageUrl: banner.imageUrl,
    linkUrl: banner.linkUrl,
  };
}

export async function getBannerAdmin() {
  return prisma.homeBanner.findFirst();
}
