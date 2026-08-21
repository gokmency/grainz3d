import Link from 'next/link'
import Image from 'next/image'
import { FolderOpen, FileText, User, Sparkles, Box, ArrowRight, Layers } from 'lucide-react'

export function DashboardView() {
  return (
    <div className="flex-1 p-4 lg:p-8 overflow-auto">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Tasarım &amp; Konfigüratör Paneli
            </h1>
            <p className="text-sm text-muted-foreground">
              Parametrik 3D modellerinizi yönetin ve gerçek zamanlı editörde özelleştirin
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/settings"
              className="p-2.5 rounded-lg border border-border bg-card/80 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
              aria-label="Profile"
            >
              <User className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Main Grid: Featured Hero Banner & Side Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6">
          {/* Main Hero Card */}
          <Link
            href="/dashboard/parametric"
            className="group relative flex flex-col rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 min-h-[360px]"
          >
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <Image
                src="/dashboard-hero.jpg"
                alt="3D Parametrik Tasarım Stüdyosu"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500 brightness-[0.45] group-hover:brightness-[0.55]"
                sizes="(max-width: 1024px) 100vw, 60vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            </div>

            {/* Content on Image */}
            <div className="relative z-10 flex-1 flex flex-col justify-between p-6 lg:p-8">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/30 backdrop-blur-md text-primary-foreground border border-primary/40">
                  <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                  İnteraktif 3D Studio
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-black/40 backdrop-blur-md text-zinc-300 border border-white/10">
                  3 Model Hazır
                </span>
              </div>

              <div className="mt-auto pt-8">
                <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2 tracking-tight">
                  Parametrik 3D Tasarım Modelleri
                </h2>
                <p className="text-zinc-300 text-sm max-w-md mb-6 leading-relaxed">
                  Ölçüleri, eğim açılarını, malzeme kaplamalarını ve aksesuarları milimetrik olarak özelleştirin.
                </p>

                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 group-hover:bg-primary/90 transition-all">
                    <span>Model Seç ve Başla</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <span className="text-xs text-zinc-400">
                    STL &bull; OBJ &bull; GLTF Dışa Aktarma
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* Right Side Cards */}
          <div className="flex flex-col gap-6">
            {/* Grasshopper Card */}
            <Link
              href="/dashboard/parametric"
              className="group flex-1 relative rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 min-h-[170px]"
            >
              <div className="absolute inset-0 z-0">
                <Image
                  src="/dashboard-gh.jpg"
                  alt="Parametrik Modeller (.gh)"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 brightness-[0.5] group-hover:brightness-[0.6]"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />
              </div>

              <div className="relative z-10 p-5 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="p-1.5 rounded-lg bg-primary/20 text-primary border border-primary/30">
                      <Layers className="w-4 h-4" />
                    </span>
                    <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                      Parametrik Modeller (.gh)
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground max-w-[220px]">
                    Grasshopper algoritmik geometri ve gerçek zamanlı dinamik hesaplama
                  </p>
                </div>
                <div className="flex items-center text-xs font-medium text-primary mt-3">
                  <span>Modelleri İncele</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* Mesh & Generative Card */}
            <Link
              href="/dashboard/parametric"
              className="group flex-1 relative rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 min-h-[170px]"
            >
              <div className="absolute inset-0 z-0">
                <Image
                  src="/dashboard-mesh.jpg"
                  alt="Serbest Geometri & Mesh"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 brightness-[0.5] group-hover:brightness-[0.6]"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />
              </div>

              <div className="relative z-10 p-5 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      <Box className="w-4 h-4" />
                    </span>
                    <h3 className="font-bold text-base text-foreground group-hover:text-amber-400 transition-colors">
                      Serbest Geometri &amp; Mesh
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground max-w-[220px]">
                    Yüksek poligonlu 3D mesh detayları, özel doku ve malzeme eşlemeleri
                  </p>
                </div>
                <div className="flex items-center text-xs font-medium text-amber-400 mt-3">
                  <span>Editörde Aç</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Quick Model Carousel / Grid */}
        <div className="mt-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold tracking-tight text-foreground">
              Öne Çıkan Parametrik Modeller
            </h2>
            <Link
              href="/dashboard/parametric"
              className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
            >
              <span>Tümünü Gör</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Model 1: Chair */}
            <Link
              href="/configurator?model=model-1"
              className="group rounded-xl border border-border bg-card overflow-hidden hover:border-primary/50 transition-all"
            >
              <div className="aspect-[4/3] relative bg-muted overflow-hidden">
                <Image
                  src="/chair.png"
                  alt="Ergonomik Dinlenme Koltuğu"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[11px] font-semibold bg-black/60 text-white backdrop-blur-sm">
                  Koltuk
                </span>
              </div>
              <div className="p-3">
                <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                  Ergonomik Dinlenme Koltuğu
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Ölçü, eğim ve kumaş renk ayarı
                </p>
              </div>
            </Link>

            {/* Model 2: Table */}
            <Link
              href="/configurator?model=model-2"
              className="group rounded-xl border border-border bg-card overflow-hidden hover:border-primary/50 transition-all"
            >
              <div className="aspect-[4/3] relative bg-muted overflow-hidden">
                <Image
                  src="/table.png"
                  alt="Minimalist Yemek Masası"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[11px] font-semibold bg-black/60 text-white backdrop-blur-sm">
                  Masa
                </span>
              </div>
              <div className="p-3">
                <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                  Minimalist Yemek Masası
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Genişlik, kalınlık ve ahşap kaplama
                </p>
              </div>
            </Link>

            {/* Model 3: Vase */}
            <Link
              href="/configurator?model=model-3"
              className="group rounded-xl border border-border bg-card overflow-hidden hover:border-primary/50 transition-all"
            >
              <div className="aspect-[4/3] relative bg-muted overflow-hidden">
                <Image
                  src="/vase.png"
                  alt="Seramik Tasarım Vazo"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[11px] font-semibold bg-black/60 text-white backdrop-blur-sm">
                  Obje
                </span>
              </div>
              <div className="p-3">
                <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                  Seramik Tasarım Vazo
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Spiral açısı, boğum ve sır rengi
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
