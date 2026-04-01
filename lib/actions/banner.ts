'use server';

import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth-utils';
import { revalidateEntity } from '@/lib/actions/helpers';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { translatableSchema, optionalTranslatableSchema, extractTranslatable } from '@/lib/i18n-content';
import { httpsUrl, serializeTranslatable } from '@/lib/schemas/common';
import { sanitizeTranslatable } from '@/lib/sanitize';

const bannerSchema = z.object({
  title: translatableSchema,
  subtitle: optionalTranslatableSchema,
  imageUrl: httpsUrl,
  linkUrl: z.string().optional().default(''),
  visible: z.coerce.boolean().default(false),
});

export async function upsertBanner(formData: FormData) {
  await requireAuth();

  const raw = {
    title: extractTranslatable(formData, 'title'),
    subtitle: sanitizeTranslatable(extractTranslatable(formData, 'subtitle')),
    imageUrl: formData.get('imageUrl')?.toString() ?? '',
    linkUrl: formData.get('linkUrl')?.toString() ?? '',
    visible: formData.get('visible')?.toString() ?? 'false',
  };
  const data = bannerSchema.parse(raw);

  const existing = await prisma.homeBanner.findFirst();
  if (existing) {
    await prisma.homeBanner.update({
      where: { id: existing.id },
      data: { ...data, subtitle: serializeTranslatable(data.subtitle), linkUrl: data.linkUrl || null },
    });
  } else {
    await prisma.homeBanner.create({
      data: { ...data, subtitle: serializeTranslatable(data.subtitle), linkUrl: data.linkUrl || null },
    });
  }

  revalidateEntity('/admin/banner', ['']);
  redirect('/admin/banner');
}
