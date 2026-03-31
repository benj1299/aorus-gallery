'use server';

import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

async function requireAuth() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error('Unauthorized');
  return session;
}

export async function deleteMessage(id: string) {
  await requireAuth();
  await prisma.contactSubmission.delete({ where: { id } });
  revalidatePath('/admin/messages');
  redirect('/admin/messages');
}
