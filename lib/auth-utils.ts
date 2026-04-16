import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export async function requireAuth() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect('/admin/login');
  if (session.user.role !== 'admin') redirect('/admin/login');
  return session;
}
