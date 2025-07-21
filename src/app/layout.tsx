// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "../styles/globals.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const vazir = localFont({
  src: [
    {
      path: "../fonts/Vazirmatn-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/Vazirmatn-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-vazir",
  display: "swap",
});

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ویتریتو | vitrito",
  description: "ساخت ویترین دیجیتال با ویتریتو",
  manifest: "/manifest.json",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${vazir.variable} ${geistSans.variable} ${geistMono.variable} scroll-smooth`}
    >
      <body className="flex flex-col min-h-screen bg-background text-foreground antialiased">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
