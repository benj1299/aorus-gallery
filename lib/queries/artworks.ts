import { db } from '@/lib/db-typed';
import { resolveTranslation } from '@/lib/i18n-content';
import type { Locale } from '@/i18n/routing';

export async function getFeaturedArtworks(locale: Locale = 'en') {
  const artworks = await db.artwork.findMany({
    where: { featuredHome: true, visible: true },
    orderBy: { sortOrder: 'asc' },
    take: 6,
    include: { artist: { select: { name: true, slug: true } } },
  });
  return artworks.map((aw) => ({
    id: aw.id,
    slug: aw.slug,
    title: resolveTranslation(aw.title, locale),
    imageUrl: aw.imageUrl,
    artistName: aw.artist.name,
    artistSlug: aw.artist.slug,
  }));
}

export async function getArtworksByArtist(artistId: string) {
  return db.artwork.findMany({
    where: { artistId, visible: true },
    orderBy: { sortOrder: 'asc' },
  });
}

/** Get all artworks for admin with artist name — serializes Decimal to number */
export async function getAllArtworksAdmin() {
  const artworks = await db.artwork.findMany({
    orderBy: [{ artist: { name: 'asc' } }, { sortOrder: 'asc' }],
    include: {
      artist: { select: { name: true, slug: true } },
    },
  });
  return artworks.map((aw) => ({
    ...aw,
    price: aw.price ? Number(aw.price) : null,
  }));
}

export async function getArtworkById(id: string) {
  return db.artwork.findUnique({
    where: { id },
    include: { artist: { select: { name: true, slug: true } } },
  });
}
