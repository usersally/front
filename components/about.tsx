"use client";

import Image from "next/image";

export default function About() {
  const cards = [
    {
      title: "Top Rated Teachers",
      desc: "Learn from highly qualified educators based on real student reviews, ensuring quality and trust .Choose teachers with proven experience who help you achieve real academic progress.",
      img: "/abt1.jpg",
    },
    {
      title: "Personalized Learning",
      desc: "Find courses tailored to your level, goals, and preferred learning style, designed to maximize your understanding, boost your confidence, and deliver real academic results",
      img: "/abt2.jpg",
    },
    {
      title: "Trusted Teachers",
      desc: "Verified educators with proven results and trusted by students across different levels. Build confidence with teachers who consistently deliver strong outcomes.",
      img: "/abt4.jpg",
    },
    {
      title: "Local & Trusted",
      desc: "Connect with teachers near you and stay updated with local opportunities and courses. Easily find the right support in your area to match your learning needs.",
      img: "/abt3.jpg",
    },
  ];

  return (
    <section className="relative w-full py-24 bg-[#F6FAFD] overflow-hidden">
      {/* CURVED BACKGROUND */}
      <div className="absolute top-4 left-0 w-full h-full bg-[#c5d8e3] rounded-t-[36%] z-0"></div>
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* TITLE */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1F3745] mb-4">
            Smarter Learning Starts Here
          </h2>
          <p className="text-[#547C90] max-w-2xl mx-auto">
            CourSally connects students with the best teachers, making learning
            simple, effective, and accessible.
          </p>
        </div>

        {/* CARDS */}
        <div className="flex justify-center gap-8 flex-wrap ">
          {" "}
          {cards.map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition group w-68"
            >
              {/* IMAGE */}
              <div className="relative h-64">
                <Image
                  src={card.img}
                  alt={card.title}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-500"
                />
              </div>

              {/* TEXT */}
              <div className="p-5">
                <h3 className="text-lg font-semibold text-[#265166] mb-2">
                  {card.title}
                </h3>
                <p className="text-sm text-[#547C90] leading-relaxed">
                  {card.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* SUBJECTS SECTION */}
        <div className="mt-20 grid md:grid-cols-2 gap-12 items-start ">
          {/* LEFT SIDE */}
          <div className="mt-20">
            <h3 className="text-2xl md:text-3xl font-bold text-[#1F3745] mb-4">
              All Subjects, One Platform
            </h3>

            <p className="text-[#547C90] leading-relaxed max-w-md ">
              Whether you are in primary, secondary, or high school, CourSally
              gives you access to a wide range of subjects taught by experienced
              teachers. Find exactly what you need, when you need it.
            </p>
          </div>

          {/* RIGHT SIDE */}
          <div className="grid grid-cols-2 gap-y-4 gap-x-6 ">
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
            ].map((subject, index) => (
              <div key={index} className="flex items-center gap-2">
                {/* CHECK ICON */}
                <span className="text-[#547C90] text-lg">✔</span>

                {/* SUBJECT */}
                <span className="text-[#1F3745] text-sm">{subject}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
