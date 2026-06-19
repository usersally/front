"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import TeacherSidebar from "@/components/teacher/sidebar";
import { api, getUser, logout } from "@/lib/api";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [approved, setApproved] = useState(false);

  useEffect(() => {
    async function checkAccess() {
      const user = getUser();
      if (!user) {
        router.replace("/auth/login");
        return;
      }

      if (user.role !== "teacher") {
        router.replace("/");
        return;
      }

      try {
        const { data: res } = await api.get<{
          success: boolean;
          data: { cvStatus?: string };
        }>("/auth/check");

        const cvStatus = res.data?.cvStatus ?? "pending";

        if (cvStatus === "rejected") {
          logout();
          router.replace("/auth/login?rejected=1");
          return;
        }

        if (cvStatus !== "approved") {
          if (pathname !== "/teacher/pending") {
            router.replace("/teacher/pending");
            return;
          }
          setApproved(false);
          setReady(true);
          return;
        }

        setApproved(true);
        if (pathname === "/teacher/pending") {
          router.replace("/teacher/dashboard");
          return;
        }
        setReady(true);
      } catch {
        router.replace("/auth/login");
      }
    }

    checkAccess();
  }, [router, pathname]);

  if (!ready) return null;

  if (!approved) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-[#EBF3F8]">
      <TeacherSidebar />
      <main className="ml-64 flex-1 min-h-screen">{children}</main>
    </div>
  );
}
