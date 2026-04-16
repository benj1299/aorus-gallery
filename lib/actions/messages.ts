'use server';

import { db } from '@/lib/db-typed';
import { requireAuth } from '@/lib/auth-utils';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function deleteMessage(id: string): Promise<{ error: string } | void> {
  await requireAuth();
  const existing = await db.contactSubmission.findUnique({ where: { id }, select: { id: true } });
  if (!existing) return { error: 'Élément introuvable' };
  await db.contactSubmission.delete({ where: { id } });
  revalidatePath('/admin/messages');
  redirect('/admin/messages');
}
