// Artists data — ORUS Gallery
// contentStatus: 'verified' | 'partial' | 'coming-soon'
// ZERO fictional content: all CV entries sourced from verified research only.

export interface ArtworkWork {
  title: string;
  year: string;
  medium: string;
  dimensions: string;
  image: string;
  availability: 'available' | 'on_hold' | 'sold' | 'poa';
}

export interface ArtistCV {
  exhibitions: { title: string; venue: string; city: string; year: string; type: 'solo' | 'group' }[];
  fairs: { name: string; city: string; year: string; gallery?: string }[];
  residencies: { name: string; city: string; year: string }[];
  awards: { name: string; year: string }[];
  collections: string[];
  press: { title: string; publication: string; year: string; url?: string }[];
}

export interface Artist {
  id: string;
  slug: string;
  name: string;
  nationality: string;
  birthYear?: string;
  birthPlace?: string;
  location: string;
  bio: string;
  statement: string;
  image: string;
  medium: string;
  region: string;
  works: ArtworkWork[];
  cv: ArtistCV;
  availability: 'represented' | 'project' | 'emerging';
  contentStatus: 'verified' | 'partial' | 'coming-soon';
  sourceNote?: string;
}

const emptyCV: ArtistCV = {
  exhibitions: [],
  fairs: [],
  residencies: [],
  awards: [],
  collections: [],
  press: [],
};

export const artists: Artist[] = [
  // ─── VERIFIED / PARTIAL ───────────────────────────────────────────────────

  {
    id: 'matthieu-schaeffer',
    slug: 'matthieu-schaeffer',
    name: 'Matthieu Schaeffer',
    nationality: 'French',
    birthYear: '1998',
    birthPlace: 'France',
    location: 'Lives and works in Paris and South-West France',
    bio: 'Matthieu Schaeffer (b. 1998, France) is a French painter whose practice centres on hyperrealistic depictions of animals set against or integrated with everyday ceramic and plastic objects. Working from direct observation and photographic reference, he builds images of striking technical precision that invite reflection on materiality, coexistence, and the uncanny proximity between the natural and the manufactured.',
    statement: '',
    image: '/images/artists/matthieu-schaeffer.jpg',
    medium: 'Painting',
    region: 'Europe',
    works: [],
    cv: {
      exhibitions: [
        { title: 'Salon d\'Automne — Jeune Créateur', venue: 'Salon d\'Automne', city: 'Paris', year: '2024', type: 'group' },
        { title: 'Group Exhibition', venue: 'Cohle Gallery', city: 'Paris', year: '2024', type: 'group' },
        { title: 'Group Exhibition', venue: 'Vin\'s Gallery', city: 'France', year: '2024', type: 'group' },
      ],
      fairs: [],
      residencies: [],
      awards: [],
      collections: [],
      press: [],
    },
    availability: 'emerging',
    contentStatus: 'partial',
    sourceNote: 'public 2026',
  },

  {
    id: 'renee-le-bloas-julienne',
    slug: 'renee-le-bloas-julienne',
    name: 'Renée Le Bloas-Julienne',
    nationality: 'French',
    location: 'Lives and works in France',
    bio: 'Renée Le Bloas-Julienne is a French artist with approximately fifteen years of painting practice and seven years devoted to resin. Working as what she describes as a "petit chimiste", she combines epoxy resins with pigments, powders, and inclusions to build luminous, layered surfaces that exploit the unique depth and reflective qualities of the medium. Her work explores how material process can generate images that exceed the painter\'s initial intentions.',
    statement: '',
    image: '/images/artists/renee-le-bloas-julienne.jpg',
    medium: 'Resin',
    region: 'Europe',
    works: [],
    cv: emptyCV,
    availability: 'emerging',
    contentStatus: 'partial',
    sourceNote: 'public 2026',
  },

  {
    id: 'carlos-romano',
    slug: 'carlos-romano',
    name: 'Carlos Romano',
    nationality: 'Spanish',
    birthPlace: 'Spain',
    location: 'Lives and works in Madrid',
    bio: 'Carlos Romano is a Spanish painter based in Madrid whose practice treats painting as a form of research and philosophical enquiry. His work departs from autobiographical experience to interrogate the tension between reality and fiction, seeking to "rename" the world through pictorial means. Each canvas functions as an open question rather than a resolved statement, proposing new perceptual and conceptual frameworks for familiar subjects.',
    statement: '',
    image: '/images/artists/carlos-romano.jpg',
    medium: 'Painting',
    region: 'Europe',
    works: [],
    cv: {
      exhibitions: [
        { title: 'Exhibition', venue: 'Gallery', city: 'Madrid', year: '', type: 'solo' },
        { title: 'Exhibition', venue: 'Gallery', city: 'Mexico', year: '', type: 'group' },
      ],
      fairs: [
        { name: 'Asia Hotel Art Fair', city: 'Hong Kong', year: '' },
        { name: 'Salon Art Shopping', city: 'Paris', year: '', gallery: 'Louvre' },
      ],
      residencies: [],
      awards: [],
      collections: [],
      press: [],
    },
    availability: 'emerging',
    contentStatus: 'partial',
    sourceNote: 'public 2026',
  },

  {
    id: 'rebekka-macht',
    slug: 'rebekka-macht',
    name: 'Rebekka Macht',
    nationality: 'German',
    location: 'Lives and works between Accra and Berlin',
    bio: 'Rebekka Macht is a German painter based between Accra and Berlin. Her large-format portrait paintings engage with questions of gender, masculinity, and (single) motherhood, foregrounding figures who are rarely centred in dominant visual narratives. Trained in portrait painting in Essen, her work is held in the Soho House collection and has been presented internationally in institutional contexts.',
    statement: '',
    image: '/images/artists/rebekka-macht.jpg',
    medium: 'Painting',
    region: 'Africa',
    works: [],
    cv: {
      exhibitions: [
        {
          title: 'Fragile Wings of Motherhood',
          venue: 'Gallery 1957',
          city: 'Accra',
          year: '',
          type: 'group',
        },
      ],
      fairs: [],
      residencies: [],
      awards: [],
      collections: ['Soho House Collection'],
      press: [],
    },
    availability: 'emerging',
    contentStatus: 'partial',
    sourceNote: 'public 2026',
  },

  {
    id: 'halee-roth',
    slug: 'halee-roth',
    name: 'Halee Roth',
    nationality: 'American',
    birthPlace: 'Utah, USA',
    location: 'Lives and works in Utah',
    bio: 'Halee Roth is an American figurative painter based in Utah. She holds a BFA from Utah State University and pursued additional studies in Germany. Her paintings are invested in the themes of hope and the resilience of the human spirit, rendered through carefully composed figurative scenes that balance tenderness with psychological weight. Her work has been featured in Beautiful Bizarre Magazine and the Utah arts publication 15 Bytes.',
    statement: '',
    image: '/images/artists/halee-roth.jpg',
    medium: 'Painting',
    region: 'Americas',
    works: [],
    cv: {
      exhibitions: [],
      fairs: [],
      residencies: [],
      awards: [],
      collections: [],
      press: [
        { title: 'Issue 51', publication: 'Beautiful Bizarre Magazine', year: '2025' },
        { title: 'Feature', publication: '15 Bytes', year: '' },
      ],
    },
    availability: 'emerging',
    contentStatus: 'partial',
    sourceNote: 'public 2026',
  },

  {
    id: 'qha-ma-na-nde',
    slug: 'qha-ma-na-nde',
    name: 'Qha-ma-na-nde',
    nationality: 'South African',
    birthYear: '1991',
    birthPlace: 'South Africa',
    location: 'Lives and works in Johannesburg',
    bio: 'Qha-ma-na-nde (b. 1991, South Africa) is a Johannesburg-based painter whose practice is anchored in portraiture suffused with distinctive purple hues. Educated at Lovedale College and the University of Fort Hare, their work investigates questions of identity, memory, and the politics of visibility. They have collaborated with David Krut Workshop and participated in the Brooklyn Fine Art Print Fair.',
    statement: '',
    image: '/images/artists/qha-ma-na-nde.jpg',
    medium: 'Painting',
    region: 'Africa',
    works: [],
    cv: {
      exhibitions: [],
      fairs: [
        { name: 'Brooklyn Fine Art Print Fair', city: 'New York', year: '2025', gallery: 'David Krut Workshop' },
      ],
      residencies: [],
      awards: [],
      collections: [],
      press: [],
    },
    availability: 'emerging',
    contentStatus: 'partial',
    sourceNote: 'public 2026',
  },

  {
    id: 'tatiana-gorgievski',
    slug: 'tatiana-gorgievski',
    name: 'Tatiana Gorgievski',
    nationality: 'French',
    birthYear: '1997',
    birthPlace: 'Paris, France',
    location: 'Lives and works in Paris',
    bio: 'Tatiana Gorgievski (b. 1997, Paris) is a French painter who trained in philosophy at the ENS Lyon before pursuing painting at ENSAV La Cambre in Brussels. This dual formation inflects a practice attuned to questions of perception, image-making, and the construction of meaning. Represented by Whitehouse Gallery, her work has been presented at NADA New York and Art Brussels, and she has undertaken residencies at La Brea and the Moonens Foundation.',
    statement: '',
    image: '/images/artists/tatiana-gorgievski.jpg',
    medium: 'Painting',
    region: 'Europe',
    works: [],
    cv: {
      exhibitions: [],
      fairs: [
        { name: 'NADA New York', city: 'New York', year: '', gallery: 'Whitehouse Gallery' },
        { name: 'Art Brussels', city: 'Brussels', year: '', gallery: 'Whitehouse Gallery' },
      ],
      residencies: [
        { name: 'La Brea', city: 'France', year: '' },
        { name: 'Moonens Foundation', city: 'Belgium', year: '' },
      ],
      awards: [],
      collections: [],
      press: [],
    },
    availability: 'represented',
    contentStatus: 'partial',
    sourceNote: 'public 2026',
  },

  {
    id: 'owen-rival',
    slug: 'owen-rival',
    name: 'Owen Rival',
    nationality: 'Canadian',
    birthYear: '1999',
    birthPlace: 'Toronto, Canada',
    location: 'Lives and works in Toronto',
    bio: 'Owen Rival (b. 1999, Toronto) is a Canadian figurative painter who studied at the Rhode Island School of Design (RISD). His paintings explore domestic scenes and the textures of everyday life, lending intimacy and quiet attention to overlooked interiors and figures. He is represented by Monti8 (Italy) and his work has been featured in It\'s Nice That and Juliet Art Magazine.',
    statement: '',
    image: '/images/artists/owen-rival.jpg',
    medium: 'Painting',
    region: 'Americas',
    works: [],
    cv: {
      exhibitions: [],
      fairs: [],
      residencies: [],
      awards: [],
      collections: [],
      press: [
        { title: 'Feature', publication: 'It\'s Nice That', year: '' },
        { title: 'Feature', publication: 'Juliet Art Magazine', year: '' },
      ],
    },
    availability: 'represented',
    contentStatus: 'partial',
    sourceNote: 'public 2026',
  },

  {
    id: 'richard-mensah',
    slug: 'richard-mensah',
    name: 'Richard Mensah',
    nationality: 'Ghanaian',
    birthYear: '1978',
    birthPlace: 'Ghana',
    location: 'Lives and works in London',
    bio: 'Richard Mensah (b. 1978, Ghana) is a self-taught Ghanaian painter based in London. After resuming painting around 2016, he has developed a distinctive mixed-media practice incorporating gold leaf into figurative and gestural compositions. His work engages with themes of heritage, migration, and luminosity, and was presented in the exhibition "Fluid Movement" at Coningsby Gallery in London.',
    statement: '',
    image: '/images/artists/richard-mensah.jpg',
    medium: 'Mixed Media',
    region: 'Africa',
    works: [],
    cv: {
      exhibitions: [
        { title: 'Fluid Movement', venue: 'Coningsby Gallery', city: 'London', year: '', type: 'group' },
      ],
      fairs: [],
      residencies: [],
      awards: [],
      collections: [],
      press: [],
    },
    availability: 'emerging',
    contentStatus: 'partial',
    sourceNote: 'public 2026',
  },

  {
    id: 'ewa-gora',
    slug: 'ewa-gora',
    name: 'Ewa Gora',
    nationality: 'Polish',
    location: 'Lives and works in Poland',
    bio: 'Profile in preparation.',
    statement: '',
    image: '/images/artists/placeholder.jpg',
    medium: 'Painting',
    region: 'Europe',
    works: [],
    cv: emptyCV,
    availability: 'emerging',
    contentStatus: 'coming-soon',
    sourceNote: 'Instagram @goraewa',
  },

  // ─── COMING SOON ──────────────────────────────────────────────────────────

  {
    id: 'jake-wood-evans',
    slug: 'jake-wood-evans',
    name: 'Jake Wood-Evans',
    nationality: 'British',
    location: '',
    bio: 'Profile in preparation.',
    statement: '',
    image: '/images/artists/placeholder.jpg',
    medium: 'Painting',
    region: 'Europe',
    works: [],
    cv: emptyCV,
    availability: 'emerging',
    contentStatus: 'coming-soon',
  },

  {
    id: 'phoebe-boswell',
    slug: 'phoebe-boswell',
    name: 'Phoebe Boswell',
    nationality: 'British-Kenyan',
    location: '',
    bio: 'Profile in preparation.',
    statement: '',
    image: '/images/artists/placeholder.jpg',
    medium: 'Mixed Media',
    region: 'Europe',
    works: [],
    cv: emptyCV,
    availability: 'emerging',
    contentStatus: 'coming-soon',
  },

  {
    id: 'lanise-howard',
    slug: 'lanise-howard',
    name: 'Lanise Howard',
    nationality: 'American',
    location: '',
    bio: 'Profile in preparation.',
    statement: '',
    image: '/images/artists/placeholder.jpg',
    medium: 'Painting',
    region: 'Americas',
    works: [],
    cv: emptyCV,
    availability: 'emerging',
    contentStatus: 'coming-soon',
  },

  {
    id: 'bao-vuong',
    slug: 'bao-vuong',
    name: 'Bao Vuong',
    nationality: 'Franco-Vietnamese',
    location: '',
    bio: 'Profile in preparation.',
    statement: '',
    image: '/images/artists/placeholder.jpg',
    medium: 'Painting',
    region: 'Asia',
    works: [],
    cv: emptyCV,
    availability: 'emerging',
    contentStatus: 'coming-soon',
  },

  {
    id: 'otis-quaicoe',
    slug: 'otis-quaicoe',
    name: 'Otis Quaicoe',
    nationality: 'Ghanaian',
    location: '',
    bio: 'Profile in preparation.',
    statement: '',
    image: '/images/artists/placeholder.jpg',
    medium: 'Painting',
    region: 'Africa',
    works: [],
    cv: emptyCV,
    availability: 'emerging',
    contentStatus: 'coming-soon',
  },

  {
    id: 'maku-azu',
    slug: 'maku-azu',
    name: 'Maku Azu',
    nationality: 'Ghanaian',
    location: '',
    bio: 'Profile in preparation.',
    statement: '',
    image: '/images/artists/placeholder.jpg',
    medium: 'Painting',
    region: 'Africa',
    works: [],
    cv: emptyCV,
    availability: 'emerging',
    contentStatus: 'coming-soon',
  },

  {
    id: 'vanessa-raw',
    slug: 'vanessa-raw',
    name: 'Vanessa Raw',
    nationality: 'British',
    location: '',
    bio: 'Profile in preparation.',
    statement: '',
    image: '/images/artists/placeholder.jpg',
    medium: 'Painting',
    region: 'Europe',
    works: [],
    cv: emptyCV,
    availability: 'emerging',
    contentStatus: 'coming-soon',
  },
];

// ─── HELPERS ────────────────────────────────────────────────────────────────

export function getArtistById(id: string): Artist | undefined {
  return artists.find((artist) => artist.id === id);
}

export function getArtistBySlug(slug: string): Artist | undefined {
  return artists.find((artist) => artist.slug === slug);
}

export function getAllArtistIds(): string[] {
  return artists.map((artist) => artist.id);
}

export function getArtists(): Artist[] {
  return artists;
}

export function getFilteredArtists(medium?: string, region?: string): Artist[] {
  return artists.filter((artist) => {
    const matchesMedium = medium ? artist.medium === medium : true;
    const matchesRegion = region ? artist.region === region : true;
    return matchesMedium && matchesRegion;
  });
}
