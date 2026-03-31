import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { updateExhibition } from '@/lib/actions/exhibitions';
import { ExhibitionForm } from '@/components/admin/exhibition-form';
import { resolveTranslation, type TranslatableField } from '@/lib/i18n-content';
import { AdminBreadcrumb } from '@/components/admin/admin-breadcrumb';

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
    title: resolveTranslation(aw.title as TranslatableField, 'fr'),
  }));

  const exhibitionTitle = resolveTranslation(exhibition.title as TranslatableField, 'fr') || 'Exposition';

  return (
    <div className="space-y-6">
      <AdminBreadcrumb items={[
        { label: 'Expositions', href: '/admin/exhibitions' },
        { label: `Modifier : ${exhibitionTitle}` },
      ]} />

      <h1 className="text-2xl font-bold tracking-tight">Modifier : {exhibitionTitle}</h1>

      <ExhibitionForm
        action={updateWithId}
        artists={artists}
        artworks={artworkOptions}
        defaultValues={{
          title: exhibition.title as TranslatableField,
          description: (exhibition.description as TranslatableField | null) ?? undefined,
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
