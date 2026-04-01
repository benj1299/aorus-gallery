import { revalidatePath } from 'next/cache';

const LOCALES = ['en', 'fr', 'zh'] as const;

export function revalidateEntity(adminPath: string, publicPaths: string[]) {
  revalidatePath(adminPath);
  for (const path of publicPaths) {
    for (const locale of LOCALES) {
      revalidatePath(`/${locale}${path}`);
    }
  }
}
