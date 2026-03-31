'use server';

import { prisma } from '@/lib/db';
import { Prisma } from '@prisma/client';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { translatableSchema, optionalTranslatableSchema, extractTranslatable } from '@/lib/i18n-content';

const bannerSchema = z.object({
  title: translatableSchema,
  subtitle: optionalTranslatableSchema,
  imageUrl: z.string().url().refine((url) => url.startsWith('https://') || url.startsWith('data:'), { message: 'URL must use HTTPS or data URI' }),
  linkUrl: z.string().optional().default(''),
  visible: z.coerce.boolean().default(false),
});

async function requireAuth() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error('Unauthorized');
  return session;
}

export async function upsertBanner(formData: FormData) {
  await requireAuth();

  const raw = {
    title: extractTranslatable(formData, 'title'),
    subtitle: extractTranslatable(formData, 'subtitle'),
    imageUrl: formData.get('imageUrl')?.toString() ?? '',
    linkUrl: formData.get('linkUrl')?.toString() ?? '',
    visible: formData.get('visible')?.toString() ?? 'false',
  };
  const data = bannerSchema.parse(raw);

  const subtitleVal = data.subtitle && (data.subtitle.en || data.subtitle.fr || data.subtitle.zh) ? data.subtitle : Prisma.JsonNull;

  const existing = await prisma.homeBanner.findFirst();
  if (existing) {
    await prisma.homeBanner.update({
      where: { id: existing.id },
      data: { ...data, subtitle: subtitleVal, linkUrl: data.linkUrl || null },
    });
  } else {
    await prisma.homeBanner.create({
      data: { ...data, subtitle: subtitleVal, linkUrl: data.linkUrl || null },
    });
  }

  revalidatePath('/admin/banner');
  revalidatePath('/[locale]', 'page');
  redirect('/admin/banner');
}
