"use client";

import { useEffect, useState, useCallback } from "react";
import { Icon } from "@iconify/react";
import { api, getErrorMessage } from "@/lib/api";

// ─────────────────────────────────────────────
//  TYPES  (matches teacher.ts model)
// ─────────────────────────────────────────────
interface Teacher {
  _id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  bio: string;
  subject: string[];
  levels: string[];
  pricePerHour: number;
  pricePerMonth: number;
  availability: { day: string; startTime: string; endTime: string }[];
  avgRating?: number;
  totalRatings?: number;
  inSchool: boolean;
}

interface TeachersResponse {
  success: boolean;
  data: Teacher[];
  total?: number;
}

// ─────────────────────────────────────────────
//  HOOK
// ─────────────────────────────────────────────
function useTeachers(query: {
  search: string;
  subject: string;
  level: string;
  maxPrice: string;
}) {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (query.search) params.set("search", query.search);
      if (query.subject) params.set("subject", query.subject);
      if (query.level) params.set("level", query.level);
      if (query.maxPrice) params.set("maxPrice", query.maxPrice);

      const { data: res } = await api.get<TeachersResponse>(
        `/teachers?${params.toString()}`,
      );
      setTeachers(res.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [query.search, query.subject, query.level, query.maxPrice]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { teachers, loading, error, refetch: fetch };
}

// ─────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────
const LEVELS = ["Primaire", "Moyen", "Lycée", "Université", "Adulte"];
const SUBJECTS = [
  "Mathématiques",
  "Physique",
  "Chimie",
  "Informatique",
  "Anglais",
  "Français",
  "Arabe",
  "Histoire",
];

function StarRating({ rating, total }: { rating?: number; total?: number }) {
  const stars = Math.round(rating ?? 0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <Icon
          key={s}
          icon={s <= stars ? "mdi:star" : "mdi:star-outline"}
          width={14}
          className={s <= stars ? "text-amber-400" : "text-gray-300"}
        />
      ))}
      {total !== undefined && (
        <span className="text-xs text-gray-400 ml-1">({total})</span>
      )}
    </div>
  );
}

function AvailabilityBadge({
  slots,
}: {
  slots: { day: string; startTime: string; endTime: string }[];
}) {
  if (!slots || slots.length === 0)
    return <span className="text-xs text-gray-400">No availability set</span>;
  return (
    <div className="flex flex-wrap gap-1">
      {slots.slice(0, 3).map((s, i) => (
        <span
          key={i}
          className="rounded-full bg-[#EBF3F8] px-2 py-0.5 text-xs font-medium text-[#2F556B]"
        >
          {s.day.slice(0, 3)} {s.startTime}–{s.endTime}
        </span>
      ))}
      {slots.length > 3 && (
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
          +{slots.length - 3} more
        </span>
      )}
    </div>
  );
}

function TeacherCard({ teacher }: { teacher: Teacher }) {
  return (
    <div className="group rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      {/* Top strip */}
      <div className="h-1.5 w-full bg-linear-to-r from-[#2F556B] to-[#A8C8D8]" />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative shrink-0">
            {teacher.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={teacher.avatar}
                alt={teacher.firstName}
                className="h-14 w-14 rounded-xl object-cover"
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#EBF3F8]">
                <Icon icon="mdi:account" width={28} color="#2F556B" />
              </div>
            )}
            {teacher.inSchool && (
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-400 ring-2 ring-white">
                <Icon icon="mdi:school" width={10} className="text-white" />
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-[#1F3745] truncate">
              {teacher.firstName} {teacher.lastName}
            </h3>
            <StarRating
              rating={teacher.avgRating}
              total={teacher.totalRatings}
            />
            <div className="mt-1 flex flex-wrap gap-1">
              {teacher.subject.slice(0, 2).map((s, i) => (
                <span
                  key={i}
                  className="rounded-md bg-[#2F556B]/10 px-1.5 py-0.5 text-xs font-semibold text-[#2F556B]"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Price */}
          <div className="text-right shrink-0">
            <p className="text-lg font-bold text-[#2F556B]">
              {teacher.pricePerHour.toLocaleString()}
              <span className="text-xs font-normal text-gray-400"> DA/hr</span>
            </p>
            <p className="text-xs text-gray-400">
              {teacher.pricePerMonth.toLocaleString()} DA/mo
            </p>
          </div>
        </div>

        {/* Bio */}
        <p className="mb-4 text-sm text-gray-500 line-clamp-2">{teacher.bio}</p>

        {/* Levels */}
        <div className="mb-3 flex flex-wrap gap-1">
          {teacher.levels.map((l, i) => (
            <span
              key={i}
              className="rounded-full border border-gray-200 px-2 py-0.5 text-xs text-gray-600"
            >
              {l}
            </span>
          ))}
        </div>

        {/* Availability */}
        <AvailabilityBadge slots={teacher.availability} />

        {/* Actions */}
        <div className="mt-4 flex gap-2">
          <a
            href={`/student/teachers/${teacher._id}`}
            className="flex-1 rounded-xl border border-[#2F556B] py-2 text-center text-sm font-semibold text-[#2F556B] transition hover:bg-[#EBF3F8]"
          >
            View Profile
          </a>
          <a
            href={`/student/bookings/new?teacherId=${teacher._id}`}
            className="flex-1 rounded-xl bg-[#2F556B] py-2 text-center text-sm font-semibold text-white transition hover:bg-[#1F3745]"
          >
            Book Session
          </a>
        </div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl bg-white border border-gray-100 p-5 shadow-sm">
      <div className="flex gap-4 mb-4">
        <div className="h-14 w-14 rounded-xl bg-gray-200" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-32 rounded bg-gray-200" />
          <div className="h-3 w-24 rounded bg-gray-200" />
          <div className="h-3 w-16 rounded bg-gray-200" />
        </div>
        <div className="h-8 w-16 rounded bg-gray-200" />
      </div>
      <div className="space-y-2">
        <div className="h-3 w-full rounded bg-gray-200" />
        <div className="h-3 w-3/4 rounded bg-gray-200" />
      </div>
      <div className="mt-4 flex gap-2">
        <div className="h-9 flex-1 rounded-xl bg-gray-200" />
        <div className="h-9 flex-1 rounded-xl bg-gray-200" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  PAGE
// ─────────────────────────────────────────────
export default function FindTeachersPage() {
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("");
  const [level, setLevel] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // Debounce search input
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const { teachers, loading, error } = useTeachers({
    search: debouncedSearch,
    subject,
    level,
    maxPrice,
  });

  const clearFilters = () => {
    setSearch("");
    setSubject("");
    setLevel("");
    setMaxPrice("");
  };

  const hasFilters = search || subject || level || maxPrice;

  return (
    <div className="min-h-screen bg-[#EBF3F8] p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-[#1F3745]">Find Teachers</h2>
        <p className="text-sm text-[#547C90] mt-1">
          {loading
            ? "Searching..."
            : `${teachers.length} teacher${teachers.length !== 1 ? "s" : ""} found`}
        </p>
      </div>

      {/* Search + Filters */}
      <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
        {/* Search bar */}
        <div className="relative mb-4">
          <Icon
            icon="mdi:magnify"
            width={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search by name, subject, or bio…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-[#F9FBFC] py-2.5 pl-10 pr-4 text-sm text-gray-700 outline-none focus:border-[#2F556B] focus:ring-2 focus:ring-[#2F556B]/10 transition"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <Icon icon="mdi:close" width={16} />
            </button>
          )}
        </div>

        {/* Filters row */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#547C90]">
              Subject
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-[#F9FBFC] py-2 px-3 text-sm text-gray-700 outline-none focus:border-[#2F556B] focus:ring-2 focus:ring-[#2F556B]/10 transition"
            >
              <option value="">All Subjects</option>
              {SUBJECTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#547C90]">
              Level
            </label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-[#F9FBFC] py-2 px-3 text-sm text-gray-700 outline-none focus:border-[#2F556B] focus:ring-2 focus:ring-[#2F556B]/10 transition"
            >
              <option value="">All Levels</option>
              {LEVELS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[#547C90]">
              Max Price / Hour (DA)
            </label>
            <input
              type="number"
              placeholder="e.g. 2000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-[#F9FBFC] py-2 px-3 text-sm text-gray-700 outline-none focus:border-[#2F556B] focus:ring-2 focus:ring-[#2F556B]/10 transition"
            />
          </div>
        </div>

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="mt-3 flex items-center gap-1 text-xs text-[#2F556B] hover:underline"
          >
            <Icon icon="mdi:filter-remove-outline" width={14} />
            Clear all filters
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
          <Icon icon="mdi:alert-circle-outline" width={18} />
          {error}
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : teachers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-sm">
            <Icon
              icon="mdi:account-search-outline"
              width={40}
              color="#A8C8D8"
            />
          </div>
          <h3 className="text-lg font-semibold text-[#1F3745]">
            No teachers found
          </h3>
          <p className="mt-1 text-sm text-gray-400">
            Try adjusting your filters or search terms
          </p>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="mt-4 rounded-xl bg-[#2F556B] px-5 py-2 text-sm font-semibold text-white hover:bg-[#1F3745] transition"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {teachers.map((t) => (
            <TeacherCard key={t._id} teacher={t} />
          ))}
        </div>
      )}
    </div>
  );
}
