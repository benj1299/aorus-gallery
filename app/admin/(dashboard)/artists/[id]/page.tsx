import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { updateArtist } from '@/lib/actions/artists';
import { ArtistForm } from '@/components/admin/artist-form';
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
    <div>
      <div className="mb-8">
        <Link href="/admin/artists" className="text-sm text-gray-500 hover:text-gray-700">
          &larr; Back to artists
        </Link>
        <h1 className="text-2xl font-bold mt-2">Edit: {artist.name}</h1>
      </div>
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
