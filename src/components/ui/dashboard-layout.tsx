import Link from 'next/link'
import { Sparkles, Home, Settings2, Box, Bookmark } from 'lucide-react'
import { MODELS } from '@/lib/config'

interface DashboardLayoutProps {
  children: React.ReactNode
  displayName: string
  presetCount?: number
  activeNav?: 'dashboard' | 'settings'
}

export function DashboardLayout({
  children,
  displayName,
  presetCount = 0,
  activeNav = 'dashboard',
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen grid lg:grid-cols-[320px_1fr]">
      {/* Left Sidebar */}
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
              href="/dashboard"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeNav === 'dashboard'
                  ? 'bg-primary-foreground/20 text-primary-foreground'
                  : 'text-primary-foreground/90 hover:bg-primary-foreground/10'
              }`}
            >
              <Box className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/settings"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeNav === 'settings'
                  ? 'bg-primary-foreground/20 text-primary-foreground'
                  : 'text-primary-foreground/90 hover:bg-primary-foreground/10'
              }`}
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
            <span>{presetCount} preset{presetCount !== 1 ? 's' : ''} saved</span>
          </div>
        </div>

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" />
        <div className="absolute top-1/4 right-1/4 size-64 bg-primary-foreground/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 size-96 bg-primary-foreground/5 rounded-full blur-3xl" />
      </aside>

      {/* Main Content */}
      <main className="flex flex-col min-h-screen bg-background">
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
          <Link
            href={activeNav === 'settings' ? '/dashboard' : '/settings'}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors text-sm"
          >
            {activeNav === 'settings' ? (
              <>
                <Box className="w-4 h-4" />
                Dashboard
              </>
            ) : (
              <>
                <Settings2 className="w-4 h-4" />
                Settings
              </>
            )}
          </Link>
        </header>
        {children}
      </main>
    </div>
  )
}
