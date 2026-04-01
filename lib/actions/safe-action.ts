import { z } from 'zod';

type ParseSuccess<T> = { success: true; data: T };
type ParseFailure = { success: false; error: string };
type ParseResult<T> = ParseSuccess<T> | ParseFailure;

export function parseFormData<T>(schema: z.ZodSchema<T>, raw: unknown): ParseResult<T> {
  const result = schema.safeParse(raw);
  if (!result.success) {
    const messages = result.error.issues.map(e => e.message).join(', ');
    return { success: false, error: messages };
  }
  return { success: true, data: result.data };
}
