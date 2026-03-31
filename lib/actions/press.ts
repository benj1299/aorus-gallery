'use server';

import { prisma } from '@/lib/db';
import { Prisma } from '@prisma/client';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { translatableSchema, optionalTranslatableSchema, extractTranslatable } from '@/lib/i18n-content';
import { slugify } from '@/lib/slugify';

const pressSchema = z.object({
  title: translatableSchema,
  publication: z.string().min(1),
  publishedAt: z.coerce.date(),
  url: z.string().url().refine((url) => url.startsWith('https://') || url.startsWith('data:'), { message: 'URL must use HTTPS or data URI' }).optional().or(z.literal('')),
  imageUrl: z.string().url().refine((url) => url.startsWith('https://') || url.startsWith('data:'), { message: 'URL must use HTTPS or data URI' }).optional().or(z.literal('')),
  excerpt: optionalTranslatableSchema,
  visible: z.coerce.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
});

async function requireAuth() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error('Unauthorized');
  return session;
}

function revalidateAll() {
  revalidatePath('/admin/press');
  revalidatePath('/[locale]/press', 'page');
}

export async function createPressArticle(formData: FormData) {
  await requireAuth();

  const raw = {
    title: extractTranslatable(formData, 'title'),
    publication: formData.get('publication')?.toString() ?? '',
    publishedAt: formData.get('publishedAt')?.toString() ?? '',
    url: formData.get('url')?.toString() ?? '',
    imageUrl: formData.get('imageUrl')?.toString() ?? '',
    excerpt: extractTranslatable(formData, 'excerpt'),
    visible: formData.get('visible')?.toString() ?? 'false',
    sortOrder: formData.get('sortOrder')?.toString() ?? '0',
  };
  const data = pressSchema.parse(raw);
  const slug = slugify(data.title.en);

  const excerptVal = data.excerpt && (data.excerpt.en || data.excerpt.fr || data.excerpt.zh) ? data.excerpt : Prisma.JsonNull;

  await prisma.pressArticle.create({
    data: {
      ...data,
      slug,
      url: data.url || null,
      imageUrl: data.imageUrl || null,
      excerpt: excerptVal,
    },
  });

  revalidateAll();
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
    excerpt: extractTranslatable(formData, 'excerpt'),
    visible: formData.get('visible')?.toString() ?? 'false',
    sortOrder: formData.get('sortOrder')?.toString() ?? '0',
  };
  const data = pressSchema.parse(raw);

  const excerptVal = data.excerpt && (data.excerpt.en || data.excerpt.fr || data.excerpt.zh) ? data.excerpt : Prisma.JsonNull;

  await prisma.pressArticle.update({
    where: { id },
    data: {
      ...data,
      url: data.url || null,
      imageUrl: data.imageUrl || null,
      excerpt: excerptVal,
    },
  });

  revalidateAll();
  redirect('/admin/press');
}

export async function deletePressArticle(id: string) {
  await requireAuth();
  await prisma.pressArticle.delete({ where: { id } });
  revalidateAll();
}
