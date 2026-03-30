import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getArtistBySlugForFrontend } from '@/lib/queries/artists';
import { ArtistDetailClient } from './client';
import type { Locale } from '@/i18n/routing';

const BASE_URL = 'https://aorus-gallery.vercel.app';

interface Props {
  params: Promise<{ id: string; locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, locale } = await params;
  const artist = await getArtistBySlugForFrontend(id, locale as Locale);
  if (!artist) return { title: 'Artist Not Found' };
  const description = artist.bio ? artist.bio.slice(0, 160) : `${artist.name} at ORUS Gallery`;
  return {
    title: `${artist.name} | ORUS Gallery`,
    description,
    alternates: {
      languages: {
        en: `${BASE_URL}/en/artists/${id}`,
        fr: `${BASE_URL}/fr/artists/${id}`,
        zh: `${BASE_URL}/zh/artists/${id}`,
      },
    },
    openGraph: {
      title: `${artist.name} | ORUS Gallery`,
      description,
      type: 'website',
      siteName: 'ORUS Gallery',
      ...(artist.image ? { images: [{ url: artist.image }] } : {}),
    },
  };
}

export default async function ArtistPage({ params }: Props) {
  const { id, locale } = await params;
  const artist = await getArtistBySlugForFrontend(id, locale as Locale);

  if (!artist) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: artist.name,
    nationality: artist.nationality,
    description: artist.bio,
    image: artist.image,
    url: `https://aorus-gallery.vercel.app/${locale}/artists/${id}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArtistDetailClient artist={artist} />
    </>
  );
}
