"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User, ShoppingBag } from "lucide-react";

const NAV_LINKS = [
  { href: "/dashboard", label: "Overview", icon: Home },
  { href: "/dashboard/profile", label: "Edit Profile", icon: User },
  { href: "/dashboard/products", label: "Products", icon: ShoppingBag },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-100 dark:bg-gray-800 p-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <nav className="mt-8">
          <ul>
            {NAV_LINKS.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === href
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
