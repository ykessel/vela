import Link from 'next/link'
import Image from 'next/image'
import { db } from '@/lib/db'
import { formatPrice } from '@/lib/stripe'
import { DeleteProductButton } from '@/components/admin/DeleteProductButton'

export const metadata = { title: 'Products — Admin' }

export default async function AdminProductsPage() {
  const products = await db.product.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-sans font-bold text-xl text-text">Products</h1>
        <Link
          href="/admin/products/new"
          className="px-4 py-2 bg-text text-background font-sans font-semibold text-xs rounded-lg hover:bg-text/90 transition-colors"
        >
          + New product
        </Link>
      </div>

      <div className="bg-surface border border-border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {['Product', 'Category', 'Price', 'Stock', 'Featured', ''].map(h => (
                <th key={h} className="px-4 py-3 text-left text-[11px] font-sans font-semibold text-muted uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.map((p: typeof products[0]) => (
              <tr key={p.id} className="hover:bg-surface-2 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {p.images[0] && (
                      <div className="w-10 h-10 relative rounded-lg overflow-hidden shrink-0">
                        <Image src={p.images[0]} alt={p.name} fill sizes="40px" className="object-cover" />
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-sans font-medium text-text">{p.name}</p>
                      <p className="text-[10px] font-sans text-muted font-mono">{p.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs font-sans text-muted">{p.category.name}</td>
                <td className="px-4 py-3 text-xs font-sans font-semibold text-text">{formatPrice(p.price)}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-sans ${p.stock === 0 ? 'text-danger' : p.stock < 5 ? 'text-warning' : 'text-muted'}`}>
                    {p.stock}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs font-sans text-muted">{p.featured ? '✓' : '—'}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/products/${p.id}/edit`}
                      className="text-[11px] font-sans text-muted hover:text-text transition-colors"
                    >
                      Edit
                    </Link>
                    <DeleteProductButton productId={p.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
