"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/lib/api";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const links: { label: string; icon: string; href: string }[] = [
  {
    label: "Dashboard",
    icon: "mdi:view-dashboard",
    href: "/admin/dashboard",
  },
  {
    label: "Users",
    icon: "mdi:account-multiple-outline",
    href: "/admin/users",
  },
  {
    label: "Students",
    icon: "mdi:school-outline",
    href: "/admin/students",
  },
  {
    label: "Teachers",
    icon: "mdi:account-tie-outline",
    href: "/admin/teachers",
  },
  {
    label: "Courses",
    icon: "mdi:book-open-variant",
    href: "/admin/courses",
  },
];

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  return (
    <>
      {/* Mobile overlay — closes the drawer on tap */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 h-screen lg:h-auto shrink-0
          bg-[#2F556B] dark:bg-[#16242C] text-white
          flex flex-col justify-between p-5
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* TOP */}
        <div>
          {/* BRAND */}
          <div className="flex items-center justify-between mb-10 px-1">
            <div>
              <h1 className="text-xl font-extrabold tracking-tight select-none">
                Cour<span className="text-[#7ABFA8]">S</span>ally
              </h1>
              <span className="block text-[10px] font-semibold tracking-[0.2em] text-white/50 mt-0.5">
                ADMIN PANEL
              </span>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <Icon icon="mdi:close" width="20" />
            </button>
          </div>

          {/* LINKS */}
          <nav className="space-y-2">
            {links.map((link) => {
              const isActive = pathname?.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300
                    ${isActive ? "bg-white text-[#2F556B]" : "hover:bg-[#3E6B82] text-white"}
                  `}
                >
                  <Icon icon={link.icon} width="22" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-500 transition cursor-pointer"
        >
          <Icon icon="mdi:logout" width="22" />
          Logout
        </button>
      </aside>
    </>
  );
}
