'use server';

import { db } from '@/lib/db-typed';
import { Prisma } from '@prisma/client';
import { requireAuth } from '@/lib/auth-utils';
import { revalidateEntity } from '@/lib/actions/helpers';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { translatableSchema, optionalTranslatableSchema, extractTranslatable, type TranslatableField } from '@/lib/i18n-content';
import { httpsUrl, serializeTranslatable, booleanFromString, readDimension, readImagesMeta } from '@/lib/schemas/common';
import { slugify } from '@/lib/slugify';
import { parseFormData } from '@/lib/actions/safe-action';

const artworkSchema = z.object({
  title: translatableSchema,
  artistId: z.string().min(1),
  medium: optionalTranslatableSchema,
  dimensions: z.string().max(200).optional().default(''),
  year: z.coerce.number().int().min(0).optional().nullable(),
  price: z.coerce.number().min(0).optional().nullable(),
  currency: z.string().default('EUR'),
  imageUrl: httpsUrl,
  images: z.array(z.string().url()).optional().default([]),
  visible: booleanFromString.default(true),
  sortOrder: z.coerce.number().int().min(0).default(0),
  featuredHome: booleanFromString.default(false),
  showPrice: booleanFromString.default(false),
  sold: booleanFromString.default(false),
});

export async function createArtwork(formData: FormData): Promise<{ error: string } | void> {
  await requireAuth();

  const images = formData.getAll('images').map((v) => v.toString()).filter(Boolean);

  const raw = {
    title: extractTranslatable(formData, 'title'),
    artistId: formData.get('artistId')?.toString() ?? '',
    medium: extractTranslatable(formData, 'medium'),
    dimensions: formData.get('dimensions')?.toString() ?? '',
    year: formData.get('year')?.toString() ?? '',
    price: formData.get('price')?.toString() ?? '',
    currency: formData.get('currency')?.toString() ?? 'EUR',
    imageUrl: formData.get('imageUrl')?.toString() ?? '',
    images,
    visible: formData.get('visible')?.toString() ?? 'false',
    sortOrder: formData.get('sortOrder')?.toString() ?? '0',
    featuredHome: formData.get('featuredHome')?.toString() ?? 'false',
    showPrice: formData.get('showPrice')?.toString() ?? 'false',
    sold: formData.get('sold')?.toString() ?? 'false',
  };
  const parsed = parseFormData(artworkSchema, raw);
  if (!parsed.success) return { error: parsed.error };
  const data = parsed.data;
  const imageWidth = readDimension(formData, 'imageUrlWidth');
  const imageHeight = readDimension(formData, 'imageUrlHeight');
  const imagesMeta = readImagesMeta(formData, 'imagesMeta');

  const artist = await db.artist.findUnique({ where: { id: data.artistId }, select: { slug: true } });
  const artistSlug = artist?.slug ?? 'unknown';
  const slug = slugify(artistSlug + '-' + data.title.en);

  let createdId = '';
  try {
    const created = await db.artwork.create({
      data: {
        ...data,
        slug,
        medium: serializeTranslatable(data.medium),
        dimensions: data.dimensions || null,
        price: data.price ?? null,
        year: data.year ?? null,
        imageWidth,
        imageHeight,
        imagesMeta: imagesMeta ?? undefined,
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

  revalidateEntity('/admin/artworks', ['/artists', '']);
  redirect(`/admin/artworks?created=${createdId}`);
}

export async function updateArtwork(id: string, formData: FormData): Promise<{ error: string } | void> {
  await requireAuth();

  const existing = await db.artwork.findUnique({
    where: { id },
    select: { id: true, title: true, artistId: true },
  });
  if (!existing) return { error: 'Élément introuvable' };

  const images = formData.getAll('images').map((v) => v.toString()).filter(Boolean);

  const raw = {
    title: extractTranslatable(formData, 'title'),
    artistId: formData.get('artistId')?.toString() ?? '',
    medium: extractTranslatable(formData, 'medium'),
    dimensions: formData.get('dimensions')?.toString() ?? '',
    year: formData.get('year')?.toString() ?? '',
    price: formData.get('price')?.toString() ?? '',
    currency: formData.get('currency')?.toString() ?? 'EUR',
    imageUrl: formData.get('imageUrl')?.toString() ?? '',
    images,
    visible: formData.get('visible')?.toString() ?? 'false',
    sortOrder: formData.get('sortOrder')?.toString() ?? '0',
    featuredHome: formData.get('featuredHome')?.toString() ?? 'false',
    showPrice: formData.get('showPrice')?.toString() ?? 'false',
    sold: formData.get('sold')?.toString() ?? 'false',
  };
  const parsed = parseFormData(artworkSchema, raw);
  if (!parsed.success) return { error: parsed.error };
  const data = parsed.data;
  const imageWidth = readDimension(formData, 'imageUrlWidth');
  const imageHeight = readDimension(formData, 'imageUrlHeight');
  const imagesMeta = readImagesMeta(formData, 'imagesMeta');

  // Recalculate slug when title or artist changes
  const existingTitle = existing.title as TranslatableField | null;
  const titleChanged = data.title.en !== (existingTitle?.en ?? '');
  const artistChanged = data.artistId !== existing.artistId;
  let newSlug: string | undefined;

  if (titleChanged || artistChanged) {
    const artist = await db.artist.findUnique({ where: { id: data.artistId }, select: { slug: true } });
    const artistSlug = artist?.slug ?? 'unknown';
    newSlug = slugify(artistSlug + '-' + data.title.en);
  }

  try {
    await db.artwork.update({
      where: { id },
      data: {
        ...data,
        ...(newSlug ? { slug: newSlug } : {}),
        medium: serializeTranslatable(data.medium),
        dimensions: data.dimensions || null,
        price: data.price ?? null,
        year: data.year ?? null,
        imageWidth,
        imageHeight,
        imagesMeta: imagesMeta ?? undefined,
      },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
      return { error: 'Une oeuvre avec ce titre existe déjà. Veuillez choisir un autre titre.' };
    }
    throw e;
  }

  revalidateEntity('/admin/artworks', ['/artists', '']);
  redirect('/admin/artworks?saved=1');
}

export async function deleteArtwork(id: string): Promise<{ error: string } | void> {
  await requireAuth();
  const existing = await db.artwork.findUnique({ where: { id }, select: { id: true } });
  if (!existing) return { error: 'Élément introuvable' };
  await db.artwork.delete({ where: { id } });
  revalidateEntity('/admin/artworks', ['/artists', '']);
}

const ARTWORK_TOGGLE_FIELDS = ['visible', 'featuredHome', 'showPrice', 'sold'] as const;

export async function toggleArtworkField(id: string, field: 'visible' | 'featuredHome' | 'showPrice' | 'sold'): Promise<{ error: string } | void> {
  await requireAuth();
  if (!(ARTWORK_TOGGLE_FIELDS as readonly string[]).includes(field)) throw new Error('Invalid field');
  const current = await db.artwork.findUnique({ where: { id }, select: { [field]: true } });
  if (!current) return { error: 'Élément introuvable' };
  await db.artwork.update({ where: { id }, data: { [field]: !current[field] } });
  revalidateEntity('/admin/artworks', ['/artists', '']);
}
