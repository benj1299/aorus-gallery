'use server';

import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth-utils';
import { revalidateEntity } from '@/lib/actions/helpers';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { translatableSchema, extractTranslatable, extractTranslatableArray, type TranslatableField } from '@/lib/i18n-content';
import { httpsUrl } from '@/lib/schemas/common';
import { slugify } from '@/lib/slugify';
import { sanitizeTranslatable } from '@/lib/sanitize';

const artistSchema = z.object({
  name: z.string().min(1),
  nationality: translatableSchema,
  bio: translatableSchema,
  imageUrl: httpsUrl,
  sortOrder: z.coerce.number().int().default(0),
  visible: z.coerce.boolean().default(true),
});

const CV_TYPES = ['SOLO_SHOW', 'GROUP_SHOW', 'ART_FAIR', 'RESIDENCY', 'AWARD'] as const;

function revalidateAll() {
  revalidateEntity('/admin/artists', ['/artists', '']);
}

function extractCVEntries(formData: FormData): { title: TranslatableField; type: string; sortOrder: number }[] {
  const allEntries: { title: TranslatableField; type: string; sortOrder: number }[] = [];
  for (const cvType of CV_TYPES) {
    const entries = extractTranslatableArray(formData, `cv.${cvType}`);
    entries.forEach((title) => {
      allEntries.push({ title, type: cvType, sortOrder: allEntries.length });
    });
  }
  return allEntries;
}

export async function createArtist(formData: FormData) {
  await requireAuth();

  const raw = {
    name: formData.get('name')?.toString() ?? '',
    nationality: extractTranslatable(formData, 'nationality'),
    bio: sanitizeTranslatable(extractTranslatable(formData, 'bio')),
    imageUrl: formData.get('imageUrl')?.toString() ?? '',
    sortOrder: formData.get('sortOrder')?.toString() ?? '0',
    visible: formData.get('visible')?.toString() ?? 'false',
  };
  const data = artistSchema.parse(raw);
  const slug = slugify(data.name);

  const cvEntries = extractCVEntries(formData);
  const collections = extractTranslatableArray(formData, 'collections');

  await prisma.artist.create({
    data: {
      ...data,
      slug,
      exhibitions: {
        create: cvEntries.map((entry) => ({
          title: entry.title,
          type: entry.type as 'SOLO_SHOW' | 'GROUP_SHOW' | 'ART_FAIR' | 'RESIDENCY' | 'AWARD',
          sortOrder: entry.sortOrder,
        })),
      },
      collections: {
        create: collections.map((title, i) => ({ title, sortOrder: i })),
      },
    },
  });

  revalidateAll();
  redirect('/admin/artists');
}

export async function updateArtist(id: string, formData: FormData) {
  await requireAuth();

  const raw = {
    name: formData.get('name')?.toString() ?? '',
    nationality: extractTranslatable(formData, 'nationality'),
    bio: sanitizeTranslatable(extractTranslatable(formData, 'bio')),
    imageUrl: formData.get('imageUrl')?.toString() ?? '',
    sortOrder: formData.get('sortOrder')?.toString() ?? '0',
    visible: formData.get('visible')?.toString() ?? 'false',
  };
  const data = artistSchema.parse(raw);

  const cvEntries = extractCVEntries(formData);
  const collections = extractTranslatableArray(formData, 'collections');

  await prisma.$transaction([
    prisma.exhibition.deleteMany({ where: { artistId: id } }),
    prisma.collection.deleteMany({ where: { artistId: id } }),
    prisma.artist.update({
      where: { id },
      data: {
        ...data,
        exhibitions: {
          create: cvEntries.map((entry) => ({
            title: entry.title,
            type: entry.type as 'SOLO_SHOW' | 'GROUP_SHOW' | 'ART_FAIR' | 'RESIDENCY' | 'AWARD',
            sortOrder: entry.sortOrder,
          })),
        },
        collections: {
          create: collections.map((title, i) => ({ title, sortOrder: i })),
        },
      },
    }),
  ]);

  revalidateAll();
  redirect('/admin/artists');
}

export async function deleteArtist(id: string) {
  await requireAuth();
  await prisma.artist.delete({ where: { id } });
  revalidateAll();
}
