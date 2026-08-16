"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  TrendingUp,
  Shield,
  ArrowRight,
  Download,
  Star,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import {
  fadeUp,
  fadeIn,
  scaleIn,
  slideInRight,
  staggerContainer,
  staggerChild,
  viewportOnce,
} from "@/lib/animations";
import { VideoPlayer } from "@/components/landing/VideoPlayer";

export function Hero() {
  const [backupActive, setBackupActive] = useState(true);
  const shouldReduce = useReducedMotion();

  // When user prefers reduced motion, skip transform animations
  const motionProps = (variants: import("framer-motion").Variants, delay = 0) =>
    shouldReduce
      ? {}
      : {
          initial: "hidden",
          animate: "visible",
          custom: delay,
          variants,
        };

  const inViewProps = (variants: import("framer-motion").Variants, delay = 0) =>
    shouldReduce
      ? {}
      : {
          initial: "hidden",
          whileInView: "visible",
          viewport: viewportOnce,
          custom: delay,
          variants,
        };

  return (
    <section className="w-full bg-[#F5F547] text-black pt-12 pb-20 sm:pt-16 sm:pb-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Left Column */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-6 sm:space-y-8 z-10">

            {/* Pill Tag */}
            <motion.div
              {...motionProps(fadeIn, 0.05)}
              className="inline-flex items-center gap-2 bg-black/10 border border-black/20 text-black px-4 py-1.5 rounded-full text-xs sm:text-sm font-black tracking-wider uppercase"
            >
              <span className="w-2 h-2 rounded-full bg-black animate-pulse" />
              <span>AI-POWERED IMAGE STUDIO</span>
            </motion.div>

            {/* Headline — each word staggers */}
            <motion.div
              variants={staggerContainer}
              initial={shouldReduce ? undefined : "hidden"}
              animate={shouldReduce ? undefined : "visible"}
              className="space-y-0"
            >
              <h1 className="text-7xl sm:text-8xl md:text-9xl lg:text-[104px] xl:text-[116px] font-black tracking-tighter leading-[0.88] uppercase text-black select-none">
                {["EDIT", "WITHOUT", "LIMITS"].map((word) => (
                  <motion.span
                    key={word}
                    variants={staggerChild}
                    className="block"
                  >
                    {word}
                  </motion.span>
                ))}
              </h1>
            </motion.div>

            {/* Subtext */}
            <motion.p
              {...motionProps(fadeUp, 0.35)}
              className="text-black/85 text-lg sm:text-xl md:text-2xl font-medium max-w-xl leading-snug"
            >
              The browser-based AI image editor with multi-layer compositing,
              masks, RGB curves, and non-destructive adjustments. Zero install,
              pure speed.
            </motion.p>

            {/* Buttons */}
            <motion.div
              {...motionProps(fadeUp, 0.45)}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <Link href="/editor">
                <motion.button
                  whileHover={shouldReduce ? {} : { scale: 1.03, y: -2 }}
                  whileTap={shouldReduce ? {} : { scale: 0.97 }}
                  className="inline-flex items-center gap-2.5 px-8 py-4 text-base font-bold rounded-full bg-black text-white shadow-xl shadow-black/15"
                >
                  Start Editing Free
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
            </motion.div>

            {/* Social proof */}
            <motion.div
              {...motionProps(fadeUp, 0.55)}
              className="flex items-center gap-4 pt-4"
            >
              <div className="flex -space-x-3 overflow-hidden">
                {["PX", "AI", "MK", "+2M"].map((label, i) => (
                  <div
                    key={i}
                    className="inline-block h-11 w-11 rounded-full ring-2 ring-[#F5F547] bg-[#171717] flex items-center justify-center text-xs font-bold text-white shadow-md"
                    style={{ backgroundColor: ["#171717", "#222222", "#2a2a2a", "#000"][i] }}
                  >
                    <span style={{ color: i === 1 ? "#F5F547" : "#fff" }}>{label}</span>
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 text-black">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-black text-black" />
                  ))}
                </div>
                <p className="text-sm font-bold text-black tracking-tight mt-0.5">
                  2M+ Active Creators &amp; Photographers
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right Column: App Mockup */}
          <motion.div
            {...motionProps(slideInRight, 0.2)}
            className="lg:col-span-5 relative flex justify-center lg:justify-end mt-8 lg:mt-0"
          >
            <div className="relative w-full max-w-[390px] sm:max-w-[420px]">

              {/* Floating Card: Sharpness (Top Right) */}
              <motion.div
                {...motionProps(scaleIn, 0.5)}
                whileHover={shouldReduce ? {} : { scale: 1.05, y: -2 }}
                className="absolute -top-6 -right-2 sm:-right-6 bg-[#171717]/95 backdrop-blur-xl rounded-2xl p-4 border border-white/15 shadow-2xl z-30 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-black/60 flex items-center justify-center text-[#F5F547] border border-white/10">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider">
                    Clarity &amp; Tone
                  </p>
                  <p className="text-lg font-black text-[#F5F547] leading-none mt-0.5">
                    +14.2%
                  </p>
                </div>
              </motion.div>

              {/* Homepage Showcase Image */}
              <div className="relative w-full rounded-[36px] border border-white/10 shadow-2xl overflow-hidden">
                <Image
                  src="/assests/HOMEPAGE-1.png"
                  alt="Pixloom editor homepage"
                  width={1200}
                  height={800}
                  priority
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* Floating Card: Auto-Save (Bottom Left) */}
              <motion.div
                {...motionProps(scaleIn, 0.6)}
                whileHover={shouldReduce ? {} : { scale: 1.05, y: -2 }}
                className="absolute -bottom-7 -left-3 sm:-left-6 bg-[#171717]/95 backdrop-blur-xl rounded-2xl p-4 border border-white/15 shadow-2xl z-30 flex items-center gap-3.5"
              >
                <div className="w-10 h-10 rounded-xl bg-black/60 flex items-center justify-center text-[#F5F547] border border-white/10">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-black text-white leading-tight">Auto-Save</p>
                  <p className="text-[11px] font-medium text-[#9CA3AF]">Protected</p>
                </div>
                <button
                  type="button"
                  onClick={() => setBackupActive(!backupActive)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ml-1 ${backupActive ? "bg-[#F5F547]" : "bg-neutral-700"}`}
                  aria-label="Toggle auto-save status"
                >
                  <div
                    className={`bg-black w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${backupActive ? "translate-x-5" : "translate-x-0"}`}
                  />
                </button>
              </motion.div>

              {/* Floating Pill: Export (Bottom Right) */}
              <motion.div
                {...motionProps(scaleIn, 0.65)}
                className="absolute -bottom-6 right-2 sm:right-4 z-30"
              >
                <Link href="/editor">
                  <motion.button
                    whileHover={shouldReduce ? {} : { scale: 1.05 }}
                    whileTap={shouldReduce ? {} : { scale: 0.96 }}
                    className="bg-black/95 text-white border border-white/20 px-5 py-2.5 rounded-full font-bold text-xs flex items-center gap-2 shadow-xl"
                  >
                    <Download className="w-3.5 h-3.5 text-[#F5F547]" />
                    <span>Export 4K</span>
                  </motion.button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Demo Video */}
        <motion.div
          {...inViewProps(fadeUp, 0.1)}
          className="mt-14 sm:mt-20"
        >
          <VideoPlayer
            src="/videos/pixloom_watermark_replaced.mp4"
            poster="/videos/pixloom_video_cover.png"
          />
        </motion.div>
      </div>
    </section>
  );
}
