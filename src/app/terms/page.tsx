import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Particles } from '@/components/ui/particles'

export default function TermsPage() {
  return (
    <main className="relative min-h-screen bg-background text-foreground">
      <div className="absolute inset-0 z-0 min-h-full w-full">
        <Particles
          className="absolute inset-0 h-full w-full min-h-screen"
          quantity={35}
          ease={80}
          staticity={30}
          color="#ffffff"
          size={0.5}
        />
      </div>
      <div className="relative z-10 container max-w-3xl mx-auto px-4 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Ana Sayfaya Dön
        </Link>
        <h1 className="text-3xl font-bold mb-6">Kullanım Şartları</h1>
        <p className="text-muted-foreground mb-6">
          Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
        </p>
        <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
          <p>
            3D parametrik konfigüratör hizmetimizi kullanarak aşağıdaki kullanım koşullarını kabul etmiş sayılırsınız.
          </p>
          <h2 className="text-xl font-semibold text-foreground">Hizmetin Kullanımı</h2>
          <p>
            Hizmetimizi 3D ürün modellerini incelemek, gerçek zamanlı parametreleri özelleştirmek, hazır ayarlar kaydetmek ve tasarım dosyalarını dışa aktarmak için kullanabilirsiniz.
          </p>
          <h2 className="text-xl font-semibold text-foreground">Kullanım Kuralları</h2>
          <p>
            Hizmeti yürürlükteki yasalara aykırı veya sistemin işleyişini engelleyecek, zarar verecek şekilde kullanamazsınız.
          </p>
          <h2 className="text-xl font-semibold text-foreground">Fikri Mülkiyet</h2>
          <p>
            Platform tasarımı, 3D algoritmaları ve arayüz bileşenleri telif hakları ile korunmaktadır.
          </p>
          <h2 className="text-xl font-semibold text-foreground">İletişim</h2>
          <p>
            Kullanım koşulları hakkındaki sorularınız için lütfen iletişim sayfamızdan bizimle irtibata geçin.
          </p>
        </div>
      </div>
    </main>
  )
}
