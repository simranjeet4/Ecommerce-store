import { isInStock, minPrice } from './format';
import type { Product } from '../types/catalog';

export type SortOption = 'relevance' | 'newest' | 'price-asc' | 'price-desc';

export interface FilterState {
  q?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  dealsOnly?: boolean;
  tag?: string;
  attributeFilters?: Record<string, string>;
  sort?: SortOption;
}

/**
 * Pure filtering and sorting function for the product catalog.
 * Searches across product name, description, brand, subcategory and tags.
 */
export function filterAndSortProducts(items: Product[], filter: FilterState): Product[] {
  const q = filter.q?.trim().toLowerCase() ?? '';

  const scored = items
    .map((p) => {
      if (filter.categoryId && p.categoryId !== filter.categoryId) return null;
      const price = minPrice(p);
      if (filter.minPrice !== undefined && price < filter.minPrice) return null;
      if (filter.maxPrice !== undefined && price > filter.maxPrice) return null;
      if (filter.inStockOnly && !isInStock(p)) return null;
      if (filter.dealsOnly && !(p.compareAtPrice && p.compareAtPrice > p.price)) return null;
      if (filter.tag && !p.tags.includes(filter.tag)) return null;

      if (filter.attributeFilters) {
        for (const [k, v] of Object.entries(filter.attributeFilters)) {
          if (v && p.attributes[k] !== v) return null;
        }
      }

      let score = 0;
      if (q) {
        const nameMatch = p.name.toLowerCase().includes(q);
        const tagMatch = p.tags.some((t) => t.toLowerCase().includes(q));
        const brandMatch = p.brand?.toLowerCase().includes(q) ?? false;
        const subMatch = p.subcategory?.toLowerCase().includes(q) ?? false;
        const descMatch = p.description.toLowerCase().includes(q);
        if (!nameMatch && !tagMatch && !brandMatch && !subMatch && !descMatch) return null;
        if (nameMatch) score += 10;
        if (tagMatch) score += 6;
        if (brandMatch || subMatch) score += 4;
        if (descMatch) score += 2;
      } else {
        if (p.isFeatured) score += 3;
        if (p.isNewArrival) score += 1;
      }

      return { product: p, score, price };
    })
    .filter((entry): entry is { product: Product; score: number; price: number } => entry !== null);

  const sort = filter.sort ?? 'relevance';
  scored.sort((a, b) => {
    switch (sort) {
      case 'price-asc':
        return a.price - b.price || a.product.name.localeCompare(b.product.name);
      case 'price-desc':
        return b.price - a.price || a.product.name.localeCompare(b.product.name);
      case 'newest':
        return b.product.createdAt.localeCompare(a.product.createdAt);
      case 'relevance':
      default:
        return b.score - a.score || b.product.createdAt.localeCompare(a.product.createdAt);
    }
  });

  return scored.map((s) => s.product);
}

/** Extract distinct values for a given attribute key across a product list. */
export function attributeValuesFor(items: Product[], key: string): string[] {
  const set = new Set<string>();
  for (const p of items) {
    const val = p.attributes[key];
    if (val) set.add(val);
  }
  return [...set].sort();
}
