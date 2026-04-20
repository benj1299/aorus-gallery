'use server';

import { db } from '@/lib/db-typed';
import { Prisma } from '@prisma/client';
import { requireAuth } from '@/lib/auth-utils';
import { revalidateEntity } from '@/lib/actions/helpers';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { translatableSchema, extractTranslatable, extractTranslatableArray, type TranslatableField } from '@/lib/i18n-content';
import { httpsUrl, booleanFromString, readDimension } from '@/lib/schemas/common';
import { slugify } from '@/lib/slugify';
import { sanitizeTranslatable } from '@/lib/sanitize';
import { parseFormData } from '@/lib/actions/safe-action';

const artistSchema = z.object({
  name: z.string().min(1).max(200),
  nationality: translatableSchema,
  bio: translatableSchema,
  imageUrl: httpsUrl,
  sortOrder: z.coerce.number().int().min(0).default(0),
  visible: booleanFromString.default(true),
});

const CV_TYPES = ['SOLO_SHOW', 'GROUP_SHOW', 'ART_FAIR', 'RESIDENCY', 'AWARD'] as const;

function extractCVEntries(formData: FormData): { title: TranslatableField; type: string; sortOrder: number; year?: number }[] {
  const allEntries: { title: TranslatableField; type: string; sortOrder: number; year?: number }[] = [];
  for (const cvType of CV_TYPES) {
    const entries = extractTranslatableArray(formData, `cv.${cvType}`);
    entries.forEach((title, i) => {
      // Skip entries with empty English title (required locale)
      if (!title.en.trim()) return;

      const yearStr = formData.get(`cv.${cvType}.${i}.year`)?.toString();
      const year = yearStr ? parseInt(yearStr, 10) : undefined;
      // Discard year outside reasonable range
      const validYear = year && !isNaN(year) && year >= 1900 && year <= 2100 ? year : undefined;

      allEntries.push({
        title,
        type: cvType,
        sortOrder: allEntries.length,
        year: validYear,
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
  const imageWidth = readDimension(formData, 'imageUrlWidth');
  const imageHeight = readDimension(formData, 'imageUrlHeight');
  const slug = slugify(data.name);

  const cvEntries = extractCVEntries(formData);
  const collections = extractTranslatableArray(formData, 'collections');

  let createdId = '';
  try {
    const created = await db.artist.create({
      data: {
        ...data,
        slug,
        imageWidth,
        imageHeight,
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
      select: { id: true },
    });
    createdId = created.id;
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
      return { error: 'Un élément avec ce nom existe déjà. Veuillez choisir un autre nom.' };
    }
    throw e;
  }

  revalidateEntity('/admin/artists', ['/artists', '']);
  redirect(`/admin/artists?created=${createdId}`);
}

export async function updateArtist(id: string, formData: FormData): Promise<{ error: string } | void> {
  await requireAuth();

  const existing = await db.artist.findUnique({ where: { id }, select: { id: true, name: true } });
  if (!existing) return { error: 'Élément introuvable' };

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
  const imageWidth = readDimension(formData, 'imageUrlWidth');
  const imageHeight = readDimension(formData, 'imageUrlHeight');

  const cvEntries = extractCVEntries(formData);
  const collections = extractTranslatableArray(formData, 'collections');

  // Recalculate slug when name changes
  const nameChanged = data.name !== existing.name;
  const newSlug = nameChanged ? slugify(data.name) : undefined;

  try {
    await db.$transaction([
      db.exhibition.deleteMany({ where: { artistId: id } }),
      db.collection.deleteMany({ where: { artistId: id } }),
      db.artist.update({
        where: { id },
        data: {
          ...data,
          ...(newSlug ? { slug: newSlug } : {}),
          imageWidth,
          imageHeight,
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
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
      return { error: 'Un artiste avec ce nom existe déjà. Veuillez choisir un autre nom.' };
    }
    throw e;
  }

  revalidateEntity('/admin/artists', ['/artists', '']);
  redirect('/admin/artists?saved=1');
}

export async function deleteArtist(id: string): Promise<{ error: string } | void> {
  await requireAuth();
  const existing = await db.artist.findUnique({ where: { id }, select: { id: true } });
  if (!existing) return { error: 'Élément introuvable' };
  await db.artist.delete({ where: { id } });
  revalidateEntity('/admin/artists', ['/artists', '']);
}

const ARTIST_TOGGLE_FIELDS = ['visible'] as const;

export async function toggleArtistField(id: string, field: 'visible'): Promise<{ error: string } | void> {
  await requireAuth();
  if (!(ARTIST_TOGGLE_FIELDS as readonly string[]).includes(field)) throw new Error('Invalid field');
  const current = await db.artist.findUnique({ where: { id }, select: { [field]: true } });
  if (!current) return { error: 'Élément introuvable' };
  await db.artist.update({ where: { id }, data: { [field]: !current[field] } });
  revalidateEntity('/admin/artists', ['/artists', '']);
}
