"use client";

import { useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import {
  AdminCourse,
  deleteCourse,
  getAllCourses,
  getErrorMessage,
} from "@/lib/api";

// ─────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────
function RowSkeleton() {
  return (
    <tr>
      <td colSpan={5} className="px-4 py-3">
        <div className="animate-pulse h-10 rounded-xl bg-[#D4E8F0] dark:bg-white/5" />
      </td>
    </tr>
  );
}

// ─────────────────────────────────────────────
//  PAGE
// ─────────────────────────────────────────────
export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const [toDelete, setToDelete] = useState<AdminCourse | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    load();
  }, []);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllCourses();
      setCourses(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return courses;
    return courses.filter((c) =>
      `${c.title} ${c.teacher?.firstName ?? ""} ${c.teacher?.lastName ?? ""}`
        .toLowerCase()
        .includes(q),
    );
  }, [courses, search]);

  async function handleDeleteConfirmed() {
    if (!toDelete) return;
    setDeleting(true);
    setActionError(null);
    try {
      await deleteCourse(toDelete._id);
      setCourses((prev) => prev.filter((c) => c._id !== toDelete._id));
      setToDelete(null);
    } catch (err) {
      setActionError(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="min-h-full">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1F3745] dark:text-white tracking-tight">
            Courses
          </h1>
          <p className="text-sm text-[#547C90] dark:text-[#8AAFC0] mt-1">
            {loading
              ? "Loading courses..."
              : `${courses.length} course${courses.length === 1 ? "" : "s"} on the platform.`}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white dark:bg-[#16242C] px-4 py-2.5 rounded-full border border-[#D4E8F0] dark:border-[#23394A] w-full sm:w-72">
          <Icon
            icon="mdi:magnify"
            width="18"
            className="text-[#547C90] dark:text-[#8AAFC0]"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or teacher..."
            className="bg-transparent outline-none text-sm text-[#1F3745] dark:text-white placeholder:text-[#8AAFC0] w-full"
          />
        </div>
      </div>

      {/* Errors */}
      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 px-4 py-3 text-sm text-red-600 dark:text-red-400">
          <Icon icon="mdi:alert-circle-outline" width={18} />
          {error}
        </div>
      )}
      {actionError && (
        <div className="mb-6 flex items-center gap-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 px-4 py-3 text-sm text-red-600 dark:text-red-400">
          <Icon icon="mdi:alert-circle-outline" width={18} />
          {actionError}
        </div>
      )}

      {/* ── Table ── */}
      <div className="bg-white dark:bg-[#16242C] rounded-2xl shadow-sm border border-[#D4E8F0] dark:border-[#23394A] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#D4E8F0] dark:border-[#23394A] text-left">
                <th className="px-4 py-3 font-semibold text-[#547C90] dark:text-[#8AAFC0]">
                  Title
                </th>
                <th className="px-4 py-3 font-semibold text-[#547C90] dark:text-[#8AAFC0]">
                  Teacher
                </th>
                <th className="px-4 py-3 font-semibold text-[#547C90] dark:text-[#8AAFC0]">
                  Status
                </th>
                <th className="px-4 py-3 font-semibold text-[#547C90] dark:text-[#8AAFC0]">
                  Students
                </th>
                <th className="px-4 py-3 font-semibold text-[#547C90] dark:text-[#8AAFC0] text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => <RowSkeleton key={i} />)
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center">
                    <Icon
                      icon="mdi:book-search-outline"
                      width={36}
                      className="mx-auto mb-2 text-[#8AAFC0] opacity-50"
                    />
                    <p className="text-sm text-[#547C90] dark:text-[#8AAFC0]">
                      {search
                        ? "No courses match your search."
                        : "No courses yet."}
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr
                    key={c._id}
                    className="border-b border-[#EBF3F8] dark:border-[#23394A] last:border-0 hover:bg-[#EBF3F8]/50 dark:hover:bg-white/5 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-[#1F3745] dark:text-white whitespace-nowrap">
                      {c.title}
                    </td>
                    <td className="px-4 py-3 text-[#547C90] dark:text-[#8AAFC0]">
                      {c.teacher
                        ? `${c.teacher.firstName} ${c.teacher.lastName}`
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          c.published
                            ? "bg-[#7ABFA8]/15 text-[#2F8A6B]"
                            : "bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-300"
                        }`}
                      >
                        {c.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#547C90] dark:text-[#8AAFC0]">
                      {c.studentsCount ?? 0}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setToDelete(c)}
                        className="inline-flex items-center gap-1.5 text-red-500 hover:text-red-600 text-xs font-semibold hover:bg-red-50 dark:hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        <Icon icon="mdi:trash-can-outline" width="16" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Delete confirmation modal ── */}
      {toDelete && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#16242C] rounded-2xl shadow-xl border border-[#D4E8F0] dark:border-[#23394A] w-full max-w-sm p-6">
            <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center mb-4">
              <Icon
                icon="mdi:alert-outline"
                width="24"
                className="text-red-500"
              />
            </div>
            <h3 className="text-lg font-bold text-[#1F3745] dark:text-white mb-1">
              Delete course?
            </h3>
            <p className="text-sm text-[#547C90] dark:text-[#8AAFC0] mb-6">
              This will permanently remove{" "}
              <span className="font-semibold text-[#1F3745] dark:text-white">
                {toDelete.title}
              </span>{" "}
              from the platform. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setToDelete(null)}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 rounded-xl border border-[#D4E8F0] dark:border-[#23394A] text-[#1F3745] dark:text-white text-sm font-semibold hover:bg-[#EBF3F8] dark:hover:bg-white/5 transition-colors disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirmed}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {deleting && (
                  <Icon
                    icon="mdi:loading"
                    width="16"
                    className="animate-spin"
                  />
                )}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
