/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react';
import { catalog } from '../services/catalog';
import type { Product, ProductVariant } from '../types/catalog';

/**
 * Cart state. Only product/variant IDs and quantities are persisted —
 * never personal or payment data. Prices and stock are re-read from the
 * catalog on every render; a real backend must re-validate them server-side.
 */
export interface CartLine {
  productId: string;
  variantId?: string;
  quantity: number;
}

export interface ResolvedLine extends CartLine {
  key: string;
  product: Product;
  variant?: ProductVariant;
  unitPrice: number;
  maxQty: number;
  lineTotal: number;
}

type Action =
  | { type: 'add'; line: CartLine }
  | { type: 'setQty'; key: string; quantity: number }
  | { type: 'remove'; key: string }
  | { type: 'clear' };

const STORAGE_KEY = 'bazaarly.cart.v1';
export const MAX_PER_LINE = 10;
export const lineKey = (l: Pick<CartLine, 'productId' | 'variantId'>) => `${l.productId}::${l.variantId ?? ''}`;

const stockFor = (productId: string, variantId?: string) => {
  const p = catalog.byId(productId);
  if (!p) return 0;
  if (variantId) return p.variants?.find((v) => v.id === variantId)?.stock ?? 0;
  return p.variants?.length ? 0 : p.stock;
};

const cap = (productId: string, variantId: string | undefined, q: number) =>
  Math.max(0, Math.min(q, stockFor(productId, variantId), MAX_PER_LINE));

export function cartReducer(state: CartLine[], action: Action): CartLine[] {
  switch (action.type) {
    case 'add': {
      const key = lineKey(action.line);
      const existing = state.find((l) => lineKey(l) === key);
      const quantity = cap(action.line.productId, action.line.variantId, (existing?.quantity ?? 0) + action.line.quantity);
      if (quantity <= 0) return state;
      return existing
        ? state.map((l) => (lineKey(l) === key ? { ...l, quantity } : l))
        : [...state, { ...action.line, quantity }];
    }
    case 'setQty':
      return state
        .map((l) => (lineKey(l) === action.key ? { ...l, quantity: cap(l.productId, l.variantId, action.quantity) } : l))
        .filter((l) => l.quantity > 0);
    case 'remove':
      return state.filter((l) => lineKey(l) !== action.key);
    case 'clear':
      return [];
  }
}

const load = (): CartLine[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((l): l is CartLine => typeof l?.productId === 'string' && Number.isInteger(l?.quantity))
      .map((l) => ({ productId: l.productId, variantId: l.variantId, quantity: cap(l.productId, l.variantId, l.quantity) }))
      .filter((l) => l.quantity > 0);
  } catch {
    return [];
  }
};

interface CartContextValue {
  lines: ResolvedLine[];
  count: number;
  subtotal: number;
  add: (productId: string, variantId: string | undefined, quantity: number) => void;
  setQty: (key: string, quantity: number) => void;
  remove: (key: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable (private mode) — cart still works for the session */
    }
  }, [state]);

  const value = useMemo<CartContextValue>(() => {
    const lines: ResolvedLine[] = state.flatMap((l) => {
      const product = catalog.byId(l.productId);
      if (!product) return [];
      const variant = product.variants?.find((v) => v.id === l.variantId);
      const unitPrice = variant?.price ?? product.price;
      return [{
        ...l, key: lineKey(l), product, variant, unitPrice,
        maxQty: Math.min(stockFor(l.productId, l.variantId), MAX_PER_LINE),
        lineTotal: unitPrice * l.quantity,
      }];
    });
    return {
      lines,
      count: lines.reduce((n, l) => n + l.quantity, 0),
      subtotal: lines.reduce((n, l) => n + l.lineTotal, 0),
      add: (productId, variantId, quantity) => dispatch({ type: 'add', line: { productId, variantId, quantity } }),
      setQty: (key, quantity) => dispatch({ type: 'setQty', key, quantity }),
      remove: (key) => dispatch({ type: 'remove', key }),
      clear: () => dispatch({ type: 'clear' }),
    };
  }, [state]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
