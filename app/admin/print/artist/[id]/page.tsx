import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import { resolveTranslation, type TranslatableField } from '@/lib/i18n-content';
import { ArtistViewClient } from '@/app/admin/(dashboard)/artists/[id]/view/client';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ArtistPrintPage({ params }: Props) {
  const { id } = await params;
  const artist = await prisma.artist.findUnique({
    where: { id },
    include: {
      exhibitions: { orderBy: { sortOrder: 'asc' } },
      collections: { orderBy: { sortOrder: 'asc' } },
      artworks: { where: { visible: true }, orderBy: { sortOrder: 'asc' } },
    },
  });
  if (!artist) notFound();

  const data = {
    name: artist.name,
    slug: artist.slug,
    nationality: resolveTranslation(artist.nationality as TranslatableField, 'fr'),
    bio: resolveTranslation(artist.bio as TranslatableField, 'fr'),
    imageUrl: artist.imageUrl,
    cv: {
      soloShows: artist.exhibitions.filter(e => e.type === 'SOLO_SHOW').map(e => resolveTranslation(e.title as TranslatableField, 'fr')),
      groupShows: artist.exhibitions.filter(e => e.type === 'GROUP_SHOW').map(e => resolveTranslation(e.title as TranslatableField, 'fr')),
      artFairs: artist.exhibitions.filter(e => e.type === 'ART_FAIR').map(e => resolveTranslation(e.title as TranslatableField, 'fr')),
      residencies: artist.exhibitions.filter(e => e.type === 'RESIDENCY').map(e => resolveTranslation(e.title as TranslatableField, 'fr')),
      awards: artist.exhibitions.filter(e => e.type === 'AWARD').map(e => resolveTranslation(e.title as TranslatableField, 'fr')),
    },
    collections: artist.collections.map(c => resolveTranslation(c.title as TranslatableField, 'fr')),
    artworks: artist.artworks.map(aw => ({
      title: resolveTranslation(aw.title as TranslatableField, 'fr'),
      medium: aw.medium ? resolveTranslation(aw.medium as TranslatableField, 'fr') : null,
      dimensions: aw.dimensions,
      year: aw.year,
      imageUrl: aw.imageUrl,
    })),
  };

  return <ArtistViewClient artist={data} />;
}
