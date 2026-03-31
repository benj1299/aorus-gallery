import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { AdminBreadcrumb } from '@/components/admin/admin-breadcrumb';
import { MessageDeleteButton } from './delete-button';

interface Props {
  params: Promise<{ id: string }>;
}

function statusBadge(status: string) {
  switch (status) {
    case 'collector':
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">Collectionneur</span>;
    case 'press':
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Presse</span>;
    case 'institution':
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">Institution</span>;
    case 'corporate':
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Entreprise</span>;
    case 'artist':
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">Artiste</span>;
    default:
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">{status}</span>;
  }
}

export default async function MessageDetailPage({ params }: Props) {
  const { id } = await params;
  const message = await prisma.contactSubmission.findUnique({ where: { id } });
  if (!message) notFound();

  const createdAt = message.createdAt.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="space-y-6">
      <AdminBreadcrumb items={[
        { label: 'Messages', href: '/admin/messages' },
        { label: message.name },
      ]} />

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Message de {message.name}</h1>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/messages"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Retour
          </Link>
          <MessageDeleteButton id={message.id} />
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-6 space-y-6">
          {/* Status & Date */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium uppercase tracking-wider text-gray-400">Statut</span>
              {statusBadge(message.status)}
            </div>
            <span className="text-sm text-gray-500">{createdAt}</span>
          </div>

          <div className="border-t border-gray-100" />

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-1">Nom</p>
              <p className="text-sm text-gray-900">{message.name}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-1">Email</p>
              <a href={`mailto:${message.email}`} className="text-sm text-emerald-700 hover:underline">
                {message.email}
              </a>
            </div>
            {message.interestedIn && (
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-1">Interesse par</p>
                <p className="text-sm text-gray-900 capitalize">{message.interestedIn}</p>
              </div>
            )}
            {message.preferredLanguage && (
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-1">Langue preferee</p>
                <p className="text-sm text-gray-900 uppercase">{message.preferredLanguage}</p>
              </div>
            )}
          </div>

          <div className="border-t border-gray-100" />

          {/* Message */}
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-3">Message</p>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{message.message}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
