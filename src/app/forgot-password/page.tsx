'use client'

import { useState } from 'react'
import Link from 'next/link'
import { resetPassword } from '@/app/auth/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AuthPageLayout } from '@/components/ui/auth-page-layout'

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setError(null)
    const result = await resetPassword(formData)
    if (result?.error) {
      setError(result.error)
    }
  }

  return (
    <AuthPageLayout>
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Şifre Sıfırlama</h1>
        <p className="text-muted-foreground text-sm">
          E-posta adresinizi girin, size şifrenizi sıfırlamanız için bir bağlantı gönderelim
        </p>
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-400 border border-red-500/20">
          {error}
        </p>
      )}

      <form action={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">E-posta Adresi</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="ornek@domain.com"
            className="h-12 bg-background border-border/60 focus:border-primary"
          />
        </div>
        <Button
          type="submit"
          className="w-full h-12 text-base font-medium"
          size="lg"
        >
          Sıfırlama Bağlantısı Gönder
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Şifrenizi hatırladınız mı?{' '}
        <Link href="/login" className="font-medium text-foreground hover:underline">
          Giriş Yap
        </Link>
      </p>
    </AuthPageLayout>
  )
}
