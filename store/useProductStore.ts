"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { FinishId } from "@/lib/product";
import { getFinish, PRODUCT } from "@/lib/product";

export interface CartItem {
  id: string;
  finish: FinishId;
  quantity: number;
  unitPrice: number;
}

export type CheckoutStatus = "idle" | "processing" | "confirmed";

interface ProductState {
  finish: FinishId;
  quantity: number;
  items: CartItem[];
  cartOpen: boolean;
  menuOpen: boolean;
  activeSection: string;
  resetKey: number;
  checkoutStatus: CheckoutStatus;
  orderNumber: string | null;
  setFinish: (finish: FinishId) => void;
  setQuantity: (quantity: number) => void;
  openCart: () => void;
  closeCart: () => void;
  toggleMenu: () => void;
  closeMenu: () => void;
  setActiveSection: (section: string) => void;
  addToBag: (finish?: FinishId, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateItemQuantity: (id: string, quantity: number) => void;
  resetView: () => void;
  placeDemoOrder: () => Promise<void>;
  resetCheckout: () => void;
  clearCart: () => void;
}

const cartId = (finish: FinishId) => `aura-one-${finish}`;

export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      finish: "graphite",
      quantity: 1,
      items: [],
      cartOpen: false,
      menuOpen: false,
      activeSection: "hero",
      resetKey: 0,
      checkoutStatus: "idle",
      orderNumber: null,

      setFinish: (finish) => set({ finish }),

      setQuantity: (quantity) =>
        set({ quantity: Math.min(9, Math.max(1, Math.round(quantity))) }),

      openCart: () => set({ cartOpen: true, menuOpen: false }),
      closeCart: () => set({ cartOpen: false }),
      toggleMenu: () => set((state) => ({ menuOpen: !state.menuOpen })),
      closeMenu: () => set({ menuOpen: false }),
      setActiveSection: (activeSection) => {
        if (get().activeSection !== activeSection) set({ activeSection });
      },

      addToBag: (finish = get().finish, quantity = get().quantity) => {
        const existing = get().items.find((item) => item.id === cartId(finish));
        const nextItems = existing
          ? get().items.map((item) =>
              item.id === cartId(finish)
                ? {
                    ...item,
                    quantity: Math.min(9, item.quantity + quantity),
                  }
                : item,
            )
          : [
              ...get().items,
              {
                id: cartId(finish),
                finish,
                quantity,
                unitPrice: PRODUCT.price,
              },
            ];
        set({
          items: nextItems,
          cartOpen: true,
          checkoutStatus: "idle",
        });
      },

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      updateItemQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? { ...item, quantity: Math.min(9, Math.max(1, quantity)) }
              : item,
          ),
        })),

      resetView: () => set((state) => ({ resetKey: state.resetKey + 1 })),

      placeDemoOrder: async () => {
        if (get().checkoutStatus === "processing") return;
        set({ checkoutStatus: "processing" });
        await new Promise((resolve) => setTimeout(resolve, 1600));
        const orderNumber = `AURA-${Date.now().toString(36).toUpperCase().slice(-6)}`;
        set({
          checkoutStatus: "confirmed",
          orderNumber,
          items: [],
        });
      },

      resetCheckout: () =>
        set({ checkoutStatus: "idle", orderNumber: null }),

      clearCart: () => set({ items: [], checkoutStatus: "idle", orderNumber: null }),
    }),
    {
      name: "aura-one-store",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (state) => ({
        finish: state.finish,
        items: state.items,
        quantity: state.quantity,
      }),
    },
  ),
);

export const selectCartCount = (state: ProductState) =>
  state.items.reduce((total, item) => total + item.quantity, 0);

export const selectSubtotal = (state: ProductState) =>
  state.items.reduce((total, item) => total + item.unitPrice * item.quantity, 0);

export const getItemFinishName = (finish: FinishId) => getFinish(finish).name;
