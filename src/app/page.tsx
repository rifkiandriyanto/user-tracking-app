"use client";
import dynamic from "next/dynamic";
import SearchUser from "@/components/SearchUser";
const UserTrackingMap = dynamic(() => import("@/components/UserTrackingMap"), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="relative h-screen w-screen">
      <SearchUser />
      <UserTrackingMap />
    </main>
  );
}
