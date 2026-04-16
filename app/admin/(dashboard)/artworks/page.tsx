import { getAllArtworksAdmin } from '@/lib/queries/artworks';
import { db } from '@/lib/db-typed';
import { ArtworksListClient } from './client';

export const dynamic = 'force-dynamic';

interface Props {
  searchParams: Promise<{ page?: string; artistId?: string }>;
}

export default async function AdminArtworksPage({ searchParams }: Props) {
  const { page: pageStr, artistId } = await searchParams;
  const page = Math.max(1, parseInt(pageStr || '1', 10));

  const [result, artists] = await Promise.all([
    getAllArtworksAdmin(page, 20, artistId || undefined),
    db.artist.findMany({ select: { id: true, name: true }, orderBy: { name: 'asc' } }),
  ]);

  // Build search params to preserve in pagination links
  const paginationSearchParams: Record<string, string> = {};
  if (artistId) paginationSearchParams.artistId = artistId;

  return (
    <ArtworksListClient
      artworks={result.items}
      artists={artists}
      currentArtistId={artistId || ''}
      serverPagination={{
        totalPages: result.totalPages,
        currentPage: result.page,
        totalItems: result.total,
        basePath: '/admin/artworks',
        searchParams: paginationSearchParams,
      }}
    />
  );
}
