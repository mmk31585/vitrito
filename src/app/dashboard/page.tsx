"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Profile = {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  cover_image_url: string;
  bio: string;
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

export default function Dashboard() {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [showcaseItems, setShowcaseItems] = useState<ShowcaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [addingItem, setAddingItem] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      const fetchData = async () => {
        setLoading(true);
        setError(null);

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (profileError) {
          setError(profileError.message);
        } else {
          setProfile(profileData);
        }

        const { data: showcaseData, error: showcaseError } = await supabase
          .from("showcase_items")
          .select("*")
          .eq("profile_id", session.user.id);

        if (showcaseError) {
          setError(showcaseError.message);
        } else {
          setShowcaseItems(showcaseData);
        }

        setLoading(false);
      };

      fetchData();
    }
  }, [session]);

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!profile || !session) return;
    setUpdatingProfile(true);

    let avatar_url = profile.avatar_url;
    if (avatarFile) {
      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(`${session.user.id}/${avatarFile.name}`, avatarFile, {
          cacheControl: "3600",
          upsert: true,
        });
      if (error) {
        setError(error.message);
        setUpdatingProfile(false);
        return;
      }
      const { data: publicUrlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(data.path);
      avatar_url = publicUrlData.publicUrl;
    }

    let cover_image_url = profile.cover_image_url;
    if (coverFile) {
      const { data, error } = await supabase.storage
        .from("covers")
        .upload(`${session.user.id}/${coverFile.name}`, coverFile, {
          cacheControl: "3600",
          upsert: true,
        });
      if (error) {
        setError(error.message);
        setUpdatingProfile(false);
        return;
      }
      const { data: publicUrlData } = supabase.storage
        .from("covers")
        .getPublicUrl(data.path);
      cover_image_url = publicUrlData.publicUrl;
    }

    const { error } = await supabase
      .from("profiles")
      .update({ ...profile, avatar_url, cover_image_url })
      .eq("id", session.user.id);

    setUpdatingProfile(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Profile updated successfully!");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!profile) {
    return <div>Please complete your profile.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold">Dashboard</h1>
      <section className="mt-8">
        <h2 className="text-2xl font-bold">Edit Profile</h2>
        <form onSubmit={handleUpdateProfile} className="mt-4 space-y-4">
          <div>
            <Label htmlFor="avatar">Avatar</Label>
            <Input
              id="avatar"
              type="file"
              onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
            />
          </div>
          <div>
            <Label htmlFor="cover">Cover Image</Label>
            <Input
              id="cover"
              type="file"
              onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
            />
          </div>
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={profile.username}
              onChange={(e) =>
                setProfile({ ...profile, username: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              type="text"
              value={profile.full_name}
              onChange={(e) =>
                setProfile({ ...profile, full_name: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="instagram">Instagram</Label>
            <Input
              id="instagram"
              type="text"
              value={profile.social_links.instagram}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  social_links: {
                    ...profile.social_links,
                    instagram: e.target.value,
                  },
                })
              }
            />
          </div>
          <div>
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input
              id="linkedin"
              type="text"
              value={profile.social_links.linkedin}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  social_links: {
                    ...profile.social_links,
                    linkedin: e.target.value,
                  },
                })
              }
            />
          </div>
          <div>
            <Label htmlFor="telegram">Telegram</Label>
            <Input
              id="telegram"
              type="text"
              value={profile.social_links.telegram}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  social_links: {
                    ...profile.social_links,
                    telegram: e.target.value,
                  },
                })
              }
            />
          </div>
          <Button type="submit" disabled={updatingProfile}>
            {updatingProfile && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Save Changes
          </Button>
        </form>
      </section>

      <section className="mt-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Showcase Items</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Add Item</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Showcase Item</DialogTitle>
                <DialogDescription>
                  Fill in the details to add a new item to your showcase.
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!session) return;
                  setAddingItem(true);
                  const formData = new FormData(e.currentTarget);
                  const title = formData.get("title") as string;
                  const description = formData.get("description") as string;
                  const category = formData.get("category") as string;
                  const price = formData.get("price") as string;
                  const imageFile = formData.get("image") as File;

                  let image_url = "";
                  if (imageFile) {
                    const { data, error } = await supabase.storage
                      .from("showcase-images")
                      .upload(
                        `${session.user.id}/${imageFile.name}`,
                        imageFile,
                        {
                          cacheControl: "3600",
                          upsert: true,
                        }
                      );
                    if (error) {
                      setError(error.message);
                      setAddingItem(false);
                      return;
                    }
                    const { data: publicUrlData } = supabase.storage
                      .from("showcase-images")
                      .getPublicUrl(data.path);
                    image_url = publicUrlData.publicUrl;
                  }

                  const { error } = await supabase
                    .from("showcase_items")
                    .insert({
                      profile_id: session.user.id,
                      title,
                      description,
                      category,
                      price: price ? parseFloat(price) : undefined,
                      image_url,
                    });

                  setAddingItem(false);

                  if (error) {
                    toast.error(error.message);
                  } else {
                    toast.success("Showcase item added successfully!");
                    const { data: showcaseData, error: showcaseError } =
                      await supabase
                        .from("showcase_items")
                        .select("*")
                        .eq("profile_id", session.user.id);
                    if (showcaseError) {
                      setError(showcaseError.message);
                    } else {
                      setShowcaseItems(showcaseData);
                    }
                  }
                }}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" name="title" type="text" required />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input id="category" name="category" type="text" />
                </div>
                <div>
                  <Label htmlFor="price">Price</Label>
                  <Input id="price" name="price" type="number" step="0.01" />
                </div>
                <div>
                  <Label htmlFor="image">Image</Label>
                  <Input id="image" name="image" type="file" />
                </div>
                <Button type="submit" disabled={addingItem}>
                  {addingItem && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Add Item
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {showcaseItems.map((item) => (
            <div key={item.id} className="border p-4 rounded-lg">
              <h3 className="text-lg font-bold">{item.title}</h3>
              <p>{item.description}</p>
              <p>{item.price}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
