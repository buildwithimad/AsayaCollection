import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],

      // ➕ Add to cart
      addToCart: (product) => {
        const cart = get().cart;

        const exists = cart.find(item => item.id === product.id);

        if (exists) {
          set({
            cart: cart.map(item =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({
            cart: [...cart, { ...product, quantity: 1 }],
          });
        }
      },

      // ➖ Decrease
      decreaseQty: (id) => {
        const cart = get().cart;

        set({
          cart: cart.map(item =>
            item.id === id && item.quantity > 1
              ? { ...item, quantity: item.quantity - 1 }
              : item
          ),
        });
      },

      // ❌ Remove
      removeFromCart: (id) => {
        const cart = get().cart;

        set({
          cart: cart.filter(item => item.id !== id),
        });
      },

      // 🧹 Clear
      clearCart: () => set({ cart: [] }),
    }),
    {
      name: "cart-storage", // localStorage key
    }
  )
);