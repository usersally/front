"use client";

export default function LocationSection() {
  // 👉 Replace with your real coordinates
  const latitude = 35.6981;
  const longitude = -0.6348;

  const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

  return (
    <section className="w-full py-20 bg-[#F6FAFD]">
      {/* CONTAINER */}
      <div className="max-w-7xl mx-auto px-6">
        {/* MAIN GRID */}
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/*  MAP CARD */}
          <div className="relative w-full h-100 rounded-3xl overflow-hidden shadow-lg group">
            {/* CLICKABLE OVERLAY */}
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 z-10"
            />

            {/* MAP */}
            <iframe
              title="Coursally Location"
              src={`https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`}
              className="w-full h-full border-0"
              loading="lazy"
            />

            {/* HOVER EFFECT */}
            <div className="absolute inset-0 bg-[#265166]/0 group-hover:bg-[#265166]/10 transition-all duration-300" />

            {/* SMALL LABEL */}
            <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-xl shadow text-sm text-[#265166] font-medium">
              📍 Alger - Coursally
            </div>
          </div>

          {/* 🧾 RIGHT: TEXT CONTENT */}
          <div className="flex flex-col justify-center">
            {/* TITLE */}
            <h2 className="text-3xl md:text-4xl font-semibold text-[#265166] mb-4">
              Learn with us, even offline
            </h2>

            {/* DESCRIPTION */}
            <p className="text-[#414A4E] text-lg leading-relaxed mb-6">
              Coursally is not just an online platform. You can also visit our
              physical space to meet teachers, ask questions, and get guided in
              your learning journey.
            </p>

            {/* EXTRA INFO (adds richness) */}
            <div className="mb-6 space-y-2 text-[#547C90]">
              <p>• Quiet study environment</p>
              <p>• Direct support from teachers</p>
              <p>• Personalized guidance</p>
            </div>

            {/* CTA BUTTON */}
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit bg-[#265166] hover:bg-[#1E3745] text-white px-6 py-3 rounded-xl transition-all duration-300 shadow-md"
            >
              Open in Google Maps
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
