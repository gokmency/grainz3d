'use client';

import Header from '@/components/landing/Header';
import Hero from '@/components/landing/Hero';
import FeatureGrid from '@/components/landing/FeatureGrid';
import Steps from '@/components/landing/Steps';
import Footer from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-black selection:bg-white selection:text-black">
      <Header />
      <Hero />
      <FeatureGrid />
      <Steps />
      <Footer />
    </main>
  );
}
