/* eslint-disable @next/next/no-img-element */

"use client";

import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useStudentTab, StudentTab } from "./Studenttabcontext";
import { getUser, logout, getStudentProfile, type AuthUser } from "@/lib/api";

const links: { label: string; icon: string; tab: StudentTab }[] = [
  {
    label: "Dashboard",
    icon: "mdi:view-dashboard-outline",
    tab: "dashboard",
  },
  {
    label: "Find Teachers",
    icon: "mdi:magnify",
    tab: "findTeacher",
  },
  {
    label: "Explore Courses",
    icon: "mdi:book-open-variant",
    tab: "courses",
  },
  {
    label: "My Bookings",
    icon: "mdi:calendar-outline",
    tab: "bookings",
  },
  {
    label: "Messages",
    icon: "mdi:message-outline",
    tab: "messages",
  },
  {
    label: "Profile",
    icon: "mdi:account-outline",
    tab: "profile",
  },
];

export default function StudentSidebar() {
  const router = useRouter();
  const { activeTab, setActiveTab } = useStudentTab();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    const stored = getUser();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(stored);
    setAvatar(stored?.avatar ?? null);

    getStudentProfile()
      .then((profile) => setAvatar(profile.avatar ?? null))
      .catch(() => {});

    function handleAvatarUpdate(e: Event) {
      const url = (e as CustomEvent<string>).detail;
      if (url) setAvatar(url);
    }

    window.addEventListener("student-avatar-updated", handleAvatarUpdate);
    return () =>
      window.removeEventListener("student-avatar-updated", handleAvatarUpdate);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
    : "S";

  return (
    <aside
      className="
        fixed left-0 top-0 h-screen w-64
        bg-[#1F3745] text-white
        flex flex-col
        z-30
      "
    >
      <div className="px-6 py-5 border-b border-white/10">
        <span className="text-xl font-extrabold tracking-tight">
          Cour<span className="text-[#7ABFA8]">Sally</span>
        </span>
        <p className="text-[10px] text-white/40 mt-0.5 uppercase tracking-widest">
          Student Portal
        </p>
      </div>

      <div className="px-6 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          {avatar ? (
            <img
              src={avatar}
              alt="profile"
              className="w-11 h-11 rounded-full border-2 border-[#7ABFA8] object-cover"
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-[#2F556B] border-2 border-[#7ABFA8] flex items-center justify-center text-sm font-bold text-white">
              {initials}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">
              {user ? `${user.firstName} ${user.lastName}` : "Student"}
            </p>
            <p className="text-xs text-white/40 truncate">
              {user?.email ?? ""}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const isActive = activeTab === link.tab;

          return (
            <button
              key={link.tab}
              type="button"
              onClick={() => setActiveTab(link.tab)}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                text-sm font-medium transition-all duration-200 cursor-pointer
                ${
                  isActive
                    ? "bg-[#2F556B] text-white shadow-inner"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }
              `}
            >
              <Icon icon={link.icon} width={19} />
              {link.label}
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#7ABFA8]" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-white/10">
        <button
          type="button"
          onClick={handleLogout}
          className="
            w-full flex items-center gap-3
            px-3 py-2.5 rounded-xl
            text-sm font-medium text-white/60
            hover:bg-red-500/10 hover:text-red-400
            transition-all duration-200 cursor-pointer
          "
        >
          <Icon icon="mdi:logout" width={19} />
          Logout
        </button>
      </div>
    </aside>
  );
}
