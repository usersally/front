"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { LevelType } from "./levels";

type NavbarProps = {
  setSelectedLevel: React.Dispatch<React.SetStateAction<LevelType>>;
};

export default function Navbar({ setSelectedLevel }: NavbarProps) {
  const levelsDropdownRef = useRef<HTMLLIElement | null>(null);

  const [openLevels, setOpenLevels] = useState(false);

  const grades = [
    {
      label: "Primary School",
      level: "other",
    },
    {
      label: "Middle School",
      level: "other",
    },
    {
      label: "BEM Class",
      level: "bem",
    },
    {
      label: "High School",
      level: "other",
    },
    {
      label: "BAC Class",
      level: "bac",
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // CLOSE LEVELS DROPDOWN
      if (
        levelsDropdownRef.current &&
        !levelsDropdownRef.current.contains(event.target as Node)
      ) {
        setOpenLevels(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /*
     HANDLE LEVEL CLICK */
  const handleLevelClick = (level: LevelType) => {
    // CHANGE SELECTED LEVEL
    setSelectedLevel(level);

    // SCROLL TO LEVEL SECTION
    document.getElementById("student-level-section")?.scrollIntoView({
      behavior: "smooth",
    });

    // CLOSE DROPDOWN
    setOpenLevels(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#F6FAFD]/90 backdrop-blur-md border-b border-[#BACEDA] shadow-sm">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="text-2xl font-bold text-[#265166] tracking-wide"
        >
          CourS
          <span className="text-[#547C90]">ally</span>
        </Link>

        {/* CENTER - NAVIGATION LINKS */}
        <ul className="hidden md:flex items-center gap-8 text-[#1F3745] font-medium">
          {/* LEVELS DROPDOWN */}
          <li className="relative" ref={levelsDropdownRef}>
            <button
              onClick={() => setOpenLevels(!openLevels)}
              className="hover:text-[#547C90] transition cursor-pointer"
            >
              Levels ▾
            </button>

            {/* DROPDOWN MENU */}
            {openLevels && (
              <div className="absolute top-8 left-0 z-50 bg-white shadow-lg border border-[#BACEDA] rounded-xl w-52 overflow-hidden">
                {grades.map((grade) => (
                  <button
                    key={grade.label}
                    onClick={() => handleLevelClick(grade.level as LevelType)}
                    className="w-full text-left px-4 py-3 hover:bg-[#F1DCDC] hover:text-[#265166] transition cursor-pointer"
                  >
                    {grade.label}
                  </button>
                ))}
              </div>
            )}
          </li>

          {/* ABOUT SECTION */}
          <li>
            <Link href="#about" className="hover:text-[#547C90] transition">
              Why CourSally
            </Link>
          </li>

          {/* LOCATION SECTION */}
          <li>
            <Link href="#location" className="hover:text-[#547C90] transition">
              Location 📍
            </Link>
          </li>
        </ul>

        <div className="flex items-center gap-3">
          {/* LOGIN BUTTON */}
          <Link
            href="/auth/login"
            className="px-4 py-2 rounded-lg border border-[#547C90] text-[#547C90] hover:bg-[#547C90] hover:text-white transition"
          >
            Login
          </Link>

          {/* SIGNUP BUTTON */}
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
