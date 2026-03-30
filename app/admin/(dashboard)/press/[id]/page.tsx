import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPressArticleById } from '@/lib/queries/press';
import { updatePressArticle } from '@/lib/actions/press';
import { PressForm } from '@/components/admin/press-form';
import type { TranslatableField } from '@/lib/i18n-content';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditPressPage({ params }: Props) {
  const { id } = await params;
  const article = await getPressArticleById(id);

  if (!article) notFound();

  const updateWithId = updatePressArticle.bind(null, article.id);

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/press" className="text-sm text-gray-500 hover:text-gray-700">
          &larr; Back to press
        </Link>
        <h1 className="text-2xl font-bold mt-2">Edit: {(article.title as TranslatableField).en || 'Article'}</h1>
      </div>
      <PressForm
        action={updateWithId}
        defaultValues={{
          title: article.title as TranslatableField,
          slug: article.slug,
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
