"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import TeacherSidebar from "@/components/teacher/sidebar";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const raw = localStorage.getItem("user");

    if (!raw) {
      router.replace("/login");
      return;
    }

    try {
      const user = JSON.parse(raw);

      if (user.role !== "teacher") {
        router.replace("/");
      }
    } catch {
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="flex min-h-screen bg-[#EBF3F8]">
      <TeacherSidebar />
      <main className="ml-64 flex-1 min-h-screen">{children}</main>
    </div>
  );
}
