'use client';

import { AdminTable } from '@/components/admin/admin-table';
import { resolveTranslation, type TranslatableField } from '@/lib/i18n-content';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { deleteArtist } from '@/lib/actions/artists';

type Artist = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
  nationality: unknown;
  visible: boolean;
  _count: { artworks: number };
};

const columns = [
  {
    key: 'name',
    label: 'Artiste',
    sortable: true,
    getValue: (a: Artist) => a.name,
    render: (a: Artist) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={a.imageUrl} alt={a.name} />
          <AvatarFallback>{a.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium text-sm">{a.name}</p>
          <p className="text-muted-foreground text-xs">{a.slug}</p>
        </div>
      </div>
    ),
  },
  {
    key: 'nationality',
    label: 'Nationalité',
    render: (a: Artist) => (
      <span className="text-sm">{resolveTranslation(a.nationality as TranslatableField, 'fr')}</span>
    ),
  },
  {
    key: 'artworks',
    label: 'Œuvres',
    sortable: true,
    getValue: (a: Artist) => a._count.artworks,
    render: (a: Artist) => <span className="text-sm">{a._count.artworks}</span>,
  },
  {
    key: 'visible',
    label: 'Statut',
    render: (a: Artist) => (
      <Badge variant={a.visible ? 'default' : 'secondary'}>
        {a.visible ? 'Visible' : 'Masqué'}
      </Badge>
    ),
  },
];

export function ArtistsListClient({ artists }: { artists: Artist[] }) {
  return (
    <AdminTable
      title="Artistes"
      data={artists}
      columns={columns}
      searchKeys={['name']}
      searchPlaceholder="Rechercher un artiste..."
      newHref="/admin/artists/new"
      newLabel="Nouvel artiste"
      editHref={(a) => `/admin/artists/${a.id}`}
      deleteAction={deleteArtist}
      getId={(a) => a.id}
    />
  );
}
