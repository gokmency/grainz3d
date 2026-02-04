import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { AnimatedCharactersPanel } from './animated-characters'

interface AuthPageLayoutProps {
  children: React.ReactNode
  brandName?: string
}

export function AuthPageLayout({ children, brandName = 'Grainz3D' }: AuthPageLayoutProps) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left - Animated characters (same as login) */}
      <AnimatedCharactersPanel brandName={brandName} />

      {/* Right - Form */}
      <div className="flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-[420px]">
          <div className="lg:hidden flex items-center justify-center gap-2 text-lg font-semibold mb-12">
            <Link
              href="/"
              className="flex items-center gap-2 text-foreground hover:opacity-90"
            >
              <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Sparkles className="size-4 text-primary" />
              </div>
              <span>{brandName}</span>
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
