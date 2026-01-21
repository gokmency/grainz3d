"use client";

import React, { useState } from "react";
import { Menu, X, ArrowRight, Play } from "lucide-react";
import Link from "next/link";

interface NavLink {
  label: string;
  href: string;
  isActive?: boolean;
}

interface Partner {
  logoUrl: string;
  href: string;
}

interface ResponsiveHeroBannerProps {
  logoUrl?: string;
  backgroundImageUrl?: string;
  navLinks?: NavLink[];
  ctaButtonText?: string;
  ctaButtonHref?: string;
  badgeText?: string;
  badgeLabel?: string;
  title?: string;
  titleLine2?: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonHref?: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
  partnersTitle?: string;
  partners?: Partner[];
  language?: "en" | "tr";
  onLanguageChange?: (lang: "en" | "tr") => void;
}

const ResponsiveHeroBanner: React.FC<ResponsiveHeroBannerProps> = ({
  logoUrl,
  backgroundImageUrl = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=3840&q=80",
  navLinks,
  ctaButtonText,
  ctaButtonHref = "#",
  badgeLabel = "New",
  badgeText,
  title,
  titleLine2,
  description,
  primaryButtonText,
  primaryButtonHref = "#",
  secondaryButtonText,
  secondaryButtonHref = "#",
  partnersTitle,
  partners = [],
  language = "en",
  onLanguageChange,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <section className="w-full isolate min-h-screen overflow-hidden relative">
      <img
        src={backgroundImageUrl}
        alt=""
        className="w-full h-full object-cover absolute top-0 right-0 bottom-0 left-0"
      />
      <div className="pointer-events-none absolute inset-0 ring-1 ring-black/30" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />

      <header className="z-10 xl:top-4 relative">
        <div className="mx-6">
          <div className="flex items-center justify-between pt-4">
            {logoUrl ? (
              <a
                href="#"
                className="inline-flex items-center justify-center bg-center w-[100px] h-[40px] bg-cover rounded"
                style={{ backgroundImage: `url(${logoUrl})` }}
              />
            ) : (
              <div className="flex items-center">
                <span className="text-xl font-bold text-white">GRAINZ 3D</span>
              </div>
            )}

            <nav className="hidden md:flex items-center gap-2">
              <div className="flex items-center gap-1 rounded-full bg-white/5 px-1 py-1 ring-1 ring-white/10 backdrop-blur">
                {navLinks?.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    className={`px-3 py-2 text-sm font-medium hover:text-white font-sans transition-colors ${
                      link.isActive ? "text-white/90" : "text-white/80"
                    }`}
                  >
                    {link.label}
                  </a>
                ))}
                {onLanguageChange && (
                  <div className="flex items-center rounded-full border border-white/20 p-1 text-xs mx-1">
                    <button
                      type="button"
                      onClick={() => onLanguageChange("en")}
                      className={`rounded-full px-3 py-1.5 font-medium transition ${
                        language === "en"
                          ? "bg-white text-black"
                          : "text-white/80 hover:text-white"
                      }`}
                    >
                      EN
                    </button>
                    <button
                      type="button"
                      onClick={() => onLanguageChange("tr")}
                      className={`rounded-full px-3 py-1.5 font-medium transition ${
                        language === "tr"
                          ? "bg-white text-black"
                          : "text-white/80 hover:text-white"
                      }`}
                    >
                      TR
                    </button>
                  </div>
                )}
                <a
                  href={ctaButtonHref}
                  className="ml-1 inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-sm font-medium text-neutral-900 hover:bg-white/90 font-sans transition-colors"
                >
                  {ctaButtonText}
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </nav>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15 backdrop-blur"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5 text-white/90" />
              ) : (
                <Menu className="h-5 w-5 text-white/90" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-black/95 backdrop-blur-sm">
            <div className="flex flex-col p-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                  <span className="text-xl font-bold text-white">GRAINZ 3D</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15"
                >
                  <X className="h-5 w-5 text-white/90" />
                </button>
              </div>
              <div className="flex flex-col gap-4">
                {navLinks?.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-lg text-white/90 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
                {onLanguageChange && (
                  <div className="flex items-center gap-2 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        onLanguageChange("en");
                        setMobileMenuOpen(false);
                      }}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                        language === "en"
                          ? "bg-white text-black"
                          : "border border-white/20 text-white"
                      }`}
                    >
                      English
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onLanguageChange("tr");
                        setMobileMenuOpen(false);
                      }}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                        language === "tr"
                          ? "bg-white text-black"
                          : "border border-white/20 text-white"
                      }`}
                    >
                      Türkçe
                    </button>
                  </div>
                )}
                <Link
                  href={ctaButtonHref}
                  onClick={() => setMobileMenuOpen(false)}
                  className="mt-4 inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-medium text-black hover:bg-white/90"
                >
                  {ctaButtonText}
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      <div className="z-10 relative">
        <div className="sm:pt-28 md:pt-32 lg:pt-40 max-w-7xl mx-auto pt-28 px-6 pb-16">
          <div className="mx-auto max-w-3xl text-center">
            {badgeText && (
              <div className="mb-6 inline-flex items-center gap-3 rounded-full bg-white/10 px-2.5 py-2 ring-1 ring-white/15 backdrop-blur animate-fade-slide-in-1">
                {badgeLabel && (
                  <span className="inline-flex items-center text-xs font-medium text-neutral-900 bg-white/90 rounded-full py-0.5 px-2 font-sans">
                    {badgeLabel}
                  </span>
                )}
                <span className="text-sm font-medium text-white/90 font-sans">
                  {badgeText}
                </span>
              </div>
            )}

            <h1 className="sm:text-5xl md:text-6xl lg:text-7xl leading-tight text-4xl text-white tracking-tight font-normal animate-fade-slide-in-2">
              {title}
              {titleLine2 && (
                <>
                  <br className="hidden sm:block" />
                  {titleLine2}
                </>
              )}
            </h1>

            {description && (
              <p className="sm:text-lg animate-fade-slide-in-3 text-base text-white/80 max-w-2xl mt-6 mx-auto">
                {description}
              </p>
            )}

            <div className="flex flex-col sm:flex-row sm:gap-4 mt-10 gap-3 items-center justify-center animate-fade-slide-in-4">
              {primaryButtonText && (
                <Link
                  href={primaryButtonHref}
                  className="inline-flex items-center gap-2 hover:bg-white/15 text-sm font-medium text-white bg-white/10 ring-white/15 ring-1 rounded-full py-3 px-5 font-sans transition-colors"
                >
                  {primaryButtonText}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
              {secondaryButtonText && (
                <a
                  href={secondaryButtonHref}
                  className="inline-flex items-center gap-2 rounded-full bg-transparent px-5 py-3 text-sm font-medium text-white/90 hover:text-white font-sans transition-colors"
                >
                  {secondaryButtonText}
                  <Play className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {partners && partners.length > 0 && (
            <div className="mx-auto mt-20 max-w-5xl">
              {partnersTitle && (
                <p className="animate-fade-slide-in-1 text-sm text-white/70 text-center">
                  {partnersTitle}
                </p>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 animate-fade-slide-in-2 text-white/70 mt-6 items-center justify-items-center gap-4">
                {partners.map((partner, index) => (
                  <a
                    key={index}
                    href={partner.href}
                    className="inline-flex items-center justify-center bg-center w-[120px] h-[36px] bg-cover rounded-full opacity-80 hover:opacity-100 transition-opacity"
                    style={{ backgroundImage: `url(${partner.logoUrl})` }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ResponsiveHeroBanner;
