'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { updatePassword } from '@/app/auth/actions'
import { Button } from '@/components/ui/button'

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/dashboard'
  const [isRecovery, setIsRecovery] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()

    const handleCallback = async () => {
      const hash = window.location.hash
      const searchParams = new URLSearchParams(window.location.search)
      const code = searchParams.get('code')

      // OAuth returns with code (PKCE) or hash (implicit)
      if (!hash && !code) {
        router.replace('/login')
        return
      }

      // Exchange code for session (OAuth PKCE flow)
      if (code) {
        const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) {
          console.error('OAuth exchange error:', error)
          router.replace('/login')
          return
        }
        if (session) {
          router.replace(next)
        } else {
          router.replace('/login')
        }
        return
      }

      // Hash flow (magic link, recovery, or implicit OAuth)
      const hashParams = new URLSearchParams(hash.substring(1))
      const type = hashParams.get('type')

      if (type === 'recovery') {
        setIsRecovery(true)
        return
      }

      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.replace(next)
      } else {
        router.replace('/login')
      }
    }

    handleCallback()
  }, [router, next])

  async function handleUpdatePassword(formData: FormData) {
    setError(null)
    const result = await updatePassword(formData)
    if (result?.error) {
      setError(result.error)
    }
  }

  if (isRecovery === null) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="text-zinc-500">Loading...</div>
      </main>
    )
  }

  if (isRecovery) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 shadow-xl">
            <h1 className="text-2xl font-bold text-white mb-2">Set new password</h1>
            <p className="text-zinc-400 text-sm mb-6">
              Enter your new password below
            </p>

            {error && (
              <p className="mb-4 rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-400 border border-red-500/20">
                {error}
              </p>
            )}

            <form action={handleUpdatePassword} className="space-y-4">
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-zinc-300 mb-1"
                >
                  New password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="new-password"
                  minLength={6}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
                  placeholder="••••••••"
                />
                <p className="mt-1 text-xs text-zinc-500">
                  Must be at least 6 characters
                </p>
              </div>
              <Button
                type="submit"
                className="w-full bg-white text-black hover:bg-white/90"
              >
                Update password
              </Button>
            </form>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-950">
      <div className="text-zinc-500">Redirecting...</div>
    </main>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center bg-zinc-950">
          <div className="text-zinc-500">Loading...</div>
        </main>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  )
}
