'use server';

import { db } from '@/lib/db-typed';
import { requireAuth } from '@/lib/auth-utils';
import { revalidateEntity } from '@/lib/actions/helpers';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { translatableSchema, optionalTranslatableSchema, extractTranslatable } from '@/lib/i18n-content';
import { optionalHttpsUrl, serializeTranslatable } from '@/lib/schemas/common';
import { slugify } from '@/lib/slugify';
import { sanitizeTranslatable } from '@/lib/sanitize';

const pressSchema = z.object({
  title: translatableSchema,
  publication: z.string().min(1),
  publishedAt: z.coerce.date(),
  url: optionalHttpsUrl,
  imageUrl: optionalHttpsUrl,
  excerpt: optionalTranslatableSchema,
  visible: z.coerce.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
});

export async function createPressArticle(formData: FormData) {
  await requireAuth();

  const raw = {
    title: extractTranslatable(formData, 'title'),
    publication: formData.get('publication')?.toString() ?? '',
    publishedAt: formData.get('publishedAt')?.toString() ?? '',
    url: formData.get('url')?.toString() ?? '',
    imageUrl: formData.get('imageUrl')?.toString() ?? '',
    excerpt: sanitizeTranslatable(extractTranslatable(formData, 'excerpt')),
    visible: formData.get('visible')?.toString() ?? 'false',
    sortOrder: formData.get('sortOrder')?.toString() ?? '0',
  };
  const data = pressSchema.parse(raw);
  const slug = slugify(data.title.en);

  await db.pressArticle.create({
    data: {
      ...data,
      slug,
      url: data.url || null,
      imageUrl: data.imageUrl || null,
      excerpt: serializeTranslatable(data.excerpt),
    },
  });

  revalidateEntity('/admin/press', ['/press']);
  redirect('/admin/press');
}

export async function updatePressArticle(id: string, formData: FormData) {
  await requireAuth();

  const raw = {
    title: extractTranslatable(formData, 'title'),
    publication: formData.get('publication')?.toString() ?? '',
    publishedAt: formData.get('publishedAt')?.toString() ?? '',
    url: formData.get('url')?.toString() ?? '',
    imageUrl: formData.get('imageUrl')?.toString() ?? '',
    excerpt: sanitizeTranslatable(extractTranslatable(formData, 'excerpt')),
    visible: formData.get('visible')?.toString() ?? 'false',
    sortOrder: formData.get('sortOrder')?.toString() ?? '0',
  };
  const data = pressSchema.parse(raw);

  await db.pressArticle.update({
    where: { id },
    data: {
      ...data,
      url: data.url || null,
      imageUrl: data.imageUrl || null,
      excerpt: serializeTranslatable(data.excerpt),
    },
  });

  revalidateEntity('/admin/press', ['/press']);
  redirect('/admin/press');
}

export async function deletePressArticle(id: string) {
  await requireAuth();
  await db.pressArticle.delete({ where: { id } });
  revalidateEntity('/admin/press', ['/press']);
}
