'use client';

import Link from 'next/link';
import { AdminSearchInput, useSearch } from '@/components/admin/admin-search';
import { resolveTranslation, type TranslatableField } from '@/lib/i18n-content';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, MoreHorizontal, Pencil } from 'lucide-react';

type Exhibition = {
  id: string;
  slug: string;
  title: unknown;
  type: string;
  status: string;
  visible: boolean;
  location: string | null;
  artists: { artist: { name: string } }[];
  _count: { artworks: number };
};

function statusLabel(status: string) {
  switch (status) {
    case 'CURRENT': return 'En cours';
    case 'UPCOMING': return '\u00c0 venir';
    default: return 'Pass\u00e9e';
  }
}

function statusVariant(status: string) {
  switch (status) {
    case 'CURRENT': return 'default' as const;
    case 'UPCOMING': return 'outline' as const;
    default: return 'secondary' as const;
  }
}

function typeLabel(type: string) {
  switch (type) {
    case 'EXHIBITION': return 'Exposition';
    case 'ART_FAIR': return 'Foire';
    case 'OFFSITE': return 'Hors les murs';
    default: return type;
  }
}

export function ExhibitionsListClient({ exhibitions }: { exhibitions: Exhibition[] }) {
  const { query, setQuery, filtered } = useSearch(exhibitions, ['title', 'location']);

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild><Link href="/admin">Administration</Link></BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Expositions</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Expositions</h1>
        <Button asChild>
          <Link href="/admin/exhibitions/new">
            <Plus className="w-4 h-4 mr-1" />
            Nouvelle exposition
          </Link>
        </Button>
      </div>

      <AdminSearchInput value={query} onChange={setQuery} placeholder="Rechercher une exposition..." />

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titre</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Artistes</TableHead>
              <TableHead>&OElig;uvres</TableHead>
              <TableHead>Visibilit&eacute;</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((exhibition) => (
              <TableRow key={exhibition.id}>
                <TableCell>
                  <p className="font-medium text-sm">{resolveTranslation(exhibition.title as TranslatableField, 'fr')}</p>
                  <p className="text-muted-foreground text-xs">{exhibition.slug}</p>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{typeLabel(exhibition.type)}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant(exhibition.status)}>
                    {statusLabel(exhibition.status)}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">
                  {exhibition.artists.map((a) => a.artist.name).join(', ') || '\u2014'}
                </TableCell>
                <TableCell className="text-sm">{exhibition._count.artworks}</TableCell>
                <TableCell>
                  <Badge variant={exhibition.visible ? 'default' : 'secondary'}>
                    {exhibition.visible ? 'Visible' : 'Masqu\u00e9'}
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
                        <Link href={`/admin/exhibitions/${exhibition.id}`} className="flex items-center gap-2">
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
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  Aucune exposition pour le moment. <Link href="/admin/exhibitions/new" className="underline">Cr&eacute;ez la premi&egrave;re</Link>.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
