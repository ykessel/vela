import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem } from '@/lib/stripe'

type CartStore = {
  items:       CartItem[]
  isOpen:      boolean
  addItem:     (item: CartItem) => void
  removeItem:  (productId: string) => void
  updateQty:   (productId: string, qty: number) => void
  clearCart:   () => void
  openCart:    () => void
  closeCart:   () => void
  total:       () => number
  itemCount:   () => number
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items:  [],
      isOpen: false,

      addItem(item) {
        set(state => {
          const existing = state.items.find(i => i.productId === item.productId)
          if (existing) {
            return {
              items: state.items.map(i =>
                i.productId === item.productId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i,
              ),
            }
          }
          return { items: [...state.items, item] }
        })
      },

      removeItem(productId) {
        set(state => ({ items: state.items.filter(i => i.productId !== productId) }))
      },

      updateQty(productId, qty) {
        if (qty <= 0) {
          get().removeItem(productId)
          return
        }
        set(state => ({
          items: state.items.map(i =>
            i.productId === productId ? { ...i, quantity: qty } : i,
          ),
        }))
      },

      clearCart: () => set({ items: [] }),
      openCart:  () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      total:     () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'vela-cart' },
  ),
)
