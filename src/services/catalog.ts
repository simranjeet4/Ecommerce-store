import { products } from '../data/products';
import type { Product } from '../types/catalog';

/**
 * Catalog service — the only module UI code should use to read products.
 * Today it reads static demo data; later swap internals for API calls
 * (seller inventory, server-side search) without changing callers.
 */
const published = () => products.filter((p) => p.status === 'published');

export const catalog = {
  all: (): Product[] => published(),
  bySlug: (slug: string) => published().find((p) => p.slug === slug),
  byId: (id: string) => products.find((p) => p.id === id),
  byCategory: (categoryId: string) => published().filter((p) => p.categoryId === categoryId),
  featured: (limit = 8) => published().filter((p) => p.isFeatured).slice(0, limit),
  newArrivals: (limit = 8) =>
    published()
      .filter((p) => p.isNewArrival)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, limit),
  onSale: (limit = 8) => published().filter((p) => p.compareAtPrice && p.compareAtPrice > p.price).slice(0, limit),
  related: (p: Product, limit = 4) =>
    published()
      .filter((x) => x.id !== p.id && x.categoryId === p.categoryId)
      .slice(0, limit),
};
