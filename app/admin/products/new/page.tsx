import { db } from '@/lib/db'
import { ProductForm } from '@/components/admin/ProductForm'
import Link from 'next/link'

export const metadata = { title: 'New Product — Admin' }

export default async function NewProductPage() {
  const categories = await db.category.findMany({ orderBy: { name: 'asc' } })

  return (
    <div className="max-w-2xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/admin/products"
          className="font-mono text-[11px] uppercase tracking-wider text-muted hover:text-text transition-colors"
        >
          ← Products
        </Link>
        <span className="text-border">/</span>
        <span className="font-mono text-[11px] uppercase tracking-wider text-text">New</span>
      </div>

      <h1 className="font-sans font-semibold text-xl text-text mb-8">New product</h1>

      <ProductForm categories={categories} />
    </div>
  )
}
