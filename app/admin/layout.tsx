"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import AdminNavbar from "@/components/admin/navbar";
import AdminSidebar from "@/components/admin/sidebar";
import { getToken, getUser } from "@/lib/api";

function useAdminAuthGuard() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = getToken();
    const user = getUser();

    if (!token || !user) {
      router.push("/auth/login");
      return;
    }

    if (user.role !== "admin") {
      router.push("/");
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAuthorized(true);
    setChecking(false);
  }, [router]);

  return { checking, authorized };
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { checking, authorized } = useAdminAuthGuard();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Apply persisted theme as early as possible to avoid a flash of the wrong theme
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const isDark = stored === "dark" || (!stored && prefersDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  if (checking) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#EBF3F8] dark:bg-[#0F1B22]">
        <div className="flex flex-col items-center gap-3">
          <Icon
            icon="mdi:loading"
            width="32"
            className="animate-spin text-[#2F556B] dark:text-[#7ABFA8]"
          />
          <p className="text-sm text-[#547C90] dark:text-[#8AAFC0]">
            Loading admin panel...
          </p>
        </div>
      </div>
    );
  }

  if (!authorized) return null;

  return (
    <div className="flex h-screen bg-[#F5F7FA] dark:bg-[#0F1B22] overflow-hidden">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex flex-col flex-1 min-w-0">
        <AdminNavbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
