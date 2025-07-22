"use client";

import dynamic from "next/dynamic";

// فقط در کلاینت رندر بشه
const UserProfile = dynamic(
  () => import("../app/user/[username]/UserProfile"),
  {
    ssr: false,
  }
);

export default function UserProfileWrapper({ username }: { username: string }) {
  return <UserProfile username={username} />;
}
