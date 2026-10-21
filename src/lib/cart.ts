"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Extra = { name: string; price: number };

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  image?: string | null;
  variantName?: string;
  extras?: Extra[];
  unitPrice: number; // base/variant price, extras added on top
  quantity: number;
  weightBased?: boolean;
  unitLabel?: string;
};

export const extrasTotal = (i: CartItem) => (i.extras ?? []).reduce((s, e) => s + e.price, 0);
export const lineTotal = (i: CartItem) => (i.unitPrice + extrasTotal(i)) * i.quantity;

type CartState = {
  items: CartItem[];
  couponCode?: string;
  add: (item: CartItem) => void;
  remove: (item: Pick<CartItem, "productId" | "variantName" | "extras">) => void;
  setQty: (item: Pick<CartItem, "productId" | "variantName" | "extras">, qty: number) => void;
  setCoupon: (code?: string) => void;
  clear: () => void;
  subtotal: () => number;
  count: () => number;
};

const key = (i: Pick<CartItem, "productId" | "variantName" | "extras">) =>
  `${i.productId}|${i.variantName ?? ""}|${JSON.stringify((i.extras ?? []).map((e) => e.name).sort())}`;

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) =>
        set((s) => {
          const existing = s.items.find((i) => key(i) === key(item));
          if (existing) {
            return {
              items: s.items.map((i) =>
                key(i) === key(item) ? { ...i, quantity: i.quantity + item.quantity } : i
              ),
            };
          }
          return { items: [...s.items, item] };
        }),
      remove: (item) => set((s) => ({ items: s.items.filter((i) => key(i) !== key(item)) })),
      setQty: (item, qty) =>
        set((s) => ({
          items:
            qty <= 0
              ? s.items.filter((i) => key(i) !== key(item))
              : s.items.map((i) => (key(i) === key(item) ? { ...i, quantity: qty } : i)),
        })),
      setCoupon: (code) => set({ couponCode: code }),
      clear: () => set({ items: [], couponCode: undefined }),
      subtotal: () => get().items.reduce((sum, i) => sum + lineTotal(i), 0),
      count: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: "elnaj-cart" }
  )
);
