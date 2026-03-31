import Link from 'next/link';
import { prisma } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

  const stats = [
    { label: 'Artistes', count: artistCount, icon: Users, href: '/admin/artists' },
    { label: 'Œuvres', count: artworkCount, icon: Image, href: '/admin/artworks' },
    { label: 'Expositions', count: exhibitionCount, icon: Calendar, href: '/admin/exhibitions' },
    { label: 'Messages', count: messageCount, icon: Mail, href: '/admin/messages' },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="text-muted-foreground text-sm mt-1">Vue d&apos;ensemble de votre galerie</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.href} href={stat.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-3xl font-bold mt-1">{stat.count}</p>
                    </div>
                    <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                      <Icon className="h-6 w-6 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Derniers messages</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/messages">
              Voir tout
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>
        {recentMessages.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              Aucun message pour le moment.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {recentMessages.map((msg) => (
              <Card key={msg.id}>
                <CardContent className="py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-sm">{msg.name}</p>
                        <Badge variant="outline" className="capitalize text-xs">
                          {msg.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{msg.message}</p>
                    </div>
                    <p className="text-xs text-muted-foreground whitespace-nowrap">
                      {msg.createdAt.toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Actions rapides</h2>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/admin/artists/new">
              <Plus className="w-4 h-4 mr-1" />
              Nouvel artiste
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/artworks/new">
              <Plus className="w-4 h-4 mr-1" />
              Nouvelle œuvre
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/exhibitions/new">
              <Plus className="w-4 h-4 mr-1" />
              Nouvelle exposition
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
