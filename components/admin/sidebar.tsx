'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { Users, Image, Newspaper, Megaphone, Calendar, Mail, LogOut } from 'lucide-react';

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
    <aside className="w-64 min-h-screen border-r border-gray-200 bg-white flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <Link href="/admin" className="text-xl font-bold tracking-wide">
          ORUS Admin
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                pathname.startsWith(item.href)
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
