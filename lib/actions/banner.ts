'use server';

import { db } from '@/lib/db-typed';
import { requireAuth } from '@/lib/auth-utils';
import { revalidateEntity } from '@/lib/actions/helpers';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { translatableSchema, optionalTranslatableSchema, extractTranslatable } from '@/lib/i18n-content';
import { httpsUrl, optionalHttpsUrl, serializeTranslatable, booleanFromString } from '@/lib/schemas/common';
import { sanitizeTranslatable } from '@/lib/sanitize';
import { parseFormData } from '@/lib/actions/safe-action';

const bannerSchema = z.object({
  title: translatableSchema,
  subtitle: optionalTranslatableSchema,
  imageUrl: httpsUrl,
  linkUrl: optionalHttpsUrl,
  visible: booleanFromString.default(false),
});

export async function upsertBanner(formData: FormData): Promise<{ error: string } | void> {
  await requireAuth();

  const raw = {
    title: extractTranslatable(formData, 'title'),
    subtitle: sanitizeTranslatable(extractTranslatable(formData, 'subtitle')),
    imageUrl: formData.get('imageUrl')?.toString() ?? '',
    linkUrl: formData.get('linkUrl')?.toString() ?? '',
    visible: formData.get('visible')?.toString() ?? 'false',
  };
  const parsed = parseFormData(bannerSchema, raw);
  if (!parsed.success) return { error: parsed.error };
  const data = parsed.data;

  const existing = await db.homeBanner.findFirst();
  if (existing) {
    await db.homeBanner.update({
      where: { id: existing.id },
      data: { ...data, subtitle: serializeTranslatable(data.subtitle), linkUrl: data.linkUrl || null },
    });
  } else {
    await db.homeBanner.create({
      data: { ...data, subtitle: serializeTranslatable(data.subtitle), linkUrl: data.linkUrl || null },
    });
  }

  revalidateEntity('/admin/banner', ['']);
  redirect('/admin/banner');
}
