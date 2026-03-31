'use client';

import Link from 'next/link';
import { AdminSearchInput, useSearch } from '@/components/admin/admin-search';
import { resolveTranslation, type TranslatableField } from '@/lib/i18n-content';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Plus, MoreHorizontal, Pencil } from 'lucide-react';

type Artwork = {
  id: string;
  slug: string;
  title: unknown;
  imageUrl: string;
  dimensions: string | null;
  medium: unknown;
  price: number | null;
  currency: string | null;
  visible: boolean;
  featuredHome: boolean;
  artist: { name: string; slug: string };
};

export function ArtworksListClient({ artworks }: { artworks: Artwork[] }) {
  const { query, setQuery, filtered } = useSearch(artworks, ['title', 'artist']);

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild><Link href="/admin">Administration</Link></BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>&OElig;uvres</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">&OElig;uvres</h1>
        <Button asChild>
          <Link href="/admin/artworks/new">
            <Plus className="w-4 h-4 mr-1" />
            Nouvelle &oelig;uvre
          </Link>
        </Button>
      </div>

      <AdminSearchInput value={query} onChange={setQuery} placeholder="Rechercher une \u0153uvre..." />

      <div className="rounded-lg border" style={{ background: "#fff" }}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>&OElig;uvre</TableHead>
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
                    <Avatar className="h-12 w-12 rounded">
                      <AvatarImage src={artwork.imageUrl} alt={resolveTranslation(artwork.title as TranslatableField, 'fr')} />
                      <AvatarFallback className="rounded">{resolveTranslation(artwork.title as TranslatableField, 'fr').charAt(0)}</AvatarFallback>
                    </Avatar>
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
                  Aucune &oelig;uvre pour le moment. <Link href="/admin/artworks/new" className="underline">Cr&eacute;ez la premi&egrave;re</Link>.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
