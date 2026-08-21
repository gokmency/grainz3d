import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AnalyticsProvider } from "@/components/AnalyticsProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Parametrik Tasarım (Demo) | 3D Ürün Konfigüratörü",
  description:
    "Web tabanlı interaktif 3D parametrik model ve ürün yapılandırıcı editör demo platformu. grainzdigital.com tarafından tasarlanmıştır.",
  keywords: [
    "parametrik tasarım",
    "3d konfigüratör",
    "3d ürün görselleştirme",
    "grainz digital",
    "grainzdigital.com",
    "web tabanlı 3d",
    "ürün kişiselleştirme",
    "mimari ve endüstriyel 3d tasarım",
  ],
  authors: [{ name: "Grainz Digital", url: "https://grainzdigital.com" }],
  creator: "Grainz Digital (grainzdigital.com)",
  publisher: "Grainz Digital",
  openGraph: {
    title: "Parametrik Tasarım (Demo) | 3D Ürün Konfigüratörü",
    description:
      "Web tabanlı interaktif 3D parametrik model ve ürün yapılandırıcı demo platformu. grainzdigital.com tarafından geliştirilmiştir.",
    url: "https://grainzdigital.com",
    siteName: "Parametrik Tasarım (Demo) - grainzdigital.com",
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Parametrik Tasarım (Demo)",
    description: "Web tabanlı interaktif 3D parametrik model yapılandırıcı. grainzdigital.com tarafından tasarlanmıştır.",
  },
  alternates: {
    canonical: "https://grainzdigital.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://grainzdigital.com/#website",
        "url": "https://grainzdigital.com",
        "name": "Grainz Digital",
        "description": "Profesyonel 3D Web Uygulamaları, Parametrik Tasarım ve Dijital Ürün Çözümleri",
        "publisher": {
          "@id": "https://grainzdigital.com/#organization",
        },
        "inLanguage": "tr-TR",
      },
      {
        "@type": "Organization",
        "@id": "https://grainzdigital.com/#organization",
        "name": "Grainz Digital",
        "url": "https://grainzdigital.com",
        "logo": "https://grainzdigital.com/logo.png",
        "description": "3D web konfigüratörleri, parametrik modelleme ve yeni nesil web teknolojileri geliştirme stüdyosu.",
        "sameAs": [
          "https://grainzdigital.com",
          "https://instagram.com/grainzdigital",
          "https://linkedin.com/company/grainzdigital",
        ],
      },
      {
        "@type": "SoftwareApplication",
        "name": "Parametrik Tasarım (Demo)",
        "applicationCategory": "DesignApplication",
        "operatingSystem": "Web Browser",
        "author": {
          "@id": "https://grainzdigital.com/#organization",
        },
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "TRY",
        },
      },
    ],
  };

  return (
    <html lang="tr" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://sdr8euc1.eu-central-1.shapediver.com" />
        <link rel="preconnect" href="https://sduse1.us.shapediver.com" />
        <link rel="dns-prefetch" href="https://vitals.vercel-insights.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-950 text-zinc-100`}
        suppressHydrationWarning
      >
        {children}
        <AnalyticsProvider />
      </body>
    </html>
  );
}
