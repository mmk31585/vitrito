"use client";

import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Profile {
  id: string;
  full_name: string;
  email: string;
  is_approved: boolean;
  is_banned: boolean;
}

export default function UsersPage() {
  const { isAdmin, protectRoute } = useAdminAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    protectRoute();

    if (isAdmin) {
      const fetchProfiles = async () => {
        setLoading(true);
        const { data, error } = await supabase.from("profiles").select("*");

        if (error) {
          setError(error.message);
        } else {
          setProfiles(data);
        }
        setLoading(false);
      };
      fetchProfiles();
    }
  }, [isAdmin, protectRoute]);

  const handleApprove = async (userId: string) => {
    const { error } = await supabase
      .from("profiles")
      .update({ is_approved: true })
      .eq("id", userId);

    if (error) {
      setError(error.message);
    } else {
      setProfiles(
        profiles.map((p) =>
          p.id === userId ? { ...p, is_approved: true } : p
        )
      );
    }
  };

  const handleBan = async (userId: string) => {
    const { error } = await supabase
      .from("profiles")
      .update({ is_banned: true })
      .eq("id", userId);

    if (error) {
      setError(error.message);
    } else {
      setProfiles(
        profiles.map((p) => (p.id === userId ? { ...p, is_banned: true } : p))
      );
    }
  };

  if (!isAdmin) {
    return <div>You are not authorized to view this page.</div>;
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1 className="text-4xl font-bold">User Management</h1>
      <Table className="mt-8">
        <TableHeader>
          <TableRow>
            <TableHead>Full Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {profiles.map((profile) => (
            <TableRow key={profile.id}>
              <TableCell>{profile.full_name}</TableCell>
              <TableCell>{profile.email}</TableCell>
              <TableCell>
                {profile.is_approved ? "Approved" : "Not Approved"}
                {profile.is_banned && " (Banned)"}
              </TableCell>
              <TableCell className="flex gap-2">
                {!profile.is_approved && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleApprove(profile.id)}
                  >
                    Approve
                  </Button>
                )}
                {!profile.is_banned && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleBan(profile.id)}
                  >
                    Ban
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
