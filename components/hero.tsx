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
    <section className="w-full bg-[#F6FAFD]">
      {/* FULL WIDTH GRID */}
      <div className="grid md:grid-cols-2 gap-4 w-full ">
        {/* CARD 1 */}
        <div className="relative h-[50vh] md:h-[70vh] overflow-hidden group rounded-2xl mt-2 shadow-xl">
          <Image
            src="/card3.jpg"
            alt="Book course"
            fill
            className="object-cover group-hover:scale-105 transition duration-500"
            priority
          />

          <div className="absolute inset-0 bg-linear-to-t from-[#1F3745]/80 via-[#1F3745]/40 to-transparent"></div>

          <div className="absolute bottom-0 p-8 text-white z-10 max-w-lg">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Book Your Course Now
            </h2>
            <p className="mb-4 opacity-90">
              Stay updated with top teachers, announcements, and your learning
              journey.
            </p>

            <Link
              href="/auth/login"
              className="inline-block px-6 py-2 rounded-lg bg-[#547C90] hover:bg-[#265166] transition font-medium shadow-md"
            >
              Book Now
            </Link>
          </div>
        </div>

        {/* CARD 2 */}
        <div className="relative h-[50vh] md:h-[70vh] overflow-hidden group rounded-2xl mt-2 shadow-2xl">
          <Image
            src="/card2.jpg"
            alt="Best teachers"
            fill
            className="object-cover group-hover:scale-105 transition duration-500"
          />

          <div className="absolute inset-0 bg-linear-to-t from-[#265166]/80 via-[#265166]/40 to-transparent"></div>

          <div className="absolute bottom-0 p-8 text-white z-10 max-w-lg">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Explore Top Rated Teachers
            </h2>
            <p className="mb-4 opacity-90">
              Discover the best educators and choose the perfect teacher for
              you.
            </p>

            <Link
              href="/teachers"
              className="inline-block px-6 py-2 rounded-lg bg-[#BACEDA] text-[#1F3745] hover:bg-white transition font-medium shadow-md"
            >
              Explore
            </Link>
          </div>
        </div>
      </div>

      {/* SEARCH SECTION */}
      <div className="w-full flex justify-center mt-12 px-4">
        <div className="w-full max-w-5xl">
          {/* TITLE */}
          <h2 className="text-center text-2xl md:text-3xl font-semibold text-[#1F3745] mb-6">
            Find your perfect teacher
          </h2>

          {/* SEARCH BAR */}
          <div className="flex items-center bg-transparent border border-[#BACEDA] rounded-xl px-4 py-4 md:py-5 shadow-sm focus-within:shadow-md transition">
            {/* ICON */}
            <span className="text-[#547C90] text-lg mr-3">🔍</span>

            {/* INPUT */}
            <input
              type="text"
              placeholder="Search subject, teacher, grade or location..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-[#1F3745] text-base md:text-lg placeholder:text-[#547C90]/70"
            />

            {/* BUTTON */}
            <button
              onClick={handleSearch}
              className="ml-3 px-5 py-2 rounded-lg bg-[#265166] text-white hover:bg-[#1F3745] transition cursor-pointer"
            >
              Search
            </button>
          </div>

          {/* TAGS (like Coursera) */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {["Math", "Physics", "Primary", "Alger"].map((tag) => (
              <span
                key={tag}
                className="px-4 py-1.5 rounded-full border border-[#BACEDA] text-[#547C90] text-sm cursor-pointer hover:bg-[#547C90] hover:text-white transition"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
