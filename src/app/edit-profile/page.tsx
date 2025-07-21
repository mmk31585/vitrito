"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { Button, Input, Textarea } from "@heroui/react";

interface ProfileFormData {
  full_name: string;
  avatar_url: string | null;
  cover_image_url: string | null;
  job_category: string;
  description: string;
  instagram: string;
  whatsapp: string;
  website: string;
}

export default function EditProfile({ userId }: { userId: string }) {
  const [formData, setFormData] = useState<ProfileFormData>({
    full_name: "",
    avatar_url: null,
    cover_image_url: null,
    job_category: "",
    description: "",
    instagram: "",
    whatsapp: "",
    website: "",
  });

  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [message, setMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  useEffect(() => {
    // بارگذاری اطلاعات اولیه کاربر
    async function fetchUser() {
      setLoading(true);
      const { data: user, error } = await supabase
        .from("users")
        .select(
          "full_name, avatar_url, cover_image_url, job_category, description, instagram, whatsapp, website"
        )
        .eq("id", userId)
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
        setFormData({
          full_name: user.full_name ?? "",
          avatar_url: user.avatar_url,
          cover_image_url: user.cover_image_url,
          job_category: user.job_category ?? "",
          description: user.description ?? "",
          instagram: user.instagram ?? "",
          whatsapp: user.whatsapp ?? "",
          website: user.website ?? "",
        });
      }
      setLoading(false);
    }
    fetchUser();
  }, [userId]);

  // آپلود فایل به Supabase Storage
  async function uploadImage(file: File, folder: string) {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (error) throw error;

      const publicUrl = supabase.storage.from("avatars").getPublicUrl(filePath)
        .data.publicUrl;
      return publicUrl;
    } catch (error) {
      setMessage({ type: "error", text: "خطا در آپلود تصویر" });
      return null;
    }
  }

  // هندل آپلود آواتار
  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.length) return;
    setUploadingAvatar(true);
    const url = await uploadImage(e.target.files[0], "avatars");
    if (url) setFormData((prev) => ({ ...prev, avatar_url: url }));
    setUploadingAvatar(false);
  }

  // هندل آپلود کاور
  async function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.length) return;
    setUploadingCover(true);
    const url = await uploadImage(e.target.files[0], "covers");
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
    setLoading(true);
    setMessage(null);

    const { error } = await supabase
      .from("users")
      .update({
        full_name: formData.full_name,
        avatar_url: formData.avatar_url,
        cover_image_url: formData.cover_image_url,
        job_category: formData.job_category,
        description: formData.description,
        instagram: formData.instagram,
        whatsapp: formData.whatsapp,
        website: formData.website,
      })
      .eq("id", userId);

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
            {formData.avatar_url ? (
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
            {formData.cover_image_url ? (
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
        <Input
          label="نام کامل"
          name="full_name"
          value={formData.full_name}
          onChange={handleInputChange}
          required
          placeholder="نام و نام خانوادگی"
        />

        {/* دسته‌بندی شغلی */}
        <Input
          label="دسته‌بندی شغلی"
          name="job_category"
          value={formData.job_category}
          onChange={handleInputChange}
          placeholder="مثلاً: طراح گرافیک، برنامه‌نویس"
        />

        {/* توضیحات */}
        <Textarea
          label="درباره من"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="کمی درباره خودتان بنویسید..."
          rows={4}
        />

        {/* اینستاگرام */}
        <Input
          label="اینستاگرام"
          name="instagram"
          value={formData.instagram}
          onChange={handleInputChange}
          placeholder="نام کاربری اینستاگرام"
        />

        {/* واتساپ */}
        <Input
          label="واتساپ"
          name="whatsapp"
          value={formData.whatsapp}
          onChange={handleInputChange}
          placeholder="شماره واتساپ با کد کشور (مثلاً 98912...)"
        />

        {/* وب‌سایت */}
        <Input
          label="وب‌سایت"
          name="website"
          value={formData.website}
          onChange={handleInputChange}
          placeholder="آدرس وب‌سایت (https://...)"
          type="url"
        />

        <Button type="submit" className="w-full" disabled={loading}>
          ذخیره تغییرات
        </Button>
      </form>
    </div>
  );
}
