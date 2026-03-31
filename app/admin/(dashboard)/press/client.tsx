'use client';

import { AdminTable } from '@/components/admin/admin-table';
import { resolveTranslation, type TranslatableField } from '@/lib/i18n-content';
import { deletePressArticle } from '@/lib/actions/press';

type PressArticle = {
  id: string;
  slug: string;
  title: unknown;
  publication: string;
  publishedAtFormatted: string;
  visible: boolean;
};

const columns = [
  {
    key: 'title',
    label: 'Titre',
    sortable: true,
    getValue: (a: PressArticle) => resolveTranslation(a.title as TranslatableField, 'fr'),
    render: (a: PressArticle) => (
      <div>
        <p className="font-medium text-sm text-gray-900">{resolveTranslation(a.title as TranslatableField, 'fr')}</p>
        <p className="text-gray-500 text-xs">{a.slug}</p>
      </div>
    ),
  },
  {
    key: 'publication',
    label: 'Publication',
    sortable: true,
    getValue: (a: PressArticle) => a.publication,
    render: (a: PressArticle) => <span className="text-sm text-gray-900">{a.publication}</span>,
  },
  {
    key: 'publishedAt',
    label: 'Date',
    render: (a: PressArticle) => <span className="text-sm text-gray-900">{a.publishedAtFormatted}</span>,
  },
  {
    key: 'visible',
    label: 'Visible',
    render: (a: PressArticle) => (
      a.visible
        ? <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">Visible</span>
        : <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">Masqué</span>
    ),
  },
];

export function PressListClient({ articles }: { articles: PressArticle[] }) {
  return (
    <AdminTable
      title="Articles de presse"
      data={articles}
      columns={columns}
      searchKeys={['title', 'publication']}
      searchPlaceholder="Rechercher un article..."
      newHref="/admin/press/new"
      newLabel="Nouvel article"
      editHref={(a) => `/admin/press/${a.id}`}
      deleteAction={deletePressArticle}
      getId={(a) => a.id}
    />
  );
}
