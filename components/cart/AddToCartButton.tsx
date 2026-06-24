'use client'

import { useCart } from '@/store/cart'
import type { CartItem } from '@/lib/stripe'

export function AddToCartButton({ product, disabled }: { product: CartItem; disabled?: boolean }) {
  const { addItem, openCart } = useCart()

  function handle() {
    addItem(product)
    openCart()
  }

  return (
    <button
      onClick={handle}
      disabled={disabled}
      className="w-full py-3.5 bg-text text-background font-sans font-semibold text-sm rounded-xl hover:bg-text/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {disabled ? 'Sin stock' : 'Agregar al carrito'}
    </button>
  )
}
