// no "use client"
import { supabase } from "@/lib/supabase";
import { Metadata } from "next";
type Props = {
  params: { username: string };
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, bio, avatar_url")
    .eq("username", params.username)
    .single();

  return {
    title: `${profile?.full_name ?? "User"} | Vitrito`,
    description: profile?.bio ?? "User profile on Vitrito",
    openGraph: {
      title: `${profile?.full_name ?? "User"} | Vitrito`,
      description: profile?.bio ?? "",
      images: [
        {
          url: profile?.avatar_url ?? "/default-avatar.png",
          width: 800,
          height: 600,
          alt: profile?.full_name ?? "User",
        },
      ],
    },
  };
}

import UserProfileWrapper from "@/components/UserProfileWrapper";

export default function Page({ params }: { params: { username: string } }) {
  return <UserProfileWrapper username={params.username} />;
}
