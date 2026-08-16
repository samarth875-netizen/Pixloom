import React from "react";
import Image from "next/image";

const screenshots = [
  {
    src: "/assests/HOMEPAGE-1.png",
    alt: "Pixloom editor homepage",
    title: "The Pixloom Editor",
    caption: "Move, resize, and edit every layer right on the canvas.",
  },
  {
    src: "/assests/homepage-2.png",
    alt: "Pixloom dashboard",
    title: "Your Design Dashboard",
    caption: "Open, organize, and re-edit all of your saved projects.",
  },
  {
    src: "/assests/homepage-3.png",
    alt: "Pixloom design toolkit",
    title: "Design Toolkit",
    caption: "Everything from filters to layers, ready in one click.",
  },
  {
    src: "/assests/homepage-4.png",
    alt: "Pixloom filters and adjustments",
    title: "Pro Adjustments",
    caption: "Tone, color, and fine-tune your images like a pro.",
  },
  {
    src: "/assests/homepage-5.png",
    alt: "Pixloom on any device",
    title: "Work Anywhere",
    caption: "Pick up right where you left off, on any device.",
  },
];

export function Showcase() {
  return (
    <section className="relative py-20 sm:py-28 px-4 sm:px-8 bg-[#0A0A0A] overflow-hidden">
      {/* Glow accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-[#F5F547]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-[#F5F547]/5 blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-14 space-y-4">
          <span className="inline-block text-[11px] font-black uppercase tracking-[0.2em] text-[#F5F547] bg-[#F5F547]/10 border border-[#F5F547]/30 rounded-full px-4 py-1.5">
            Showcase
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            A Quick Look Inside
          </h2>
          <p className="text-sm sm:text-base text-[#9CA3AF] max-w-xl mx-auto">
            From the canvas to the dashboard — everything you need to create,
            edit, and manage your designs.
          </p>
        </div>

        {/* Screenshot Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {screenshots.map((shot, i) => (
            <div
              key={shot.src}
              className={`group relative rounded-[28px] border border-white/10 bg-[#171717] p-3 sm:p-4 shadow-2xl transition-all duration-300 hover:border-[#F5F547]/40 hover:-translate-y-1 ${
                i % 2 === 0 ? "md:mt-0" : "md:mt-8"
              }`}
            >
              <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-black">
                <Image
                  src={shot.src}
                  alt={shot.alt}
                  width={1200}
                  height={800}
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </div>
              <div className="px-2 pt-4 pb-1">
                <h3 className="font-black text-white text-lg">{shot.title}</h3>
                <p className="text-xs sm:text-sm text-[#9CA3AF] mt-1">
                  {shot.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
