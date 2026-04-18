import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/db';

const BASE_URL = 'https://www.orusgallery.com';
const locales = ['en', 'fr', 'zh'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = ['', '/about', '/artists', '/press', '/contact', '/exhibitions'];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const page of staticPages) {
      entries.push({
        url: `${BASE_URL}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'weekly' : 'monthly',
        priority: page === '' ? 1.0 : 0.8,
      });
    }
  }

  const artists = await prisma.artist.findMany({
    where: { visible: true },
    select: { slug: true, updatedAt: true },
  });

  for (const locale of locales) {
    for (const artist of artists) {
      entries.push({
        url: `${BASE_URL}/${locale}/artists/${artist.slug}`,
        lastModified: artist.updatedAt,
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
  }

  return entries;
}
