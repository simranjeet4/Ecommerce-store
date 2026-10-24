/**
 * Homepage composition. Reorder, remove or add entries to change the homepage —
 * no component changes required.
 */
export type HomeSection =
  | { type: 'hero' }
  | { type: 'categoryGrid'; title: string }
  | { type: 'productRail'; title: string; eyebrow?: string; source: 'featured' | 'newArrivals' | 'onSale'; viewAll?: string }
  | { type: 'promo' }
  | { type: 'collection'; categoryIds: string[]; title: string; eyebrow: string; blurb: string; layout: 'lifestyle' | 'tech' | 'style' }
  | { type: 'valueProps' }
  | { type: 'newsletter' };

export const homepage: HomeSection[] = [
  { type: 'hero' },
  { type: 'categoryGrid', title: 'Shop by category' },
  { type: 'productRail', eyebrow: 'Popular now', title: 'Shoppers are browsing', source: 'featured', viewAll: '/shop' },
  { type: 'promo' },
  {
    type: 'collection', layout: 'lifestyle', categoryIds: ['home', 'handmade'],
    eyebrow: 'Home & living', title: 'Rooms that feel like yours',
    blurb: 'Solid wood, warm light and pieces made by hand — for homes of every size.',
  },
  { type: 'productRail', eyebrow: 'Just in', title: 'New arrivals', source: 'newArrivals', viewAll: '/shop?sort=newest' },
  {
    type: 'collection', layout: 'tech', categoryIds: ['electronics'],
    eyebrow: 'Technology', title: 'Gear for work, play and everything between',
    blurb: 'Audio, wearables and desk essentials with clear specifications up front.',
  },
  {
    type: 'collection', layout: 'style', categoryIds: ['fashion', 'beauty'],
    eyebrow: 'Fashion, beauty & jewellery', title: 'Dressed for the everyday and the festive',
    blurb: 'Wardrobe staples, festive jewellery and self-care rituals.',
  },
  { type: 'valueProps' },
  { type: 'newsletter' },
];
