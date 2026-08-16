import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Zap } from "lucide-react";
import { AuthForm } from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: "Sign In — Pixloom",
  description:
    "Sign in to Pixloom and continue editing your projects in the browser-based image studio.",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white flex flex-col">
      {/* Top Bar */}
      <header className="w-full px-4 sm:px-6 py-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="w-3 h-3 rounded-full bg-[#F5F547] shadow-[0_0_10px_rgba(245,245,71,0.6)] group-hover:scale-110 transition-transform" />
            <span className="text-lg font-black tracking-widest uppercase">
              PIXLOOM
            </span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-semibold text-[#9CA3AF] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to home
          </Link>
        </div>
      </header>

      {/* Auth Content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          {/* Left: Pitch */}
          <div className="hidden lg:block space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5F547]/10 border border-[#F5F547]/25 text-[#F5F547] text-xs font-black uppercase tracking-widest">
              <Zap className="w-3.5 h-3.5" />
              Welcome Back
            </div>
            <h1 className="text-5xl xl:text-6xl font-black tracking-tight leading-[1.05]">
              Your projects are{" "}
              <span className="text-[#F5F547]">waiting.</span>
            </h1>
            <p className="text-lg text-[#9CA3AF] max-w-md leading-relaxed">
              Sign in to pick up right where you left off — layers, adjustments,
              and exports all saved to your account.
            </p>
            <ul className="space-y-3 pt-2">
              {[
                "Multi-layer editing in your browser",
                "AI background removal & upscaling",
                "Export PNG, JPG, or WebP at any scale",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-white/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F5F547] flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Form */}
          <div>
            <div className="text-center mb-8 lg:hidden">
              <h1 className="text-3xl font-black tracking-tight">
                Welcome back
              </h1>
            </div>
            <AuthForm mode="login" />
          </div>
        </div>
      </div>
    </main>
  );
}
