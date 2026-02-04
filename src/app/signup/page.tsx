'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signUp } from '@/app/auth/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AuthPageLayout } from '@/components/ui/auth-page-layout'

export default function SignUpPage() {
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setError(null)
    const result = await signUp(formData)
    if (result?.error) {
      setError(result.error)
    }
  }

  return (
    <AuthPageLayout>
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Create account</h1>
        <p className="text-muted-foreground text-sm">
          Sign up to access the configurator
        </p>
        <p className="text-muted-foreground text-xs mt-2">
          You&apos;ll receive a verification email before you can sign in.
        </p>
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-400 border border-red-500/20">
          {error}
        </p>
      )}

      <form action={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className="h-12 bg-background border-border/60 focus:border-primary"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="new-password"
            minLength={6}
            placeholder="••••••••"
            className="h-12 bg-background border-border/60 focus:border-primary"
          />
          <p className="text-xs text-muted-foreground">
            Must be at least 6 characters
          </p>
        </div>
        <Button
          type="submit"
          className="w-full h-12 text-base font-medium"
          size="lg"
        >
          Sign up
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-foreground hover:underline">
          Sign in
        </Link>
      </p>
    </AuthPageLayout>
  )
}
