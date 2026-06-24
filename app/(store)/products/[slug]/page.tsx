import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { ProductGallery } from '@/components/products/ProductGallery'
import { AddToCartButton } from '@/components/cart/AddToCartButton'
import { ProductCard } from '@/components/products/ProductCard'
import { formatPrice } from '@/lib/stripe'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await db.product.findUnique({ where: { slug } })
  if (!product) return {}
  return { title: product.name, description: product.description.slice(0, 160) }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await db.product.findUnique({
    where: { slug },
    include: { category: true },
  })
  if (!product) notFound()

  const related = await db.product.findMany({
    where: { categoryId: product.categoryId, id: { not: product.id } },
    include: { category: true },
    take: 4,
  })

  const inStock    = product.stock > 0
  const onSale     = product.compareAt && product.compareAt > product.price
  const discount   = onSale ? Math.round((1 - product.price / product.compareAt!) * 100) : 0

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        {/* Gallery */}
        <ProductGallery images={product.images} name={product.name} />

        {/* Info */}
        <div className="flex flex-col">
          <p className="text-xs font-sans text-muted mb-2">{product.category.name}</p>
          <h1 className="font-sans font-bold text-3xl text-text mb-4">{product.name}</h1>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="font-sans font-bold text-2xl text-text">{formatPrice(product.price)}</span>
            {onSale && (
              <>
                <span className="font-sans text-base text-muted line-through">{formatPrice(product.compareAt!)}</span>
                <span className="text-xs font-sans font-medium text-success bg-success/10 px-2 py-0.5 rounded-full">
                  -{discount}%
                </span>
              </>
            )}
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2 mb-6">
            <span className={`w-2 h-2 rounded-full ${inStock ? 'bg-success' : 'bg-danger'}`} />
            <span className="text-xs font-sans text-muted">
              {inStock ? `${product.stock} en stock` : 'Sin stock'}
            </span>
          </div>

          {/* Description */}
          <p className="font-sans text-sm text-muted leading-relaxed mb-8">{product.description}</p>

          {/* Add to cart */}
          <AddToCartButton
            product={{
              productId: product.id,
              name:      product.name,
              price:     product.price,
              image:     product.images[0],
              slug:      product.slug,
              quantity:  1,
            }}
            disabled={!inStock}
          />
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section>
          <h2 className="font-sans font-bold text-xl text-text mb-6">También te puede gustar</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {related.map((p: typeof related[0]) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  )
}
