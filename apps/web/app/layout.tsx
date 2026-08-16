import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Pixloom — Next Gen Browser-Based Image Editor",
  description:
    "Experience the friction-less future of creativity. A fast, AI-powered image editor with layers, masks, curves, and smart tools running entirely in your browser.",
  keywords: [
    "image editor",
    "browser photo editor",
    "AI image editing",
    "creative tools",
    "background remover",
    "Pixloom",
  ],
  authors: [{ name: "Pixloom Team" }],
  openGraph: {
    title: "Pixloom — Next Gen Browser-Based Image Editor",
    description:
      "A fast, AI-powered image editor that runs entirely in your browser. Built for the bold, designed for speed.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <body className="bg-[#0A0A0A] text-white min-h-screen antialiased flex flex-col font-sans selection:bg-[#F5F547] selection:text-black">
        {children}
      </body>
    </html>
  );
}
