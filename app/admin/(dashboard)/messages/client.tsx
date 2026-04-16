'use client';

import { useTranslations } from 'next-intl';
import { AdminTable } from '@/components/admin/admin-table';
import { Eye } from 'lucide-react';

type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  message: string;
  status: string;
  createdAtFormatted: string;
};

export function MessagesListClient({ submissions }: { submissions: ContactSubmission[] }) {
  const t = useTranslations('admin');

  const columns = [
    {
      key: 'status',
      label: t('messages.columns.status'),
      render: (s: ContactSubmission) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 capitalize">{s.status}</span>
      ),
    },
    {
      key: 'name',
      label: t('messages.columns.name'),
      sortable: true,
      getValue: (s: ContactSubmission) => s.name,
      render: (s: ContactSubmission) => <span className="font-medium text-sm text-gray-900">{s.name}</span>,
    },
    {
      key: 'email',
      label: t('messages.columns.email'),
      render: (s: ContactSubmission) => (
        <a href={`mailto:${s.email}`} className="text-sm hover:underline text-gray-900">
          {s.email}
        </a>
      ),
    },
    {
      key: 'message',
      label: t('messages.columns.message'),
      render: (s: ContactSubmission) => (
        <span className="text-sm text-gray-600 max-w-xs truncate block">{s.message}</span>
      ),
    },
    {
      key: 'view',
      label: '',
      render: (s: ContactSubmission) => (
        <a href={`/admin/messages/${s.id}`}
           className="inline-flex items-center justify-center h-7 w-7 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
           title={t('table.viewMessage')}
           data-testid="view-btn">
          <Eye className="h-3.5 w-3.5" />
        </a>
      ),
    },
    {
      key: 'createdAt',
      label: t('messages.columns.date'),
      render: (s: ContactSubmission) => (
        <span className="text-sm text-gray-500 whitespace-nowrap">{s.createdAtFormatted}</span>
      ),
    },
  ];

  return (
    <AdminTable
      title={t('messages.title')}
      data={submissions}
      columns={columns}
      searchKeys={['name', 'email', 'message']}
      searchPlaceholder={t('messages.searchPlaceholder')}
      editHref={(s) => `/admin/messages/${s.id}`}
      getId={(s) => s.id}
    />
  );
}
