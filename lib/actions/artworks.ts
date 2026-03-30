'use server';

import { prisma } from '@/lib/db';
import { Prisma } from '@prisma/client';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { translatableSchema, optionalTranslatableSchema, extractTranslatable } from '@/lib/i18n-content';

const artworkSchema = z.object({
  title: translatableSchema,
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  artistId: z.string().min(1),
  medium: optionalTranslatableSchema,
  dimensions: z.string().optional().default(''),
  year: z.coerce.number().int().optional().nullable(),
  price: z.coerce.number().optional().nullable(),
  currency: z.string().default('EUR'),
  imageUrl: z.string().url(),
  visible: z.coerce.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
  featuredHome: z.coerce.boolean().default(false),
  showPrice: z.coerce.boolean().default(false),
});

async function requireAuth() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error('Unauthorized');
  return session;
}

function revalidateAll() {
  revalidatePath('/admin/artworks');
  revalidatePath('/[locale]/artists', 'page');
}

export async function createArtwork(formData: FormData) {
  await requireAuth();

  const raw = {
    title: extractTranslatable(formData, 'title'),
    slug: formData.get('slug')?.toString() ?? '',
    artistId: formData.get('artistId')?.toString() ?? '',
    medium: extractTranslatable(formData, 'medium'),
    dimensions: formData.get('dimensions')?.toString() ?? '',
    year: formData.get('year')?.toString() ?? '',
    price: formData.get('price')?.toString() ?? '',
    currency: formData.get('currency')?.toString() ?? 'EUR',
    imageUrl: formData.get('imageUrl')?.toString() ?? '',
    visible: formData.get('visible')?.toString() ?? 'false',
    sortOrder: formData.get('sortOrder')?.toString() ?? '0',
    featuredHome: formData.get('featuredHome')?.toString() ?? 'false',
    showPrice: formData.get('showPrice')?.toString() ?? 'false',
  };
  const data = artworkSchema.parse(raw);

  const mediumVal = data.medium && (data.medium.en || data.medium.fr || data.medium.zh) ? data.medium : Prisma.JsonNull;

  await prisma.artwork.create({
    data: {
      ...data,
      medium: mediumVal,
      dimensions: data.dimensions || null,
      price: data.price ?? null,
      year: data.year ?? null,
    },
  });

  revalidateAll();
  redirect('/admin/artworks');
}

export async function updateArtwork(id: string, formData: FormData) {
  await requireAuth();

  const raw = {
    title: extractTranslatable(formData, 'title'),
    slug: formData.get('slug')?.toString() ?? '',
    artistId: formData.get('artistId')?.toString() ?? '',
    medium: extractTranslatable(formData, 'medium'),
    dimensions: formData.get('dimensions')?.toString() ?? '',
    year: formData.get('year')?.toString() ?? '',
    price: formData.get('price')?.toString() ?? '',
    currency: formData.get('currency')?.toString() ?? 'EUR',
    imageUrl: formData.get('imageUrl')?.toString() ?? '',
    visible: formData.get('visible')?.toString() ?? 'false',
    sortOrder: formData.get('sortOrder')?.toString() ?? '0',
    featuredHome: formData.get('featuredHome')?.toString() ?? 'false',
    showPrice: formData.get('showPrice')?.toString() ?? 'false',
  };
  const data = artworkSchema.parse(raw);

  const mediumVal = data.medium && (data.medium.en || data.medium.fr || data.medium.zh) ? data.medium : Prisma.JsonNull;

  await prisma.artwork.update({
    where: { id },
    data: {
      ...data,
      medium: mediumVal,
      dimensions: data.dimensions || null,
      price: data.price ?? null,
      year: data.year ?? null,
    },
  });

  revalidateAll();
  redirect('/admin/artworks');
}

export async function deleteArtwork(id: string) {
  await requireAuth();
  await prisma.artwork.delete({ where: { id } });
  revalidateAll();
}
