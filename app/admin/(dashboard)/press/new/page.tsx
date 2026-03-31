import { createPressArticle } from '@/lib/actions/press';
import { PressForm } from '@/components/admin/press-form';
import { AdminBreadcrumb } from '@/components/admin/admin-breadcrumb';

export default function NewPressPage() {
  return (
    <div className="space-y-6">
      <AdminBreadcrumb items={[
        { label: 'Presse', href: '/admin/press' },
        { label: 'Nouvel article' },
      ]} />

      <h1 className="text-2xl font-bold tracking-tight">Nouvel article de presse</h1>

      <PressForm action={createPressArticle} />
    </div>
  );
}
