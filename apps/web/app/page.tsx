import React from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { LogoStrip } from "@/components/landing/LogoStrip";
import { FeatureGrid } from "@/components/landing/FeatureGrid";
import { Showcase } from "@/components/landing/Showcase";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white flex flex-col selection:bg-[#F5F547] selection:text-black">
      {/* 1. Navbar */}
      <Navbar />

      {/* 2. Hero Section */}
      <Hero />

      {/* 3. Logo Strip */}
      <LogoStrip />

      {/* 4. Features Section */}
      <FeatureGrid />

      {/* 5. Showcase (screenshots) */}
      <Showcase />

      {/* 6. CTA Section */}
      <CTASection />

      {/* 7. Footer */}
      <Footer />
    </main>
  );
}
