import { prisma } from '@/lib/db';
import { unstable_noStore as noStore } from 'next/cache';

export async function getSiteSettings() {
  noStore();
  const settings = await prisma.siteSettings.findFirst();
  return settings ?? { showExhibitions: false, showBanner: false };
}
