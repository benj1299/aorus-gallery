/**
 * Backfill widthCm/heightCm for artworks by parsing the legacy `dimensions`
 * string (e.g. "120 x 90 cm") into numeric integers.
 *
 * Convention: art-world standard is Height × Width × (Depth).
 * We map: first number → heightCm, second number → widthCm.
 *
 * Usage:
 *   DRY-RUN (default):  pnpm tsx scripts/backfill-artwork-dimensions-cm.ts
 *   APPLY:              pnpm tsx scripts/backfill-artwork-dimensions-cm.ts --apply
 *
 * Idempotent: skips rows where widthCm is already set. Safe to re-run.
 */

import 'dotenv/config';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const adapter = new PrismaPg(pool as any);
const prisma = new PrismaClient({ adapter });

const APPLY = process.argv.includes('--apply');

const DIMENSIONS_RE = /(\d+(?:[.,]\d+)?)\s*[x×X]\s*(\d+(?:[.,]\d+)?)/;

function parseDimensions(raw: string): { heightCm: number; widthCm: number } | null {
  const match = raw.match(DIMENSIONS_RE);
  if (!match) return null;
  const heightCm = Math.round(parseFloat(match[1].replace(',', '.')));
  const widthCm = Math.round(parseFloat(match[2].replace(',', '.')));
  if (!Number.isFinite(heightCm) || !Number.isFinite(widthCm) || heightCm <= 0 || widthCm <= 0) {
    return null;
  }
  return { heightCm, widthCm };
}

async function main() {
  console.log(`Backfill artwork dimensions (cm) — ${APPLY ? 'APPLY MODE' : 'DRY-RUN (add --apply to write)'}\n`);

  const rows = await prisma.artwork.findMany({
    where: { widthCm: null, dimensions: { not: null } },
    select: { id: true, slug: true, dimensions: true },
  });

  console.log(`[artwork] ${rows.length} row(s) need backfill\n`);

  let updated = 0;
  let skipped = 0;
  const unparsable: Array<{ slug: string; dimensions: string }> = [];

  for (const row of rows) {
    const raw = row.dimensions ?? '';
    const parsed = parseDimensions(raw);
    if (!parsed) {
      skipped++;
      unparsable.push({ slug: row.slug, dimensions: raw });
      continue;
    }
    if (APPLY) {
      await prisma.artwork.update({
        where: { id: row.id },
        data: { heightCm: parsed.heightCm, widthCm: parsed.widthCm },
      });
    }
    updated++;
    console.log(
      `  [${APPLY ? 'UPDATED' : 'DRY-RUN'}] ${row.slug} "${raw}" → H${parsed.heightCm} × W${parsed.widthCm}`,
    );
  }

  console.log(`\n[artwork] ${updated} updated, ${skipped} skipped`);
  if (unparsable.length > 0) {
    console.log(`\nUnparsable dimensions (need manual review):`);
    for (const item of unparsable) {
      console.log(`  - ${item.slug}: "${item.dimensions}"`);
    }
  }
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
