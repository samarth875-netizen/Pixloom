import type { Metadata } from "next";
import Link from "next/link";
import { Zap, Shield, Globe2, HeartHandshake, ArrowRight, Rocket } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "About Us — Pixloom",
  description:
    "Meet Pixloom — the team building a fast, AI-powered image editor that runs entirely in your browser.",
};

const VALUES = [
  {
    icon: Zap,
    title: "Speed First",
    description:
      "Editing should never feel like waiting. Every pixel operation is optimized to run instantly in your browser.",
  },
  {
    icon: Shield,
    title: "Privacy By Design",
    description:
      "Your images are processed locally whenever possible and never sold, trained on, or shared without consent.",
  },
  {
    icon: Globe2,
    title: "Zero Install",
    description:
      "No downloads, no bloated installers. Open a tab, sign in, and start creating from any device on earth.",
  },
  {
    icon: HeartHandshake,
    title: "Creator Obsessed",
    description:
      "We build for photographers, designers, and social creators who deserve professional tools without the price tag.",
  },
];

const TEAM = [
  {
    initials: "AS",
    name: "Aarav Sharma",
    role: "Co-Founder & CEO",
    bio: "Ex-photojournalist who believes pro editing should be free of installs and subscriptions.",
  },
  {
    initials: "MK",
    name: "Meera Kapoor",
    role: "Head of Engineering",
    bio: "Canvas & WebGPU performance geek. Makes 100MP images feel instant.",
  },
  {
    initials: "JR",
    name: "Jonas Rivera",
    role: "AI Research Lead",
    bio: "Builds the background removal and super-resolution models you see in the AI panel.",
  },
  {
    initials: "LY",
    name: "Lin Yu",
    role: "Design Director",
    bio: "Obsessive about the tiny details that make editors feel like magic.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white flex flex-col">
      <SiteHeader />

      {/* Hero */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5F547]/10 border border-[#F5F547]/25 text-[#F5F547] text-xs font-black uppercase tracking-widest">
            <Rocket className="w-3.5 h-3.5" />
            Our Story
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.05]">
            Pro-grade editing,{" "}
            <span className="text-[#F5F547]">right in your browser.</span>
          </h1>
          <p className="text-lg text-[#9CA3AF] max-w-2xl mx-auto leading-relaxed">
            Pixloom started with a simple frustration: professional image editors
            were either expensive desktop software or watered-down mobile apps.
            So we built the middle ground — a fast, AI-powered studio that runs
            entirely in the web, with layers, masks, curves, and smart tools.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="w-full px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { value: "2M+", label: "Active Creators" },
            { value: "48M+", label: "Images Edited" },
            { value: "190+", label: "Countries" },
            { value: "99.9%", label: "Uptime" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-[#171717] border border-white/[0.08] rounded-2xl p-8 text-center"
            >
              <p className="text-4xl font-black text-[#F5F547]">{stat.value}</p>
              <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider mt-2">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="w-full px-4 sm:px-6 lg:px-8 pb-20 sm:pb-28">
        <div className="max-w-7xl mx-auto rounded-[28px] bg-gradient-to-br from-[#1d1e15] to-[#171717] border border-[#F5F547]/25 p-10 sm:p-16">
          <div className="max-w-3xl">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Our mission is simple:{" "}
              <span className="text-[#F5F547]">remove every barrier between your idea and your image.</span>
            </h2>
            <p className="text-base text-[#9CA3AF] mt-6 leading-relaxed">
              We believe creative tools should be powerful enough for
              professionals yet approachable enough for everyone else. That&apos;s
              why Pixloom runs entirely in the browser, processes your work
              locally for speed and privacy, and gives you the same non-destructive
              editing model the desktop giants use — without the monthly license.
            </p>
            <Link href="/signup" className="inline-block mt-8">
              <Button variant="yellow" size="lg" className="font-bold">
                Start Editing Free <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="w-full px-4 sm:px-6 lg:px-8 pb-20 sm:pb-28">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-12">
            What we <span className="text-[#F5F547]">stand for</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {VALUES.map((value) => {
              const Icon = value.icon;
              return (
                <div
                  key={value.title}
                  className="bg-[#171717] border border-white/[0.08] rounded-2xl p-8 hover:border-[#F5F547]/40 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#F5F547]/10 border border-[#F5F547]/30 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-[#F5F547]" />
                  </div>
                  <h3 className="text-lg font-black mt-5">{value.title}</h3>
                  <p className="text-sm text-[#9CA3AF] mt-2 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="w-full px-4 sm:px-6 lg:px-8 pb-20 sm:pb-28">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-12">
            The humans behind <span className="text-[#F5F547]">Pixloom</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map((member) => (
              <div
                key={member.name}
                className="bg-[#171717] border border-white/[0.08] rounded-2xl p-6 hover:border-white/20 transition-colors"
              >
                <div className="w-14 h-14 rounded-full bg-[#F5F547]/15 border border-[#F5F547]/30 flex items-center justify-center text-[#F5F547] font-black">
                  {member.initials}
                </div>
                <h3 className="text-base font-black mt-4">{member.name}</h3>
                <p className="text-xs font-bold text-[#F5F547] mt-0.5">{member.role}</p>
                <p className="text-xs text-[#9CA3AF] mt-3 leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
