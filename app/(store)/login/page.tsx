'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { signInWithCredentials, signInWithGitHub } from '@/actions/auth'

const GITHUB_ICON = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
)

function LoginForm() {
  const searchParams = useSearchParams()
  const registered = searchParams.get('registered') === '1'

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const fd = new FormData(e.currentTarget)
    try {
      const result = await signInWithCredentials({
        email:    fd.get('email') as string,
        password: fd.get('password') as string,
      })
      // Action returned { error } → wrong credentials
      if (result?.error) {
        setError(result.error)
        setLoading(false)
      }
      // On success the server action throws NEXT_REDIRECT → browser navigates automatically
    } catch (err: unknown) {
      const digest = (err as { digest?: string })?.digest
      if (digest?.startsWith('NEXT_REDIRECT')) throw err // let Next.js handle the navigation
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  const inputCls =
    'w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm font-sans text-text ' +
    'placeholder:text-muted/40 focus:outline-none focus:ring-1 focus:ring-accent/40 transition-colors'
  const labelCls = 'block font-mono text-[10px] uppercase tracking-[0.12em] text-muted mb-1.5'

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8">
        <h1 className="font-sans font-medium text-[1.6rem] text-text tracking-tight leading-none mb-2">
          Sign in
        </h1>
        <p className="font-sans text-sm text-muted">Welcome back to Vela.</p>
      </div>

      {registered && (
        <div className="mb-6 px-4 py-3 bg-green-500/10 border border-green-500/20 rounded-xl text-xs font-sans text-green-700 dark:text-green-400">
          Account created — sign in below.
        </div>
      )}

      {/* GitHub */}
      <form action={signInWithGitHub}>
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-3 py-3 border border-border rounded-xl text-sm font-sans font-medium text-text bg-surface hover:bg-surface-2 transition-colors mb-6"
        >
          {GITHUB_ICON}
          Continue with GitHub
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 h-px bg-border" />
        <span className="font-mono text-[10px] text-muted uppercase tracking-widest">or</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Credentials */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="px-4 py-3 bg-red-500/5 border border-red-500/20 rounded-xl text-xs font-sans text-red-500">
            {error}
          </div>
        )}

        <div>
          <label className={labelCls}>Email</label>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className={inputCls}
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className={labelCls}>Password</label>
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className={inputCls}
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-text text-background font-sans font-semibold text-sm rounded-xl hover:bg-text/90 transition-colors disabled:opacity-60"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className="text-xs font-sans text-muted text-center mt-6">
        No account?{' '}
        <Link href="/register" className="text-text underline underline-offset-2 hover:text-accent transition-colors">
          Create one
        </Link>
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-68px)] flex items-center justify-center px-6 py-16">
      <Suspense fallback={<div className="w-full max-w-sm h-96 animate-pulse bg-surface rounded-2xl" />}>
        <LoginForm />
      </Suspense>
    </div>
  )
}
