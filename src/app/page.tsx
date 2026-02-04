"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import {
  Zap,
  Globe,
  Layers,
  Code2,
  Building2,
  Factory,
  Box,
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { motion } from "motion/react";
import { Hero } from "@/components/ui/hero";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { Particles } from "@/components/ui/particles";

const Pricing = dynamic(
  () => import("@/components/ui/pricing").then((mod) => mod.Pricing),
  {
    ssr: false,
    loading: () => (
      <div className="container mx-auto px-4 py-24">
        <div className="mx-auto max-w-4xl animate-pulse">
          <div className="h-10 bg-white/10 rounded-lg w-2/3 mx-auto mb-8" />
          <div className="h-4 bg-white/5 rounded w-full max-w-xl mx-auto mb-16" />
          <div className="grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-80 rounded-2xl bg-white/5 border border-white/10"
              />
            ))}
          </div>
        </div>
      </div>
    ),
  }
);

export type Language = "en" | "tr";

const COPY = {
  en: {
    editorPreview: {
      lead: "See your configurator in action",
      title: "Interactive 3D Configuration at Your Fingertips",
      description:
        "Our web-based editor puts full parametric control in the browser. Adjust sliders, tweak dimensions, and watch your 3D model update instantly—no plugins, no downloads. Share a link and let your clients configure products in real time.",
    },
    benefits: {
      title: "Key Capabilities",
      subtitle:
        "Built on ShapeDiver and modern web standards, GRAINZ 3D gives you everything needed to deliver professional configuration experiences—from prototype to production.",
      items: [
        {
          icon: "zap",
          title: "Real-Time Parametric Updates",
          description:
            "Every parameter change triggers instant visual feedback. Your 3D model recomputes on the fly, so users see results immediately—no page reloads or waiting.",
        },
        {
          icon: "globe",
          title: "Browser-Based, Zero Installation",
          description:
            "Runs entirely in the browser. Share a single link and anyone can start configuring—on desktop, tablet, or mobile. No software to install or maintain.",
        },
        {
          icon: "layers",
          title: "Multiple Export Formats",
          description:
            "Export configurations in formats ready for manufacturing, visualization, or e-commerce. Seamlessly connect to your existing workflows and tools.",
        },
        {
          icon: "code",
          title: "Easy Integration & Embedding",
          description:
            "Embed the configurator in your site, connect via API, or use our hosted solution. Designed for seamless integration with your brand and tech stack.",
        },
      ],
    },
    useCases: {
      title: "Built for Your Industry",
      subtitle:
        "Whether you design buildings, products, or customer experiences—our platform adapts to your workflow and scales with your needs.",
      items: [
        {
          icon: "building",
          title: "Architecture & AEC",
          description:
            "Configurable facades, structural elements, and building components. Let clients explore design options and generate specifications in real time.",
        },
        {
          icon: "factory",
          title: "Manufacturing & Product Design",
          description:
            "Custom configurators for furniture, machinery, and industrial products. From mass customization to made-to-order—one platform for all.",
        },
        {
          icon: "box",
          title: "Industrial Visualization",
          description:
            "Interactive 3D models for sales tools, catalogs, and customer-facing apps. Turn complex products into intuitive, configurable experiences.",
        },
      ],
    },
    pricing: {
      title: "Simple, Transparent Pricing",
      description: "Choose the plan that fits your needs.\nAll plans include platform access, configuration tools, and dedicated support—scale as you grow.",
      plans: [
        {
          name: "STARTER",
          price: "50",
          yearlyPrice: "40",
          period: "per month",
          features: [
            "Up to 3 models",
            "Basic export formats",
            "Community support",
            "Standard viewer",
          ],
          description: "Perfect for individuals and small projects",
          buttonText: "Get Started",
          href: "/configurator",
          isPopular: false,
        },
        {
          name: "PROFESSIONAL",
          price: "99",
          yearlyPrice: "79",
          period: "per month",
          features: [
            "Unlimited models",
            "All export formats",
            "Priority support",
            "Custom branding",
            "API access",
            "Team collaboration",
            "Custom integrations",
          ],
          description: "Ideal for growing teams and businesses",
          buttonText: "Get Started",
          href: "/configurator",
          isPopular: true,
        },
        {
          name: "ENTERPRISE",
          price: "299",
          yearlyPrice: "239",
          period: "per month",
          features: [
            "Everything in Professional",
            "Custom solutions",
            "Dedicated account manager",
            "1-hour support response time",
            "SSO Authentication",
            "Advanced security",
            "Custom contracts",
            "SLA agreement",
          ],
          description: "For large organizations with specific needs",
          buttonText: "Contact Sales",
          href: "mailto:studiograinz@gmail.com",
          isPopular: false,
        },
      ],
    },
    faq: {
      title: "Frequently Asked Questions",
      items: [
        {
          q: "Is this platform browser-based?",
          a: "Yes. GRAINZ 3D runs entirely in modern web browsers—Chrome, Firefox, Safari, Edge. No downloads, no plugins, no installation. Users open a link and start configuring parametric 3D models immediately.",
        },
        {
          q: "Can it integrate with existing systems?",
          a: "Absolutely. We offer APIs, embed codes, and webhooks so you can integrate the configurator into your website, CRM, e-commerce platform, or internal tools. Export configurations in formats ready for your downstream workflows.",
        },
        {
          q: "Who is this platform designed for?",
          a: "Designers, manufacturers, architects, and businesses that need to offer configurable 3D products or models to their customers. From small studios to enterprise teams—our platform scales with you.",
        },
      ],
    },
    finalCta: {
      title: "Ready to Build Your Configurator?",
      subtitle:
        "Try the interactive demo or reach out to discuss your project. We'll help you bring parametric configuration to your products and workflows.",
      primaryCta: "Start Demo",
      secondaryCta: "Contact",
    },
    footer: {
      product: "GRAINZ 3D",
      copyright: "© 2026 All rights reserved.",
      links: {
        contact: "Contact",
        privacy: "Privacy Policy",
        terms: "Terms of Service",
      },
    },
  },
  tr: {
    editorPreview: {
      lead: "Yapılandırıcınızı canlı görün",
      title: "Parmaklarınızın Ucunda İnteraktif 3D Yapılandırma",
      description:
        "Web tabanlı editörümüz, tam parametrik kontrolü tarayıcıya taşır. Kaydırıcıları ayarlayın, boyutları değiştirin, 3D modelinizin anında güncellenmesini izleyin—eklenti yok, indirme yok. Bir link paylaşın, müşterileriniz ürünleri gerçek zamanlı yapılandırsın.",
    },
    benefits: {
      title: "Temel Yetenekler",
      subtitle:
        "ShapeDiver ve modern web standartları üzerine kurulu GRAINZ 3D, prototipten üretime profesyonel yapılandırma deneyimleri sunmak için ihtiyacınız olan her şeyi sağlar.",
      items: [
        {
          icon: "zap",
          title: "Gerçek Zamanlı Parametrik Güncellemeler",
          description:
            "Her parametre değişikliği anında görsel geri bildirim tetikler. 3D modeliniz uçuşta yeniden hesaplanır—sayfa yenilemesi veya bekleme yok.",
        },
        {
          icon: "globe",
          title: "Tarayıcı Tabanlı, Sıfır Kurulum",
          description:
            "Tamamen tarayıcıda çalışır. Tek bir link paylaşın, masaüstü, tablet veya mobilde herkes yapılandırmaya başlasın. Kurulacak veya bakımı yapılacak yazılım yok.",
        },
        {
          icon: "layers",
          title: "Çoklu Dışa Aktarma Formatları",
          description:
            "Yapılandırmaları üretim, görselleştirme veya e-ticaret için hazır formatlarda dışa aktarın. Mevcut iş akışlarınız ve araçlarınızla sorunsuz bağlantı kurun.",
        },
        {
          icon: "code",
          title: "Kolay Entegrasyon ve Gömme",
          description:
            "Yapılandırıcıyı sitenize gömün, API ile bağlayın veya barındırılan çözümümüzü kullanın. Markanız ve teknoloji yığınınızla sorunsuz entegrasyon için tasarlandı.",
        },
      ],
    },
    useCases: {
      title: "Sektörünüz İçin Tasarlandı",
      subtitle:
        "İster bina, ister ürün, ister müşteri deneyimi tasarlayın—platformumuz iş akışınıza uyum sağlar ve ihtiyaçlarınızla birlikte ölçeklenir.",
      items: [
        {
          icon: "building",
          title: "Mimari ve İnşaat",
          description:
            "Yapılandırılabilir cepheler, yapısal elemanlar ve bina bileşenleri. Müşterilerin tasarım seçeneklerini keşfetmesine ve spesifikasyonları gerçek zamanlı oluşturmasına olanak tanıyın.",
        },
        {
          icon: "factory",
          title: "Üretim ve Ürün Tasarımı",
          description:
            "Mobilya, makine ve endüstriyel ürünler için özel yapılandırıcılar. Seri özelleştirmeden siparişe özel üretime—hepsi için tek platform.",
        },
        {
          icon: "box",
          title: "Endüstriyel Görselleştirme",
          description:
            "Satış araçları, kataloglar ve müşteriye yönelik uygulamalar için interaktif 3D modeller. Karmaşık ürünleri sezgisel, yapılandırılabilir deneyimlere dönüştürün.",
        },
      ],
    },
    pricing: {
      title: "Basit, Şeffaf Fiyatlandırma",
      description: "İhtiyaçlarınıza uygun planı seçin.\nTüm planlar platform erişimi, yapılandırma araçları ve özel destek içerir—büyüdükçe ölçeklenin.",
      plans: [
        {
          name: "BAŞLANGIÇ",
          price: "50",
          yearlyPrice: "40",
          period: "aylık",
          features: [
            "3'e kadar model",
            "Temel dışa aktarım formatları",
            "Topluluk desteği",
            "Standart görüntüleyici",
          ],
          description: "Bireyler ve küçük projeler için ideal",
          buttonText: "Başlayın",
          href: "/configurator",
          isPopular: false,
        },
        {
          name: "PROFESYONEL",
          price: "99",
          yearlyPrice: "79",
          period: "aylık",
          features: [
            "Sınırsız model",
            "Tüm dışa aktarım formatları",
            "Öncelikli destek",
            "Özel markalama",
            "API erişimi",
            "Ekip işbirliği",
            "Özel entegrasyonlar",
          ],
          description: "Büyüyen ekipler ve işletmeler için ideal",
          buttonText: "Başlayın",
          href: "/configurator",
          isPopular: true,
        },
        {
          name: "KURUMSAL",
          price: "299",
          yearlyPrice: "239",
          period: "aylık",
          features: [
            "Profesyonel'deki her şey",
            "Özel çözümler",
            "Özel hesap yöneticisi",
            "1 saatlik destek yanıt süresi",
            "SSO Kimlik Doğrulama",
            "Gelişmiş güvenlik",
            "Özel sözleşmeler",
            "SLA anlaşması",
          ],
          description: "Özel ihtiyaçları olan büyük kuruluşlar için",
          buttonText: "Satışla İletişime Geç",
          href: "mailto:studiograinz@gmail.com",
          isPopular: false,
        },
      ],
    },
    faq: {
      title: "Sıkça Sorulan Sorular",
      items: [
        {
          q: "Bu platform tarayıcı tabanlı mı?",
          a: "Evet. GRAINZ 3D tamamen modern web tarayıcılarında—Chrome, Firefox, Safari, Edge—çalışır. İndirme yok, eklenti yok, kurulum yok. Kullanıcılar bir link açar ve parametrik 3D modelleri hemen yapılandırmaya başlar.",
        },
        {
          q: "Mevcut sistemlerle entegre edilebilir mi?",
          a: "Kesinlikle. API'ler, gömme kodları ve webhook'lar sunuyoruz; yapılandırıcıyı web sitenize, CRM'inize, e-ticaret platformunuza veya dahili araçlarınıza entegre edebilirsiniz. Yapılandırmaları sonraki iş akışlarınıza hazır formatlarda dışa aktarın.",
        },
        {
          q: "Bu platform kimin için tasarlandı?",
          a: "Müşterilerine yapılandırılabilir 3D ürünler veya modeller sunması gereken tasarımcılar, üreticiler, mimarlar ve işletmeler. Küçük stüdyolardan kurumsal ekiplere—platformumuz sizinle birlikte ölçeklenir.",
        },
      ],
    },
    finalCta: {
      title: "Yapılandırıcınızı Oluşturmaya Hazır mısınız?",
      subtitle:
        "İnteraktif demoyu deneyin veya projenizi tartışmak için bizimle iletişime geçin. Parametrik yapılandırmayı ürünlerinize ve iş akışlarınıza taşımanıza yardımcı olacağız.",
      primaryCta: "Demo'yu Başlat",
      secondaryCta: "İletişime Geç",
    },
    footer: {
      product: "GRAINZ 3D",
      copyright: "© 2026 Tüm hakları saklıdır.",
      links: {
        contact: "İletişim",
        privacy: "Gizlilik Politikası",
        terms: "Kullanım Koşulları",
      },
    },
  },
};

function IconComponent({ name }: { name: string }) {
  switch (name) {
    case "zap":
      return <Zap className="h-6 w-6" />;
    case "globe":
      return <Globe className="h-6 w-6" />;
    case "layers":
      return <Layers className="h-6 w-6" />;
    case "code":
      return <Code2 className="h-6 w-6" />;
    case "building":
      return <Building2 className="h-6 w-6" />;
    case "factory":
      return <Factory className="h-6 w-6" />;
    case "box":
      return <Box className="h-6 w-6" />;
    default:
      return <Box className="h-6 w-6" />;
  }
}


function FAQItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between py-2 text-left"
      >
        <span className="text-base font-medium text-white">{question}</span>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-white/60" />
        ) : (
          <ChevronDown className="h-5 w-5 text-white/60" />
        )}
      </button>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="pt-4"
        >
          <p className="text-white/70 leading-relaxed">{answer}</p>
        </motion.div>
      )}
    </div>
  );
}

export default function Home() {
  const [language, setLanguage] = useState<Language>("en");
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);
  const t = COPY[language];

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section - unchanged, no particles */}
      <Hero language={language} onLanguageChange={setLanguage} />

      {/* Content below hero with particle background */}
      <div className="relative min-h-screen">
        <Particles
          className="absolute inset-0 z-0"
          quantity={160}
          ease={70}
          staticity={50}
          color="#ffffff"
          size={0.8}
        />

        {/* Features Section: Editor Preview first, then Key Capabilities */}
        <section id="features" className="relative z-10 w-full isolate overflow-hidden bg-gradient-to-b from-black/70 via-zinc-950/30 to-black/70">
        <div className="container mx-auto px-4 py-24">
          {/* Editor Preview - Top */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative mx-auto max-w-6xl"
          >
            <div className="mx-auto max-w-2xl text-center mb-12">
              <p className="text-sm font-medium text-primary/90 mb-2">{t.editorPreview.lead}</p>
              <h2 className="text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                {t.editorPreview.title}
              </h2>
              <p className="mt-4 text-white/80 text-lg leading-relaxed">
                {t.editorPreview.description}
              </p>
            </div>
            <div className="relative rounded-3xl border-[0.75px] border-white/10 bg-white/5 p-4 backdrop-blur-sm ring-1 ring-white/10 overflow-hidden">
              <GlowingEffect
                spread={40}
                glow={true}
                disabled={false}
                proximity={64}
                inactiveZone={0.01}
                borderWidth={2}
              />
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/mockupforeditorpage.png"
                  alt="3D Configurator Editor Preview"
                  width={1200}
                  height={800}
                  className="w-full h-auto object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>
          </motion.div>

          {/* Key Capabilities - Below */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto max-w-2xl text-center mt-24"
          >
            <h2 className="text-3xl font-bold text-white md:text-4xl lg:text-5xl">
              {t.benefits.title}
            </h2>
            <p className="mt-4 text-white/80 text-lg">{t.benefits.subtitle}</p>
          </motion.div>

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {t.benefits.items.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative rounded-2xl border-[0.75px] border-white/10 bg-white/5 p-6 backdrop-blur-sm transition hover:bg-white/10 hover:border-white/20 ring-1 ring-white/10"
              >
                <GlowingEffect
                  spread={40}
                  glow={true}
                  disabled={false}
                  proximity={64}
                  inactiveZone={0.01}
                  borderWidth={2}
                />
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-white transition group-hover:bg-white/20 relative z-10 ring-1 ring-white/10">
                  <IconComponent name={item.icon} />
                </div>
                <h3 className="text-lg font-semibold text-white relative z-10">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70 relative z-10">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

        {/* Use Cases Section */}
        <section id="use-cases" className="relative z-10 w-full isolate overflow-hidden bg-zinc-950/5">
        <div className="container mx-auto px-4 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-2xl text-center"
          >
            <h2 className="text-3xl font-bold text-white md:text-4xl lg:text-5xl">
              {t.useCases.title}
            </h2>
            <p className="mt-4 text-white/80 text-lg">{t.useCases.subtitle}</p>
          </motion.div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {t.useCases.items.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative rounded-2xl border-[0.75px] border-white/10 bg-white/5 p-8 backdrop-blur-sm transition hover:bg-white/10 hover:border-white/20 ring-1 ring-white/10"
              >
                <GlowingEffect
                  spread={40}
                  glow={true}
                  disabled={false}
                  proximity={64}
                  inactiveZone={0.01}
                  borderWidth={2}
                />
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-white/10 text-white transition group-hover:bg-white/20 relative z-10 ring-1 ring-white/10">
                  <IconComponent name={item.icon} />
                </div>
                <h3 className="text-xl font-semibold text-white relative z-10">{item.title}</h3>
                <p className="mt-3 text-white/70 leading-relaxed relative z-10">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

        {/* Pricing Section */}
        <Pricing
        plans={t.pricing.plans}
        title={t.pricing.title}
        description={t.pricing.description}
        language={language}
      />

        {/* FAQ Section */}
        <section id="faq" className="relative z-10 w-full isolate overflow-hidden bg-gradient-to-b from-black/70 via-zinc-950/20 to-black/70">
        <div className="container mx-auto px-4 py-24">
          <div className="mx-auto max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h2 className="text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                {t.faq.title}
              </h2>
            </motion.div>
            <div className="mt-12 space-y-4">
              {t.faq.items.map((item, index) => (
                <motion.div
                  key={item.q}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="rounded-2xl border-[0.75px] border-white/10 bg-white/5 p-6 backdrop-blur-sm"
                >
                  <FAQItem
                    question={item.q}
                    answer={item.a}
                    isOpen={openFAQ === index}
                    onToggle={() => setOpenFAQ(openFAQ === index ? null : index)}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        </section>

        {/* Final CTA Section */}
        <section className="relative z-10 w-full isolate overflow-hidden bg-zinc-950/10">
        <div className="container mx-auto px-4 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mx-auto max-w-3xl rounded-3xl border-[0.75px] border-white/10 bg-white/5 p-12 text-center backdrop-blur-sm ring-1 ring-white/10"
          >
            <h2 className="text-3xl font-bold text-white md:text-4xl lg:text-5xl">
              {t.finalCta.title}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/80 text-lg">
              {t.finalCta.subtitle}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/configurator"
                className="group h-12 flex items-center gap-2 rounded-full bg-white px-8 text-base font-medium text-black hover:bg-white/90 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] active:scale-95"
              >
                {t.finalCta.primaryCta}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/contact"
                className="h-12 flex items-center rounded-full border border-white/20 bg-white/5 px-8 text-base font-medium text-white hover:bg-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-sm"
              >
                {t.finalCta.secondaryCta}
              </Link>
            </div>
          </motion.div>
        </div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 border-t border-white/10 bg-black/60 backdrop-blur-sm">
        <div className="relative z-10 container mx-auto px-4 py-10">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center text-white/70">
              <span className="text-sm font-semibold">{t.footer.product}</span>
            </div>
            <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/60">
              <Link
                href="/contact"
                className="transition hover:text-white"
              >
                {t.footer.links.contact}
              </Link>
              <Link href="/privacy" className="transition hover:text-white">
                {t.footer.links.privacy}
              </Link>
              <Link href="/terms" className="transition hover:text-white">
                {t.footer.links.terms}
              </Link>
            </nav>
            <p className="text-xs text-white/50">{t.footer.copyright}</p>
          </div>
        </div>
        </footer>
      </div>
    </main>
  );
}
