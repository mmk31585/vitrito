"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

interface Profile {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  job_category: string;
  bio: string;
}

export default function ExplorePage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("profiles").select("*");

      if (error) {
        setError(error.message);
      } else {
        setProfiles(data);
        setFilteredProfiles(data);
      }
      setLoading(false);
    };
    fetchProfiles();
  }, []);

  useEffect(() => {
    let filtered = profiles;

    if (searchTerm) {
      filtered = filtered.filter(
        (profile) =>
          profile.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          profile.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (category) {
      filtered = filtered.filter(
        (profile) =>
          profile.job_category &&
          profile.job_category.toLowerCase() === category.toLowerCase()
      );
    }

    setFilteredProfiles(filtered);
  }, [searchTerm, category, profiles]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold">Explore</h1>
      <div className="mt-8 flex gap-4">
        <Input
          placeholder="Search by name or username"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Input
          placeholder="Filter by category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProfiles.map((profile) => (
          <Link key={profile.id} href={`/user/${profile.username}`}>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Image
                  src={profile.avatar_url}
                  alt={profile.full_name}
                  width={100}
                  height={100}
                  className="rounded-full mx-auto"
                />
              </CardHeader>
              <CardContent className="text-center">
                <CardTitle>{profile.full_name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  @{profile.username}
                </p>
                <p className="mt-2 text-sm font-semibold text-primary">
                  {profile.job_category}
                </p>
                <p className="mt-2 text-sm">{profile.bio}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
