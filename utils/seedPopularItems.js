import PopularItem from '../models/PopularItem.js';

export const initialPopularItems = [
  {
    name: 'Latitude Run® Chasidi U-Shaped Sectional',
    brand: 'Wayfair',
    time: '8 d ago',
    dimensions: '310 × 165 cm',
    price: '$1,420',
    category: 'Sectional Sofa',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80',
    roomImage: '/sample-rooms/room-furnished-sectional.jpg',
    productUrl: 'https://www.wayfair.com/furniture/pdp/latitude-run-chasidi-u-shaped-sectional.html',
    isPopular: true,
    order: 1
  },
  {
    name: 'Tufted corduroy armless chair',
    brand: 'Joss & Main',
    time: '2 d ago',
    dimensions: '88 × 92 cm',
    price: '$389',
    category: 'Accent Chair',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=400&q=80',
    roomImage: '/sample-rooms/room-furnished-armchair.jpg',
    productUrl: 'https://www.jossandmain.com/furniture/pdp/tufted-corduroy-chair.html',
    isPopular: true,
    order: 2
  },
  {
    name: 'Hokku Designs Heffernan Sectional',
    brand: 'Wayfair',
    time: '8 d ago',
    dimensions: '285 × 170 cm',
    price: '$1,280',
    category: 'Modular Sofa',
    image: 'https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?auto=format&fit=crop&w=400&q=80',
    roomImage: '/sample-rooms/room-furnished-sectional.jpg',
    productUrl: 'https://www.wayfair.com/furniture/pdp/hokku-designs-heffernan-sectional.html',
    isPopular: true,
    order: 3
  },
  {
    name: 'HEMNES Door/Drawer Combination',
    brand: 'IKEA',
    time: '38 d ago',
    dimensions: '90 × 197 cm',
    price: '$449',
    category: 'Storage Cabinet',
    image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=400&q=80',
    roomImage: '/sample-rooms/room-furnished-sofa.jpg',
    productUrl: 'https://www.ikea.com/us/en/p/hemnes-door-drawer-combination-black-brown-s49298440/',
    isPopular: true,
    order: 4
  },
  {
    name: 'LILLEHEM 3 seat modular sofa - Gunnarred/brown',
    brand: 'IKEA',
    time: '38 d ago',
    dimensions: '224 × 73 cm',
    price: '$799',
    category: 'Modular Sofa',
    image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=400&q=80',
    roomImage: '/sample-rooms/room-furnished-sofa.jpg',
    productUrl: 'https://www.ikea.com/us/en/p/lillehem-3-seat-modular-sofa-gunnared-terracotta-s69429188/',
    isPopular: true,
    order: 5
  },
  {
    name: 'Convertible pull-out sleeper chair',
    brand: 'Wayfair',
    time: '2 d ago',
    dimensions: '95 × 100 cm',
    price: '$340',
    category: 'Sleeper Chair',
    image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=400&q=80',
    roomImage: '/sample-rooms/room-furnished-armchair.jpg',
    productUrl: 'https://www.wayfair.com/furniture/pdp/convertible-pull-out-sleeper-chair.html',
    isPopular: true,
    order: 6
  },
  {
    name: 'VIMLE 3-seat sofa - with chaise longue',
    brand: 'IKEA',
    time: '38 d ago',
    dimensions: '241 × 164 cm',
    price: '$899',
    category: 'Chaise Sofa',
    image: 'https://images.unsplash.com/photo-1512212621149-107ffe572d2f?auto=format&fit=crop&w=400&q=80',
    roomImage: '/sample-rooms/room-furnished-sectional.jpg',
    productUrl: 'https://www.ikea.com/us/en/p/vimle-3-seat-sofa-with-chaise-longue-saxemara-black-s79399012/',
    isPopular: true,
    order: 7
  },
  {
    name: 'Carmencita linen loveseat',
    brand: 'Wayfair',
    time: '2 d ago',
    dimensions: '160 × 85 cm',
    price: '$670',
    category: 'Loveseat',
    image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=400&q=80',
    roomImage: '/sample-rooms/room-furnished-sofa.jpg',
    productUrl: 'https://www.wayfair.com/furniture/pdp/carmencita-linen-loveseat.html',
    isPopular: true,
    order: 8
  },
  {
    name: 'Solid wood armchair with ottoman',
    brand: 'Wayfair',
    time: '2 d ago',
    dimensions: '78 × 82 cm',
    price: '$415',
    category: 'Armchair & Ottoman',
    image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=400&q=80',
    roomImage: '/sample-rooms/room-furnished-armchair.jpg',
    productUrl: 'https://www.wayfair.com/furniture/pdp/solid-wood-armchair-with-ottoman.html',
    isPopular: true,
    order: 9
  },
  {
    name: 'Birch Lane™ Adley Sideboard',
    brand: 'Birch Lane',
    time: '8 d ago',
    dimensions: '172 × 84 cm',
    price: '$950',
    category: 'Credenza & Sideboard',
    image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=400&q=80',
    roomImage: '/sample-rooms/room-furnished-armchair.jpg',
    productUrl: 'https://www.birchlane.com/furniture/pdp/birch-lane-adley-sideboard.html',
    isPopular: true,
    order: 10
  }
];

export const ensurePopularItemsSeeded = async () => {
  try {
    const count = await PopularItem.countDocuments();
    if (count === 0) {
      await PopularItem.insertMany(initialPopularItems);
      console.log(`[SEED] Initialized ${initialPopularItems.length} popular try-on items into database.`);
    }
  } catch (error) {
    console.warn(`[SEED] Could not auto-seed popular items: ${error.message}`);
  }
};
