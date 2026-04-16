'use client';

import { useTranslations } from 'next-intl';
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

export function PressListClient({ articles }: { articles: PressArticle[] }) {
  const t = useTranslations('admin');

  const columns = [
    {
      key: 'title',
      label: t('press.columns.title'),
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
      label: t('press.columns.publication'),
      sortable: true,
      getValue: (a: PressArticle) => a.publication,
      render: (a: PressArticle) => <span className="text-sm text-gray-900">{a.publication}</span>,
    },
    {
      key: 'publishedAt',
      label: t('press.columns.date'),
      render: (a: PressArticle) => <span className="text-sm text-gray-900">{a.publishedAtFormatted}</span>,
    },
    {
      key: 'visible',
      label: t('press.columns.visible'),
      render: (a: PressArticle) => (
        <QuickToggle id={a.id} field="visible" checked={a.visible} action={togglePressField} label={t('forms.visible')} />
      ),
    },
  ];

  return (
    <AdminTable
      title={t('press.title')}
      data={articles}
      columns={columns}
      searchKeys={['title', 'publication']}
      searchPlaceholder={t('press.searchPlaceholder')}
      newHref="/admin/press/new"
      newLabel={t('press.newArticle')}
      editHref={(a) => `/admin/press/${a.id}`}
      deleteAction={deletePressArticle}
      getId={(a) => a.id}
    />
  );
}
