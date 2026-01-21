"use client";

import ResponsiveHeroBanner from "@/components/ui/responsive-hero-banner";

type Language = "en" | "tr";

interface HeroProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

const COPY = {
  en: {
    nav: {
      features: "Features",
      useCases: "Use Cases",
      pricing: "Pricing",
      faq: "FAQ",
    },
    badge: "Web-Based Configuration Platform",
    badgeLabel: "New",
    title: "Configure Complex Models",
    titleLine2: "in Real Time",
    description:
      "A browser-based platform for visual configuration, editing, and preview of parametric models. No installation required.",
    primaryCta: "Start Demo",
    secondaryCta: "Watch Demo",
    login: "Contact",
  },
  tr: {
    nav: {
      features: "Özellikler",
      useCases: "Kullanım Alanları",
      pricing: "Fiyatlandırma",
      faq: "SSS",
    },
    badge: "Web Tabanlı Konfigürasyon Platformu",
    badgeLabel: "Yeni",
    title: "Karmaşık Modelleri",
    titleLine2: "Gerçek Zamanlı Yapılandırın",
    description:
      "Parametrik modellerin görsel yapılandırması, düzenlenmesi ve önizlemesi için tarayıcı tabanlı platform. Kurulum gerektirmez.",
    primaryCta: "Demo'yu Başlat",
    secondaryCta: "Demo İzle",
    login: "İletişim",
  },
};

const Hero = ({ language, onLanguageChange }: HeroProps) => {
  const t = COPY[language];

  return (
    <ResponsiveHeroBanner
      backgroundImageUrl="/herotest.png"
      navLinks={[
        { label: t.nav.features, href: "#features" },
        { label: t.nav.useCases, href: "#use-cases" },
        { label: t.nav.pricing, href: "#pricing" },
        { label: t.nav.faq, href: "#faq" },
      ]}
      ctaButtonText={t.login}
      ctaButtonHref="mailto:contact@example.com"
      badgeLabel={t.badgeLabel}
      badgeText={t.badge}
      title={t.title}
      titleLine2={t.titleLine2}
      description={t.description}
      primaryButtonText={t.primaryCta}
      primaryButtonHref="/configurator"
      secondaryButtonText={t.secondaryCta}
      secondaryButtonHref="#features"
      language={language}
      onLanguageChange={onLanguageChange}
    />
  );
};

export { Hero };
