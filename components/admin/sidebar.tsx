'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { Users, Image, Newspaper, Megaphone, Calendar, Mail, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const navItems = [
  { label: 'Artists', href: '/admin/artists', icon: Users },
  { label: 'Artworks', href: '/admin/artworks', icon: Image },
  { label: 'Press', href: '/admin/press', icon: Newspaper },
  { label: 'Banner', href: '/admin/banner', icon: Megaphone },
  { label: 'Exhibitions', href: '/admin/exhibitions', icon: Calendar },
  { label: 'Messages', href: '/admin/messages', icon: Mail },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push('/admin/login');
  };

  return (
    <aside className="w-64 min-h-screen border-r border-border bg-card flex flex-col">
      <div className="p-6">
        <Link href="/admin" className="text-xl font-bold tracking-wide text-foreground">
          ORUS Admin
        </Link>
      </div>
      <Separator />
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);
          return (
            <Button
              key={item.href}
              variant={isActive ? 'secondary' : 'ghost'}
              className="w-full justify-start gap-3 h-10"
              asChild
            >
              <Link href={item.href}>
                <Icon className="w-4 h-4" />
                {item.label}
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
          Logout
        </Button>
      </div>
    </aside>
  );
}
