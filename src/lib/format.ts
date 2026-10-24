import type { Product, ProductVariant } from '../types/catalog';

const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

export const formatINR = (amount: number) => inr.format(amount);

/** Total sellable stock across variants (or product stock if no variants). */
export const totalStock = (p: Product) =>
  p.variants?.length ? p.variants.reduce((n, v) => n + v.stock, 0) : p.stock;

export const isInStock = (p: Product) => totalStock(p) > 0;

/** Lowest price across product/variants — used for "from" pricing and filtering. */
export const minPrice = (p: Product) =>
  p.variants?.length ? Math.min(p.price, ...p.variants.map((v) => v.price ?? p.price)) : p.price;

export const hasPriceRange = (p: Product) =>
  !!p.variants?.some((v) => v.price !== undefined && v.price !== p.price);

export const discountPercent = (price: number, compareAt?: number) =>
  compareAt && compareAt > price ? Math.round(((compareAt - price) / compareAt) * 100) : 0;

export const variantLabel = (v?: ProductVariant) =>
  v ? Object.entries(v.optionValues).map(([k, val]) => `${k}: ${val}`).join(' · ') : '';
