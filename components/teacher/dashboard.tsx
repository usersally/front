"use client";

import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { api, getErrorMessage, getUser } from "@/lib/api";

// ─────────────────────────────────────────────
//  TYPES
// ─────────────────────────────────────────────
interface TeacherDashboardData {
  totalCourses: number;
  totalStudents: number;
  totalBookings: number;
  pendingBookings: number;
  avgRating: number;
  ratingCount: number;
  revenueByMonth: { month: string; revenue: number }[];
  courseStats: { title: string; students: number; status: string }[];
}

// ─────────────────────────────────────────────
//  HOOK
// ─────────────────────────────────────────────
function useTeacherDashboard() {
  const [data, setData] = useState<TeacherDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const { data: res } = await api.get<{
          success: boolean;
          data: TeacherDashboardData;
        }>("/dashboard");
        setData(res.data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return { data, loading, error };
}

// ─────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────
function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-xl bg-[#D4E8F0] ${className}`} />
  );
}

const STAT_COLOURS = ["#2F556B", "#7ABFA8", "#F4A07A", "#A8C8D8"];

// ─────────────────────────────────────────────
//  PAGE
// ─────────────────────────────────────────────
export default function TeacherDashboardPage() {
  const { data, loading, error } = useTeacherDashboard();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(getUser());
  }, []);

  const stats = data
    ? [
        {
          label: "My Courses",
          value: data.totalCourses,
          icon: "mdi:book-open-variant",
          colour: STAT_COLOURS[0],
        },
        {
          label: "My Students",
          value: data.totalStudents,
          icon: "mdi:account-group-outline",
          colour: STAT_COLOURS[1],
        },
        {
          label: "Total Bookings",
          value: data.totalBookings,
          icon: "mdi:calendar-check-outline",
          colour: STAT_COLOURS[2],
        },
        {
          label: "Pending",
          value: data.pendingBookings,
          icon: "mdi:clock-outline",
          colour: STAT_COLOURS[3],
        },
      ]
    : [];

  return (
    <div className="p-6 min-h-screen bg-[#EBF3F8]">
      {/* ── Header ── */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#1F3745] tracking-tight">
          Welcome back, {user?.firstName ?? "Teacher"} 👋
        </h1>
        <p className="text-sm text-[#547C90] mt-1">
          Here is what is happening with your courses today.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
          <Icon icon="mdi:alert-circle-outline" width={18} />
          {error}
        </div>
      )}

      {/* ── ROW 1: Stat cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {loading
          ? [...Array(4)].map((_, i) => <Skeleton key={i} className="h-28" />)
          : stats.map((s, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-5 shadow-sm border border-[#D4E8F0] flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: s.colour + "20" }}
                  >
                    <Icon
                      icon={s.icon}
                      width={22}
                      style={{ color: s.colour }}
                    />
                  </div>
                  <Icon
                    icon="mdi:trending-up"
                    width={16}
                    className="text-[#7ABFA8]"
                  />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-[#1F3745]">
                    {s.value}
                  </p>
                  <p className="text-xs text-[#547C90] mt-0.5">{s.label}</p>
                </div>
              </div>
            ))}
      </div>

      {/* ── ROW 2: Rating card + Revenue chart ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Rating */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#D4E8F0] flex flex-col gap-4">
          <h4 className="font-semibold text-[#1F3745]">Your Rating</h4>
          {loading ? (
            <Skeleton className="h-24" />
          ) : (
            <div className="flex flex-col items-center justify-center flex-1 gap-2 py-4">
              <p className="text-5xl font-extrabold text-[#1F3745]">
                {data?.avgRating?.toFixed(1) ?? "—"}
              </p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Icon
                    key={s}
                    icon={
                      s <= Math.round(data?.avgRating ?? 0)
                        ? "mdi:star"
                        : "mdi:star-outline"
                    }
                    width={20}
                    className="text-amber-400"
                  />
                ))}
              </div>
              <p className="text-xs text-[#547C90]">
                {data?.ratingCount ?? 0} reviews
              </p>
            </div>
          )}
        </div>

        {/* Revenue chart — spans 2 cols */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-[#D4E8F0]">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-[#1F3745]">Monthly Revenue</h4>
            <span className="text-xs text-[#547C90]">Last 6 months</span>
          </div>
          {loading ? (
            <Skeleton className="h-44" />
          ) : (data?.revenueByMonth?.length ?? 0) === 0 ? (
            <div className="flex flex-col items-center justify-center h-44 text-[#547C90]">
              <Icon
                icon="mdi:chart-line"
                width={40}
                className="opacity-20 mb-2"
              />
              <p className="text-sm opacity-50">No revenue data yet</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart
                data={data!.revenueByMonth}
                margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2F556B" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#2F556B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F4F8" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: "#9CA3AF" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#9CA3AF" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${v / 1000}k`}
                />
                <Tooltip
                  formatter={(value) =>
                    typeof value === "number"
                      ? `${value.toLocaleString()} DA`
                      : ""
                  }
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2F556B"
                  strokeWidth={2.5}
                  fill="url(#revGrad)"
                  dot={false}
                  activeDot={{ r: 5 }}
                  name="Revenue"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* ── ROW 3: Course stats bar chart ── */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#D4E8F0]">
        <h4 className="font-semibold text-[#1F3745] mb-4">
          Students per Course
        </h4>
        {loading ? (
          <Skeleton className="h-48" />
        ) : (data?.courseStats?.length ?? 0) === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-[#547C90]">
            <Icon
              icon="mdi:book-search-outline"
              width={40}
              className="opacity-20 mb-2"
            />
            <p className="text-sm opacity-50">No courses yet</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={data!.courseStats}
              margin={{ top: 5, right: 10, left: 0, bottom: 40 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#F0F4F8"
                vertical={false}
              />
              <XAxis
                dataKey="title"
                tick={{ fontSize: 10, fill: "#9CA3AF" }}
                axisLine={false}
                tickLine={false}
                angle={-25}
                textAnchor="end"
                interval={0}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#9CA3AF" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip />
              <Bar dataKey="students" name="Students" radius={[6, 6, 0, 0]}>
                {data!.courseStats.map((_, i) => (
                  <Cell key={i} fill={i % 2 === 0 ? "#2F556B" : "#7ABFA8"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
