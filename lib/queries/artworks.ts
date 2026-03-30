import { prisma } from '@/lib/db';
import { resolveTranslation, type TranslatableField } from '@/lib/i18n-content';
import type { Locale } from '@/i18n/routing';

export async function getFeaturedArtworks(locale: Locale = 'en') {
  const artworks = await prisma.artwork.findMany({
    where: { featuredHome: true, visible: true },
    orderBy: { sortOrder: 'asc' },
    take: 6,
    include: { artist: { select: { name: true, slug: true } } },
  });
  return artworks.map((aw) => ({
    id: aw.id,
    slug: aw.slug,
    title: resolveTranslation(aw.title as TranslatableField, locale),
    imageUrl: aw.imageUrl,
    artistName: aw.artist.name,
    artistSlug: aw.artist.slug,
  }));
}

export async function getArtworksByArtist(artistId: string) {
  return prisma.artwork.findMany({
    where: { artistId, visible: true },
    orderBy: { sortOrder: 'asc' },
  });
}

/** Get all artworks for admin with artist name */
export async function getAllArtworksAdmin() {
  return prisma.artwork.findMany({
    orderBy: [{ artist: { name: 'asc' } }, { sortOrder: 'asc' }],
    include: {
      artist: { select: { name: true, slug: true } },
    },
  });
}

export async function getArtworkById(id: string) {
  return prisma.artwork.findUnique({
    where: { id },
    include: { artist: { select: { name: true, slug: true } } },
  });
}
