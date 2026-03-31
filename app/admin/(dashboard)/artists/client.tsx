'use client';

import { AdminTable } from '@/components/admin/admin-table';
import { resolveTranslation, type TranslatableField } from '@/lib/i18n-content';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { deleteArtist } from '@/lib/actions/artists';
import { Eye, FileDown } from 'lucide-react';

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
          <p className="font-medium text-sm text-gray-900">{a.name}</p>
          <p className="text-gray-500 text-xs">{a.slug}</p>
        </div>
      </div>
    ),
  },
  {
    key: 'nationality',
    label: 'Nationalité',
    render: (a: Artist) => (
      <span className="text-sm text-gray-900">{resolveTranslation(a.nationality as TranslatableField, 'fr')}</span>
    ),
  },
  {
    key: 'artworks',
    label: 'Œuvres',
    sortable: true,
    getValue: (a: Artist) => a._count.artworks,
    render: (a: Artist) => <span className="text-sm text-gray-900">{a._count.artworks}</span>,
  },
  {
    key: 'visible',
    label: 'Statut',
    render: (a: Artist) => (
      a.visible
        ? <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">Visible</span>
        : <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">Masqué</span>
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
      extraActions={(a) => (
        <>
          <a href={`/fr/artists/${a.slug}`} target="_blank" rel="noopener noreferrer"
             className="inline-flex items-center justify-center h-8 w-8 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
             title="Voir la page publique">
            <Eye className="h-4 w-4" />
          </a>
          <a href={`/admin/artists/${a.id}/view`}
             className="inline-flex items-center justify-center h-8 w-8 text-gray-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors"
             title="Fiche artiste (PDF)">
            <FileDown className="h-4 w-4" />
          </a>
        </>
      )}
    />
  );
}
