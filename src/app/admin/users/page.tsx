"use client";

import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

type Profile = {
  id: string;
  username: string;
  full_name: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, full_name");

      if (error) {
        setError(error.message);
      } else {
        setUsers(data);
      }
      setLoading(false);
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1 className="text-4xl font-bold">Users</h1>
      <table className="mt-8 w-full">
        <thead>
          <tr>
            <th className="text-left">ID</th>
            <th className="text-left">Username</th>
            <th className="text-left">Full Name</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.full_name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
