import { NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { r2, R2_BUCKET, R2_PUBLIC_URL } from '@/lib/r2';
import { requireAuth } from '@/lib/auth-utils';
import sharp from 'sharp';
import { randomUUID } from 'crypto';

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'Aucun fichier' }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'Format non supporté' }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'Fichier trop lourd (max 10 MB)' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const webpBuffer = await sharp(buffer)
    .resize({ width: 2000, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();

  const key = `images/${Date.now()}-${randomUUID()}.webp`;

  if (!process.env.R2_ACCOUNT_ID) {
    const base64 = webpBuffer.toString('base64');
    return NextResponse.json({ url: `data:image/webp;base64,${base64}` });
  }

  await r2.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      Body: webpBuffer,
      ContentType: 'image/webp',
      CacheControl: 'public, max-age=31536000, immutable',
    })
  );

  return NextResponse.json({ url: `${R2_PUBLIC_URL}/${key}` });
}
