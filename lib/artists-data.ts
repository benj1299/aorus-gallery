// Artists data from ORUS Gallery - 17 represented artists
export interface Artist {
  id: string;
  name: string;
  nationality: string;
  bio: string;
  image: string;
  cv: {
    exhibitions: string[];
    collections: string[];
  };
}

export const artists: Artist[] = [
  {
    id: 'richard-mensah',
    name: 'Richard Mensah',
    nationality: 'Ghana / London',
    bio: 'Richard Mensah is a Ghanaian-British artist whose work explores themes of diaspora, identity, and cultural memory. Working primarily in painting and mixed media, Mensah creates vibrant compositions that bridge African and European visual traditions.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
    cv: {
      exhibitions: ['Solo Exhibition, ORUS Gallery, 2024', 'Group Show, Contemporary African Art Fair, 2023'],
      collections: ['Private Collections, Europe and Asia'],
    },
  },
  {
    id: 'jake-wood-evans',
    name: 'Jake Wood-Evans',
    nationality: 'British',
    bio: 'Jake Wood-Evans is a British painter known for his reinterpretations of Old Master paintings. His work deconstructs classical compositions through gestural abstraction, creating haunting dialogues between historical and contemporary art.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80',
    cv: {
      exhibitions: ['Solo Exhibition, London, 2024', 'International Art Fair, 2023'],
      collections: ['Private Collections Worldwide'],
    },
  },
  {
    id: 'phoebe-boswell',
    name: 'Phoebe Boswell',
    nationality: 'Multidisciplinary',
    bio: 'Phoebe Boswell is a multidisciplinary artist working across drawing, animation, sound, and installation. Her practice investigates themes of displacement, belonging, and the complexities of diasporic existence.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80',
    cv: {
      exhibitions: ['Major Institution Exhibition, 2024', 'International Biennial, 2023'],
      collections: ['Museum Collections, Private Collections'],
    },
  },
  {
    id: 'renee-leblois-julienne',
    name: 'Renee Leblois-Julienne',
    nationality: 'French',
    bio: 'Renee Leblois-Julienne is a French artist whose paintings explore the intersection of memory and landscape. Her atmospheric works capture fleeting moments of light and emotion with a distinctly European sensibility.',
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80',
    cv: {
      exhibitions: ['Solo Exhibition, Paris, 2024', 'Group Show, French Contemporary, 2023'],
      collections: ['Private Collections, France and Asia'],
    },
  },
  {
    id: 'rebekka-macht',
    name: 'Rebekka Macht',
    nationality: 'Germany / Ghana',
    bio: 'Rebekka Macht is a German-Ghanaian artist whose work bridges two cultural worlds. Her paintings explore themes of identity, heritage, and the complexities of belonging across continents.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80',
    cv: {
      exhibitions: ['Dual Exhibition, Berlin & Accra, 2024', 'International Group Show, 2023'],
      collections: ['Private Collections, Europe and Africa'],
    },
  },
  {
    id: 'lanise-howard',
    name: 'Lanise Howard',
    nationality: 'American',
    bio: 'Lanise Howard is an American painter known for her intimate portraits and figurative works. Her practice examines themes of Black identity, beauty, and the politics of representation.',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&q=80',
    cv: {
      exhibitions: ['Solo Exhibition, New York, 2024', 'Group Show, Contemporary Portraiture, 2023'],
      collections: ['Private Collections, United States'],
    },
  },
  {
    id: 'qha-ma-na-nde',
    name: 'Qha-ma-na-nde',
    nationality: 'South African',
    bio: 'Qha-ma-na-nde is a South African artist whose work explores African spirituality, ancestral memory, and contemporary identity. Their practice spans painting, sculpture, and installation.',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&q=80',
    cv: {
      exhibitions: ['Solo Exhibition, Johannesburg, 2024', 'Pan-African Art Fair, 2023'],
      collections: ['Private Collections, Africa and Europe'],
    },
  },
  {
    id: 'bao-vuong',
    name: 'Bao Vuong',
    nationality: 'Franco-Vietnamese',
    bio: 'Bao Vuong is a Franco-Vietnamese artist whose paintings explore themes of cultural hybridity and diaspora. His work bridges Eastern and Western artistic traditions through a contemporary lens.',
    image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&q=80',
    cv: {
      exhibitions: ['Solo Exhibition, Paris, 2024', 'Asian Contemporary Art Fair, 2023'],
      collections: ['Private Collections, France and Vietnam'],
    },
  },
  {
    id: 'otis-quaicoe',
    name: 'Otis Quaicoe',
    nationality: 'Ghanaian',
    bio: 'Otis Quaicoe is a Ghanaian artist known for his powerful portraits that celebrate Black identity and beauty. His work has gained international recognition for its bold approach to figurative painting.',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&q=80',
    cv: {
      exhibitions: ['Major Gallery Exhibition, 2024', 'International Art Fair, 2023'],
      collections: ['Museum Collections, Private Collections Worldwide'],
    },
  },
  {
    id: 'maku-azu',
    name: 'Maku Azu',
    nationality: 'Ghana',
    bio: 'Maku Azu is a Ghanaian artist whose work explores themes of memory, tradition, and contemporary African identity. Her practice encompasses painting, textiles, and installation.',
    image: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=600&q=80',
    cv: {
      exhibitions: ['Solo Exhibition, Accra, 2024', 'African Art Platform, 2023'],
      collections: ['Private Collections, Ghana and Europe'],
    },
  },
  {
    id: 'vanessa-raw',
    name: 'Vanessa Raw',
    nationality: 'British',
    bio: 'Vanessa Raw is a British artist whose expressive paintings capture moments of human connection and emotion. Her gestural approach creates dynamic compositions that resonate with viewers.',
    image: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600&q=80',
    cv: {
      exhibitions: ['Solo Exhibition, London, 2024', 'Contemporary British Art, 2023'],
      collections: ['Private Collections, United Kingdom'],
    },
  },
  {
    id: 'carlos-romano',
    name: 'Carlos Romano',
    nationality: 'London',
    bio: 'Carlos Romano is a London-based artist whose work explores urban life and contemporary culture. His paintings capture the energy and diversity of modern metropolitan existence.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=80',
    cv: {
      exhibitions: ['Solo Exhibition, London, 2024', 'Urban Contemporary, 2023'],
      collections: ['Private Collections, Europe'],
    },
  },
  {
    id: 'matthieu-scheiffer',
    name: 'Matthieu Scheiffer',
    nationality: 'French',
    bio: 'Matthieu Scheiffer is a French artist whose work explores the boundaries between abstraction and figuration. His paintings create atmospheric spaces that invite contemplation and introspection.',
    image: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=600&q=80',
    cv: {
      exhibitions: ['Solo Exhibition, Paris, 2024', 'French Contemporary, 2023'],
      collections: ['Private Collections, France'],
    },
  },
  {
    id: 'halee-roth',
    name: 'Halee Roth',
    nationality: 'American',
    bio: 'Halee Roth is an American artist known for her evocative paintings that explore themes of memory, nostalgia, and the passage of time. Her work captures fleeting moments with poetic sensitivity.',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&q=80',
    cv: {
      exhibitions: ['Solo Exhibition, New York, 2024', 'American Contemporary, 2023'],
      collections: ['Private Collections, United States'],
    },
  },
  {
    id: 'ewa-gora',
    name: 'Ewa Gora',
    nationality: 'Polish',
    bio: 'Ewa Gora is a Polish artist whose paintings explore themes of femininity, identity, and the human form. Her work combines classical techniques with contemporary sensibilities.',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&q=80',
    cv: {
      exhibitions: ['Solo Exhibition, Warsaw, 2024', 'European Contemporary, 2023'],
      collections: ['Private Collections, Poland and Europe'],
    },
  },
  {
    id: 'tatiana-gorgievski',
    name: 'Tatiana Gorgievski',
    nationality: 'International',
    bio: 'Tatiana Gorgievski is an international artist whose work transcends geographical boundaries. Her practice explores themes of globalization, identity, and cross-cultural dialogue.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&q=80',
    cv: {
      exhibitions: ['International Exhibition, 2024', 'Global Contemporary, 2023'],
      collections: ['Private Collections Worldwide'],
    },
  },
  {
    id: 'owen-rival',
    name: 'Owen Rival',
    nationality: 'French',
    bio: 'Owen Rival is a French artist whose work explores the relationship between humanity and nature. His paintings capture landscapes and figures with a distinctive poetic vision.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80',
    cv: {
      exhibitions: ['Solo Exhibition, Paris, 2024', 'French Landscape, 2023'],
      collections: ['Private Collections, France and Asia'],
    },
  },
];

export function getArtistById(id: string): Artist | undefined {
  return artists.find((artist) => artist.id === id);
}

export function getAllArtistIds(): string[] {
  return artists.map((artist) => artist.id);
}
