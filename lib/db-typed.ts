import { prisma } from './db';
import type { TranslatableField } from './i18n-content';

export const db = prisma.$extends({
  result: {
    artist: {
      nationality: { compute: (a) => a.nationality as TranslatableField },
      bio: { compute: (a) => a.bio as TranslatableField },
    },
    exhibition: {
      title: { compute: (e) => e.title as TranslatableField },
    },
    collection: {
      title: { compute: (c) => c.title as TranslatableField },
    },
    artwork: {
      title: { compute: (a) => a.title as TranslatableField },
      medium: { compute: (a) => a.medium as TranslatableField | null },
    },
    galleryExhibition: {
      title: { compute: (e) => e.title as TranslatableField },
      description: { compute: (e) => e.description as TranslatableField | null },
    },
    pressArticle: {
      title: { compute: (p) => p.title as TranslatableField },
      excerpt: { compute: (p) => p.excerpt as TranslatableField | null },
    },
    homeBanner: {
      title: { compute: (b) => b.title as TranslatableField },
      subtitle: { compute: (b) => b.subtitle as TranslatableField | null },
    },
  },
});
