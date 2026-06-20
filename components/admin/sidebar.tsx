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
  {
    label: "Reports",
    icon: "mdi:flag-outline",
    href: "/admin/reports",
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
          bg-[#1F3745] dark:bg-[#16242C] text-white
          flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <div className="px-6 py-5 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xl font-extrabold tracking-tight">
                Cour<span className="text-[#7ABFA8]">Sally</span>
              </span>
              <p className="text-[10px] text-white/40 mt-0.5 uppercase tracking-widest">
                Admin Panel
              </p>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <Icon icon="mdi:close" width="20" />
            </button>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {links.map((link) => {
            const isActive = pathname?.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl
                  text-sm font-medium transition-all duration-200
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
              </Link>
            );
          })}
        </nav>

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
    </>
  );
}
