"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { ThemeToggler } from "./ThemeToggler";

const NAV_LINKS = [
  { href: "/#features", label: "امکانات" },
  { href: "/#pricing", label: "تعرفه‌ها" },
  { href: "/#samples", label: "نمونه ویترین‌ها" },
  { href: "/#faq", label: "سوالات متداول" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setShow(currentScrollY < lastScrollY || currentScrollY < 50);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const hiddenPaths = ["/login", "/signup"];

  if (hiddenPaths.includes(pathname)) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[95%] max-w-6xl">
      <nav
        dir="rtl"
        className={`relative rounded-2xl px-6 py-3 shadow-xl backdrop-blur-md bg-white/90 dark:bg-neutral-900 border border-gray-200 dark:border-gray-700 transition-all duration-300 ${
          show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Right Menu (Desktop) */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-sm font-medium transition ${
                  pathname === href.split("#")[0]
                    ? "text-blue-600 dark:text-blue-400 underline underline-offset-4"
                    : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Logo Center */}
          <Link
            href="/"
            className="absolute right-1/2 translate-x-1/2 text-xl font-extrabold text-blue-600 dark:text-blue-400 tracking-tight select-none"
          >
            ویتریتو
          </Link>

          {/* Left Menu (Desktop) */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggler />
            {session ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="text-sm">
                    Dashboard
                  </Button>
                </Link>
                <Button
                  onClick={handleSignOut}
                  variant="destructive"
                  size="sm"
                  className="text-sm"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-sm">
                    ورود
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="text-sm">
                    ساخت ویترین
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden text-gray-700 dark:text-gray-200"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 space-y-3">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block text-sm py-2 font-medium transition ${
                  pathname === href.split("#")[0]
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                }`}
              >
                {label}
              </Link>
            ))}
            <div className="flex gap-3 pt-2">
              {session ? (
                <>
                  <Link href="/dashboard" className="flex-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-sm"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Button>
                  </Link>
                  <Button
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                    variant="destructive"
                    size="sm"
                    className="flex-1 text-sm"
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" className="flex-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-sm"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      ورود
                    </Button>
                  </Link>
                  <Link href="/signup" className="flex-1">
                    <Button
                      size="sm"
                      className="w-full text-sm"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      ساخت ویترین
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}
