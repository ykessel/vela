'use client'

import { useCart } from '@/store/cart'
import { formatPrice } from '@/lib/stripe'
import { startCheckout } from '@/actions/checkout'
import Image from 'next/image'
import Link from 'next/link'

export function CartPageClient() {
  const { items, removeItem, updateQty, total } = useCart()

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-6">
        <span className="text-5xl">🛒</span>
        <h1 className="font-sans font-bold text-xl text-text">Your cart is empty</h1>
        <p className="text-sm font-sans text-muted">Browse our catalogue and add something you love.</p>
        <Link href="/products" className="px-6 py-3 bg-text text-background font-sans font-semibold text-sm rounded-xl hover:bg-text/90 transition-colors">
          Browse products
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="font-sans font-bold text-2xl text-text mb-8">Cart ({items.length})</h1>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
        {/* Items */}
        <div className="space-y-4">
          {items.map(item => (
            <div key={item.productId} className="flex gap-4 p-4 bg-surface border border-border rounded-2xl">
              {item.image && (
                <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-surface-2">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-sans font-medium text-text">{item.name}</p>
                <p className="text-xs font-sans text-muted mt-0.5">{formatPrice(item.price)} each</p>
                <div className="flex items-center gap-2 mt-3">
                  <button onClick={() => updateQty(item.productId, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center rounded-lg border border-border text-muted hover:text-text transition-colors">−</button>
                  <span className="text-sm font-sans w-6 text-center">{item.quantity}</span>
                  <button onClick={() => updateQty(item.productId, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center rounded-lg border border-border text-muted hover:text-text transition-colors">+</button>
                </div>
              </div>
              <div className="flex flex-col items-end justify-between">
                <p className="text-sm font-sans font-bold text-text">{formatPrice(item.price * item.quantity)}</p>
                <button onClick={() => removeItem(item.productId)} className="text-xs font-sans text-muted hover:text-danger transition-colors">Remove</button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-surface border border-border rounded-2xl p-5 h-fit sticky top-20">
          <h2 className="font-sans font-semibold text-sm text-text mb-4">Summary</h2>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-muted">Subtotal</span>
              <span className="text-text">{formatPrice(total())}</span>
            </div>
            <div className="flex justify-between text-xs font-sans">
              <span className="text-muted">Shipping</span>
              <span className="text-text">Calculated at checkout</span>
            </div>
          </div>
          <div className="border-t border-border pt-4 mb-5">
            <div className="flex justify-between text-sm font-sans font-bold">
              <span>Total</span>
              <span>{formatPrice(total())}</span>
            </div>
          </div>
          <form action={async () => { await startCheckout(items) }}>
            <button type="submit" className="w-full py-3 bg-text text-background font-sans font-semibold text-sm rounded-xl hover:bg-text/90 transition-colors">
              Proceed to checkout →
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
