'use server';

import { db } from '@/lib/db-typed';
import { z } from 'zod';
import { headers } from 'next/headers';
import { checkRateLimit } from '@/lib/rate-limit';

const CONTACT_STATUS_VALUES = ['collector', 'press', 'institution', 'corporate', 'artist', 'other'] as const;
const INTERESTED_IN_VALUES = ['artist', 'work', 'advisory', 'event'] as const;

const contactSchema = z.object({
  status: z.enum(CONTACT_STATUS_VALUES),
  name: z.string().min(2).max(200),
  email: z.string().email(),
  message: z.string().min(10).max(2000),
  interestedIn: z.enum(INTERESTED_IN_VALUES).optional().or(z.literal('')),
  preferredLanguage: z.string().optional(),
});

export async function submitContactForm(formData: {
  status: string;
  name: string;
  email: string;
  message: string;
  interestedIn?: string;
  preferredLanguage?: string;
}): Promise<{ error: string } | { success: true }> {
  const headersList = await headers();
  const ip = headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (!checkRateLimit(ip)) {
    return { error: 'Trop de soumissions. Veuillez réessayer plus tard.' };
  }

  const result = contactSchema.safeParse(formData);
  if (!result.success) {
    const messages = result.error.issues.map(e => e.message).join(', ');
    return { error: messages };
  }

  await db.contactSubmission.create({ data: result.data });

  return { success: true };
}
