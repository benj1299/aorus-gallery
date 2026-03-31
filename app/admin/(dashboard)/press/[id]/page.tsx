import { notFound } from 'next/navigation';
import { getPressArticleById } from '@/lib/queries/press';
import { updatePressArticle } from '@/lib/actions/press';
import { PressForm } from '@/components/admin/press-form';
import { AdminBreadcrumb } from '@/components/admin/admin-breadcrumb';
import type { TranslatableField } from '@/lib/i18n-content';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditPressPage({ params }: Props) {
  const { id } = await params;
  const article = await getPressArticleById(id);

  if (!article) notFound();

  const updateWithId = updatePressArticle.bind(null, article.id);
  const title = (article.title as TranslatableField).fr || (article.title as TranslatableField).en || 'Article';

  return (
    <div className="space-y-6">
      <AdminBreadcrumb items={[
        { label: 'Presse', href: '/admin/press' },
        { label: `Modifier : ${title}` },
      ]} />

      <h1 className="text-2xl font-bold tracking-tight">Modifier : {title}</h1>

      <PressForm
        action={updateWithId}
        defaultValues={{
          title: article.title as TranslatableField,
          publication: article.publication,
          publishedAt: article.publishedAt.toISOString().split('T')[0],
          url: article.url ?? '',
          imageUrl: article.imageUrl ?? '',
          excerpt: (article.excerpt as TranslatableField | null) ?? undefined,
          sortOrder: article.sortOrder,
          visible: article.visible,
        }}
      />
    </div>
  );
}
