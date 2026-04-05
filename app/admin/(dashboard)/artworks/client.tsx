'use client';

import { useState, useMemo } from 'react';
import { AdminTable } from '@/components/admin/admin-table';
import { resolveTranslation, type TranslatableField } from '@/lib/i18n-content';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { deleteArtwork, toggleArtworkField } from '@/lib/actions/artworks';
import { QuickToggle } from '@/components/admin/quick-toggle';
import { ChevronDown } from 'lucide-react';

type Artist = { id: string; name: string };

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
  sold: boolean;
  artistId: string;
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
      <div className="flex gap-2">
        <QuickToggle id={aw.id} field="visible" checked={aw.visible} action={toggleArtworkField} label="Visible" />
        <QuickToggle id={aw.id} field="featuredHome" checked={aw.featuredHome} action={toggleArtworkField} label="En avant" />
        <QuickToggle id={aw.id} field="sold" checked={aw.sold} action={toggleArtworkField} label="Vendu" />
      </div>
    ),
  },
];

export function ArtworksListClient({
  artworks,
  artists,
}: {
  artworks: Artwork[];
  artists: Artist[];
}) {
  const [artistFilter, setArtistFilter] = useState<string>('');

  const filtered = useMemo(
    () => (artistFilter ? artworks.filter((aw) => aw.artistId === artistFilter) : artworks),
    [artworks, artistFilter],
  );

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <div className="relative">
          <select
            value={artistFilter}
            onChange={(e) => setArtistFilter(e.target.value)}
            className="w-56 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 appearance-none pr-10 cursor-pointer focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 transition-colors"
          >
            <option value="">Tous les artistes</option>
            {artists.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
      </div>
      <AdminTable
        title="Œuvres"
        data={filtered}
        columns={columns}
        searchKeys={['title', 'artist']}
        searchPlaceholder="Rechercher une œuvre..."
        newHref="/admin/artworks/new"
        newLabel="Nouvelle œuvre"
        editHref={(aw) => `/admin/artworks/${aw.id}`}
        deleteAction={deleteArtwork}
        getId={(aw) => aw.id}
      />
    </div>
  );
}
