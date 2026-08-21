import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getAllPresets } from '@/app/presets/actions'
import { DashboardLayout } from '@/components/ui/dashboard-layout'
import { DashboardView } from '@/app/dashboard/dashboard-view'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email')
    .eq('id', user.id)
    .single()

  const presets = await getAllPresets()
  const displayName = profile?.full_name || profile?.email || user.email || 'User'

  return (
    <DashboardLayout
      displayName={displayName}
      presetCount={presets.length}
      activeNav="dashboard"
    >
      <DashboardView />
    </DashboardLayout>
  )
}
