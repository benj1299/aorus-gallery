'use server';

import { db } from '@/lib/db-typed';
import { requireAuth } from '@/lib/auth-utils';
import { revalidateEntity } from '@/lib/actions/helpers';
import { redirect } from 'next/navigation';

export async function updateSiteSettings(formData: FormData) {
  await requireAuth();

  const showExhibitions = formData.get('showExhibitions')?.toString() === 'true';
  const showBanner = formData.get('showBanner')?.toString() === 'true';

  await db.siteSettings.upsert({
    where: { id: 'default' },
    update: { showExhibitions, showBanner },
    create: { id: 'default', showExhibitions, showBanner },
  });

  revalidateEntity('/admin/settings', ['']);
  redirect('/admin/settings?saved=1');
}
