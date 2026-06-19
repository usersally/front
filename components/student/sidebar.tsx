/* eslint-disable @next/next/no-img-element */

"use client";

import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useStudentTab, StudentTab } from "./Studenttabcontext";

const links: { label: string; icon: string; tab: StudentTab }[] = [
  {
    label: "Dashboard",
    icon: "mdi:view-dashboard",
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
    icon: "mdi:calendar",
    tab: "bookings",
  },
  {
    label: "Profile",
    icon: "mdi:account",
    tab: "profile",
  },
];

export default function StudentSidebar() {
  const router = useRouter();
  const { activeTab, setActiveTab } = useStudentTab();

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/auth/login");
  };

  return (
    <aside className="w-64 bg-[#2F556B] text-white flex flex-col justify-between p-5">
      {/* TOP */}
      <div>
        {/* PROFILE */}
        <div className="flex flex-col items-center mb-10">
          <img
            src="/avatar.png"
            alt="profile"
            className="w-20 h-20 rounded-full border-2 border-white object-cover"
          />
          <h3 className="mt-4 font-semibold text-lg">Student Name</h3>
          <p className="text-sm opacity-70">email@mail.com</p>
        </div>

        {/* LINKS */}
        <nav className="space-y-2">
          {links.map((link) => {
            const isActive = activeTab === link.tab;

            return (
              <button
                key={link.tab}
                onClick={() => setActiveTab(link.tab)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 cursor-pointer
                  ${isActive ? "bg-white text-[#2F556B]" : "hover:bg-[#3E6B82] text-white"}
                `}
              >
                <Icon icon={link.icon} width="22" />
                <span>{link.label}</span>
              </button>
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
  );
}
