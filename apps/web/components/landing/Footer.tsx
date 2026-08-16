"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { fadeUp, staggerContainer, staggerChild, viewportOnce } from "@/lib/animations";

export function Footer() {
  const shouldReduce = useReducedMotion();

  const platformLinks = [
    { label: "Features", href: "/#features" },
    { label: "Editor", href: "/editor" },
    { label: "Pricing", href: "/pricing" },
    { label: "Security", href: "/privacy" },
  ];

  const companyLinks = [
    { label: "About Us", href: "/about" },
    { label: "Pricing", href: "/pricing" },
    { label: "Contact", href: "/contact" },
    { label: "Dashboard", href: "/dashboard" },
  ];

  return (
    <footer id="company" className="w-full bg-[#0A0A0A] border-t border-white/[0.08] pt-16 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={staggerContainer}
          initial={shouldReduce ? undefined : "hidden"}
          whileInView={shouldReduce ? undefined : "visible"}
          viewport={viewportOnce}
          className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16"
        >
          {/* Brand */}
          <motion.div variants={staggerChild} className="md:col-span-6 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group inline-flex">
              <span className="w-3.5 h-3.5 rounded-full bg-[#F5F547] shadow-[0_0_10px_rgba(245,245,71,0.5)] group-hover:scale-110 transition-transform" />
              <span className="text-xl font-black tracking-widest text-white uppercase font-sans">
                PIXLOOM
              </span>
            </Link>
            <p className="text-sm text-[#9CA3AF] max-w-sm leading-relaxed">
              The next generation of creative technology. Built for speed, precision, and simplicity.
            </p>
          </motion.div>

          {/* Platform links */}
          <motion.div variants={staggerChild} className="md:col-span-3 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Platform</h4>
            <ul className="space-y-3">
              {platformLinks.map((item) => (
                <li key={item.label}>
                  <motion.a
                    href={item.href}
                    whileHover={shouldReduce ? {} : { x: 4, color: "#FFFFFF" }}
                    className="text-sm text-[#9CA3AF] transition-colors duration-200 inline-block"
                  >
                    {item.label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company links */}
          <motion.div variants={staggerChild} className="md:col-span-3 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Company</h4>
            <ul className="space-y-3">
              {companyLinks.map((item) => (
                <li key={item.label}>
                  <motion.a
                    href={item.href}
                    whileHover={shouldReduce ? {} : { x: 4, color: "#FFFFFF" }}
                    className="text-sm text-[#9CA3AF] transition-colors duration-200 inline-block"
                  >
                    {item.label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* Bottom bar */}
        <motion.div
          initial={shouldReduce ? undefined : { opacity: 0 }}
          whileInView={shouldReduce ? undefined : { opacity: 1 }}
          viewport={viewportOnce}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9CA3AF]"
        >
          <p>© {new Date().getFullYear()} Pixloom Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="transition-colors hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-white">
              Terms of Service
            </Link>
            <Link href="/contact" className="transition-colors hover:text-white">
              Contact
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
