import { prisma } from '@/lib/db';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

async function getContactSubmissions() {
  return prisma.contactSubmission.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export default async function AdminMessagesPage() {
  const submissions = await getContactSubmissions();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Contact Messages</h1>
        <span className="text-sm text-muted-foreground">{submissions.length} message{submissions.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.map((sub) => (
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
                  {sub.createdAt.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </TableCell>
              </TableRow>
            ))}
            {submissions.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No contact messages yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
