import type { Metadata } from "next";
import Link from "next/link";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Pricing — Pixloom",
  description:
    "Simple, transparent pricing for Pixloom. Start free, upgrade when you need more AI credits and unlimited exports.",
};

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "/ forever",
    tagline: "For casual creators getting started.",
    cta: "Start Free",
    href: "/signup",
    variant: "outline-white" as const,
    features: [
      "Unlimited local editing",
      "Layers, masks & blend modes",
      "Basic adjustments & filters",
      "PNG / JPG / WebP exports",
      "5 AI credits / month",
    ],
  },
  {
    name: "Pro",
    price: "$9",
    period: "/ month",
    tagline: "For creators who ship every day.",
    cta: "Start 14-Day Free Trial",
    href: "/signup?plan=pro",
    variant: "yellow" as const,
    popular: true,
    features: [
      "Everything in Free",
      "Unlimited AI credits",
      "4K & lossless exports",
      "Background removal & upscaling",
      "Batch processing",
      "Priority support",
    ],
  },
  {
    name: "Team",
    price: "$29",
    period: "/ member / month",
    tagline: "For studios and brand teams.",
    cta: "Contact Sales",
    href: "/contact",
    variant: "outline" as const,
    features: [
      "Everything in Pro",
      "5+ seats included",
      "Shared brand kits & assets",
      "Centralized billing",
      "SSO & team permissions",
      "Dedicated account manager",
    ],
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white flex flex-col">
      <SiteHeader />

      {/* Hero */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5F547]/10 border border-[#F5F547]/25 text-[#F5F547] text-xs font-black uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            Simple Pricing
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.05]">
            Start free. <span className="text-[#F5F547]">Upgrade when you&apos;re ready.</span>
          </h1>
          <p className="text-lg text-[#9CA3AF] max-w-2xl mx-auto leading-relaxed">
            Every plan includes the full browser editor with no watermarks. Only
            AI credits and advanced exports change as you grow.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="w-full px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-3xl p-8 sm:p-10 transition-transform hover:-translate-y-1 ${
                plan.popular
                  ? "bg-gradient-to-br from-[#1d1e15] to-[#171717] border-2 border-[#F5F547] shadow-[0_0_40px_rgba(245,245,71,0.12)]"
                  : "bg-[#171717] border border-white/[0.08]"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#F5F547] text-black text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                  Most Popular
                </span>
              )}

              <h2 className="text-lg font-black uppercase tracking-wider">{plan.name}</h2>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-5xl font-black">{plan.price}</span>
                <span className="text-sm text-[#9CA3AF]">{plan.period}</span>
              </div>
              <p className="text-sm text-[#9CA3AF] mt-3">{plan.tagline}</p>

              <ul className="mt-8 space-y-3.5 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-white/85">
                    <Check className="w-4 h-4 text-[#F5F547] mt-0.5 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link href={plan.href} className="mt-10">
                <Button variant={plan.variant} size="lg" className="w-full font-bold">
                  {plan.cta} <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison hint */}
      <section className="w-full px-4 sm:px-6 lg:px-8 pb-24">
        <div className="max-w-4xl mx-auto text-center bg-[#171717]/60 border border-white/[0.06] rounded-3xl p-10">
          <h2 className="text-2xl font-black">Unsure which plan fits?</h2>
          <p className="text-sm text-[#9CA3AF] mt-3 max-w-xl mx-auto">
            All features work on the Free plan — you&apos;ll never hit a hard paywall
            mid-edit. Try everything, export your work, and upgrade only if you
            want unlimited AI credits.
          </p>
          <Link href="/signup" className="inline-block mt-6">
            <Button variant="yellow" size="lg" className="font-bold">
              Start Free Today
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
