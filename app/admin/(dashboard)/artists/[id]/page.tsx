import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { updateArtist } from '@/lib/actions/artists';
import { ArtistForm } from '@/components/admin/artist-form';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
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
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild><Link href="/admin">Administration</Link></BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild><Link href="/admin/artists">Artistes</Link></BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Modifier : {artist.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

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
