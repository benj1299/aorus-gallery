import { getAllExhibitionsAdmin } from '@/lib/queries/exhibitions';
import { ExhibitionsListClient } from './client';

export const dynamic = 'force-dynamic';

export default async function AdminExhibitionsPage() {
  const exhibitions = await getAllExhibitionsAdmin();
  return <ExhibitionsListClient exhibitions={exhibitions} />;
}
