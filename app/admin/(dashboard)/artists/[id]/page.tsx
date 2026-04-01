import { notFound } from 'next/navigation';
import { db } from '@/lib/db-typed';
import { updateArtist } from '@/lib/actions/artists';
import { ArtistForm } from '@/components/admin/artist-form';
import { AdminBreadcrumb } from '@/components/admin/admin-breadcrumb';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditArtistPage({ params }: Props) {
  const { id } = await params;

  const artist = await db.artist.findUnique({
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
          nationality: artist.nationality,
          bio: artist.bio,
          imageUrl: artist.imageUrl,
          sortOrder: artist.sortOrder,
          visible: artist.visible,
          cvEntries: artist.exhibitions.map((e) => ({
            type: e.type,
            title: e.title,
            year: e.year,
          })),
          collections: artist.collections.map((c) => c.title),
        }}
      />
    </div>
  );
}
