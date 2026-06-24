import { auth } from '@/lib/auth'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar session={session} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
