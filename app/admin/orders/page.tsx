import { db } from '@/lib/db'
import { formatPrice } from '@/lib/stripe'
import { OrderStatusSelect } from '@/components/admin/OrderStatusSelect'

export const metadata = { title: 'Admin — Pedidos' }

export default async function AdminOrdersPage() {
  const orders = await db.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { items: { include: { product: true } }, user: true },
  })

  return (
    <div>
      <h1 className="font-sans font-bold text-xl text-text mb-8">Pedidos</h1>
      <div className="bg-surface border border-border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {['ID', 'Cliente', 'Productos', 'Total', 'Estado', 'Fecha'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-[11px] font-sans font-semibold text-muted uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.map((order: typeof orders[0]) => (
              <tr key={order.id} className="hover:bg-surface-2 transition-colors">
                <td className="px-4 py-3 font-mono text-[11px] text-muted">
                  #{order.id.slice(-8).toUpperCase()}
                </td>
                <td className="px-4 py-3">
                  <p className="text-xs font-sans text-text">{order.shippingName || order.user?.name || '—'}</p>
                  <p className="text-[10px] font-sans text-muted">{order.shippingEmail || order.user?.email}</p>
                </td>
                <td className="px-4 py-3 text-xs font-sans text-muted">{order.items.length}</td>
                <td className="px-4 py-3 text-xs font-sans font-semibold text-text">
                  {formatPrice(order.total)}
                </td>
                <td className="px-4 py-3">
                  <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                </td>
                <td className="px-4 py-3 text-[11px] font-sans text-muted">
                  {new Date(order.createdAt).toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
