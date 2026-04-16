'use client';

import { useTranslations } from 'next-intl';
import { AdminTable } from '@/components/admin/admin-table';
import { resolveTranslation, type TranslatableField } from '@/lib/i18n-content';
import { deleteExhibition, toggleExhibitionField } from '@/lib/actions/exhibitions';
import { QuickToggle } from '@/components/admin/quick-toggle';
import { Eye, FileDown } from 'lucide-react';

type Exhibition = {
  id: string;
  slug: string;
  title: unknown;
  type: string;
  status: string;
  visible: boolean;
  location: string | null;
  artists: { artist: { name: string } }[];
  _count: { artworks: number };
};

export function ExhibitionsListClient({ exhibitions }: { exhibitions: Exhibition[] }) {
  const t = useTranslations('admin');

  function statusBadge(status: string) {
    switch (status) {
      case 'CURRENT':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">{t('exhibitions.statuses.current')}</span>;
      case 'UPCOMING':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">{t('exhibitions.statuses.upcoming')}</span>;
      default:
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">{t('exhibitions.statuses.past')}</span>;
    }
  }

  function typeLabel(type: string) {
    switch (type) {
      case 'EXHIBITION': return t('exhibitions.types.exhibition');
      case 'ART_FAIR': return t('exhibitions.types.artFair');
      case 'OFFSITE': return t('exhibitions.types.offsite');
      default: return type;
    }
  }

  const columns = [
    {
      key: 'title',
      label: t('exhibitions.columns.title'),
      sortable: true,
      getValue: (e: Exhibition) => resolveTranslation(e.title as TranslatableField, 'fr'),
      render: (e: Exhibition) => (
        <div>
          <p className="font-medium text-sm text-gray-900">{resolveTranslation(e.title as TranslatableField, 'fr')}</p>
          <p className="text-gray-500 text-xs">{e.slug}</p>
        </div>
      ),
    },
    {
      key: 'type',
      label: t('exhibitions.columns.type'),
      render: (e: Exhibition) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">{typeLabel(e.type)}</span>
      ),
    },
    {
      key: 'status',
      label: t('exhibitions.columns.status'),
      render: (e: Exhibition) => statusBadge(e.status),
    },
    {
      key: 'artists',
      label: t('exhibitions.columns.artists'),
      sortable: true,
      getValue: (e: Exhibition) => e.artists.length,
      render: (e: Exhibition) => (
        <span className="text-sm text-gray-900">
          {e.artists.map((a) => a.artist.name).join(', ') || '\u2014'}
        </span>
      ),
    },
    {
      key: 'visible',
      label: t('exhibitions.columns.visible'),
      render: (e: Exhibition) => (
        <QuickToggle id={e.id} field="visible" checked={e.visible} action={toggleExhibitionField} label={t('forms.visible')} />
      ),
    },
  ];

  return (
    <AdminTable
      title={t('exhibitions.title')}
      data={exhibitions}
      columns={columns}
      searchKeys={['title', 'location']}
      searchPlaceholder={t('exhibitions.searchPlaceholder')}
      newHref="/admin/exhibitions/new"
      newLabel={t('exhibitions.newExhibition')}
      editHref={(e) => `/admin/exhibitions/${e.id}`}
      deleteAction={deleteExhibition}
      getId={(e) => e.id}
      extraActions={(e) => (
        <>
          <a href="/fr/exhibitions" target="_blank" rel="noopener noreferrer"
             className="inline-flex items-center justify-center h-8 w-8 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
             title={t('table.viewPublicPage')}
             data-testid="view-btn">
            <Eye className="h-4 w-4" />
          </a>
          <a href={`/admin/print/exhibition/${e.id}`} target="_blank" rel="noopener noreferrer"
             className="inline-flex items-center justify-center h-8 w-8 text-gray-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors"
             title={t('table.pressKit')}>
            <FileDown className="h-4 w-4" />
          </a>
        </>
      )}
    />
  );
}
