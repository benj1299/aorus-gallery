import { z } from 'zod';
import { Prisma } from '@prisma/client';
import type { TranslatableField } from '@/lib/i18n-content';

export const httpsUrl = z.string().url().refine(
  (url) => url.startsWith('https://'),
  { message: 'URL must use HTTPS' }
);

export const optionalHttpsUrl = z.string().url().refine(
  (url) => url.startsWith('https://'),
  { message: 'URL must use HTTPS' }
).optional().or(z.literal(''));

export function serializeTranslatable(field: TranslatableField | undefined | null): TranslatableField | typeof Prisma.JsonNull {
  if (field && (field.en || field.fr || field.zh)) return field;
  return Prisma.JsonNull;
}
