import {
  Body, Container, Head, Heading, Hr, Html, Img,
  Preview, Row, Column, Section, Text,
} from '@react-email/components'
import type { OrderWithItems } from '@/lib/resend'
import { formatPrice } from '@/lib/stripe'

export function OrderConfirmationEmail({ order }: { order: OrderWithItems }) {
  const orderId = order.id.slice(-8).toUpperCase()

  return (
    <Html>
      <Head />
      <Preview>Your order #{orderId} is confirmed — Vela</Preview>
      <Body style={{ backgroundColor: '#edebe4', fontFamily: 'system-ui, sans-serif', margin: 0 }}>
        <Container style={{ maxWidth: '560px', margin: '40px auto', backgroundColor: '#fff', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e0ddd5' }}>

          {/* Header */}
          <Section style={{ backgroundColor: '#23211c', padding: '32px 40px' }}>
            <Heading style={{ color: '#f5f2ea', fontSize: '20px', fontWeight: 700, margin: 0, letterSpacing: '-0.01em' }}>
              Vela
            </Heading>
          </Section>

          {/* Body */}
          <Section style={{ padding: '40px' }}>
            <Heading style={{ fontSize: '20px', fontWeight: 700, color: '#23211c', margin: '0 0 8px' }}>
              Order confirmed
            </Heading>
            <Text style={{ color: '#6b6560', fontSize: '14px', margin: '0 0 24px' }}>
              Hi{order.shippingName ? ` ${order.shippingName.split(' ')[0]}` : ''}, your order #{orderId} has been received and is being processed.
            </Text>

            {/* Items */}
            {order.items.map(item => (
              <Row key={item.id} style={{ marginBottom: '12px' }}>
                <Column style={{ width: '48px' }}>
                  {item.image && (
                    <Img src={item.image} alt={item.name} width="48" height="48" style={{ borderRadius: '8px', objectFit: 'cover' }} />
                  )}
                </Column>
                <Column style={{ paddingLeft: '12px' }}>
                  <Text style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#23211c' }}>{item.name}</Text>
                  <Text style={{ margin: 0, fontSize: '12px', color: '#6b6560' }}>Qty: {item.quantity}</Text>
                </Column>
                <Column style={{ textAlign: 'right' }}>
                  <Text style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#23211c' }}>
                    {formatPrice(item.price * item.quantity)}
                  </Text>
                </Column>
              </Row>
            ))}

            <Hr style={{ borderColor: '#e0ddd5', margin: '24px 0' }} />

            {/* Totals */}
            <Row>
              <Column><Text style={{ margin: 0, fontSize: '13px', color: '#6b6560' }}>Subtotal</Text></Column>
              <Column style={{ textAlign: 'right' }}><Text style={{ margin: 0, fontSize: '13px', color: '#23211c' }}>{formatPrice(order.subtotal)}</Text></Column>
            </Row>
            <Row style={{ marginTop: '4px' }}>
              <Column><Text style={{ margin: 0, fontSize: '13px', color: '#6b6560' }}>Shipping</Text></Column>
              <Column style={{ textAlign: 'right' }}><Text style={{ margin: 0, fontSize: '13px', color: '#23211c' }}>{order.shipping === 0 ? 'Free' : formatPrice(order.shipping)}</Text></Column>
            </Row>
            <Row style={{ marginTop: '8px' }}>
              <Column><Text style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#23211c' }}>Total</Text></Column>
              <Column style={{ textAlign: 'right' }}><Text style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#23211c' }}>{formatPrice(order.total)}</Text></Column>
            </Row>

            {/* Shipping address */}
            {order.shippingAddress && (
              <>
                <Hr style={{ borderColor: '#e0ddd5', margin: '24px 0' }} />
                <Text style={{ margin: '0 0 4px', fontSize: '12px', fontWeight: 600, color: '#23211c', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Shipping address
                </Text>
                <Text style={{ margin: 0, fontSize: '13px', color: '#6b6560', lineHeight: 1.6 }}>
                  {order.shippingName}<br />
                  {order.shippingAddress}<br />
                  {order.shippingCity}, {order.shippingCountry}
                </Text>
              </>
            )}
          </Section>

          {/* Footer */}
          <Section style={{ backgroundColor: '#edebe4', padding: '20px 40px', borderTop: '1px solid #e0ddd5' }}>
            <Text style={{ margin: 0, fontSize: '11px', color: '#9c9890', textAlign: 'center' }}>
              Vela · Questions? Reply to this email.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
