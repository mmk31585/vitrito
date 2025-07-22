// src/app/layout.tsx
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "react-hot-toast";
import { PageTransition } from "@/components/PageTransition";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "../styles/globals.css";

// بارگذاری فونت‌های محلی
const vazir = localFont({
  src: [
    {
      path: "../fonts/Vazirmatn-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    { path: "../fonts/Vazirmatn-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-vazir",
  display: "swap",
});

// تنظیمات متا دیتا
export const metadata: Metadata = {
  title: "ویتریتو | vitrito",
  description: "ساخت ویترین دیجیتال با ویتریتو",
  manifest: "/manifest.json",
  icons: { icon: "/favicon.ico" },
};

// زبان‌های پشتیبانی شده و زبان پیش‌فرض
const SUPPORTED_LOCALES = ["fa", "en"];
const DEFAULT_LOCALE = "fa";

// بارگذاری locale از context یا کوکی
async function getLocaleFromRequest(
  params?: Record<string, string | undefined>
) {
  let locale = params?.locale;
  if (!locale || !SUPPORTED_LOCALES.includes(locale)) {
    locale = DEFAULT_LOCALE;
  }
  return locale;
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params?: Record<string, string | undefined>;
}) {
  const locale = await getLocaleFromRequest(params);

  // بارگذاری پیام‌ها
  let messages;
  try {
    messages = await getMessages(locale);
  } catch {
    // اگر باز هم خطا داشت، پیام زبان پیش‌فرض را بارگذاری کن
    messages = await getMessages(DEFAULT_LOCALE);
  }

  return (
    <html
      lang={locale}
      dir={locale === "fa" ? "rtl" : "ltr"}
      className={`${vazir.variable} scroll-smooth`}
    >
      <body className="flex flex-col min-h-screen bg-background text-foreground antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            <main className="flex-grow container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
              <PageTransition>{children}</PageTransition>
            </main>
            <Footer />
            <Toaster />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
