import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getAllPresets } from '@/app/presets/actions'
import { MODELS, getModelById } from '@/lib/config'
import { Bookmark, Settings2, Box } from 'lucide-react'

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

  // Group presets by model
  const presetsByModel = presets.reduce<Record<string, typeof presets>>(
    (acc, preset) => {
      const modelId = preset.modelId
      if (!acc[modelId]) acc[modelId] = []
      acc[modelId].push(preset)
      return acc
    },
    {}
  )

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-zinc-400 mt-1">
              {profile?.full_name || profile?.email || user.email}
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/settings"
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-600 transition-colors"
            >
              <Settings2 className="w-4 h-4" />
              Settings
            </Link>
            <Link
              href="/configurator"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-black hover:bg-white/90 transition-colors"
            >
              <Box className="w-4 h-4" />
              Configurator
            </Link>
          </div>
        </div>

        <section>
          <h2 className="text-xl font-semibold mb-4">Your presets</h2>
          {presets.length === 0 ? (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-12 text-center">
              <Bookmark className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
              <p className="text-zinc-400 mb-4">No presets yet</p>
              <Link
                href="/configurator"
                className="text-white font-medium hover:underline"
              >
                Create your first preset in the configurator
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(presetsByModel).map(([modelId, modelPresets]) => {
                const model = getModelById(modelId) || MODELS.find((m) => m.id === modelId)
                const modelName = model?.name || modelId

                return (
                  <div
                    key={modelId}
                    className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6"
                  >
                    <h3 className="font-medium text-zinc-300 mb-3">{modelName}</h3>
                    <div className="space-y-2">
                      {modelPresets.map((preset) => (
                        <Link
                          key={preset.id}
                          href={`/configurator?model=${modelId}`}
                          className="flex items-center gap-3 px-4 py-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors"
                        >
                          <Bookmark className="w-4 h-4 text-zinc-500" />
                          <span className="flex-1">{preset.name}</span>
                          {preset.isFavorite && (
                            <span className="text-amber-500 text-sm">★</span>
                          )}
                          <span className="text-xs text-zinc-500">
                            {new Date(preset.createdAt).toLocaleDateString()}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
