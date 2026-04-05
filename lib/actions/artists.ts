'use server';

import { db } from '@/lib/db-typed';
import { requireAuth } from '@/lib/auth-utils';
import { revalidateEntity } from '@/lib/actions/helpers';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { translatableSchema, extractTranslatable, extractTranslatableArray, type TranslatableField } from '@/lib/i18n-content';
import { httpsUrl } from '@/lib/schemas/common';
import { slugify } from '@/lib/slugify';
import { sanitizeTranslatable } from '@/lib/sanitize';
import { parseFormData } from '@/lib/actions/safe-action';

const artistSchema = z.object({
  name: z.string().min(1),
  nationality: translatableSchema,
  bio: translatableSchema,
  imageUrl: httpsUrl,
  sortOrder: z.coerce.number().int().default(0),
  visible: z.coerce.boolean().default(true),
});

const CV_TYPES = ['SOLO_SHOW', 'GROUP_SHOW', 'ART_FAIR', 'RESIDENCY', 'AWARD'] as const;

function extractCVEntries(formData: FormData): { title: TranslatableField; type: string; sortOrder: number; year?: number }[] {
  const allEntries: { title: TranslatableField; type: string; sortOrder: number; year?: number }[] = [];
  for (const cvType of CV_TYPES) {
    const entries = extractTranslatableArray(formData, `cv.${cvType}`);
    entries.forEach((title, i) => {
      const yearStr = formData.get(`cv.${cvType}.${i}.year`)?.toString();
      const year = yearStr ? parseInt(yearStr, 10) : undefined;
      allEntries.push({
        title,
        type: cvType,
        sortOrder: allEntries.length,
        year: year && !isNaN(year) ? year : undefined,
      });
    });
  }
  return allEntries;
}

export async function createArtist(formData: FormData): Promise<{ error: string } | void> {
  await requireAuth();

  const raw = {
    name: formData.get('name')?.toString() ?? '',
    nationality: extractTranslatable(formData, 'nationality'),
    bio: sanitizeTranslatable(extractTranslatable(formData, 'bio')),
    imageUrl: formData.get('imageUrl')?.toString() ?? '',
    sortOrder: formData.get('sortOrder')?.toString() ?? '0',
    visible: formData.get('visible')?.toString() ?? 'false',
  };
  const parsed = parseFormData(artistSchema, raw);
  if (!parsed.success) return { error: parsed.error };
  const data = parsed.data;
  const slug = slugify(data.name);

  const cvEntries = extractCVEntries(formData);
  const collections = extractTranslatableArray(formData, 'collections');

  await db.artist.create({
    data: {
      ...data,
      slug,
      exhibitions: {
        create: cvEntries.map((entry) => ({
          title: entry.title,
          type: entry.type as 'SOLO_SHOW' | 'GROUP_SHOW' | 'ART_FAIR' | 'RESIDENCY' | 'AWARD',
          sortOrder: entry.sortOrder,
          year: entry.year ?? null,
        })),
      },
      collections: {
        create: collections.map((title, i) => ({ title, sortOrder: i })),
      },
    },
  });

  revalidateEntity('/admin/artists', ['/artists', '']);
  redirect('/admin/artists');
}

export async function updateArtist(id: string, formData: FormData): Promise<{ error: string } | void> {
  await requireAuth();

  const raw = {
    name: formData.get('name')?.toString() ?? '',
    nationality: extractTranslatable(formData, 'nationality'),
    bio: sanitizeTranslatable(extractTranslatable(formData, 'bio')),
    imageUrl: formData.get('imageUrl')?.toString() ?? '',
    sortOrder: formData.get('sortOrder')?.toString() ?? '0',
    visible: formData.get('visible')?.toString() ?? 'false',
  };
  const parsed = parseFormData(artistSchema, raw);
  if (!parsed.success) return { error: parsed.error };
  const data = parsed.data;

  const cvEntries = extractCVEntries(formData);
  const collections = extractTranslatableArray(formData, 'collections');

  await db.$transaction([
    db.exhibition.deleteMany({ where: { artistId: id } }),
    db.collection.deleteMany({ where: { artistId: id } }),
    db.artist.update({
      where: { id },
      data: {
        ...data,
        exhibitions: {
          create: cvEntries.map((entry) => ({
            title: entry.title,
            type: entry.type as 'SOLO_SHOW' | 'GROUP_SHOW' | 'ART_FAIR' | 'RESIDENCY' | 'AWARD',
            sortOrder: entry.sortOrder,
            year: entry.year ?? null,
          })),
        },
        collections: {
          create: collections.map((title, i) => ({ title, sortOrder: i })),
        },
      },
    }),
  ]);

  revalidateEntity('/admin/artists', ['/artists', '']);
  redirect('/admin/artists');
}

export async function deleteArtist(id: string) {
  await requireAuth();
  await db.artist.delete({ where: { id } });
  revalidateEntity('/admin/artists', ['/artists', '']);
}

const ARTIST_TOGGLE_FIELDS = ['visible'] as const;

export async function toggleArtistField(id: string, field: 'visible') {
  await requireAuth();
  if (!(ARTIST_TOGGLE_FIELDS as readonly string[]).includes(field)) throw new Error('Invalid field');
  const current = await db.artist.findUniqueOrThrow({ where: { id }, select: { [field]: true } });
  await db.artist.update({ where: { id }, data: { [field]: !current[field] } });
  revalidateEntity('/admin/artists', ['/artists', '']);
}
