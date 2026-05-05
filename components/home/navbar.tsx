"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const grades = [
  {
    label: "Primary",
    items: [
      "1st Primary",
      "2nd Primary",
      "3rd Primary",
      "4th Primary",
      "5th Primary",
    ],
  },
  {
    label: "Middle School",
    items: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
  },
  {
    label: "High School",
    items: ["1st Year", "2nd Year"],
  },
  {
    label: "Terminal Class",
    items: [],
  },
];

export default function Navbar() {
  const dropdownRef = useRef<HTMLLIElement | null>(null);
  const [open, setOpen] = useState(false);
  const [openSubjects, setOpenSubjects] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setHovered(null);
        setOpenSubjects(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#F6FAFD]/90 backdrop-blur-md border-b border-[#BACEDA] shadow-sm">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* LEFT - BRAND */}
        <div className="text-2xl font-bold text-[#265166] tracking-wide">
          CourS<span className="text-[#547C90]">ally</span>
        </div>

        {/* MIDDLE - LINKS */}
        <ul className="hidden md:flex items-center gap-8 text-[#1F3745] font-medium">
          {/* GRADES DROPDOWN */}
          <li className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen(!openSubjects)}
              className="hover:text-[#547C90] transition cursor-pointer"
            >
              Grades ▾
            </button>

            {open && (
              <div className="absolute top-8 left-0 z-50 bg-white shadow-lg border border-[#BACEDA] rounded-xl w-52">
                {grades.map((grade) => (
                  <div
                    key={grade.label}
                    className="relative"
                    onMouseEnter={() => setHovered(grade.label)}
                  >
                    <div className="px-4 py-2 hover:bg-[#F1DCDC] hover:text-[#265166] flex justify-between items-center cursor-pointer">
                      {grade.label}
                      {grade.items.length > 0}
                    </div>

                    {/* SUBMENU */}
                    {hovered === grade.label && grade.items.length > 0 && (
                      <div className="absolute top-0 left-full w-48 bg-white shadow-lg border border-[#BACEDA] rounded-xl">
                        {grade.items.map((item, index) => (
                          <Link
                            key={`${item}-${index}`}
                            href="#"
                            className="block px-4 py-2 hover:bg-[#F1DCDC] hover:text-[#265166]"
                          >
                            {item}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </li>
          <li>
            <Link href="#about" className="hover:text-[#547C90] transition">
              Why CourSally
            </Link>
          </li>

          {/* Subjects dropdown*/}
          <li className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpenSubjects(!openSubjects)}
              className="hover:text-[#547C90] transition cursor-pointer"
            >
              Subjects ▾
            </button>

            {openSubjects && (
              <div className="absolute top-8 left-0 z-50 bg-white shadow-lg border border-[#BACEDA] rounded-xl w-80 p-3">
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "Arabic",
                    "Mathematics",
                    "Science",
                    "History",
                    "Geography",
                    "English",
                    "Physics",
                    "Chemistry",
                    "French",
                    "Spanish",
                    "German",
                    "Islamic",
                    "civil education",
                    "civil architecture",
                    "philosophy",
                    "Electricity",
                  ].map((item, index) => (
                    <Link
                      key={`${item}-${index}`}
                      href="#"
                      className="text-sm px-2 py-2 rounded-md text-center hover:bg-[#F1DCDC] hover:text-[#265166] transition"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </li>

          <li>
            <Link href="#location" className="hover:text-[#547C90] transition">
              Location 📍
            </Link>
          </li>
        </ul>

        {/* RIGHT - AUTH BUTTONS */}
        <div className="flex items-center gap-3">
          <Link
            href="/auth/login"
            className="px-4 py-2 rounded-lg border border-[#547C90] text-[#547C90] hover:bg-[#547C90] hover:text-white transition"
          >
            Login
          </Link>

          <Link
            href="/auth/register"
            className="px-4 py-2 rounded-lg bg-[#265166] text-white hover:bg-[#1F3745] transition shadow-md"
          >
            Sign Up
          </Link>
        </div>
      </nav>
    </header>
  );
}
