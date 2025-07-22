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
import Image from "next/image";
import { FaInstagram, FaLinkedin, FaTelegram } from "react-icons/fa";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
          <Image
            src={profile.cover_image_url}
            alt="Cover"
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
        )}
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 transform">
          <Image
            src={profile.avatar_url}
            alt="Avatar"
            width={128}
            height={128}
            className="rounded-full border-4 border-background object-cover shadow-lg"
          />
        </div>
      </div>

      <div className="mt-24 text-center">
        <h1 className="text-5xl font-bold tracking-tight">{profile.full_name}</h1>
        <p className="text-xl text-muted-foreground">@{profile.username}</p>
        {profile.professional_title && (
          <p className="text-2xl font-semibold mt-2 text-primary">
            {profile.professional_title}
          </p>
        )}
        <p className="mt-6 max-w-3xl mx-auto text-lg">{profile.bio}</p>
      </div>

      <div className="mt-8 flex justify-center items-center gap-4">
        <Link href={`/chat?receiver_id=${profile.id}`}>
          <Button size="lg">Message</Button>
        </Link>
        <div className="flex items-center gap-2">
          {profile.social_links.instagram && (
            <a
              href={`https://instagram.com/${profile.social_links.instagram}`}
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <FaInstagram className="h-8 w-8" />
            </a>
          )}
          {profile.social_links.linkedin && (
            <a
              href={`https://linkedin.com/in/${profile.social_links.linkedin}`}
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <FaLinkedin className="h-8 w-8" />
            </a>
          )}
          {profile.social_links.telegram && (
            <a
              href={`https://t.me/${profile.social_links.telegram}`}
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <FaTelegram className="h-8 w-8" />
            </a>
          )}
        </div>
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

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredShowcaseItems.length > 0 ? (
            filteredShowcaseItems.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <Carousel images={item.showcase_item_images} />
                </CardHeader>
                <CardContent>
                  <CardTitle>{item.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {item.category}
                  </p>
                  <p className="mt-2">{item.description}</p>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
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
                </CardFooter>
              </Card>
            ))
          ) : (
            <p className="text-center col-span-3 text-muted-foreground">
              This user hasn't added any products yet.
            </p>
          )}
        </div>
      </section>

      <section className="mt-12">
        <Card className="max-w-xl mx-auto">
          <CardHeader>
            <CardTitle>Get in Touch</CardTitle>
          </CardHeader>
          <CardContent>
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
              className="space-y-4"
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
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
