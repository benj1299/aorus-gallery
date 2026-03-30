import Link from 'next/link';
import { getAllArtistsAdmin } from '@/lib/queries/artists';
import { deleteArtist } from '@/lib/actions/artists';
import { DeleteButton } from '@/components/admin/delete-button';
import { resolveTranslation, type TranslatableField } from '@/lib/i18n-content';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default async function AdminArtistsPage() {
  const artists = await getAllArtistsAdmin();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Artists</h1>
        <Button asChild>
          <Link href="/admin/artists/new">
            <Plus className="w-4 h-4 mr-1" />
            New Artist
          </Link>
        </Button>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Artist</TableHead>
              <TableHead>Nationality</TableHead>
              <TableHead>Artworks</TableHead>
              <TableHead>Visible</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {artists.map((artist) => (
              <TableRow key={artist.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {artist.imageUrl && (
                      <img src={artist.imageUrl} alt="" className="w-10 h-10 rounded-full object-cover" />
                    )}
                    <div>
                      <p className="font-medium text-sm">{artist.name}</p>
                      <p className="text-muted-foreground text-xs">{artist.slug}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm">{resolveTranslation(artist.nationality as TranslatableField, 'en')}</TableCell>
                <TableCell className="text-sm">{artist._count.artworks}</TableCell>
                <TableCell>
                  <Badge variant={artist.visible ? 'default' : 'secondary'}>
                    {artist.visible ? 'Visible' : 'Hidden'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/artists/${artist.id}`}>Edit</Link>
                    </Button>
                    <DeleteButton id={artist.id} action={deleteArtist} label="artist" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {artists.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No artists yet. Create your first one.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
