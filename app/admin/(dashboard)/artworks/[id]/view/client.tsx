'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ArrowLeft, Printer } from 'lucide-react';

interface ArtworkData {
  id: string;
  slug: string;
  title: string;
  medium: string | null;
  dimensions: string | null;
  year: number | null;
  price: number | null;
  currency: string;
  showPrice: boolean;
  sold: boolean;
  imageUrl: string;
  imageWidth: number | null;
  imageHeight: number | null;
  images: { src: string; width: number | null; height: number | null }[];
  artist: {
    name: string;
    nationality: string;
    bio: string;
    imageUrl: string;
  };
}

const GOLD = '#C9A962';
const JADE = '#4A7C6F';
const IVORY = '#FAFAF8';
const BORDER = '#C9A96220';

function formatPrice(price: number, currency: string) {
  try {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(price);
  } catch {
    return `${price.toLocaleString('fr-FR')} ${currency}`;
  }
}

function bioExcerpt(html: string, maxChars = 600) {
  const text = html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  if (text.length <= maxChars) return text;
  const truncated = text.slice(0, maxChars);
  const lastSpace = truncated.lastIndexOf(' ');
  return `${truncated.slice(0, lastSpace > 0 ? lastSpace : maxChars)}…`;
}

export function ArtworkViewClient({ artwork }: { artwork: ArtworkData }) {
  const t = useTranslations('admin.print');

  const specs: Array<{ label: string; value: string }> = [];
  if (artwork.medium) specs.push({ label: t('medium'), value: artwork.medium });
  if (artwork.dimensions) specs.push({ label: t('dimensions'), value: artwork.dimensions });
  if (artwork.year) specs.push({ label: t('year'), value: String(artwork.year) });
  specs.push({ label: t('reference'), value: artwork.slug.toUpperCase() });

  const priceLine = artwork.sold
    ? t('sold')
    : artwork.showPrice && artwork.price !== null
      ? formatPrice(artwork.price, artwork.currency)
      : t('priceOnRequest');

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .print-sheet { box-shadow: none !important; border: none !important; margin: 0 !important; padding: 0 !important; }
          .print-page-break { page-break-before: always; }
          img { object-fit: contain; }
          @page { size: A4; margin: 0; }
        }
      `}</style>

      <div className="no-print mb-6 flex items-center justify-between">
        <Link
          href="/admin/artworks"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('backToArtworks')}
        </Link>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Printer className="h-4 w-4" />
          {t('exportPdf')}
        </button>
      </div>

      <div className="print-sheet bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

        {/* -- Page 1: Cover -- */}
        <div className="px-10 md:px-16 pt-12 pb-12">
          {/* Gallery branding */}
          <div className="flex items-center justify-between mb-12">
            <div style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}>
              <p className="text-2xl tracking-[0.3em] uppercase text-gray-900 font-normal">ORUS</p>
              <p className="text-sm tracking-[0.15em] uppercase" style={{ color: GOLD }}>Gallery</p>
            </div>
            <div className="flex items-center gap-4 text-xs tracking-[0.15em] uppercase text-gray-400">
              <span>Taipei</span>
              <div className="w-8 h-px" style={{ backgroundColor: GOLD }} />
              <span>Paris</span>
            </div>
          </div>

          {/* Hero artwork image — object-contain, generous breathing room */}
          <div
            className="relative w-full mb-10 flex items-center justify-center"
            style={{
              backgroundColor: IVORY,
              minHeight: '420px',
              padding: '40px',
            }}
          >
            <div
              className="relative w-full"
              style={{
                aspectRatio:
                  artwork.imageWidth && artwork.imageHeight
                    ? `${artwork.imageWidth} / ${artwork.imageHeight}`
                    : '4 / 5',
                maxHeight: '520px',
              }}
            >
              <Image
                src={artwork.imageUrl}
                alt={artwork.title}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 90vw, 800px"
                priority
              />
            </div>
          </div>

          {/* Cartel — museum hierarchy */}
          <div className="text-center max-w-2xl mx-auto">
            <h1
              className="text-3xl md:text-4xl font-normal text-gray-900 italic tracking-wide leading-tight"
              style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}
            >
              {artwork.title}
            </h1>
            <div className="w-16 h-px mx-auto my-6" style={{ backgroundColor: GOLD }} />
            <p
              className="text-lg text-gray-700 tracking-wide"
              style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}
            >
              {artwork.artist.name}
              {artwork.year ? ` · ${artwork.year}` : ''}
            </p>
            <p className="text-xs uppercase tracking-[0.2em] mt-3 font-medium" style={{ color: JADE }}>
              {artwork.artist.nationality}
            </p>
          </div>
        </div>

        {/* -- Page 2: Specifications -- */}
        <div className="px-10 md:px-16 pb-12 print-page-break">
          <div className="border-t pt-10" style={{ borderColor: BORDER }}>
            <p className="text-xs uppercase tracking-[0.25em] font-medium mb-10" style={{ color: JADE }}>
              {t('specifications')}
            </p>

            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 max-w-3xl">
              {specs.map((spec) => (
                <div key={spec.label} className="flex flex-col">
                  <dt className="text-[0.7rem] uppercase tracking-[0.2em] text-gray-400 font-medium mb-2">
                    {spec.label}
                  </dt>
                  <dd
                    className="text-base text-gray-900"
                    style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}
                  >
                    {spec.value}
                  </dd>
                </div>
              ))}
            </dl>

            {/* Price block — refined, separated */}
            <div className="mt-14 pt-8 border-t max-w-3xl" style={{ borderColor: BORDER }}>
              <p className="text-[0.7rem] uppercase tracking-[0.2em] text-gray-400 font-medium mb-3">
                {t('availability')}
              </p>
              <p
                className="text-2xl text-gray-900 tracking-wide"
                style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}
              >
                {priceLine}
              </p>
            </div>
          </div>
        </div>

        {/* -- Page 3: About the Artist -- */}
        <div className="px-10 md:px-16 pb-12 print-page-break">
          <div className="border-t pt-10" style={{ borderColor: BORDER }}>
            <p className="text-xs uppercase tracking-[0.25em] font-medium mb-10" style={{ color: JADE }}>
              {t('aboutArtist')}
            </p>

            <div className="flex flex-col md:flex-row gap-10">
              {artwork.artist.imageUrl && (
                <div className="w-40 h-52 relative rounded-lg overflow-hidden shrink-0">
                  <Image
                    src={artwork.artist.imageUrl}
                    alt={artwork.artist.name}
                    fill
                    className="object-cover"
                    sizes="160px"
                  />
                </div>
              )}
              <div className="flex-1">
                <h3
                  className="text-2xl text-gray-900 tracking-wide mb-2"
                  style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}
                >
                  {artwork.artist.name}
                </h3>
                <p className="text-xs uppercase tracking-[0.2em] mb-6 font-medium" style={{ color: JADE }}>
                  {artwork.artist.nationality}
                </p>
                <p className="text-gray-700 text-sm leading-[1.8] max-w-2xl">
                  {bioExcerpt(artwork.artist.bio)}
                </p>
                <p className="text-xs text-gray-400 italic mt-6">
                  {t('fullBioAvailable')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* -- Page 4: Additional Views (conditional) -- */}
        {artwork.images.length > 0 && (
          <div className="px-10 md:px-16 pb-12 print-page-break">
            <div className="border-t pt-10" style={{ borderColor: BORDER }}>
              <p className="text-xs uppercase tracking-[0.25em] font-medium mb-10" style={{ color: JADE }}>
                {t('additionalViews')}
              </p>
              <div className="grid grid-cols-2 gap-8">
                {artwork.images.slice(0, 4).map((img, i) => (
                  <div
                    key={i}
                    className="relative bg-gray-50 flex items-center justify-center"
                    style={{ aspectRatio: '4 / 3' }}
                  >
                    <Image
                      src={img.src}
                      alt={`${artwork.title} — view ${i + 1}`}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 50vw, 400px"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* -- Footer -- */}
        <div
          className="px-10 md:px-16 py-8 border-t"
          style={{ borderColor: BORDER, backgroundColor: IVORY }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className="text-base tracking-[0.3em] uppercase text-gray-900"
                style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}
              >
                ORUS Gallery
              </p>
              <p className="text-xs mt-1.5 tracking-wide" style={{ color: JADE }}>
                Taipei — Paris
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">info@orusgallery.com</p>
              <p className="text-xs text-gray-400 mt-1">orusgallery.com</p>
              <p className="text-xs text-gray-400 mt-0.5">{t('byAppointmentOnly')}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
