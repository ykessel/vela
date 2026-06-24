'use server'

import { AuthError } from 'next-auth'
import { signIn, signOut } from '@/lib/auth'
import { db } from '@/lib/db'
import { registerSchema } from '@/lib/validations'
import { redirect } from 'next/navigation'

export async function signInWithGitHub() {
  await signIn('github', { redirectTo: '/' })
}

export async function signInWithCredentials(data: { email: string; password: string }) {
  try {
    // On success → NextAuth throws NEXT_REDIRECT (we re-throw it below)
    // On bad credentials → NextAuth throws AuthError (we catch it and return error)
    await signIn('credentials', { ...data, redirectTo: '/' })
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: 'Incorrect email or password.' }
    }
    throw error // Re-throw NEXT_REDIRECT so navigation fires on success
  }
}

export async function signOutAction() {
  await signOut({ redirectTo: '/' })
}

export async function registerUser(data: unknown) {
  const parsed = registerSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.errors[0].message }

  const { name, email, password } = parsed.data

  const exists = await db.user.findUnique({ where: { email } })
  if (exists) return { error: 'An account with this email already exists.' }

  const { default: bcrypt } = await import('bcryptjs')
  const hashed = await bcrypt.hash(password, 12)

  await db.user.create({ data: { name, email, password: hashed } })
  redirect('/login?registered=1')
}
