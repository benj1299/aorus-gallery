'use server';

import { prisma } from '@/lib/db';
import { z } from 'zod';
import { headers } from 'next/headers';
import { checkRateLimit } from '@/lib/rate-limit';

const contactSchema = z.object({
  status: z.string().min(1),
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
  interestedIn: z.string().optional(),
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

  await prisma.contactSubmission.create({ data: result.data });

  return { success: true };
}
