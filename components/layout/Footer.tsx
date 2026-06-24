import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-border mt-24">
      <div className="max-w-7xl mx-auto px-8 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <Link href="/" className="font-sans font-semibold text-[17px] text-text tracking-[-0.01em]">
            Vela
          </Link>
          <p className="font-mono text-[11px] text-muted uppercase tracking-[0.1em] mt-1">
            Considered goods
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
          <div className="flex gap-6">
            {[
              { href: '/products?category=electronica', label: 'Electronics' },
              { href: '/products?category=ropa',        label: 'Clothing' },
              { href: '/products?category=hogar',       label: 'Home' },
            ].map(l => (
              <Link key={l.href} href={l.href} className="text-xs font-sans text-muted hover:text-text transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
          <p className="text-[11px] font-sans text-muted">
            © {new Date().getFullYear()} Vela. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
