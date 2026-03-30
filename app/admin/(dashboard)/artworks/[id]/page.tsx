import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { updateArtwork } from '@/lib/actions/artworks';
import { ArtworkForm } from '@/components/admin/artwork-form';
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

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/artworks" className="text-sm text-gray-500 hover:text-gray-700">
          &larr; Back to artworks
        </Link>
        <h1 className="text-2xl font-bold mt-2">Edit: {(artwork.title as TranslatableField).en || 'Artwork'}</h1>
      </div>
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
