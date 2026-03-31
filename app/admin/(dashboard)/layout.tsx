import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/sidebar';
import { Toaster } from 'sonner';
import { prisma } from '@/lib/db';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect('/admin/login');
  }

  const messageCount = await prisma.contactSubmission.count();

  return (
    <div className="admin-theme flex min-h-screen bg-background">
      <AdminSidebar messageCount={messageCount} />
      <main className="flex-1 p-6 md:p-10">{children}</main>
      <Toaster position="top-right" theme="light" />
    </div>
  );
}
