'use client';

import { AdminTable } from '@/components/admin/admin-table';
import { resolveTranslation, type TranslatableField } from '@/lib/i18n-content';
import { deletePressArticle, togglePressField } from '@/lib/actions/press';
import { QuickToggle } from '@/components/admin/quick-toggle';

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
      <QuickToggle id={a.id} field="visible" checked={a.visible} action={togglePressField} label="Visible" />
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
