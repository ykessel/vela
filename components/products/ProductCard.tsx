import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/stripe'
import type { Product, Category } from '@prisma/client'

type Props = { product: Product & { category: Category } }

export function ProductCard({ product }: Props) {
  const onSale   = product.compareAt && product.compareAt > product.price
  const discount = onSale ? Math.round((1 - product.price / product.compareAt!) * 100) : 0
  const inStock  = product.stock > 0

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      {/* Image — white card, square */}
      <div className="relative rounded-xl overflow-hidden bg-surface border border-border shadow-card group-hover:shadow-card-hover transition-shadow duration-300 mb-3.5">
        <div className="relative" style={{ aspectRatio: '1/1' }}>
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted/40">[ image ]</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {onSale && (
              <span className="font-mono text-[10px] font-bold bg-accent text-accent-fg px-2.5 py-0.5 rounded-sm">
                -{discount}%
              </span>
            )}
            {!inStock && (
              <span className="font-mono text-[10px] font-medium bg-surface/90 text-muted border border-border px-2.5 py-0.5 rounded-sm">
                Out of stock
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="px-0.5">
        <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-muted mb-1">
          {product.category.name}
        </p>
        <p className="font-sans font-medium text-[14px] text-text leading-snug line-clamp-1 mb-1.5">
          {product.name}
        </p>
        <div className="flex items-baseline gap-2">
          <span className="font-mono font-bold text-[13px] text-text">{formatPrice(product.price)}</span>
          {onSale && (
            <span className="font-mono text-[12px] text-muted line-through">{formatPrice(product.compareAt!)}</span>
          )}
        </div>
      </div>
    </Link>
  )
}
