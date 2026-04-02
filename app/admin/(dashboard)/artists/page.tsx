import { getAllArtistsAdmin } from '@/lib/queries/artists';
import { ArtistsListClient } from './client';

export const dynamic = 'force-dynamic';

export default async function AdminArtistsPage() {
  const artists = await getAllArtistsAdmin();
  return <ArtistsListClient artists={artists} />;
}
