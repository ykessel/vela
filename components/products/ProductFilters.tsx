'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import type { Category } from '@prisma/client'

const SORT_OPTIONS = [
  { value: 'newest',     label: 'Más recientes' },
  { value: 'price_asc',  label: 'Precio: menor a mayor' },
  { value: 'price_desc', label: 'Precio: mayor a menor' },
  { value: 'name',       label: 'Nombre A-Z' },
]

export function ProductFilters({
  categories, activeCategory, activeSort, query,
}: {
  categories: Category[]
  activeCategory?: string
  activeSort?: string
  query?: string
}) {
  const router      = useRouter()
  const pathname    = usePathname()
  const searchParams = useSearchParams()

  function update(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="space-y-6">
      {/* Sort */}
      <div>
        <p className="text-[10px] font-sans font-semibold text-muted uppercase tracking-wider mb-2">Ordenar</p>
        <div className="space-y-0.5">
          {SORT_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => update('sort', opt.value === 'newest' ? null : opt.value)}
              className={`w-full text-left px-2.5 py-1.5 text-xs font-sans rounded-lg transition-colors ${
                (activeSort ?? 'newest') === opt.value
                  ? 'bg-text/10 text-text font-medium'
                  : 'text-muted hover:text-text hover:bg-surface-2'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div>
        <p className="text-[10px] font-sans font-semibold text-muted uppercase tracking-wider mb-2">Categorías</p>
        <div className="space-y-0.5">
          <button
            onClick={() => update('category', null)}
            className={`w-full text-left px-2.5 py-1.5 text-xs font-sans rounded-lg transition-colors ${
              !activeCategory ? 'bg-text/10 text-text font-medium' : 'text-muted hover:text-text hover:bg-surface-2'
            }`}
          >
            Todas
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => update('category', cat.slug)}
              className={`w-full text-left px-2.5 py-1.5 text-xs font-sans rounded-lg transition-colors ${
                activeCategory === cat.slug
                  ? 'bg-text/10 text-text font-medium'
                  : 'text-muted hover:text-text hover:bg-surface-2'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
