import Link from 'next/link';
import { getAllExhibitionsAdmin } from '@/lib/queries/exhibitions';
import { deleteExhibition } from '@/lib/actions/exhibitions';
import { DeleteButton } from '@/components/admin/delete-button';
import { resolveTranslation, type TranslatableField } from '@/lib/i18n-content';

export default async function AdminExhibitionsPage() {
  const exhibitions = await getAllExhibitionsAdmin();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Exhibitions</h1>
        <Link
          href="/admin/exhibitions/new"
          className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800"
        >
          + New Exhibition
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Artists</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Artworks</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Visible</th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {exhibitions.map((exhibition) => (
              <tr key={exhibition.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <p className="font-medium text-sm">{resolveTranslation(exhibition.title as TranslatableField, 'en')}</p>
                  <p className="text-gray-400 text-xs">{exhibition.slug}</p>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{exhibition.type.replace('_', ' ')}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    exhibition.status === 'CURRENT' ? 'bg-green-50 text-green-700' :
                    exhibition.status === 'UPCOMING' ? 'bg-blue-50 text-blue-700' :
                    'bg-gray-100 text-gray-500'
                  }`}>
                    {exhibition.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {exhibition.artists.map((a) => a.artist.name).join(', ') || '—'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{exhibition._count.artworks}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${exhibition.visible ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {exhibition.visible ? 'Yes' : 'Hidden'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/exhibitions/${exhibition.id}`}
                      className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                    >
                      Edit
                    </Link>
                    <DeleteButton id={exhibition.id} action={deleteExhibition} label="exhibition" />
                  </div>
                </td>
              </tr>
            ))}
            {exhibitions.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                  No exhibitions yet. Create your first one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
