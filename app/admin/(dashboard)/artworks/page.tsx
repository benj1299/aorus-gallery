import Link from 'next/link';
import { getAllArtworksAdmin } from '@/lib/queries/artworks';
import { deleteArtwork } from '@/lib/actions/artworks';
import { DeleteButton } from '@/components/admin/delete-button';
import { resolveTranslation, type TranslatableField } from '@/lib/i18n-content';

export default async function AdminArtworksPage() {
  const artworks = await getAllArtworksAdmin();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Artworks</h1>
        <Link
          href="/admin/artworks/new"
          className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800"
        >
          + New Artwork
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Artwork</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Artist</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Medium</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Visible</th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {artworks.map((artwork) => (
              <tr key={artwork.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {artwork.imageUrl && (
                      <img src={artwork.imageUrl} alt="" className="w-12 h-12 rounded object-cover" />
                    )}
                    <div>
                      <p className="font-medium text-sm">{resolveTranslation(artwork.title as TranslatableField, 'en')}</p>
                      <p className="text-gray-400 text-xs">{artwork.dimensions}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{artwork.artist.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{artwork.medium ? resolveTranslation(artwork.medium as TranslatableField, 'en') : '—'}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {artwork.price ? `${artwork.price} ${artwork.currency}` : '—'}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${artwork.visible ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {artwork.visible ? 'Yes' : 'Hidden'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/artworks/${artwork.id}`}
                      className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                    >
                      Edit
                    </Link>
                    <DeleteButton id={artwork.id} action={deleteArtwork} label="artwork" />
                  </div>
                </td>
              </tr>
            ))}
            {artworks.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                  No artworks yet. Create your first one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
