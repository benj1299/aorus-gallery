import { requireAuth } from '@/lib/auth-utils';
import { AdminSidebar } from '@/components/admin/sidebar';
import { Toaster } from 'sonner';
import { prisma } from '@/lib/db';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAuth();

  const messageCount = await prisma.contactSubmission.count({
    where: { status: 'new' },
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar messageCount={messageCount} />
      <main className="flex-1 p-6 md:p-10">{children}</main>
      <Toaster position="top-right" theme="light" />
    </div>
  );
}
