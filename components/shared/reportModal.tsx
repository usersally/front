"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { api, getErrorMessage } from "@/lib/api";

const REASONS = [
  { value: "harassment", label: "Harassment" },
  { value: "inappropriate_content", label: "Inappropriate content" },
  { value: "no_show", label: "No-show / missed session" },
  { value: "fraud", label: "Fraud or scam" },
  { value: "spam", label: "Spam" },
  { value: "other", label: "Other" },
] as const;

interface ReportModalProps {
  reportedUserId: string;
  reportedName: string;
  onClose: () => void;
  onSubmitted?: () => void;
}

export default function ReportModal({
  reportedUserId,
  reportedName,
  onClose,
  onSubmitted,
}: ReportModalProps) {
  const [reason, setReason] =
    useState<(typeof REASONS)[number]["value"]>("other");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    try {
      await api.post("/reports", {
        reportedUserId,
        reason,
        details,
      });
      setSuccess(true);
      onSubmitted?.();
      setTimeout(onClose, 1500);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 bg-[#2F556B]">
          <div>
            <h3 className="font-bold text-white text-lg">Report User</h3>
            <p className="text-sm text-white/70">{reportedName}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/70 hover:text-white transition"
          >
            <Icon icon="mdi:close" width={22} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <div className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-600">
              Report submitted. An admin will review it.
            </div>
          )}

          <div>
            <label className="block mb-1 text-xs font-semibold uppercase tracking-wider text-[#547C90]">
              Reason
            </label>
            <select
              value={reason}
              onChange={(e) =>
                setReason(e.target.value as (typeof REASONS)[number]["value"])
              }
              className="w-full rounded-xl border border-gray-200 bg-[#F9FBFC] px-3 py-2.5 text-sm outline-none focus:border-[#2F556B]"
            >
              {REASONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 text-xs font-semibold uppercase tracking-wider text-[#547C90]">
              Details (optional)
            </label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={4}
              maxLength={1000}
              placeholder="Describe what happened…"
              className="w-full rounded-xl border border-gray-200 bg-[#F9FBFC] px-3 py-2.5 text-sm outline-none focus:border-[#2F556B] resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 px-6 pb-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || success}
            className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition disabled:opacity-60"
          >
            {loading ? "Submitting…" : "Submit Report"}
          </button>
        </div>
      </div>
    </div>
  );
}
