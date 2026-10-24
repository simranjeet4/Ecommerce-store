import type { Product } from '../types/catalog';
import { img } from './images';

/**
 * DEMO CATALOGUE — every product, price and stock level below is sample data
 * for interface development only. No ratings, reviews or sales figures are included.
 */
type Seed = Omit<Product, 'status' | 'isDemo' | 'isFeatured' | 'isNewArrival' | 'attributes' | 'tags' | 'slug'> & {
  slug?: string;
  attributes?: Record<string, string>;
  tags?: string[];
  isFeatured?: boolean;
  isNewArrival?: boolean;
};

const slugify = (s: string) =>
  s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const make = (p: Seed): Product => ({
  status: 'published',
  isDemo: true,
  isFeatured: false,
  isNewArrival: false,
  attributes: {},
  tags: [],
  ...p,
  slug: p.slug ?? slugify(p.name),
});

export const products: Product[] = [
  // ───────── Electronics ─────────
  make({
    id: 'p-001', name: 'Aria ANC Wireless Headphones', brand: 'Sonora', categoryId: 'electronics', subcategory: 'Audio',
    description: 'Over-ear headphones with active noise cancellation, soft protein-leather cushions and a foldable frame for travel.',
    price: 7499, compareAtPrice: 9999, stock: 0,
    images: [{ src: img.headphones, alt: 'Aria wireless headphones, front view' }],
    attributes: { Connectivity: 'Bluetooth 5.3', Battery: 'Up to 40 hours (manufacturer stated)' },
    specifications: [
      { label: 'Driver', value: '40 mm dynamic' }, { label: 'Charging', value: 'USB-C' },
      { label: 'Weight', value: '250 g' }, { label: 'Warranty', value: '1 year (demo)' },
    ],
    options: [{ name: 'Colour', values: ['Midnight', 'Sand'] }],
    variants: [
      { id: 'p-001-mid', optionValues: { Colour: 'Midnight' }, stock: 14 },
      { id: 'p-001-sand', optionValues: { Colour: 'Sand' }, stock: 3 },
    ],
    tags: ['headphones', 'audio', 'noise cancelling', 'wireless', 'travel'],
    isFeatured: true, createdAt: '2026-08-02',
  }),
  make({
    id: 'p-002', name: 'Pulse Fit Smartwatch', brand: 'Kinetik', categoryId: 'electronics', subcategory: 'Wearables',
    description: 'A lightweight smartwatch with heart-rate tracking, sleep insights and a bright AMOLED display.',
    price: 4999, compareAtPrice: 6499, stock: 22,
    images: [{ src: img.smartwatch, alt: 'Pulse Fit smartwatch with white strap' }],
    attributes: { Connectivity: 'Bluetooth', Display: '1.43" AMOLED' },
    specifications: [{ label: 'Water resistance', value: '5 ATM' }, { label: 'Compatibility', value: 'Android & iOS' }],
    tags: ['smartwatch', 'fitness', 'wearable'], isFeatured: true, isNewArrival: true, createdAt: '2026-09-20',
  }),
  make({
    id: 'p-003', name: 'Instant Film Camera', brand: 'Lumo', categoryId: 'electronics', subcategory: 'Cameras',
    description: 'A playful instant camera with automatic exposure and a built-in flash. Film sold separately.',
    price: 6299, stock: 8,
    images: [{ src: img.camera, alt: 'Instant film camera on a plain background' }],
    attributes: { 'Film type': 'Instant mini' },
    specifications: [{ label: 'Power', value: '2 × AA batteries' }, { label: 'Lens', value: '60 mm' }],
    tags: ['camera', 'instant', 'photography', 'gift'], createdAt: '2026-07-14',
  }),
  make({
    id: 'p-004', name: 'Slimline 14" Laptop Sleeve Bundle', brand: 'Deskcraft', categoryId: 'electronics', subcategory: 'Accessories',
    description: 'A padded laptop sleeve with a compact charger pouch, sized for most 13–14 inch laptops.',
    price: 1499, stock: 40,
    images: [{ src: img.laptop, alt: 'Laptop on a desk' }],
    attributes: { Fits: 'Up to 14 inch' },
    tags: ['laptop', 'sleeve', 'work from home'], createdAt: '2026-05-10',
  }),
  make({
    id: 'p-005', name: 'Tactile Mechanical Keyboard', brand: 'Deskcraft', categoryId: 'electronics', subcategory: 'Accessories',
    description: 'A compact 75% mechanical keyboard with hot-swappable switches and warm white backlight.',
    price: 5799, stock: 11,
    images: [{ src: img.keyboard, alt: 'Mechanical keyboard with backlit keys' }],
    attributes: { Connectivity: 'Wired USB-C / Bluetooth' },
    specifications: [{ label: 'Layout', value: '75%, 84 keys' }, { label: 'Switches', value: 'Tactile brown' }],
    options: [{ name: 'Switch', values: ['Tactile', 'Linear'] }],
    variants: [
      { id: 'p-005-t', optionValues: { Switch: 'Tactile' }, stock: 11 },
      { id: 'p-005-l', optionValues: { Switch: 'Linear' }, stock: 0 },
    ],
    tags: ['keyboard', 'mechanical', 'desk setup'], isNewArrival: true, createdAt: '2026-10-01',
  }),
  make({
    id: 'p-006', name: 'Roam Portable Speaker', brand: 'Sonora', categoryId: 'electronics', subcategory: 'Audio',
    description: 'A splash-resistant portable speaker with rich bass, ideal for balconies and weekend trips.',
    price: 3299, compareAtPrice: 3999, stock: 27,
    images: [{ src: img.speaker, alt: 'Portable speaker' }],
    attributes: { Connectivity: 'Bluetooth 5.0', 'Water resistance': 'IPX6' },
    tags: ['speaker', 'audio', 'portable', 'bluetooth'], createdAt: '2026-06-18',
  }),

  // ───────── Fashion & Jewellery ─────────
  make({
    id: 'p-007', name: 'Indigo Block-Print Cotton Kurta', brand: 'Neel Studio', categoryId: 'fashion', subcategory: 'Ethnic wear',
    description: 'A relaxed straight kurta in breathable cotton, hand block-printed with an indigo floral motif.',
    price: 1899, compareAtPrice: 2499, stock: 0,
    images: [{ src: img.fashionEditorial, alt: 'Model wearing indigo block-print kurta' }],
    attributes: { Material: '100% cotton', Fit: 'Straight', Care: 'Gentle hand wash' },
    options: [{ name: 'Size', values: ['XS', 'S', 'M', 'L', 'XL'] }],
    variants: ['XS', 'S', 'M', 'L', 'XL'].map((s, i) => ({ id: `p-007-${s}`, optionValues: { Size: s }, stock: [2, 6, 9, 4, 0][i] })),
    tags: ['kurta', 'cotton', 'block print', 'ethnic', 'women'], isFeatured: true, isNewArrival: true, createdAt: '2026-09-28',
  }),
  make({
    id: 'p-008', name: 'Everyday Organic Crew T-Shirt', brand: 'Basics Co.', categoryId: 'fashion', subcategory: 'Topwear',
    description: 'A mid-weight organic cotton tee with a clean crew neck — the wardrobe staple.',
    price: 699, stock: 0,
    images: [{ src: img.tshirt, alt: 'Plain white crew neck t-shirt' }],
    attributes: { Material: 'Organic cotton, 180 GSM', Fit: 'Regular' },
    options: [{ name: 'Colour', values: ['White', 'Black'] }, { name: 'Size', values: ['S', 'M', 'L', 'XL'] }],
    variants: ['White', 'Black'].flatMap((c) =>
      ['S', 'M', 'L', 'XL'].map((s) => ({ id: `p-008-${c}-${s}`, optionValues: { Colour: c, Size: s }, stock: c === 'Black' && s === 'XL' ? 0 : 12 })),
    ),
    tags: ['t-shirt', 'tee', 'cotton', 'men', 'women', 'basics'], createdAt: '2026-04-11',
  }),
  make({
    id: 'p-009', name: 'Court Classic Sneakers', brand: 'Stride', categoryId: 'fashion', subcategory: 'Footwear',
    description: 'Minimal leather-look sneakers with a cushioned insole for all-day comfort.',
    price: 2799, compareAtPrice: 3499, stock: 0,
    images: [{ src: img.sneakers, alt: 'White minimal sneakers' }],
    attributes: { Material: 'Synthetic leather upper', Sole: 'Rubber' },
    options: [{ name: 'Size (UK)', values: ['6', '7', '8', '9', '10'] }],
    variants: ['6', '7', '8', '9', '10'].map((s) => ({ id: `p-009-${s}`, optionValues: { 'Size (UK)': s }, stock: s === '10' ? 0 : 7 })),
    tags: ['sneakers', 'shoes', 'footwear'], isFeatured: true, createdAt: '2026-07-30',
  }),
  make({
    id: 'p-010', name: 'Kundan Jhumka Earrings', brand: 'Swarna Atelier', categoryId: 'fashion', subcategory: 'Jewellery',
    description: 'Gold-plated brass jhumkas with kundan stones and pearl drops, made for festive evenings.',
    price: 1299, compareAtPrice: 1799, stock: 18,
    images: [{ src: img.jewelleryEditorial, alt: 'Gold kundan jhumka earrings on green velvet' }],
    attributes: { Material: 'Gold-plated brass', Stones: 'Kundan, faux pearl', Closure: 'Hook' },
    tags: ['jhumka', 'earrings', 'jewellery', 'festive', 'kundan'], isFeatured: true, createdAt: '2026-09-05',
  }),
  make({
    id: 'p-011', name: 'Sterling Silver Stacking Ring', brand: 'Swarna Atelier', categoryId: 'fashion', subcategory: 'Jewellery',
    description: 'A slim 925 sterling silver band with a brushed finish — wear alone or stacked.',
    price: 1599, stock: 0,
    images: [{ src: img.ring, alt: 'Silver ring on a dark surface' }],
    attributes: { Material: '925 sterling silver', Finish: 'Brushed' },
    options: [{ name: 'Ring size', values: ['10', '12', '14', '16'] }],
    variants: ['10', '12', '14', '16'].map((s) => ({ id: `p-011-${s}`, optionValues: { 'Ring size': s }, stock: 5 })),
    tags: ['ring', 'silver', 'jewellery'], isNewArrival: true, createdAt: '2026-10-08',
  }),
  make({
    id: 'p-012', name: 'Aviator Polarised Sunglasses', brand: 'Optiq', categoryId: 'fashion', subcategory: 'Accessories',
    description: 'Lightweight metal aviators with polarised lenses and UV400 protection.',
    price: 1999, stock: 25,
    images: [{ src: img.sunglasses, alt: 'Aviator sunglasses' }],
    attributes: { Material: 'Metal frame', Lens: 'Polarised, UV400' },
    tags: ['sunglasses', 'eyewear', 'accessories'], createdAt: '2026-03-22',
  }),
  make({
    id: 'p-013', name: 'Heritage Leather Strap Watch', brand: 'Tempo', categoryId: 'fashion', subcategory: 'Watches',
    description: 'An analogue watch with a clean dial and genuine leather strap.',
    price: 3499, compareAtPrice: 4299, stock: 9,
    images: [{ src: img.leatherWatch, alt: 'Analogue watch with brown leather strap' }],
    attributes: { Material: 'Stainless steel case, leather strap', Movement: 'Quartz' },
    tags: ['watch', 'analogue', 'leather', 'gift'], createdAt: '2026-06-01',
  }),

  // ───────── Beauty ─────────
  make({
    id: 'p-014', name: 'Kumkumadi Radiance Face Oil', brand: 'Vana Botanics', categoryId: 'beauty', subcategory: 'Skincare',
    description: 'An Ayurveda-inspired night face oil with saffron and botanical extracts.',
    price: 899, compareAtPrice: 1199, stock: 30,
    images: [{ src: img.skincare, alt: 'Amber skincare bottles' }],
    attributes: { 'Skin type': 'Normal to dry', Volume: '30 ml' },
    tags: ['face oil', 'kumkumadi', 'ayurveda', 'skincare'], isFeatured: true, createdAt: '2026-08-21',
  }),
  make({
    id: 'p-015', name: 'Velvet Matte Lipstick', brand: 'Rang', categoryId: 'beauty', subcategory: 'Makeup',
    description: 'A creamy matte lipstick with a comfortable, non-drying feel.',
    price: 549, stock: 0,
    images: [{ src: img.lipstick, alt: 'Lipstick bullets' }],
    attributes: { Finish: 'Matte', Weight: '4.2 g' },
    options: [{ name: 'Shade', values: ['Rosewood', 'Brick Red', 'Mauve'] }],
    variants: [
      { id: 'p-015-rw', optionValues: { Shade: 'Rosewood' }, stock: 15 },
      { id: 'p-015-br', optionValues: { Shade: 'Brick Red' }, stock: 10 },
      { id: 'p-015-mv', optionValues: { Shade: 'Mauve' }, stock: 0 },
    ],
    tags: ['lipstick', 'makeup', 'matte'], isNewArrival: true, createdAt: '2026-10-05',
  }),
  make({
    id: 'p-016', name: 'Herbal Hair Care Duo', brand: 'Vana Botanics', categoryId: 'beauty', subcategory: 'Haircare',
    description: 'A gentle shampoo and conditioner pair with amla, bhringraj and hibiscus.',
    price: 749, stock: 4,
    images: [{ src: img.skincare, alt: 'Hair care bottles' }],
    attributes: { 'Hair type': 'All hair types', Volume: '2 × 200 ml' },
    tags: ['shampoo', 'conditioner', 'haircare', 'herbal'], createdAt: '2026-05-28',
  }),
  make({
    id: 'p-017', name: 'Sandalwood Bath Ritual Set', brand: 'Vana Botanics', categoryId: 'beauty', subcategory: 'Bath & body',
    description: 'Handmade sandalwood soap, body oil and a cotton towel in a gift box.',
    price: 1249, stock: 12,
    images: [{ src: img.candles, alt: 'Bath ritual set' }],
    attributes: { Fragrance: 'Sandalwood' },
    tags: ['bath', 'soap', 'sandalwood', 'gift set'], createdAt: '2026-07-02',
  }),

  // ───────── Home & Furniture ─────────
  make({
    id: 'p-018', name: 'Sheesham Accent Armchair', brand: 'Ghar Works', categoryId: 'home', subcategory: 'Furniture',
    description: 'A solid sheesham-wood armchair with a cushioned seat and gently angled backrest.',
    price: 14999, compareAtPrice: 18999, stock: 5,
    images: [{ src: img.armchair, alt: 'Accent armchair in a living room' }],
    attributes: { Material: 'Solid sheesham wood', Assembly: 'Minimal assembly required' },
    specifications: [{ label: 'Dimensions', value: 'W 70 × D 75 × H 82 cm' }, { label: 'Seat height', value: '44 cm' }],
    options: [{ name: 'Upholstery', values: ['Mustard', 'Sage'] }],
    variants: [
      { id: 'p-018-m', optionValues: { Upholstery: 'Mustard' }, stock: 5 },
      { id: 'p-018-s', optionValues: { Upholstery: 'Sage' }, stock: 2, price: 15499 },
    ],
    tags: ['armchair', 'chair', 'furniture', 'wood', 'living room'], isFeatured: true, createdAt: '2026-08-15',
  }),
  make({
    id: 'p-019', name: 'Three-Seater Velvet Sofa', brand: 'Ghar Works', categoryId: 'home', subcategory: 'Furniture',
    description: 'A deep three-seater with velvet upholstery and tapered wooden legs.',
    price: 42999, stock: 2,
    images: [{ src: img.sofa, alt: 'Green velvet three-seater sofa' }],
    attributes: { Material: 'Velvet, engineered wood frame' },
    specifications: [{ label: 'Dimensions', value: 'W 198 × D 88 × H 80 cm' }, { label: 'Delivery', value: 'Large item — placeholder' }],
    tags: ['sofa', 'furniture', 'living room', 'velvet'], isNewArrival: true, createdAt: '2026-09-25',
  }),
  make({
    id: 'p-020', name: 'Brass Dome Table Lamp', brand: 'Roshni', categoryId: 'home', subcategory: 'Lighting',
    description: 'A brushed-brass table lamp with a warm, glare-free dome shade.',
    price: 3899, stock: 16,
    images: [{ src: img.lamp, alt: 'Brass table lamp' }],
    attributes: { Material: 'Brass-finish metal', Bulb: 'E27 (not included)' },
    tags: ['lamp', 'lighting', 'brass', 'decor'], createdAt: '2026-06-09',
  }),
  make({
    id: 'p-021', name: 'Terracotta Planter Set of 3', brand: 'Mitti', categoryId: 'home', subcategory: 'Décor',
    description: 'Three nesting terracotta planters with drainage holes. Plants not included.',
    price: 1199, stock: 20,
    images: [{ src: img.plants, alt: 'Indoor plants in planters' }],
    attributes: { Material: 'Terracotta' },
    tags: ['planter', 'plants', 'terracotta', 'balcony', 'decor'], createdAt: '2026-04-30',
  }),

  // ───────── Handmade ─────────
  make({
    id: 'p-022', name: 'Jaipur Blue Pottery Vase', brand: 'Neela Kala', categoryId: 'handmade', subcategory: 'Pottery',
    description: 'A hand-painted blue pottery vase from Jaipur. Each piece varies slightly in pattern.',
    price: 2199, stock: 6,
    images: [{ src: img.pottery, alt: 'Hand-painted ceramic vase' }],
    attributes: { Craft: 'Blue pottery', Origin: 'Jaipur, Rajasthan', Height: '25 cm' },
    tags: ['vase', 'blue pottery', 'handmade', 'jaipur', 'decor'], isFeatured: true, createdAt: '2026-08-08',
  }),
  make({
    id: 'p-023', name: 'Stoneware Mug Pair', brand: 'Kiln & Co.', categoryId: 'handmade', subcategory: 'Ceramics',
    description: 'Two wheel-thrown stoneware mugs with a speckled glaze. Microwave safe.',
    price: 999, stock: 14,
    images: [{ src: img.mugs, alt: 'Pair of ceramic mugs' }],
    attributes: { Craft: 'Wheel-thrown stoneware', Capacity: '300 ml each' },
    tags: ['mug', 'ceramic', 'handmade', 'coffee'], isNewArrival: true, createdAt: '2026-10-10',
  }),
  make({
    id: 'p-024', name: 'Madhubani Art Print — Fish Pair', brand: 'Mithila Studio', categoryId: 'handmade', subcategory: 'Art',
    description: 'An archival print of a hand-painted Madhubani artwork depicting a pair of fish.',
    price: 1499, stock: 10,
    images: [{ src: img.notebook, alt: 'Art print on a desk' }],
    attributes: { Craft: 'Madhubani (print)', Size: 'A3' },
    options: [{ name: 'Frame', values: ['Unframed', 'Teak frame'] }],
    variants: [
      { id: 'p-024-u', optionValues: { Frame: 'Unframed' }, stock: 10 },
      { id: 'p-024-f', optionValues: { Frame: 'Teak frame' }, stock: 4, price: 2799 },
    ],
    tags: ['madhubani', 'art', 'print', 'wall decor'], createdAt: '2026-05-19',
  }),

  // ───────── Gifts ─────────
  make({
    id: 'p-025', name: 'Festive Gift Hamper', brand: 'Utsav', categoryId: 'gifts', subcategory: 'Hampers',
    description: 'A curated hamper with a soy candle, assam tea, dry-fruit tin and a handwritten note card.',
    price: 2499, compareAtPrice: 2999, stock: 15,
    images: [{ src: img.giftBox, alt: 'Wrapped festive gift hamper' }],
    attributes: { Contents: '4 items' },
    tags: ['gift', 'hamper', 'diwali', 'festive'], isFeatured: true, createdAt: '2026-09-30',
  }),
  make({
    id: 'p-026', name: 'Hand-Poured Soy Candle', brand: 'Utsav', categoryId: 'gifts', subcategory: 'Candles',
    description: 'A slow-burning soy wax candle in a reusable ceramic jar.',
    price: 799, stock: 35,
    images: [{ src: img.candles, alt: 'Soy candles in jars' }],
    attributes: { Burn: 'About 35 hours (approx.)' },
    options: [{ name: 'Scent', values: ['Mogra', 'Vetiver', 'Chai Spice'] }],
    variants: ['Mogra', 'Vetiver', 'Chai Spice'].map((s) => ({ id: `p-026-${slugify(s)}`, optionValues: { Scent: s }, stock: 12 })),
    tags: ['candle', 'soy', 'gift', 'home fragrance'], isNewArrival: true, createdAt: '2026-10-12',
  }),
  make({
    id: 'p-027', name: 'Linen-Bound Journal', brand: 'Paper Trail', categoryId: 'gifts', subcategory: 'Stationery',
    description: 'A lay-flat journal with 192 pages of 100 GSM dotted paper.',
    price: 649, stock: 50,
    images: [{ src: img.notebook, alt: 'Linen journal' }],
    attributes: { Pages: '192, dotted' },
    tags: ['journal', 'notebook', 'stationery', 'gift'], createdAt: '2026-03-15',
  }),
  make({
    id: 'p-028', name: 'Assam & Darjeeling Tea Sampler', brand: 'Chai Ghar', categoryId: 'gifts', subcategory: 'Gourmet',
    description: 'Four loose-leaf teas from Assam and Darjeeling in a keepsake tin.',
    price: 899, stock: 0,
    images: [{ src: img.tea, alt: 'Cup of tea' }],
    attributes: { Weight: '4 × 50 g' },
    tags: ['tea', 'assam', 'darjeeling', 'gift'], createdAt: '2026-06-25',
  }),

  // ───────── Kitchen ─────────
  make({
    id: 'p-029', name: 'Triply Stainless Steel Kadai', brand: 'Rasoi Pro', categoryId: 'kitchen', subcategory: 'Cookware',
    description: 'A triply kadai with even heat distribution; works on gas and induction.',
    price: 2399, compareAtPrice: 2999, stock: 19,
    images: [{ src: img.kitchen, alt: 'Cookware in a kitchen' }],
    attributes: { Material: 'Triply stainless steel', Compatibility: 'Gas & induction' },
    options: [{ name: 'Capacity', values: ['2 L', '3.5 L'] }],
    variants: [
      { id: 'p-029-2', optionValues: { Capacity: '2 L' }, stock: 19 },
      { id: 'p-029-35', optionValues: { Capacity: '3.5 L' }, stock: 7, price: 2899, compareAtPrice: 3499 },
    ],
    tags: ['kadai', 'cookware', 'induction', 'kitchen'], isFeatured: true, createdAt: '2026-07-22',
  }),
  make({
    id: 'p-030', name: 'Steel Masala Dabba', brand: 'Rasoi Pro', categoryId: 'kitchen', subcategory: 'Storage',
    description: 'A classic spice box with seven bowls, a spoon and a see-through lid.',
    price: 899, stock: 28,
    images: [{ src: img.spices, alt: 'Masala dabba with spices' }],
    attributes: { Material: 'Stainless steel' },
    tags: ['masala dabba', 'spice box', 'storage', 'kitchen'], createdAt: '2026-02-18',
  }),
  make({
    id: 'p-031', name: "Chef's Knife 8\"", brand: 'Rasoi Pro', categoryId: 'kitchen', subcategory: 'Tools',
    description: 'A full-tang stainless steel chef’s knife with an ergonomic handle.',
    price: 1299, stock: 13,
    images: [{ src: img.knife, alt: 'Chef knife on a cutting board' }],
    attributes: { Material: 'Stainless steel' },
    tags: ['knife', 'kitchen tools', 'chef'], isNewArrival: true, createdAt: '2026-09-12',
  }),
  make({
    id: 'p-032', name: 'Insulated Steel Bottle 1 L', brand: 'Hydra', categoryId: 'kitchen', subcategory: 'Drinkware',
    description: 'Double-wall vacuum bottle that keeps drinks hot or cold for hours.',
    price: 999, compareAtPrice: 1299, stock: 44,
    images: [{ src: img.bottle, alt: 'Insulated steel water bottle' }],
    attributes: { Material: 'Stainless steel', Capacity: '1 L' },
    tags: ['bottle', 'water bottle', 'flask', 'drinkware'], createdAt: '2026-05-05',
  }),
];
