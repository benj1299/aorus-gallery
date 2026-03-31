'use client';

import { AdminTable } from '@/components/admin/admin-table';
import { resolveTranslation, type TranslatableField } from '@/lib/i18n-content';
import { Badge } from '@/components/ui/badge';
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

function statusLabel(status: string) {
  switch (status) {
    case 'CURRENT': return 'En cours';
    case 'UPCOMING': return 'À venir';
    default: return 'Passée';
  }
}

function statusVariant(status: string) {
  switch (status) {
    case 'CURRENT': return 'default' as const;
    case 'UPCOMING': return 'outline' as const;
    default: return 'secondary' as const;
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
        <p className="font-medium text-sm">{resolveTranslation(e.title as TranslatableField, 'fr')}</p>
        <p className="text-muted-foreground text-xs">{e.slug}</p>
      </div>
    ),
  },
  {
    key: 'type',
    label: 'Type',
    render: (e: Exhibition) => <Badge variant="outline">{typeLabel(e.type)}</Badge>,
  },
  {
    key: 'status',
    label: 'Statut',
    render: (e: Exhibition) => (
      <Badge variant={statusVariant(e.status)}>{statusLabel(e.status)}</Badge>
    ),
  },
  {
    key: 'artists',
    label: 'Artistes',
    sortable: true,
    getValue: (e: Exhibition) => e.artists.length,
    render: (e: Exhibition) => (
      <span className="text-sm">
        {e.artists.map((a) => a.artist.name).join(', ') || '—'}
      </span>
    ),
  },
  {
    key: 'visible',
    label: 'Visible',
    render: (e: Exhibition) => (
      <Badge variant={e.visible ? 'default' : 'secondary'}>
        {e.visible ? 'Visible' : 'Masqué'}
      </Badge>
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
