import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user)             redirect('/login')
  if (session.user.role !== 'ADMIN') redirect('/')

  return (
    <div className="min-h-screen flex bg-background">
      <AdminSidebar user={session.user} />
      <main className="flex-1 min-w-0 overflow-y-auto p-8">{children}</main>
    </div>
  )
}
