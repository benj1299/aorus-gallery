/**
 * i18n APPLY — Phase 3 du workflow de backfill multilingue.
 *
 * Lit `.i18n/dump-after.json` (produit par la phase 2 = /loop translation),
 * détecte les diffs vs `.i18n/dump-before.json`, et applique les UPDATE
 * Prisma uniquement sur les fields modifiés.
 *
 * Safety :
 *   - Dry-run par défaut (`--apply` requis pour modifier la DB)
 *   - JAMAIS d'overwrite : si une locale est déjà filled en DB (re-fetch
 *     juste avant l'UPDATE), on la laisse intacte (race-safe)
 *   - Whitelist stricte des fields/policies (skip bio bloqué côté code, pas
 *     uniquement par convention)
 *   - Audit trail : `.i18n/applied-<timestamp>.json` log de chaque UPDATE
 *
 * Usage :
 *   pnpm tsx scripts/i18n-apply.ts            # dry-run, affiche le plan
 *   pnpm tsx scripts/i18n-apply.ts --apply    # exécute les UPDATE
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname } from 'node:path';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

interface TranslatableField {
  en: string;
  fr: string;
  zh: string;
}

interface DumpEntity {
  ref: string;
  model: 'artist' | 'exhibition' | 'collection' | 'artwork' | 'pressArticle' | 'homeBanner' | 'galleryExhibition';
  id: string;
  label: string;
  fields: Record<string, TranslatableField | null>;
  policy: Record<string, 'translate' | 'copy' | 'skip'>;
}

interface Dump {
  metadata: { generatedAt: string; databaseUrl: string; entityCount: number };
  entities: DumpEntity[];
}

interface UpdateDiff {
  ref: string;
  model: DumpEntity['model'];
  id: string;
  label: string;
  field: string;
  before: TranslatableField | null;
  after: TranslatableField;
  newLocales: ('en' | 'fr' | 'zh')[];
}

const PROTECTED_FIELDS: Record<string, string[]> = {
  artist: ['bio'], // policy=skip côté dump, double-safety ici
};

const VALID_MODELS = ['artist', 'exhibition', 'collection', 'artwork', 'pressArticle', 'homeBanner', 'galleryExhibition'] as const;

function loadDump(path: string): Dump {
  if (!existsSync(path)) {
    console.error(`ERROR: ${path} not found`);
    process.exit(1);
  }
  return JSON.parse(readFileSync(path, 'utf-8')) as Dump;
}

function isProtected(model: string, field: string): boolean {
  return (PROTECTED_FIELDS[model] ?? []).includes(field);
}

/** Detect locales filled in `after` but empty in `before`. Returns list of locale keys. */
function diffLocales(
  before: TranslatableField | null,
  after: TranslatableField,
): ('en' | 'fr' | 'zh')[] {
  const newOnes: ('en' | 'fr' | 'zh')[] = [];
  const beforeF = before ?? { en: '', fr: '', zh: '' };
  for (const loc of ['en', 'fr', 'zh'] as const) {
    if (!beforeF[loc].trim() && after[loc].trim()) {
      newOnes.push(loc);
    }
  }
  return newOnes;
}

function computeDiffs(before: Dump, after: Dump): UpdateDiff[] {
  const beforeByRef = new Map(before.entities.map((e) => [e.ref, e]));
  const diffs: UpdateDiff[] = [];

  for (const a of after.entities) {
    const b = beforeByRef.get(a.ref);
    if (!b) continue;

    for (const [field, afterField] of Object.entries(a.fields)) {
      if (!afterField) continue;
      // Hard-protect critical fields (e.g. bio) regardless of policy declared in dump
      if (isProtected(a.model, field)) continue;
      // Skip policy = no diff allowed even from policy stance
      if (a.policy[field] === 'skip') continue;

      const beforeField = b.fields[field] ?? null;
      const newLocales = diffLocales(beforeField, afterField);
      if (newLocales.length === 0) continue;

      diffs.push({
        ref: a.ref,
        model: a.model,
        id: a.id,
        label: a.label,
        field,
        before: beforeField,
        after: afterField,
        newLocales,
      });
    }
  }
  return diffs;
}

/** Merge new locales into existing DB value to avoid overwriting filled locales. */
function mergeTranslatable(
  current: TranslatableField | null,
  target: TranslatableField,
  newLocales: ('en' | 'fr' | 'zh')[],
): TranslatableField {
  const c = current ?? { en: '', fr: '', zh: '' };
  const merged: TranslatableField = { ...c };
  for (const loc of newLocales) {
    if (!c[loc].trim() && target[loc].trim()) {
      merged[loc] = target[loc];
    }
  }
  return merged;
}

async function applyDiffs(
  prisma: PrismaClient,
  diffs: UpdateDiff[],
  applyMode: boolean,
): Promise<{ applied: number; skipped: number; errors: number }> {
  let applied = 0;
  let skipped = 0;
  let errors = 0;
  const auditLog: Array<{
    ref: string;
    field: string;
    before: TranslatableField | null;
    merged: TranslatableField;
    appliedAt: string;
    status: 'applied' | 'skipped-already-filled' | 'skipped-not-found' | 'error';
    error?: string;
  }> = [];

  for (const d of diffs) {
    try {
      // Re-fetch current DB value (race-safe)
      const fresh = await (prisma as unknown as Record<string, { findUnique: (args: { where: { id: string }; select: Record<string, true> }) => Promise<Record<string, unknown> | null> }>)[d.model].findUnique({
        where: { id: d.id },
        select: { [d.field]: true },
      });
      if (!fresh) {
        skipped++;
        auditLog.push({ ref: d.ref, field: d.field, before: d.before, merged: d.after, appliedAt: new Date().toISOString(), status: 'skipped-not-found' });
        continue;
      }
      const currentValue = fresh[d.field] as TranslatableField | null;
      const merged = mergeTranslatable(currentValue, d.after, d.newLocales);

      // Determine which locales the merge actually wrote (some may have been
      // filled by another process between dump-before and now)
      const trulyNew = d.newLocales.filter((loc) => {
        const cur = (currentValue ?? { en: '', fr: '', zh: '' })[loc];
        return !cur.trim() && merged[loc].trim();
      });
      if (trulyNew.length === 0) {
        skipped++;
        auditLog.push({ ref: d.ref, field: d.field, before: currentValue, merged, appliedAt: new Date().toISOString(), status: 'skipped-already-filled' });
        continue;
      }

      if (applyMode) {
        await (prisma as unknown as Record<string, { update: (args: { where: { id: string }; data: Record<string, unknown> }) => Promise<unknown> }>)[d.model].update({
          where: { id: d.id },
          data: { [d.field]: merged },
        });
      }
      applied++;
      auditLog.push({ ref: d.ref, field: d.field, before: currentValue, merged, appliedAt: new Date().toISOString(), status: 'applied' });
    } catch (e) {
      errors++;
      const msg = e instanceof Error ? e.message : String(e);
      console.error(`ERROR on ${d.ref}.${d.field}: ${msg}`);
      auditLog.push({ ref: d.ref, field: d.field, before: d.before, merged: d.after, appliedAt: new Date().toISOString(), status: 'error', error: msg });
    }
  }

  // Persist audit trail
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const auditPath = `.i18n/${applyMode ? 'applied' : 'dryrun'}-${stamp}.json`;
  mkdirSync(dirname(auditPath), { recursive: true });
  writeFileSync(auditPath, JSON.stringify({ mode: applyMode ? 'apply' : 'dryrun', summary: { applied, skipped, errors }, log: auditLog }, null, 2));
  console.log(`Audit trail: ${auditPath}`);
  return { applied, skipped, errors };
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const applyMode = args.includes('--apply');
  const beforePath = '.i18n/dump-before.json';
  const afterPath = '.i18n/dump-after.json';

  const before = loadDump(beforePath);
  const after = loadDump(afterPath);

  if (before.entities.length !== after.entities.length) {
    console.warn(`WARN: entity count mismatch (before=${before.entities.length}, after=${after.entities.length})`);
  }

  const diffs = computeDiffs(before, after);
  console.log(`Found ${diffs.length} field-level diffs.`);
  console.log('Sample (first 5):');
  for (const d of diffs.slice(0, 5)) {
    console.log(`  ${d.ref}.${d.field} [+${d.newLocales.join(',')}] "${d.label}"`);
  }
  if (diffs.length === 0) {
    console.log('Nothing to apply.');
    return;
  }

  // Validate all diffs against model whitelist
  for (const d of diffs) {
    if (!(VALID_MODELS as readonly string[]).includes(d.model)) {
      console.error(`ERROR: invalid model ${d.model} in diff ${d.ref}`);
      process.exit(1);
    }
  }

  if (!applyMode) {
    console.log('\n[DRY-RUN] No DB writes. Pass --apply to execute.');
    console.log('\nNew locales by field:');
    const byField: Record<string, { fr: number; en: number; zh: number }> = {};
    for (const d of diffs) {
      const k = `${d.model}.${d.field}`;
      byField[k] = byField[k] ?? { fr: 0, en: 0, zh: 0 };
      for (const loc of d.newLocales) byField[k][loc]++;
    }
    for (const [k, counts] of Object.entries(byField)) {
      console.log(`  ${k} → FR:+${counts.fr}, EN:+${counts.en}, ZH:+${counts.zh}`);
    }
    return;
  }

  // APPLY MODE — confirm before writing
  console.log(`\n[APPLY] About to write ${diffs.length} field updates to ${before.metadata.databaseUrl}`);
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('ERROR: DATABASE_URL not set');
    process.exit(1);
  }
  const pool = new pg.Pool({ connectionString: databaseUrl });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const adapter = new PrismaPg(pool as any);
  const prisma = new PrismaClient({ adapter });
  try {
    const result = await applyDiffs(prisma, diffs, true);
    console.log(`\nDONE. applied=${result.applied}, skipped=${result.skipped}, errors=${result.errors}`);
  } finally {
    await pool.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
