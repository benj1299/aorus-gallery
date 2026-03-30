import { z } from 'zod';
import type { Locale } from '@/i18n/routing';

export const LOCALES = ['en', 'fr', 'zh'] as const;

/** Shape of a translatable JSON column */
export type TranslatableField = Record<Locale, string>;

/** Create an empty translatable field */
export function emptyTranslatable(): TranslatableField {
  return { en: '', fr: '', zh: '' };
}

/** Resolve a translatable field to a string for a given locale, with en fallback */
export function resolveTranslation(
  field: TranslatableField | string | null | undefined,
  locale: Locale
): string {
  if (!field) return '';
  if (typeof field === 'string') return field;
  return field[locale] || field.en || '';
}

/** Extract translatable field from FormData using dot-notation keys */
export function extractTranslatable(formData: FormData, fieldName: string): TranslatableField {
  return {
    en: formData.get(`${fieldName}.en`)?.toString() ?? '',
    fr: formData.get(`${fieldName}.fr`)?.toString() ?? '',
    zh: formData.get(`${fieldName}.zh`)?.toString() ?? '',
  };
}

/** Extract an array of translatable fields from FormData using indexed dot-notation */
export function extractTranslatableArray(formData: FormData, fieldName: string): TranslatableField[] {
  const results: TranslatableField[] = [];
  let i = 0;
  while (formData.has(`${fieldName}.${i}.en`)) {
    results.push({
      en: formData.get(`${fieldName}.${i}.en`)?.toString() ?? '',
      fr: formData.get(`${fieldName}.${i}.fr`)?.toString() ?? '',
      zh: formData.get(`${fieldName}.${i}.zh`)?.toString() ?? '',
    });
    i++;
  }
  return results.filter(t => t.en || t.fr || t.zh);
}

export const translatableSchema = z.object({
  en: z.string(),
  fr: z.string(),
  zh: z.string(),
});

export const optionalTranslatableSchema = z.object({
  en: z.string().optional().default(''),
  fr: z.string().optional().default(''),
  zh: z.string().optional().default(''),
}).optional();
