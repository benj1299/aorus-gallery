'use server';

import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth-utils';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function updateSiteSettings(formData: FormData) {
  await requireAuth();

  const showExhibitions = formData.get('showExhibitions')?.toString() === 'true';
  const showBanner = formData.get('showBanner')?.toString() === 'true';

  await prisma.siteSettings.upsert({
    where: { id: 'default' },
    update: { showExhibitions, showBanner },
    create: { id: 'default', showExhibitions, showBanner },
  });

  revalidatePath('/admin/settings');
  revalidatePath('/[locale]', 'layout');
  redirect('/admin/settings');
}
