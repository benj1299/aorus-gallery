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
  soloShows: 'Solo Exhibitions',
  groupShows: 'Group Exhibitions',
  artFairs: 'Art Fairs',
  residencies: 'Residencies',
  awards: 'Awards & Prizes',
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
          .print-sheet { box-shadow: none !important; border: none !important; margin: 0 !important; padding: 0 !important; }
          .print-page-break { page-break-before: always; }
          img { object-fit: contain; }
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

        {/* ── Page 1: Cover ── */}
        <div className="px-10 md:px-16 pt-12 pb-10">
          {/* Gallery branding */}
          <div className="flex items-center justify-between mb-16">
            <div style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}>
              <p className="text-2xl tracking-[0.3em] uppercase text-gray-900 font-normal">ORUS</p>
              <p className="text-sm tracking-[0.15em] uppercase" style={{ color: '#C9A962' }}>Gallery</p>
            </div>
            <div className="flex items-center gap-4 text-xs tracking-[0.15em] uppercase text-gray-400">
              <span>Taipei</span>
              <div className="w-8 h-px" style={{ backgroundColor: '#C9A962' }} />
              <span>Paris</span>
            </div>
          </div>

          {/* Artist header */}
          <div className="flex flex-col md:flex-row gap-10 md:gap-14">
            {/* Portrait */}
            <div className="w-52 h-64 relative rounded-lg overflow-hidden shrink-0">
              <Image src={artist.imageUrl} alt={artist.name} fill className="object-cover" sizes="208px" />
            </div>

            {/* Info */}
            <div className="flex-1 flex flex-col justify-center">
              <h1
                className="text-4xl md:text-5xl font-normal text-gray-900 tracking-wide leading-tight"
                style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}
              >
                {artist.name}
              </h1>
              <div className="w-20 h-px my-6" style={{ backgroundColor: '#C9A962' }} />
              <p className="text-sm uppercase tracking-[0.2em] font-medium" style={{ color: '#4A7C6F' }}>
                {artist.nationality}
              </p>
            </div>
          </div>
        </div>

        {/* ── Page 2: Biography ── */}
        <div className="px-10 md:px-16 pb-10 print-page-break">
          <div className="border-t pt-10" style={{ borderColor: '#C9A96220' }}>
            <p className="text-xs uppercase tracking-[0.25em] font-medium mb-8" style={{ color: '#4A7C6F' }}>
              Biography
            </p>
            <div
              className="text-gray-700 text-sm leading-[1.8] max-w-3xl"
              dangerouslySetInnerHTML={{ __html: artist.bio }}
            />
          </div>
        </div>

        {/* ── Page 3: Selected Works ── */}
        {artist.artworks.length > 0 && (
          <div className="px-10 md:px-16 pb-10 print-page-break">
            <div className="border-t pt-10" style={{ borderColor: '#C9A96220' }}>
              <p className="text-xs uppercase tracking-[0.25em] font-medium mb-10" style={{ color: '#4A7C6F' }}>
                Selected Works
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                {artist.artworks.slice(0, 9).map((aw, i) => (
                  <div key={i}>
                    <div className="aspect-[3/4] relative rounded overflow-hidden mb-4 bg-gray-50">
                      <Image src={aw.imageUrl} alt={aw.title} fill className="object-contain" sizes="(max-width: 768px) 50vw, 33vw" />
                    </div>
                    <p className="text-sm text-gray-900 italic" style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}>
                      {aw.title}
                    </p>
                    {aw.year && <p className="text-xs text-gray-500 mt-0.5">{aw.year}</p>}
                    {aw.medium && <p className="text-xs text-gray-400 mt-0.5">{aw.medium}</p>}
                    {aw.dimensions && <p className="text-xs text-gray-400">{aw.dimensions}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Page 4: CV ── */}
        {cvSections.length > 0 && (
          <div className="px-10 md:px-16 pb-10 print-page-break">
            <div className="border-t pt-10" style={{ borderColor: '#C9A96220' }}>
              <p className="text-xs uppercase tracking-[0.25em] font-medium mb-10" style={{ color: '#4A7C6F' }}>
                Curriculum Vitae
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {cvSections.map(({ key, label, items }) => (
                  <div key={key}>
                    <h3
                      className="text-lg font-normal text-gray-900 mb-4 tracking-wide"
                      style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}
                    >
                      {label}
                    </h3>
                    <div className="w-10 h-px mb-4" style={{ backgroundColor: '#C9A962' }} />
                    <ul className="space-y-2">
                      {items.map((item, i) => (
                        <li key={i} className="text-sm text-gray-600 leading-relaxed">{item}</li>
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
          <div className="px-10 md:px-16 pb-10">
            <div className="border-t pt-10" style={{ borderColor: '#C9A96220' }}>
              <p className="text-xs uppercase tracking-[0.25em] font-medium mb-8" style={{ color: '#4A7C6F' }}>
                Collections
              </p>
              <ul className="space-y-2">
                {artist.collections.map((col, i) => (
                  <li key={i} className="text-sm text-gray-600">{col}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* ── Footer ── */}
        <div className="px-10 md:px-16 py-8 border-t" style={{ borderColor: '#C9A96220', backgroundColor: '#FAFAF8' }}>
          <div className="flex items-center justify-between">
            <div>
              <p
                className="text-base tracking-[0.3em] uppercase text-gray-900"
                style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}
              >
                ORUS Gallery
              </p>
              <p className="text-xs mt-1.5 tracking-wide" style={{ color: '#4A7C6F' }}>
                Taipei — Paris
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">info@orusgallery.com</p>
              <p className="text-xs text-gray-400 mt-1">orusgallery.com</p>
              <p className="text-xs text-gray-400 mt-0.5">By appointment only</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
