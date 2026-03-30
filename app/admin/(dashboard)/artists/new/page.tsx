import Link from 'next/link';
import { createArtist } from '@/lib/actions/artists';
import { ArtistForm } from '@/components/admin/artist-form';

export default function NewArtistPage() {
  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/artists" className="text-sm text-gray-500 hover:text-gray-700">
          &larr; Back to artists
        </Link>
        <h1 className="text-2xl font-bold mt-2">New Artist</h1>
      </div>
      <ArtistForm action={createArtist} />
    </div>
  );
}
