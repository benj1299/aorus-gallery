import Link from 'next/link';
import { getAllExhibitionsAdmin } from '@/lib/queries/exhibitions';
import { deleteExhibition } from '@/lib/actions/exhibitions';
import { DeleteButton } from '@/components/admin/delete-button';
import { resolveTranslation, type TranslatableField } from '@/lib/i18n-content';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

function statusVariant(status: string) {
  switch (status) {
    case 'CURRENT': return 'default' as const;
    case 'UPCOMING': return 'outline' as const;
    default: return 'secondary' as const;
  }
}

export default async function AdminExhibitionsPage() {
  const exhibitions = await getAllExhibitionsAdmin();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Exhibitions</h1>
        <Button asChild>
          <Link href="/admin/exhibitions/new">
            <Plus className="w-4 h-4 mr-1" />
            New Exhibition
          </Link>
        </Button>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Artists</TableHead>
              <TableHead>Artworks</TableHead>
              <TableHead>Visible</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {exhibitions.map((exhibition) => (
              <TableRow key={exhibition.id}>
                <TableCell>
                  <p className="font-medium text-sm">{resolveTranslation(exhibition.title as TranslatableField, 'en')}</p>
                  <p className="text-muted-foreground text-xs">{exhibition.slug}</p>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{exhibition.type.replace('_', ' ')}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant(exhibition.status)}>
                    {exhibition.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">
                  {exhibition.artists.map((a) => a.artist.name).join(', ') || '\u2014'}
                </TableCell>
                <TableCell className="text-sm">{exhibition._count.artworks}</TableCell>
                <TableCell>
                  <Badge variant={exhibition.visible ? 'default' : 'secondary'}>
                    {exhibition.visible ? 'Visible' : 'Hidden'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/exhibitions/${exhibition.id}`}>Edit</Link>
                    </Button>
                    <DeleteButton id={exhibition.id} action={deleteExhibition} label="exhibition" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {exhibitions.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  No exhibitions yet. Create your first one.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
