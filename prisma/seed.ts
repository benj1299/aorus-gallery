import 'dotenv/config';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const adapter = new PrismaPg(pool as any);
const prisma = new PrismaClient({ adapter });

/** Wrap a string as a translatable JSON field */
const t = (en: string) => ({ en, fr: '', zh: '' });

const artistsData = [
  {
    slug: 'matthieu-scheiffer',
    name: 'Matthieu Scheiffer',
    nationality: t('French, b. 1998'),
    bio: t("Matthieu Scheiffer's practice revolves around hyperrealist paintings that explore the tension between nostalgia and ecology. Working between Paris and the South-West of France, his canvases capture everyday objects\u2014ceramic, plastic, discarded packaging\u2014with an almost photographic precision that transforms the mundane into the monumental. His work questions our relationship to consumer culture and environmental fragility through a lens of intimate familiarity."),
    imageUrl: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=600&q=80',
    sortOrder: 0,
    cvEntries: [
      { type: 'SOLO_SHOW' as const, title: 'Solo Exhibition, ORUS Gallery, Paris, 2025' },
      { type: 'GROUP_SHOW' as const, title: 'Group Show, French Hyperrealism Today, 2024' },
      { type: 'ART_FAIR' as const, title: 'Salon de Montrouge, 2023' },
    ],
    collections: ['Private Collections, France and Europe'],
  },
  {
    slug: 'renee-lebloas-julienne',
    name: 'Ren\u00e9e Lebloas-Julienne',
    nationality: t('French'),
    bio: t("Ren\u00e9e Lebloas-Julienne has developed a singular practice at the intersection of painting and resin over two decades. With approximately fifteen years of painting and seven years of resin work, her pieces investigate light and matter with an alchemical sensibility. Layers of translucent resin trap pigment and gesture, creating works that shift and breathe with changing light conditions\u2014simultaneously paintings and sculptural objects."),
    imageUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80',
    sortOrder: 1,
    cvEntries: [
      { type: 'SOLO_SHOW' as const, title: 'Solo Exhibition, ORUS Gallery, Paris, 2025' },
      { type: 'ART_FAIR' as const, title: 'Art Paris, Grand Palais, 2024' },
      { type: 'GROUP_SHOW' as const, title: 'Group Show, Light & Matter, Lyon, 2023' },
    ],
    collections: ['Private Collections, France and Asia'],
  },
  {
    slug: 'carlos-romano',
    name: 'Carlos Romano',
    nationality: t('Madrid'),
    bio: t("Carlos Romano's autobiographical paintings navigate the tension between reality and fiction. Working from his Madrid studio, his compositions oscillate between geometric precision and lyrical abstraction, constructing visual narratives that blur the boundaries of memory and invention. His palette is deliberately restrained, allowing form and gesture to carry the emotional weight of each piece."),
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=80',
    sortOrder: 2,
    cvEntries: [
      { type: 'SOLO_SHOW' as const, title: 'Solo Exhibition, ORUS Gallery, Paris, 2025' },
      { type: 'ART_FAIR' as const, title: 'ARCO Madrid, 2024' },
      { type: 'GROUP_SHOW' as const, title: 'Group Show, Contemporary Spanish Painting, 2023' },
    ],
    collections: ['Private Collections, Spain and Europe'],
  },
  {
    slug: 'rebekka-macht',
    name: 'Rebekka Macht',
    nationality: t('Accra / Berlin'),
    bio: t("Rebekka Macht creates large-format portraits that examine masculinity, maternity, and the complex territories of gender and human connection. Working between Accra and Berlin, her canvases command attention through their scale and the unflinching directness of her subjects' gazes. Her practice is rooted in a deep engagement with the communities she paints, resulting in portraits that feel both monumental and profoundly intimate."),
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80',
    sortOrder: 3,
    cvEntries: [
      { type: 'SOLO_SHOW' as const, title: 'Solo Exhibition, ORUS Gallery, Paris, 2025' },
      { type: 'GROUP_SHOW' as const, title: 'Dual Exhibition, Berlin & Accra, 2024' },
      { type: 'GROUP_SHOW' as const, title: 'International Group Show, Contemporary Portraiture, 2023' },
    ],
    collections: ['Private Collections, Europe and Africa'],
  },
  {
    slug: 'halee-roth',
    name: 'Halee Roth',
    nationality: t('American, Utah'),
    bio: t("Halee Roth's figurative paintings radiate with an unwavering belief in the human spirit. A graduate of Utah State University's BFA program, she uses color as light itself\u2014saturated, warm, and enveloping. Her subjects emerge from fields of chromatic intensity, captured in moments of quiet resilience and everyday grace. Her work insists on hope as a radical act."),
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&q=80',
    sortOrder: 4,
    cvEntries: [
      { type: 'SOLO_SHOW' as const, title: 'Solo Exhibition, ORUS Gallery, Paris, 2025' },
      { type: 'GROUP_SHOW' as const, title: 'BFA Thesis Exhibition, Utah State University, 2024' },
      { type: 'GROUP_SHOW' as const, title: 'Group Show, New American Figuration, 2023' },
    ],
    collections: ['Private Collections, United States and Europe'],
  },
  {
    slug: 'qha-ma-na-nde',
    name: 'Qha-ma-na-nde',
    nationality: t('South African, b. 1991'),
    bio: t("Qha-ma-na-nde's surrealist portraiture, rendered in a distinctive palette dominated by violet and deep purple, explores identity, spirituality, and the African diaspora experience. Based in Johannesburg, their work draws from traditional African symbolism and contemporary urban culture to create dreamlike compositions where figures float between worlds\u2014anchored in the real yet reaching toward the transcendent."),
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&q=80',
    sortOrder: 5,
    cvEntries: [
      { type: 'SOLO_SHOW' as const, title: 'Solo Exhibition, ORUS Gallery, Paris, 2025' },
      { type: 'ART_FAIR' as const, title: 'FNB Joburg Art Fair, 2024' },
      { type: 'ART_FAIR' as const, title: 'Pan-African Art Fair, Cape Town, 2023' },
    ],
    collections: ['Private Collections, Africa and Europe'],
  },
  {
    slug: 'ewa-gora',
    name: 'Ewa G\u00f3ra',
    nationality: t('Polish'),
    bio: t("Ewa G\u00f3ra's practice moves fluidly between landscape and abstraction, finding in the natural world a vocabulary for emotional and psychological states. Her canvases capture the atmospheric qualities of light, weather, and terrain with a sensitivity that transforms observation into meditation. Working with oils on large-scale surfaces, she builds layers that echo the geological processes of the landscapes she depicts."),
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&q=80',
    sortOrder: 6,
    cvEntries: [
      { type: 'SOLO_SHOW' as const, title: 'Solo Exhibition, ORUS Gallery, Paris, 2025' },
      { type: 'ART_FAIR' as const, title: 'Warsaw Gallery Weekend, 2024' },
      { type: 'GROUP_SHOW' as const, title: 'Group Show, European Landscape Now, 2023' },
    ],
    collections: ['Private Collections, Poland and Europe'],
  },
  {
    slug: 'richard-mensah',
    name: 'Richard Mensah',
    nationality: t('Ghanaian, b. 1978, London'),
    bio: t("Richard Mensah is a self-taught artist whose narrative paintings weave together African histories, personal mythology, and contemporary symbolism. Working from his London studio, he incorporates gold leaf, rich textiles, and layered imagery to create works of extraordinary visual density. Each painting functions as a palimpsest of cultural memory\u2014stories within stories that reward sustained attention and reveal new meanings over time."),
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
    sortOrder: 7,
    cvEntries: [
      { type: 'SOLO_SHOW' as const, title: 'Solo Exhibition, ORUS Gallery, Paris, 2025' },
      { type: 'GROUP_SHOW' as const, title: 'Group Show, Contemporary African Art Fair, London, 2024' },
      { type: 'ART_FAIR' as const, title: '1-54 Contemporary African Art Fair, 2023' },
    ],
    collections: ['Private Collections, Europe and Asia'],
  },
  {
    slug: 'owen-rival',
    name: 'Owen Rival',
    nationality: t('Canadian, b. 1999, Toronto'),
    bio: t("Owen Rival captures the textures of daily life through intensely saturated color and an unflinching attention to routine and anxiety. A RISD graduate working from Toronto, his paintings transform mundane domestic scenes\u2014a kitchen counter, a morning commute, a sleepless night\u2014into vibrant psychological portraits. His work speaks to a generation navigating the space between digital connectivity and physical isolation."),
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80',
    sortOrder: 8,
    cvEntries: [
      { type: 'SOLO_SHOW' as const, title: 'Solo Exhibition, ORUS Gallery, Paris, 2025' },
      { type: 'GROUP_SHOW' as const, title: 'RISD Graduate Exhibition, Providence, 2024' },
      { type: 'GROUP_SHOW' as const, title: 'Group Show, Young Canadian Painters, Toronto, 2023' },
    ],
    collections: ['Private Collections, Canada and Europe'],
  },
];

const artworkImages = [
  'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&q=80',
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&q=80',
  'https://images.unsplash.com/photo-1549289524-06cf8837ace5?w=600&q=80',
  'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=600&q=80',
];

const artworkTemplates = [
  { title: t('Untitled I'), medium: t('Oil on canvas'), dimensions: '120 x 90 cm', year: 2024, price: 4500 },
  { title: t('Untitled II'), medium: t('Oil on canvas'), dimensions: '80 x 60 cm', year: 2024, price: 3200 },
  { title: t('Series III'), medium: t('Mixed media on panel'), dimensions: '150 x 120 cm', year: 2025, price: 6800 },
  { title: t('Etude'), medium: t('Acrylic on paper'), dimensions: '40 x 30 cm', year: 2023, price: 1800 },
];

const pressArticles = [
  {
    slug: 'orus-gallery-opens-taipei',
    title: t('ORUS Gallery Opens New Space in Taipei'),
    publication: 'Artnet News',
    publishedAt: new Date('2025-01-15'),
    url: 'https://www.artnet.com',
    imageUrl: 'https://images.unsplash.com/photo-1577720643272-265f09367456?w=600&q=80',
    excerpt: t('The Franco-Taiwanese gallery ORUS opens its doors in Taipei, bridging contemporary European painting with the vibrant Asian art market.'),
  },
  {
    slug: 'emerging-voices-paris',
    title: t('Five Emerging Voices to Watch at ORUS Gallery'),
    publication: 'Hyperallergic',
    publishedAt: new Date('2025-03-01'),
    url: 'https://www.hyperallergic.com',
    imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&q=80',
    excerpt: t('A new generation of painters finds a home between Paris and Taipei, with ORUS Gallery championing emerging talent from across the globe.'),
  },
  {
    slug: 'art-collecting-asia',
    title: t('The Rise of Art Collecting in Asia: ORUS Gallery Perspective'),
    publication: 'The Art Newspaper',
    publishedAt: new Date('2024-11-20'),
    url: 'https://www.theartnewspaper.com',
    imageUrl: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=600&q=80',
    excerpt: t('As Asian collectors increasingly look westward, galleries like ORUS are building bridges that benefit artists and collectors on both continents.'),
  },
];

async function main() {
  console.log('Seeding database...');

  // 1. Seed artists
  let artworkCount = 0;
  for (const { cvEntries, collections, ...artistData } of artistsData) {
    const artist = await prisma.artist.upsert({
      where: { slug: artistData.slug },
      update: { ...artistData },
      create: {
        ...artistData,
        exhibitions: { create: cvEntries.map((entry, i) => ({ title: t(entry.title), type: entry.type, sortOrder: i })) },
        collections: { create: collections.map((title, i) => ({ title: t(title), sortOrder: i })) },
      },
    });

    // 2. Seed artworks (3 per artist, first 6 total are featured)
    const existingArtworks = await prisma.artwork.count({ where: { artistId: artist.id } });
    if (existingArtworks === 0) {
      for (let i = 0; i < 3; i++) {
        const tmpl = artworkTemplates[i % artworkTemplates.length];
        await prisma.artwork.create({
          data: {
            slug: `${artist.slug}-${tmpl.title.en.toLowerCase().replace(/\s+/g, '-')}`,
            artistId: artist.id,
            title: tmpl.title,
            medium: tmpl.medium,
            dimensions: tmpl.dimensions,
            year: tmpl.year,
            price: tmpl.price,
            currency: 'EUR',
            imageUrl: artworkImages[i % artworkImages.length],
            sortOrder: i,
            featuredHome: artworkCount < 6 && i === 0,
            showPrice: artworkCount % 3 === 0,
          },
        });
        artworkCount++;
      }
    }

    console.log(`  Artist: ${artist.name} (+ artworks)`);
  }

  // 3. Seed press articles
  for (const article of pressArticles) {
    await prisma.pressArticle.upsert({
      where: { slug: article.slug },
      update: article,
      create: { ...article, sortOrder: 0 },
    });
    console.log(`  Press: ${article.title.en}`);
  }

  console.log('\nSeed completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
