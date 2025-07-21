import { supabase } from "@/lib/supabase";
import { Metadata } from "next";
import UserProfileClient from "@/components/UserProfileClient";

type Props = {
  params: { username: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, bio")
    .eq("username", params.username)
    .single();

  return {
    title: `${profile?.full_name} | Vitrito`,
    description: profile?.bio || "ساخت ویترین دیجیتال با ویتریتو",
  };
}

export default function UserPage({ params }: Props) {
  return <UserProfileClient username={params.username} />;
}
