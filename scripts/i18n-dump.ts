/**
 * i18n DUMP — Phase 1 du workflow de backfill multilingue.
 *
 * Lit toutes les tables contenant des champs Json `{en, fr, zh}` et sérialise
 * la state actuelle dans `.i18n/dump-before.json`. Ce fichier est commité dans
 * le repo comme baseline / audit trail.
 *
 * Workflow :
 *   1. `pnpm tsx scripts/i18n-dump.ts` (cette commande)
 *      → produit `.i18n/dump-before.json`
 *   2. /loop ou édition manuelle de `.i18n/dump-before.json` → `.i18n/dump-after.json`
 *      (fill empties selon règles Victor 2026-05-19)
 *   3. `pnpm tsx scripts/i18n-apply.ts` → applique les diffs sur Neon prod
 *
 * Règles backfill (Victor) :
 *   - Skip totalement `Artist.bio` (immutable)
 *   - Titles d'œuvres / expositions / press / gallery exhibitions :
 *     ne PAS traduire, juste copier la valeur source dans les locales vides
 *     (titres = identifiants stables, identiques cross-lang)
 *   - Autres champs (medium, nationality, description, excerpt, collection title,
 *     banner title/subtitle) : traduction FR ↔ EN, EN → ZH-Hant (Taiwan/HK)
 *   - Dimensions / années / lieux propres / prix : copy identical
 *   - Ton : sobre, pro, galerie contemporaine, no marketing
 *   - Ne jamais inventer : si toutes les locales vides, laisser vide
 */

import { writeFileSync, mkdirSync } from 'node:fs';
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
  /** Composite identifier : model + id, p.ex. `artist:abc123` */
  ref: string;
  model: 'artist' | 'exhibition' | 'collection' | 'artwork' | 'pressArticle' | 'homeBanner' | 'galleryExhibition';
  id: string;
  /** Identifiant humain pour debug / context Claude (artist name, artwork title fr/en, etc.) */
  label: string;
  /** Champs i18n : key = field name, value = TranslatableField */
  fields: Record<string, TranslatableField | null>;
  /** Policy par field : 'translate' (fill empties via traduction) | 'copy' (fill empties via copy source) | 'skip' (immutable) */
  policy: Record<string, 'translate' | 'copy' | 'skip'>;
}

interface Dump {
  metadata: {
    generatedAt: string;
    databaseUrl: string;
    entityCount: number;
  };
  entities: DumpEntity[];
}

function maskUrl(url: string): string {
  return url.replace(/\/\/[^@]+@/, '//***@');
}

function normalizeTranslatable(value: unknown): TranslatableField | null {
  if (!value || typeof value !== 'object') return null;
  const v = value as Record<string, unknown>;
  return {
    en: typeof v.en === 'string' ? v.en : '',
    fr: typeof v.fr === 'string' ? v.fr : '',
    zh: typeof v.zh === 'string' ? v.zh : '',
  };
}

function bestLabel(field: TranslatableField | null): string {
  if (!field) return '';
  return field.fr || field.en || field.zh || '';
}

async function main(): Promise<void> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('ERROR: DATABASE_URL not set');
    process.exit(1);
  }

  const pool = new pg.Pool({ connectionString: databaseUrl });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const adapter = new PrismaPg(pool as any);
  const prisma = new PrismaClient({ adapter });

  const entities: DumpEntity[] = [];

  // === Artist ===
  const artists = await prisma.artist.findMany({ orderBy: { name: 'asc' } });
  for (const a of artists) {
    entities.push({
      ref: `artist:${a.id}`,
      model: 'artist',
      id: a.id,
      label: a.name,
      fields: {
        nationality: normalizeTranslatable(a.nationality),
        // bio inclus dans le dump pour visibilité contextuelle, mais policy=skip
        bio: normalizeTranslatable(a.bio),
      },
      policy: {
        nationality: 'translate',
        bio: 'skip',
      },
    });
  }

  // === Exhibition (CV entries) ===
  const exhibitions = await prisma.exhibition.findMany({
    orderBy: [{ artistId: 'asc' }, { sortOrder: 'asc' }],
    include: { artist: { select: { name: true } } },
  });
  for (const e of exhibitions) {
    entities.push({
      ref: `exhibition:${e.id}`,
      model: 'exhibition',
      id: e.id,
      label: `[${e.artist.name}] ${bestLabel(normalizeTranslatable(e.title))} (${e.year ?? '—'}, ${e.type})`,
      fields: {
        title: normalizeTranslatable(e.title),
      },
      policy: {
        // Titles d'expositions : Victor dit ne PAS traduire, juste copier la source dans les
        // locales vides (titres = identifiants stables, ex "Solo Exhibition, ORUS Gallery, Paris, 2025")
        title: 'copy',
      },
    });
  }

  // === Collection ===
  const collections = await prisma.collection.findMany({
    orderBy: [{ artistId: 'asc' }, { sortOrder: 'asc' }],
    include: { artist: { select: { name: true } } },
  });
  for (const c of collections) {
    entities.push({
      ref: `collection:${c.id}`,
      model: 'collection',
      id: c.id,
      label: `[${c.artist.name}] ${bestLabel(normalizeTranslatable(c.title))}`,
      fields: {
        title: normalizeTranslatable(c.title),
      },
      policy: {
        // Collections : descriptions courtes ("Private Collections, France and Europe") → translate
        title: 'translate',
      },
    });
  }

  // === Artwork ===
  const artworks = await prisma.artwork.findMany({
    orderBy: [{ artistId: 'asc' }, { sortOrder: 'asc' }],
    include: { artist: { select: { name: true } } },
  });
  for (const aw of artworks) {
    entities.push({
      ref: `artwork:${aw.id}`,
      model: 'artwork',
      id: aw.id,
      label: `[${aw.artist.name}] ${bestLabel(normalizeTranslatable(aw.title))}`,
      fields: {
        title: normalizeTranslatable(aw.title),
        medium: normalizeTranslatable(aw.medium),
      },
      policy: {
        // Titles d'œuvres = immutables, juste copy
        title: 'copy',
        medium: 'translate',
      },
    });
  }

  // === PressArticle ===
  const press = await prisma.pressArticle.findMany({ orderBy: { sortOrder: 'asc' } });
  for (const p of press) {
    entities.push({
      ref: `pressArticle:${p.id}`,
      model: 'pressArticle',
      id: p.id,
      label: bestLabel(normalizeTranslatable(p.title)) || p.publication,
      fields: {
        title: normalizeTranslatable(p.title),
        excerpt: normalizeTranslatable(p.excerpt),
      },
      policy: {
        title: 'copy',
        excerpt: 'translate',
      },
    });
  }

  // === HomeBanner ===
  const banners = await prisma.homeBanner.findMany();
  for (const b of banners) {
    entities.push({
      ref: `homeBanner:${b.id}`,
      model: 'homeBanner',
      id: b.id,
      label: bestLabel(normalizeTranslatable(b.title)),
      fields: {
        title: normalizeTranslatable(b.title),
        subtitle: normalizeTranslatable(b.subtitle),
      },
      policy: {
        title: 'translate',
        subtitle: 'translate',
      },
    });
  }

  // === GalleryExhibition ===
  const galleryExhs = await prisma.galleryExhibition.findMany({ orderBy: { sortOrder: 'asc' } });
  for (const g of galleryExhs) {
    entities.push({
      ref: `galleryExhibition:${g.id}`,
      model: 'galleryExhibition',
      id: g.id,
      label: bestLabel(normalizeTranslatable(g.title)),
      fields: {
        title: normalizeTranslatable(g.title),
        description: normalizeTranslatable(g.description),
      },
      policy: {
        title: 'copy',
        description: 'translate',
      },
    });
  }

  const dump: Dump = {
    metadata: {
      generatedAt: new Date().toISOString(),
      databaseUrl: maskUrl(databaseUrl),
      entityCount: entities.length,
    },
    entities,
  };

  const outPath = '.i18n/dump-before.json';
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, JSON.stringify(dump, null, 2));

  // Statistiques pour la console
  const byModel: Record<string, number> = {};
  for (const e of entities) {
    byModel[e.model] = (byModel[e.model] ?? 0) + 1;
  }
  console.log(`Dumped ${entities.length} entities → ${outPath}`);
  console.log('Breakdown:', byModel);

  // Stats locales vides par field translatable (= candidat backfill)
  let emptyFr = 0;
  let emptyEn = 0;
  let emptyZh = 0;
  let totalFields = 0;
  for (const e of entities) {
    for (const [, field] of Object.entries(e.fields)) {
      if (!field) continue;
      totalFields++;
      if (!field.fr.trim()) emptyFr++;
      if (!field.en.trim()) emptyEn++;
      if (!field.zh.trim()) emptyZh++;
    }
  }
  console.log(`Empty locales — FR: ${emptyFr}, EN: ${emptyEn}, ZH: ${emptyZh} (of ${totalFields} fields)`);

  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
