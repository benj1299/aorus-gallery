'use server';

import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { translatableSchema, extractTranslatable, extractTranslatableArray, type TranslatableField } from '@/lib/i18n-content';

const artistSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  nationality: translatableSchema,
  bio: translatableSchema,
  imageUrl: z.string().url(),
  sortOrder: z.coerce.number().int().default(0),
  visible: z.coerce.boolean().default(true),
});

const CV_TYPES = ['SOLO_SHOW', 'GROUP_SHOW', 'ART_FAIR', 'RESIDENCY', 'AWARD'] as const;

async function requireAuth() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error('Unauthorized');
  return session;
}

function revalidateAll() {
  revalidatePath('/admin/artists');
  revalidatePath('/[locale]/artists', 'page');
  revalidatePath('/[locale]', 'page');
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
    slug: formData.get('slug')?.toString() ?? '',
    nationality: extractTranslatable(formData, 'nationality'),
    bio: extractTranslatable(formData, 'bio'),
    imageUrl: formData.get('imageUrl')?.toString() ?? '',
    sortOrder: formData.get('sortOrder')?.toString() ?? '0',
    visible: formData.get('visible')?.toString() ?? 'false',
  };
  const data = artistSchema.parse(raw);

  const cvEntries = extractCVEntries(formData);
  const collections = extractTranslatableArray(formData, 'collections');

  await prisma.artist.create({
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
  });

  revalidateAll();
  redirect('/admin/artists');
}

export async function updateArtist(id: string, formData: FormData) {
  await requireAuth();

  const raw = {
    name: formData.get('name')?.toString() ?? '',
    slug: formData.get('slug')?.toString() ?? '',
    nationality: extractTranslatable(formData, 'nationality'),
    bio: extractTranslatable(formData, 'bio'),
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
