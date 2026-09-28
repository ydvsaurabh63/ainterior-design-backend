import RoomDesign from '../models/RoomDesign.js';

export const initialRoomDesigns = [
  // Bedroom Designs
  {
    title: 'Nordic Japandi Master Suite',
    description: 'Minimalist low-profile platform bed with warm fluted timber slat panels and soft neutral linen textures.',
    category: 'bedroom',
    imageUrl: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1200&auto=format&fit=crop',
    order: 1
  },
  {
    title: 'Contemporary Parisian Bedroom',
    description: 'Haussmann-inspired wall moldings, herringbone parquet flooring, and tailored bouclé upholstery.',
    category: 'bedroom',
    imageUrl: 'https://images.unsplash.com/photo-1540518614846-7ede433c4550?q=80&w=1200&auto=format&fit=crop',
    order: 2
  },
  {
    title: 'Warm Minimalist Loft Suite',
    description: 'Earthy travertine bedside pedestals, concealed cove illumination, and layered raw linen bedding.',
    category: 'bedroom',
    imageUrl: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=1200&auto=format&fit=crop',
    order: 3
  },
  {
    title: 'Serene Monochrome Sanctuary',
    description: 'Tone-on-tone ivory acoustics, curved upholstered headboard, and ambient bronze wall sconces.',
    category: 'bedroom',
    imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop',
    order: 4
  },
  {
    title: 'Earthy Walnut Bedroom Retreat',
    description: 'Smoked oak cabinetry, floor-to-ceiling sheer drapery, and artisanal ceramic pendant lighting.',
    category: 'bedroom',
    imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1200&auto=format&fit=crop',
    order: 5
  },

  // Living Room Designs
  {
    title: 'Curved Bouclé Lounge Concept',
    description: 'Organic curved sofa seating paired with brushed travertine cocktail tables and ribbed bronze accents.',
    category: 'living-room',
    imageUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200&auto=format&fit=crop',
    order: 1
  },
  {
    title: 'Architectural Sunlit Living Hall',
    description: 'Double-height cathedral glass windows with low-slung Italian modular seating and architectural stone fire surround.',
    category: 'living-room',
    imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop',
    order: 2
  },
  {
    title: 'Mid-Century Sculptural Salon',
    description: 'Hand-finished walnut woodwork, cognac leather lounge armchairs, and floor-to-ceiling architectural library.',
    category: 'living-room',
    imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1200&auto=format&fit=crop',
    order: 3
  },
  {
    title: 'Wabi-Sabi Organic Living Space',
    description: 'Microcement flooring, raw lime-wash walls, reclaimed oak coffee block, and handwoven wool area rug.',
    category: 'living-room',
    imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop',
    order: 4
  },
  {
    title: 'Modern Penthouse Living Room',
    description: 'Sleek dark marble feature wall, integrated linear fireplace, and panoramic floor-to-ceiling city views.',
    category: 'living-room',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
    order: 5
  },

  // Kitchen Designs
  {
    title: 'Calacatta Marble Culinary Island',
    description: 'Seamless bookmatched Calacatta marble waterfall island with fluted smoked oak joinery and concealed induction cooktop.',
    category: 'kitchen',
    imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1200&auto=format&fit=crop',
    order: 1
  },
  {
    title: 'Matte Charcoal & Brass Chef Kitchen',
    description: 'Fingerprint-resistant soft-touch black cabinetry, antique brass unlacquered hardware, and fluted glass showcase cabinets.',
    category: 'kitchen',
    imageUrl: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=1200&auto=format&fit=crop',
    order: 2
  },
  {
    title: 'Scandinavian Scandi-Wood Kitchen',
    description: 'Light European ash cabinetry, terrazzo engineered countertops, and integrated handleless recessed pulls.',
    category: 'kitchen',
    imageUrl: 'https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?q=80&w=1200&auto=format&fit=crop',
    order: 3
  },
  {
    title: 'Warm Sage Green Country Modern Kitchen',
    description: 'Deep matte sage shaker profile cabinetry, quartzite worktops, and farmhouse refractory ceramic sink.',
    category: 'kitchen',
    imageUrl: 'https://images.unsplash.com/photo-1565183997392-2f6f122e5912?q=80&w=1200&auto=format&fit=crop',
    order: 4
  },
  {
    title: 'Minimalist Microcement Monolith Kitchen',
    description: 'Continuous microcement kitchen counter block, concealed pocket doors, and minimalist architectural linear downlights.',
    category: 'kitchen',
    imageUrl: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1200&auto=format&fit=crop',
    order: 5
  },

  // Wall Paint Colors Designs
  {
    title: 'Limewash Oatmeal & Warm Sand',
    description: 'Textured mineral limewash in gentle oatmeal tones creating subtle light-reflecting depth and organic movement.',
    category: 'wall-paint-colors',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop',
    order: 1
  },
  {
    title: 'Muted Architectural Olive & Sage',
    description: 'Sophisticated matte botanical sage green providing biophilic calm and timeless contrast against wood accents.',
    category: 'wall-paint-colors',
    imageUrl: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=1200&auto=format&fit=crop',
    order: 2
  },
  {
    title: 'Moody Terracotta & Desert Ochre',
    description: 'Rich velvety terracotta clay finish that adds intimate warmth, earthy richness, and artisanal character.',
    category: 'wall-paint-colors',
    imageUrl: 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?q=80&w=1200&auto=format&fit=crop',
    order: 3
  },
  {
    title: 'Nordic Mineral Slate Grey',
    description: 'Ultra-matte graphite and slate mineral pigment for dramatic accent zones, media alcoves, and moody studies.',
    category: 'wall-paint-colors',
    imageUrl: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?q=80&w=1200&auto=format&fit=crop',
    order: 4
  },
  {
    title: 'Warm Alabaster & Chalk White',
    description: 'Timeless architectural warm white with subtle yellow-grey undertones that enhances natural daylight without clinical glare.',
    category: 'wall-paint-colors',
    imageUrl: 'https://images.unsplash.com/photo-1502005229762-ee1b2da97ba4?q=80&w=1200&auto=format&fit=crop',
    order: 5
  }
];

let isSeedingInProgress = false;

/**
 * Ensures initial high-res room design assets are seeded in MongoDB
 */
export const ensureRoomDesignsSeeded = async () => {
  if (isSeedingInProgress) return;

  try {
    isSeedingInProgress = true;
    const count = await RoomDesign.countDocuments();
    if (count === 0) {
      console.log('Seeding initial room designs for DECORE UR ROOM WITHOUT BUY IT...');
      await RoomDesign.insertMany(initialRoomDesigns);
      console.log('Room designs successfully seeded in database.');
    }
  } catch (error) {
    console.warn('Note on room design seeding:', error.message);
  } finally {
    isSeedingInProgress = false;
  }
};
