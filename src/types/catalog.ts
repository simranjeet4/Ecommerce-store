/**
 * Catalog domain types.
 * Designed so products can later be owned by sellers (sellerId) and
 * stock can become seller-/variant-specific without changing the UI contract.
 */

export interface ProductImage {
  src: string;
  alt: string;
}

export interface ProductOption {
  /** e.g. "Size", "Colour", "Capacity" */
  name: string;
  values: string[];
}

export interface ProductVariant {
  id: string;
  /** Map of option name -> value, e.g. { Size: "M", Colour: "Indigo" } */
  optionValues: Record<string, string>;
  /** Overrides product price when present */
  price?: number;
  compareAtPrice?: number;
  stock: number;
}

export interface Specification {
  label: string;
  value: string;
}

export type PublicationStatus = 'published' | 'draft';

export interface Product {
  id: string;
  slug: string;
  name: string;
  /** Short brand / maker label (demo) */
  brand?: string;
  description: string;
  categoryId: string;
  subcategory?: string;
  /** INR, whole rupees */
  price: number;
  compareAtPrice?: number;
  images: ProductImage[];
  /** Used when product has no variants */
  stock: number;
  /** Category-specific highlight attributes (material, capacity, finish...) */
  attributes: Record<string, string>;
  specifications?: Specification[];
  options?: ProductOption[];
  variants?: ProductVariant[];
  tags: string[];
  isFeatured: boolean;
  isNewArrival: boolean;
  status: PublicationStatus;
  /** ISO date, used for "newest" sort */
  createdAt: string;
  /** Future marketplace hook — not used by the storefront yet */
  sellerId?: string;
  /** All seed data is demo content */
  isDemo: boolean;
}

/** Visual treatment so each category presents products appropriately */
export interface CategoryPresentation {
  /** CSS aspect-ratio for product imagery */
  aspect: '1 / 1' | '3 / 4' | '4 / 3' | '4 / 5';
  /** Surface behind product images */
  surface: string;
  /** How the image fills the frame */
  fit: 'cover' | 'contain';
  /** Text tone on the surface when dark */
  dark?: boolean;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  image: ProductImage;
  presentation: CategoryPresentation;
  /** Attribute keys that are meaningful as filters for this category */
  filterAttributes?: string[];
  /** Display order in navigation */
  order: number;
}
