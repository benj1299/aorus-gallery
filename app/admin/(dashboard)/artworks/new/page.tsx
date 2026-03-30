import Link from 'next/link';
import { createArtwork } from '@/lib/actions/artworks';
import { ArtworkForm } from '@/components/admin/artwork-form';
import { prisma } from '@/lib/db';

export default async function NewArtworkPage() {
  const artists = await prisma.artist.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true },
  });

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/artworks" className="text-sm text-gray-500 hover:text-gray-700">
          &larr; Back to artworks
        </Link>
        <h1 className="text-2xl font-bold mt-2">New Artwork</h1>
      </div>
      <ArtworkForm action={createArtwork} artists={artists} />
    </div>
  );
}
