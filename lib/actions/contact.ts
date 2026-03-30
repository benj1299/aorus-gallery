'use server';

import { prisma } from '@/lib/db';
import { z } from 'zod';

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
}) {
  const data = contactSchema.parse(formData);

  await prisma.contactSubmission.create({ data });

  return { success: true };
}
