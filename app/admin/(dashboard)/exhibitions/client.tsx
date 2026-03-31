'use client';

import { AdminTable } from '@/components/admin/admin-table';
import { resolveTranslation, type TranslatableField } from '@/lib/i18n-content';
import { deleteExhibition } from '@/lib/actions/exhibitions';

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

function statusBadge(status: string) {
  switch (status) {
    case 'CURRENT':
      return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">En cours</span>;
    case 'UPCOMING':
      return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">À venir</span>;
    default:
      return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">Passée</span>;
  }
}

function typeLabel(type: string) {
  switch (type) {
    case 'EXHIBITION': return 'Exposition';
    case 'ART_FAIR': return 'Foire';
    case 'OFFSITE': return 'Hors les murs';
    default: return type;
  }
}

const columns = [
  {
    key: 'title',
    label: 'Titre',
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
    label: 'Type',
    render: (e: Exhibition) => (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">{typeLabel(e.type)}</span>
    ),
  },
  {
    key: 'status',
    label: 'Statut',
    render: (e: Exhibition) => statusBadge(e.status),
  },
  {
    key: 'artists',
    label: 'Artistes',
    sortable: true,
    getValue: (e: Exhibition) => e.artists.length,
    render: (e: Exhibition) => (
      <span className="text-sm text-gray-900">
        {e.artists.map((a) => a.artist.name).join(', ') || '—'}
      </span>
    ),
  },
  {
    key: 'visible',
    label: 'Visible',
    render: (e: Exhibition) => (
      e.visible
        ? <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">Visible</span>
        : <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">Masqué</span>
    ),
  },
];

export function ExhibitionsListClient({ exhibitions }: { exhibitions: Exhibition[] }) {
  return (
    <AdminTable
      title="Expositions"
      data={exhibitions}
      columns={columns}
      searchKeys={['title', 'location']}
      searchPlaceholder="Rechercher une exposition..."
      newHref="/admin/exhibitions/new"
      newLabel="Nouvelle exposition"
      editHref={(e) => `/admin/exhibitions/${e.id}`}
      deleteAction={deleteExhibition}
      getId={(e) => e.id}
    />
  );
}
