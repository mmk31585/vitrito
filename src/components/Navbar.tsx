"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { useLocale } from "next-intl";
import { ThemeToggler } from "./ThemeToggler";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { motion, useAnimation } from "framer-motion";

const NAV_LINKS = [
  { href: "/#features", label: "امکانات" },
  { href: "/#pricing", label: "تعرفه‌ها" },
  { href: "/#samples", label: "نمونه ویترین‌ها" },
  { href: "/#faq", label: "سوالات متداول" },
];

export default function Navbar() {
  const router = useRouter();
  const locale = useLocale();
  const pathname = usePathname();
  const [session, setSession] = useState<Session | null>(null);
  const [lastScrollY, setLastScrollY] = useState(0);
  const controls = useAnimation();

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

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        controls.start("hidden");
      } else {
        controls.start("visible");
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, controls]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const hiddenPaths = ["/login", "/signup"];
  if (hiddenPaths.includes(pathname)) return null;

  const navBarVariants = {
    visible: { y: 0, opacity: 1 },
    hidden: { y: -100, opacity: 0 },
  };

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-50"
      variants={navBarVariants}
      initial="visible"
      animate={controls}
      transition={{ duration: 0.3 }}
    >
      <header className="container mx-auto flex items-center justify-between h-16 px-4 sm:px-6">
        <Link href="/" className="text-xl font-extrabold text-blue-600 dark:text-blue-400 tracking-tight select-none">
          ویتریتو
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            {NAV_LINKS.map(({ href, label }) => (
              <NavigationMenuItem key={href}>
                <Link href={href} legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    {label}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="hidden md:flex items-center gap-3">
          <ThemeToggler />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const newLocale = locale === "en" ? "fa" : "en";
              router.replace(`/${newLocale}${pathname}`);
            }}
          >
            {locale === "en" ? "فارسی" : "English"}
          </Button>
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

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                {NAV_LINKS.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className="text-lg font-medium"
                  >
                    {label}
                  </Link>
                ))}
                <div className="flex flex-col gap-4 pt-4 border-t">
                  {session ? (
                    <>
                      <Link href="/dashboard">
                        <Button variant="ghost" className="w-full">
                          Dashboard
                        </Button>
                      </Link>
                      <Button
                        onClick={handleSignOut}
                        variant="destructive"
                        className="w-full"
                      >
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href="/login">
                        <Button variant="ghost" className="w-full">
                          ورود
                        </Button>
                      </Link>
                      <Link href="/signup">
                        <Button className="w-full">ساخت ویترین</Button>
                      </Link>
                    </>
                  )}
                  <div className="flex justify-between items-center">
                    <ThemeToggler />
                    <Button
                      variant="ghost"
                      onClick={() => {
                        const newLocale = locale === "en" ? "fa" : "en";
                        router.replace(`/${newLocale}${pathname}`);
                      }}
                    >
                      {locale === "en" ? "فارسی" : "English"}
                    </Button>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
    </motion.div>
  );
}
