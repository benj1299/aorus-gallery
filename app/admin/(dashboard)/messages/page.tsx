import { prisma } from '@/lib/db';
import { MessagesListClient } from './client';

async function getContactSubmissions() {
  const raw = await prisma.contactSubmission.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return raw.map((s) => ({
    ...s,
    createdAtFormatted: s.createdAt.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
  }));
}

export default async function AdminMessagesPage() {
  const submissions = await getContactSubmissions();
  return <MessagesListClient submissions={submissions} />;
}
