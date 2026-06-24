import { db } from '@/lib/db'
import { formatPrice } from '@/lib/stripe'

export const metadata = { title: 'Admin — Dashboard' }

export default async function AdminDashboard() {
  const [totalOrders, totalRevenue, totalProducts, recentOrders] = await Promise.all([
    db.order.count({ where: { status: { not: 'CANCELLED' } } }),
    db.order.aggregate({
      where: { status: 'PAID' },
      _sum: { total: true },
    }),
    db.product.count(),
    db.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 8,
      include: { items: true },
    }),
  ])

  const revenue = totalRevenue._sum.total ?? 0

  const stats = [
    { label: 'Ingresos totales', value: formatPrice(revenue), sub: 'Pedidos pagados' },
    { label: 'Pedidos',          value: totalOrders,           sub: 'Sin cancelados' },
    { label: 'Productos',        value: totalProducts,         sub: 'En catálogo' },
  ]

  return (
    <div>
      <h1 className="font-sans font-bold text-xl text-text mb-8">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {stats.map((s: typeof stats[0]) => (
          <div key={s.label} className="bg-surface border border-border rounded-2xl p-5">
            <p className="text-xs font-sans text-muted mb-1">{s.label}</p>
            <p className="font-sans font-bold text-2xl text-text">{s.value}</p>
            <p className="text-[10px] font-sans text-muted mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-sans font-semibold text-sm text-text">Pedidos recientes</h2>
        </div>
        <div className="divide-y divide-border">
          {recentOrders.map((order: typeof recentOrders[0]) => (
            <div key={order.id} className="px-6 py-3 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-sans font-medium text-text">
                  #{order.id.slice(-8).toUpperCase()}
                </p>
                <p className="text-[10px] font-sans text-muted">
                  {order.shippingName} · {order.items.length} producto{order.items.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <StatusBadge status={order.status} />
                <span className="text-xs font-sans font-semibold text-text">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PAID:      'bg-success/10 text-success',
    PENDING:   'bg-warning/10 text-warning',
    SHIPPED:   'bg-blue-500/10 text-blue-500',
    DELIVERED: 'bg-success/10 text-success',
    CANCELLED: 'bg-danger/10 text-danger',
  }
  const labels: Record<string, string> = {
    PAID: 'Pagado', PENDING: 'Pendiente', SHIPPED: 'Enviado',
    DELIVERED: 'Entregado', CANCELLED: 'Cancelado',
  }
  return (
    <span className={`text-[10px] font-sans font-medium px-2 py-0.5 rounded-full ${styles[status] ?? ''}`}>
      {labels[status] ?? status}
    </span>
  )
}
