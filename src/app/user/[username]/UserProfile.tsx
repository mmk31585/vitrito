"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Share2 } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import { Carousel } from "@/components/Carousel";

type Profile = {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  cover_image_url: string;
  professional_title?: string;
  contact_email?: string;
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
  is_active: boolean;
  is_digital?: boolean;
  digital_file_url?: string;
  showcase_item_images: { image_url: string }[];
};

export default function UserProfile({ username }: { username: string }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [showcaseItems, setShowcaseItems] = useState<ShowcaseItem[]>([]);
  const [filteredShowcaseItems, setFilteredShowcaseItems] = useState<
    ShowcaseItem[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTitle, setSearchTitle] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", username)
        .single();

      if (profileError) {
        setError(profileError.message);
        setLoading(false);
        return;
      }

      setProfile(profileData);

      await supabase.from("analytics").insert({
        profile_id: profileData.id,
        event_type: "profile_view",
      });

      const { data: showcaseData, error: showcaseError } = await supabase
        .from("showcase_items")
        .select("*, showcase_item_images(image_url)")
        .eq("profile_id", profileData.id)
        .eq("is_active", true);

      if (showcaseError) {
        setError(showcaseError.message);
      } else {
        setShowcaseItems(showcaseData);
        setFilteredShowcaseItems(showcaseData);
      }

      setLoading(false);
    };

    fetchData();
  }, [username]);

  useEffect(() => {
    let items = showcaseItems;

    if (searchTitle) {
      items = items.filter((item) =>
        item.title.toLowerCase().includes(searchTitle.toLowerCase())
      );
    }

    if (filterCategory) {
      items = items.filter(
        (item) => item.category.toLowerCase() === filterCategory.toLowerCase()
      );
    }

    if (minPrice !== undefined) {
      items = items.filter((item) => (item.price || 0) >= minPrice);
    }

    if (maxPrice !== undefined) {
      items = items.filter((item) => (item.price || 0) <= maxPrice);
    }

    setFilteredShowcaseItems(items);
  }, [searchTitle, filterCategory, minPrice, maxPrice, showcaseItems]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!profile) return <div>User not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative h-64 w-full rounded-lg bg-gray-200">
        {profile.cover_image_url && (
          <img
            src={profile.cover_image_url}
            alt="Cover"
            className="h-full w-full object-cover rounded-lg"
          />
        )}
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
          <img
            src={profile.avatar_url}
            alt="Avatar"
            className="h-32 w-32 rounded-full border-4 border-white"
          />
        </div>
      </div>

      <div className="mt-20 text-center">
        <h1 className="text-4xl font-bold">{profile.full_name}</h1>
        <p className="text-lg text-gray-600">@{profile.username}</p>
        {profile.professional_title && (
          <p className="text-xl font-semibold mt-2">
            {profile.professional_title}
          </p>
        )}
        <p className="mt-4 max-w-2xl mx-auto">{profile.bio}</p>
      </div>

      <div className="mt-8 flex justify-center space-x-4">
        <Link href={`/chat?receiver_id=${profile.id}`}>
          <Button>Message</Button>
        </Link>
        {profile.social_links.instagram && (
          <a
            href={`https://instagram.com/${profile.social_links.instagram}`}
            target="_blank"
            rel="noreferrer"
          >
            Instagram
          </a>
        )}
        {profile.social_links.linkedin && (
          <a
            href={`https://linkedin.com/in/${profile.social_links.linkedin}`}
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
        )}
        {profile.social_links.telegram && (
          <a
            href={`https://t.me/${profile.social_links.telegram}`}
            target="_blank"
            rel="noreferrer"
          >
            Telegram
          </a>
        )}
      </div>

      <section className="mt-8">
        <h2 className="text-2xl font-bold text-center">Showcase</h2>
        <div className="mt-4 flex flex-wrap gap-4 justify-center">
          <Input
            type="text"
            placeholder="Search by title..."
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Filter by category..."
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Min price"
            value={minPrice ?? ""}
            onChange={(e) => setMinPrice(Number(e.target.value))}
          />
          <Input
            type="number"
            placeholder="Max price"
            value={maxPrice ?? ""}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredShowcaseItems.map((item) => (
            <div key={item.id} className="border p-4 rounded-lg">
              <Carousel images={item.showcase_item_images} />
              <h3 className="text-lg font-bold mt-2">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.category}</p>
              <p className="mt-2">{item.description}</p>
              <div className="flex justify-between items-center mt-4">
                {item.price && <p className="font-bold">${item.price}</p>}
                <div className="flex items-center gap-2">
                  {item.is_digital && item.digital_file_url && (
                    <a href={item.digital_file_url} download>
                      <Button>Download</Button>
                    </a>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${window.location.origin}/${username}/${item.id}`
                      );
                      toast.success("Link copied to clipboard!");
                    }}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-bold text-center">Contact Me</h2>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const name = formData.get("name") as string;
            const email = formData.get("email") as string;
            const message = formData.get("message") as string;

            if (!profile) return;

            const { error } = await supabase.functions.invoke("send-email", {
              body: {
                name,
                email,
                message,
                profileEmail: profile.contact_email,
              },
            });

            if (error) {
              toast.error("Failed to send message.");
              console.error(error);
            } else {
              toast.success("Message sent successfully!");
            }
          }}
          className="mt-4 max-w-xl mx-auto space-y-4"
        >
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" type="text" required />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" name="message" required />
          </div>
          <Button type="submit">Send Message</Button>
        </form>
      </section>
    </div>
  );
}
