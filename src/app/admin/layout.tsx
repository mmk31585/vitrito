import { ReactNode } from "react";
import Link from "next/link";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex">
      <aside className="w-64 bg-gray-100 p-4">
        <h1 className="text-2xl font-bold">Admin</h1>
        <nav className="mt-8">
          <ul>
            <li>
              <Link href="/admin/users">Users</Link>
            </li>
            <li>
              <Link href="/admin/showcase-items">Showcase Items</Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
