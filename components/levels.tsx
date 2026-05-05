"use client";

import { useState } from "react";

// STEP 1: define a union type
type LevelType = "bac" | "bem" | "other";

export default function StudentLevelSection() {
  // STEP 2: use the type in useState
  const [selectedLevel, setSelectedLevel] = useState<LevelType>("bac");

  // STEP 3: type your object (optional but cleaner)
  const levels: Record<
    LevelType,
    {
      title: string;
      count: string;
      description: string;
      cta: string;
    }
  > = {
    bac: {
      title: "BAC Students",
      count: "10,000+",
      description: "BAC students are using Coursally...",
      cta: "Start BAC Preparation",
    },
    bem: {
      title: "BEM Students",
      count: "8,000+",
      description: "BEM students are building strong foundations...",
      cta: "Start BEM Preparation",
    },
    other: {
      title: "Other Learners",
      count: "5,000+",
      description: "Thousands are improving their skills...",
      cta: "Explore Courses",
    },
  };

  return (
    <section className="w-full py-16 bg-[#F6FAFD]">
      {/* CONTAINER */}
      <div className="max-w-6xl mx-auto px-6">
        {/* TITLE */}
        <h2 className="text-2xl md:text-3xl font-semibold text-center text-[#1F3745] mb-10">
          Choose your level and start your journey
        </h2>

        {/* LEVEL SELECTOR BUTTONS */}
        <div className="flex justify-center gap-4 mb-10">
          {/* BAC BUTTON */}
          <button
            onClick={() => setSelectedLevel("bac")}
            className={`px-6 py-2 rounded-full transition-all duration-300 cursor-pointer 
              ${
                selectedLevel === "bac"
                  ? "bg-[#1F3745] text-white shadow-md"
                  : "bg-white text-[#1F3745] border"
              }`}
          >
            BAC
          </button>

          {/* BEM BUTTON */}
          <button
            onClick={() => setSelectedLevel("bem")}
            className={`px-6 py-2 rounded-full transition-all duration-300 cursor-pointer
              ${
                selectedLevel === "bem"
                  ? "bg-[#1F3745] text-white shadow-md"
                  : "bg-white text-[#1F3745] border"
              }`}
          >
            BEM
          </button>

          {/* OTHER BUTTON */}
          <button
            onClick={() => setSelectedLevel("other")}
            className={`px-6 py-2 rounded-full transition-all duration-300 cursor-pointer
              ${
                selectedLevel === "other"
                  ? "bg-[#1F3745] text-white shadow-md"
                  : "bg-white text-[#1F3745] border"
              }`}
          >
            Others
          </button>
        </div>

        {/* CONTENT CARD */}
        <div className="bg-white rounded-2xl shadow-md p-8 text-center max-w-3xl mx-auto transition-all duration-300">
          {/* DYNAMIC TITLE */}
          <h3 className="text-xl md:text-2xl font-semibold text-[#1F3745] mb-4">
            {levels[selectedLevel].title}
          </h3>

          {/* STUDENT COUNT (HIGHLIGHT) */}
          <p className="text-4xl font-bold text-[#265166] mb-4">
            {levels[selectedLevel].count}
          </p>

          {/* DESCRIPTION */}
          <p className="text-gray-600 mb-6">
            {levels[selectedLevel].description}
          </p>

          {/* CTA BUTTON */}
          <button className="bg-[#265166] hover:bg-[#1F3745] text-white px-6 py-3 rounded-lg transition-all duration-300 shadow-md cursor-pointer">
            {levels[selectedLevel].cta}
          </button>
        </div>
      </div>
    </section>
  );
}
