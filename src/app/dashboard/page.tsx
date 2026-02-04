import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getAllPresets } from '@/app/presets/actions'
import { MODELS, getModelById } from '@/lib/config'
import { Bookmark, Settings2, Box, ChevronRight, Sparkles, Home, Star } from 'lucide-react'

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

  const presetsByModel = presets.reduce<Record<string, typeof presets>>(
    (acc, preset) => {
      const modelId = preset.modelId
      if (!acc[modelId]) acc[modelId] = []
      acc[modelId].push(preset)
      return acc
    },
    {}
  )

  const displayName = profile?.full_name || profile?.email || user.email || 'User'

  return (
    <div className="min-h-screen grid lg:grid-cols-[320px_1fr]">
      {/* Left Sidebar - Login page theme */}
      <aside className="relative hidden lg:flex flex-col justify-between bg-gradient-to-br from-primary/90 via-primary to-primary/80 p-8 text-primary-foreground">
        <div className="relative z-20">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
          >
            <div className="size-8 rounded-lg bg-primary-foreground/10 backdrop-blur-sm flex items-center justify-center">
              <Sparkles className="size-4" />
            </div>
            <span>Grainz3D</span>
          </Link>
        </div>

        <div className="relative z-20 space-y-6">
          <div>
            <p className="text-sm text-primary-foreground/60 mb-1">Welcome back</p>
            <p className="font-semibold text-lg truncate">{displayName}</p>
          </div>
          <nav className="space-y-2">
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-primary-foreground/90 hover:bg-primary-foreground/10 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            <Link
              href="/settings"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-primary-foreground/90 hover:bg-primary-foreground/10 transition-colors"
            >
              <Settings2 className="w-4 h-4" />
              <span>Settings</span>
            </Link>
          </nav>
        </div>

        <div className="relative z-20 flex flex-col gap-4 text-sm text-primary-foreground/60">
          <div className="flex items-center gap-2">
            <Box className="w-4 h-4" />
            <span>{MODELS.length} model{MODELS.length !== 1 ? 's' : ''} available</span>
          </div>
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4" />
            <span>{presets.length} preset{presets.length !== 1 ? 's' : ''} saved</span>
          </div>
        </div>

        {/* Decorative elements - same as login */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" />
        <div className="absolute top-1/4 right-1/4 size-64 bg-primary-foreground/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 size-96 bg-primary-foreground/5 rounded-full blur-3xl" />
      </aside>

      {/* Main Content */}
      <main className="flex flex-col min-h-screen bg-background">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center justify-between px-4 py-4 border-b border-border">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold text-foreground"
          >
            <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sparkles className="size-4 text-primary" />
            </div>
            <span>Grainz3D</span>
          </Link>
          <div className="flex gap-2">
            <Link
              href="/settings"
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors text-sm"
            >
              <Settings2 className="w-4 h-4" />
              Settings
            </Link>
          </div>
        </header>

        <div className="flex-1 p-6 lg:p-10 overflow-auto">
          <div className="max-w-4xl mx-auto">
            {/* Welcome - mobile only */}
            <div className="lg:hidden mb-8">
              <p className="text-muted-foreground text-sm">Welcome back</p>
              <h1 className="text-2xl font-bold text-foreground truncate">{displayName}</h1>
            </div>

            {/* Models section */}
            <section className="mb-12">
              <div className="mb-6">
                <h2 className="text-2xl font-bold tracking-tight text-foreground mb-1">
                  Choose a model to edit
                </h2>
                <p className="text-muted-foreground text-sm">
                  Select a model to open the configurator and start designing
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {MODELS.map((model) => {
                  const presetCount = presetsByModel[model.id]?.length ?? 0
                  return (
                    <Link
                      key={model.id}
                      href={`/configurator?model=${model.id}`}
                      className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
                    >
                      <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                        <Box className="w-7 h-7" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                          {model.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {presetCount} preset{presetCount !== 1 ? 's' : ''} saved
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 shrink-0 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                    </Link>
                  )
                })}
              </div>
            </section>

            {/* Presets section */}
            <section>
              <div className="mb-6">
                <h2 className="text-2xl font-bold tracking-tight text-foreground mb-1">
                  Your presets
                </h2>
                <p className="text-muted-foreground text-sm">
                  Quick access to your saved configurations
                </p>
              </div>
              {presets.length === 0 ? (
                <div className="rounded-2xl border border-border bg-card p-12 text-center">
                  <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 mx-auto mb-4">
                    <Bookmark className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-foreground font-medium mb-2">No presets yet</p>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                    Select a model above to open the editor and save your first preset
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(presetsByModel).map(([modelId, modelPresets]) => {
                    const model = getModelById(modelId) || MODELS.find((m) => m.id === modelId)
                    const modelName = model?.name || modelId

                    return (
                      <div
                        key={modelId}
                        className="rounded-2xl border border-border bg-card p-6"
                      >
                        <h3 className="font-medium text-foreground mb-4 flex items-center gap-2">
                          <Box className="w-4 h-4 text-primary" />
                          {modelName}
                        </h3>
                        <div className="space-y-2">
                          {modelPresets.map((preset) => (
                            <Link
                              key={preset.id}
                              href={`/configurator?model=${modelId}`}
                              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-muted/50 hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-all group"
                            >
                              <Bookmark className="w-4 h-4 text-muted-foreground group-hover:text-primary shrink-0 transition-colors" />
                              <span className="flex-1 text-foreground truncate">{preset.name}</span>
                              {preset.isFavorite && (
                                <Star className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
                              )}
                              <span className="text-xs text-muted-foreground shrink-0">
                                {new Date(preset.createdAt).toLocaleDateString()}
                              </span>
                              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary shrink-0 transition-colors" />
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
        </div>
      </main>
    </div>
  )
}
