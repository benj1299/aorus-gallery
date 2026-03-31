import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import { resolveTranslation, type TranslatableField } from '@/lib/i18n-content';
import { ExhibitionViewClient } from '@/app/admin/(dashboard)/exhibitions/[id]/view/client';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ExhibitionPrintPage({ params }: Props) {
  const { id } = await params;
  const exhibition = await prisma.galleryExhibition.findUnique({
    where: { id },
    include: {
      artists: {
        include: {
          artist: {
            include: {
              artworks: { where: { visible: true }, take: 3, orderBy: { sortOrder: 'asc' } },
            },
          },
        },
      },
      artworks: {
        include: {
          artwork: true,
        },
      },
    },
  });
  if (!exhibition) notFound();

  const data = {
    title: resolveTranslation(exhibition.title as TranslatableField, 'fr'),
    description: exhibition.description ? resolveTranslation(exhibition.description as TranslatableField, 'fr') : null,
    type: exhibition.type as string,
    status: exhibition.status as string,
    startDate: exhibition.startDate?.toISOString() ?? null,
    endDate: exhibition.endDate?.toISOString() ?? null,
    location: exhibition.location,
    imageUrl: exhibition.imageUrl,
    artists: exhibition.artists.map((ea) => ({
      name: ea.artist.name,
      slug: ea.artist.slug,
      nationality: resolveTranslation(ea.artist.nationality as TranslatableField, 'fr'),
      bio: resolveTranslation(ea.artist.bio as TranslatableField, 'fr'),
      imageUrl: ea.artist.imageUrl,
    })),
    artworks: exhibition.artworks.map((ew) => ({
      title: resolveTranslation(ew.artwork.title as TranslatableField, 'fr'),
      medium: ew.artwork.medium ? resolveTranslation(ew.artwork.medium as TranslatableField, 'fr') : null,
      dimensions: ew.artwork.dimensions,
      year: ew.artwork.year,
      imageUrl: ew.artwork.imageUrl,
      artistName: '',
    })),
  };

  return <ExhibitionViewClient exhibition={data} />;
}
