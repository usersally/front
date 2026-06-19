"use client";

import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { api, getErrorMessage } from "@/lib/api";
import { useStudentTab } from "./Studenttabcontext";

// ─────────────────────────────────────────────
//  TYPES  (matches booking.ts model)
// ─────────────────────────────────────────────
type PaymentType = "single" | "monthly";
type PaymentMethod = "cash" | "card";
type BookingStatus = "upcoming" | "completed" | "cancelled";

interface BookingTeacher {
  _id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  subject: string[];
}

interface Booking {
  _id: string;
  teacher: BookingTeacher;
  date: string;
  startTime: string;
  endTime: string;
  price: number;
  paymentType: PaymentType;
  paymentMethod: PaymentMethod;
  status?: BookingStatus; // derived from date if not provided by API
  createdAt: string;
}

interface BookingsResponse {
  success: boolean;
  data: Booking[];
}

// ─────────────────────────────────────────────
//  HOOK
// ─────────────────────────────────────────────
function useBookings(filter: BookingStatus | "all") {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const params = filter !== "all" ? `?status=${filter}` : "";
        const { data: res } = await api.get<BookingsResponse>(
          `/booking${params}`,
        );
        setBookings(res.data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [filter]);

  return { bookings, loading, error };
}

// ─────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────
function deriveStatus(dateStr: string): BookingStatus {
  const bookingDate = new Date(dateStr);
  const now = new Date();
  if (bookingDate > now) return "upcoming";
  return "completed";
}

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(dateStr));
}

const STATUS_CONFIG: Record<
  BookingStatus,
  { label: string; bg: string; text: string; icon: string }
> = {
  upcoming: {
    label: "Upcoming",
    bg: "bg-sky-50",
    text: "text-sky-600",
    icon: "mdi:clock-outline",
  },
  completed: {
    label: "Completed",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    icon: "mdi:check-circle-outline",
  },
  cancelled: {
    label: "Cancelled",
    bg: "bg-red-50",
    text: "text-red-500",
    icon: "mdi:close-circle-outline",
  },
};

// ─────────────────────────────────────────────
//  COMPONENTS
// ─────────────────────────────────────────────
function StatusBadge({ status }: { status: BookingStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${cfg.bg} ${cfg.text}`}
    >
      <Icon icon={cfg.icon} width={12} />
      {cfg.label}
    </span>
  );
}

function BookingCard({
  booking,
  onCancel,
}: {
  booking: Booking;
  onCancel: (id: string) => void;
}) {
  const status = booking.status ?? deriveStatus(booking.date);

  return (
    <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
      {/* color strip */}
      <div
        className={`h-1 w-full ${
          status === "upcoming"
            ? "bg-sky-400"
            : status === "completed"
              ? "bg-emerald-400"
              : "bg-red-300"
        }`}
      />

      <div className="p-5">
        {/* Top row */}
        <div className="flex items-start justify-between mb-4 gap-2">
          <div className="flex items-center gap-3 min-w-0">
            {booking.teacher?.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={booking.teacher.avatar}
                alt={booking.teacher.firstName}
                className="h-12 w-12 rounded-xl object-cover shrink-0"
              />
            ) : (
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EBF3F8]">
                <Icon icon="mdi:account" width={24} color="#2F556B" />
              </div>
            )}
            <div className="min-w-0">
              <h3 className="font-bold text-[#1F3745] truncate">
                {booking.teacher
                  ? `${booking.teacher.firstName} ${booking.teacher.lastName}`
                  : "Teacher"}
              </h3>
              <div className="flex flex-wrap gap-1 mt-0.5">
                {booking.teacher?.subject?.slice(0, 2).map((s, i) => (
                  <span
                    key={i}
                    className="rounded-md bg-[#2F556B]/10 px-1.5 py-0.5 text-xs font-medium text-[#2F556B]"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <StatusBadge status={status} />
        </div>

        {/* Session details */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Icon
              icon="mdi:calendar"
              width={16}
              className="text-[#547C90] shrink-0"
            />
            <span>{formatDate(booking.date)}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Icon
              icon="mdi:clock-outline"
              width={16}
              className="text-[#547C90] shrink-0"
            />
            <span>
              {booking.startTime} – {booking.endTime}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Icon
              icon={
                booking.paymentMethod === "card"
                  ? "mdi:credit-card-outline"
                  : "mdi:cash"
              }
              width={16}
              className="text-[#547C90] shrink-0"
            />
            <span className="capitalize">{booking.paymentMethod}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Icon
              icon="mdi:tag-outline"
              width={16}
              className="text-[#547C90] shrink-0"
            />
            <span className="capitalize">
              {booking.paymentType === "single" ? "Single session" : "Monthly"}
            </span>
          </div>
        </div>

        {/* Price + Action */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <p className="text-lg font-bold text-[#1F3745]">
            {booking.price.toLocaleString()}
            <span className="text-xs font-normal text-gray-400 ml-1">DA</span>
          </p>

          <div className="flex gap-2">
            {status === "upcoming" && (
              <>
                <a
                  href={`/student/bookings/${booking._id}/reschedule`}
                  className="flex items-center gap-1 rounded-xl border border-[#2F556B] px-3 py-1.5 text-xs font-semibold text-[#2F556B] hover:bg-[#EBF3F8] transition"
                >
                  <Icon icon="mdi:calendar-edit" width={14} />
                  Reschedule
                </a>
                <button
                  onClick={() => onCancel(booking._id)}
                  className="flex items-center gap-1 rounded-xl border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50 transition"
                >
                  <Icon icon="mdi:close" width={14} />
                  Cancel
                </button>
              </>
            )}
            {status === "completed" && (
              <a
                href={`/student/teachers/${booking.teacher?._id}`}
                className="flex items-center gap-1 rounded-xl bg-[#2F556B] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#1F3745] transition"
              >
                <Icon icon="mdi:star-outline" width={14} />
                Rate Teacher
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl bg-white border border-gray-100 p-5 shadow-sm">
      <div className="flex gap-4 mb-4">
        <div className="h-12 w-12 rounded-xl bg-gray-200 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-36 rounded bg-gray-200" />
          <div className="h-3 w-20 rounded bg-gray-200" />
        </div>
        <div className="h-6 w-20 rounded-full bg-gray-200" />
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-4 rounded bg-gray-200" />
        ))}
      </div>
      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
        <div className="h-6 w-20 rounded bg-gray-200" />
        <div className="h-8 w-32 rounded-xl bg-gray-200" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  SUMMARY STATS
// ─────────────────────────────────────────────
function SummaryStats({ bookings }: { bookings: Booking[] }) {
  const upcoming = bookings.filter(
    (b) => (b.status ?? deriveStatus(b.date)) === "upcoming",
  ).length;
  const completed = bookings.filter(
    (b) => (b.status ?? deriveStatus(b.date)) === "completed",
  ).length;
  const total = bookings.reduce((sum, b) => sum + b.price, 0);

  const stats = [
    {
      label: "Upcoming",
      value: upcoming,
      icon: "mdi:clock-outline",
      color: "text-sky-600",
      bg: "bg-sky-50",
    },
    {
      label: "Completed",
      value: completed,
      icon: "mdi:check-circle-outline",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Total Sessions",
      value: bookings.length,
      icon: "mdi:calendar-multiple",
      color: "text-[#2F556B]",
      bg: "bg-[#EBF3F8]",
    },
    {
      label: "Total Spent",
      value: `${total.toLocaleString()} DA`,
      icon: "mdi:cash-multiple",
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 mb-6 lg:grid-cols-4">
      {stats.map((s, i) => (
        <div
          key={i}
          className={`flex items-center gap-3 rounded-2xl ${s.bg} px-4 py-4`}
        >
          <Icon icon={s.icon} width={22} className={s.color} />
          <div>
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
//  PAGE
// ─────────────────────────────────────────────
type FilterTab = "all" | BookingStatus;

const TABS: { label: string; value: FilterTab }[] = [
  { label: "All", value: "all" },
  { label: "Upcoming", value: "upcoming" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

export default function MyBookingsPage() {
  const { setActiveTab: setStudentTab } = useStudentTab();
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const { bookings, loading, error } = useBookings(activeTab);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const handleCancel = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    try {
      setCancellingId(id);
      await api.patch(`/booking/${id}/cancel`);
      // Reload would happen via the hook re-fetch; for now show alert
      window.location.reload();
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#EBF3F8] p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-[#1F3745]">My Bookings</h2>
        <p className="text-sm text-[#547C90] mt-1">
          Manage your tutoring sessions
        </p>
      </div>

      {/* Stats */}
      {!loading && !error && <SummaryStats bookings={bookings} />}

      {/* Tabs */}
      <div className="mb-6 flex gap-2 rounded-2xl bg-white p-1.5 shadow-sm border border-gray-100 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 ${
              activeTab === tab.value
                ? "bg-[#2F556B] text-white shadow-sm"
                : "text-gray-500 hover:text-[#2F556B] hover:bg-[#EBF3F8]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
          <Icon icon="mdi:alert-circle-outline" width={18} />
          {error}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-sm">
            <Icon
              icon="mdi:calendar-blank-outline"
              width={40}
              color="#A8C8D8"
            />
          </div>
          <h3 className="text-lg font-semibold text-[#1F3745]">
            No bookings found
          </h3>
          <p className="mt-1 text-sm text-gray-400">
            {activeTab === "all"
              ? "You haven't booked any sessions yet."
              : `No ${activeTab} bookings.`}
          </p>
          <button
            type="button"
            onClick={() => setStudentTab("findTeacher")}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#2F556B] px-5 py-2 text-sm font-semibold text-white hover:bg-[#1F3745] transition"
          >
            <Icon icon="mdi:magnify" width={16} />
            Find a Teacher
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {bookings.map((booking) => (
            <BookingCard
              key={booking._id}
              booking={booking}
              onCancel={handleCancel}
            />
          ))}
        </div>
      )}

      {cancellingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="rounded-2xl bg-white p-6 shadow-xl flex items-center gap-3">
            <Icon
              icon="mdi:loading"
              width={24}
              className="animate-spin text-[#2F556B]"
            />
            <span className="font-semibold text-[#1F3745]">
              Cancelling booking…
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
