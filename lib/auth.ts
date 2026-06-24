import NextAuth from 'next-auth'
import type { NextAuthConfig } from 'next-auth'
import GitHub from 'next-auth/providers/github'
import Credentials from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { db } from './db'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role: 'USER' | 'ADMIN'
    }
  }
}

const config: NextAuthConfig = {
  adapter: PrismaAdapter(db),
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    Credentials({
      credentials: {
        email:    { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const user = await db.user.findUnique({
          where: { email: credentials.email as string },
        })
        if (!user?.password) return null
        // Simple comparison — in production use bcrypt
        const { default: bcrypt } = await import('bcryptjs')
        const valid = await bcrypt.compare(credentials.password as string, user.password)
        if (!valid) return null
        return user
      },
    }),
  ],
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id   = user.id
        session.user.role = (user as any).role ?? 'USER'
      }
      return session
    },
  },
  pages: { signIn: '/login' },
  session: { strategy: 'database' },
}

export const { handlers, auth, signIn, signOut } = NextAuth(config)
