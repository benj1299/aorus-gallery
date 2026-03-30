import Link from 'next/link';
import { getAllPressAdmin } from '@/lib/queries/press';
import { deletePressArticle } from '@/lib/actions/press';
import { DeleteButton } from '@/components/admin/delete-button';
import { resolveTranslation, type TranslatableField } from '@/lib/i18n-content';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default async function AdminPressPage() {
  const articles = await getAllPressAdmin();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Press Articles</h1>
        <Button asChild>
          <Link href="/admin/press/new">
            <Plus className="w-4 h-4 mr-1" />
            New Article
          </Link>
        </Button>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Publication</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Visible</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {articles.map((article) => (
              <TableRow key={article.id}>
                <TableCell>
                  <p className="font-medium text-sm">{resolveTranslation(article.title as TranslatableField, 'en')}</p>
                  <p className="text-muted-foreground text-xs">{article.slug}</p>
                </TableCell>
                <TableCell className="text-sm">{article.publication}</TableCell>
                <TableCell className="text-sm">
                  {article.publishedAt.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </TableCell>
                <TableCell>
                  <Badge variant={article.visible ? 'default' : 'secondary'}>
                    {article.visible ? 'Visible' : 'Hidden'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/press/${article.id}`}>Edit</Link>
                    </Button>
                    <DeleteButton id={article.id} action={deletePressArticle} label="article" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {articles.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No press articles yet. Create your first one.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
