import { NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { r2, R2_BUCKET, R2_PUBLIC_URL } from '@/lib/r2';
import { requireAuth } from '@/lib/auth-utils';
import sharp from 'sharp';
import { randomUUID } from 'crypto';

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

function detectMimeFromBytes(buf: Buffer): string | null {
  if (buf.length < 12) return null;
  if (buf[0] === 0xFF && buf[1] === 0xD8 && buf[2] === 0xFF) return 'image/jpeg';
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47) return 'image/png';
  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46) return 'image/gif';
  if (buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46
      && buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50) return 'image/webp';
  return null;
}

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

  // Determine MIME type — fallback to extension if browser didn't set it
  let mimeType = file.type;
  if (!mimeType || !ALLOWED_TYPES.includes(mimeType)) {
    const ext = file.name.split('.').pop()?.toLowerCase();
    const extMap: Record<string, string> = {
      jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png',
      webp: 'image/webp', gif: 'image/gif',
    };
    mimeType = extMap[ext ?? ''] ?? mimeType;
  }

  if (!ALLOWED_TYPES.includes(mimeType)) {
    return NextResponse.json({ error: 'Format non supporté (JPG, PNG, WebP, GIF)' }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'Fichier trop lourd (max 10 MB)' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  // Validate real MIME type via magic bytes (zero-dependency, works in serverless)
  const realMime = detectMimeFromBytes(buffer);
  if (!realMime || !ALLOWED_TYPES.includes(realMime)) {
    return NextResponse.json({ error: 'Format non supporté' }, { status: 400 });
  }

  let webpBuffer: Buffer;
  try {
    webpBuffer = await sharp(buffer)
      .resize({ width: 2000, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();
  } catch {
    return NextResponse.json({ error: 'Image corrompue ou non lisible' }, { status: 422 });
  }

  const key = `images/${Date.now()}-${randomUUID()}.webp`;

  if (!process.env.R2_ACCOUNT_ID) {
    const base64 = webpBuffer.toString('base64');
    return NextResponse.json({ url: `data:image/webp;base64,${base64}` });
  }

  const publicUrl = (process.env.R2_PUBLIC_URL || '').replace(/\/+$/, '');

  await r2.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      Body: webpBuffer,
      ContentType: 'image/webp',
      CacheControl: 'public, max-age=31536000, immutable',
    })
  );

  return NextResponse.json({ url: `${publicUrl}/${key}` });
}
