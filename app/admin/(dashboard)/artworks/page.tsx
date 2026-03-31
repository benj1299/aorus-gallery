import { getAllArtworksAdmin } from '@/lib/queries/artworks';
import { ArtworksListClient } from './client';

export default async function AdminArtworksPage() {
  const artworks = await getAllArtworksAdmin();
  return <ArtworksListClient artworks={artworks} />;
}
