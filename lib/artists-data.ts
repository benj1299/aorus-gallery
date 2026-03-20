// Artists data from ORUS Gallery - 9 represented artists
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
    id: 'matthieu-scheiffer',
    name: 'Matthieu Scheiffer',
    nationality: 'French, b. 1998',
    bio: "Matthieu Scheiffer's practice revolves around hyperrealist paintings that explore the tension between nostalgia and ecology. Working between Paris and the South-West of France, his canvases capture everyday objects\u2014ceramic, plastic, discarded packaging\u2014with an almost photographic precision that transforms the mundane into the monumental. His work questions our relationship to consumer culture and environmental fragility through a lens of intimate familiarity.",
    image: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=600&q=80',
    cv: {
      exhibitions: [
        'Solo Exhibition, ORUS Gallery, Paris, 2025',
        'Group Show, French Hyperrealism Today, 2024',
        'Salon de Montrouge, 2023',
      ],
      collections: ['Private Collections, France and Europe'],
    },
  },
  {
    id: 'renee-lebloas-julienne',
    name: 'Ren\u00e9e Lebloas-Julienne',
    nationality: 'French',
    bio: "Ren\u00e9e Lebloas-Julienne has developed a singular practice at the intersection of painting and resin over two decades. With approximately fifteen years of painting and seven years of resin work, her pieces investigate light and matter with an alchemical sensibility. Layers of translucent resin trap pigment and gesture, creating works that shift and breathe with changing light conditions\u2014simultaneously paintings and sculptural objects.",
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80',
    cv: {
      exhibitions: [
        'Solo Exhibition, ORUS Gallery, Paris, 2025',
        'Art Paris, Grand Palais, 2024',
        'Group Show, Light & Matter, Lyon, 2023',
      ],
      collections: ['Private Collections, France and Asia'],
    },
  },
  {
    id: 'carlos-romano',
    name: 'Carlos Romano',
    nationality: 'Madrid',
    bio: "Carlos Romano's autobiographical paintings navigate the tension between reality and fiction. Working from his Madrid studio, his compositions oscillate between geometric precision and lyrical abstraction, constructing visual narratives that blur the boundaries of memory and invention. His palette is deliberately restrained, allowing form and gesture to carry the emotional weight of each piece.",
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=80',
    cv: {
      exhibitions: [
        'Solo Exhibition, ORUS Gallery, Paris, 2025',
        'ARCO Madrid, 2024',
        'Group Show, Contemporary Spanish Painting, 2023',
      ],
      collections: ['Private Collections, Spain and Europe'],
    },
  },
  {
    id: 'rebekka-macht',
    name: 'Rebekka Macht',
    nationality: 'Accra / Berlin',
    bio: "Rebekka Macht creates large-format portraits that examine masculinity, maternity, and the complex territories of gender and human connection. Working between Accra and Berlin, her canvases command attention through their scale and the unflinching directness of her subjects' gazes. Her practice is rooted in a deep engagement with the communities she paints, resulting in portraits that feel both monumental and profoundly intimate.",
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80',
    cv: {
      exhibitions: [
        'Solo Exhibition, ORUS Gallery, Paris, 2025',
        'Dual Exhibition, Berlin & Accra, 2024',
        'International Group Show, Contemporary Portraiture, 2023',
      ],
      collections: ['Private Collections, Europe and Africa'],
    },
  },
  {
    id: 'halee-roth',
    name: 'Halee Roth',
    nationality: 'American, Utah',
    bio: "Halee Roth's figurative paintings radiate with an unwavering belief in the human spirit. A graduate of Utah State University's BFA program, she uses color as light itself\u2014saturated, warm, and enveloping. Her subjects emerge from fields of chromatic intensity, captured in moments of quiet resilience and everyday grace. Her work insists on hope as a radical act.",
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&q=80',
    cv: {
      exhibitions: [
        'Solo Exhibition, ORUS Gallery, Paris, 2025',
        'BFA Thesis Exhibition, Utah State University, 2024',
        'Group Show, New American Figuration, 2023',
      ],
      collections: ['Private Collections, United States and Europe'],
    },
  },
  {
    id: 'qha-ma-na-nde',
    name: 'Qha-ma-na-nde',
    nationality: 'South African, b. 1991',
    bio: "Qha-ma-na-nde's surrealist portraiture, rendered in a distinctive palette dominated by violet and deep purple, explores identity, spirituality, and the African diaspora experience. Based in Johannesburg, their work draws from traditional African symbolism and contemporary urban culture to create dreamlike compositions where figures float between worlds\u2014anchored in the real yet reaching toward the transcendent.",
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&q=80',
    cv: {
      exhibitions: [
        'Solo Exhibition, ORUS Gallery, Paris, 2025',
        'FNB Joburg Art Fair, 2024',
        'Pan-African Art Fair, Cape Town, 2023',
      ],
      collections: ['Private Collections, Africa and Europe'],
    },
  },
  {
    id: 'ewa-gora',
    name: 'Ewa G\u00f3ra',
    nationality: 'Polish',
    bio: "Ewa G\u00f3ra's practice moves fluidly between landscape and abstraction, finding in the natural world a vocabulary for emotional and psychological states. Her canvases capture the atmospheric qualities of light, weather, and terrain with a sensitivity that transforms observation into meditation. Working with oils on large-scale surfaces, she builds layers that echo the geological processes of the landscapes she depicts.",
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&q=80',
    cv: {
      exhibitions: [
        'Solo Exhibition, ORUS Gallery, Paris, 2025',
        'Warsaw Gallery Weekend, 2024',
        'Group Show, European Landscape Now, 2023',
      ],
      collections: ['Private Collections, Poland and Europe'],
    },
  },
  {
    id: 'richard-mensah',
    name: 'Richard Mensah',
    nationality: 'Ghanaian, b. 1978, London',
    bio: "Richard Mensah is a self-taught artist whose narrative paintings weave together African histories, personal mythology, and contemporary symbolism. Working from his London studio, he incorporates gold leaf, rich textiles, and layered imagery to create works of extraordinary visual density. Each painting functions as a palimpsest of cultural memory\u2014stories within stories that reward sustained attention and reveal new meanings over time.",
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
    cv: {
      exhibitions: [
        'Solo Exhibition, ORUS Gallery, Paris, 2025',
        'Group Show, Contemporary African Art Fair, London, 2024',
        '1-54 Contemporary African Art Fair, 2023',
      ],
      collections: ['Private Collections, Europe and Asia'],
    },
  },
  {
    id: 'owen-rival',
    name: 'Owen Rival',
    nationality: 'Canadian, b. 1999, Toronto',
    bio: "Owen Rival captures the textures of daily life through intensely saturated color and an unflinching attention to routine and anxiety. A RISD graduate working from Toronto, his paintings transform mundane domestic scenes\u2014a kitchen counter, a morning commute, a sleepless night\u2014into vibrant psychological portraits. His work speaks to a generation navigating the space between digital connectivity and physical isolation.",
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80',
    cv: {
      exhibitions: [
        'Solo Exhibition, ORUS Gallery, Paris, 2025',
        'RISD Graduate Exhibition, Providence, 2024',
        'Group Show, Young Canadian Painters, Toronto, 2023',
      ],
      collections: ['Private Collections, Canada and Europe'],
    },
  },
];

export function getArtistById(id: string): Artist | undefined {
  return artists.find((artist) => artist.id === id);
}

export function getAllArtistIds(): string[] {
  return artists.map((artist) => artist.id);
}
