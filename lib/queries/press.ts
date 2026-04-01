import { db } from '@/lib/db-typed';
import { resolveTranslation } from '@/lib/i18n-content';
import type { Locale } from '@/i18n/routing';

export async function getPressArticles(locale: Locale = 'en') {
  const articles = await db.pressArticle.findMany({
    where: { visible: true },
    orderBy: { publishedAt: 'desc' },
    select: {
      id: true,
      slug: true,
      title: true,
      publication: true,
      publishedAt: true,
      url: true,
      imageUrl: true,
      excerpt: true,
    },
  });
  return articles.map((a) => ({
    ...a,
    title: resolveTranslation(a.title, locale),
    excerpt: a.excerpt ? resolveTranslation(a.excerpt, locale) : null,
  }));
}

/** Get all press articles for admin */
export async function getAllPressAdmin() {
  return db.pressArticle.findMany({
    orderBy: { publishedAt: 'desc' },
  });
}

export async function getPressArticleById(id: string) {
  return db.pressArticle.findUnique({ where: { id } });
}
