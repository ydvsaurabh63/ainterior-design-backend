import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from '../models/Admin.js';
import Project from '../models/Project.js';
import Enquiry from '../models/Enquiry.js';
import Testimonial from '../models/Testimonial.js';

dotenv.config();

const sampleProjects = [
  // LIVING ROOM (4 Projects)
  {
    title: 'The Serene Japandi Haven',
    slug: 'the-serene-japandi-haven',
    category: 'living-room',
    location: 'Bandra West, Mumbai',
    area: '650 sq.ft',
    style: 'Japandi Minimalism',
    description: 'A harmonious blend of Japanese wabi-sabi simplicity and Scandinavian functionality. Features low-profile bespoke oak joinery, limewash walls, textured boucle seating, and diffused natural lighting through fluted sheer curtains.',
    materials: ['Natural White Oak', 'Limewash Plaster', 'Boucle Fabric', 'Travertine Stone', 'Brushed Brass'],
    mainImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: true
  },
  {
    title: 'Villa Lumière Salon',
    slug: 'villa-lumiere-salon',
    category: 'living-room',
    location: 'Jubilee Hills, Hyderabad',
    area: '820 sq.ft',
    style: 'Modern Parisian Luxury',
    description: 'Intricate classic wall moldings juxtaposed against ultra-contemporary Italian sculptural furniture. Grounded by a solid Calacatta marble fireplace and a statement cascading bronze chandelier.',
    materials: ['Calacatta Viola Marble', 'Chevron Oak Parquet', 'Velvet Upholstery', 'Antiqued Bronze', 'Handblown Glass'],
    mainImage: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1600&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: true
  },
  {
    title: 'Earth & Clay Lounge',
    slug: 'earth-and-clay-lounge',
    category: 'living-room',
    location: 'Koramangala, Bengaluru',
    area: '540 sq.ft',
    style: 'Warm Organic Modern',
    description: 'Earthy terracotta accents paired with smooth microcement flooring and oversized linen sofas. Designed to create a relaxed sanctuary for mindful entertaining and quiet reflection.',
    materials: ['Microcement Floor', 'Terracotta Tiles', 'Belgian Linen', 'Reclaimed Teak', 'Blackened Steel'],
    mainImage: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1600&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1618219740975-d40978bb7378?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: false
  },
  {
    title: 'Skyline Panorama Living',
    slug: 'skyline-panorama-living',
    category: 'living-room',
    location: 'Worli Sea Face, Mumbai',
    area: '900 sq.ft',
    style: 'Contemporary High-End',
    description: 'Curved architectural sofas positioned to frame floor-to-ceiling oceanic views. Hidden smart home automation and bespoke fluted walnut acoustic wall panels.',
    materials: ['Fluted Walnut', 'Nubuck Leather', 'Grey Silk Georgette Marble', 'Architectural Recessed Lighting'],
    mainImage: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1600&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: false
  },

  // BEDROOM (4 Projects)
  {
    title: 'The Cloud Sanctuary Master Suite',
    slug: 'the-cloud-sanctuary-master-suite',
    category: 'bedroom',
    location: 'Alipore, Kolkata',
    area: '480 sq.ft',
    style: 'Quiet Luxury',
    description: 'A cocoon-like primary bedroom wrapped in cashmere-toned padded wall panels, floating headboard with ambient backlit lighting, and a tailored walk-in glass wardrobe.',
    materials: ['Cashmere Wool Fabric', 'Smoked Eucalyptus Wood', 'Brushed Bronze Trim', 'Plush Silk Wool Rug'],
    mainImage: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1600&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: true
  },
  {
    title: 'Minimalist Wabi Suite',
    slug: 'minimalist-wabi-suite',
    category: 'bedroom',
    location: 'Indiranagar, Bengaluru',
    area: '420 sq.ft',
    style: 'Warm Wabi-Sabi',
    description: 'Platform bed crafted from solid distressed cedar, textured clay wall finishes, concealed wardrobe panels, and organic raw linen bedding.',
    materials: ['Cedar Wood', 'Textured Clay Plaster', 'Raw Linen', 'Blackened Iron Sconces'],
    mainImage: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1600&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: false
  },
  {
    title: 'Emerald & Brass Executive Bedroom',
    slug: 'emerald-and-brass-executive-bedroom',
    category: 'bedroom',
    location: 'Golf Links, New Delhi',
    area: '520 sq.ft',
    style: 'Art Deco Neo-Classical',
    description: 'Deep forest green velvet headboard rising to ceiling height, flanked by satin brass sconces and book-matched walnut nightstands with marble inlays.',
    materials: ['Emerald Velvet', 'Satin Brass', 'Walnut Burl', 'Nero Marquina Marble'],
    mainImage: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1600&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: true
  },
  {
    title: 'Sunlit Coastal Guest Chamber',
    slug: 'sunlit-coastal-guest-chamber',
    category: 'bedroom',
    location: 'Candolim, Goa',
    area: '380 sq.ft',
    style: 'Coastal Mediterranean',
    description: 'Arched alcoves, woven cane cabinetry, washed white timber beams, and soft sand-colored textiles that capture the sea breeze.',
    materials: ['Natural Cane Rattan', 'Bleached Oak', 'Limestone', 'Cotton Slub'],
    mainImage: 'https://images.unsplash.com/photo-1578898887932-dce23a595ad4?auto=format&fit=crop&w=1600&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1578898887932-dce23a595ad4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: false
  },

  // KITCHEN (4 Projects)
  {
    title: 'Monolithic Travertine Culinary Space',
    slug: 'monolithic-travertine-culinary-space',
    category: 'kitchen',
    location: 'Vasant Vihar, New Delhi',
    area: '360 sq.ft',
    style: 'Modern Monolithic',
    description: 'A striking 14-foot waterfall kitchen island carved from fluted Roman travertine. Handleless matte oak cabinetry with integrated Gaggenau appliances and custom bronze tapware.',
    materials: ['Roman Travertine', 'Fumed Oak Veneer', 'Gunmetal Hardware', 'Dekton Worktops'],
    mainImage: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1600&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: true
  },
  {
    title: 'Charcoal & Quartz Chef Atelier',
    slug: 'charcoal-and-quartz-chef-atelier',
    category: 'kitchen',
    location: 'Juhu, Mumbai',
    area: '420 sq.ft',
    style: 'Industrial Luxe',
    description: 'Matte charcoal cabinetry paired with striking Calacatta Gold quartz countertops. Features a concealed prep pantry, illuminated spice display, and wine preservation cooler.',
    materials: ['Super-Matte Anti-fingerprint Laminate', 'Calacatta Gold Quartz', 'Smoked Glass', 'Aged Copper'],
    mainImage: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1600&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: false
  },
  {
    title: 'Nordic Light Island Kitchen',
    slug: 'nordic-light-island-kitchen',
    category: 'kitchen',
    location: 'Whitefield, Bengaluru',
    area: '310 sq.ft',
    style: 'Scandinavian Contemporary',
    description: 'Light birch plywood and pure white Corian surfaces designed for effortless daily flow. Abundant drawer organizers, recessed LED profile lights, and breakfast bar seating.',
    materials: ['Birch Ply', 'Corian Solid Surface', 'Ceramic Zellige Tiles', 'Anodized Aluminum'],
    mainImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1600&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1556909211-36987daf7b4d?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: true
  },
  {
    title: 'Heritage Brass Country Kitchen',
    slug: 'heritage-brass-country-kitchen',
    category: 'kitchen',
    location: 'Sadashivanagar, Bengaluru',
    area: '390 sq.ft',
    style: 'Modern Classic Shaker',
    description: 'Sage green shaker cabinets adorned with knurled brass hardware, Belfast sink, butcher block breakfast counter, and fluted glass showcase cupboards.',
    materials: ['Hand-Painted Solid Ash', 'Honed Carrara Marble', 'Knurled Solid Brass', 'End-grain Teak Block'],
    mainImage: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=1600&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: false
  },

  // FULL HOME (4 Projects)
  {
    title: 'The Solstice Penthouse 4BHK',
    slug: 'the-solstice-penthouse-4bhk',
    category: 'full-home',
    location: 'Prabhadevi, Mumbai',
    area: '4,200 sq.ft',
    style: 'Modern Minimal Luxury',
    description: 'A complete transformation of a duplex penthouse spanning living, formal dining, master suite, children study, bar lounge, and panoramic rooftop deck. Unified with a coherent neutral tonal palette and architectural curve details.',
    materials: ['Italian Statuario Marble', 'American Walnut', 'Venetian Plaster', 'Fluted Glass', 'Bronze Metal Accents'],
    mainImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: true
  },
  {
    title: 'Aura Modernist Villa',
    slug: 'aura-modernist-villa',
    category: 'full-home',
    location: 'Assagao, Goa',
    area: '5,600 sq.ft',
    style: 'Tropical Brutalism & Luxe',
    description: 'An expansive 5-bedroom luxury holiday home blending raw board-formed concrete walls, teak lattice screens, indoor courtyard with tropical water body, and curated bespoke mid-century furnishings.',
    materials: ['Board-Marked Concrete', 'Burmese Teak', 'Kota Stone', 'Linen Gauze', 'Handmade Brass Lighting'],
    mainImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: true
  },
  {
    title: 'The Arches Urban 3BHK Residence',
    slug: 'the-arches-urban-3bhk-residence',
    category: 'full-home',
    location: 'Sector 42, Gurugram',
    area: '2,850 sq.ft',
    style: 'Neo-Classical Contemporary',
    description: 'Designed around sculptural archways that gently transition between living, dining, and private bedrooms. Features rich chevron flooring, custom fluted millwork, and warm diffused architectural illumination.',
    materials: ['Smoked Oak Parquet', 'Limewash Paint', 'Calacatta Gold', 'Brushed Champagne Gold'],
    mainImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: false
  },
  {
    title: 'The Botanica Serenity Estate',
    slug: 'the-botanica-serenity-estate',
    category: 'full-home',
    location: 'Lavelle Road, Bengaluru',
    area: '6,100 sq.ft',
    style: 'Organic Biophilic Luxury',
    description: 'Complete interior architecture for a 4-level home centered around a vertical plant wall and skylight atrium. Seamless indoor-outdoor flow connecting all master rooms to lush private terraces.',
    materials: ['Travertine Slabs', 'Thermal Treated Pine', 'Textured Clay Plaster', 'Cast Bronze'],
    mainImage: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: false
  },

  // FURNITURE (2 Projects)
  {
    title: 'Sculptural Travertine & Teak Credenza',
    slug: 'sculptural-travertine-teak-credenza',
    category: 'furniture',
    location: 'Worli, Mumbai',
    area: 'Custom Joinery',
    style: 'Bespoke Sculptural Craft',
    description: 'A monolithic bespoke credenza marrying fluted Roman travertine stone legs with reclaimed solid Burma teak cabinetry and concealed push-touch soft-close mechanisms.',
    materials: ['Reclaimed Burma Teak', 'Roman Travertine', 'Brushed Champagne Gold Hardware'],
    mainImage: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1600&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: true
  },
  {
    title: 'Curvilinear Bouclé Lounge & Coffee Ensemble',
    slug: 'curvilinear-boucle-lounge-ensemble',
    category: 'furniture',
    location: 'Indiranagar, Bengaluru',
    area: 'Living Ensemble',
    style: 'Organic Modern Luxury',
    description: 'Organic curved armchairs wrapped in textured cream bouclé fabric paired with an asymmetrical dark walnut nesting coffee table ensemble.',
    materials: ['Textured Cream Bouclé', 'Dark Walnut Solid Wood', 'Smoked Bronze Base'],
    mainImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1600&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1200&q=80'
    ],
    featured: true
  }
];

const sampleTestimonials = [
  {
    name: 'Aanya & Siddharth Mehta',
    role: 'Homeowners, 4BHK Penthouse Mumbai',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    rating: 5,
    review: 'From the initial conceptualization to the final styling, the studio transformed our bare penthouse into a serene architectural masterpiece. Their dedication to subtle details, lighting and custom textures exceeded all our expectations.'
  },
  {
    name: 'Vikram Singhania',
    role: 'Villa Owner, Assagao Goa',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    rating: 5,
    review: 'The team managed our 5,600 sq.ft villa renovation end-to-end with extraordinary finesse. They adhered strictly to schedules, procured rare stone slabs, and delivered a timeless home that feels like a 5-star private retreat.'
  },
  {
    name: 'Dr. Radhika Sen',
    role: 'Apartment Owner, Bengaluru',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    rating: 5,
    review: 'Our Japandi living room and modular kitchen design are a dream. The space feels twice as large, incredibly tranquil, and deeply functional. I receive compliments from every guest who steps in!'
  },
  {
    name: 'Rohan & Priya Kapoor',
    role: '3BHK Residence, New Delhi',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    rating: 5,
    review: 'The studio’s material palette and custom joinery are world-class. They listened to our daily lifestyle routines and crafted a home that is both ultra-luxurious and wonderfully livable.'
  }
];

const sampleEnquiries = [
  {
    name: 'Kabir Malhotra',
    phone: '+91 98201 45678',
    email: 'kabir.m@gmail.com',
    city: 'Mumbai',
    propertyType: '3 BHK',
    budget: '₹25L - ₹40L',
    message: 'Looking for a full interior transformation of our new 3BHK flat in Worli. Interested in Japandi minimalism and smart storage solutions.',
    status: 'New'
  },
  {
    name: 'Ananya Sharma',
    phone: '+91 99100 23456',
    email: 'ananya.sharma@yahoo.com',
    city: 'Bengaluru',
    propertyType: 'Villa',
    budget: '₹50L - ₹1 Cr',
    message: 'We have recently acquired a 4-bedroom villa in Sarjapur. We want end-to-end design including kitchen, living area, and master suite.',
    status: 'Contacted'
  },
  {
    name: 'Rajesh Nair',
    phone: '+91 98450 11223',
    email: 'rajesh.nair@outlook.com',
    city: 'Hyderabad',
    propertyType: '2 BHK',
    budget: '₹15L - ₹25L',
    message: 'Need complete modular kitchen and living room makeover. Please share consultation slot for next Saturday.',
    status: 'Closed'
  }
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/interior_design';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing collections
    await Admin.deleteMany({});
    await Project.deleteMany({});
    await Testimonial.deleteMany({});
    await Enquiry.deleteMany({});
    console.log('Cleared existing data.');

    // Seed Superadmin, Admin & Client accounts
    const superadmin = new Admin({
      name: 'Studio Chief Superadmin',
      email: 'superadmin@studio.com',
      password: 'admin123',
      role: 'superadmin',
      phone: '+91 99999 11111'
    });
    await superadmin.save();

    const admin = new Admin({
      name: 'Studio Principal Admin',
      email: 'admin@studio.com',
      password: 'admin123',
      role: 'admin',
      phone: '+91 98888 22222'
    });
    await admin.save();

    const client = new Admin({
      name: 'Kabir Malhotra (Client)',
      email: 'client@studio.com',
      password: 'client123',
      role: 'client',
      phone: '+91 98201 45678'
    });
    await client.save();

    console.log('Seeded accounts:');
    console.log('  👑 Superadmin : superadmin@studio.com / admin123');
    console.log('  🛡️ Admin      : admin@studio.com / admin123');
    console.log('  👤 Client     : client@studio.com / client123');

    // Seed Projects
    await Project.insertMany(sampleProjects);
    console.log(`Seeded ${sampleProjects.length} interior design projects across 4 categories.`);

    // Seed Testimonials
    await Testimonial.insertMany(sampleTestimonials);
    console.log(`Seeded ${sampleTestimonials.length} testimonials.`);

    // Seed Enquiries
    await Enquiry.insertMany(sampleEnquiries);
    console.log(`Seeded ${sampleEnquiries.length} sample enquiries.`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDB();
