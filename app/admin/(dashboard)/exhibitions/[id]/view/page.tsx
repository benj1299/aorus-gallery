import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import { resolveTranslation, type TranslatableField } from '@/lib/i18n-content';
import { ExhibitionViewClient } from './client';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ExhibitionViewPage({ params }: Props) {
  const { id } = await params;
  const exhibition = await prisma.galleryExhibition.findUnique({
    where: { id },
    include: {
      artists: {
        include: {
          artist: {
            select: { name: true, slug: true, imageUrl: true, bio: true, nationality: true },
          },
        },
      },
      artworks: {
        include: {
          artwork: {
            select: { title: true, imageUrl: true, medium: true, dimensions: true, year: true, artist: { select: { name: true } } },
          },
        },
      },
    },
  });
  if (!exhibition) notFound();

  function statusLabel(status: string) {
    switch (status) {
      case 'CURRENT': return 'En cours';
      case 'UPCOMING': return 'A venir';
      default: return 'Passee';
    }
  }

  function typeLabel(type: string) {
    switch (type) {
      case 'EXHIBITION': return 'Exposition';
      case 'ART_FAIR': return 'Foire';
      case 'OFFSITE': return 'Hors les murs';
      default: return type;
    }
  }

  function formatDate(date: Date | null) {
    if (!date) return null;
    return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  const data = {
    title: resolveTranslation(exhibition.title as TranslatableField, 'fr'),
    description: exhibition.description
      ? resolveTranslation(exhibition.description as TranslatableField, 'fr')
      : null,
    type: typeLabel(exhibition.type),
    status: statusLabel(exhibition.status),
    startDate: formatDate(exhibition.startDate),
    endDate: formatDate(exhibition.endDate),
    location: exhibition.location,
    imageUrl: exhibition.imageUrl,
    artists: exhibition.artists.map((a) => ({
      name: a.artist.name,
      slug: a.artist.slug,
      imageUrl: a.artist.imageUrl,
      nationality: resolveTranslation(a.artist.nationality as TranslatableField, 'fr'),
      bio: resolveTranslation(a.artist.bio as TranslatableField, 'fr'),
    })),
    artworks: exhibition.artworks.map((aw) => ({
      title: resolveTranslation(aw.artwork.title as TranslatableField, 'fr'),
      imageUrl: aw.artwork.imageUrl,
      medium: aw.artwork.medium ? resolveTranslation(aw.artwork.medium as TranslatableField, 'fr') : null,
      dimensions: aw.artwork.dimensions,
      year: aw.artwork.year,
      artistName: aw.artwork.artist.name,
    })),
  };

  return <ExhibitionViewClient exhibition={data} />;
}
