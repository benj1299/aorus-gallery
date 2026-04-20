'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

/**
 * Listens for a `?saved=1` (or custom action label) query param set by a
 * server action after a successful redirect, fires a sonner success toast,
 * then cleans the URL. Rendered once at the admin layout level.
 *
 * Why not useActionState? Server actions here redirect() on success, which
 * interrupts the React state return. A URL flag round-trip is the cheapest
 * cross-navigation signal without touching every action signature.
 */
export function SavedToast() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('admin.feedback');
  const firedRef = useRef<string>('');

  useEffect(() => {
    const saved = searchParams.get('saved');
    const deleted = searchParams.get('deleted');
    const created = searchParams.get('created');
    const key = `${pathname}:${saved ?? deleted ?? created ?? ''}`;
    if (!saved && !deleted && !created) return;
    if (firedRef.current === key) return;
    firedRef.current = key;

    if (saved) {
      toast.success(t('saved', { defaultValue: 'Modifications enregistrées' }));
    } else if (deleted) {
      toast.success(t('deleted', { defaultValue: 'Supprimé' }));
    } else if (created) {
      toast.success(t('created', { defaultValue: 'Créé avec succès' }));
    }

    // Leave ?created alone for 2.5s so the AdminTable row animation can pick
    // it up before we strip the query. Other flags can be cleaned immediately.
    const params = new URLSearchParams(searchParams.toString());
    params.delete('saved');
    params.delete('deleted');
    const cleanImmediate = () => {
      const next = params.toString() ? `${pathname}?${params.toString()}` : pathname;
      router.replace(next, { scroll: false });
    };

    if (!created) {
      cleanImmediate();
      return;
    }

    cleanImmediate();
    const timer = window.setTimeout(() => {
      const params2 = new URLSearchParams(window.location.search);
      params2.delete('created');
      const clean = params2.toString() ? `${pathname}?${params2.toString()}` : pathname;
      router.replace(clean, { scroll: false });
    }, 2_500);
    return () => window.clearTimeout(timer);
  }, [searchParams, router, pathname, t]);

  return null;
}
