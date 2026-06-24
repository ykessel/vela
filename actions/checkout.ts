'use server'

import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { createCheckoutSession } from '@/lib/stripe'
import type { CartItem } from '@/lib/stripe'

export async function startCheckout(items: CartItem[]) {
  if (!items.length) return { error: 'Carrito vacío' }

  const session = await auth()

  const baseUrl = process.env.NEXTAUTH_URL ?? 'http://localhost:3000'

  const stripeSession = await createCheckoutSession({
    items,
    userId:     session?.user?.id,
    successUrl: `${baseUrl}/orders/success?session_id={CHECKOUT_SESSION_ID}`,
    cancelUrl:  `${baseUrl}/cart`,
  })

  if (!stripeSession.url) return { error: 'Error al crear sesión de pago' }

  redirect(stripeSession.url)
}
