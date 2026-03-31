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

type Artist = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
  nationality: unknown;
  visible: boolean;
  _count: { artworks: number };
};

export function ArtistsListClient({ artists }: { artists: Artist[] }) {
  const { query, setQuery, filtered } = useSearch(artists, ['name']);

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild><Link href="/admin">Administration</Link></BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Artistes</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Artistes</h1>
        <Button asChild>
          <Link href="/admin/artists/new">
            <Plus className="w-4 h-4 mr-1" />
            Nouvel artiste
          </Link>
        </Button>
      </div>

      <AdminSearchInput value={query} onChange={setQuery} placeholder="Rechercher un artiste..." />

      <div className="rounded-lg border" style={{ background: "#fff" }}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Artiste</TableHead>
              <TableHead>Nationalit&eacute;</TableHead>
              <TableHead>&OElig;uvres</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((artist) => (
              <TableRow key={artist.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={artist.imageUrl} alt={artist.name} />
                      <AvatarFallback>{artist.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{artist.name}</p>
                      <p className="text-muted-foreground text-xs">{artist.slug}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm">{resolveTranslation(artist.nationality as TranslatableField, 'fr')}</TableCell>
                <TableCell className="text-sm">{artist._count.artworks}</TableCell>
                <TableCell>
                  <Badge variant={artist.visible ? 'default' : 'secondary'}>
                    {artist.visible ? 'Visible' : 'Masqu\u00e9'}
                  </Badge>
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
                        <Link href={`/admin/artists/${artist.id}`} className="flex items-center gap-2">
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
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  Aucun artiste pour le moment. <Link href="/admin/artists/new" className="underline">Cr&eacute;ez le premier</Link>.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
