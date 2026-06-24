import Link from 'next/link'
import Image from 'next/image'
import { db } from '@/lib/db'
import { ProductCard } from '@/components/products/ProductCard'
import { formatPrice } from '@/lib/stripe'

// Premium editorial fashion image — swapped in as hero focal image
const HERO_IMAGE = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&q=90'

export default async function HomePage() {
  const [featured, categories] = await Promise.all([
    db.product.findMany({
      where: { featured: true },
      include: { category: true },
      take: 8,
      orderBy: { createdAt: 'desc' },
    }),
    db.category.findMany({
      include: { _count: { select: { products: true } } },
      take: 5,
      orderBy: { name: 'asc' },
    }),
  ])

  const heroProduct = featured[0]
  const gridProducts = featured.slice(1)

  return (
    <div>
      {/* ─────────────────────────────────────────────────
          HERO — Design C Premium Minimal
      ───────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-8 pt-16 pb-20">
        <div className="grid lg:grid-cols-[1fr_0.82fr] gap-14 items-center">

          {/* Left: editorial text */}
          <div>
            <span className="font-mono text-[12px] tracking-[0.2em] uppercase text-accent">
              Spring / Summer 2025
            </span>

            <h1
              className="font-sans font-medium text-text mt-5"
              style={{
                fontSize: 'clamp(2.4rem, 5vw, 3.875rem)',
                lineHeight: '1.04',
                letterSpacing: '-0.025em',
              }}
            >
              Considered goods<br />
              for a life well<br />
              <em className="font-serif italic text-accent">curated</em>.
            </h1>

            <p
              className="font-sans text-muted mt-6 max-w-[400px]"
              style={{ fontSize: '17px', lineHeight: '1.6' }}
            >
              A tightly edited everything-store. Electronics, apparel, home and reads — chosen so you don&apos;t have to wade through the rest.
            </p>

            <Link
              href="/products"
              className="inline-flex items-center gap-2.5 mt-9 font-sans font-semibold text-[15.5px] text-text border-b border-text pb-1 hover:text-accent hover:border-accent transition-colors"
            >
              Explore the collection →
            </Link>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-12 pt-10 border-t border-border">
              {['Electronics', 'Clothing', 'Home', 'Sports', 'Books'].map((cat, i) => (
                <span key={cat} className="flex items-center gap-4">
                  <span className="font-mono text-[11px] tracking-[0.1em] uppercase text-muted">{cat}</span>
                  {i < 4 && <span className="text-border font-mono text-[11px]">·</span>}
                </span>
              ))}
            </div>
          </div>

          {/* Right: premium editorial fashion image — 4:5 */}
          <div
            className="relative overflow-hidden rounded-2xl bg-surface-2"
            style={{ aspectRatio: '4/5' }}
          >
            <Image
              src={HERO_IMAGE}
              alt="Vela — Spring Summer 2025 collection"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-top"
              priority
            />

            {/* Frosted glass card */}
            {heroProduct && (
              <div className="absolute bottom-5 left-5 right-5">
                <div className="bg-white/70 backdrop-blur-md rounded-xl px-5 py-4">
                  <p className="font-mono text-[11px] tracking-[0.06em] uppercase text-muted">
                    Editor&apos;s pick
                  </p>
                  <p className="font-sans font-semibold text-[17px] text-text mt-1 leading-snug">
                    {heroProduct.name}
                  </p>
                  <p className="font-mono text-sm text-accent mt-1">
                    from {formatPrice(heroProduct.price)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────
          CATEGORIES
      ───────────────────────────────────────────────── */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-8 py-16 border-t border-border">
          <div className="flex items-baseline gap-5 mb-8">
            <span className="font-mono text-[11px] tracking-[0.15em] uppercase text-muted">01 /</span>
            <h2 className="font-sans font-semibold text-[22px] text-text tracking-[-0.015em]">Categories</h2>
            <div className="flex-1 h-px bg-border ml-2" />
            <Link href="/products" className="font-sans text-[13px] font-medium text-muted hover:text-text transition-colors">
              See all →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {categories.map((cat, i) => {
              const isLast = i === categories.length - 1
              return (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  className={`group rounded-2xl p-3.5 hover:shadow-card-hover transition-all duration-300 ${
                    isLast
                      ? 'bg-text border border-text'
                      : 'bg-surface border border-border'
                  }`}
                >
                  <div className={`relative aspect-square rounded-xl overflow-hidden mb-4 ${isLast ? 'bg-white/8' : 'bg-surface-2'}`}>
                    {cat.image ? (
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full" />
                    )}
                  </div>
                  <p className={`font-sans font-semibold text-[15px] ${isLast ? 'text-background' : 'text-text'}`}>
                    {cat.name}
                  </p>
                  <p className={`text-[12.5px] mt-0.5 ${isLast ? 'text-background/55' : 'text-muted'}`}>
                    {cat._count.products} items
                  </p>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────
          FEATURED PRODUCTS
      ───────────────────────────────────────────────── */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-8 py-16 border-t border-border">
          <div className="flex items-baseline gap-5 mb-8">
            <span className="font-mono text-[11px] tracking-[0.15em] uppercase text-muted">02 /</span>
            <h2 className="font-sans font-semibold text-[22px] text-text tracking-[-0.015em]">Editorial selection</h2>
            <div className="flex-1 h-px bg-border ml-2" />
            <Link href="/products" className="font-sans text-[13px] font-medium text-muted hover:text-text transition-colors">
              See all →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {featured.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────
          BRAND PROMISE
      ───────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-8 py-14 border-t border-border">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            {
              n: '01',
              title: 'Editorial curation',
              desc: 'Every product is selected for its design, function, and sustained quality over time.',
            },
            {
              n: '02',
              title: 'Express shipping',
              desc: 'Free on orders over $500. Delivery in 24–48h with real-time tracking.',
            },
            {
              n: '03',
              title: 'Guaranteed returns',
              desc: '30 days, no questions. If it\'s not what you expected, we process a full refund.',
            },
          ].map(item => (
            <div key={item.title}>
              <span className="font-mono text-[11px] tracking-[0.15em] uppercase text-accent">{item.n}</span>
              <p className="font-sans font-semibold text-[15px] text-text mt-3 mb-2">{item.title}</p>
              <p className="font-sans text-[13.5px] text-muted leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
