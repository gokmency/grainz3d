'use client'

import { signOut } from '@/app/auth/actions'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

export function SignOutButton() {
  return (
    <form action={signOut}>
      <Button
        type="submit"
        variant="ghost"
        size="sm"
        className="text-zinc-400 hover:text-white hover:bg-zinc-800"
      >
        <LogOut className="w-4 h-4 mr-2" />
        Sign out
      </Button>
    </form>
  )
}
