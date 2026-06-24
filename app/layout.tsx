import type { Metadata } from 'next'
import { Hanken_Grotesk, Newsreader, Space_Mono } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/components/cart/CartProvider'
import { Toaster } from '@/components/ui/Toaster'

const hanken = Hanken_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-hanken',
  display: 'swap',
})

const newsreader = Newsreader({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['italic'],
  variable: '--font-newsreader',
  display: 'swap',
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title:       { default: 'Vela', template: '%s — Vela' },
  description: 'Objetos considerados para una vida bien curada.',
  metadataBase: new URL(process.env.NEXTAUTH_URL ?? 'http://localhost:3000'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `(function(){try{var t=localStorage.getItem('vela-theme');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.setAttribute('data-theme',t||(d?'dark':'light'));}catch(e){}})();`
        }} />
      </head>
      <body className={`${hanken.variable} ${newsreader.variable} ${spaceMono.variable}`}>
        <CartProvider>
          {children}
          <Toaster />
        </CartProvider>
      </body>
    </html>
  )
}
