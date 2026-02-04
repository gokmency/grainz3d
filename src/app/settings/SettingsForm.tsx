'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { updateProfile } from '@/app/auth/actions'
import { signOut } from '@/app/auth/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload, User, LogOut } from 'lucide-react'

interface SettingsFormProps {
  email: string
  fullName: string
  avatarUrl: string
}

export function SettingsForm({ email, fullName, avatarUrl }: SettingsFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [preview, setPreview] = useState<string | null>(avatarUrl || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setPreview(avatarUrl || null)
  }, [avatarUrl])

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

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setPreview(URL.createObjectURL(file))
    } else {
      setPreview(avatarUrl || null)
    }
  }

  return (
    <div className="space-y-5">
    <form action={handleSubmit} className="space-y-5">
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

      <div className="space-y-2">
        <Label htmlFor="email">Email (read-only)</Label>
        <Input
          id="email"
          type="email"
          value={email}
          disabled
          className="bg-muted/50 text-muted-foreground cursor-not-allowed h-12"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="full_name">Full name</Label>
        <Input
          id="full_name"
          name="full_name"
          type="text"
          defaultValue={fullName}
          placeholder="Your name"
          className="h-12 bg-background border-border/60 focus:border-primary"
        />
      </div>

      <div className="space-y-2">
        <Label>Avatar</Label>
        <div className="flex items-center gap-4">
          <div className="relative size-20 rounded-full overflow-hidden bg-muted flex items-center justify-center shrink-0">
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={preview}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-10 h-10 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <input
              ref={fileInputRef}
              id="avatar"
              name="avatar"
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="gap-2"
            >
              <Upload className="w-4 h-4" />
              Upload image
            </Button>
            <p className="text-xs text-muted-foreground mt-1">JPEG, PNG, GIF or WebP. Max 1MB.</p>
          </div>
        </div>
        <Input
          name="avatar_url"
          type="hidden"
          value={avatarUrl}
        />
      </div>

      <Button type="submit" className="w-full h-12 text-base font-medium" size="lg">
        Save changes
      </Button>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link href="/dashboard" className="font-medium text-foreground hover:underline">
          Back to dashboard
        </Link>
      </p>
    </form>

    <form action={signOut}>
      <Button
        type="submit"
        variant="outline"
        className="w-full gap-2 text-muted-foreground hover:text-destructive hover:border-destructive/50"
      >
        <LogOut className="w-4 h-4" />
        Sign out
      </Button>
    </form>
    </div>
  )
}
