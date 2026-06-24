import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import { ProductForm } from '@/components/admin/ProductForm'
import Link from 'next/link'

export const metadata = { title: 'Edit Product — Admin' }

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [product, categories] = await Promise.all([
    db.product.findUnique({ where: { id } }),
    db.category.findMany({ orderBy: { name: 'asc' } }),
  ])

  if (!product) notFound()

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
        <span className="font-mono text-[11px] uppercase tracking-wider text-text truncate max-w-[200px]">
          {product.slug}
        </span>
      </div>

      <div className="mb-8">
        <h1 className="font-sans font-semibold text-xl text-text">{product.name}</h1>
        <p className="font-mono text-[11px] text-muted mt-1">id: {product.id}</p>
      </div>

      <ProductForm categories={categories} product={product} />
    </div>
  )
}
