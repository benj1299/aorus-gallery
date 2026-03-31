import Link from 'next/link';
import { createArtwork } from '@/lib/actions/artworks';
import { ArtworkForm } from '@/components/admin/artwork-form';
import { prisma } from '@/lib/db';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

export default async function NewArtworkPage() {
  const artists = await prisma.artist.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true },
  });

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild><Link href="/admin">Administration</Link></BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild><Link href="/admin/artworks">{'\u0152uvres'}</Link></BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Nouvelle {'\u0153uvre'}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold tracking-tight">Nouvelle {'\u0153uvre'}</h1>

      <ArtworkForm action={createArtwork} artists={artists} />
    </div>
  );
}
