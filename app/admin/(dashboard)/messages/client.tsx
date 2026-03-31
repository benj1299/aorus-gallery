'use client';

import Link from 'next/link';
import { AdminSearchInput, useSearch } from '@/components/admin/admin-search';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  message: string;
  status: string;
  createdAtFormatted: string;
};

export function MessagesListClient({ submissions }: { submissions: ContactSubmission[] }) {
  const { query, setQuery, filtered } = useSearch(submissions, ['name', 'email', 'message']);

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild><Link href="/admin">Administration</Link></BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Messages</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Messages de contact</h1>
        <span className="text-sm text-muted-foreground">{submissions.length} message{submissions.length !== 1 ? 's' : ''}</span>
      </div>

      <AdminSearchInput value={query} onChange={setQuery} placeholder="Rechercher un message..." />

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Statut</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((sub) => (
              <TableRow key={sub.id}>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {sub.status}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium text-sm">{sub.name}</TableCell>
                <TableCell className="text-sm">
                  <a href={`mailto:${sub.email}`} className="hover:underline text-foreground">{sub.email}</a>
                </TableCell>
                <TableCell className="text-sm max-w-xs truncate">{sub.message}</TableCell>
                <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                  {sub.createdAtFormatted}
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  Aucun message de contact pour le moment.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
