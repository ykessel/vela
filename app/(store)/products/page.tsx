import { db } from '@/lib/db'
import { ProductCard } from '@/components/products/ProductCard'
import { ProductFilters } from '@/components/products/ProductFilters'

export const metadata = { title: 'Productos' }

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string; q?: string }>
}) {
  const { category, sort, q } = await searchParams

  const [products, categories] = await Promise.all([
    db.product.findMany({
      where: {
        ...(category ? { category: { slug: category } } : {}),
        ...(q ? {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
          ],
        } : {}),
      },
      include: { category: true },
      orderBy: sort === 'price_asc'  ? { price: 'asc' }
             : sort === 'price_desc' ? { price: 'desc' }
             : sort === 'name'       ? { name: 'asc' }
             : { createdAt: 'desc' },
    }),
    db.category.findMany({ orderBy: { name: 'asc' } }),
  ])

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="font-sans font-bold text-3xl text-text">
          {q ? `Resultados para "${q}"` : category ? categories.find((c: typeof categories[0]) => c.slug === category)?.name ?? 'Productos' : 'Todos los productos'}
        </h1>
        <p className="text-sm font-sans text-muted mt-1">{products.length} producto{products.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="lg:w-56 shrink-0">
          <ProductFilters categories={categories} activeCategory={category} activeSort={sort} query={q} />
        </aside>

        {/* Grid */}
        <div className="flex-1">
          {products.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-muted font-sans">Sin productos para esta búsqueda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {products.map((p: typeof products[0]) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
