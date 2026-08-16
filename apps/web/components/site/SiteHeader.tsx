"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useUser } from "@/components/auth/useUser";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Features", href: "/#features" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useUser();

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="w-3 h-3 rounded-full bg-[#F5F547] shadow-[0_0_10px_rgba(245,245,71,0.6)] group-hover:scale-110 transition-transform" />
          <span className="text-lg font-black tracking-widest uppercase text-white">
            PIXLOOM
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[#9CA3AF] hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Auth Actions */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <Link
              href="/dashboard"
              className="rounded-full font-bold text-xs px-5 py-2.5 bg-[#F5F547] text-black hover:brightness-105 transition-all"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full font-semibold text-xs px-4 py-2.5 text-white/80 hover:text-white transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-full font-bold text-xs px-5 py-2.5 bg-[#F5F547] text-black hover:brightness-105 transition-all"
              >
                Sign Up Free
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-white transition-colors"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0A0A0A]/95 backdrop-blur-xl">
          <nav className="flex flex-col px-6 py-4 space-y-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-[#9CA3AF] hover:text-white py-1"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-white/10 flex gap-3">
              {user ? (
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center rounded-full font-bold text-sm px-5 py-2.5 bg-[#F5F547] text-black"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center rounded-full font-semibold text-sm px-5 py-2.5 border border-white/20 text-white"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center rounded-full font-bold text-sm px-5 py-2.5 bg-[#F5F547] text-black"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
