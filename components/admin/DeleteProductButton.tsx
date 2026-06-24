'use client'

import { useRouter } from 'next/navigation'

export function DeleteProductButton({ productId }: { productId: string }) {
  const router = useRouter()

  async function handle() {
    if (!confirm('¿Eliminar este producto?')) return
    await fetch(`/api/admin/products/${productId}`, { method: 'DELETE' })
    router.refresh()
  }

  return (
    <button onClick={handle} className="text-[11px] font-sans text-muted hover:text-danger transition-colors">
      Eliminar
    </button>
  )
}
