import { describe, expect, it } from 'vitest';
import { products } from '../../data/products';
import { cartReducer, lineKey } from '../../state/CartContext';
import { attributeValuesFor, filterAndSortProducts } from '../filters';
import { discountPercent, formatINR, isInStock, minPrice, totalStock } from '../format';

describe('formatINR & pricing helpers', () => {
  it('formats rupees using Indian numbering system', () => {
    expect(formatINR(14999)).toBe('₹14,999');
    expect(formatINR(125000)).toBe('₹1,25,000');
  });

  it('computes discount percentage accurately', () => {
    expect(discountPercent(7499, 9999)).toBe(25);
    expect(discountPercent(1000, 1000)).toBe(0);
    expect(discountPercent(1000, undefined)).toBe(0);
  });

  it('computes total stock across variants when variants exist', () => {
    const headphones = products.find((p) => p.id === 'p-001')!;
    expect(totalStock(headphones)).toBe(17);
    expect(isInStock(headphones)).toBe(true);

    const oosTea = products.find((p) => p.id === 'p-028')!;
    expect(totalStock(oosTea)).toBe(0);
    expect(isInStock(oosTea)).toBe(false);
  });
});

describe('filterAndSortProducts', () => {
  it('filters by categoryId', () => {
    const res = filterAndSortProducts(products, { categoryId: 'electronics' });
    expect(res.length).toBeGreaterThan(0);
    expect(res.every((p) => p.categoryId === 'electronics')).toBe(true);
  });

  it('searches across name, description and tags', () => {
    const res = filterAndSortProducts(products, { q: 'kundan' });
    expect(res.some((p) => p.id === 'p-010')).toBe(true);
  });

  it('filters by minPrice and maxPrice in INR', () => {
    const res = filterAndSortProducts(products, { minPrice: 1000, maxPrice: 3000 });
    expect(res.length).toBeGreaterThan(0);
    expect(res.every((p) => minPrice(p) >= 1000 && minPrice(p) <= 3000)).toBe(true);
  });

  it('filters by inStockOnly', () => {
    const res = filterAndSortProducts(products, { inStockOnly: true });
    expect(res.every((p) => isInStock(p))).toBe(true);
    expect(res.find((p) => p.id === 'p-028')).toBeUndefined();
  });

  it('sorts by price ascending and descending', () => {
    const asc = filterAndSortProducts(products, { sort: 'price-asc' });
    for (let i = 1; i < asc.length; i++) {
      expect(minPrice(asc[i])).toBeGreaterThanOrEqual(minPrice(asc[i - 1]));
    }
    const desc = filterAndSortProducts(products, { sort: 'price-desc' });
    for (let i = 1; i < desc.length; i++) {
      expect(minPrice(desc[i])).toBeLessThanOrEqual(minPrice(desc[i - 1]));
    }
  });

  it('extracts distinct attribute values for category filters', () => {
    const electronics = products.filter((p) => p.categoryId === 'electronics');
    const values = attributeValuesFor(electronics, 'Connectivity');
    expect(values).toContain('Bluetooth 5.3');
  });
});

describe('cartReducer', () => {
  it('adds items, caps quantity by stock, updates quantity and removes items', () => {
    // p-001-sand has stock 3
    let state = cartReducer([], {
      type: 'add',
      line: { productId: 'p-001', variantId: 'p-001-sand', quantity: 2 },
    });
    expect(state).toHaveLength(1);
    expect(state[0].quantity).toBe(2);

    // Adding 5 more should cap at available stock (3)
    state = cartReducer(state, {
      type: 'add',
      line: { productId: 'p-001', variantId: 'p-001-sand', quantity: 5 },
    });
    expect(state[0].quantity).toBe(3);

    // Updating quantity to 1
    const key = lineKey({ productId: 'p-001', variantId: 'p-001-sand' });
    state = cartReducer(state, { type: 'setQty', key, quantity: 1 });
    expect(state[0].quantity).toBe(1);

    // Removing item
    state = cartReducer(state, { type: 'remove', key });
    expect(state).toHaveLength(0);
  });
});
