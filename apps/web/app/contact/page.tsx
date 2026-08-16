"use client";

import React, { useState } from "react";
import {
  Mail,
  MapPin,
  MessageSquare,
  Send,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/Button";

const FAQS = [
  {
    q: "Is Pixloom really free?",
    a: "Yes — our Free plan includes layers, adjustments, filters, and exports. AI tools have monthly credits; Pro removes limits.",
  },
  {
    q: "Are my images private?",
    a: "Absolutely. Image processing runs in your browser, and your projects are only stored on your device unless you save them to your account.",
  },
  {
    q: "Can I use Pixloom offline?",
    a: "Most core editing tools work offline after the page has loaded. Cloud sync and AI tools require a connection.",
  },
  {
    q: "Do I need to install anything?",
    a: "No. Pixloom runs entirely in your browser — no downloads, no plugins, no installers.",
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailto = `mailto:support@pixloom.app?subject=${encodeURIComponent(
      form.subject || "Pixloom Contact"
    )}&body=${encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`
    )}`;
    window.location.href = mailto;
    setSubmitted(true);
  };

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Support",
      detail: "support@pixloom.app",
      sub: "We reply within 24 hours",
    },
    {
      icon: MessageSquare,
      title: "Community",
      detail: "Join our Discord",
      sub: "Chat with 12k+ creators",
    },
    {
      icon: Clock,
      title: "Office Hours",
      detail: "Mon – Fri · 9am – 6pm",
      sub: "Live help from our team",
    },
    {
      icon: MapPin,
      title: "HQ",
      detail: "Remote-first · Worldwide",
      sub: "Building from 19 countries",
    },
  ];

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white flex flex-col">
      <SiteHeader />

      {/* Hero */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5F547]/10 border border-[#F5F547]/25 text-[#F5F547] text-xs font-black uppercase tracking-widest">
            <Mail className="w-3.5 h-3.5" />
            Get In Touch
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.05]">
            We&apos;d love to <span className="text-[#F5F547]">hear from you.</span>
          </h1>
          <p className="text-lg text-[#9CA3AF] max-w-2xl mx-auto leading-relaxed">
            Questions, feedback, feature requests, or partnership ideas — our
            team reads every single message.
          </p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="w-full px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {contactMethods.map((method) => {
            const Icon = method.icon;
            return (
              <div
                key={method.title}
                className="bg-[#171717] border border-white/[0.08] rounded-2xl p-6 hover:border-[#F5F547]/40 transition-colors"
              >
                <div className="w-11 h-11 rounded-xl bg-[#F5F547]/10 border border-[#F5F547]/30 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-[#F5F547]" />
                </div>
                <h3 className="text-sm font-black mt-4">{method.title}</h3>
                <p className="text-sm text-[#F5F547] font-semibold mt-1">{method.detail}</p>
                <p className="text-xs text-[#9CA3AF] mt-1">{method.sub}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Form + FAQ */}
      <section className="w-full px-4 sm:px-6 lg:px-8 pb-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Form */}
          <div className="bg-[#171717] border border-white/[0.08] rounded-3xl p-8 sm:p-10">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-black">Message on its way!</h3>
                <p className="text-sm text-[#9CA3AF] max-w-sm">
                  Your email client opened with your message ready to send. We&apos;ll
                  get back to you within 24 hours.
                </p>
                <Button
                  variant="outline-white"
                  onClick={() => {
                    setSubmitted(false);
                    setForm({ name: "", email: "", subject: "", message: "" });
                  }}
                >
                  Send another message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-xl font-black">Send us a message</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Jane Doe"
                      className="w-full bg-black/60 border border-white/15 text-white text-sm rounded-xl px-3.5 py-3 placeholder:text-[#9CA3AF]/60 focus:outline-none focus:border-[#F5F547]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@example.com"
                      className="w-full bg-black/60 border border-white/15 text-white text-sm rounded-xl px-3.5 py-3 placeholder:text-[#9CA3AF]/60 focus:outline-none focus:border-[#F5F547]"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="How can we help?"
                    className="w-full bg-black/60 border border-white/15 text-white text-sm rounded-xl px-3.5 py-3 placeholder:text-[#9CA3AF]/60 focus:outline-none focus:border-[#F5F547]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider">
                    Message
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us what's on your mind…"
                    className="w-full bg-black/60 border border-white/15 text-white text-sm rounded-xl px-3.5 py-3 placeholder:text-[#9CA3AF]/60 focus:outline-none focus:border-[#F5F547] resize-none"
                  />
                </div>
                <Button type="submit" variant="yellow" size="lg" className="w-full font-bold">
                  <Send className="w-4 h-4" />
                  Send Message
                </Button>
              </form>
            )}
          </div>

          {/* FAQ */}
          <div className="space-y-4">
            <h2 className="text-xl font-black">Frequently asked questions</h2>
            {FAQS.map((faq) => (
              <details
                key={faq.q}
                className="group bg-[#171717] border border-white/[0.08] rounded-2xl p-5 open:border-[#F5F547]/40 transition-colors"
              >
                <summary className="text-sm font-bold text-white cursor-pointer list-none flex items-center justify-between gap-3">
                  {faq.q}
                  <span className="text-[#F5F547] text-lg font-black group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <p className="text-sm text-[#9CA3AF] mt-3 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
