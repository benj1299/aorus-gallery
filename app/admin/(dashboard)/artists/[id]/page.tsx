import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { updateArtist } from '@/lib/actions/artists';
import { ArtistForm } from '@/components/admin/artist-form';
import { AdminBreadcrumb } from '@/components/admin/admin-breadcrumb';
import type { TranslatableField } from '@/lib/i18n-content';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditArtistPage({ params }: Props) {
  const { id } = await params;

  const artist = await prisma.artist.findUnique({
    where: { id },
    include: {
      exhibitions: { orderBy: { sortOrder: 'asc' } },
      collections: { orderBy: { sortOrder: 'asc' } },
    },
  });

  if (!artist) notFound();

  const updateWithId = updateArtist.bind(null, artist.id);

  return (
    <div className="space-y-6">
      <AdminBreadcrumb items={[
        { label: 'Artistes', href: '/admin/artists' },
        { label: `Modifier : ${artist.name}` },
      ]} />

      <h1 className="text-2xl font-bold tracking-tight">Modifier : {artist.name}</h1>

      <ArtistForm
        action={updateWithId}
        defaultValues={{
          name: artist.name,
          nationality: artist.nationality as TranslatableField,
          bio: artist.bio as TranslatableField,
          imageUrl: artist.imageUrl,
          sortOrder: artist.sortOrder,
          visible: artist.visible,
          cvEntries: artist.exhibitions.map((e) => ({
            type: e.type,
            title: e.title as TranslatableField,
          })),
          collections: artist.collections.map((c) => c.title as TranslatableField),
        }}
      />
    </div>
  );
}
