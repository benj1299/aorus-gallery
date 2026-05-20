import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db-typed';
import { resolveTranslation } from '@/lib/i18n-content';
import { renderToBuffer } from '@react-pdf/renderer';
import { ArtistInventoryPdf, type PdfArtwork } from '@/lib/pdf/artist-inventory-pdf';
import { routing, type Locale } from '@/i18n/routing';
import { headers } from 'next/headers';
import { slugify } from '@/lib/slugify';

// Force Node runtime — @react-pdf/renderer ne tourne pas sur Edge.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function parseLocale(raw: string | null): Locale {
  if (!raw) return 'fr';
  const candidate = raw.toLowerCase();
  if ((routing.locales as readonly string[]).includes(candidate)) {
    return candidate as Locale;
  }
  return 'fr';
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  // Auth — 401 si non admin (les routes API ne peuvent pas rediriger comme
  // requireAuth(), on retourne un statut explicite).
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user || session.user.role !== 'admin') {
    return new Response('Unauthorized', { status: 401 });
  }

  const { id } = await params;
  const url = new URL(req.url);
  const locale = parseLocale(url.searchParams.get('locale'));

  const artist = await db.artist.findUnique({
    where: { id },
    include: { artworks: { orderBy: { sortOrder: 'asc' } } },
  });
  if (!artist) {
    return new Response('Artist not found', { status: 404 });
  }

  const artworks: PdfArtwork[] = artist.artworks.map((aw) => ({
    id: aw.id,
    title: resolveTranslation(aw.title, locale),
    year: aw.year,
    medium: aw.medium ? resolveTranslation(aw.medium, locale) : null,
    dimensions: aw.dimensions,
    widthCm: aw.widthCm,
    heightCm: aw.heightCm,
    price: aw.price ? Number(aw.price) : null,
    currency: aw.currency,
    imageUrl: aw.imageUrl,
    visible: aw.visible,
    sold: aw.sold,
    reserved: aw.reserved,
  }));

  const buffer = await renderToBuffer(
    <ArtistInventoryPdf
      artist={{
        name: artist.name,
        nationality: resolveTranslation(artist.nationality, locale) || null,
      }}
      artworks={artworks}
      locale={locale}
    />,
  );

  // Filename : <ArtistSlug>_ORUS_Artwork_List.pdf — slug ASCII-friendly,
  // évite les soucis d'encodage Content-Disposition cross-browser.
  const filename = `${slugify(artist.name)}_ORUS_Artwork_List.pdf`;

  // Buffer → Blob : Next 16 Response BodyInit types n'acceptent ni Node
  // Buffer ni Uint8Array<ArrayBufferLike> selon les lib defs ; Blob est OK
  // sur toutes les runtimes.
  const blob = new Blob([new Uint8Array(buffer)], { type: 'application/pdf' });

  return new Response(blob, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'private, no-store',
    },
  });
}
