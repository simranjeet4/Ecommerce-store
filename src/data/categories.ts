import type { Category } from '../types/catalog';
import { img } from './images';

/** Add a new category here — navigation, shop filters and category pages pick it up automatically. */
export const categories: Category[] = [
  {
    id: 'electronics',
    slug: 'electronics',
    name: 'Electronics & Accessories',
    shortName: 'Electronics',
    tagline: 'Audio, wearables and desk essentials',
    description:
      'Everyday technology chosen for reliability — headphones, wearables, cameras and workspace accessories.',
    image: { src: img.headphones, alt: 'Over-ear headphones on a light grey studio background' },
    presentation: { aspect: '1 / 1', surface: '#ECEEF0', fit: 'cover' },
    filterAttributes: ['Connectivity'],
    order: 1,
  },
  {
    id: 'fashion',
    slug: 'fashion-jewellery',
    name: 'Fashion & Jewellery',
    shortName: 'Fashion',
    tagline: 'Clothing, footwear and fine accents',
    description:
      'Wardrobe staples, festive wear, footwear and jewellery from brands and independent labels.',
    image: { src: img.fashionEditorial, alt: 'Woman wearing an indigo block-printed kurta' },
    presentation: { aspect: '3 / 4', surface: '#EFE8DF', fit: 'cover' },
    filterAttributes: ['Material'],
    order: 2,
  },
  {
    id: 'beauty',
    slug: 'beauty-personal-care',
    name: 'Beauty & Personal Care',
    shortName: 'Beauty',
    tagline: 'Skincare, haircare and rituals',
    description: 'Skincare, cosmetics and self-care essentials, including Ayurvedic formulations.',
    image: { src: img.skincare, alt: 'Skincare bottles arranged on a soft surface' },
    presentation: { aspect: '4 / 5', surface: '#F3E6E1', fit: 'cover' },
    filterAttributes: ['Skin type'],
    order: 3,
  },
  {
    id: 'home',
    slug: 'home-furniture',
    name: 'Home & Furniture',
    shortName: 'Home',
    tagline: 'Furniture, lighting and décor',
    description: 'Solid-wood furniture, lighting, textiles and décor for homes of every size.',
    image: { src: img.armchair, alt: 'Upholstered armchair in a bright room' },
    presentation: { aspect: '4 / 3', surface: '#E9E3D8', fit: 'cover' },
    filterAttributes: ['Material'],
    order: 4,
  },
  {
    id: 'handmade',
    slug: 'handmade-art-crafts',
    name: 'Handmade, Art & Crafts',
    shortName: 'Handmade',
    tagline: 'Made by hand across India',
    description: 'Pottery, paintings, textiles and crafts from artisans and small studios.',
    image: { src: img.pottery, alt: 'Handmade ceramic pottery on a wooden table' },
    presentation: { aspect: '4 / 5', surface: '#EDE2D3', fit: 'cover' },
    filterAttributes: ['Craft'],
    order: 5,
  },
  {
    id: 'gifts',
    slug: 'gifts-lifestyle',
    name: 'Gifts & Lifestyle',
    shortName: 'Gifts',
    tagline: 'Thoughtful things for every occasion',
    description: 'Gift sets, stationery, candles and lifestyle pieces for festivals and milestones.',
    image: { src: img.giftBox, alt: 'Wrapped gift box with ribbon' },
    presentation: { aspect: '1 / 1', surface: '#F1E9DA', fit: 'cover' },
    order: 6,
  },
  {
    id: 'kitchen',
    slug: 'kitchen-household',
    name: 'Kitchen & Household',
    shortName: 'Kitchen',
    tagline: 'Cookware, storage and daily essentials',
    description: 'Cookware, tools and storage built for Indian kitchens and daily use.',
    image: { src: img.spices, alt: 'Bowls of colourful Indian spices' },
    presentation: { aspect: '1 / 1', surface: '#E6E8E3', fit: 'cover' },
    filterAttributes: ['Material'],
    order: 7,
  },
];

export const getCategoryById = (id: string) => categories.find((c) => c.id === id);
export const getCategoryBySlug = (slug: string) => categories.find((c) => c.slug === slug);
