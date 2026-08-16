"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { staggerContainer, staggerChild, fadeUp, viewportOnce } from "@/lib/animations";

export function LogoStrip() {
  const shouldReduce = useReducedMotion();

  const logos = [
    { name: "STUDIO CO", symbol: "◆" },
    { name: "PIXEL LAB", symbol: "▲" },
    { name: "LUMINA PHOTO", symbol: "■" },
    { name: "LENSCRAFT", symbol: "◎" },
    { name: "APERTURE STUDIOS", symbol: "⬡" },
    { name: "RENDERHAUS", symbol: "✦" },
  ];

  return (
    <section className="w-full bg-[#0A0A0A] py-12 sm:py-16 border-y border-white/[0.06] overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.p
          initial={shouldReduce ? undefined : "hidden"}
          whileInView={shouldReduce ? undefined : "visible"}
          viewport={viewportOnce}
          variants={fadeUp}
          custom={0}
          className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-[#9CA3AF]/60 mb-8"
        >
          Trusted by 2M+ photographers, digital artists &amp; design studios worldwide
        </motion.p>

        <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
          <motion.div
            variants={staggerContainer}
            initial={shouldReduce ? undefined : "hidden"}
            whileInView={shouldReduce ? undefined : "visible"}
            viewport={viewportOnce}
            className="flex items-center justify-around gap-10 sm:gap-16"
          >
            {logos.map((brand, i) => (
              <motion.div
                key={i}
                variants={staggerChild}
                whileHover={shouldReduce ? {} : { opacity: 1, y: -2 }}
                className="flex items-center gap-2.5 font-bold tracking-widest text-sm sm:text-base text-[#9CA3AF] whitespace-nowrap uppercase select-none opacity-40 hover:opacity-80 transition-opacity duration-300 group"
              >
                <motion.span
                  whileHover={shouldReduce ? {} : { color: "#F5F547", scale: 1.2 }}
                  className="text-xs text-[#9CA3AF]/70 transition-colors"
                >
                  {brand.symbol}
                </motion.span>
                <span className="group-hover:text-white transition-colors">{brand.name}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
