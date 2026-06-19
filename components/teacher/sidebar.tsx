"use client";

import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearToken, clearUser, getUser } from "@/lib/api";

const NAV = [
  {
    href: "/teacher/dashboard",
    icon: "mdi:view-dashboard-outline",
    label: "Dashboard",
  },
  {
    href: "/teacher/courses",
    icon: "mdi:book-open-variant",
    label: "My Courses",
  },
  {
    href: "/teacher/students",
    icon: "mdi:account-group-outline",
    label: "My Students",
  },
  {
    href: "/teacher/messages",
    icon: "mdi:message-outline",
    label: "Messages",
  },
];

export default function TeacherSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    setUser(getUser());
  }, []);

  function handleLogout() {
    clearToken();
    clearUser();
    router.push("/auth/login");
  }

  if (!mounted) {
    return null;
  }

  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
    : "T";

  return (
    <aside
      className="
        fixed left-0 top-0 h-screen w-64
        bg-[#1F3745] text-white
        flex flex-col
        z-30
      "
    >
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/10">
        <span className="text-xl font-extrabold tracking-tight">
          Cour<span className="text-[#7ABFA8]">Sally</span>
        </span>
        <p className="text-[10px] text-white/40 mt-0.5 uppercase tracking-widest">
          Teacher Portal
        </p>
      </div>

      {/* Profile */}
      <div className="px-6 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          {user?.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.avatarUrl}
              alt="avatar"
              className="w-11 h-11 rounded-full border-2 border-[#7ABFA8] object-cover"
            />
          ) : (
            <div
              className="
                w-11 h-11 rounded-full
                bg-[#2F556B]
                border-2 border-[#7ABFA8]
                flex items-center justify-center
                text-sm font-bold text-white
              "
            >
              {initials}
            </div>
          )}

          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">
              {user
                ? `${user.firstName ?? ""} ${user.lastName ?? ""}`
                : "Teacher Name"}
            </p>

            <p className="text-xs text-white/40 truncate">
              {user?.email ?? "email@mail.com"}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV.map(({ href, icon, label }) => {
          const active = pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl
                text-sm font-medium transition-all duration-200
                ${
                  active
                    ? "bg-[#2F556B] text-white shadow-inner"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }
              `}
            >
              <Icon icon={icon} width={19} />
              {label}

              {active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#7ABFA8]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-white/10">
        <button
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
