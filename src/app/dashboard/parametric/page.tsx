import Link from 'next/link'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getAllPresets } from '@/app/presets/actions'
import { MODELS, getModelById } from '@/lib/config'
import { DashboardLayout } from '@/components/ui/dashboard-layout'
import { Bookmark, ChevronRight, Star, ArrowLeft } from 'lucide-react'

const getModelImage = (modelId: string): string => {
  const imageMap: Record<string, string> = {
    'model-1': '/chair.png',
    'model-2': '/table.png',
    'model-3': '/vase.png',
  }
  return imageMap[modelId] || '/chair.png'
}

export default async function ParametricPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email')
    .eq('id', user.id)
    .single()

  const presets = await getAllPresets()

  const presetsByModel: Record<string, typeof presets> = {}
  for (const preset of presets) {
    const modelId = preset.modelId
    if (!presetsByModel[modelId]) {
      presetsByModel[modelId] = []
    }
    presetsByModel[modelId].push(preset)
  }

  const displayName = profile?.full_name || profile?.email || user.email || 'User'

  return (
    <DashboardLayout
      displayName={displayName}
      presetCount={presets.length}
      activeNav="dashboard"
    >
      <div className="flex-1 p-6 lg:p-10 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Panele Geri Dön
          </Link>

          {/* Models section */}
          <section className="mb-12">
            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-tight text-foreground mb-1">
                Düzenlemek için bir model seçin
              </h2>
              <p className="text-muted-foreground text-sm">
                Editörü açmak ve tasarlamaya başlamak için bir model seçin
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {MODELS.map((model) => {
                const presetCount = presetsByModel[model.id]?.length ?? 0
                return (
                  <Link
                    key={model.id}
                    href={`/configurator?model=${model.id}`}
                    className="group block rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
                  >
                    <div className="aspect-[4/3] relative bg-muted overflow-hidden">
                      <Image
                        src={getModelImage(model.id)}
                        alt={model.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-200"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                    <div className="p-4 flex items-center justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                          {model.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {presetCount} kayıtlı preset
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 shrink-0 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>

          {/* Presets section */}
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-tight text-foreground mb-1">
                Kayıtlı Hazır Ayarlarınız (Presets)
              </h2>
              <p className="text-muted-foreground text-sm">
                Kaydettiğiniz model konfigürasyonlarına hızlı erişim
              </p>
            </div>
            {presets.length === 0 ? (
              <div className="rounded-2xl border border-border bg-card p-12 text-center">
                <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 mx-auto mb-4">
                  <Bookmark className="w-8 h-8 text-primary" />
                </div>
                <p className="text-foreground font-medium mb-2">Henüz kayıtlı preset yok</p>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  Editörü açmak ve ilk hazır ayarınızı kaydetmek için yukarıdan bir model seçin
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {presets.map((preset) => {
                  const model = getModelById(preset.modelId) || MODELS.find((m) => m.id === preset.modelId)
                  const modelName = model?.name || preset.modelId
                  const configParam = Object.keys(preset.values).length > 0
                    ? `&config=${encodeURIComponent(Buffer.from(JSON.stringify(preset.values)).toString('base64'))}`
                    : ''
                  return (
                    <Link
                      key={preset.id}
                      href={`/configurator?model=${preset.modelId}${configParam}`}
                      className="group block rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
                    >
                      <div className="aspect-[4/3] relative bg-muted overflow-hidden">
                        <Image
                          src={getModelImage(preset.modelId)}
                          alt={preset.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-200"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        {preset.isFavorite && (
                          <span className="absolute top-2 right-2 rounded-full bg-amber-500/90 p-1">
                            <Star className="w-4 h-4 text-white fill-white" />
                          </span>
                        )}
                      </div>
                      <div className="p-4 flex items-center justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                            {preset.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {modelName} · {new Date(preset.createdAt).toLocaleDateString('tr-TR')}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 shrink-0 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </DashboardLayout>
  )
}
