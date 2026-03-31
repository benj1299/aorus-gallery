'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Printer } from 'lucide-react';

interface Artwork {
  title: string;
  medium: string | null;
  dimensions: string | null;
  year: number | null;
  imageUrl: string;
}

interface ArtistData {
  name: string;
  slug: string;
  nationality: string;
  bio: string;
  imageUrl: string;
  cv: {
    soloShows: string[];
    groupShows: string[];
    artFairs: string[];
    residencies: string[];
    awards: string[];
  };
  collections: string[];
  artworks: Artwork[];
}

const cvSectionLabels: Record<string, string> = {
  soloShows: 'Expositions personnelles',
  groupShows: 'Expositions collectives',
  artFairs: "Foires d'art",
  residencies: 'Résidences',
  awards: 'Prix et distinctions',
};

export function ArtistViewClient({ artist }: { artist: ArtistData }) {
  const cvSections = Object.entries(artist.cv)
    .filter(([, items]) => items.length > 0)
    .map(([key, items]) => ({ key, label: cvSectionLabels[key] || key, items }));

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
        <Link href="/admin/artists" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Retour aux artistes
        </Link>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Printer className="h-4 w-4" />
          Exporter en PDF
        </button>
      </div>

      <div className="print-sheet bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-8 md:p-12">
          <div className="flex flex-col md:flex-row gap-8 md:gap-12">
            {/* Portrait */}
            <div className="w-48 h-60 relative rounded-lg overflow-hidden shrink-0">
              <Image src={artist.imageUrl} alt={artist.name} fill className="object-cover" />
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="mb-2" style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}>
                <h1 className="text-4xl font-normal text-gray-900 tracking-wide">{artist.name}</h1>
              </div>
              <p className="text-sm uppercase tracking-widest text-gray-500 mb-6">{artist.nationality}</p>
              <div className="w-16 h-px mb-6" style={{ backgroundColor: '#4BAF91' }} />
              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{artist.bio}</p>
            </div>
          </div>
        </div>

        {/* Artworks */}
        {artist.artworks.length > 0 && (
          <div className="px-8 md:px-12 pb-8">
            <div className="border-t border-gray-100 pt-8">
              <h2 className="text-xs uppercase tracking-widest text-gray-400 mb-6" style={{ letterSpacing: '0.2em' }}>
                Œuvres sélectionnées
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {artist.artworks.slice(0, 6).map((aw, i) => (
                  <div key={i}>
                    <div className="aspect-square relative rounded overflow-hidden mb-3 bg-gray-50">
                      <Image src={aw.imageUrl} alt={aw.title} fill className="object-cover" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">{aw.title}</p>
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

        {/* CV */}
        {cvSections.length > 0 && (
          <div className="px-8 md:px-12 pb-8">
            <div className="border-t border-gray-100 pt-8">
              <h2 className="text-xs uppercase tracking-widest text-gray-400 mb-6" style={{ letterSpacing: '0.2em' }}>
                Curriculum Vitae
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {cvSections.map(({ key, label, items }) => (
                  <div key={key}>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">{label}</h3>
                    <ul className="space-y-1.5">
                      {items.map((item, i) => (
                        <li key={i} className="text-sm text-gray-600">{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Collections */}
        {artist.collections.length > 0 && (
          <div className="px-8 md:px-12 pb-8">
            <div className="border-t border-gray-100 pt-8">
              <h2 className="text-xs uppercase tracking-widest text-gray-400 mb-6" style={{ letterSpacing: '0.2em' }}>
                Collections
              </h2>
              <ul className="space-y-1.5">
                {artist.collections.map((col, i) => (
                  <li key={i} className="text-sm text-gray-600">{col}</li>
                ))}
              </ul>
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
              <p className="text-xs text-gray-500 mt-1">Paris — Taipei</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">contact@orusgallery.com</p>
              <p className="text-xs text-gray-400 mt-0.5">Sur rendez-vous uniquement</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
