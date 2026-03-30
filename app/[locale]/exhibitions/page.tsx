import { getGalleryExhibitions } from '@/lib/queries/exhibitions';
import { ExhibitionsPageClient } from './client';
import type { Locale } from '@/i18n/routing';

interface Props {
  params: Promise<{ locale: Locale }>;
}

export default async function ExhibitionsPage({ params }: Props) {
  const { locale } = await params;
  const exhibitions = await getGalleryExhibitions(locale);
  return <ExhibitionsPageClient exhibitions={exhibitions} />;
}
