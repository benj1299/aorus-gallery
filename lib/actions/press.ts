'use server';

import { db } from '@/lib/db-typed';
import { Prisma } from '@prisma/client';
import { requireAuth } from '@/lib/auth-utils';
import { revalidateEntity } from '@/lib/actions/helpers';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { translatableSchema, optionalTranslatableSchema, extractTranslatable } from '@/lib/i18n-content';
import { optionalHttpsUrl, serializeTranslatable, booleanFromString } from '@/lib/schemas/common';
import { slugify } from '@/lib/slugify';
import { sanitizeTranslatable } from '@/lib/sanitize';
import { parseFormData } from '@/lib/actions/safe-action';

const pressSchema = z.object({
  title: translatableSchema,
  publication: z.string().min(1),
  publishedAt: z.coerce.date(),
  url: optionalHttpsUrl,
  imageUrl: optionalHttpsUrl,
  excerpt: optionalTranslatableSchema,
  visible: booleanFromString.default(true),
  sortOrder: z.coerce.number().int().default(0),
});

export async function createPressArticle(formData: FormData): Promise<{ error: string } | void> {
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
  const parsed = parseFormData(pressSchema, raw);
  if (!parsed.success) return { error: parsed.error };
  const data = parsed.data;
  const slug = slugify(data.title.en);

  try {
    await db.pressArticle.create({
      data: {
        ...data,
        slug,
        url: data.url || null,
        imageUrl: data.imageUrl || null,
        excerpt: serializeTranslatable(data.excerpt),
      },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
      return { error: 'Un élément avec ce nom existe déjà. Veuillez choisir un autre nom.' };
    }
    throw e;
  }

  revalidateEntity('/admin/press', ['/press']);
  redirect('/admin/press');
}

export async function updatePressArticle(id: string, formData: FormData): Promise<{ error: string } | void> {
  await requireAuth();

  const existing = await db.pressArticle.findUnique({ where: { id }, select: { id: true } });
  if (!existing) return { error: 'Élément introuvable' };

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
  const parsed = parseFormData(pressSchema, raw);
  if (!parsed.success) return { error: parsed.error };
  const data = parsed.data;

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

export async function deletePressArticle(id: string): Promise<{ error: string } | void> {
  await requireAuth();
  const existing = await db.pressArticle.findUnique({ where: { id }, select: { id: true } });
  if (!existing) return { error: 'Élément introuvable' };
  await db.pressArticle.delete({ where: { id } });
  revalidateEntity('/admin/press', ['/press']);
}

const PRESS_TOGGLE_FIELDS = ['visible'] as const;

export async function togglePressField(id: string, field: 'visible'): Promise<{ error: string } | void> {
  await requireAuth();
  if (!(PRESS_TOGGLE_FIELDS as readonly string[]).includes(field)) throw new Error('Invalid field');
  const current = await db.pressArticle.findUnique({ where: { id }, select: { [field]: true } });
  if (!current) return { error: 'Élément introuvable' };
  await db.pressArticle.update({ where: { id }, data: { [field]: !current[field] } });
  revalidateEntity('/admin/press', ['/press']);
}
