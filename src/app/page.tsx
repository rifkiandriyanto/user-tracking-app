'use client'
import dynamic from "next/dynamic";
const UserTrackingMap = dynamic(() => import("@/components/UserTrackingMap"), {
  ssr: false,
});

export default function Home() {
  return (
    <section className="relative">
      <UserTrackingMap />
    </section>
  );
}
