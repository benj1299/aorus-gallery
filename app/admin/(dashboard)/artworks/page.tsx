import Link from 'next/link';
import { getAllArtworksAdmin } from '@/lib/queries/artworks';
import { deleteArtwork } from '@/lib/actions/artworks';
import { DeleteButton } from '@/components/admin/delete-button';
import { resolveTranslation, type TranslatableField } from '@/lib/i18n-content';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default async function AdminArtworksPage() {
  const artworks = await getAllArtworksAdmin();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Artworks</h1>
        <Button asChild>
          <Link href="/admin/artworks/new">
            <Plus className="w-4 h-4 mr-1" />
            New Artwork
          </Link>
        </Button>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Artwork</TableHead>
              <TableHead>Artist</TableHead>
              <TableHead>Medium</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Visible</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {artworks.map((artwork) => (
              <TableRow key={artwork.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {artwork.imageUrl && (
                      <img src={artwork.imageUrl} alt="" className="w-12 h-12 rounded object-cover" />
                    )}
                    <div>
                      <p className="font-medium text-sm">{resolveTranslation(artwork.title as TranslatableField, 'en')}</p>
                      <p className="text-muted-foreground text-xs">{artwork.dimensions}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm">{artwork.artist.name}</TableCell>
                <TableCell className="text-sm">{artwork.medium ? resolveTranslation(artwork.medium as TranslatableField, 'en') : '\u2014'}</TableCell>
                <TableCell className="text-sm">
                  {artwork.price ? `${artwork.price} ${artwork.currency}` : '\u2014'}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Badge variant={artwork.visible ? 'default' : 'secondary'}>
                      {artwork.visible ? 'Visible' : 'Hidden'}
                    </Badge>
                    {artwork.featuredHome && (
                      <Badge variant="outline">Featured</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/artworks/${artwork.id}`}>Edit</Link>
                    </Button>
                    <DeleteButton id={artwork.id} action={deleteArtwork} label="artwork" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {artworks.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No artworks yet. Create your first one.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
