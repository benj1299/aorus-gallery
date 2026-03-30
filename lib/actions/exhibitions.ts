'use server';

import { prisma } from '@/lib/db';
import { Prisma } from '@prisma/client';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { translatableSchema, optionalTranslatableSchema, extractTranslatable } from '@/lib/i18n-content';
import { slugify } from '@/lib/slugify';

const exhibitionSchema = z.object({
  title: translatableSchema,
  description: optionalTranslatableSchema,
  type: z.enum(['EXHIBITION', 'ART_FAIR', 'OFFSITE']),
  status: z.enum(['CURRENT', 'UPCOMING', 'PAST']),
  startDate: z.coerce.date().optional().nullable(),
  endDate: z.coerce.date().optional().nullable(),
  location: z.string().optional().default(''),
  imageUrl: z.string().url().refine((url) => url.startsWith('https://'), { message: 'URL must use HTTPS' }).optional().or(z.literal('')),
  visible: z.coerce.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
});

async function requireAuth() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error('Unauthorized');
  return session;
}

function revalidateAll() {
  revalidatePath('/admin/exhibitions');
  revalidatePath('/[locale]/exhibitions', 'page');
}

function parseArtistIds(formData: FormData): string[] {
  const ids: string[] = [];
  formData.forEach((value, key) => {
    if (key === 'artistIds' && typeof value === 'string' && value) {
      ids.push(value);
    }
  });
  return ids;
}

function parseArtworkIds(formData: FormData): string[] {
  const ids: string[] = [];
  formData.forEach((value, key) => {
    if (key === 'artworkIds' && typeof value === 'string' && value) {
      ids.push(value);
    }
  });
  return ids;
}

export async function createExhibition(formData: FormData) {
  await requireAuth();

  const startDateStr = formData.get('startDate')?.toString() ?? '';
  const endDateStr = formData.get('endDate')?.toString() ?? '';

  const raw = {
    title: extractTranslatable(formData, 'title'),
    description: extractTranslatable(formData, 'description'),
    type: formData.get('type')?.toString() ?? 'EXHIBITION',
    status: formData.get('status')?.toString() ?? 'UPCOMING',
    startDate: startDateStr || null,
    endDate: endDateStr || null,
    location: formData.get('location')?.toString() ?? '',
    imageUrl: formData.get('imageUrl')?.toString() ?? '',
    visible: formData.get('visible')?.toString() ?? 'false',
    sortOrder: formData.get('sortOrder')?.toString() ?? '0',
  };
  const data = exhibitionSchema.parse(raw);
  const slug = slugify(data.title.en);

  const descriptionVal = data.description && (data.description.en || data.description.fr || data.description.zh)
    ? data.description
    : Prisma.JsonNull;

  const artistIds = parseArtistIds(formData);
  const artworkIds = parseArtworkIds(formData);

  await prisma.galleryExhibition.create({
    data: {
      title: data.title,
      description: descriptionVal,
      slug,
      type: data.type,
      status: data.status,
      startDate: data.startDate ?? null,
      endDate: data.endDate ?? null,
      location: data.location || null,
      imageUrl: data.imageUrl || null,
      visible: data.visible,
      sortOrder: data.sortOrder,
      artists: { create: artistIds.map((id) => ({ artistId: id })) },
      artworks: { create: artworkIds.map((id) => ({ artworkId: id })) },
    },
  });

  revalidateAll();
  redirect('/admin/exhibitions');
}

export async function updateExhibition(id: string, formData: FormData) {
  await requireAuth();

  const startDateStr = formData.get('startDate')?.toString() ?? '';
  const endDateStr = formData.get('endDate')?.toString() ?? '';

  const raw = {
    title: extractTranslatable(formData, 'title'),
    description: extractTranslatable(formData, 'description'),
    type: formData.get('type')?.toString() ?? 'EXHIBITION',
    status: formData.get('status')?.toString() ?? 'UPCOMING',
    startDate: startDateStr || null,
    endDate: endDateStr || null,
    location: formData.get('location')?.toString() ?? '',
    imageUrl: formData.get('imageUrl')?.toString() ?? '',
    visible: formData.get('visible')?.toString() ?? 'false',
    sortOrder: formData.get('sortOrder')?.toString() ?? '0',
  };
  const data = exhibitionSchema.parse(raw);

  const descriptionVal = data.description && (data.description.en || data.description.fr || data.description.zh)
    ? data.description
    : Prisma.JsonNull;

  const artistIds = parseArtistIds(formData);
  const artworkIds = parseArtworkIds(formData);

  await prisma.$transaction([
    prisma.galleryExhibitionArtist.deleteMany({ where: { exhibitionId: id } }),
    prisma.galleryExhibitionArtwork.deleteMany({ where: { exhibitionId: id } }),
    prisma.galleryExhibition.update({
      where: { id },
      data: {
        title: data.title,
        description: descriptionVal,
        type: data.type,
        status: data.status,
        startDate: data.startDate ?? null,
        endDate: data.endDate ?? null,
        location: data.location || null,
        imageUrl: data.imageUrl || null,
        visible: data.visible,
        sortOrder: data.sortOrder,
        artists: { create: artistIds.map((aid) => ({ artistId: aid })) },
        artworks: { create: artworkIds.map((awid) => ({ artworkId: awid })) },
      },
    }),
  ]);

  revalidateAll();
  redirect('/admin/exhibitions');
}

export async function deleteExhibition(id: string) {
  await requireAuth();
  await prisma.galleryExhibition.delete({ where: { id } });
  revalidateAll();
}
