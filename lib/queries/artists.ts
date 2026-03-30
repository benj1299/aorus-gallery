import { prisma } from '@/lib/db';
import { resolveTranslation, type TranslatableField } from '@/lib/i18n-content';
import type { Locale } from '@/i18n/routing';

export async function getArtists() {
  return prisma.artist.findMany({
    where: { visible: true },
    orderBy: { sortOrder: 'asc' },
    include: {
      exhibitions: { orderBy: { sortOrder: 'asc' } },
      collections: { orderBy: { sortOrder: 'asc' } },
    },
  });
}

export async function getArtistBySlug(slug: string) {
  return prisma.artist.findUnique({
    where: { slug },
    include: {
      exhibitions: { orderBy: { sortOrder: 'asc' } },
      collections: { orderBy: { sortOrder: 'asc' } },
      artworks: { where: { visible: true }, orderBy: { sortOrder: 'asc' } },
    },
  });
}

export async function getAllArtistSlugs() {
  const artists = await prisma.artist.findMany({
    where: { visible: true },
    select: { slug: true },
  });
  return artists.map((a) => a.slug);
}

/** Returns data for the frontend with CV grouped by type */
export async function getArtistsForFrontend(locale: Locale = 'en') {
  const artists = await getArtists();
  return artists.map((a) => ({
    id: a.slug,
    name: a.name,
    nationality: resolveTranslation(a.nationality as TranslatableField, locale),
    bio: resolveTranslation(a.bio as TranslatableField, locale),
    image: a.imageUrl,
    cv: {
      soloShows: a.exhibitions.filter((e) => e.type === 'SOLO_SHOW').map((e) => resolveTranslation(e.title as TranslatableField, locale)),
      groupShows: a.exhibitions.filter((e) => e.type === 'GROUP_SHOW').map((e) => resolveTranslation(e.title as TranslatableField, locale)),
      artFairs: a.exhibitions.filter((e) => e.type === 'ART_FAIR').map((e) => resolveTranslation(e.title as TranslatableField, locale)),
      residencies: a.exhibitions.filter((e) => e.type === 'RESIDENCY').map((e) => resolveTranslation(e.title as TranslatableField, locale)),
      awards: a.exhibitions.filter((e) => e.type === 'AWARD').map((e) => resolveTranslation(e.title as TranslatableField, locale)),
      collections: a.collections.map((c) => resolveTranslation(c.title as TranslatableField, locale)),
    },
  }));
}

/** Returns a single artist in the frontend shape with CV grouped by type */
export async function getArtistBySlugForFrontend(slug: string, locale: Locale = 'en') {
  const a = await getArtistBySlug(slug);
  if (!a) return null;
  return {
    id: a.slug,
    name: a.name,
    nationality: resolveTranslation(a.nationality as TranslatableField, locale),
    bio: resolveTranslation(a.bio as TranslatableField, locale),
    image: a.imageUrl,
    cv: {
      soloShows: a.exhibitions.filter((e) => e.type === 'SOLO_SHOW').map((e) => resolveTranslation(e.title as TranslatableField, locale)),
      groupShows: a.exhibitions.filter((e) => e.type === 'GROUP_SHOW').map((e) => resolveTranslation(e.title as TranslatableField, locale)),
      artFairs: a.exhibitions.filter((e) => e.type === 'ART_FAIR').map((e) => resolveTranslation(e.title as TranslatableField, locale)),
      residencies: a.exhibitions.filter((e) => e.type === 'RESIDENCY').map((e) => resolveTranslation(e.title as TranslatableField, locale)),
      awards: a.exhibitions.filter((e) => e.type === 'AWARD').map((e) => resolveTranslation(e.title as TranslatableField, locale)),
      collections: a.collections.map((c) => resolveTranslation(c.title as TranslatableField, locale)),
    },
    artworks: a.artworks.map((aw) => ({
      ...aw,
      title: resolveTranslation(aw.title as TranslatableField, locale),
      medium: aw.medium ? resolveTranslation(aw.medium as TranslatableField, locale) : null,
      showPrice: aw.showPrice,
      price: aw.price ? Number(aw.price) : null,
      currency: aw.currency,
    })),
  };
}

/** Get all artists including hidden ones (for admin) */
export async function getAllArtistsAdmin() {
  return prisma.artist.findMany({
    orderBy: { sortOrder: 'asc' },
    include: {
      _count: { select: { artworks: true } },
    },
  });
}
