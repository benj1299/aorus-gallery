import { getAllArtistsAdmin } from '@/lib/queries/artists';
import { ArtistsListClient } from './client';

export const dynamic = 'force-dynamic';

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function AdminArtistsPage({ searchParams }: Props) {
  const { page: pageStr } = await searchParams;
  const page = Math.max(1, parseInt(pageStr || '1', 10));

  const result = await getAllArtistsAdmin(page, 20);

  return (
    <ArtistsListClient
      artists={result.items}
      serverPagination={{
        totalPages: result.totalPages,
        currentPage: result.page,
        totalItems: result.total,
        basePath: '/admin/artists',
      }}
    />
  );
}
