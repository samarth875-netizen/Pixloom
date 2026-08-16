import type { Metadata } from "next";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Terms of Service — Pixloom",
  description: "The terms and conditions that govern your use of Pixloom.",
};

const SECTIONS = [
  {
    title: "1. Acceptance of Terms",
    body: [
      "By accessing or using Pixloom, you agree to be bound by these Terms of Service. If you do not agree, please do not use the service.",
    ],
  },
  {
    title: "2. Use of the Service",
    body: [
      "Pixloom provides a browser-based image editing tool. You agree to use the service only for lawful purposes and in a way that does not infringe the rights of others.",
      "You are responsible for the images you upload and the designs you create. You must have the right to use any content you edit.",
    ],
  },
  {
    title: "3. Accounts",
    body: [
      "You must provide accurate information when creating an account and keep your credentials secure.",
      "You are responsible for all activity that occurs under your account. Notify us immediately of any unauthorized use.",
    ],
  },
  {
    title: "4. Intellectual Property",
    body: [
      "Pixloom and its original content, features, and functionality are owned by Pixloom and are protected by applicable intellectual property laws.",
      "You retain all rights to the images and designs you create with the service. We claim no ownership over your content.",
    ],
  },
  {
    title: "5. AI Features",
    body: [
      "AI-powered features are provided on a best-effort basis and may not always produce perfect results.",
      "You are responsible for reviewing AI-generated outputs before using them commercially.",
    ],
  },
  {
    title: "6. Acceptable Use",
    body: [
      "You may not use Pixloom to create, distribute, or promote illegal, harmful, or infringing content, or to attempt to disrupt or hack the service.",
    ],
  },
  {
    title: "7. Termination",
    body: [
      "We may suspend or terminate your access to the service for violations of these terms. You may stop using Pixloom at any time.",
    ],
  },
  {
    title: "8. Disclaimers & Limitation of Liability",
    body: [
      "The service is provided \"as is\" without warranties of any kind, either express or implied.",
      "To the maximum extent permitted by law, Pixloom shall not be liable for any indirect, incidental, or consequential damages arising from your use of the service.",
    ],
  },
  {
    title: "9. Changes to These Terms",
    body: [
      "We may update these terms from time to time. Continued use of the service after changes constitute acceptance of the updated terms.",
    ],
  },
  {
    title: "10. Contact",
    body: [
      "For questions about these terms, contact us at support@pixloom.app or through our contact page.",
    ],
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white flex flex-col">
      <SiteHeader />
      <section className="w-full px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
            Terms of <span className="text-[#F5F547]">Service</span>
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
