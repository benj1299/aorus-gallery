import Link from 'next/link';
import { getAllArtworksAdmin } from '@/lib/queries/artworks';
import { AdminSearch } from '@/components/admin/admin-search';
import { resolveTranslation, type TranslatableField } from '@/lib/i18n-content';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, MoreHorizontal, Pencil } from 'lucide-react';

export default async function AdminArtworksPage() {
  const artworks = await getAllArtworksAdmin();

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild><Link href="/admin">Administration</Link></BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>\u0152uvres</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">\u0152uvres</h1>
        <Button asChild>
          <Link href="/admin/artworks/new">
            <Plus className="w-4 h-4 mr-1" />
            Nouvelle \u0153uvre
          </Link>
        </Button>
      </div>

      <AdminSearch items={artworks} searchKeys={['title' as keyof typeof artworks[0], 'artist' as keyof typeof artworks[0]]} placeholder="Rechercher une \u0153uvre...">
        {(filtered) => (
          <div className="rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>\u0152uvre</TableHead>
                  <TableHead>Artiste</TableHead>
                  <TableHead>Technique</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((artwork) => (
                  <TableRow key={artwork.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {artwork.imageUrl && (
                          <img src={artwork.imageUrl} alt="" className="w-12 h-12 rounded object-cover" />
                        )}
                        <div>
                          <p className="font-medium text-sm">{resolveTranslation(artwork.title as TranslatableField, 'fr')}</p>
                          <p className="text-muted-foreground text-xs">{artwork.dimensions}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{artwork.artist.name}</TableCell>
                    <TableCell className="text-sm">{artwork.medium ? resolveTranslation(artwork.medium as TranslatableField, 'fr') : '\u2014'}</TableCell>
                    <TableCell className="text-sm">
                      {artwork.price ? `${artwork.price} ${artwork.currency}` : '\u2014'}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Badge variant={artwork.visible ? 'default' : 'secondary'}>
                          {artwork.visible ? 'Visible' : 'Masqu\u00e9'}
                        </Badge>
                        {artwork.featuredHome && (
                          <Badge variant="outline">En avant</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/artworks/${artwork.id}`} className="flex items-center gap-2">
                              <Pencil className="h-3.5 w-3.5" />
                              Modifier
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      Aucune \u0153uvre pour le moment. <Link href="/admin/artworks/new" className="underline">Cr\u00e9ez la premi\u00e8re</Link>.
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
