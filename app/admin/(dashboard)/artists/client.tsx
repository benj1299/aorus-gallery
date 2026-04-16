'use client';

import { useTranslations } from 'next-intl';
import { AdminTable } from '@/components/admin/admin-table';
import { resolveTranslation, type TranslatableField } from '@/lib/i18n-content';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { deleteArtist, toggleArtistField } from '@/lib/actions/artists';
import { QuickToggle } from '@/components/admin/quick-toggle';
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

interface ServerPaginationConfig {
  totalPages: number;
  currentPage: number;
  totalItems: number;
  basePath: string;
  searchParams?: Record<string, string>;
}

export function ArtistsListClient({ artists, serverPagination }: { artists: Artist[]; serverPagination?: ServerPaginationConfig }) {
  const t = useTranslations('admin');

  const columns = [
    {
      key: 'name',
      label: t('artists.columns.artist'),
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
      label: t('artists.columns.nationality'),
      render: (a: Artist) => (
        <span className="text-sm text-gray-900">{resolveTranslation(a.nationality as TranslatableField, 'fr')}</span>
      ),
    },
    {
      key: 'artworks',
      label: t('artists.columns.artworks'),
      sortable: true,
      getValue: (a: Artist) => a._count.artworks,
      render: (a: Artist) => <span className="text-sm text-gray-900">{a._count.artworks}</span>,
    },
    {
      key: 'visible',
      label: t('artists.columns.status'),
      render: (a: Artist) => (
        <QuickToggle id={a.id} field="visible" checked={a.visible} action={toggleArtistField} label={t('forms.visible')} />
      ),
    },
  ];

  return (
    <AdminTable
      title={t('artists.title')}
      data={artists}
      columns={columns}
      searchKeys={['name']}
      searchPlaceholder={t('artists.searchPlaceholder')}
      newHref="/admin/artists/new"
      newLabel={t('artists.newArtist')}
      editHref={(a) => `/admin/artists/${a.id}`}
      deleteAction={deleteArtist}
      getId={(a) => a.id}
      extraActions={(a) => (
        <>
          <a href={`/fr/artists/${a.slug}`} target="_blank" rel="noopener noreferrer"
             className="inline-flex items-center justify-center h-8 w-8 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
             title={t('table.viewPublicPage')}
             data-testid="view-btn">
            <Eye className="h-4 w-4" />
          </a>
          <a href={`/admin/print/artist/${a.id}`} target="_blank" rel="noopener noreferrer"
             className="inline-flex items-center justify-center h-8 w-8 text-gray-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors"
             title={t('table.artistSheet')}>
            <FileDown className="h-4 w-4" />
          </a>
        </>
      )}
    />
  );
}
