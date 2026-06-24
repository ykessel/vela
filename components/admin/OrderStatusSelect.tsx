'use client'

import { useState } from 'react'
import { db } from '@/lib/db'

const OPTIONS = ['PENDING','PAID','SHIPPED','DELIVERED','CANCELLED'] as const
const LABELS: Record<string, string> = {
  PENDING: 'Pendiente', PAID: 'Pagado', SHIPPED: 'Enviado',
  DELIVERED: 'Entregado', CANCELLED: 'Cancelado',
}

export function OrderStatusSelect({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus)
  const [loading, setLoading] = useState(false)

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value
    setLoading(true)
    await fetch(`/api/admin/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: next }),
    })
    setStatus(next)
    setLoading(false)
  }

  return (
    <select
      value={status}
      onChange={handleChange}
      disabled={loading}
      className="text-[10px] font-sans bg-surface-2 border border-border rounded-lg px-2 py-1 text-text focus:outline-none focus:border-text/30 transition-colors disabled:opacity-50"
    >
      {OPTIONS.map(o => (
        <option key={o} value={o}>{LABELS[o]}</option>
      ))}
    </select>
  )
}
