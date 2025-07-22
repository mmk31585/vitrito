"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Upload } from "lucide-react";
import toast from "react-hot-toast";

interface SocialLink {
  platform: string;
  url: string;
}

interface ProfileFormData {
  full_name: string;
  username: string;
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
    username: "",
    avatar_url: null,
    cover_image_url: null,
    job_category: "",
    description: "",
    social_links: [],
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  useEffect(() => {
    protectRoute();

    if (session) {
      async function fetchUser() {
        setLoading(true);
        const { data: user, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (error) {
          toast.error("Failed to load profile data.");
          setLoading(false);
          return;
        }

        if (user) {
          const socialLinks = user.social_links
            ? Object.entries(user.social_links).map(([platform, url]) => ({
                platform: platform as string,
                url: url as string,
              }))
            : [];
          setFormData({
            full_name: user.full_name ?? "",
            username: user.username ?? "",
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

  async function uploadImage(
    file: File,
    folder: "avatars" | "covers"
  ): Promise<string | null> {
    if (!session) return null;
    try {
      setUploading(true);
      const fileExt = file.name.split(".").pop();
      const fileName = `${session.user.id}-${Date.now()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      const { error } = await supabase.storage
        .from(folder)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (error) throw error;

      const { data } = supabase.storage.from(folder).getPublicUrl(filePath);
      return data.publicUrl;
    } catch {
      toast.error("Image upload failed.");
      return null;
    } finally {
      setUploading(false);
    }
  }

  async function handleImageChange(
    e: React.ChangeEvent<HTMLInputElement>,
    type: "avatar" | "cover"
  ) {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    const previewSetter = type === "avatar" ? setAvatarPreview : setCoverPreview;
    previewSetter(URL.createObjectURL(file));

    const url = await uploadImage(file, type === "avatar" ? "avatars" : "covers");
    if (url) {
      setFormData((prev) => ({
        ...prev,
        [type === "avatar" ? "avatar_url" : "cover_image_url"]: url,
      }));
    }
  }

  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!session) return;
    setLoading(true);

    const socialLinksObject = formData.social_links.reduce(
      (obj, item) => ({ ...obj, [item.platform]: item.url }),
      {}
    );

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: formData.full_name,
        username: formData.username,
        avatar_url: formData.avatar_url,
        cover_image_url: formData.cover_image_url,
        job_category: formData.job_category,
        description: formData.description,
        social_links: socialLinksObject,
      })
      .eq("id", session.user.id);

    if (error) {
      toast.error("Failed to save profile.");
    } else {
      toast.success("Profile saved successfully!");
    }
    setLoading(false);
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6">Edit Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Display Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <Image
                  src={
                    avatarPreview ||
                    formData.avatar_url ||
                    "/default-avatar.png"
                  }
                  alt="Avatar"
                  width={100}
                  height={100}
                  className="rounded-full border object-cover"
                />
                <Label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90"
                >
                  <Upload className="h-4 w-4" />
                </Label>
                <Input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageChange(e, "avatar")}
                  disabled={uploading}
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="cover-upload">Cover Image</Label>
                <div className="mt-2 border rounded-lg aspect-video relative">
                  <Image
                    src={
                      coverPreview ||
                      formData.cover_image_url ||
                      "/default-cover.png"
                    }
                    alt="Cover"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                  <Label
                    htmlFor="cover-upload"
                    className="absolute inset-0 bg-black/30 flex items-center justify-center text-white opacity-0 hover:opacity-100 cursor-pointer transition-opacity"
                  >
                    <Upload className="h-6 w-6" />
                  </Label>
                  <Input
                    id="cover-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageChange(e, "cover")}
                    disabled={uploading}
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="job_category">Job Category</Label>
              <Input
                id="job_category"
                name="job_category"
                value={formData.job_category}
                onChange={handleInputChange}
                placeholder="e.g., Graphic Designer, Developer"
              />
            </div>
            <div>
              <Label htmlFor="description">About Me</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Tell us a little about yourself..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Social Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.social_links.map((link, index) => (
              <div key={index} className="flex items-center gap-2">
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
          </CardContent>
        </Card>

        <Button
          type="submit"
          className="w-full"
          disabled={loading || uploading}
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </form>
    </div>
  );
}
