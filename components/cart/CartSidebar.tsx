'use client'

import { useCart } from '@/store/cart'
import { formatPrice } from '@/lib/stripe'
import { startCheckout } from '@/actions/checkout'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'

export function CartSidebar() {
  const { items, isOpen, closeCart, removeItem, updateQty, total } = useCart()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.aside
            key="drawer"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-surface border-l border-border z-50 flex flex-col shadow-modal"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="font-sans font-semibold text-sm text-text">
                Cart {items.length > 0 && <span className="text-muted font-normal">({items.length})</span>}
              </h2>
              <button onClick={closeCart} className="text-muted hover:text-text transition-colors">
                <XIcon />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center gap-3">
                  <span className="text-4xl">🛒</span>
                  <p className="text-sm font-sans text-muted">Your cart is empty</p>
                </div>
              ) : (
                items.map(item => (
                  <div key={item.productId} className="flex gap-3">
                    {item.image && (
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-surface-2">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-sans font-medium text-text truncate">{item.name}</p>
                      <p className="text-xs font-sans text-muted mt-0.5">{formatPrice(item.price)}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button onClick={() => updateQty(item.productId, item.quantity - 1)} className="w-6 h-6 flex items-center justify-center rounded-md border border-border text-muted hover:text-text transition-colors text-sm">−</button>
                        <span className="text-xs font-sans w-4 text-center">{item.quantity}</span>
                        <button onClick={() => updateQty(item.productId, item.quantity + 1)} className="w-6 h-6 flex items-center justify-center rounded-md border border-border text-muted hover:text-text transition-colors text-sm">+</button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <p className="text-xs font-sans font-semibold text-text">{formatPrice(item.price * item.quantity)}</p>
                      <button onClick={() => removeItem(item.productId)} className="text-[10px] font-sans text-muted hover:text-danger transition-colors">Remove</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-5 py-4 border-t border-border space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-sans text-muted">Subtotal</span>
                  <span className="text-sm font-sans font-bold text-text">{formatPrice(total())}</span>
                </div>
                <form action={async () => { await startCheckout(items) }}>
                  <button
                    type="submit"
                    className="w-full py-3 bg-text text-background font-sans font-semibold text-sm rounded-xl hover:bg-text/90 transition-colors"
                  >
                    Proceed to checkout →
                  </button>
                </form>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}
