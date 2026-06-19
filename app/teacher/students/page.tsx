/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { api, getErrorMessage } from "@/lib/api";

interface Student {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  courseTitle?: string;
  bookingDate?: string;
  status?: string;
}

function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-xl bg-[#D4E8F0] ${className}`} />
  );
}

function initials(first: string, last: string) {
  return `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase();
}

const STATUS_STYLE: Record<string, { bg: string; text: string }> = {
  confirmed: { bg: "#D1FAE5", text: "#065F46" },
  pending: { bg: "#FEF3C7", text: "#92400E" },
  cancelled: { bg: "#FCE7F3", text: "#9D174D" },
  completed: { bg: "#E0F2FE", text: "#0369A1" },
};

export default function TeacherStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      try {
        // GET /booking?teacherId=me  — returns bookings with student populated
        const { data: res } = await api.get<{ success: boolean; data: any[] }>(
          "/booking",
        );
        setStudents(res.data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = students.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.firstName?.toLowerCase().includes(q) ||
      s.lastName?.toLowerCase().includes(q) ||
      s.email?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-6 min-h-screen bg-[#EBF3F8]">
      {/* Header */}
      <div className="flex items-end justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1F3745] tracking-tight">
            My Students
          </h1>
          <p className="text-sm text-[#547C90] mt-1">
            {loading
              ? "Loading…"
              : `${students.length} student${students.length !== 1 ? "s" : ""} enrolled`}
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Icon
            icon="mdi:magnify"
            width={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#547C90]"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search students…"
            className="pl-9 pr-4 py-2.5 rounded-xl border border-[#D4E8F0] bg-white
              text-sm text-[#1F3745] focus:outline-none focus:ring-2 focus:ring-[#2F556B]/20 w-56"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
          <Icon icon="mdi:alert-circle-outline" width={18} /> {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#D4E8F0] shadow-sm overflow-hidden">
        {/* Table header */}
        <div
          className="grid grid-cols-[auto_1fr_1fr_1fr_1fr] gap-4 px-6 py-3
          bg-[#F7FBFD] border-b border-[#EBF3F8] text-xs font-semibold
          uppercase tracking-wider text-[#547C90]"
        >
          <span>Avatar</span>
          <span>Name</span>
          <span>Email</span>
          <span>Course</span>
          <span>Status</span>
        </div>

        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-12" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-[#547C90]">
            <Icon
              icon="mdi:account-search-outline"
              width={48}
              className="opacity-25"
            />
            <p className="text-base font-semibold opacity-50">
              {search ? "No students match your search" : "No students yet"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#EBF3F8]">
            {filtered.map((s) => {
              const statusStyle =
                STATUS_STYLE[s.status ?? "pending"] ?? STATUS_STYLE.pending;
              return (
                <div
                  key={s._id}
                  className="grid grid-cols-[auto_1fr_1fr_1fr_1fr] gap-4 px-6 py-4
                    items-center hover:bg-[#F7FBFD] transition-colors duration-150"
                >
                  {/* Avatar */}
                  <div
                    className="w-9 h-9 rounded-full bg-[#2F556B] text-white
                    flex items-center justify-center text-xs font-bold border-2 border-[#547C90]"
                  >
                    {initials(s.firstName, s.lastName)}
                  </div>
                  {/* Name */}
                  <span className="text-sm font-semibold text-[#1F3745]">
                    {s.firstName} {s.lastName}
                  </span>
                  {/* Email */}
                  <span className="text-sm text-[#547C90] truncate">
                    {s.email}
                  </span>
                  {/* Course */}
                  <span className="text-sm text-[#547C90] truncate">
                    {s.courseTitle ?? "—"}
                  </span>
                  {/* Status */}
                  <span
                    className="inline-flex items-center w-fit text-[11px] font-bold
                    px-2.5 py-1 rounded-full"
                    style={{
                      background: statusStyle.bg,
                      color: statusStyle.text,
                    }}
                  >
                    {s.status ?? "pending"}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
