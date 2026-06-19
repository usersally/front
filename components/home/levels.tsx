"use client";

import Link from "next/link";

export type LevelType = "bac" | "bem" | "other";

type StudentLevelSectionProps = {
  selectedLevel: LevelType;
  setSelectedLevel: (level: LevelType) => void;
};

export default function StudentLevelSection({
  selectedLevel,
  setSelectedLevel,
}: StudentLevelSectionProps) {
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
      description:
        "BAC students are using Coursally to prepare smarter, improve grades, and achieve top exam results.",
      cta: "Start BAC Preparation",
    },

    bem: {
      title: "BEM Students",
      count: "8,000+",
      description:
        "BEM students are building strong foundations with expert teachers and personalized learning support.",
      cta: "Start BEM Preparation",
    },

    other: {
      title: "Other Learners",
      count: "5,000+",
      description:
        "Thousands of learners are improving languages, skills, and academic performance with Coursally.",
      cta: "Explore Courses",
    },
  };

  return (
    <section id="student-level-section" className="w-full py-16 bg-[#F6FAFD]">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-semibold text-center text-[#1F3745] mb-10">
          Choose your level and start your journey
        </h2>

        {/*
            LEVEL SELECTOR BUTTONS */}
        <div className="flex justify-center gap-4 mb-10 flex-wrap">
          <button
            onClick={() => setSelectedLevel("bac")}
            className={`px-6 py-2 rounded-full transition-all duration-300 cursor-pointer
              ${
                selectedLevel === "bac"
                  ? "bg-[#1F3745] text-white shadow-md"
                  : "bg-white text-[#1F3745] border border-[#BACEDA]"
              }`}
          >
            BAC
          </button>

          <button
            onClick={() => setSelectedLevel("bem")}
            className={`px-6 py-2 rounded-full transition-all duration-300 cursor-pointer
              ${
                selectedLevel === "bem"
                  ? "bg-[#1F3745] text-white shadow-md"
                  : "bg-white text-[#1F3745] border border-[#BACEDA]"
              }`}
          >
            BEM
          </button>

          <button
            onClick={() => setSelectedLevel("other")}
            className={`px-6 py-2 rounded-full transition-all duration-300 cursor-pointer
              ${
                selectedLevel === "other"
                  ? "bg-[#1F3745] text-white shadow-md"
                  : "bg-white text-[#1F3745] border border-[#BACEDA]"
              }`}
          >
            Others
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-8 text-center max-w-3xl mx-auto transition-all duration-300">
          <h3 className="text-xl md:text-2xl font-semibold text-[#1F3745] mb-4">
            {levels[selectedLevel].title}
          </h3>

          <p className="text-4xl font-bold text-[#265166] mb-4">
            {levels[selectedLevel].count}
          </p>

          <p className="text-gray-600 mb-6 leading-relaxed">
            {levels[selectedLevel].description}
          </p>

          <button className="bg-[#265166] hover:bg-[#1F3745] text-white px-6 py-3 rounded-lg transition-all duration-300 shadow-md cursor-pointer">
            <Link href="/auth/login">{levels[selectedLevel].cta}</Link>
          </button>
        </div>
      </div>
    </section>
  );
}
