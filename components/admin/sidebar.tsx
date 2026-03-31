'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { Users, Image, Newspaper, Megaphone, Calendar, Mail, LogOut, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

interface AdminSidebarProps {
  messageCount?: number;
}

const navItems = [
  { label: 'Tableau de bord', href: '/admin', icon: LayoutDashboard, exact: true },
  { label: 'Artistes', href: '/admin/artists', icon: Users },
  { label: '\u0152uvres', href: '/admin/artworks', icon: Image },
  { label: 'Presse', href: '/admin/press', icon: Newspaper },
  { label: 'Banni\u00e8re', href: '/admin/banner', icon: Megaphone },
  { label: 'Expositions', href: '/admin/exhibitions', icon: Calendar },
  { label: 'Messages', href: '/admin/messages', icon: Mail, showBadge: true },
];

export function AdminSidebar({ messageCount = 0 }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push('/admin/login');
  };

  return (
    <aside className="w-64 min-h-screen border-r bg-card flex flex-col">
      <div className="p-6">
        <Link href="/admin" className="text-lg font-semibold tracking-widest text-foreground uppercase">
          Administration ORUS
        </Link>
      </div>
      <Separator />
      <nav className="flex-1 p-3 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href) && item.href !== '/admin';
          return (
            <Button
              key={item.href}
              variant={isActive ? 'secondary' : 'ghost'}
              className="w-full justify-start gap-3 h-10"
              asChild
            >
              <Link href={item.href}>
                <Icon className="w-4 h-4" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.showBadge && messageCount > 0 && (
                  <Badge variant="default" className="ml-auto h-5 min-w-5 flex items-center justify-center text-xs px-1.5">
                    {messageCount}
                  </Badge>
                )}
              </Link>
            </Button>
          );
        })}
      </nav>
      <Separator />
      <div className="p-3">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-10 text-muted-foreground"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          D\u00e9connexion
        </Button>
      </div>
    </aside>
  );
}
