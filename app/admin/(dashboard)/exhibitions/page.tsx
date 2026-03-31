import { getAllExhibitionsAdmin } from '@/lib/queries/exhibitions';
import { ExhibitionsListClient } from './client';

export default async function AdminExhibitionsPage() {
  const exhibitions = await getAllExhibitionsAdmin();
  return <ExhibitionsListClient exhibitions={exhibitions} />;
}
