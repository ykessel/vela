'use client'

import { useState } from 'react'
import Link from 'next/link'
import { registerUser } from '@/actions/auth'

export default function RegisterPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const fd = new FormData(e.currentTarget)
    try {
      const result = await registerUser({
        name:     fd.get('name') as string,
        email:    fd.get('email') as string,
        password: fd.get('password') as string,
      })
      if (result?.error) setError(result.error)
    } catch (err: unknown) {
      if ((err as { digest?: string }).digest?.startsWith('NEXT_REDIRECT')) throw err
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm font-sans text-text ' +
    'placeholder:text-muted/40 focus:outline-none focus:ring-1 focus:ring-accent/40 transition-colors'
  const labelClass = 'block font-mono text-[10px] uppercase tracking-[0.12em] text-muted mb-1.5'

  return (
    <div className="min-h-[calc(100vh-68px)] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-sans font-medium text-[1.6rem] text-text tracking-tight leading-none mb-2">
            Create account
          </h1>
          <p className="font-sans text-sm text-muted">Join Vela and start shopping.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="text-xs font-sans text-red-500 bg-red-500/5 border border-red-500/20 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          <div>
            <label className={labelClass}>Full name</label>
            <input
              name="name"
              type="text"
              required
              autoComplete="name"
              className={inputClass}
              placeholder="Jane Smith"
            />
          </div>

          <div>
            <label className={labelClass}>Email</label>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className={inputClass}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className={labelClass}>Password</label>
            <input
              name="password"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              className={inputClass}
              placeholder="Min. 6 characters"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-text text-background font-sans font-semibold text-sm rounded-xl hover:bg-text/90 transition-colors disabled:opacity-60 mt-2"
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="text-xs font-sans text-muted text-center mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-text underline underline-offset-2 hover:text-accent transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
