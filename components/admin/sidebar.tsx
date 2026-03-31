'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { Users, Image, Newspaper, Megaphone, Calendar, Mail, LogOut, LayoutDashboard, Settings } from 'lucide-react';

interface AdminSidebarProps {
  messageCount?: number;
}

const navItems = [
  { label: 'Tableau de bord', href: '/admin', icon: LayoutDashboard, exact: true },
  { label: 'Artistes', href: '/admin/artists', icon: Users },
  { label: 'Oeuvres', href: '/admin/artworks', icon: Image },
  { label: 'Presse', href: '/admin/press', icon: Newspaper },
  { label: 'Banniere', href: '/admin/banner', icon: Megaphone },
  { label: 'Expositions', href: '/admin/exhibitions', icon: Calendar },
  { label: 'Messages', href: '/admin/messages', icon: Mail, showBadge: true },
  { label: 'Paramètres', href: '/admin/settings', icon: Settings },
];

export function AdminSidebar({ messageCount = 0 }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push('/admin/login');
  };

  return (
    <aside className="w-64 min-h-screen border-r border-gray-200 bg-white flex flex-col">
      <div className="p-6">
        <Link href="/admin" className="text-lg font-semibold tracking-widest text-gray-900 uppercase">
          Administration ORUS
        </Link>
      </div>
      <div className="h-px bg-gray-200" />
      <nav className="flex-1 p-3 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href) && item.href !== '/admin';
          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                isActive
                  ? 'flex items-center w-full gap-3 h-10 px-3 bg-gray-100 text-gray-900 border-l-2 border-emerald-600 rounded-r-md font-medium text-sm'
                  : 'flex items-center w-full gap-3 h-10 px-3 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md font-normal text-sm'
              }
            >
              <Icon className="w-4 h-4" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.showBadge && messageCount > 0 && (
                <span className="ml-auto bg-gray-900 text-white text-xs px-2 py-0.5 rounded-full">
                  {messageCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="h-px bg-gray-200" />
      <div className="p-3">
        <button
          onClick={handleLogout}
          className="flex items-center w-full gap-3 h-10 px-3 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md text-sm"
        >
          <LogOut className="w-4 h-4" />
          Deconnexion
        </button>
      </div>
    </aside>
  );
}
