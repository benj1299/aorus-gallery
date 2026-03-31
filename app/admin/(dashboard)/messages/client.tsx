'use client';

import { AdminTable } from '@/components/admin/admin-table';
import { Badge } from '@/components/ui/badge';

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
      <Badge variant="outline" className="capitalize">{s.status}</Badge>
    ),
  },
  {
    key: 'name',
    label: 'Nom',
    sortable: true,
    getValue: (s: ContactSubmission) => s.name,
    render: (s: ContactSubmission) => <span className="font-medium text-sm">{s.name}</span>,
  },
  {
    key: 'email',
    label: 'Email',
    render: (s: ContactSubmission) => (
      <a href={`mailto:${s.email}`} className="text-sm hover:underline text-foreground">
        {s.email}
      </a>
    ),
  },
  {
    key: 'message',
    label: 'Message',
    render: (s: ContactSubmission) => (
      <span className="text-sm max-w-xs truncate block">{s.message}</span>
    ),
  },
  {
    key: 'createdAt',
    label: 'Date',
    render: (s: ContactSubmission) => (
      <span className="text-sm text-muted-foreground whitespace-nowrap">{s.createdAtFormatted}</span>
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
