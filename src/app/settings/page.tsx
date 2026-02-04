import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SettingsForm } from './SettingsForm'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, avatar_url')
    .eq('id', user.id)
    .single()

  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 shadow-xl">
          <h1 className="text-2xl font-bold text-white mb-2">Profile settings</h1>
          <p className="text-zinc-400 text-sm mb-6">
            Update your profile information
          </p>

          <SettingsForm
            email={user.email ?? ''}
            fullName={profile?.full_name ?? ''}
            avatarUrl={profile?.avatar_url ?? ''}
          />
        </div>
      </div>
    </main>
  )
}
