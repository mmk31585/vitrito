"use client";

import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useEffect } from "react";

export default function AdminPage() {
  const { isAdmin, protectRoute } = useAdminAuth();

  useEffect(() => {
    protectRoute();
  }, [isAdmin, protectRoute]);

  if (!isAdmin) {
    return <div>You are not authorized to view this page.</div>;
  }

  return (
    <div>
      <h1 className="text-4xl font-bold">Admin Dashboard</h1>
      <p className="mt-4">Welcome to the admin dashboard.</p>
    </div>
  );
}
