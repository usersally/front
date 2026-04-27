import { Icon } from "@iconify/react";

const links = [
  { label: "Find teachers", icon: "mdi:magnify", href: "/student/find" },
  { label: "My booking", icon: "mdi:calendar", href: "/student/bookings" },
  { label: "Messages", icon: "mdi:chat", href: "/student/messages" },
  { label: "Settings", icon: "mdi:cog", href: "/student/settings" },
];

export default function StudentSidebar() {
  return (
    <aside className="w-64 bg-[#2F556B] text-white flex flex-col justify-between p-5 rounded-xl -ml-4">
      {/* TOP: PROFILE + LINKS */}
      <div>
        {/* PROFILE */}
        <div className="flex flex-col items-center mb-8">
          <img
            src="/avatar.png"
            alt="profile"
            className="w-16 h-16 rounded-full border-2 border-white"
          />
          <h3 className="mt-3 font-semibold">Student Name</h3>
          <p className="text-sm opacity-70">email@mail.com</p>
        </div>

        {/* LINKS */}
        <nav className="space-y-3">
          {links.map((link, i) => (
            <a
              key={i}
              href={link.href}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#3E6B82] transition"
            >
              <Icon icon={link.icon} width="20" />
              {link.label}
            </a>
          ))}
        </nav>
      </div>

      {/* BOTTOM: LOGOUT */}
      <button className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-500 transition cursor-pointer">
        <Icon icon="mdi:logout" width="20" />
        Logout
      </button>
    </aside>
  );
}
