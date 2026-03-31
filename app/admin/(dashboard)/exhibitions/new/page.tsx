import Link from 'next/link';
import { createExhibition } from '@/lib/actions/exhibitions';
import { ExhibitionForm } from '@/components/admin/exhibition-form';
import { prisma } from '@/lib/db';
import { resolveTranslation, type TranslatableField } from '@/lib/i18n-content';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

export default async function NewExhibitionPage() {
  const [artists, artworks] = await Promise.all([
    prisma.artist.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true } }),
    prisma.artwork.findMany({
      orderBy: { sortOrder: 'asc' },
      select: { id: true, title: true },
    }),
  ]);

  const artworkOptions = artworks.map((aw) => ({
    id: aw.id,
    title: resolveTranslation(aw.title as TranslatableField, 'fr'),
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
            <BreadcrumbLink asChild><Link href="/admin/exhibitions">Expositions</Link></BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Nouvelle exposition</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold tracking-tight">Nouvelle exposition</h1>

      <ExhibitionForm action={createExhibition} artists={artists} artworks={artworkOptions} />
    </div>
  );
}
