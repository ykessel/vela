import Link from 'next/link'
import { stripe } from '@/lib/stripe'
import { db } from '@/lib/db'

export const metadata = { title: 'Pedido confirmado' }

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { session_id } = await searchParams

  let order = null
  if (session_id) {
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['line_items'],
    })
    order = await db.order.findUnique({
      where: { stripeSessionId: session_id },
      include: { items: { include: { product: true } } },
    })
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckIcon />
        </div>
        <h1 className="font-sans font-bold text-2xl text-text mb-2">¡Pedido confirmado!</h1>
        {order && (
          <p className="font-sans text-sm text-muted mb-2">
            Pedido #{order.id.slice(-8).toUpperCase()}
          </p>
        )}
        <p className="font-sans text-sm text-muted mb-8">
          Te enviaremos un email de confirmación con los detalles de tu pedido.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/products"
            className="px-6 py-3 bg-text text-background font-sans font-semibold text-sm rounded-xl hover:bg-text/90 transition-colors"
          >
            Seguir comprando
          </Link>
          <Link
            href="/"
            className="px-6 py-3 border border-border text-muted font-sans text-sm rounded-xl hover:text-text hover:border-text/20 transition-colors"
          >
            Ir al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}

function CheckIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}
