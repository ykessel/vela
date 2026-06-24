import { Resend } from 'resend'
import type { Order, OrderItem, Product } from '@prisma/client'

export const resend = new Resend(process.env.RESEND_API_KEY)

export type OrderWithItems = Order & {
  items: (OrderItem & { product: Product })[]
}

export async function sendOrderConfirmation(order: OrderWithItems) {
  const { OrderConfirmationEmail } = await import('@/emails/OrderConfirmation')

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? 'ShopForge <onboarding@resend.dev>',
    to:   order.shippingEmail ?? '',
    subject: `Order confirmed — #${order.id.slice(-8).toUpperCase()}`,
    react: OrderConfirmationEmail({ order }),
  })
}
