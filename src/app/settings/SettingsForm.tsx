'use client'

import { useState } from 'react'
import Link from 'next/link'
import { updateProfile } from '@/app/auth/actions'
import { Button } from '@/components/ui/button'

interface SettingsFormProps {
  email: string
  fullName: string
  avatarUrl: string
}

export function SettingsForm({ email, fullName, avatarUrl }: SettingsFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(formData: FormData) {
    setError(null)
    setSuccess(false)
    const result = await updateProfile(formData)
    if (result?.error) {
      setError(result.error)
    } else {
      setSuccess(true)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      {error && (
        <p className="rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-400 border border-red-500/20">
          {error}
        </p>
      )}
      {success && (
        <p className="rounded-lg bg-emerald-500/10 px-4 py-2 text-sm text-emerald-400 border border-emerald-500/20">
          Profile updated successfully
        </p>
      )}

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-zinc-300 mb-1"
        >
          Email (read-only)
        </label>
        <input
          id="email"
          type="email"
          value={email}
          disabled
          className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-2.5 text-zinc-500 cursor-not-allowed"
        />
      </div>

      <div>
        <label
          htmlFor="full_name"
          className="block text-sm font-medium text-zinc-300 mb-1"
        >
          Full name
        </label>
        <input
          id="full_name"
          name="full_name"
          type="text"
          defaultValue={fullName}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
          placeholder="Your name"
        />
      </div>

      <div>
        <label
          htmlFor="avatar_url"
          className="block text-sm font-medium text-zinc-300 mb-1"
        >
          Avatar URL
        </label>
        <input
          id="avatar_url"
          name="avatar_url"
          type="url"
          defaultValue={avatarUrl}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
          placeholder="https://..."
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-white text-black hover:bg-white/90"
      >
        Save changes
      </Button>

      <p className="mt-6 text-center text-sm text-zinc-400">
        <Link
          href="/dashboard"
          className="font-medium text-white hover:underline"
        >
          Back to dashboard
        </Link>
      </p>
    </form>
  )
}
