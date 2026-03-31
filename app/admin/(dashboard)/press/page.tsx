import Link from 'next/link';
import { getAllPressAdmin } from '@/lib/queries/press';
import { AdminSearch } from '@/components/admin/admin-search';
import { resolveTranslation, type TranslatableField } from '@/lib/i18n-content';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, MoreHorizontal, Pencil } from 'lucide-react';

export default async function AdminPressPage() {
  const raw = await getAllPressAdmin();

  const articles = raw.map((a) => ({
    ...a,
    publishedAtFormatted: a.publishedAt.toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' }),
  }));

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild><Link href="/admin">Administration</Link></BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Presse</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Articles de presse</h1>
        <Button asChild>
          <Link href="/admin/press/new">
            <Plus className="w-4 h-4 mr-1" />
            Nouvel article
          </Link>
        </Button>
      </div>

      <AdminSearch items={articles} searchKeys={['title' as keyof typeof articles[0], 'publication' as keyof typeof articles[0]]} placeholder="Rechercher un article...">
        {(filtered) => (
          <div className="rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titre</TableHead>
                  <TableHead>Publication</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell>
                      <p className="font-medium text-sm">{resolveTranslation(article.title as TranslatableField, 'fr')}</p>
                      <p className="text-muted-foreground text-xs">{article.slug}</p>
                    </TableCell>
                    <TableCell className="text-sm">{article.publication}</TableCell>
                    <TableCell className="text-sm">{article.publishedAtFormatted}</TableCell>
                    <TableCell>
                      <Badge variant={article.visible ? 'default' : 'secondary'}>
                        {article.visible ? 'Visible' : 'Masqu\u00e9'}
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
                            <Link href={`/admin/press/${article.id}`} className="flex items-center gap-2">
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
                      Aucun article de presse pour le moment. <Link href="/admin/press/new" className="underline">Cr\u00e9ez le premier</Link>.
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
