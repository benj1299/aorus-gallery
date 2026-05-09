/**
 * Serialize a Prisma model instance (or array thereof) to a plain object suitable
 * for passing across the React Server Component → Client boundary.
 *
 * Why this exists :
 *   Since Prisma 7, model instances carry a `[nodejs.util.inspect.custom]` symbol
 *   for prettier `console.log` output. React 19 / Next 16 RSC rejects symbol-bearing
 *   objects when serializing across the Server→Client boundary, flooding the dev
 *   console with "Only plain objects can be passed to Client Components".
 *
 *   Additionally, `Prisma.Decimal` is not a plain object — it has internal numeric
 *   methods. We coerce it to `number` (Orus prices fit comfortably in JS number range).
 *
 * What we keep :
 *   - All enumerable own string keys (the actual data columns + relations)
 *   - `Date` instances (RSC supports Date)
 *   - Nested arrays + objects (recursively cleaned)
 *
 * What we strip :
 *   - All symbol keys (incl. nodejs.util.inspect.custom) — symbols are skipped by
 *     `Object.keys()` so the recursive copy naturally drops them
 *   - Decimal class instances → number
 */

function isDecimal(value: unknown): boolean {
  if (typeof value !== 'object' || value === null) return false;
  const proto = Object.getPrototypeOf(value);
  return proto?.constructor?.name === 'Decimal';
}

export function serializePrismaRow<T>(row: T): T {
  if (row === null || row === undefined) return row;
  const t = typeof row;
  // Functions / symbols / undefined — drop entirely. Returning them across the
  // RSC boundary triggers React's "Functions cannot be passed directly" error
  // even when they live deep inside a relation.
  if (t === 'function' || t === 'symbol' || t === 'undefined') {
    return undefined as unknown as T;
  }
  if (t !== 'object') return row;
  if (row instanceof Date) return row;
  if (Array.isArray(row)) {
    return row.map(serializePrismaRow) as unknown as T;
  }
  if (isDecimal(row)) {
    // Prisma.Decimal#toString returns its decimal string representation
    return Number((row as { toString(): string }).toString()) as unknown as T;
  }
  // Plain object — clone enumerable string keys (drops symbols + functions)
  const out: Record<string, unknown> = {};
  for (const key of Object.keys(row as Record<string, unknown>)) {
    const value = (row as Record<string, unknown>)[key];
    const cleaned = serializePrismaRow(value);
    // Don't include keys whose value cleaned to undefined (function, symbol, etc.)
    if (cleaned !== undefined || value === undefined) {
      out[key] = cleaned;
    }
  }
  return out as T;
}

/** Convenience for paginated query returns. */
export function serializePrismaPage<T>(page: {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}) {
  return {
    items: page.items.map((row) => serializePrismaRow(row)),
    total: page.total,
    page: page.page,
    pageSize: page.pageSize,
    totalPages: page.totalPages,
  };
}
