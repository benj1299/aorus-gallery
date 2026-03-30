import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { updateExhibition } from '@/lib/actions/exhibitions';
import { ExhibitionForm } from '@/components/admin/exhibition-form';
import { resolveTranslation, type TranslatableField } from '@/lib/i18n-content';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditExhibitionPage({ params }: Props) {
  const { id } = await params;

  const [exhibition, artists, artworks] = await Promise.all([
    prisma.galleryExhibition.findUnique({
      where: { id },
      include: {
        artists: { select: { artistId: true } },
        artworks: { select: { artworkId: true } },
      },
    }),
    prisma.artist.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true } }),
    prisma.artwork.findMany({
      orderBy: { sortOrder: 'asc' },
      select: { id: true, title: true },
    }),
  ]);

  if (!exhibition) notFound();

  const updateWithId = updateExhibition.bind(null, exhibition.id);

  const artworkOptions = artworks.map((aw) => ({
    id: aw.id,
    title: resolveTranslation(aw.title as TranslatableField, 'en'),
  }));

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/exhibitions" className="text-sm text-gray-500 hover:text-gray-700">
          &larr; Back to exhibitions
        </Link>
        <h1 className="text-2xl font-bold mt-2">
          Edit: {resolveTranslation(exhibition.title as TranslatableField, 'en') || 'Exhibition'}
        </h1>
      </div>
      <ExhibitionForm
        action={updateWithId}
        artists={artists}
        artworks={artworkOptions}
        defaultValues={{
          title: exhibition.title as TranslatableField,
          description: (exhibition.description as TranslatableField | null) ?? undefined,
          slug: exhibition.slug,
          type: exhibition.type,
          status: exhibition.status,
          startDate: exhibition.startDate ? exhibition.startDate.toISOString().split('T')[0] : undefined,
          endDate: exhibition.endDate ? exhibition.endDate.toISOString().split('T')[0] : undefined,
          location: exhibition.location ?? '',
          imageUrl: exhibition.imageUrl ?? '',
          sortOrder: exhibition.sortOrder,
          visible: exhibition.visible,
          artistIds: exhibition.artists.map((a) => a.artistId),
          artworkIds: exhibition.artworks.map((a) => a.artworkId),
        }}
      />
    </div>
  );
}
