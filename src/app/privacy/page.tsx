import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Particles } from '@/components/ui/particles'

export default function PrivacyPage() {
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
        <h1 className="text-3xl font-bold mb-6">Gizlilik Politikası</h1>
        <p className="text-muted-foreground mb-6">
          Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
        </p>
        <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
          <p>
            Bu gizlilik politikası, 3D parametrik tasarım ve konfigüratör hizmetimizi kullandığınızda verilerinizin nasıl toplandığını, kullanıldığını ve korunduğunu açıklamaktadır.
          </p>
          <h2 className="text-xl font-semibold text-foreground">Toplanan Bilgiler</h2>
          <p>
            Hesap oluşturduğunuzda sağladığınız e-posta adresi, profil bilgileriniz ve platform üzerinde oluşturup kaydettiğiniz 3D parametre hazır ayarları (preset) saklanmaktadır.
          </p>
          <h2 className="text-xl font-semibold text-foreground">Bilgilerin Kullanımı</h2>
          <p>
            Bilgileriniz hizmet kalitemizi artırmak, tasarım presetlerinizi cihazlarınız arasında senkronize etmek ve hesap bildirimlerini sağlamak amacıyla kullanılır. Bilgileriniz üçüncü şahıslarla paylaşılmaz.
          </p>
          <h2 className="text-xl font-semibold text-foreground">Veri Güvenliği</h2>
          <p>
            Verileriniz modern güvenlik standartları çerçevesinde güvenle korunmaktadır.
          </p>
          <h2 className="text-xl font-semibold text-foreground">İletişim</h2>
          <p>
            Gizlilik politikamızla ilgili herhangi bir sorunuz varsa lütfen iletişim sayfası üzerinden bize ulaşın.
          </p>
        </div>
      </div>
    </main>
  )
}
