import { Navbar } from "@/components/landing/navbar";
import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { BenefitsSection } from "@/components/landing/benefits-section";
import { DemoSection } from "@/components/landing/demo-section";
import { BlogSection } from "@/components/landing/blog-section";
import { CTASection } from "@/components/landing/cta-section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NusaAI — Belajar Lebih Cepat dengan AI",
  description:
    "Platform belajar berbasis AI untuk pelajar Indonesia. Upload materi, tanya AI, dan buat quiz otomatis.",
};

export default function LandingPage() {
  return (
    <main className="bg-[#fcfcfc] min-h-screen text-zinc-900">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <BenefitsSection />
      <DemoSection />
      <BlogSection />
      <CTASection />
    </main>
  );
}
