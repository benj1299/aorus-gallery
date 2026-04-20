/**
 * Backfill imageWidth/imageHeight for existing rows that were stored before
 * the upload pipeline started persisting dimensions.
 *
 * Usage:
 *   DRY-RUN (default):  pnpm tsx scripts/backfill-image-dimensions.ts
 *   APPLY:              pnpm tsx scripts/backfill-image-dimensions.ts --apply
 *
 * Idempotent: skips rows where imageWidth is already set. Safe to re-run.
 * Rate-limited to protect R2 and Unsplash origins.
 */

import 'dotenv/config';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, Prisma } from '@prisma/client';

type Dimensions = { width: number; height: number };

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const adapter = new PrismaPg(pool as any);
const prisma = new PrismaClient({ adapter });

const APPLY = process.argv.includes('--apply');
const RATE_LIMIT_MS = 200; // 5 req/s

async function fetchDimensions(url: string): Promise<Dimensions | null> {
  try {
    const response = await fetch(url, { method: 'GET' });
    if (!response.ok) {
      console.warn(`[skip] ${response.status} ${url.slice(0, 80)}`);
      return null;
    }
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const sharp = (await import('sharp')).default;
    const { width, height } = await sharp(buffer).metadata();
    if (!width || !height) return null;
    return { width, height };
  } catch (err) {
    console.warn(`[error] ${url.slice(0, 80)} — ${(err as Error).message}`);
    return null;
  }
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type Table = 'artwork' | 'artist' | 'homeBanner' | 'pressArticle' | 'galleryExhibition';

async function backfillTable(table: Table) {
  const model = prisma[table] as unknown as {
    findMany: (args: object) => Promise<Array<{ id: string; imageUrl: string | null }>>;
    update: (args: object) => Promise<unknown>;
  };

  const rows = await model.findMany({
    where: { imageWidth: null },
    select: { id: true, imageUrl: true },
  });

  console.log(`[${table}] ${rows.length} row(s) need backfill`);
  let updated = 0;
  let skipped = 0;

  for (const row of rows) {
    if (!row.imageUrl) {
      skipped++;
      continue;
    }
    await sleep(RATE_LIMIT_MS);
    const dims = await fetchDimensions(row.imageUrl);
    if (!dims) {
      skipped++;
      continue;
    }
    if (APPLY) {
      await model.update({
        where: { id: row.id },
        data: { imageWidth: dims.width, imageHeight: dims.height },
      });
    }
    updated++;
    console.log(`  [${APPLY ? 'UPDATED' : 'DRY-RUN'}] ${table}/${row.id.slice(0, 8)} → ${dims.width}×${dims.height}`);
  }

  console.log(`[${table}] ${updated} updated, ${skipped} skipped\n`);
  return { updated, skipped };
}

async function backfillArtworkImagesMeta() {
  const rows = await prisma.artwork.findMany({
    where: { images: { isEmpty: false }, imagesMeta: { equals: Prisma.DbNull } },
    select: { id: true, images: true },
  });

  console.log(`[artwork.imagesMeta] ${rows.length} row(s) need backfill for additional images`);
  let updated = 0;

  for (const row of rows) {
    await sleep(RATE_LIMIT_MS);
    const meta: Array<{ width: number | null; height: number | null }> = [];
    for (const url of row.images) {
      const dims = await fetchDimensions(url);
      meta.push(dims ? { width: dims.width, height: dims.height } : { width: null, height: null });
    }
    if (APPLY) {
      await prisma.artwork.update({
        where: { id: row.id },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: { imagesMeta: meta as any },
      });
    }
    updated++;
    console.log(`  [${APPLY ? 'UPDATED' : 'DRY-RUN'}] artwork/${row.id.slice(0, 8)} imagesMeta (${meta.length} items)`);
  }

  console.log(`[artwork.imagesMeta] ${updated} updated\n`);
  return { updated };
}

async function main() {
  console.log(`Backfill image dimensions — ${APPLY ? 'APPLY MODE' : 'DRY-RUN (add --apply to write)'}\n`);

  const tables: Table[] = ['artwork', 'artist', 'homeBanner', 'pressArticle', 'galleryExhibition'];
  let totalUpdated = 0;
  let totalSkipped = 0;
  for (const table of tables) {
    const { updated, skipped } = await backfillTable(table);
    totalUpdated += updated;
    totalSkipped += skipped;
  }

  const { updated: metaUpdated } = await backfillArtworkImagesMeta();
  totalUpdated += metaUpdated;

  console.log(`Total: ${totalUpdated} updated, ${totalSkipped} skipped`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
