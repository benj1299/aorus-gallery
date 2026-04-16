'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ArrowLeft, Printer } from 'lucide-react';

interface ArtistData {
  name: string;
  slug: string;
  imageUrl: string;
  nationality: string;
  bio: string;
}

interface ArtworkData {
  title: string;
  imageUrl: string;
  medium: string | null;
  dimensions: string | null;
  year: number | null;
  artistName: string;
}

interface ExhibitionData {
  title: string;
  description: string | null;
  type: string;
  status: string;
  startDate: string | null;
  endDate: string | null;
  location: string | null;
  imageUrl: string | null;
  artists: ArtistData[];
  artworks: ArtworkData[];
}

export function ExhibitionViewClient({ exhibition }: { exhibition: ExhibitionData }) {
  const t = useTranslations('admin.print');
  const dateRange = [exhibition.startDate, exhibition.endDate].filter(Boolean).join(' - ');

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .print-sheet { box-shadow: none !important; border: none !important; margin: 0 !important; padding: 2rem !important; }
          img { max-height: 200px; object-fit: cover; }
        }
      `}</style>

      <div className="no-print mb-6 flex items-center justify-between">
        <Link href="/admin/exhibitions" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          {t('backToExhibitions')}
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
        {/* Header */}
        <div className="p-8 md:p-12">
          <div className="flex flex-col md:flex-row gap-8 md:gap-12">
            {/* Featured image */}
            {exhibition.imageUrl && (
              <div className="w-full md:w-64 h-48 md:h-60 relative rounded-lg overflow-hidden shrink-0">
                <Image src={exhibition.imageUrl} alt={exhibition.title} fill className="object-cover" />
              </div>
            )}

            {/* Info */}
            <div className="flex-1">
              <div className="mb-2" style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}>
                <h1 className="text-4xl font-normal text-gray-900 tracking-wide">{exhibition.title}</h1>
              </div>
              <div className="flex flex-wrap gap-3 mb-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                  {exhibition.type}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                  {exhibition.status}
                </span>
              </div>
              {dateRange && (
                <p className="text-sm text-gray-500 mb-1">{dateRange}</p>
              )}
              {exhibition.location && (
                <p className="text-sm text-gray-500 mb-4">{exhibition.location}</p>
              )}
              <div className="w-16 h-px mb-6" style={{ backgroundColor: '#4A7C6F' }} />
              {exhibition.description && (
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{exhibition.description}</p>
              )}
            </div>
          </div>
        </div>

        {/* Participating Artists */}
        {exhibition.artists.length > 0 && (
          <div className="px-8 md:px-12 pb-8">
            <div className="border-t border-gray-100 pt-8">
              <h2 className="text-xs uppercase tracking-widest text-gray-400 mb-6" style={{ letterSpacing: '0.2em' }}>
                {t('participatingArtists')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {exhibition.artists.map((artist, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-20 h-24 relative rounded overflow-hidden shrink-0 bg-gray-50">
                      <Image src={artist.imageUrl} alt={artist.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{artist.name}</p>
                      <p className="text-xs text-gray-500 mb-2">{artist.nationality}</p>
                      {artist.bio && (
                        <p className="text-xs text-gray-600 line-clamp-3">{artist.bio}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Artworks */}
        {exhibition.artworks.length > 0 && (
          <div className="px-8 md:px-12 pb-8">
            <div className="border-t border-gray-100 pt-8">
              <h2 className="text-xs uppercase tracking-widest text-gray-400 mb-6" style={{ letterSpacing: '0.2em' }}>
                {t('exhibitedWorks')}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {exhibition.artworks.map((aw, i) => (
                  <div key={i}>
                    <div className="aspect-square relative rounded overflow-hidden mb-3 bg-gray-50">
                      <Image src={aw.imageUrl} alt={aw.title} fill className="object-cover" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">{aw.title}</p>
                    <p className="text-xs text-gray-500">{aw.artistName}</p>
                    {aw.medium && <p className="text-xs text-gray-500">{aw.medium}</p>}
                    <p className="text-xs text-gray-400">
                      {[aw.dimensions, aw.year].filter(Boolean).join(', ')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-8 md:px-12 py-6 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900 tracking-widest uppercase" style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}>
                ORUS Gallery
              </p>
              <p className="text-xs text-gray-500 mt-1">Paris -- Taipei</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">contact@orusgallery.com</p>
              <p className="text-xs text-gray-400 mt-0.5">{t('byAppointmentOnlyFr')}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
