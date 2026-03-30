import Link from 'next/link';
import { createExhibition } from '@/lib/actions/exhibitions';
import { ExhibitionForm } from '@/components/admin/exhibition-form';
import { prisma } from '@/lib/db';
import { resolveTranslation, type TranslatableField } from '@/lib/i18n-content';

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
    title: resolveTranslation(aw.title as TranslatableField, 'en'),
  }));

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/exhibitions" className="text-sm text-gray-500 hover:text-gray-700">
          &larr; Back to exhibitions
        </Link>
        <h1 className="text-2xl font-bold mt-2">New Exhibition</h1>
      </div>
      <ExhibitionForm action={createExhibition} artists={artists} artworks={artworkOptions} />
    </div>
  );
}
