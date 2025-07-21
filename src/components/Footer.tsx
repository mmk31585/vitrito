"use client";

import { Card, Divider, Button, Input } from "@heroui/react";
import { Instagram, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const FOOTER_LINKS = [
  { href: "/about", label: "درباره ما" },
  { href: "/privacy", label: "قوانین و حریم خصوصی" },
  { href: "/contact", label: "تماس با ما" },
  { href: "/faq", label: "سوالات متداول" },
];

const CONTACT_INFO = [
  { Icon: Mail, text: "support@vitrito.ir", href: "mailto:support@vitrito.ir" },
  { Icon: Phone, text: "۰۹۱۲۱۲۳۴۵۶۷", href: "tel:09121234567" },
];

const SOCIAL_LINKS = [
  {
    Icon: Instagram,
    href: "https://instagram.com/vitrito",
    label: "Instagram",
  },
];

function FooterCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card
      className={`bg-white dark:bg-neutral-800 p-6 rounded-2xl shadow-md ${className}`}
    >
      {children}
    </Card>
  );
}

export default function Footer() {
  const pathname = usePathname();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const hiddenPaths = ["/login", "/register"];
  if (hiddenPaths.includes(pathname)) return null;

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
    // توی اینجا می‌تونی fetch/axios برای ارسال ایمیل قرار بدی
  };

  return (
    <footer className="bg-gray-50 dark:bg-neutral-900 text-gray-700 dark:text-gray-300 py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-right font-[var(--font-vazir)]">
        {/* معرفی و اطلاعات تماس */}
        <FooterCard>
          <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-3 select-none">
            ویتریتو
          </h2>
          <p className="leading-relaxed text-sm md:text-base">
            ویتریتو به شما امکان می‌دهد در چند دقیقه ویترین دیجیتال خود را
            بسازید و حرفه‌ای‌تر دیده شوید.
          </p>
          <div className="flex flex-col gap-3 mt-6 text-gray-600 dark:text-gray-400">
            {CONTACT_INFO.map(({ Icon, text, href }) => (
              <a
                key={text}
                href={href}
                className="flex items-center gap-2 hover:text-blue-600 transition"
              >
                <Icon size={20} />
                {text}
              </a>
            ))}
          </div>
        </FooterCard>

        {/* لینک‌های مهم و شبکه‌های اجتماعی */}
        <FooterCard>
          <h3 className="text-xl font-semibold mb-4">لینک‌های مهم</h3>
          <ul className="space-y-3 text-sm md:text-base">
            {FOOTER_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="hover:text-blue-600 transition">
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          <Divider className="my-6" />

          <div>
            <h4 className="mb-3 font-semibold text-lg">ما را دنبال کنید</h4>
            <div className="flex gap-4 text-blue-600 dark:text-blue-400">
              {SOCIAL_LINKS.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="hover:opacity-80 transition"
                >
                  <Icon size={28} />
                </a>
              ))}
            </div>
          </div>
        </FooterCard>

        {/* عضویت در خبرنامه */}
        <FooterCard className="flex flex-col justify-between">
          <h3 className="text-xl font-semibold mb-4">عضویت در خبرنامه</h3>
          {subscribed ? (
            <p className="text-green-600 dark:text-green-400 font-medium">
              ممنون از عضویت شما! ایمیل شما با موفقیت ثبت شد.
            </p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col gap-4">
              <Input
                type="email"
                placeholder="ایمیل خود را وارد کنید"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" variant="solid" className="w-full">
                عضویت
              </Button>
            </form>
          )}
        </FooterCard>
      </div>

      <div className="mt-10 text-center text-xs text-gray-400 dark:text-gray-600 select-none">
        © {new Date().getFullYear()} Vitrito. همه حقوق محفوظ است.
      </div>
    </footer>
  );
}
