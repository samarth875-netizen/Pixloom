"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { fadeUp, scaleIn, staggerContainer, staggerChild, viewportOnce } from "@/lib/animations";

export function CTASection() {
  const shouldReduce = useReducedMotion();

  return (
    <section className="w-full bg-[#0A0A0A] py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={shouldReduce ? undefined : "hidden"}
          whileInView={shouldReduce ? undefined : "visible"}
          viewport={viewportOnce}
          variants={scaleIn}
          custom={0}
          className="relative rounded-[28px] sm:rounded-[36px] bg-[#171717] border border-white/[0.08] p-10 sm:p-16 md:p-20 text-center overflow-hidden shadow-2xl"
        >
          {/* Yellow glow */}
          <div
            className="absolute -top-32 left-1/2 -translate-x-1/2 w-[480px] h-[220px] bg-[#F5F547]/20 blur-[100px] rounded-full pointer-events-none"
            aria-hidden="true"
          />

          <motion.div
            variants={fadeUp}
            custom={0.1}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-[#9CA3AF] mb-6 relative z-10"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#F5F547]" />
            <span>Zero Software Installation</span>
          </motion.div>

          <motion.h2
            variants={fadeUp}
            custom={0.2}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-3xl mx-auto leading-[1.05] relative z-10"
          >
            Start editing for free —{" "}
            <motion.span
              className="text-[#F5F547]"
              whileHover={shouldReduce ? {} : { textShadow: "0 0 30px rgba(245,245,71,0.6)" }}
            >
              no install
            </motion.span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            custom={0.3}
            className="text-base sm:text-lg md:text-xl text-[#9CA3AF] max-w-2xl mx-auto mt-6 leading-relaxed relative z-10"
          >
            Join millions of creators crafting visuals with Pixloom. Fast,
            powerful, and running directly inside your web browser.
          </motion.p>

          <motion.div
            variants={staggerContainer}
            className="flex flex-wrap items-center justify-center gap-4 mt-10 relative z-10"
          >
            <motion.div variants={staggerChild}>
              <Link href="/editor">
                <motion.button
                  whileHover={shouldReduce ? {} : { scale: 1.04, y: -2, boxShadow: "0 16px 48px rgba(245,245,71,0.25)" }}
                  whileTap={shouldReduce ? {} : { scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-8 py-4 text-base font-bold rounded-full bg-[#F5F547] text-black shadow-xl shadow-[#F5F547]/15"
                >
                  Open Editor Free
                  <ArrowRight className="w-5 h-5 ml-1" />
                </motion.button>
              </Link>
            </motion.div>

            <motion.div variants={staggerChild}>
              <Link href="#features">
                <motion.button
                  whileHover={shouldReduce ? {} : { scale: 1.04, y: -2, borderColor: "rgba(255,255,255,0.4)" }}
                  whileTap={shouldReduce ? {} : { scale: 0.97 }}
                  className="inline-flex items-center px-8 py-4 text-base font-bold rounded-full border border-white/20 text-white bg-transparent"
                >
                  Explore Features
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
