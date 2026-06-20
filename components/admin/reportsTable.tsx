"use client";

import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { api, getErrorMessage } from "@/lib/api";

interface ReportUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface Report {
  _id: string;
  reason: string;
  details: string;
  status: "pending" | "resolved" | "dismissed";
  adminNote?: string;
  createdAt: string;
  reporterId: ReportUser;
  reportedUserId: ReportUser;
}

const STATUS_STYLE = {
  pending: "bg-amber-50 text-amber-700",
  resolved: "bg-emerald-50 text-emerald-700",
  dismissed: "bg-gray-100 text-gray-600",
} as const;

const REASON_LABELS: Record<string, string> = {
  harassment: "Harassment",
  inappropriate_content: "Inappropriate content",
  no_show: "No-show",
  fraud: "Fraud",
  spam: "Spam",
  other: "Other",
};

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | Report["status"]>("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selected, setSelected] = useState<Report | null>(null);
  const [adminNote, setAdminNote] = useState("");

  async function load() {
    try {
      setLoading(true);
      const { data: res } = await api.get<{
        success: boolean;
        data: Report[];
      }>("/admin/reports");
      setReports(res.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleStatus(id: string, status: Report["status"]) {
    setActionLoading(`${id}-${status}`);
    try {
      await api.patch(`/admin/reports/${id}`, {
        status,
        adminNote,
      });
      await load();
      setSelected(null);
      setAdminNote("");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionLoading(null);
    }
  }

  const filtered =
    filter === "all" ? reports : reports.filter((r) => r.status === filter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F3745] dark:text-white tracking-tight">
          Reports
        </h1>
        <p className="text-sm text-[#547C90] dark:text-[#8AAFC0] mt-1">
          Review reports submitted by students and teachers
        </p>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {(["all", "pending", "resolved", "dismissed"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition cursor-pointer ${
              filter === f
                ? "bg-[#2F556B] text-white"
                : "bg-white dark:bg-[#16242C] text-[#547C90] border border-[#D4E8F0] dark:border-[#23394A]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-[#16242C] rounded-2xl border border-[#D4E8F0] dark:border-[#23394A] shadow-sm overflow-hidden">
        {loading ? (
          <p className="p-8 text-center text-sm text-[#547C90]">Loading…</p>
        ) : filtered.length === 0 ? (
          <p className="p-8 text-center text-sm text-[#8AAFC0]">
            No reports found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#EBF3F8] dark:border-[#23394A] text-left text-xs uppercase tracking-wider text-[#547C90]">
                  <th className="px-4 py-3">Reporter</th>
                  <th className="px-4 py-3">Reported</th>
                  <th className="px-4 py-3">Reason</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F7FBFD] dark:divide-[#23394A]">
                {filtered.map((r) => (
                  <tr key={r._id} className="hover:bg-[#F6FAFD] dark:hover:bg-white/5">
                    <td className="px-4 py-3 text-[#1F3745] dark:text-white">
                      {r.reporterId?.firstName} {r.reporterId?.lastName}
                      <span className="block text-xs text-[#8AAFC0] capitalize">
                        {r.reporterId?.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#1F3745] dark:text-white">
                      {r.reportedUserId?.firstName} {r.reportedUserId?.lastName}
                      <span className="block text-xs text-[#8AAFC0] capitalize">
                        {r.reportedUserId?.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#547C90]">
                      {REASON_LABELS[r.reason] ?? r.reason}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLE[r.status]}`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#547C90] whitespace-nowrap">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setSelected(r);
                          setAdminNote(r.adminNote ?? "");
                        }}
                        className="text-[#2F556B] dark:text-[#8AAFC0] hover:underline text-xs font-semibold cursor-pointer"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#16242C] rounded-2xl shadow-xl border border-[#D4E8F0] dark:border-[#23394A] w-full max-w-lg">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#D4E8F0] dark:border-[#23394A]">
              <h3 className="text-lg font-bold text-[#1F3745] dark:text-white">
                Report Details
              </h3>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="p-1.5 rounded-lg hover:bg-[#EBF3F8] dark:hover:bg-white/5 cursor-pointer"
              >
                <Icon icon="mdi:close" width="20" />
              </button>
            </div>
            <div className="p-5 space-y-4 text-sm">
              <p className="text-[#547C90]">
                <strong className="text-[#1F3745] dark:text-white">Reporter:</strong>{" "}
                {selected.reporterId?.firstName} {selected.reporterId?.lastName} (
                {selected.reporterId?.email})
              </p>
              <p className="text-[#547C90]">
                <strong className="text-[#1F3745] dark:text-white">Reported:</strong>{" "}
                {selected.reportedUserId?.firstName}{" "}
                {selected.reportedUserId?.lastName} (
                {selected.reportedUserId?.email})
              </p>
              <p className="text-[#547C90]">
                <strong className="text-[#1F3745] dark:text-white">Reason:</strong>{" "}
                {REASON_LABELS[selected.reason] ?? selected.reason}
              </p>
              {selected.details && (
                <p className="text-[#547C90] bg-[#F6FAFD] dark:bg-[#0F1A20] rounded-xl p-3">
                  {selected.details}
                </p>
              )}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#547C90] mb-1">
                  Admin note
                </label>
                <textarea
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-[#D4E8F0] dark:border-[#23394A] bg-white dark:bg-[#0F1A20] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#2F556B]/20"
                  placeholder="Optional note about your decision…"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleStatus(selected._id, "resolved")}
                  disabled={actionLoading !== null}
                  className="flex-1 rounded-xl bg-emerald-600 text-white py-2.5 text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50 cursor-pointer"
                >
                  Mark Resolved
                </button>
                <button
                  type="button"
                  onClick={() => handleStatus(selected._id, "dismissed")}
                  disabled={actionLoading !== null}
                  className="flex-1 rounded-xl bg-gray-500 text-white py-2.5 text-sm font-semibold hover:bg-gray-600 disabled:opacity-50 cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
