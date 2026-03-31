import { getAllPressAdmin } from '@/lib/queries/press';
import { PressListClient } from './client';

export default async function AdminPressPage() {
  const raw = await getAllPressAdmin();

  const articles = raw.map((a) => ({
    ...a,
    publishedAtFormatted: a.publishedAt.toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' }),
  }));

  return <PressListClient articles={articles} />;
}
