'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function SearchBar() {
  const [q, setQ] = useState('')
  const router    = useRouter()

  function handle(e: React.FormEvent) {
    e.preventDefault()
    if (q.trim()) router.push(`/products?q=${encodeURIComponent(q.trim())}`)
  }

  return (
    <form onSubmit={handle} className="relative">
      <input
        value={q}
        onChange={e => setQ(e.target.value)}
        placeholder="Buscar productos…"
        className="w-full h-8 pl-8 pr-3 text-xs font-sans bg-surface-2 border border-border rounded-lg text-text placeholder:text-muted focus:outline-none focus:border-text/30 transition-colors"
      />
      <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
    </form>
  )
}
