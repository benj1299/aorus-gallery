import { createArtist } from '@/lib/actions/artists';
import { ArtistForm } from '@/components/admin/artist-form';
import { AdminBreadcrumb } from '@/components/admin/admin-breadcrumb';

export default function NewArtistPage() {
  return (
    <div className="space-y-6">
      <AdminBreadcrumb items={[
        { label: 'Artistes', href: '/admin/artists' },
        { label: 'Nouvel artiste' },
      ]} />

      <h1 className="text-2xl font-bold tracking-tight">Nouvel artiste</h1>

      <ArtistForm action={createArtist} />
    </div>
  );
}
