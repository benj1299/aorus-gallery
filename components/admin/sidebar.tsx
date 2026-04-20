'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Image,
  Newspaper,
  Megaphone,
  Calendar,
  Mail,
  LogOut,
  LayoutDashboard,
  Settings,
  Menu,
  X,
} from 'lucide-react';

interface AdminSidebarProps {
  messageCount?: number;
}

const NAV_KEYS = [
  { key: 'dashboard' as const, href: '/admin', icon: LayoutDashboard, exact: true },
  { key: 'artists' as const, href: '/admin/artists', icon: Users },
  { key: 'artworks' as const, href: '/admin/artworks', icon: Image },
  { key: 'press' as const, href: '/admin/press', icon: Newspaper },
  { key: 'banner' as const, href: '/admin/banner', icon: Megaphone },
  { key: 'exhibitions' as const, href: '/admin/exhibitions', icon: Calendar },
  { key: 'messages' as const, href: '/admin/messages', icon: Mail, showBadge: true },
  { key: 'settings' as const, href: '/admin/settings', icon: Settings },
];

function NavLinks({
  pathname,
  messageCount,
  onNavigate,
  t,
}: {
  pathname: string;
  messageCount: number;
  onNavigate?: () => void;
  t: (key: string) => string;
}) {
  return (
    <nav className="flex-1 p-3 space-y-0.5">
      {NAV_KEYS.map((item) => {
        const Icon = item.icon;
        const isActive = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href) && item.href !== '/admin';
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            data-testid={`nav-${item.href === '/admin' ? 'dashboard' : item.href.replace('/admin/', '')}`}
            className={
              isActive
                ? 'flex items-center w-full gap-3 h-11 px-3 bg-gray-100 text-gray-900 border-l-2 border-emerald-600 rounded-r-md font-medium text-sm'
                : 'flex items-center w-full gap-3 h-11 px-3 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md font-normal text-sm'
            }
          >
            <Icon className="w-4 h-4" />
            <span className="flex-1 text-left">{t(item.key)}</span>
            {item.showBadge && messageCount > 0 && (
              <span className="ml-auto bg-gray-900 text-white text-xs px-2 py-0.5 rounded-full">
                {messageCount}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

function LogoutButton({ t }: { t: (key: string) => string }) {
  const router = useRouter();
  const handleLogout = async () => {
    await authClient.signOut();
    router.push('/admin/login');
  };
  return (
    <button
      onClick={handleLogout}
      className="flex items-center w-full gap-3 h-11 px-3 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md text-sm"
    >
      <LogOut className="w-4 h-4" />
      {t('logout')}
    </button>
  );
}

export function AdminSidebar({ messageCount = 0 }: AdminSidebarProps) {
  const pathname = usePathname();
  const t = useTranslations('admin.nav');

  return (
    <aside
      className="hidden md:flex w-64 min-h-screen border-r border-gray-200 bg-white flex-col shrink-0"
      data-testid="admin-sidebar-desktop"
    >
      <div className="p-6">
        <Link href="/admin" className="text-lg font-semibold tracking-widest text-gray-900 uppercase">
          {t('title')}
        </Link>
      </div>
      <div className="h-px bg-gray-200" />
      <NavLinks pathname={pathname} messageCount={messageCount} t={t} />
      <div className="h-px bg-gray-200" />
      <div className="p-3">
        <LogoutButton t={t} />
      </div>
    </aside>
  );
}

/**
 * Mobile top bar with hamburger that opens the sidebar as a Sheet drawer.
 * Only visible below md (>=md uses the permanent AdminSidebar).
 */
export function AdminMobileTopBar({ messageCount = 0 }: AdminSidebarProps) {
  const pathname = usePathname();
  const t = useTranslations('admin.nav');
  const [open, setOpen] = useState(false);

  // Close drawer when pathname changes (after navigation)
  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    if (open) setOpen(false);
  }

  // Prevent body scroll when drawer open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <header
        className="md:hidden sticky top-0 z-30 flex items-center justify-between h-14 px-4 bg-white border-b border-gray-200"
        data-testid="admin-top-bar"
      >
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={t('openMenu', { defaultValue: 'Ouvrir le menu' })}
          className="p-2 -ml-2 rounded-md hover:bg-gray-100 relative"
          data-testid="admin-menu-trigger"
        >
          <Menu className="w-5 h-5" />
          {messageCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full" />
          )}
        </button>
        <Link href="/admin" className="text-sm font-semibold tracking-widest text-gray-900 uppercase">
          {t('title')}
        </Link>
        <div className="w-9" aria-hidden />
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="md:hidden fixed inset-0 z-40"
            data-testid="admin-sidebar-mobile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/40"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
            <motion.aside
              className="absolute left-0 top-0 h-full w-72 max-w-[85vw] bg-white border-r border-gray-200 flex flex-col shadow-xl"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center justify-between p-5 border-b border-gray-200">
                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className="text-base font-semibold tracking-widest text-gray-900 uppercase"
                >
                  {t('title')}
                </Link>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label={t('closeMenu', { defaultValue: 'Fermer le menu' })}
                  className="p-2 -mr-2 rounded-md hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <NavLinks
                pathname={pathname}
                messageCount={messageCount}
                onNavigate={() => setOpen(false)}
                t={t}
              />
              <div className="h-px bg-gray-200" />
              <div className="p-3">
                <LogoutButton t={t} />
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
