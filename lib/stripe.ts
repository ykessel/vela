import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
  typescript: true,
})

export function formatPrice(cents: number, currency = 'usd'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(cents / 100)
}

export function toStripeAmount(cents: number): number {
  return Math.round(cents)
}

export type CartItem = {
  productId: string
  name: string
  price: number   // cents
  image?: string
  quantity: number
  slug: string
}

export async function createCheckoutSession({
  items,
  userId,
  successUrl,
  cancelUrl,
}: {
  items: CartItem[]
  userId?: string
  successUrl: string
  cancelUrl: string
}) {
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(item => ({
    price_data: {
      currency: 'usd',
      unit_amount: item.price,
      product_data: {
        name: item.name,
        images: item.image ? [item.image] : [],
        metadata: { productId: item.productId },
      },
    },
    quantity: item.quantity,
  }))

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: lineItems,
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: { userId: userId ?? '' },
    shipping_address_collection: { allowed_countries: ['US', 'CA', 'MX', 'ES', 'GB'] },
    payment_intent_data: { metadata: { userId: userId ?? '' } },
  })

  return session
}
