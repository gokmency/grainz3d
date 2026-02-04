import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getAllPresets } from '@/app/presets/actions'
import { SettingsForm } from './SettingsForm'
import { DashboardLayout } from '@/components/ui/dashboard-layout'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, avatar_url')
    .eq('id', user.id)
    .single()

  const presets = await getAllPresets()
  const displayName = profile?.full_name || user.email || 'User'

  return (
    <DashboardLayout
      displayName={displayName}
      presetCount={presets.length}
      activeNav="settings"
    >
      <div className="flex-1 p-6 lg:p-10 overflow-auto">
        <div className="max-w-md mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-foreground mb-1">
              Profile settings
            </h1>
            <p className="text-muted-foreground text-sm">
              Update your profile information
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <SettingsForm
              email={user.email ?? ''}
              fullName={profile?.full_name ?? ''}
              avatarUrl={profile?.avatar_url ?? ''}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
