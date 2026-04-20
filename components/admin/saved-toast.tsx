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
    const key = `${pathname}:${saved ?? deleted ?? ''}`;
    if (!saved && !deleted) return;
    if (firedRef.current === key) return;
    firedRef.current = key;

    if (saved) {
      toast.success(t('saved', { defaultValue: 'Modifications enregistrées' }));
    } else if (deleted) {
      toast.success(t('deleted', { defaultValue: 'Supprimé' }));
    }

    const params = new URLSearchParams(searchParams.toString());
    params.delete('saved');
    params.delete('deleted');
    const clean = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.replace(clean, { scroll: false });
  }, [searchParams, router, pathname, t]);

  return null;
}
