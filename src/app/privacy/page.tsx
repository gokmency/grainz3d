import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container max-w-3xl mx-auto px-4 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <p className="text-muted-foreground mb-6">
          Last updated: {new Date().toLocaleDateString()}
        </p>
        <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
          <p>
            This privacy policy describes how we collect, use, and protect your information when you use our 3D configurator service.
          </p>
          <h2 className="text-xl font-semibold text-foreground">Information We Collect</h2>
          <p>
            We collect information you provide directly, such as your email address when you create an account, and the configurations and presets you save.
          </p>
          <h2 className="text-xl font-semibold text-foreground">How We Use Your Information</h2>
          <p>
            We use your information to provide and improve our services, to sync your presets across devices, and to communicate with you about your account.
          </p>
          <h2 className="text-xl font-semibold text-foreground">Data Storage</h2>
          <p>
            Your data is stored securely using Supabase. We do not sell or share your personal information with third parties.
          </p>
          <h2 className="text-xl font-semibold text-foreground">Contact</h2>
          <p>
            If you have questions about this privacy policy, please contact us through our contact page.
          </p>
        </div>
      </div>
    </main>
  )
}
