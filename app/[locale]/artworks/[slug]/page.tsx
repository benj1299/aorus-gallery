import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getArtworkBySlugForFrontend } from '@/lib/queries/artworks';
import { ArtworkDetailClient } from './client';
import type { Locale } from '@/i18n/routing';
import { BASE_URL, OG_LOCALE, generateAlternates } from '@/lib/seo';

interface Props {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const artwork = await getArtworkBySlugForFrontend(slug, locale as Locale);
  if (!artwork) return { title: 'Artwork Not Found' };

  const title = `${artwork.artist.name} — ${artwork.title} | ORUS Gallery`;
  const descriptionParts = [artwork.title];
  if (artwork.year) descriptionParts.push(`${artwork.year}`);
  if (artwork.medium) descriptionParts.push(artwork.medium);
  const description = `${artwork.artist.name}: ${descriptionParts.join(', ')}. ORUS Gallery.`;

  return {
    title,
    description,
    alternates: generateAlternates(locale, `/artworks/${slug}`),
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: 'ORUS Gallery',
      locale: OG_LOCALE[locale],
      images: [{ url: artwork.imageUrl, alt: artwork.title }],
    },
    twitter: { card: 'summary_large_image' as const },
  };
}

export default async function ArtworkPage({ params }: Props) {
  const { slug, locale } = await params;
  const artwork = await getArtworkBySlugForFrontend(slug, locale as Locale);
  const t = await getTranslations({ locale, namespace: 'nav' });

  if (!artwork) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VisualArtwork',
    name: artwork.title,
    creator: {
      '@type': 'Person',
      name: artwork.artist.name,
    },
    dateCreated: artwork.year?.toString(),
    artMedium: artwork.medium ?? undefined,
    image: artwork.imageUrl,
    url: `${BASE_URL}/${locale}/artworks/${slug}`,
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/${locale}` },
      { '@type': 'ListItem', position: 2, name: t('artists'), item: `${BASE_URL}/${locale}/artists` },
      { '@type': 'ListItem', position: 3, name: artwork.artist.name, item: `${BASE_URL}/${locale}/artists/${artwork.artist.slug}` },
      { '@type': 'ListItem', position: 4, name: artwork.title },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <ArtworkDetailClient artwork={artwork} />
    </>
  );
}
