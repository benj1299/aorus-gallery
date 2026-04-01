'use server';

import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth-utils';
import { revalidateEntity } from '@/lib/actions/helpers';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { translatableSchema, optionalTranslatableSchema, extractTranslatable } from '@/lib/i18n-content';
import { httpsUrl, serializeTranslatable } from '@/lib/schemas/common';
import { slugify } from '@/lib/slugify';

const artworkSchema = z.object({
  title: translatableSchema,
  artistId: z.string().min(1),
  medium: optionalTranslatableSchema,
  dimensions: z.string().optional().default(''),
  year: z.coerce.number().int().optional().nullable(),
  price: z.coerce.number().optional().nullable(),
  currency: z.string().default('EUR'),
  imageUrl: httpsUrl,
  visible: z.coerce.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
  featuredHome: z.coerce.boolean().default(false),
  showPrice: z.coerce.boolean().default(false),
  sold: z.coerce.boolean().default(false),
});

function revalidateAll() {
  revalidateEntity('/admin/artworks', ['/artists', '']);
}

export async function createArtwork(formData: FormData) {
  await requireAuth();

  const raw = {
    title: extractTranslatable(formData, 'title'),
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
    sold: formData.get('sold')?.toString() ?? 'false',
  };
  const data = artworkSchema.parse(raw);

  const artist = await prisma.artist.findUnique({ where: { id: data.artistId }, select: { slug: true } });
  const artistSlug = artist?.slug ?? 'unknown';
  const slug = slugify(artistSlug + '-' + data.title.en);

  await prisma.artwork.create({
    data: {
      ...data,
      slug,
      medium: serializeTranslatable(data.medium),
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
    sold: formData.get('sold')?.toString() ?? 'false',
  };
  const data = artworkSchema.parse(raw);

  await prisma.artwork.update({
    where: { id },
    data: {
      ...data,
      medium: serializeTranslatable(data.medium),
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
