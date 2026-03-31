'use server';

import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth-utils';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function updateSiteSettings(formData: FormData) {
  await requireAuth();

  const showExhibitions = formData.get('showExhibitions')?.toString() === 'true';

  await prisma.siteSettings.upsert({
    where: { id: 'default' },
    update: { showExhibitions },
    create: { id: 'default', showExhibitions },
  });

  revalidatePath('/admin/settings');
  revalidatePath('/[locale]', 'layout');
  redirect('/admin/settings');
}
