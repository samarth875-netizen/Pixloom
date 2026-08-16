"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, X, LogOut, LayoutGrid } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useUser } from "@/components/auth/useUser";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const rafRef = useRef<number | null>(null);
  const shouldReduce = useReducedMotion();
  const { user, loading } = useUser();

  useEffect(() => {
    setScrolled(window.scrollY > 0);

    const handleScroll = () => {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 0);
        rafRef.current = null;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "Capabilities", href: "#features" },
    { label: "Company", href: "#company" },
  ];

  return (
    <motion.div
      initial={shouldReduce ? false : { y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] as const }}
      className="sticky top-0 z-50 w-full"
    >
    <header
      className="w-full border-b"
      style={{
        backgroundColor: scrolled ? "rgba(10, 10, 10, 0.9)" : "#F5F547",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
        borderColor: scrolled ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)",
        transition:
          "background-color 0.35s ease, border-color 0.35s ease, backdrop-filter 0.35s ease",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <span
            className="w-3 h-3 rounded-full transition-all duration-300 group-hover:scale-110"
            style={{
              backgroundColor: scrolled ? "#F5F547" : "#0A0A0A",
              boxShadow: scrolled
                ? "0 0 12px rgba(245,245,71,0.7)"
                : "0 0 8px rgba(0,0,0,0.3)",
            }}
          />
          <span
            className="text-xl font-black tracking-widest uppercase font-sans transition-colors duration-300"
            style={{ color: scrolled ? "#FFFFFF" : "#0A0A0A" }}
          >
            PIXLOOM
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <nav className="flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium transition-colors duration-300"
                style={{ color: scrolled ? "#9CA3AF" : "rgba(0,0,0,0.6)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = scrolled ? "#FFFFFF" : "#000000")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = scrolled
                    ? "#9CA3AF"
                    : "rgba(0,0,0,0.6)")
                }
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA Button — inverts between states */}
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="rounded-full font-semibold text-xs tracking-wide px-4 py-2.5 border hover:opacity-80 active:scale-95 transition-all duration-300"
                style={
                  scrolled
                    ? {
                        backgroundColor: "#F5F547",
                        color: "#0A0A0A",
                        borderColor: "#F5F547",
                      }
                    : {
                        backgroundColor: "#0A0A0A",
                        color: "#FFFFFF",
                        borderColor: "#0A0A0A",
                      }
                }
              >
                Dashboard
              </Link>
              <div
                className="hidden md:flex items-center gap-2 pl-2"
                style={{ color: scrolled ? "#9CA3AF" : "rgba(0,0,0,0.6)" }}
              >
                <span
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-black uppercase border"
                  style={{
                    backgroundColor: scrolled ? "#171717" : "#0A0A0A",
                    color: "#F5F547",
                    borderColor: scrolled ? "#ffffff20" : "#00000020",
                  }}
                >
                  {(user.user_metadata?.full_name as string)?.charAt(0) ||
                    user.email?.charAt(0)?.toUpperCase() ||
                    "U"}
                </span>
                <div className="hidden lg:block leading-tight">
                  <p className="text-xs font-bold text-white max-w-[140px] truncate">
                    {user.user_metadata?.full_name || user.email}
                  </p>
                  <p className="text-[10px]">Signed in</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="rounded-full font-semibold text-xs tracking-wide px-4 py-2.5 border hover:opacity-80 active:scale-95 transition-all duration-300"
                style={
                  scrolled
                    ? {
                        backgroundColor: "transparent",
                        color: "#FFFFFF",
                        borderColor: "rgba(255,255,255,0.25)",
                      }
                    : {
                        backgroundColor: "transparent",
                        color: "#0A0A0A",
                        borderColor: "rgba(0,0,0,0.3)",
                      }
                }
              >
                Log in
              </Link>
              <Link href="/signup">
                <button
                  className="rounded-full font-semibold text-xs tracking-wide px-5 py-2.5 border hover:opacity-80 active:scale-95 transition-all duration-300"
                  style={
                    scrolled
                      ? {
                          backgroundColor: "#F5F547",
                          color: "#0A0A0A",
                          borderColor: "#F5F547",
                        }
                      : {
                          backgroundColor: "#0A0A0A",
                          color: "#FFFFFF",
                          borderColor: "#0A0A0A",
                        }
                  }
                >
                  Sign Up Free
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile: CTA + Hamburger */}
        <div className="flex md:hidden items-center gap-3">
          <Link href={user ? "/dashboard" : "/signup"}>
            <button
              className="rounded-full text-xs px-4 py-2 border font-semibold transition-all duration-300"
              style={
                scrolled
                  ? {
                      backgroundColor: "#F5F547",
                      color: "#0A0A0A",
                      borderColor: "#F5F547",
                    }
                  : {
                      backgroundColor: "#0A0A0A",
                      color: "#FFFFFF",
                      borderColor: "#0A0A0A",
                    }
              }
            >
              {user ? "Dashboard" : "Sign Up"}
            </button>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg transition-colors"
            style={{ color: scrolled ? "#9CA3AF" : "#0A0A0A" }}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            key="mobile-menu"
            initial={shouldReduce ? { opacity: 1 } : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
            className="md:hidden border-t overflow-hidden"
            style={{
              backgroundColor: scrolled ? "rgba(10,10,10,0.95)" : "#F5F547",
              borderColor: scrolled ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
            }}
          >
            <nav className="flex flex-col space-y-4 px-6 py-6">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  initial={shouldReduce ? {} : { x: -16, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.07, duration: 0.3, ease: "easeOut" }}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-medium transition-colors py-1"
                  style={{ color: scrolled ? "#9CA3AF" : "rgba(0,0,0,0.7)" }}
                >
                  {link.label}
                </motion.a>
              ))}

              {/* Auth actions */}
              {user ? (
                <>
                  <motion.div
                    initial={shouldReduce ? {} : { x: -16, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.28, duration: 0.3, ease: "easeOut" }}
                    className="flex items-center gap-2 text-sm font-semibold pt-2 border-t border-white/10"
                    style={{ color: scrolled ? "#FFFFFF" : "#0A0A0A" }}
                  >
                    <LayoutGrid className="w-4 h-4 text-[#F5F547]" />
                    <span className="truncate max-w-[180px]">
                      {user.user_metadata?.full_name || user.email}
                    </span>
                  </motion.div>
                  <motion.a
                    href="/dashboard"
                    initial={shouldReduce ? {} : { x: -16, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.35, duration: 0.3, ease: "easeOut" }}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-base font-medium py-1"
                    style={{ color: scrolled ? "#9CA3AF" : "rgba(0,0,0,0.7)" }}
                  >
                    <LayoutGrid className="w-4 h-4" /> Dashboard
                  </motion.a>
                  <motion.a
                    href="/editor"
                    initial={shouldReduce ? {} : { x: -16, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.42, duration: 0.3, ease: "easeOut" }}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-base font-medium py-1"
                    style={{ color: scrolled ? "#9CA3AF" : "rgba(0,0,0,0.7)" }}
                  >
                    Open Editor
                  </motion.a>
                </>
              ) : (
                <>
                  <motion.a
                    href="/login"
                    initial={shouldReduce ? {} : { x: -16, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.28, duration: 0.3, ease: "easeOut" }}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-base font-medium py-1"
                    style={{ color: scrolled ? "#9CA3AF" : "rgba(0,0,0,0.7)" }}
                  >
                    Log in
                  </motion.a>
                  <motion.a
                    href="/signup"
                    initial={shouldReduce ? {} : { x: -16, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.35, duration: 0.3, ease: "easeOut" }}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-base font-bold py-1"
                    style={{ color: scrolled ? "#F5F547" : "#0A0A0A" }}
                  >
                    Sign up free
                  </motion.a>
                </>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
    </motion.div>
  );
}
