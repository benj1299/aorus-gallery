import { getAllArtistsAdmin } from '@/lib/queries/artists';
import { ArtistsListClient } from './client';

export default async function AdminArtistsPage() {
  const artists = await getAllArtistsAdmin();
  return <ArtistsListClient artists={artists} />;
}
