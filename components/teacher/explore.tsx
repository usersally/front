"use client";

import { useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import { api, getErrorMessage } from "@/lib/api";

interface Schedule {
  day: string;
  startTime: string;
  endTime: string;
}

interface TeacherInfo {
  _id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

interface ExploreCourse {
  _id: string;
  title: string;
  description: string;
  price: number;
  level: string;
  grade?: string;
  subject?: string;
  image?: string | null;
  schedule?: Schedule[];
  teacher: TeacherInfo;
}

export default function TeacherExplorePage() {
  const [courses, setCourses] = useState<ExploreCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const { data } = await api.get<{ success: boolean; data: ExploreCourse[] }>(
          "/courses",
        );
        setCourses(data.data ?? []);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const levels = useMemo(() => {
    const unique = Array.from(new Set(courses.map((c) => c.level).filter(Boolean)));
    return ["all", ...unique];
  }, [courses]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return courses.filter((course) => {
      const matchesLevel = levelFilter === "all" || course.level === levelFilter;
      const matchesSearch =
        !q ||
        course.title.toLowerCase().includes(q) ||
        (course.subject ?? "").toLowerCase().includes(q) ||
        `${course.teacher?.firstName ?? ""} ${course.teacher?.lastName ?? ""}`
          .toLowerCase()
          .includes(q);
      return matchesLevel && matchesSearch;
    });
  }, [courses, search, levelFilter]);

  return (
    <div className="p-8 min-h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#1F3745] tracking-tight">
          Explore Courses
        </h1>
        <p className="text-sm text-[#547C90] mt-1">
          Browse every published course on CourSally.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-3 mb-8">
        <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-full border border-[#D4E8F0] flex-1">
          <Icon icon="mdi:magnify" width={18} className="text-[#547C90]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, subject, or teacher..."
            className="bg-transparent outline-none text-sm text-[#1F3745] w-full"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {levels.map((level) => (
            <button
              key={level}
              onClick={() => setLevelFilter(level)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition cursor-pointer ${
                levelFilter === level
                  ? "bg-[#2F556B] text-white"
                  : "bg-white text-[#547C90] border border-[#D4E8F0] hover:bg-[#EBF3F8]"
              }`}
            >
              {level === "all" ? "All levels" : level}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-72 rounded-2xl bg-[#D4E8F0]/60 animate-pulse"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-[#547C90]">
          <Icon
            icon="mdi:book-search-outline"
            width={48}
            className="mx-auto mb-3 opacity-40"
          />
          <p>No courses match your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((course) => (
            <article
              key={course._id}
              className="bg-white rounded-2xl overflow-hidden border border-[#D4E8F0] shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className="h-44 bg-[#EBF3F8] relative">
                {course.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#8AAFC0]">
                    <Icon icon="mdi:image-outline" width={40} />
                  </div>
                )}
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold bg-white/90 text-[#2F556B]">
                  {course.level}
                </span>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  {course.teacher?.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={course.teacher.avatar}
                      alt=""
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#2F556B] text-white text-xs font-bold flex items-center justify-center">
                      {course.teacher?.firstName?.[0]}
                      {course.teacher?.lastName?.[0]}
                    </div>
                  )}
                  <p className="text-sm text-[#547C90]">
                    {course.teacher?.firstName} {course.teacher?.lastName}
                  </p>
                </div>
                <h3 className="font-bold text-[#1F3745] text-lg leading-snug">
                  {course.title}
                </h3>
                <p className="text-sm text-[#547C90] mt-2 line-clamp-2">
                  {course.description}
                </p>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#EBF3F8]">
                  <span className="text-xs font-semibold uppercase tracking-wide text-[#7ABFA8]">
                    {course.subject || "General"}
                  </span>
                  <span className="text-[#2F556B] font-extrabold">
                    {course.price} DA
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
