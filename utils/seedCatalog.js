import CatalogItem from '../models/CatalogItem.js';

export const initialCatalogData = [
  // 1. Furniture Manufacturers & Dealers
  {
    name: 'Nordic Tufted Corduroy Armless Sofa',
    clientCategory: 'Furniture Manufacturers & Dealers',
    objectCategory: 'Sofa',
    imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1200&auto=format&fit=crop',
    description: 'Ergonomic modular sectional sofa upholstered in plush ribbed corduroy fabric with high-density acoustic cushioning.',
    brand: 'Joss & Main',
    price: '$1,299',
    section: 'catalog'
  },
  {
    name: 'Japandi Low-Profile Platform Bed',
    clientCategory: 'Furniture Manufacturers & Dealers',
    objectCategory: 'Bed',
    imageUrl: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1200&auto=format&fit=crop',
    description: 'Minimalist solid white ash timber platform frame with integrated floating side ledges and headboard.',
    brand: 'IKEA',
    price: '$899',
    section: 'catalog'
  },
  {
    name: 'Fluted Smoked Oak Dining Table',
    clientCategory: 'Furniture Manufacturers & Dealers',
    objectCategory: 'Dining Table',
    imageUrl: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?q=80&w=1200&auto=format&fit=crop',
    description: 'Sculptural oval dining table featuring tambour ribbed pedestal bases and solid wood top.',
    brand: 'Wayfair',
    price: '$1,450',
    section: 'catalog'
  },
  {
    name: 'Bouclé Upholstered Curved Dining Chair',
    clientCategory: 'Furniture Manufacturers & Dealers',
    objectCategory: 'Dining Chair',
    imageUrl: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=1200&auto=format&fit=crop',
    description: 'Curved silhouette dining chair with ivory bouclé tactile fabric and matte bronze metal legs.',
    brand: 'CB2',
    price: '$320',
    section: 'catalog'
  },
  {
    name: 'Brushed Travertine Block Coffee Table',
    clientCategory: 'Furniture Manufacturers & Dealers',
    objectCategory: 'Coffee Table',
    imageUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200&auto=format&fit=crop',
    description: 'Organic raw honed travertine marble low coffee block with soft pillared edges.',
    brand: 'West Elm',
    price: '$780',
    section: 'catalog'
  },
  {
    name: 'Architectural Slatted Media TV Console',
    clientCategory: 'Furniture Manufacturers & Dealers',
    objectCategory: 'TV Unit',
    imageUrl: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=1200&auto=format&fit=crop',
    description: 'Floating or floor-standing TV credenza featuring acoustic wooden slat front doors and cord management.',
    brand: 'Article',
    price: '$950',
    section: 'catalog'
  },
  {
    name: 'HEMNES 8-Drawer Solid Wood Wardrobe',
    clientCategory: 'Furniture Manufacturers & Dealers',
    objectCategory: 'Wardrobe',
    imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop',
    description: 'Handcrafted pine armoire with full-length clothes rail and soft-closing drawer glides.',
    brand: 'IKEA',
    price: '$1,100',
    section: 'catalog'
  },
  {
    name: 'Cognac Grain Leather Recliner Lounge',
    clientCategory: 'Furniture Manufacturers & Dealers',
    objectCategory: 'Recliner',
    imageUrl: 'https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?q=80&w=1200&auto=format&fit=crop',
    description: 'Top-grain aniline cognac leather swivel lounge armchair with power headrest tilt.',
    brand: 'La-Z-Boy',
    price: '$1,599',
    section: 'catalog'
  },
  {
    name: 'Floor-to-Ceiling Modular Bookshelf',
    clientCategory: 'Furniture Manufacturers & Dealers',
    objectCategory: 'Bookshelf',
    imageUrl: 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?q=80&w=1200&auto=format&fit=crop',
    description: 'Open-grid steel and oak shelving system designed for architectural display and library collections.',
    brand: 'Design Within Reach',
    price: '$1,850',
    section: 'catalog'
  },
  {
    name: 'Sculptural Ceramic Side Table',
    clientCategory: 'Furniture Manufacturers & Dealers',
    objectCategory: 'Side Table',
    imageUrl: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=1200&auto=format&fit=crop',
    description: 'Hand-thrown terracotta glaze accent side pedestal table for modern lounge corners.',
    brand: 'Crate & Barrel',
    price: '$240',
    section: 'catalog'
  },

  // 2. Interior Design Companies & Designers
  {
    name: 'Curved Bouclé Lounge Salon Sofa',
    clientCategory: 'Interior Design Companies & Designers',
    objectCategory: 'Sofa',
    imageUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200&auto=format&fit=crop',
    description: 'Custom organic crescent lounge sofa tailored for luxury residential spatial layouts.',
    brand: 'Studio AURA',
    price: '$3,400',
    section: 'catalog'
  },
  {
    name: 'Custom Sheer Belgian Linen Curtains',
    clientCategory: 'Interior Design Companies & Designers',
    objectCategory: 'Curtains',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop',
    description: 'Floor-to-ceiling sheer linen window drapes with concealed ceiling track system.',
    brand: 'Kravet Couture',
    price: '$850',
    section: 'catalog'
  },
  {
    name: 'Botanical Limewash Mural Wallpaper',
    clientCategory: 'Interior Design Companies & Designers',
    objectCategory: 'Wallpaper',
    imageUrl: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=1200&auto=format&fit=crop',
    description: 'Textured non-woven fibrous wallcovering featuring subtle biophilic watercolor botanical artwork.',
    brand: 'Pierre Frey',
    price: '$420',
    section: 'catalog'
  },
  {
    name: 'Acoustic Cove False Ceiling Cove',
    clientCategory: 'Interior Design Companies & Designers',
    objectCategory: 'False Ceiling',
    imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop',
    description: 'Seamless gyproc false ceiling system with perimeter warm LED cove drop illumination.',
    brand: 'Gyproc Architectural',
    price: '$2,200',
    section: 'catalog'
  },
  {
    name: 'Acoustic Tambour Timber Wall Panel',
    clientCategory: 'Interior Design Companies & Designers',
    objectCategory: 'Wall Panel',
    imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop',
    description: 'Real wood slat wall panelling with recycled felt soundproofing backing.',
    brand: 'AcuWood',
    price: '$650',
    section: 'catalog'
  },
  {
    name: 'Wide-Plank Brushed European Oak Flooring',
    clientCategory: 'Interior Design Companies & Designers',
    objectCategory: 'Flooring',
    imageUrl: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?q=80&w=1200&auto=format&fit=crop',
    description: 'Engineered 220mm extra-wide hardwood flooring with matte UV oil protective finish.',
    brand: 'Havwoods',
    price: '$18 / sq ft',
    section: 'catalog'
  },
  {
    name: 'Sculptural Brass Ceiling Chandelier',
    clientCategory: 'Interior Design Companies & Designers',
    objectCategory: 'Lighting',
    imageUrl: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?q=80&w=1200&auto=format&fit=crop',
    description: 'Hand-blown opaline glass globes suspended from aged antique brass armatures.',
    brand: 'Flos Lighting',
    price: '$1,890',
    section: 'catalog'
  },
  {
    name: 'Handwoven Wool Abstract Area Rug',
    clientCategory: 'Interior Design Companies & Designers',
    objectCategory: 'Rug',
    imageUrl: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?q=80&w=1200&auto=format&fit=crop',
    description: 'Hand-tufted New Zealand wool area rug with high-low cut pile organic geometry.',
    brand: 'Nordic Knots',
    price: '$1,150',
    section: 'catalog'
  },
  {
    name: 'Minimalist Plaster Relief Artwork',
    clientCategory: 'Interior Design Companies & Designers',
    objectCategory: 'Artwork',
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200&auto=format&fit=crop',
    description: 'Framed 3D tactile plaster sculpture on linen canvas in champagne floater frame.',
    brand: 'Atelier AURA',
    price: '$790',
    section: 'catalog'
  },
  {
    name: 'Arch Convex Decorative Wall Mirror',
    clientCategory: 'Interior Design Companies & Designers',
    objectCategory: 'Decorative Mirror',
    imageUrl: 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?q=80&w=1200&auto=format&fit=crop',
    description: 'Solid brass arched vanity mirror with bevelled distortion-free glass reflector.',
    brand: 'Menu Copenhagen',
    price: '$480',
    section: 'catalog'
  },

  // 3. Real Estate Developers & Builders
  {
    name: 'Penthouse Custom Italian Sofa',
    clientCategory: 'Real Estate Developers & Builders',
    objectCategory: 'Sofa',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
    description: 'High-density modular seating specified for model home luxury living suites.',
    brand: 'Poliform Spec',
    price: '$4,200',
    section: 'catalog'
  },
  {
    name: 'Model Suite King Upholstered Bed',
    clientCategory: 'Real Estate Developers & Builders',
    objectCategory: 'Bed',
    imageUrl: 'https://images.unsplash.com/photo-1540518614846-7ede433c4550?q=80&w=1200&auto=format&fit=crop',
    description: 'Floor-to-ceiling padded headboard bed unit with integrated LED nightstands.',
    brand: 'Builder Spec',
    price: '$1,800',
    section: 'catalog'
  },
  {
    name: 'Turnkey Quartz Modular Kitchen Package',
    clientCategory: 'Real Estate Developers & Builders',
    objectCategory: 'Modular Kitchen',
    imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1200&auto=format&fit=crop',
    description: 'Complete high-pressure laminate kitchen layout with quartz waterfall counter.',
    brand: 'Developer Line',
    price: '$8,500',
    section: 'catalog'
  },
  {
    name: 'Integrated Master Walk-in Wardrobe',
    clientCategory: 'Real Estate Developers & Builders',
    objectCategory: 'Wardrobe',
    imageUrl: 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?q=80&w=1200&auto=format&fit=crop',
    description: 'Built-in floor-to-ceiling melamine wardrobe cabinetry with sensor LED glass drawers.',
    brand: 'Builder Spec',
    price: '$3,200',
    section: 'catalog'
  },
  {
    name: 'Executive 8-Seater Marble Dining Table',
    clientCategory: 'Real Estate Developers & Builders',
    objectCategory: 'Dining Table',
    imageUrl: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?q=80&w=1200&auto=format&fit=crop',
    description: 'Nero Marquina black marble dining table with matte black powder-coated legs.',
    brand: 'Luxury Residences',
    price: '$2,900',
    section: 'catalog'
  },
  {
    name: 'Built-in Fireplace TV Wall Console',
    clientCategory: 'Real Estate Developers & Builders',
    objectCategory: 'TV Unit',
    imageUrl: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1200&auto=format&fit=crop',
    description: 'Linear electric water-vapor fireplace unit integrated into porcelain slab media wall.',
    brand: 'Developer Line',
    price: '$3,800',
    section: 'catalog'
  },
  {
    name: 'Double Sink Floating Bathroom Vanity',
    clientCategory: 'Real Estate Developers & Builders',
    objectCategory: 'Bathroom Vanity',
    imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1200&auto=format&fit=crop',
    description: 'Wall-hung smoked oak vanity with integrated undermount porcelain basins.',
    brand: 'Kohler Spec',
    price: '$1,650',
    section: 'catalog'
  },
  {
    name: 'Herringbone Engineered Oak Flooring',
    clientCategory: 'Real Estate Developers & Builders',
    objectCategory: 'Flooring',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop',
    description: 'Classic French herringbone pattern hardwood flooring for luxury apartment towers.',
    brand: 'Parquet Pro',
    price: '$14 / sq ft',
    section: 'catalog'
  },
  {
    name: 'Recessed Architectural Ceiling Grid',
    clientCategory: 'Real Estate Developers & Builders',
    objectCategory: 'Ceiling Design',
    imageUrl: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?q=80&w=1200&auto=format&fit=crop',
    description: 'Double-drop architectural coffered ceiling design with magnetic light tracks.',
    brand: 'Builder Spec',
    price: '$1,900',
    section: 'catalog'
  },
  {
    name: 'Weatherproof Teak Balcony Lounge Set',
    clientCategory: 'Real Estate Developers & Builders',
    objectCategory: 'Balcony Furniture',
    imageUrl: 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?q=80&w=1200&auto=format&fit=crop',
    description: 'Grade-A teak outdoor armchairs with Sunbrella outdoor quick-dry cushions.',
    brand: 'Rove Concepts',
    price: '$1,350',
    section: 'catalog'
  },

  // 4. Home Décor, Tiles & Flooring Brands
  {
    name: 'Calacatta Gold Polished Porcelain Floor Tiles',
    clientCategory: 'Home Décor, Tiles & Flooring Brands',
    objectCategory: 'Floor Tiles',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
    description: 'Large-format 120x60cm rectified porcelain tiles with gold veining aesthetic.',
    brand: 'Marazzi',
    price: '$8.50 / sq ft',
    section: 'catalog'
  },
  {
    name: 'Zellige Handmade Glazed Ceramic Wall Tiles',
    clientCategory: 'Home Décor, Tiles & Flooring Brands',
    objectCategory: 'Wall Tiles',
    imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1200&auto=format&fit=crop',
    description: 'Artisanal Moroccan-style square wall tiles with irregular reflective glazed surface.',
    brand: 'Clé Tile',
    price: '$16.00 / sq ft',
    section: 'catalog'
  },
  {
    name: 'Carrara White Italian Marble Slab',
    clientCategory: 'Home Décor, Tiles & Flooring Brands',
    objectCategory: 'Marble',
    imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1200&auto=format&fit=crop',
    description: 'Authentic Italian Carrara marble slab for vanity tops, floors, and accent walls.',
    brand: 'Stone Source',
    price: '$45 / sq ft',
    section: 'catalog'
  },
  {
    name: 'Wire-Brushed Smoked Oak Wooden Flooring',
    clientCategory: 'Home Décor, Tiles & Flooring Brands',
    objectCategory: 'Wooden Flooring',
    imageUrl: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?q=80&w=1200&auto=format&fit=crop',
    description: 'Multi-ply engineered oak wood planks with wire-brushed natural texture.',
    brand: 'Quick-Step',
    price: '$11.50 / sq ft',
    section: 'catalog'
  },
  {
    name: 'Textured Mineral Linen Wallpaper Roll',
    clientCategory: 'Home Décor, Tiles & Flooring Brands',
    objectCategory: 'Wallpaper',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop',
    description: 'Heavyweight washable vinyl wallpaper with natural woven linen texture.',
    brand: 'Phillip Jeffries',
    price: '$140 / roll',
    section: 'catalog'
  },
  {
    name: 'Fluted Acoustic Charcoal Wall Panel',
    clientCategory: 'Home Décor, Tiles & Flooring Brands',
    objectCategory: 'Wall Panels',
    imageUrl: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?q=80&w=1200&auto=format&fit=crop',
    description: 'Graphite matte slatted acoustic wall panel kit for sound absorbing feature walls.',
    brand: 'WoodUpp',
    price: '$210 / panel',
    section: 'catalog'
  },
  {
    name: 'Organic Shape Tufted Wool Rug',
    clientCategory: 'Home Décor, Tiles & Flooring Brands',
    objectCategory: 'Rugs',
    imageUrl: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?q=80&w=1200&auto=format&fit=crop',
    description: 'Asymmetrical hand-knotted wool rug in ivory and taupe earth shades.',
    brand: 'Lulu & Georgia',
    price: '$890',
    section: 'catalog'
  },
  {
    name: 'Blackout Velvet Thermal Curtains',
    clientCategory: 'Home Décor, Tiles & Flooring Brands',
    objectCategory: 'Curtains',
    imageUrl: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=1200&auto=format&fit=crop',
    description: 'Velvety matte blackout drape panels providing noise isolation and thermal control.',
    brand: 'Pottery Barn',
    price: '$340 / pair',
    section: 'catalog'
  },
  {
    name: 'Pendant Smoked Glass Decorative Light',
    clientCategory: 'Home Décor, Tiles & Flooring Brands',
    objectCategory: 'Decorative Lights',
    imageUrl: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?q=80&w=1200&auto=format&fit=crop',
    description: 'Handcrafted glass dome pendant lamp with warm filaments.',
    brand: 'Muuto',
    price: '$390',
    section: 'catalog'
  },
  {
    name: 'Pill Shaped LED Backlit Vanity Mirror',
    clientCategory: 'Home Décor, Tiles & Flooring Brands',
    objectCategory: 'Mirrors',
    imageUrl: 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?q=80&w=1200&auto=format&fit=crop',
    description: 'Frameless pill-shaped wall mirror with integrated dimmable perimeter illumination.',
    brand: 'AURA Lighting',
    price: '$520',
    section: 'catalog'
  },

  // 5. Modular Kitchen & Wardrobe Companies
  {
    name: 'Matte Charcoal Handleless Kitchen Cabinets',
    clientCategory: 'Modular Kitchen & Wardrobe Companies',
    objectCategory: 'Kitchen Cabinets',
    imageUrl: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=1200&auto=format&fit=crop',
    description: 'Anti-fingerprint matte black cabinetry with integrated soft-touch tip-on opening.',
    brand: 'Nobilia',
    price: '$6,800',
    section: 'catalog'
  },
  {
    name: 'Waterfall Quartz Island Counter',
    clientCategory: 'Modular Kitchen & Wardrobe Companies',
    objectCategory: 'Island Counter',
    imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1200&auto=format&fit=crop',
    description: 'Engineered quartz waterfall island counter block with overhang breakfast seating bar.',
    brand: 'Caesarstone',
    price: '$3,500',
    section: 'catalog'
  },
  {
    name: 'Fluted Glass Lift-up Overhead Cabinets',
    clientCategory: 'Modular Kitchen & Wardrobe Companies',
    objectCategory: 'Overhead Cabinets',
    imageUrl: 'https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?q=80&w=1200&auto=format&fit=crop',
    description: 'Bi-fold electric lift overhead cabinets with smoked ribbed glass and interior LED lights.',
    brand: 'Hettich',
    price: '$2,100',
    section: 'catalog'
  },
  {
    name: 'Deep Soft-Closing Base Drawer Cabinets',
    clientCategory: 'Modular Kitchen & Wardrobe Companies',
    objectCategory: 'Base Cabinets',
    imageUrl: 'https://images.unsplash.com/photo-1565183997392-2f6f122e5912?q=80&w=1200&auto=format&fit=crop',
    description: 'Heavy-duty drawer runners supporting up to 70kg pan and pot storage.',
    brand: 'Blum Tandembox',
    price: '$1,950',
    section: 'catalog'
  },
  {
    name: 'Integrated Appliance Tall Unit',
    clientCategory: 'Modular Kitchen & Wardrobe Companies',
    objectCategory: 'Tall Unit',
    imageUrl: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=1200&auto=format&fit=crop',
    description: 'Full-height housing unit for built-in double oven, microwave, and warming drawer.',
    brand: 'Snaidero',
    price: '$2,800',
    section: 'catalog'
  },
  {
    name: 'Pull-out Multi-Layer Pantry Unit',
    clientCategory: 'Modular Kitchen & Wardrobe Companies',
    objectCategory: 'Pantry Unit',
    imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1200&auto=format&fit=crop',
    description: 'Heavy-duty steel wire pull-out larders with adjustable chrome basket heights.',
    brand: 'Kesseböhmer',
    price: '$1,400',
    section: 'catalog'
  },
  {
    name: 'Floor-to-Ceiling Smoked Glass Wardrobe',
    clientCategory: 'Modular Kitchen & Wardrobe Companies',
    objectCategory: 'Wardrobe',
    imageUrl: 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?q=80&w=1200&auto=format&fit=crop',
    description: 'Bronze anodized aluminum frame wardrobe with smoked glass doors and leather drawer inserts.',
    brand: 'Rimadesio',
    price: '$4,500',
    section: 'catalog'
  },
  {
    name: 'Concealed Track Sliding Wardrobe',
    clientCategory: 'Modular Kitchen & Wardrobe Companies',
    objectCategory: 'Sliding Wardrobe',
    imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop',
    description: 'Coplana soft-closing sliding doors with matte lacquer finish and integrated mirror panel.',
    brand: 'Poliform',
    price: '$3,900',
    section: 'catalog'
  },
  {
    name: 'Open-Grid Luxury Walk-in Wardrobe',
    clientCategory: 'Modular Kitchen & Wardrobe Companies',
    objectCategory: 'Walk-in Wardrobe',
    imageUrl: 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?q=80&w=1200&auto=format&fit=crop',
    description: 'Custom open dressing suite featuring central island watch drawer and shoe display racks.',
    brand: 'Molteni & C',
    price: '$7,200',
    section: 'catalog'
  },
  {
    name: 'Illuminated Dressing Table Vanity',
    clientCategory: 'Modular Kitchen & Wardrobe Companies',
    objectCategory: 'Dressing Table',
    imageUrl: 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?q=80&w=1200&auto=format&fit=crop',
    description: 'Wall-mounted vanity dressing table with velvet jewelry tray and touch mirror.',
    brand: 'Studio AURA',
    price: '$1,600',
    section: 'catalog'
  },

  // 6. Popular items tried by customers
  {
    name: 'Most Popular Tufted Sectional Sofa',
    clientCategory: 'Popular items tried by customers',
    objectCategory: 'Sofa',
    imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1200&auto=format&fit=crop',
    description: 'Top-rated modular sectional tried by over 500+ homeowners.',
    brand: 'Customer Favorite',
    price: '$1,299',
    section: 'catalog'
  },
  {
    name: 'Top Trending Velvet Platform Bed Suite',
    clientCategory: 'Popular items tried by customers',
    objectCategory: 'Bed',
    imageUrl: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1200&auto=format&fit=crop',
    description: 'Best-selling luxury platform bed with integrated soft ledges.',
    brand: 'Customer Favorite',
    price: '$899',
    section: 'catalog'
  },
  {
    name: 'Bestseller Solid Oak Dining Table',
    clientCategory: 'Popular items tried by customers',
    objectCategory: 'Dining Table',
    imageUrl: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?q=80&w=1200&auto=format&fit=crop',
    description: 'Customer preferred dining table with fluted pedestal legs.',
    brand: 'Customer Favorite',
    price: '$1,450',
    section: 'catalog'
  },
  {
    name: 'Trending Bouclé Accent Chair',
    clientCategory: 'Popular items tried by customers',
    objectCategory: 'Dining Chair',
    imageUrl: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=1200&auto=format&fit=crop',
    description: 'Highly reviewed tactile bouclé lounge dining chair.',
    brand: 'Customer Favorite',
    price: '$320',
    section: 'catalog'
  },
  {
    name: 'Customer Preferred Travertine Coffee Block',
    clientCategory: 'Popular items tried by customers',
    objectCategory: 'Coffee Table',
    imageUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200&auto=format&fit=crop',
    description: 'Natural travertine low coffee table featured in 100+ room redesigns.',
    brand: 'Customer Favorite',
    price: '$780',
    section: 'catalog'
  },
  {
    name: 'Top Rated Slatted Media TV Unit',
    clientCategory: 'Popular items tried by customers',
    objectCategory: 'Wardrobe',
    imageUrl: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=1200&auto=format&fit=crop',
    description: 'Acoustic slatted wood TV console chosen in spatial redesigns.',
    brand: 'Customer Favorite',
    price: '$950',
    section: 'catalog'
  }
];

let isSeedingInProgress = false;

export const ensureCatalogSeeded = async () => {
  if (isSeedingInProgress) return;
  try {
    isSeedingInProgress = true;
    const count = await CatalogItem.countDocuments({ section: 'catalog' });
    if (count === 0) {
      console.log('Seeding initial Catalog items for all client categories...');
      await CatalogItem.insertMany(initialCatalogData);
      console.log('Catalog items successfully seeded in database.');
    } else {
      // Check if Popular items category exists, if not insert seed popular items
      const popularCount = await CatalogItem.countDocuments({ clientCategory: 'Popular items tried by customers' });
      if (popularCount === 0) {
        const popularItems = initialCatalogData.filter(i => i.clientCategory === 'Popular items tried by customers');
        await CatalogItem.insertMany(popularItems);
        console.log('Seeded popular items category in database.');
      }
    }
  } catch (error) {
    console.warn('Note on Catalog seeding:', error.message);
  } finally {
    isSeedingInProgress = false;
  }
};
