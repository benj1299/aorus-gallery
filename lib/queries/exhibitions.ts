import { db } from '@/lib/db-typed';
import { resolveTranslation } from '@/lib/i18n-content';
import type { Locale } from '@/i18n/routing';

export async function getGalleryExhibitions(locale: Locale = 'en') {
  const exhibitions = await db.galleryExhibition.findMany({
    where: { visible: true },
    orderBy: [{ sortOrder: 'asc' }, { startDate: 'desc' }],
    include: {
      artists: { include: { artist: { select: { name: true, slug: true } } } },
    },
  });
  return exhibitions.map((ex) => ({
    id: ex.id,
    slug: ex.slug,
    title: resolveTranslation(ex.title, locale),
    description: ex.description ? resolveTranslation(ex.description, locale) : null,
    type: ex.type,
    status: ex.status,
    startDate: ex.startDate?.toISOString() ?? null,
    endDate: ex.endDate?.toISOString() ?? null,
    location: ex.location,
    imageUrl: ex.imageUrl,
    artists: ex.artists.map((a) => ({ name: a.artist.name, slug: a.artist.slug })),
  }));
}

export async function getAllExhibitionsAdmin() {
  return db.galleryExhibition.findMany({
    orderBy: { sortOrder: 'asc' },
    include: {
      artists: { include: { artist: { select: { name: true } } } },
      _count: { select: { artworks: true } },
    },
  });
}

export async function getExhibitionById(id: string) {
  return db.galleryExhibition.findUnique({
    where: { id },
    include: {
      artists: { select: { artistId: true } },
      artworks: { select: { artworkId: true } },
    },
  });
}
