'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOutAction } from '@/actions/auth'

const NAV = [
  { href: '/admin',          label: 'Dashboard', exact: true },
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/orders',   label: 'Orders' },
]

export function AdminSidebar({ user }: { user: { name?: string | null; email?: string | null } }) {
  const pathname = usePathname()

  return (
    <aside className="w-52 shrink-0 flex flex-col border-r border-border bg-surface sticky top-0 h-screen">
      <div className="px-5 py-5 border-b border-border">
        <p className="font-sans font-bold text-sm text-text">Vela</p>
        <p className="text-[10px] font-sans text-muted">Admin</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map(({ href, label, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`block px-2.5 py-2 text-xs font-sans rounded-lg transition-colors ${
                active ? 'bg-text/10 text-text font-medium' : 'text-muted hover:text-text hover:bg-surface-2'
              }`}
            >
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t border-border">
        <p className="text-[10px] font-sans text-muted px-2 mb-1 truncate">{user.name ?? user.email}</p>
        <form action={signOutAction}>
          <button type="submit" className="w-full text-left px-2 py-1.5 text-xs font-sans text-muted hover:text-text transition-colors rounded-lg hover:bg-surface-2">
            Sign out
          </button>
        </form>
        <Link href="/" className="block px-2 py-1.5 text-xs font-sans text-muted hover:text-text transition-colors rounded-lg hover:bg-surface-2">
          ← View store
        </Link>
      </div>
    </aside>
  )
}
