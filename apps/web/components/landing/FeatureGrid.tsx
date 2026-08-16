"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Layers,
  Sparkles,
  Sliders,
  MousePointerClick,
  Stamp,
  SlidersHorizontal,
  ChevronRight,
} from "lucide-react";
import {
  fadeUp,
  staggerContainer,
  staggerChild,
  viewportOnce,
} from "@/lib/animations";

export function FeatureGrid() {
  const shouldReduce = useReducedMotion();

  const features = [
    {
      id: "layers-masks",
      title: "Layers & Masks",
      description:
        "Non-destructive layer stack with blend modes, opacity controls, and precise clipping masks.",
      icon: Layers,
      isHighlighted: false,
    },
    {
      id: "ai-background-removal",
      title: "AI Background Removal",
      description:
        "One-click subject cutouts powered by deep learning. Extract portraits and products in seconds.",
      icon: Sparkles,
      isHighlighted: true,
    },
    {
      id: "curves-color-grading",
      title: "Curves & Color Grading",
      description:
        "RGB tone curves, HSL channel controls, white balance calibration, and cinematic presets.",
      icon: Sliders,
      isHighlighted: false,
    },
    {
      id: "smart-object-select",
      title: "Smart Object Select",
      description:
        "AI-assisted magnetic lasso, geometric marquees, and magic wand tools for pixel-perfect boundaries.",
      icon: MousePointerClick,
      isHighlighted: false,
    },
    {
      id: "retouch-heal",
      title: "Retouch & Heal",
      description:
        "Spot healing brush, precision clone stamp, and frequency separation for flawless photo retouching.",
      icon: Stamp,
      isHighlighted: false,
    },
    {
      id: "filters-effects",
      title: "Filters & Effects",
      description:
        "Gaussian and motion blurs, unsharp masks, film grain, vignette, and customizable style packs.",
      icon: SlidersHorizontal,
      isHighlighted: false,
    },
  ];

  return (
    <section id="features" className="w-full bg-[#0A0A0A] py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Section Header — animates in when scrolled into view */}
        <motion.div
          initial={shouldReduce ? undefined : "hidden"}
          whileInView={shouldReduce ? undefined : "visible"}
          viewport={viewportOnce}
          variants={fadeUp}
          custom={0}
          className="mb-14 sm:mb-20"
        >
          <div className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-black tracking-widest uppercase bg-[#F5F547]/10 text-[#F5F547] border border-[#F5F547]/20 mb-6">
            CORE CAPABILITIES
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.08] max-w-2xl">
            <span className="text-white block">Everything you need.</span>
            <span className="text-[#9CA3AF] block">Nothing you don&apos;t.</span>
          </h2>
        </motion.div>

        {/* Staggered 6-card grid */}
        <motion.div
          variants={staggerContainer}
          initial={shouldReduce ? undefined : "hidden"}
          whileInView={shouldReduce ? undefined : "visible"}
          viewport={viewportOnce}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.id}
                variants={staggerChild}
                whileHover={
                  shouldReduce
                    ? {}
                    : {
                        y: -6,
                        boxShadow: feature.isHighlighted
                          ? "0 20px 60px rgba(245,245,71,0.14)"
                          : "0 20px 50px rgba(255,255,255,0.06)",
                      }
                }
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className={`relative rounded-[24px] p-8 border flex flex-col justify-between min-h-[280px] cursor-pointer ${
                  feature.isHighlighted
                    ? "bg-gradient-to-br from-[#1d1e15] via-[#181816] to-[#171717] border-[#F5F547]/40 shadow-[0_0_30px_rgba(245,245,71,0.08)]"
                    : "bg-[#171717] border-white/[0.08] shadow-lg"
                }`}
              >
                {/* Icon */}
                <div>
                  <motion.div
                    whileHover={shouldReduce ? {} : { scale: 1.08, rotate: 4 }}
                    transition={{ type: "spring", stiffness: 400, damping: 18 }}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${
                      feature.isHighlighted
                        ? "bg-[#F5F547]/15 text-[#F5F547] border-[#F5F547]/30"
                        : "bg-white/5 text-white border-white/10"
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </motion.div>

                  <div className="mt-7 space-y-2">
                    <h3 className="text-xl font-black text-white tracking-tight">{feature.title}</h3>
                    <p className="text-sm text-[#9CA3AF] font-normal leading-relaxed">{feature.description}</p>
                  </div>
                </div>

                {/* Bottom Arrow */}
                <div className="flex justify-end mt-6">
                  <motion.div
                    whileHover={shouldReduce ? {} : { x: 4 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className={`w-11 h-11 rounded-full flex items-center justify-center ${
                      feature.isHighlighted
                        ? "bg-[#F5F547] text-black shadow-lg shadow-[#F5F547]/20"
                        : "border border-white/20 text-white bg-transparent"
                    }`}
                  >
                    <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
