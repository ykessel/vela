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
      <Preview>Tu pedido #{orderId} ha sido confirmado — ShopForge</Preview>
      <Body style={{ backgroundColor: '#f9fafb', fontFamily: 'system-ui, sans-serif', margin: 0 }}>
        <Container style={{ maxWidth: '560px', margin: '40px auto', backgroundColor: '#fff', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e5e7eb' }}>

          {/* Header */}
          <Section style={{ backgroundColor: '#111827', padding: '32px 40px' }}>
            <Heading style={{ color: '#fff', fontSize: '22px', fontWeight: 700, margin: 0 }}>
              ShopForge
            </Heading>
          </Section>

          {/* Body */}
          <Section style={{ padding: '40px' }}>
            <Heading style={{ fontSize: '20px', fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>
              ¡Pedido confirmado!
            </Heading>
            <Text style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 24px' }}>
              Hola{order.shippingName ? ` ${order.shippingName.split(' ')[0]}` : ''}, tu pedido #{orderId} ha sido recibido y está siendo procesado.
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
                  <Text style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#111827' }}>{item.name}</Text>
                  <Text style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>Cantidad: {item.quantity}</Text>
                </Column>
                <Column style={{ textAlign: 'right' }}>
                  <Text style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#111827' }}>
                    {formatPrice(item.price * item.quantity)}
                  </Text>
                </Column>
              </Row>
            ))}

            <Hr style={{ borderColor: '#e5e7eb', margin: '24px 0' }} />

            {/* Totals */}
            <Row>
              <Column><Text style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>Subtotal</Text></Column>
              <Column style={{ textAlign: 'right' }}><Text style={{ margin: 0, fontSize: '13px', color: '#111827' }}>{formatPrice(order.subtotal)}</Text></Column>
            </Row>
            <Row style={{ marginTop: '4px' }}>
              <Column><Text style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>Envío</Text></Column>
              <Column style={{ textAlign: 'right' }}><Text style={{ margin: 0, fontSize: '13px', color: '#111827' }}>{order.shipping === 0 ? 'Gratis' : formatPrice(order.shipping)}</Text></Column>
            </Row>
            <Row style={{ marginTop: '8px' }}>
              <Column><Text style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#111827' }}>Total</Text></Column>
              <Column style={{ textAlign: 'right' }}><Text style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#111827' }}>{formatPrice(order.total)}</Text></Column>
            </Row>

            {/* Shipping address */}
            {order.shippingAddress && (
              <>
                <Hr style={{ borderColor: '#e5e7eb', margin: '24px 0' }} />
                <Text style={{ margin: '0 0 4px', fontSize: '12px', fontWeight: 600, color: '#111827', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Dirección de envío
                </Text>
                <Text style={{ margin: 0, fontSize: '13px', color: '#6b7280', lineHeight: 1.6 }}>
                  {order.shippingName}<br />
                  {order.shippingAddress}<br />
                  {order.shippingCity}, {order.shippingCountry}
                </Text>
              </>
            )}
          </Section>

          {/* Footer */}
          <Section style={{ backgroundColor: '#f9fafb', padding: '20px 40px', borderTop: '1px solid #e5e7eb' }}>
            <Text style={{ margin: 0, fontSize: '11px', color: '#9ca3af', textAlign: 'center' }}>
              ShopForge · Si tienes alguna pregunta responde a este email.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
