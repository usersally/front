"use client";

import { useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import { AdminUser, deleteUser, getErrorMessage, getUsers } from "@/lib/api";

// ─────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────
function RowSkeleton() {
  return (
    <tr>
      <td colSpan={4} className="px-4 py-3">
        <div className="animate-pulse h-10 rounded-xl bg-[#D4E8F0] dark:bg-white/5" />
      </td>
    </tr>
  );
}

// ─────────────────────────────────────────────
//  PAGE
// ─────────────────────────────────────────────
export default function AdminTeachersPage() {
  const [teachers, setTeachers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const [selected, setSelected] = useState<AdminUser | null>(null);
  const [toDelete, setToDelete] = useState<AdminUser | null>(null);
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
      const data = await getUsers();
      setTeachers(data.filter((u) => u.role === "teacher"));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return teachers;
    return teachers.filter((t) =>
      `${t.firstName} ${t.lastName} ${t.email}`.toLowerCase().includes(q),
    );
  }, [teachers, search]);

  async function handleDeleteConfirmed() {
    if (!toDelete) return;
    setDeleting(true);
    setActionError(null);
    try {
      await deleteUser(toDelete._id);
      setTeachers((prev) => prev.filter((t) => t._id !== toDelete._id));
      if (selected?._id === toDelete._id) setSelected(null);
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
            Teachers
          </h1>
          <p className="text-sm text-[#547C90] dark:text-[#8AAFC0] mt-1">
            {loading
              ? "Loading teachers..."
              : `${teachers.length} teacher${teachers.length === 1 ? "" : "s"} on CourSally.`}
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
            placeholder="Search teachers..."
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
                  Name
                </th>
                <th className="px-4 py-3 font-semibold text-[#547C90] dark:text-[#8AAFC0]">
                  Email
                </th>
                <th className="px-4 py-3 font-semibold text-[#547C90] dark:text-[#8AAFC0]">
                  CV
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
                  <td colSpan={4} className="px-4 py-12 text-center">
                    <Icon
                      icon="mdi:account-tie-outline"
                      width={36}
                      className="mx-auto mb-2 text-[#8AAFC0] opacity-50"
                    />
                    <p className="text-sm text-[#547C90] dark:text-[#8AAFC0]">
                      {search
                        ? "No teachers match your search."
                        : "No teachers yet."}
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((t) => (
                  <tr
                    key={t._id}
                    className="border-b border-[#EBF3F8] dark:border-[#23394A] last:border-0 hover:bg-[#EBF3F8]/50 dark:hover:bg-white/5 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-[#1F3745] dark:text-white whitespace-nowrap">
                      {t.firstName} {t.lastName}
                    </td>
                    <td className="px-4 py-3 text-[#547C90] dark:text-[#8AAFC0]">
                      {t.email}
                    </td>
                    <td className="px-4 py-3">
                      {t.CV ? (
                        <a
                          href={t.CV}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[#2F556B] dark:text-[#8AAFC0] hover:underline text-xs font-medium"
                        >
                          <Icon icon="mdi:file-pdf-box" width="16" />
                          View CV
                        </a>
                      ) : (
                        <span className="text-xs text-[#8AAFC0]">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => setSelected(t)}
                        className="inline-flex items-center gap-1.5 text-[#2F556B] dark:text-[#8AAFC0] hover:text-[#1F3745] dark:hover:text-white text-xs font-semibold hover:bg-[#EBF3F8] dark:hover:bg-white/5 px-3 py-1.5 rounded-lg transition-colors mr-1 cursor-pointer"
                      >
                        <Icon icon="mdi:eye-outline" width="16" />
                        View
                      </button>
                      <button
                        onClick={() => setToDelete(t)}
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

      {/* ── Details modal ── */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#16242C] rounded-2xl shadow-xl border border-[#D4E8F0] dark:border-[#23394A] w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-[#1F3745] dark:text-white">
                Teacher Details
              </h3>
              <button
                onClick={() => setSelected(null)}
                className="p-1.5 rounded-lg hover:bg-[#EBF3F8] dark:hover:bg-white/5 cursor-pointer"
                aria-label="Close"
              >
                <Icon
                  icon="mdi:close"
                  width="20"
                  className="text-[#547C90] dark:text-[#8AAFC0]"
                />
              </button>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-full bg-[#F4A07A]/20 flex items-center justify-center text-[#B85C2C] text-xl font-bold shrink-0">
                {selected.firstName[0]?.toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-[#1F3745] dark:text-white">
                  {selected.firstName} {selected.lastName}
                </p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-[#F4A07A]/15 text-[#B85C2C] capitalize">
                  {selected.role}
                </span>
              </div>
            </div>

            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-[#547C90] dark:text-[#8AAFC0]">Email</dt>
                <dd className="text-[#1F3745] dark:text-white font-medium text-right break-all">
                  {selected.email}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#547C90] dark:text-[#8AAFC0]">Phone</dt>
                <dd className="text-[#1F3745] dark:text-white font-medium">
                  {selected.phoneNumber ?? "—"}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#547C90] dark:text-[#8AAFC0]">Joined</dt>
                <dd className="text-[#1F3745] dark:text-white font-medium">
                  {selected.createdAt
                    ? new Date(selected.createdAt).toLocaleDateString()
                    : "—"}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#547C90] dark:text-[#8AAFC0]">CV</dt>
                <dd className="text-right">
                  {selected.CV ? (
                    <a
                      href={selected.CV}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[#2F556B] dark:text-[#8AAFC0] hover:underline font-medium"
                    >
                      <Icon icon="mdi:file-pdf-box" width="16" />
                      Open
                    </a>
                  ) : (
                    <span className="text-[#1F3745] dark:text-white font-medium">
                      —
                    </span>
                  )}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#547C90] dark:text-[#8AAFC0]">User ID</dt>
                <dd className="text-[#1F3745] dark:text-white font-mono text-xs break-all text-right">
                  {selected._id}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      )}

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
              Delete teacher?
            </h3>
            <p className="text-sm text-[#547C90] dark:text-[#8AAFC0] mb-6">
              This will permanently remove{" "}
              <span className="font-semibold text-[#1F3745] dark:text-white">
                {toDelete.firstName} {toDelete.lastName}
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
