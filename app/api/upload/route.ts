import { NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { r2, R2_BUCKET, R2_PUBLIC_URL } from '@/lib/r2';
import { requireAuth } from '@/lib/auth-utils';
import { randomUUID } from 'crypto';

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const MIME_EXT: Record<string, string> = {
  'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif',
};

const EXT_MIME: Record<string, string> = Object.fromEntries(
  Object.entries(MIME_EXT).flatMap(([mime, ext]) =>
    ext === 'jpg' ? [['jpg', mime], ['jpeg', mime]] : [[ext, mime]]
  ),
);

function detectMimeFromBytes(buf: Buffer): string | null {
  if (buf.length < 12) return null;
  if (buf[0] === 0xFF && buf[1] === 0xD8 && buf[2] === 0xFF) return 'image/jpeg';
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47) return 'image/png';
  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46) return 'image/gif';
  if (buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46
      && buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50) return 'image/webp';
  return null;
}

async function optimizeImage(buffer: Buffer): Promise<{ data: Buffer; mime: string }> {
  try {
    const sharp = (await import('sharp')).default;
    const data = await sharp(buffer)
      .resize({ width: 2000, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();
    return { data, mime: 'image/webp' };
  } catch {
    // sharp unavailable or failed — upload original
    const mime = detectMimeFromBytes(buffer) ?? 'image/jpeg';
    return { data: buffer, mime };
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier' }, { status: 400 });
    }

    // Determine MIME type — fallback to extension if browser didn't set it
    let mimeType = file.type;
    if (!mimeType || !ALLOWED_TYPES.includes(mimeType)) {
      const ext = file.name.split('.').pop()?.toLowerCase();
      mimeType = EXT_MIME[ext ?? ''] ?? mimeType;
    }

    if (!ALLOWED_TYPES.includes(mimeType)) {
      return NextResponse.json({ error: 'Format non supporté (JPG, PNG, WebP, GIF)' }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'Fichier trop lourd (max 10 MB)' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Validate real MIME type via magic bytes
    const realMime = detectMimeFromBytes(buffer);
    if (!realMime || !ALLOWED_TYPES.includes(realMime)) {
      return NextResponse.json({ error: 'Format non supporté' }, { status: 400 });
    }

    // Optimize with sharp if available, otherwise upload as-is
    const { data: uploadBuffer, mime: uploadMime } = await optimizeImage(buffer);
    const ext = MIME_EXT[uploadMime] ?? 'webp';
    const key = `images/${Date.now()}-${randomUUID()}.${ext}`;

    if (!process.env.R2_ACCOUNT_ID) {
      const base64 = uploadBuffer.toString('base64');
      return NextResponse.json({ url: `data:${uploadMime};base64,${base64}` });
    }

    const publicUrl = (process.env.R2_PUBLIC_URL || '').replace(/\/+$/, '');

    try {
      await r2.send(
        new PutObjectCommand({
          Bucket: R2_BUCKET,
          Key: key,
          Body: uploadBuffer,
          ContentType: uploadMime,
          CacheControl: 'public, max-age=31536000, immutable',
        })
      );
    } catch (err) {
      console.error('[upload] R2 failed:', err);
      const base64 = uploadBuffer.toString('base64');
      return NextResponse.json({ url: `data:${uploadMime};base64,${base64}` });
    }

    return NextResponse.json({ url: `${publicUrl}/${key}` });
  } catch (err) {
    console.error('[upload] Error:', err);
    const message = err instanceof Error ? err.message : 'Erreur interne';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
