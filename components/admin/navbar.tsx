"use client";

/**

 *  ADMIN NAVBAR


 */

import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AuthUser, getUser, logout } from "@/lib/api";

interface AdminNavbarProps {
  onMenuClick: () => void;
}

export default function AdminNavbar({ onMenuClick }: AdminNavbarProps) {
  const router = useRouter();

  // Controls profile dropdown open/close state
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Controls dark mode toggle state
  const [darkMode, setDarkMode] = useState(false);

  // Currently logged-in admin (read from localStorage via lib/api)
  const [admin, setAdmin] = useState<AuthUser | null>(null);

  // Ref to detect clicks outside the dropdown
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ── Load admin + theme on mount ──
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAdmin(getUser());

    const stored = localStorage.getItem("theme");
    const prefersDark =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = stored === "dark" || (!stored && prefersDark);

    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  // ── Close dropdown on outside click ──
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ── Toggle + persist dark mode ──
  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  // ── Logout: clear storage and redirect ──
  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  return (
    <header
      className="
        w-full h-16
        bg-white/80 dark:bg-[#16242C]/80 backdrop-blur-md
        border-b border-[#D4E8F0] dark:border-[#23394A]
        px-4 sm:px-6
        flex items-center justify-between
        shadow-[0_2px_12px_rgba(47,85,107,0.08)]
        sticky top-0 z-30
      "
    >
      {/* ── LEFT — Mobile menu trigger + Search ── */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="
            lg:hidden flex items-center justify-center
            h-9 w-9 rounded-full
            bg-[#EBF3F8] dark:bg-white/5 hover:bg-[#D4E8F0] dark:hover:bg-white/10
            border border-[#C5DDED] dark:border-[#23394A]
            transition-colors duration-200
            cursor-pointer
          "
          aria-label="Open menu"
        >
          <Icon
            icon="mdi:menu"
            width="20"
            className="text-[#1F3745] dark:text-white"
          />
        </button>

        {/* SEARCH BAR */}
        <div
          className="
            hidden sm:flex items-center gap-2
            bg-[#EBF3F8] dark:bg-white/5 hover:bg-[#DAEBf3] dark:hover:bg-white/10
            transition-colors duration-200
            px-4 py-2 rounded-full
            border border-[#C5DDED] dark:border-[#23394A]
          "
        >
          <Icon
            icon="mdi:magnify"
            width="18"
            className="text-[#547C90] dark:text-[#8AAFC0]"
          />
          <input
            type="text"
            placeholder="Search platform..."
            className="
              bg-transparent outline-none
              text-sm text-[#1F3745] dark:text-white
              placeholder:text-[#8AAFC0]
              w-44 lg:w-56
            "
          />
        </div>
      </div>

      {/* ── RIGHT — Dark mode · Avatar ── */}
      <div className="flex items-center gap-3">
        {/* DARK MODE TOGGLE */}
        <button
          onClick={toggleDarkMode}
          className="
            relative flex items-center justify-center
            h-9 w-9 rounded-full
            bg-[#EBF3F8] dark:bg-white/5 hover:bg-[#D4E8F0] dark:hover:bg-white/10
            border border-[#C5DDED] dark:border-[#23394A]
            transition-colors duration-200
            cursor-pointer
          "
          aria-label="Toggle dark mode"
        >
          <Icon
            icon={darkMode ? "mdi:weather-sunny" : "mdi:weather-night"}
            width="18"
            className="text-[#1F3745] dark:text-white"
          />
        </button>

        {/* ── AVATAR + DROPDOWN WRAPPER ── */}
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="
              flex items-center gap-2
              pl-1 pr-2 sm:pr-3 py-1 rounded-full
              hover:bg-[#EBF3F8] dark:hover:bg-white/5
              transition-colors duration-200
              cursor-pointer
            "
            aria-label="Open profile menu"
            aria-expanded={dropdownOpen}
          >
            <div
              className="
                w-9 h-9 rounded-full
                bg-[#2F556B] dark:bg-[#7ABFA8]
                flex items-center justify-center
                text-white text-sm font-bold
                border-2 border-white dark:border-[#16242C]
                shadow-[0_0_0_3px_rgba(84,124,144,0.15)]
              "
            >
              {admin?.firstName?.[0]?.toUpperCase() ?? "A"}
            </div>
            <span className="hidden sm:block text-sm font-medium text-[#1F3745] dark:text-white">
              {admin?.firstName ?? "Admin"}
            </span>
            <Icon
              icon="mdi:chevron-down"
              width="14"
              className="hidden sm:block text-[#547C90] dark:text-[#8AAFC0] transition-transform duration-300"
              style={{
                transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          </button>

          {/* ── DROPDOWN PANEL ── */}
          <div
            className="
              absolute right-0 mt-3 w-56
              bg-white dark:bg-[#16242C] rounded-2xl
              shadow-[0_8px_30px_rgba(47,85,107,0.15)]
              border border-[#D4E8F0] dark:border-[#23394A]
              overflow-hidden
              transition-all duration-200 origin-top-right
              z-50
            "
            style={{
              opacity: dropdownOpen ? 1 : 0,
              transform: dropdownOpen
                ? "scale(1) translateY(0)"
                : "scale(0.95) translateY(-6px)",
              pointerEvents: dropdownOpen ? "auto" : "none",
            }}
          >
            {/* Admin identity */}
            <div className="px-4 py-3 border-b border-gray-100 dark:border-[#23394A]">
              <p className="text-sm font-semibold text-[#1F3745] dark:text-white truncate">
                {admin ? `${admin.firstName} ${admin.lastName}` : "Admin"}
              </p>
              <p className="text-xs text-[#547C90] dark:text-[#8AAFC0] truncate">
                {admin?.email ?? ""}
              </p>
            </div>

            {/* Logout — red tint to signal destructive action */}
            <button
              onClick={handleLogout}
              className="
                w-full flex items-center gap-3
                px-4 py-3
                text-red-500 text-sm font-medium
                hover:bg-red-50 dark:hover:bg-red-500/10
                transition-colors duration-150
                cursor-pointer
              "
            >
              <Icon icon="mdi:logout" width="17" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
