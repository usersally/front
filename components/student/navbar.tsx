import { Icon } from "@iconify/react";

export default function StudentNavbar() {
  return (
    <div className="w-full h-16 bg-white flex items-center justify-between px-6 shadow-sm">
      {/* LEFT */}
      <h1 className="font-bold text-lg">Coursally</h1>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        {/* SEARCH */}
        <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none text-sm"
          />
          <Icon icon="mdi:magnify" />
        </div>

        {/* ICONS */}
        <Icon icon="mdi:bell-outline" width="22" />
      </div>
    </div>
  );
}
