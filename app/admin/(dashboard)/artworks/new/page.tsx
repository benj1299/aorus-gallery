import { createArtwork } from '@/lib/actions/artworks';
import { ArtworkForm } from '@/components/admin/artwork-form';
import { prisma } from '@/lib/db';
import { AdminBreadcrumb } from '@/components/admin/admin-breadcrumb';

export default async function NewArtworkPage() {
  const artists = await prisma.artist.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true },
  });

  return (
    <div className="space-y-6">
      <AdminBreadcrumb items={[
        { label: 'Œuvres', href: '/admin/artworks' },
        { label: 'Nouvelle œuvre' },
      ]} />

      <h1 className="text-2xl font-bold tracking-tight">Nouvelle œuvre</h1>

      <ArtworkForm action={createArtwork} artists={artists} />
    </div>
  );
}
