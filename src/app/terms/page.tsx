import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function TermsPage() {
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
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        <p className="text-muted-foreground mb-6">
          Last updated: {new Date().toLocaleDateString()}
        </p>
        <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
          <p>
            By using our 3D configurator service, you agree to these terms of service.
          </p>
          <h2 className="text-xl font-semibold text-foreground">Use of Service</h2>
          <p>
            You may use our service to create, customize, and save 3D model configurations. You are responsible for maintaining the confidentiality of your account credentials.
          </p>
          <h2 className="text-xl font-semibold text-foreground">Acceptable Use</h2>
          <p>
            You agree not to use the service for any unlawful purpose or in any way that could damage, disable, or impair the service.
          </p>
          <h2 className="text-xl font-semibold text-foreground">Intellectual Property</h2>
          <p>
            The 3D models and configurations you create may be subject to the terms of the underlying ShapeDiver platform and model providers.
          </p>
          <h2 className="text-xl font-semibold text-foreground">Contact</h2>
          <p>
            For questions about these terms, please contact us through our contact page.
          </p>
        </div>
      </div>
    </main>
  )
}
