import Link from 'next/link';
import { prisma } from '@/lib/db';
import { getTranslations } from 'next-intl/server';
import { Users, Image, Calendar, Mail, Plus, ArrowRight } from 'lucide-react';

async function getDashboardData() {
  const [artistCount, artworkCount, exhibitionCount, messageCount, recentMessages] = await Promise.all([
    prisma.artist.count(),
    prisma.artwork.count(),
    prisma.galleryExhibition.count(),
    prisma.contactSubmission.count(),
    prisma.contactSubmission.findMany({
      orderBy: { createdAt: 'desc' },
      take: 3,
    }),
  ]);

  return { artistCount, artworkCount, exhibitionCount, messageCount, recentMessages };
}

export default async function AdminDashboardPage() {
  const { artistCount, artworkCount, exhibitionCount, messageCount, recentMessages } = await getDashboardData();
  const t = await getTranslations('admin.dashboard');

  const stats = [
    { label: t('stats.artists'), count: artistCount, icon: Users, href: '/admin/artists' },
    { label: t('stats.artworks'), count: artworkCount, icon: Image, href: '/admin/artworks' },
    { label: t('stats.exhibitions'), count: exhibitionCount, icon: Calendar, href: '/admin/exhibitions' },
    { label: t('stats.messages'), count: messageCount, icon: Mail, href: '/admin/messages' },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t('title')}</h1>
        <p className="text-gray-500 text-sm mt-1">{t('subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.href} href={stat.href}>
              <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{stat.count}</p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-gray-500" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">{t('recentMessages')}</h2>
          <Link href="/admin/messages" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors">
            {t('viewAll')}
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        {recentMessages.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 py-10 text-center text-gray-500">
            {t('noMessages')}
          </div>
        ) : (
          <div className="space-y-3">
            {recentMessages.map((msg) => (
              <div key={msg.id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-gray-900 font-medium text-sm">{msg.name}</p>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 capitalize">
                        {msg.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{msg.message}</p>
                  </div>
                  <p className="text-xs text-gray-400 whitespace-nowrap">
                    {msg.createdAt.toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('quickActions')}</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/artists/new" className="inline-flex items-center justify-center px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
            <Plus className="w-4 h-4 mr-1" />
            {t('newArtist')}
          </Link>
          <Link href="/admin/artworks/new" className="inline-flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-900 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">
            <Plus className="w-4 h-4 mr-1" />
            {t('newArtwork')}
          </Link>
          <Link href="/admin/exhibitions/new" className="inline-flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-900 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">
            <Plus className="w-4 h-4 mr-1" />
            {t('newExhibition')}
          </Link>
        </div>
      </div>
    </div>
  );
}
