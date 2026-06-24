'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useCart } from '@/store/cart'
import { CartSidebar } from '@/components/cart/CartSidebar'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { signOutAction } from '@/actions/auth'
import type { Session } from 'next-auth'

const NAV_LINKS = [
  { href: '/products?category=electronica', label: 'Electronics' },
  { href: '/products?category=ropa',        label: 'Clothing' },
  { href: '/products?category=hogar',       label: 'Home' },
  { href: '/products?category=deportes',    label: 'Sports' },
  { href: '/products?category=libros',      label: 'Books' },
]

export function Navbar({ session }: { session: Session | null }) {
  const { itemCount, openCart } = useCart()
  const [mounted, setMounted] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  useEffect(() => setMounted(true), [])
  const count = mounted ? itemCount() : 0

  const user = session?.user
  const initial = user?.name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? '?'

  return (
    <>
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-8 h-[68px] flex items-center gap-10">

          {/* Wordmark */}
          <Link
            href="/"
            className="font-sans font-semibold text-[19px] text-text tracking-[-0.01em] shrink-0"
          >
            Vela
          </Link>

          {/* Category nav */}
          <nav className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[13.5px] font-sans font-medium text-muted hover:text-text transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="ml-auto flex items-center gap-5">
            <Link
              href="/products"
              className="hidden sm:block text-[13.5px] font-sans font-medium text-muted hover:text-text transition-colors"
            >
              Search
            </Link>

            <ThemeToggle />

            {/* Auth */}
            {!user ? (
              <Link
                href="/login"
                className="text-[13.5px] font-sans font-medium text-muted hover:text-text transition-colors"
              >
                Sign in
              </Link>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setAccountOpen(v => !v)}
                  className="flex items-center gap-2 text-[13.5px] font-sans font-medium text-muted hover:text-text transition-colors"
                  aria-label="Account menu"
                >
                  <span className="w-[26px] h-[26px] rounded-full bg-text/10 flex items-center justify-center text-[11px] font-sans font-bold text-text">
                    {initial}
                  </span>
                </button>

                {accountOpen && (
                  <>
                    {/* Backdrop */}
                    <div className="fixed inset-0 z-10" onClick={() => setAccountOpen(false)} />

                    {/* Dropdown */}
                    <div className="absolute right-0 top-full mt-2 w-44 bg-surface border border-border rounded-xl shadow-lg z-20 py-1 overflow-hidden">
                      <div className="px-3 py-2 border-b border-border">
                        <p className="text-[11px] font-sans font-medium text-text truncate">{user.name ?? user.email}</p>
                        <p className="text-[10px] font-mono text-muted uppercase tracking-wider mt-0.5">
                          {user.role === 'ADMIN' ? 'Admin' : 'Member'}
                        </p>
                      </div>

                      {user.role === 'ADMIN' && (
                        <Link
                          href="/admin"
                          onClick={() => setAccountOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-[12px] font-sans text-text hover:bg-surface-2 transition-colors"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
                          Admin panel
                        </Link>
                      )}

                      <form action={signOutAction}>
                        <button
                          type="submit"
                          className="w-full flex items-center gap-2 px-3 py-2 text-[12px] font-sans text-muted hover:text-text hover:bg-surface-2 transition-colors"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                          Sign out
                        </button>
                      </form>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Cart */}
            <button
              onClick={openCart}
              className="flex items-center gap-2 text-[13.5px] font-sans font-medium text-muted hover:text-text transition-colors"
              aria-label="Open cart"
            >
              Cart
              {count > 0 && (
                <span className="inline-flex items-center justify-center w-[19px] h-[19px] rounded-full bg-accent text-accent-fg font-sans font-bold text-[11px] leading-none">
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <CartSidebar />
    </>
  )
}
