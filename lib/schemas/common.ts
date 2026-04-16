import { z } from 'zod';
import { Prisma } from '@prisma/client';
import type { TranslatableField } from '@/lib/i18n-content';

/** Parse "true"/"false" string from FormData hidden inputs — replaces z.coerce.boolean() which treats Boolean("false") as true */
export const booleanFromString = z
  .union([z.boolean(), z.string()])
  .transform((v) => v === true || v === 'true');

export const httpsUrl = z.string().url().refine(
  (url) => url.startsWith('https://') || url.startsWith('data:'),
  { message: 'URL must use HTTPS or data URI' }
);

export const optionalHttpsUrl = z.string().url().refine(
  (url) => url.startsWith('https://') || url.startsWith('data:'),
  { message: 'URL must use HTTPS or data URI' }
).optional().or(z.literal(''));

export function serializeTranslatable(field: TranslatableField | undefined | null): TranslatableField | typeof Prisma.JsonNull {
  if (field && (field.en || field.fr || field.zh)) return field;
  return Prisma.JsonNull;
}
