'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
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
  showPrice: boolean;
  sold: boolean;
  artistId: string;
  artist: { name: string; slug: string };
};

interface ServerPaginationConfig {
  totalPages: number;
  currentPage: number;
  totalItems: number;
  basePath: string;
  searchParams?: Record<string, string>;
}

export function ArtworksListClient({
  artworks,
  artists,
  currentArtistId,
  serverPagination,
}: {
  artworks: Artwork[];
  artists: Artist[];
  currentArtistId: string;
  serverPagination: ServerPaginationConfig;
}) {
  const router = useRouter();
  const t = useTranslations('admin');

  const columns = [
    {
      key: 'title',
      label: t('artworks.columns.artwork'),
      sortable: true,
      getValue: (aw: Artwork) => resolveTranslation(aw.title as TranslatableField, 'fr'),
      render: (aw: Artwork) => {
        const title = resolveTranslation(aw.title as TranslatableField, 'fr');
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 rounded">
              <AvatarImage src={aw.imageUrl} alt={title} />
              <AvatarFallback className="rounded">{title.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm text-gray-900">{title}</p>
              <p className="text-gray-500 text-xs">{aw.dimensions}</p>
            </div>
          </div>
        );
      },
    },
    {
      key: 'artist',
      label: t('artworks.columns.artist'),
      sortable: true,
      getValue: (aw: Artwork) => aw.artist.name,
      render: (aw: Artwork) => <span className="text-sm text-gray-900">{aw.artist.name}</span>,
    },
    {
      key: 'medium',
      label: t('artworks.columns.medium'),
      render: (aw: Artwork) => (
        <span className="text-sm text-gray-900">
          {aw.medium ? resolveTranslation(aw.medium as TranslatableField, 'fr') : '\u2014'}
        </span>
      ),
    },
    {
      key: 'price',
      label: t('artworks.columns.price'),
      sortable: true,
      getValue: (aw: Artwork) => aw.price ?? 0,
      render: (aw: Artwork) => (
        <span className="text-sm text-gray-900">
          {aw.price ? `${aw.price} ${aw.currency}` : '\u2014'}
        </span>
      ),
    },
    {
      key: 'visible',
      label: t('artworks.columns.status'),
      render: (aw: Artwork) => (
        <div className="flex gap-2">
          <QuickToggle id={aw.id} field="visible" checked={aw.visible} action={toggleArtworkField} label={t('artworks.toggles.visible')} />
          <QuickToggle id={aw.id} field="featuredHome" checked={aw.featuredHome} action={toggleArtworkField} label={t('artworks.toggles.featured')} />
          <QuickToggle id={aw.id} field="showPrice" checked={aw.showPrice} action={toggleArtworkField} label={t('artworks.toggles.price')} />
          <QuickToggle id={aw.id} field="sold" checked={aw.sold} action={toggleArtworkField} label={t('artworks.toggles.sold')} />
        </div>
      ),
    },
  ];

  const handleArtistFilterChange = (artistId: string) => {
    const params = new URLSearchParams();
    if (artistId) params.set('artistId', artistId);
    // Reset to page 1 when changing filter
    params.set('page', '1');
    router.push(`/admin/artworks?${params.toString()}`);
  };

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <div className="relative">
          <select
            value={currentArtistId}
            onChange={(e) => handleArtistFilterChange(e.target.value)}
            className="w-56 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 appearance-none pr-10 cursor-pointer focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 transition-colors"
          >
            <option value="">{t('artworks.allArtists')}</option>
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
        title={t('artworks.title')}
        data={artworks}
        columns={columns}
        searchKeys={['title', 'artist']}
        searchPlaceholder={t('artworks.searchPlaceholder')}
        newHref="/admin/artworks/new"
        newLabel={t('artworks.newArtwork')}
        editHref={(aw) => `/admin/artworks/${aw.id}`}
        deleteAction={deleteArtwork}
        getId={(aw) => aw.id}
        serverPagination={serverPagination}
      />
    </div>
  );
}
