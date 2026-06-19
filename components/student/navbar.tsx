/* eslint-disable @next/next/no-img-element */
"use client";

/**

 *  STUDENT NAVBAR


 */

import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useStudentTab, StudentTab } from "./Studenttabcontext";
import { getUser, logout, type AuthUser } from "@/lib/api";

// ─────────────────────────────────────────────
//  DROPDOWN ITEMS — shown when avatar is clicked
// ─────────────────────────────────────────────
const dropdownItems: {
  label: string;
  icon: string;
  tab: StudentTab;
}[] = [
  {
    label: "My Profile",
    icon: "mdi:account-outline",
    tab: "profile",
  },
  {
    label: "My Courses",
    icon: "mdi:book-open-outline",
    tab: "courses",
  },
  {
    label: "My Bookings",
    icon: "mdi:calendar-outline",
    tab: "bookings",
  },
];

export default function StudentNavbar() {
  const router = useRouter();
  const { setActiveTab } = useStudentTab();
  const [user, setUser] = useState<AuthUser | null>(null);

  // Controls notification dot visibility
  const [hasNotif, setHasNotif] = useState(true);

  // Controls profile dropdown open/close state
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Ref to detect clicks outside the dropdown
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ── Close dropdown on outside click ──
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(getUser());
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

  // ── Logout: clear storage and redirect ──
  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  const handleNav = (tab: StudentTab) => {
    setActiveTab(tab);
    setDropdownOpen(false);
  };

  return (
    <header
      className="
        w-full h-16
        bg-white/80 backdrop-blur-md
        border-b border-[#D4E8F0]
        px-6
        flex items-center justify-between
        shadow-[0_2px_12px_rgba(47,85,107,0.08)]
        sticky top-0 z-50
      "
    >
      {/* ── LEFT — Brand logo ── */}
      <h1 className="text-2xl font-extrabold tracking-tight text-[#1F3745] select-none">
        Cour<span className="text-[#547C90]">S</span>ally
      </h1>

      {/* ── RIGHT — Search · Bell · Avatar ── */}
      <div className="flex items-center gap-4">
        {/* SEARCH BAR */}
        <div
          className="
            flex items-center gap-2
            bg-[#EBF3F8] hover:bg-[#DAEBf3]
            transition-colors duration-200
            px-4 py-2 rounded-full
            border border-[#C5DDED]
          "
        >
          <Icon icon="mdi:magnify" width="18" className="text-[#547C90]" />
          <input
            type="text"
            placeholder="Search..."
            className="
              bg-transparent outline-none
              text-sm text-[#1F3745]
              placeholder:text-[#8AAFC0]
              w-44
            "
          />
        </div>

        {/* NOTIFICATION BELL — dot clears on click */}
        <button
          onClick={() => setHasNotif(false)}
          className="
            relative flex items-center justify-center
            h-9 w-9 rounded-full
            bg-[#EBF3F8] hover:bg-[#D4E8F0]
            border border-[#C5DDED]
            transition-colors duration-200
            cursor-pointer
          "
          aria-label="Notifications"
        >
          <Icon icon="mdi:bell-outline" width="20" className="text-[#1F3745]" />

          {/* Animated red dot — hidden once clicked */}
          {hasNotif && (
            <span
              className="
                absolute top-1.5 right-1.5
                h-2 w-2 rounded-full bg-[#E05C3A]
                ring-2 ring-white animate-pulse
              "
            />
          )}
        </button>

        {/* ── AVATAR + DROPDOWN WRAPPER ── */}
        <div ref={dropdownRef} className="relative">
          {/* Avatar button — toggles dropdown */}
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="relative focus:outline-none group cursor-pointer"
            aria-label="Open profile menu"
            aria-expanded={dropdownOpen}
          >
            <img
              src="/avatar.png"
              alt="profile"
              className="
                w-9 h-9 rounded-full
                border-2 border-[#547C90]
                shadow-[0_0_0_3px_rgba(84,124,144,0.15)]
                object-cover
                group-hover:scale-105
                transition-transform duration-200
              "
            />

            {/* Chevron badge — rotates when dropdown is open */}
            <span
              className="
                absolute -bottom-0.5 -right-0.5
                flex items-center justify-center
                h-4 w-4 rounded-full
                bg-[#547C90] border-2 border-white
                transition-transform duration-300
              "
              style={{
                transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
              }}
            >
              <Icon icon="mdi:chevron-down" width="10" className="text-white" />
            </span>
          </button>

          {/* ── DROPDOWN PANEL ──
              Slides in below the avatar with opacity + scale animation. */}
          <div
            className="
              absolute right-0 mt-3 w-48
              bg-white rounded-2xl
              shadow-[0_8px_30px_rgba(47,85,107,0.15)]
              border border-[#D4E8F0]
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
            {/* Nav links */}
            {dropdownItems.map((item) => (
              <button
                key={item.tab}
                type="button"
                onClick={() => handleNav(item.tab)}
                className="
                  w-full flex items-center gap-3
                  px-4 py-3
                  text-[#1F3745] text-sm font-medium
                  hover:bg-[#EBF3F8]
                  transition-colors duration-150
                  border-b border-gray-100
                  cursor-pointer
                "
              >
                <Icon icon={item.icon} width="17" className="text-[#547C90]" />
                {item.label}
              </button>
            ))}

            {/* Logout — red tint to signal destructive action */}
            <button
              onClick={handleLogout}
              className="
                w-full flex items-center gap-3
                px-4 py-3
                text-red-500 text-sm font-medium
                hover:bg-red-50
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
