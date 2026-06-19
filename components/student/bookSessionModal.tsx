"use client";

import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { api, getErrorMessage, getUser } from "@/lib/api";

interface BookSessionModalProps {
  teacher: {
    _id: string;
    firstName: string;
    lastName: string;
    pricePerHour?: number;
    availability?: { day: string; startTime: string; endTime: string }[];
  };
  onClose: () => void;
  onBooked?: () => void;
}

export default function BookSessionModal({
  teacher,
  onClose,
  onBooked,
}: BookSessionModalProps) {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [paymentType, setPaymentType] = useState<"single" | "monthly">(
    "single",
  );
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card">("cash");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const firstSlot = teacher.availability?.[0];
    if (firstSlot) {
      setStartTime(firstSlot.startTime || "09:00");
      setEndTime(firstSlot.endTime || "10:00");
    }
  }, [teacher.availability]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleSubmit = async () => {
    const user = getUser();
    if (!user) {
      setError("Please log in to book a session.");
      return;
    }
    if (!date) {
      setError("Please select a date.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await api.post("/booking", {
        teacherId: teacher._id,
        date,
        startTime,
        endTime,
        price: teacher.pricePerHour ?? 0,
        paymentType,
        paymentMethod,
      });
      setSuccess(true);
      onBooked?.();
      setTimeout(onClose, 1500);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

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
            <h3 className="font-bold text-white text-lg">Book a Session</h3>
            <p className="text-sm text-white/70">
              with {teacher.firstName} {teacher.lastName}
            </p>
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
            <div className="flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
              <Icon icon="mdi:alert-circle-outline" width={16} />
              {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-600">
              <Icon icon="mdi:check-circle-outline" width={16} />
              Booking confirmed!
            </div>
          )}

          <div>
            <label className="block mb-1 text-xs font-semibold uppercase tracking-wider text-[#547C90]">
              Date
            </label>
            <input
              type="date"
              value={date}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-[#F9FBFC] px-3 py-2.5 text-sm outline-none focus:border-[#2F556B] focus:ring-2 focus:ring-[#2F556B]/10"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 text-xs font-semibold uppercase tracking-wider text-[#547C90]">
                Start
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-[#F9FBFC] px-3 py-2.5 text-sm outline-none focus:border-[#2F556B]"
              />
            </div>
            <div>
              <label className="block mb-1 text-xs font-semibold uppercase tracking-wider text-[#547C90]">
                End
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-[#F9FBFC] px-3 py-2.5 text-sm outline-none focus:border-[#2F556B]"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-xs font-semibold uppercase tracking-wider text-[#547C90]">
              Payment Type
            </label>
            <select
              value={paymentType}
              onChange={(e) =>
                setPaymentType(e.target.value as "single" | "monthly")
              }
              className="w-full rounded-xl border border-gray-200 bg-[#F9FBFC] px-3 py-2.5 text-sm outline-none focus:border-[#2F556B]"
            >
              <option value="single">Single Session</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-xs font-semibold uppercase tracking-wider text-[#547C90]">
              Payment Method
            </label>
            <select
              value={paymentMethod}
              onChange={(e) =>
                setPaymentMethod(e.target.value as "cash" | "card")
              }
              className="w-full rounded-xl border border-gray-200 bg-[#F9FBFC] px-3 py-2.5 text-sm outline-none focus:border-[#2F556B]"
            >
              <option value="cash">Cash</option>
              <option value="card">Card</option>
            </select>
          </div>

          {teacher.pricePerHour != null && (
            <p className="text-sm text-gray-500">
              Price:{" "}
              <span className="font-bold text-[#2F556B]">
                {teacher.pricePerHour.toLocaleString()} DA
              </span>
            </p>
          )}
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
            className="flex-1 rounded-xl bg-[#2F556B] py-2.5 text-sm font-semibold text-white hover:bg-[#1F3745] transition disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading && (
              <Icon icon="mdi:loading" width={16} className="animate-spin" />
            )}
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
}
