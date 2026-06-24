'use client'
// Zustand persist needs to run in client; this wrapper ensures hydration
export function CartProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
