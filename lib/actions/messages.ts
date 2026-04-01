'use server';

import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth-utils';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function deleteMessage(id: string) {
  await requireAuth();
  await prisma.contactSubmission.delete({ where: { id } });
  revalidatePath('/admin/messages');
  redirect('/admin/messages');
}
