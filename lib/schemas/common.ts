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

/** Read a positive int from FormData; returns null if missing or invalid. */
export function readDimension(formData: FormData, name: string): number | null {
  const raw = formData.get(name)?.toString();
  if (!raw) return null;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}

/** Read serialized images metadata array from FormData. */
export function readImagesMeta(formData: FormData, name: string): Array<{ width: number | null; height: number | null }> | null {
  const raw = formData.get(name)?.toString();
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed.map((entry) => ({
      width: entry && typeof entry.width === 'number' ? entry.width : null,
      height: entry && typeof entry.height === 'number' ? entry.height : null,
    }));
  } catch {
    return null;
  }
}
