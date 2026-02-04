import Link from 'next/link'
import { ArrowLeft, Mail } from 'lucide-react'

export default function ContactPage() {
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
        <h1 className="text-3xl font-bold mb-6">Contact</h1>
        <div className="space-y-6 text-muted-foreground">
          <p>
            Have questions or feedback? We&apos;d love to hear from you.
          </p>
          <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card">
            <Mail className="w-5 h-5 text-primary shrink-0" />
            <div>
              <p className="font-medium text-foreground">Email</p>
              <a
                href="mailto:studiograinz@gmail.com"
                className="text-primary hover:underline"
              >
                studiograinz@gmail.com
              </a>
            </div>
          </div>
          <p className="text-sm">
            We typically respond within 1-2 business days.
          </p>
        </div>
      </div>
    </main>
  )
}
