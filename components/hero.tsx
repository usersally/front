"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function HeroCards() {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    //  send this to backend later
    console.log("Search:", query);
  };

  return (
    <section className="w-full h-screen relative overflow-hidden">
      {/* BACKGROUND IMAGE */}
      <Image
        src="/card3.jpg"
        alt="Book course"
        fill
        priority
        className="object-cover"
      />

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1F3745]/80 via-[#1F3745]/50 to-[#1F3745]/30" />

      {/* CONTENT */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6 z-10">
        {/* TITLE */}
        <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight max-w-2xl">
          Book Your Course Now
        </h1>

        {/* SUBTEXT */}
        <p className="text-sm md:text-lg opacity-90 mb-6 max-w-xl">
          Stay updated with top teachers, announcements, and your learning
          journey.
        </p>

        {/* CTA BUTTON */}
        <Link
          href="/auth/login"
          className="px-8 py-3 rounded-lg bg-[#547C90] hover:bg-[#265166] transition font-medium shadow-lg text-lg mb-10"
        >
          Book Now
        </Link>

        {/* ================= SEARCH SECTION ================= */}
        <div className="w-full flex justify-center px-4">
          <div className="w-full max-w-4xl">
            {/* SEARCH BAR (glass effect) */}
            <div className="flex items-center backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl px-4 py-4 h-12 md:py-5 shadow-lg ">
              {/* ICON */}
              <span className="text-white text-lg mr-3">🔍</span>

              {/* INPUT */}
              <input
                type="text"
                placeholder="Search subject, teacher, grade or location..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent outline-none text-white text-base md:text-lg placeholder:text-white/70 "
              />

              {/* BUTTON */}
              <button
                onClick={handleSearch}
                className="ml-3 px-6 py-2 rounded-lg bg-[#547C90] text-white hover:bg-[#265166] transition cursor-pointer"
              >
                Search
              </button>
            </div>

            {/* TAGS */}
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              {["Math", "Physics", "Primary", "Alger"].map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-1.5 rounded-full border border-white/30 text-white text-sm cursor-pointer hover:bg-white hover:text-[#1F3745] transition"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
