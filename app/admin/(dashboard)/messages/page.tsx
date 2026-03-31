import Link from 'next/link';
import { prisma } from '@/lib/db';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { AdminSearch } from '@/components/admin/admin-search';

async function getContactSubmissions() {
  const raw = await prisma.contactSubmission.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return raw.map((s) => ({
    ...s,
    createdAtFormatted: s.createdAt.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
  }));
}

export default async function AdminMessagesPage() {
  const submissions = await getContactSubmissions();

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

      <AdminSearch items={submissions} searchKeys={['name' as keyof typeof submissions[0], 'email' as keyof typeof submissions[0], 'message' as keyof typeof submissions[0]]} placeholder="Rechercher un message...">
        {(filtered) => (
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
        )}
      </AdminSearch>
    </div>
  );
}
