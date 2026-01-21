"use client";

import { useState } from "react";
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
import { motion } from "framer-motion";
import { Hero } from "@/components/ui/hero";
import { Pricing } from "@/components/ui/pricing";
import { GlowingEffect } from "@/components/ui/glowing-effect";

export type Language = "en" | "tr";

const COPY = {
  en: {
    benefits: {
      title: "Key Capabilities",
      subtitle: "Everything you need to build powerful configuration experiences.",
      items: [
        {
          icon: "zap",
          title: "Real-Time Configuration",
          description:
            "Instant visual feedback as parameters change. No waiting, no reloads.",
        },
        {
          icon: "globe",
          title: "Browser-Based, No Installation",
          description:
            "Works on any modern browser. Share a link and users can configure immediately.",
        },
        {
          icon: "layers",
          title: "Multiple Output Formats",
          description:
            "Export configurations in various formats ready for downstream workflows.",
        },
        {
          icon: "code",
          title: "Easy Integration",
          description:
            "Embed in your website or connect via API. Designed for seamless integration.",
        },
      ],
    },
    useCases: {
      title: "Built for Your Industry",
      subtitle: "Flexible enough to serve diverse configuration needs.",
      items: [
        {
          icon: "building",
          title: "Architecture & AEC",
          description:
            "Configurable building components, facades, and structural elements for architects and engineers.",
        },
        {
          icon: "factory",
          title: "Manufacturing & Product Design",
          description:
            "Custom product configurators for furniture, machinery, and industrial components.",
        },
        {
          icon: "box",
          title: "Industrial Visualization",
          description:
            "Interactive 3D models for sales tools, catalogs, and customer-facing applications.",
        },
      ],
    },
    pricing: {
      title: "Simple, Transparent Pricing",
      description: "Choose the plan that works for you\nAll plans include access to our platform, configuration tools, and dedicated support.",
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
          href: "mailto:contact@example.com",
          isPopular: false,
        },
      ],
    },
    faq: {
      title: "Frequently Asked Questions",
      items: [
        {
          q: "Is this platform browser-based?",
          a: "Yes. The entire platform runs in modern web browsers. No downloads, no plugins, no installation required. Users simply open a link and start configuring.",
        },
        {
          q: "Can it integrate with existing systems?",
          a: "Absolutely. We provide APIs and embed options so you can integrate the configurator into your existing website, CRM, or e-commerce platform.",
        },
        {
          q: "Who is this platform designed for?",
          a: "Teams and businesses that need to offer configurable products or models to their customers—manufacturers, architects, product designers, and more.",
        },
      ],
    },
    finalCta: {
      title: "Ready to Build Your Configurator?",
      subtitle:
        "Start with a demo or talk to our team about your specific requirements.",
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
    benefits: {
      title: "Temel Yetenekler",
      subtitle:
        "Güçlü konfigürasyon deneyimleri oluşturmak için ihtiyacınız olan her şey.",
      items: [
        {
          icon: "zap",
          title: "Gerçek Zamanlı Yapılandırma",
          description:
            "Parametreler değiştikçe anında görsel geri bildirim. Bekleme yok, yenileme yok.",
        },
        {
          icon: "globe",
          title: "Tarayıcı Tabanlı, Kurulum Yok",
          description:
            "Tüm modern tarayıcılarda çalışır. Link paylaşın, kullanıcılar hemen yapılandırmaya başlasın.",
        },
        {
          icon: "layers",
          title: "Çoklu Çıktı Formatları",
          description:
            "Yapılandırmaları sonraki iş akışlarına uygun çeşitli formatlarda dışa aktarın.",
        },
        {
          icon: "code",
          title: "Kolay Entegrasyon",
          description:
            "Web sitenize gömün veya API ile bağlanın. Sorunsuz entegrasyon için tasarlandı.",
        },
      ],
    },
    useCases: {
      title: "Sektörünüz İçin Tasarlandı",
      subtitle: "Farklı yapılandırma ihtiyaçlarına hizmet edecek kadar esnek.",
      items: [
        {
          icon: "building",
          title: "Mimari ve İnşaat",
          description:
            "Mimarlar ve mühendisler için yapılandırılabilir bina bileşenleri, cepheler ve yapısal elemanlar.",
        },
        {
          icon: "factory",
          title: "Üretim ve Ürün Tasarımı",
          description:
            "Mobilya, makine ve endüstriyel bileşenler için özel ürün yapılandırıcıları.",
        },
        {
          icon: "box",
          title: "Endüstriyel Görselleştirme",
          description:
            "Satış araçları, kataloglar ve müşteriye yönelik uygulamalar için interaktif 3D modeller.",
        },
      ],
    },
    pricing: {
      title: "Basit, Şeffaf Fiyatlandırma",
      description: "Size uygun planı seçin\nTüm planlar platform erişimi, konfigürasyon araçları ve özel destek içerir.",
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
          href: "mailto:contact@example.com",
          isPopular: false,
        },
      ],
    },
    faq: {
      title: "Sıkça Sorulan Sorular",
      items: [
        {
          q: "Bu platform tarayıcı tabanlı mı?",
          a: "Evet. Tüm platform modern web tarayıcılarında çalışır. İndirme yok, eklenti yok, kurulum gerekmiyor. Kullanıcılar sadece bir link açar ve yapılandırmaya başlar.",
        },
        {
          q: "Mevcut sistemlerle entegre edilebilir mi?",
          a: "Kesinlikle. Yapılandırıcıyı mevcut web sitenize, CRM veya e-ticaret platformunuza entegre edebilmeniz için API ve gömme seçenekleri sunuyoruz.",
        },
        {
          q: "Bu platform kimin için tasarlandı?",
          a: "Müşterilerine yapılandırılabilir ürünler veya modeller sunması gereken ekipler ve işletmeler—üreticiler, mimarlar, ürün tasarımcıları ve daha fazlası.",
        },
      ],
    },
    finalCta: {
      title: "Yapılandırıcınızı Oluşturmaya Hazır mısınız?",
      subtitle:
        "Bir demo ile başlayın veya özel gereksinimleriniz hakkında ekibimizle konuşun.",
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
      {/* Hero Section */}
      <Hero language={language} onLanguageChange={setLanguage} />

      {/* Key Benefits Section */}
      <section id="features" className="relative w-full isolate overflow-hidden">
        <div className="container mx-auto px-4 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-2xl text-center"
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

          {/* Editor Preview Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative mx-auto max-w-6xl mt-24"
          >
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
                <img
                  src="/mockupforeditorpage.png"
                  alt="3D Configurator Editor Preview"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="use-cases" className="relative w-full isolate overflow-hidden">
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
      <section id="faq" className="relative w-full isolate overflow-hidden">
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
      <section className="relative w-full isolate overflow-hidden">
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
                className="h-12 flex items-center gap-2 rounded-full bg-white px-8 text-base font-medium text-black hover:bg-white/90 transition"
              >
                {t.finalCta.primaryCta}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="mailto:contact@example.com"
                className="h-12 flex items-center rounded-full border border-white/20 bg-white/5 px-8 text-base font-medium text-white hover:bg-white/10 transition backdrop-blur-sm"
              >
                {t.finalCta.secondaryCta}
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/10 bg-black/50 backdrop-blur-sm">
        <div className="relative z-10 container mx-auto px-4 py-10">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center text-white/70">
              <span className="text-sm font-semibold">{t.footer.product}</span>
            </div>
            <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/60">
              <a
                href="mailto:contact@example.com"
                className="transition hover:text-white"
              >
                {t.footer.links.contact}
              </a>
              <a href="#" className="transition hover:text-white">
                {t.footer.links.privacy}
              </a>
              <a href="#" className="transition hover:text-white">
                {t.footer.links.terms}
              </a>
            </nav>
            <p className="text-xs text-white/50">{t.footer.copyright}</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
