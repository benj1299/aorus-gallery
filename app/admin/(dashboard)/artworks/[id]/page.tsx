import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { updateArtwork } from '@/lib/actions/artworks';
import { ArtworkForm } from '@/components/admin/artwork-form';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import type { TranslatableField } from '@/lib/i18n-content';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditArtworkPage({ params }: Props) {
  const { id } = await params;

  const [artwork, artists] = await Promise.all([
    prisma.artwork.findUnique({ where: { id } }),
    prisma.artist.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true } }),
  ]);

  if (!artwork) notFound();

  const updateWithId = updateArtwork.bind(null, artwork.id);
  const title = (artwork.title as TranslatableField).fr || (artwork.title as TranslatableField).en || '\u0152uvre';

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
            <BreadcrumbPage>Modifier : {title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold tracking-tight">Modifier : {title}</h1>

      <ArtworkForm
        action={updateWithId}
        artists={artists}
        defaultValues={{
          title: artwork.title as TranslatableField,
          artistId: artwork.artistId,
          medium: (artwork.medium as TranslatableField | null) ?? undefined,
          dimensions: artwork.dimensions ?? '',
          year: artwork.year,
          price: artwork.price ? Number(artwork.price) : null,
          currency: artwork.currency,
          imageUrl: artwork.imageUrl,
          sortOrder: artwork.sortOrder,
          visible: artwork.visible,
          featuredHome: artwork.featuredHome,
          showPrice: artwork.showPrice,
        }}
      />
    </div>
  );
}
