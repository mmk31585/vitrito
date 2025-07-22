"use client";

import { Instagram, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    // Here you can add a fetch/axios call to send the email
  };

  return (
    <footer className="bg-muted/40 text-muted-foreground">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 py-12 px-4 sm:px-6">
        {/* About and Contact Info */}
        <div>
          <h2 className="text-2xl font-bold text-primary mb-3">
            ویتریتو
          </h2>
          <p className="leading-relaxed text-sm md:text-base">
            ویتریتو به شما امکان می‌دهد در چند دقیقه ویترین دیجیتال خود را
            بسازید و حرفه‌ای‌تر دیده شوید.
          </p>
          <div className="flex flex-col gap-3 mt-6">
            {CONTACT_INFO.map(({ Icon, text, href }) => (
              <a
                key={text}
                href={href}
                className="flex items-center gap-2 hover:text-primary transition"
              >
                <Icon size={20} />
                {text}
              </a>
            ))}
          </div>
        </div>

        {/* Important Links and Social Media */}
        <div>
          <h3 className="text-xl font-semibold mb-4">لینک‌های مهم</h3>
          <ul className="space-y-3 text-sm md:text-base">
            {FOOTER_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="hover:text-primary transition">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <h4 className="mb-3 font-semibold text-lg">ما را دنبال کنید</h4>
            <div className="flex gap-4 text-primary">
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
        </div>

        {/* Newsletter Subscription */}
        <div>
          <h3 className="text-xl font-semibold mb-4">عضویت در خبرنامه</h3>
          {subscribed ? (
            <p className="text-green-600 dark:text-green-400 font-medium">
              ممنون از عضویت شما! ایمیل شما با موفقیت ثبت شد.
            </p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col gap-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="email-subscribe">ایمیل</Label>
                <Input
                  type="email"
                  id="email-subscribe"
                  placeholder="ایمیل خود را وارد کنید"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                عضویت
              </Button>
            </form>
          )}
        </div>
      </div>

      <div className="border-t border-border py-6 text-center text-xs">
        <p>© {new Date().getFullYear()} Vitrito. همه حقوق محفوظ است.</p>
      </div>
    </footer>
  );
}
