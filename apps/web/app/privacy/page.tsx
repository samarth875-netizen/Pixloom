import type { Metadata } from "next";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy — Pixloom",
  description: "How Pixloom collects, uses, and protects your data.",
};

const SECTIONS = [
  {
    title: "1. Information We Collect",
    body: [
      "Account information: email address and (if provided) display name when you create an account.",
      "Project data: images and designs you create. By default these are stored locally on your device. If you sign in, you can opt to save projects to your account.",
      "Usage data: anonymous analytics about how the editor is used (feature usage, crash reports) to improve the product.",
    ],
  },
  {
    title: "2. How We Use Your Information",
    body: [
      "To provide, operate, and maintain Pixloom and its features.",
      "To process AI operations you explicitly trigger (background removal, upscaling).",
      "To respond to your support requests and improve our service.",
    ],
  },
  {
    title: "3. Image Processing & AI",
    body: [
      "Core editing — cropping, layers, adjustments, filters, and exports — happens entirely in your browser and your pixels never leave your device.",
      "AI features process image data through third-party providers only when you explicitly trigger them.",
      "We never use your images to train models, and we never sell your content.",
    ],
  },
  {
    title: "4. Cookies & Authentication",
    body: [
      "We use essential cookies to keep you signed in and to secure your session.",
      "Authentication is powered by Supabase; their privacy policy applies to the underlying auth infrastructure.",
    ],
  },
  {
    title: "5. Data Retention & Deletion",
    body: [
      "You can delete your projects from the dashboard at any time. Deleting your account removes stored account data within 30 days.",
      "To request deletion of your data, contact support@pixloom.app.",
    ],
  },
  {
    title: "6. Your Rights",
    body: [
      "Depending on your location, you may have rights to access, correct, export, or delete your personal data. Contact us to exercise these rights.",
    ],
  },
  {
    title: "7. Contact",
    body: [
      "Questions about this policy? Email us at support@pixloom.app or use our contact page.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white flex flex-col">
      <SiteHeader />
      <section className="w-full px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
            Privacy <span className="text-[#F5F547]">Policy</span>
          </h1>
          <p className="text-sm text-[#9CA3AF] mb-12">
            Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
          <div className="space-y-10">
            {SECTIONS.map((section) => (
              <div key={section.title}>
                <h2 className="text-xl font-black mb-3">{section.title}</h2>
                <div className="space-y-3">
                  {section.body.map((paragraph, i) => (
                    <p key={i} className="text-sm text-[#9CA3AF] leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
