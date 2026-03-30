import { getPressArticles } from '@/lib/queries/press';
import { PressPageClient } from './client';
import type { Locale } from '@/i18n/routing';

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function PressPage({ params }: Props) {
  const { locale } = await params;
  const articles = await getPressArticles(locale as Locale);
  return <PressPageClient articles={articles} />;
}
