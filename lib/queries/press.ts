import { prisma } from '@/lib/db';
import { resolveTranslation, type TranslatableField } from '@/lib/i18n-content';
import type { Locale } from '@/i18n/routing';

export async function getPressArticles(locale: Locale = 'en') {
  const articles = await prisma.pressArticle.findMany({
    where: { visible: true },
    orderBy: { publishedAt: 'desc' },
  });
  return articles.map((a) => ({
    ...a,
    title: resolveTranslation(a.title as TranslatableField, locale),
    excerpt: a.excerpt ? resolveTranslation(a.excerpt as TranslatableField, locale) : null,
  }));
}

/** Get all press articles for admin */
export async function getAllPressAdmin() {
  return prisma.pressArticle.findMany({
    orderBy: { publishedAt: 'desc' },
  });
}

export async function getPressArticleById(id: string) {
  return prisma.pressArticle.findUnique({ where: { id } });
}
