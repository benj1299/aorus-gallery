import { db } from '@/lib/db-typed';
import { resolveTranslation } from '@/lib/i18n-content';
import type { Locale } from '@/i18n/routing';

export async function getFeaturedArtworks(locale: Locale = 'en') {
  const artworks = await db.artwork.findMany({
    where: { featuredHome: true, visible: true },
    orderBy: { sortOrder: 'asc' },
    take: 10,
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

/** Returns a single artwork by slug with artist info and adjacent artworks for navigation */
export async function getArtworkBySlugForFrontend(slug: string, locale: Locale = 'en') {
  const artwork = await db.artwork.findUnique({
    where: { slug, visible: true },
    include: {
      artist: {
        select: { name: true, slug: true, id: true },
      },
    },
  });

  if (!artwork) return null;

  // Fetch adjacent artworks (prev/next by sortOrder within same artist)
  const [prevArtwork, nextArtwork] = await Promise.all([
    db.artwork.findFirst({
      where: {
        artistId: artwork.artistId,
        visible: true,
        sortOrder: { lt: artwork.sortOrder },
      },
      orderBy: { sortOrder: 'desc' },
      select: { slug: true, title: true },
    }),
    db.artwork.findFirst({
      where: {
        artistId: artwork.artistId,
        visible: true,
        sortOrder: { gt: artwork.sortOrder },
      },
      orderBy: { sortOrder: 'asc' },
      select: { slug: true, title: true },
    }),
  ]);

  return {
    id: artwork.id,
    slug: artwork.slug,
    title: resolveTranslation(artwork.title, locale),
    medium: artwork.medium ? resolveTranslation(artwork.medium, locale) : null,
    dimensions: artwork.dimensions,
    year: artwork.year,
    price: artwork.showPrice && artwork.price ? Number(artwork.price) : null,
    currency: artwork.currency,
    showPrice: artwork.showPrice,
    sold: artwork.sold,
    imageUrl: artwork.imageUrl,
    images: artwork.images,
    artist: {
      id: artwork.artist.id,
      name: artwork.artist.name,
      slug: artwork.artist.slug,
    },
    prevArtwork: prevArtwork
      ? { slug: prevArtwork.slug, title: resolveTranslation(prevArtwork.title, locale) }
      : null,
    nextArtwork: nextArtwork
      ? { slug: nextArtwork.slug, title: resolveTranslation(nextArtwork.title, locale) }
      : null,
  };
}
