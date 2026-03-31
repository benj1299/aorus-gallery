'use client';

import { AdminTable } from '@/components/admin/admin-table';
import { resolveTranslation, type TranslatableField } from '@/lib/i18n-content';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { deleteArtwork } from '@/lib/actions/artworks';

type Artwork = {
  id: string;
  slug: string;
  title: unknown;
  imageUrl: string;
  dimensions: string | null;
  medium: unknown;
  price: number | null;
  currency: string | null;
  visible: boolean;
  featuredHome: boolean;
  artist: { name: string; slug: string };
};

const columns = [
  {
    key: 'title',
    label: 'Œuvre',
    sortable: true,
    getValue: (aw: Artwork) => resolveTranslation(aw.title as TranslatableField, 'fr'),
    render: (aw: Artwork) => {
      const t = resolveTranslation(aw.title as TranslatableField, 'fr');
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 rounded">
            <AvatarImage src={aw.imageUrl} alt={t} />
            <AvatarFallback className="rounded">{t.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm text-gray-900">{t}</p>
            <p className="text-gray-500 text-xs">{aw.dimensions}</p>
          </div>
        </div>
      );
    },
  },
  {
    key: 'artist',
    label: 'Artiste',
    sortable: true,
    getValue: (aw: Artwork) => aw.artist.name,
    render: (aw: Artwork) => <span className="text-sm text-gray-900">{aw.artist.name}</span>,
  },
  {
    key: 'medium',
    label: 'Technique',
    render: (aw: Artwork) => (
      <span className="text-sm text-gray-900">
        {aw.medium ? resolveTranslation(aw.medium as TranslatableField, 'fr') : '—'}
      </span>
    ),
  },
  {
    key: 'price',
    label: 'Prix',
    sortable: true,
    getValue: (aw: Artwork) => aw.price ?? 0,
    render: (aw: Artwork) => (
      <span className="text-sm text-gray-900">
        {aw.price ? `${aw.price} ${aw.currency}` : '—'}
      </span>
    ),
  },
  {
    key: 'visible',
    label: 'Statut',
    render: (aw: Artwork) => (
      <div className="flex gap-1">
        {aw.visible
          ? <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">Visible</span>
          : <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">Masqué</span>
        }
        {aw.featuredHome && <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">En avant</span>}
      </div>
    ),
  },
];

export function ArtworksListClient({ artworks }: { artworks: Artwork[] }) {
  return (
    <AdminTable
      title="Œuvres"
      data={artworks}
      columns={columns}
      searchKeys={['title', 'artist']}
      searchPlaceholder="Rechercher une œuvre..."
      newHref="/admin/artworks/new"
      newLabel="Nouvelle œuvre"
      editHref={(aw) => `/admin/artworks/${aw.id}`}
      deleteAction={deleteArtwork}
      getId={(aw) => aw.id}
    />
  );
}
