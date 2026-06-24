import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { db } from '@/lib/db'
import { sendOrderConfirmation } from '@/lib/resend'
import type Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const body      = await req.text()
  const signature = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    // Retrieve full session with line items
    const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ['line_items.data.price.product'],
    })

    const userId = session.metadata?.userId || undefined
    const shipping = session.shipping_details

    // Build order items from line items
    const lineItems = fullSession.line_items?.data ?? []

    // Try to match products by name
    const orderItems = await Promise.all(
      lineItems.map(async item => {
        const stripeProduct = item.price?.product as Stripe.Product | undefined
        const productId     = stripeProduct?.metadata?.productId
        const product       = productId
          ? await db.product.findUnique({ where: { id: productId } })
          : null

        return {
          productId: product?.id ?? '',
          quantity:  item.quantity ?? 1,
          price:     item.price?.unit_amount ?? 0,
          name:      item.description ?? '',
          image:     product?.images[0] ?? '',
        }
      }),
    )

    const order = await db.order.create({
      data: {
        stripeSessionId: session.id,
        stripePaymentId: session.payment_intent as string,
        status:          'PAID',
        userId:          userId || null,
        total:           session.amount_total ?? 0,
        subtotal:        session.amount_subtotal ?? 0,
        shippingEmail:   session.customer_details?.email ?? '',
        shippingName:    shipping?.name ?? session.customer_details?.name ?? '',
        shippingAddress: [
          shipping?.address?.line1,
          shipping?.address?.line2,
        ].filter(Boolean).join(', '),
        shippingCity:    shipping?.address?.city ?? '',
        shippingCountry: shipping?.address?.country ?? '',
        items:           { create: orderItems.filter(i => i.productId) },
      },
      include: { items: { include: { product: true } } },
    })

    // Send confirmation email (fire and forget)
    sendOrderConfirmation(order).catch(console.error)
  }

  return NextResponse.json({ received: true })
}
