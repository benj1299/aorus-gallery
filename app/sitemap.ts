import type { MetadataRoute } from 'next';
import { db } from '@/lib/db-typed';

const BASE_URL = 'https://www.orusgallery.com';
const locales = ['en', 'fr', 'zh'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = ['', '/about', '/artists', '/press', '/contact', '/exhibitions', '/collectors', '/press-kit'];

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

  const [artists, artworks, exhibitions] = await Promise.all([
    db.artist.findMany({
      where: { visible: true },
      select: { slug: true, updatedAt: true },
    }),
    db.artwork.findMany({
      where: { visible: true },
      select: { slug: true, updatedAt: true },
    }),
    db.galleryExhibition.findMany({
      where: { visible: true },
      select: { slug: true, updatedAt: true },
    }),
  ]);

  for (const locale of locales) {
    for (const artist of artists) {
      entries.push({
        url: `${BASE_URL}/${locale}/artists/${artist.slug}`,
        lastModified: artist.updatedAt,
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
    for (const artwork of artworks) {
      entries.push({
        url: `${BASE_URL}/${locale}/artworks/${artwork.slug}`,
        lastModified: artwork.updatedAt,
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }
    for (const exhibition of exhibitions) {
      entries.push({
        url: `${BASE_URL}/${locale}/exhibitions/${exhibition.slug}`,
        lastModified: exhibition.updatedAt,
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }
  }

  return entries;
}
