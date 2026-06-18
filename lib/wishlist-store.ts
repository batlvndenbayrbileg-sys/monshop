"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type WishlistItem = {
  id: string;
  slug: string;
  name: string;
  category?: string | null;
  price: number;
  oldPrice?: number | null;
  image?: string;
};

type WishlistState = {
  items: WishlistItem[];
  has: (id: string) => boolean;
  toggle: (item: WishlistItem) => boolean; // returns true if added, false if removed
  remove: (id: string) => void;
  clear: () => void;
  count: () => number;
};

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      has: (id) => get().items.some((i) => i.id === id),
      toggle: (item) => {
        const exists = get().items.some((i) => i.id === item.id);
        if (exists) {
          set((s) => ({ items: s.items.filter((i) => i.id !== item.id) }));
          return false;
        }
        set((s) => ({ items: [...s.items, item] }));
        return true;
      },
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      clear: () => set({ items: [] }),
      count: () => get().items.length,
    }),
    { name: "monshop-wishlist" }
  )
);
