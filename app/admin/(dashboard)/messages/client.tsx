'use client';

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

const columns = [
  {
    key: 'status',
    label: 'Statut',
    render: (s: ContactSubmission) => (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 capitalize">{s.status}</span>
    ),
  },
  {
    key: 'name',
    label: 'Nom',
    sortable: true,
    getValue: (s: ContactSubmission) => s.name,
    render: (s: ContactSubmission) => <span className="font-medium text-sm text-gray-900">{s.name}</span>,
  },
  {
    key: 'email',
    label: 'Email',
    render: (s: ContactSubmission) => (
      <a href={`mailto:${s.email}`} className="text-sm hover:underline text-gray-900">
        {s.email}
      </a>
    ),
  },
  {
    key: 'message',
    label: 'Message',
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
         title="Voir le message"
         data-testid="view-btn">
        <Eye className="h-3.5 w-3.5" />
      </a>
    ),
  },
  {
    key: 'createdAt',
    label: 'Date',
    render: (s: ContactSubmission) => (
      <span className="text-sm text-gray-500 whitespace-nowrap">{s.createdAtFormatted}</span>
    ),
  },
];

export function MessagesListClient({ submissions }: { submissions: ContactSubmission[] }) {
  return (
    <AdminTable
      title="Messages de contact"
      data={submissions}
      columns={columns}
      searchKeys={['name', 'email', 'message']}
      searchPlaceholder="Rechercher un message..."
      editHref={(s) => `/admin/messages/${s.id}`}
      getId={(s) => s.id}
    />
  );
}
