"use client";

import { useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import {
  AdminUser,
  deleteUser,
  getErrorMessage,
  getUsers,
  updateUserRole,
} from "@/lib/api";

// ─────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────
const ROLE_STYLES: Record<AdminUser["role"], string> = {
  student: "bg-[#7ABFA8]/15 text-[#2F8A6B]",
  teacher: "bg-[#F4A07A]/15 text-[#B85C2C]",
  admin: "bg-[#2F556B]/15 text-[#2F556B] dark:text-[#8AAFC0]",
};

function RoleBadge({ role }: { role: AdminUser["role"] }) {
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${ROLE_STYLES[role]}`}
    >
      {role}
    </span>
  );
}

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
export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [roleUpdatingId, setRoleUpdatingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    setError(null);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) =>
      `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(q),
    );
  }, [users, search]);

  async function handleRoleChange(user: AdminUser, role: AdminUser["role"]) {
    if (role === user.role) return;
    setRoleUpdatingId(user._id);
    setActionError(null);
    try {
      const updated = await updateUserRole(user._id, role);
      setUsers((prev) =>
        prev.map((u) =>
          u._id === user._id ? { ...u, role: updated.role } : u,
        ),
      );
    } catch (err) {
      setActionError(getErrorMessage(err));
    } finally {
      setRoleUpdatingId(null);
    }
  }

  async function handleDeleteConfirmed() {
    if (!userToDelete) return;
    setDeleting(true);
    setActionError(null);
    try {
      await deleteUser(userToDelete._id);
      setUsers((prev) => prev.filter((u) => u._id !== userToDelete._id));
      setUserToDelete(null);
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
            Users
          </h1>
          <p className="text-sm text-[#547C90] dark:text-[#8AAFC0] mt-1">
            Manage every account on the CourSally platform.
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
            placeholder="Search by name or email..."
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
                  Role
                </th>
                <th className="px-4 py-3 font-semibold text-[#547C90] dark:text-[#8AAFC0]">
                  Change Role
                </th>
                <th className="px-4 py-3 font-semibold text-[#547C90] dark:text-[#8AAFC0] text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => <RowSkeleton key={i} />)
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center">
                    <Icon
                      icon="mdi:account-search-outline"
                      width={36}
                      className="mx-auto mb-2 text-[#8AAFC0] opacity-50"
                    />
                    <p className="text-sm text-[#547C90] dark:text-[#8AAFC0]">
                      {search
                        ? "No users match your search."
                        : "No users found."}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr
                    key={u._id}
                    className="border-b border-[#EBF3F8] dark:border-[#23394A] last:border-0 hover:bg-[#EBF3F8]/50 dark:hover:bg-white/5 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-[#1F3745] dark:text-white whitespace-nowrap">
                      {u.firstName} {u.lastName}
                    </td>
                    <td className="px-4 py-3 text-[#547C90] dark:text-[#8AAFC0]">
                      {u.email}
                    </td>
                    <td className="px-4 py-3">
                      <RoleBadge role={u.role} />
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={u.role}
                        disabled={roleUpdatingId === u._id}
                        onChange={(e) =>
                          handleRoleChange(
                            u,
                            e.target.value as AdminUser["role"],
                          )
                        }
                        className="text-xs font-medium rounded-lg border border-[#D4E8F0] dark:border-[#23394A] bg-white dark:bg-[#1A2C36] text-[#1F3745] dark:text-white px-2 py-1.5 outline-none focus:border-[#2F556B] disabled:opacity-50 cursor-pointer"
                      >
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setUserToDelete(u)}
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
      {userToDelete && (
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
              Delete user?
            </h3>
            <p className="text-sm text-[#547C90] dark:text-[#8AAFC0] mb-6">
              This will permanently remove{" "}
              <span className="font-semibold text-[#1F3745] dark:text-white">
                {userToDelete.firstName} {userToDelete.lastName}
              </span>{" "}
              from the platform. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setUserToDelete(null)}
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
