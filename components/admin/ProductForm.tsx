'use client'

import { useState, useTransition } from 'react'
import { createProduct, updateProduct, type ProductFormData } from '@/actions/products'
import type { Category } from '@prisma/client'

type ProductProps = {
  id: string
  name: string
  description: string
  price: number       // cents
  compareAt: number | null
  stock: number
  featured: boolean
  categoryId: string
  images: string[]
}

type Props = {
  categories: Category[]
  product?: ProductProps
}

export function ProductForm({ categories, product }: Props) {
  const isEdit = !!product
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [values, setValues] = useState<ProductFormData>({
    name:        product?.name ?? '',
    description: product?.description ?? '',
    price:       product ? (product.price / 100).toFixed(2) : '',
    compareAt:   product?.compareAt ? (product.compareAt / 100).toFixed(2) : '',
    stock:       product ? String(product.stock) : '',
    featured:    product?.featured ?? false,
    categoryId:  product?.categoryId ?? (categories[0]?.id ?? ''),
    images:      product?.images.join('\n') ?? '',
  })

  function field(key: keyof Omit<ProductFormData, 'featured'>) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setValues(v => ({ ...v, [key]: e.target.value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      try {
        const result = isEdit
          ? await updateProduct(product.id, values)
          : await createProduct(values)
        if (result?.error) setError(result.error)
      } catch (err: unknown) {
        // Re-throw Next.js redirect "errors" so navigation works
        if ((err as { digest?: string }).digest?.startsWith('NEXT_REDIRECT')) throw err
        setError('Something went wrong. Please try again.')
      }
    })
  }

  const input = 'w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm font-sans text-text placeholder:text-muted/40 focus:outline-none focus:ring-1 focus:ring-accent/40 transition-colors'
  const label = 'block font-mono text-[10px] uppercase tracking-[0.12em] text-muted mb-1.5'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <p className="text-xs font-sans text-red-500 bg-red-500/5 border border-red-500/20 rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      {/* Name */}
      <div>
        <label className={label}>Product name</label>
        <input
          type="text"
          required
          value={values.name}
          onChange={field('name')}
          className={input}
          placeholder="e.g. Premium Wireless Headphones"
        />
      </div>

      {/* Description */}
      <div>
        <label className={label}>Description</label>
        <textarea
          required
          rows={4}
          value={values.description}
          onChange={field('description')}
          className={`${input} resize-none`}
          placeholder="Detailed product description…"
        />
      </div>

      {/* Price row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={label}>Price ($)</label>
          <input
            type="number"
            required
            step="0.01"
            min="0"
            value={values.price}
            onChange={field('price')}
            className={input}
            placeholder="129.00"
          />
        </div>
        <div>
          <label className={label}>
            Compare at ($){' '}
            <span className="text-muted/50 normal-case tracking-normal">optional</span>
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={values.compareAt}
            onChange={field('compareAt')}
            className={input}
            placeholder="179.00"
          />
        </div>
      </div>

      {/* Stock + Featured */}
      <div className="grid grid-cols-2 gap-4 items-end">
        <div>
          <label className={label}>Stock</label>
          <input
            type="number"
            required
            min="0"
            value={values.stock}
            onChange={field('stock')}
            className={input}
            placeholder="25"
          />
        </div>
        <div className="flex items-center gap-3 pb-2.5">
          <input
            id="featured"
            type="checkbox"
            checked={values.featured}
            onChange={e => setValues(v => ({ ...v, featured: e.target.checked }))}
            className="w-4 h-4 rounded border-border accent-[rgb(var(--color-accent))]"
          />
          <label htmlFor="featured" className="font-sans text-sm text-text cursor-pointer select-none">
            Featured product
          </label>
        </div>
      </div>

      {/* Category */}
      <div>
        <label className={label}>Category</label>
        <select
          required
          value={values.categoryId}
          onChange={field('categoryId')}
          className={input}
        >
          <option value="" disabled>Select a category</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Images */}
      <div>
        <label className={label}>
          Image URLs{' '}
          <span className="text-muted/50 normal-case tracking-normal">one per line</span>
        </label>
        <textarea
          required
          rows={4}
          value={values.images}
          onChange={field('images')}
          className={`${input} resize-none font-mono text-xs leading-relaxed`}
          placeholder={'https://images.unsplash.com/photo-…\nhttps://images.unsplash.com/photo-…'}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 pt-2 border-t border-border">
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-2.5 bg-text text-background font-sans font-semibold text-sm rounded-xl hover:bg-text/90 transition-colors disabled:opacity-50"
        >
          {isPending ? 'Saving…' : isEdit ? 'Save changes' : 'Create product'}
        </button>
        <a
          href="/admin/products"
          className="text-sm font-sans text-muted hover:text-text transition-colors"
        >
          Cancel
        </a>
      </div>
    </form>
  )
}
