import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex">
      <aside className="w-64 bg-gray-100 p-4">
        <h1 className="text-2xl font-bold">Admin</h1>
        <nav className="mt-8">
          <ul>
            <li>
              <a href="/admin/users">Users</a>
            </li>
            <li>
              <a href="/admin/showcase-items">Showcase Items</a>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
