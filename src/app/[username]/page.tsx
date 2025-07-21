"use client";

import React, { use, useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { Button } from "@heroui/react";
import { Instagram, MessageCircleMore, Globe } from "lucide-react";

interface Props {
  params: Promise<{ username: string }>;
}

interface UserProfileData {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string | null;
  title: string | null;
  description: string | null;
  cover_image_url: string | null;
  job_category: string | null;
  custom_link: string | null;
  instagram: string | null;
  whatsapp: string | null;
  website: string | null;
}

export default function UserProfile({ params }: Props) {
  const { username } = use(params);

  const [userData, setUserData] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // واکشی داده‌ها از Supabase
  const fetchUser = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // گرفتن داده کاربر
      const { data: user, error: userError } = await supabase
        .from("users")
        .select("id, username, full_name, avatar_url")
        .eq("username", username)
        .single();

      if (userError || !user) {
        setError("کاربر یافت نشد.");
        setUserData(null);
        setLoading(false);
        return;
      }

      // گرفتن ویترین کاربر (در صورت وجود)
      const { data: showcase, error: showcaseError } = await supabase
        .from("showcases")
        .select(
          "title, description, cover_image_url, job_category, custom_link, instagram, whatsapp, website"
        )
        .eq("user_id", user.id)
        .single();

      if (showcaseError && showcaseError.code !== "PGRST116") {
        // PGRST116 یعنی رکورد وجود ندارد، خطای واقعی نیست
        console.warn("خطا در دریافت ویترین:", showcaseError.message);
      }

      setUserData({
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        avatar_url: user.avatar_url,
        title: showcase?.title ?? null,
        description: showcase?.description ?? null,
        cover_image_url: showcase?.cover_image_url ?? null,
        job_category: showcase?.job_category ?? null,
        custom_link: showcase?.custom_link ?? null,
        instagram: showcase?.instagram ?? null,
        whatsapp: showcase?.whatsapp ?? null,
        website: showcase?.website ?? null,
      });
    } catch (e) {
      console.error("خطای غیرمنتظره در دریافت کاربر:", e);
      setError("خطایی در بارگذاری اطلاعات رخ داده است.");
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  if (loading)
    return (
      <p className="text-center mt-20 text-gray-500">در حال بارگذاری...</p>
    );

  if (error)
    return (
      <p className="text-center mt-20 text-red-600 font-semibold">{error}</p>
    );

  if (!userData)
    return (
      <p className="text-center mt-20 text-red-600 font-semibold">
        اطلاعاتی برای نمایش وجود ندارد.
      </p>
    );

  // کامپوننت لینک تماس
  const ContactButton = ({
    href,
    icon: Icon,
    label,
  }: {
    href: string;
    icon: React.ElementType;
    label: string;
  }) => (
    <Button as="a" href={href} target="_blank" variant="bordered">
      <Icon className="w-4 h-4 ml-2" /> {label}
    </Button>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* کاور */}
      <div className="relative h-48 w-full bg-primary">
        {userData.cover_image_url ? (
          <Image
            src={userData.cover_image_url}
            alt="Cover"
            fill
            className="rounded-b-3xl object-cover opacity-70"
            priority
          />
        ) : (
          <div className="bg-gray-400 rounded-b-3xl h-full" />
        )}
      </div>

      {/* آواتار و نام */}
      <div className="flex flex-col items-center -mt-12">
        {userData.avatar_url ? (
          <Image
            src={userData.avatar_url}
            alt={`${userData.full_name} avatar`}
            width={96}
            height={96}
            className="rounded-full border-4 border-background"
            priority
          />
        ) : (
          <div className="w-24 h-24 bg-gray-300 rounded-full border-4 border-background" />
        )}
        <h1 className="text-xl font-bold mt-2">@{userData.username}</h1>
        <p className="text-muted-foreground">
          {userData.job_category || userData.title || "بدون دسته‌بندی"}
        </p>
      </div>

      {/* لینک‌های تماس */}
      <div className="flex justify-center gap-4 my-4">
        {userData.whatsapp && (
          <ContactButton
            href={`https://wa.me/${userData.whatsapp}`}
            icon={MessageCircleMore}
            label="واتساپ"
          />
        )}
        {userData.instagram && (
          <ContactButton
            href={`https://instagram.com/${userData.instagram}`}
            icon={Instagram}
            label="اینستاگرام"
          />
        )}
        {userData.website && (
          <ContactButton href={userData.website} icon={Globe} label="وب‌سایت" />
        )}
      </div>

      {/* درباره من */}
      <div className="max-w-2xl mx-auto px-4 text-center my-4">
        <p className="text-sm text-muted-foreground">
          {userData.description || "کاربر توضیحی ارائه نکرده است."}
        </p>
      </div>
    </div>
  );
}
