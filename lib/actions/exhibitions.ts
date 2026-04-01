'use server';

import { db } from '@/lib/db-typed';
import { requireAuth } from '@/lib/auth-utils';
import { revalidateEntity } from '@/lib/actions/helpers';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { translatableSchema, optionalTranslatableSchema, extractTranslatable } from '@/lib/i18n-content';
import { optionalHttpsUrl, serializeTranslatable } from '@/lib/schemas/common';
import { slugify } from '@/lib/slugify';
import { sanitizeTranslatable } from '@/lib/sanitize';

const exhibitionSchema = z.object({
  title: translatableSchema,
  description: optionalTranslatableSchema,
  type: z.enum(['EXHIBITION', 'ART_FAIR', 'OFFSITE']),
  status: z.enum(['CURRENT', 'UPCOMING', 'PAST']),
  startDate: z.coerce.date().optional().nullable(),
  endDate: z.coerce.date().optional().nullable(),
  location: z.string().optional().default(''),
  imageUrl: optionalHttpsUrl,
  visible: z.coerce.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
});

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
    description: sanitizeTranslatable(extractTranslatable(formData, 'description')),
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

  const artistIds = parseArtistIds(formData);
  const artworkIds = parseArtworkIds(formData);

  await db.galleryExhibition.create({
    data: {
      title: data.title,
      description: serializeTranslatable(data.description),
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

  revalidateEntity('/admin/exhibitions', ['/exhibitions']);
  redirect('/admin/exhibitions');
}

export async function updateExhibition(id: string, formData: FormData) {
  await requireAuth();

  const startDateStr = formData.get('startDate')?.toString() ?? '';
  const endDateStr = formData.get('endDate')?.toString() ?? '';

  const raw = {
    title: extractTranslatable(formData, 'title'),
    description: sanitizeTranslatable(extractTranslatable(formData, 'description')),
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

  const artistIds = parseArtistIds(formData);
  const artworkIds = parseArtworkIds(formData);

  await db.$transaction([
    db.galleryExhibitionArtist.deleteMany({ where: { exhibitionId: id } }),
    db.galleryExhibitionArtwork.deleteMany({ where: { exhibitionId: id } }),
    db.galleryExhibition.update({
      where: { id },
      data: {
        title: data.title,
        description: serializeTranslatable(data.description),
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

  revalidateEntity('/admin/exhibitions', ['/exhibitions']);
  redirect('/admin/exhibitions');
}

export async function deleteExhibition(id: string) {
  await requireAuth();
  await db.galleryExhibition.delete({ where: { id } });
  revalidateEntity('/admin/exhibitions', ['/exhibitions']);
}
