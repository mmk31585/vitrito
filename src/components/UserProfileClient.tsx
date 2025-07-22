"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Image from "next/image";

type Profile = {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  cover_image_url: string;
  bio: string;
  contact_email: string;
  social_links: {
    instagram: string;
    linkedin: string;
    telegram: string;
  };
};

type ShowcaseItem = {
  id: string;
  profile_id: string;
  title: string;
  description: string;
  category: string;
  price?: number;
  image_url: string;
  is_active: boolean;
};

export default function UserProfileClient({ username }: { username: string }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [showcaseItems, setShowcaseItems] = useState<ShowcaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", username)
        .single();

      if (profileError || !profileData) {
        setError(profileError?.message || "User not found");
        setLoading(false);
        return;
      }

      setProfile(profileData);

      const { data: showcaseData, error: showcaseError } = await supabase
        .from("showcase_items")
        .select("*")
        .eq("profile_id", profileData.id)
        .eq("is_active", true);

      if (showcaseError) {
        setError(showcaseError.message);
      } else {
        setShowcaseItems(showcaseData);
      }

      setLoading(false);
    };

    fetchData();
  }, [username]);

  if (loading) return <div>در حال بارگذاری...</div>;
  if (error) return <div>خطا: {error}</div>;
  if (!profile) return <div>پروفایل یافت نشد</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative h-64 w-full rounded-lg bg-gray-200">
        {profile.cover_image_url && (
          <Image
            src={profile.cover_image_url}
            alt="Cover"
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
        )}
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
          <Image
            src={profile.avatar_url}
            alt="Avatar"
            width={128}
            height={128}
            className="rounded-full border-4 border-white"
          />
        </div>
      </div>

      <div className="mt-20 text-center">
        <h1 className="text-4xl font-bold">{profile.full_name}</h1>
        <p className="text-lg text-gray-600">@{profile.username}</p>
        <p className="mt-4 max-w-2xl mx-auto">{profile.bio}</p>
      </div>

      <div className="mt-8 flex justify-center gap-6">
        {profile.social_links.instagram && (
          <a
            href={`https://instagram.com/${profile.social_links.instagram}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>
        )}
        {profile.social_links.linkedin && (
          <a
            href={`https://linkedin.com/in/${profile.social_links.linkedin}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
        )}
        {profile.social_links.telegram && (
          <a
            href={`https://t.me/${profile.social_links.telegram}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Telegram
          </a>
        )}
      </div>

      <section className="mt-8">
        <h2 className="text-2xl font-bold text-center">ویترین</h2>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {showcaseItems.map((item) => (
            <div key={item.id} className="border p-4 rounded-lg">
              <Image
                src={item.image_url}
                alt={item.title}
                width={500}
                height={300}
                className="h-48 w-full object-cover rounded-lg"
              />
              <h3 className="text-lg font-bold mt-2">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.category}</p>
              <p className="mt-2">{item.description}</p>
              {item.price && <p className="mt-2 font-bold">${item.price}</p>}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-bold text-center">تماس با من</h2>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const name = formData.get("name") as string;
            const email = formData.get("email") as string;
            const message = formData.get("message") as string;

            if (!profile?.contact_email) return;

            const { data, error } = await supabase.functions.invoke(
              "send-email",
              {
                body: {
                  name,
                  email,
                  message,
                  profileEmail: profile.contact_email,
                },
              }
            );

            if (error) {
              console.error(error);
            } else {
              console.log(data);
            }
          }}
          className="mt-4 max-w-xl mx-auto space-y-4"
        >
          <div>
            <Label htmlFor="name">نام</Label>
            <Input id="name" name="name" type="text" required />
          </div>
          <div>
            <Label htmlFor="email">ایمیل</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div>
            <Label htmlFor="message">پیام</Label>
            <Textarea id="message" name="message" required />
          </div>
          <Button type="submit">ارسال پیام</Button>
        </form>
      </section>
    </div>
  );
}
