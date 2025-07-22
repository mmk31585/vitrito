"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";

interface SocialLink {
  platform: string;
  url: string;
}

interface ProfileFormData {
  full_name: string;
  avatar_url: string | null;
  cover_image_url: string | null;
  job_category: string;
  description: string;
  social_links: SocialLink[];
}

export default function EditProfile() {
  const { session, loading: authLoading, protectRoute } = useAuth();
  const [formData, setFormData] = useState<ProfileFormData>({
    full_name: "",
    avatar_url: null,
    cover_image_url: null,
    job_category: "",
    description: "",
    social_links: [],
  });

  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  useEffect(() => {
    protectRoute();

    if (session) {
      // بارگذاری اطلاعات اولیه کاربر
      async function fetchUser() {
        setLoading(true);
        const { data: user, error } = await supabase
          .from("profiles")
          .select(
            "full_name, avatar_url, cover_image_url, job_category, description, instagram, whatsapp, website"
          )
          .eq("id", session.user.id)
          .single();

        if (error) {
          setMessage({
            type: "error",
            text: "بارگذاری اطلاعات با خطا مواجه شد.",
          });
          setLoading(false);
          return;
        }

        if (user) {
          const socialLinks = user.social_links
            ? Object.entries(user.social_links).map(([platform, url]) => ({
                platform,
                url,
              }))
            : [];
          setFormData({
            full_name: user.full_name ?? "",
            avatar_url: user.avatar_url,
            cover_image_url: user.cover_image_url,
            job_category: user.job_category ?? "",
            description: user.description ?? "",
            social_links: socialLinks,
          });
        }
        setLoading(false);
      }
      fetchUser();
    }
  }, [session, authLoading, protectRoute]);

  // آپلود فایل به Supabase Storage
  async function uploadImage(file: File, folder: string) {
    if (!session) return null;
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${session.user.id}-${Date.now()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      const { error } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (error) throw error;

      const publicUrl = supabase.storage.from("avatars").getPublicUrl(filePath)
        .data.publicUrl;
      return publicUrl;
    } catch {
      setMessage({ type: "error", text: "خطا در آپلود تصویر" });
      return null;
    }
  }

  // هندل آپلود آواتار
  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    setAvatarPreview(URL.createObjectURL(file));
    setUploadingAvatar(true);
    const url = await uploadImage(file, "avatars");
    if (url) setFormData((prev) => ({ ...prev, avatar_url: url }));
    setUploadingAvatar(false);
  }

  // هندل آپلود کاور
  async function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    setCoverPreview(URL.createObjectURL(file));
    setUploadingCover(true);
    const url = await uploadImage(file, "covers");
    if (url) setFormData((prev) => ({ ...prev, cover_image_url: url }));
    setUploadingCover(false);
  }

  // هندل تغییر ورودی‌ها
  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  // ذخیره‌سازی فرم در Supabase
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!session) return;
    setLoading(true);
    setMessage(null);

    const socialLinksObject = formData.social_links.reduce(
      (obj, item) => ({ ...obj, [item.platform]: item.url }),
      {}
    );

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: formData.full_name,
        avatar_url: formData.avatar_url,
        cover_image_url: formData.cover_image_url,
        job_category: formData.job_category,
        description: formData.description,
        social_links: socialLinksObject,
      })
      .eq("id", session.user.id);

    if (error) {
      setMessage({ type: "error", text: "خطا در ذخیره اطلاعات" });
    } else {
      setMessage({ type: "success", text: "اطلاعات با موفقیت ذخیره شد!" });
    }
    setLoading(false);
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">ویرایش پروفایل</h2>

      {message && (
        <p
          className={`mb-4 text-center ${
            message.type === "success" ? "text-green-600" : "text-red-600"
          }`}
        >
          {message.text}
        </p>
      )}

      {loading && (
        <p className="text-center mb-4 text-gray-500">در حال بارگذاری...</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* آواتار */}
        <label className="block">
          <span className="block mb-2 font-semibold">آواتار</span>
          <div className="flex items-center gap-4">
            {avatarPreview ? (
              <Image
                src={avatarPreview}
                alt="Avatar Preview"
                width={80}
                height={80}
                className="rounded-full border"
              />
            ) : formData.avatar_url ? (
              <Image
                src={formData.avatar_url}
                alt="Avatar Preview"
                width={80}
                height={80}
                className="rounded-full border"
              />
            ) : (
              <div className="w-20 h-20 bg-gray-300 rounded-full border" />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              disabled={uploadingAvatar}
            />
            {uploadingAvatar && <span>در حال آپلود...</span>}
          </div>
        </label>

        {/* کاور */}
        <label className="block">
          <span className="block mb-2 font-semibold">کاور</span>
          <div className="flex items-center gap-4">
            {coverPreview ? (
              <Image
                src={coverPreview}
                alt="Cover Preview"
                width={120}
                height={60}
                className="rounded-md border object-cover"
              />
            ) : formData.cover_image_url ? (
              <Image
                src={formData.cover_image_url}
                alt="Cover Preview"
                width={120}
                height={60}
                className="rounded-md border object-cover"
              />
            ) : (
              <div className="w-32 h-16 bg-gray-300 rounded-md border" />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverChange}
              disabled={uploadingCover}
            />
            {uploadingCover && <span>در حال آپلود...</span>}
          </div>
        </label>

        {/* نام کامل */}
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="full_name">نام کامل</Label>
          <Input
            id="full_name"
            name="full_name"
            value={formData.full_name}
            onChange={handleInputChange}
            required
            placeholder="نام و نام خانوادگی"
          />
        </div>

        {/* دسته‌بندی شغلی */}
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="job_category">دسته‌بندی شغلی</Label>
          <Input
            id="job_category"
            name="job_category"
            value={formData.job_category}
            onChange={handleInputChange}
            placeholder="مثلاً: طراح گرافیک، برنامه‌نویس"
          />
        </div>

        {/* توضیحات */}
        <div className="grid w-full gap-1.5">
          <Label htmlFor="description">درباره من</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="کمی درباره خودتان بنویسید..."
            rows={4}
          />
        </div>

        {/* Social Links */}
        <div>
          <Label>Social Links</Label>
          {formData.social_links.map((link, index) => (
            <div key={index} className="flex items-center gap-2 mt-2">
              <Input
                value={link.platform}
                onChange={(e) => {
                  const newLinks = [...formData.social_links];
                  newLinks[index].platform = e.target.value;
                  setFormData({ ...formData, social_links: newLinks });
                }}
                placeholder="Platform (e.g., Instagram)"
              />
              <Input
                value={link.url}
                onChange={(e) => {
                  const newLinks = [...formData.social_links];
                  newLinks[index].url = e.target.value;
                  setFormData({ ...formData, social_links: newLinks });
                }}
                placeholder="URL"
              />
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  const newLinks = formData.social_links.filter(
                    (_, i) => i !== index
                  );
                  setFormData({ ...formData, social_links: newLinks });
                }}
              >
                Remove
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() =>
              setFormData({
                ...formData,
                social_links: [
                  ...formData.social_links,
                  { platform: "", url: "" },
                ],
              })
            }
          >
            Add Social Link
          </Button>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          ذخیره تغییرات
        </Button>
      </form>
    </div>
  );
}
