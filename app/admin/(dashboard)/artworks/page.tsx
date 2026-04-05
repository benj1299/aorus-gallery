import { getAllArtworksAdmin } from '@/lib/queries/artworks';
import { db } from '@/lib/db-typed';
import { ArtworksListClient } from './client';

export const dynamic = 'force-dynamic';

export default async function AdminArtworksPage() {
  const [artworks, artists] = await Promise.all([
    getAllArtworksAdmin(),
    db.artist.findMany({ select: { id: true, name: true }, orderBy: { name: 'asc' } }),
  ]);
  return <ArtworksListClient artworks={artworks} artists={artists} />;
}
