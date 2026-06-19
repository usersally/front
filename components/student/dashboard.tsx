"use client";

import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { api, getErrorMessage } from "@/lib/api"; // adjust path

// ─────────────────────────────────────────────
//  TYPES
// ─────────────────────────────────────────────
interface OverviewCard {
  label: string;
  value: string | number;
  icon: string;
  accent?: string;
}
interface TopTeacher {
  name: string;
  sessions: number;
  avgRating: number;
}
interface ExpenseProfit {
  month: string;
  expense: number;
  profit: number;
}
interface PieSlice {
  name: string;
  value: number;
}
interface DashboardData {
  overview: OverviewCard[];
  totalStudents: number;
  pieData: PieSlice[];
  expenseProfit: ExpenseProfit[];
  topTeachers: TopTeacher[];
}

// ─────────────────────────────────────────────
//  HOOK
// ─────────────────────────────────────────────
function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const { data: res } = await api.get<{
          success: boolean;
          data: DashboardData;
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
//  COLOURS
// ─────────────────────────────────────────────
const PALETTE = {
  primary: "#2F556B",
  pieCompleted: "#2F556B",
  pieUpcoming: "#A8C8D8",
  expense: "#F4A07A",
  profit: "#7ABFA8",
};

function fmt(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(0) + "K";
  return String(n);
}

function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-xl bg-gray-200 ${className}`} />
  );
}

function OverviewCard({ card }: { card: OverviewCard }) {
  return (
    <div
      className="flex items-center gap-4 rounded-2xl border border-gray-100 p-5 shadow-sm"
      style={{ background: card.accent ?? "#F0F7FA" }}
    >
      <div
        className="flex h-12 w-12 items-center justify-center rounded-xl"
        style={{ background: card.accent ? "#F9D9CC" : "#D4EAF3" }}
      >
        <Icon
          icon={card.icon}
          width={26}
          style={{ color: card.accent ? "#C0552A" : PALETTE.primary }}
        />
      </div>
      <div>
        <p className="text-2xl font-bold text-[#1F3745]">{card.value}</p>
        <p className="text-sm text-gray-500">{card.label}</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  PAGE
// ─────────────────────────────────────────────
export default function DashboardPage() {
  const { data, loading, error } = useDashboard();

  return (
    <div className="min-h-screen bg-[#EBF3F8] p-6">
      <h2 className="mb-6 text-3xl font-bold text-[#1F3745]">
        Welcome back! 👋
      </h2>

      {/* Error banner */}
      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
          <Icon icon="mdi:alert-circle-outline" width={18} />
          {error}
        </div>
      )}

      {/* ROW 1 — Overview */}
      <section className="mb-6">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#547C90]">
          Overview
        </h3>
        {loading ? (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {data?.overview.map((card, i) => (
              <OverviewCard key={i} card={card} />
            ))}
          </div>
        )}
      </section>

      {/* ROW 2 — Students · Pie · Top Teachers */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Total Students */}
        <div className="flex flex-col justify-center rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="font-semibold text-[#1F3745]">No of Users</h4>
            <Icon icon="mdi:dots-horizontal" className="text-gray-400" />
          </div>
          {loading ? (
            <Skeleton className="h-16" />
          ) : (
            <>
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-[#EBF3F8]">
                <Icon
                  icon="mdi:account-group"
                  width={32}
                  color={PALETTE.primary}
                />
              </div>
              <p className="text-3xl font-bold text-[#1F3745]">
                {fmt(data?.totalStudents ?? 0)}
              </p>
              <p className="text-sm text-gray-500">Total Students</p>
            </>
          )}
        </div>

        {/* Pie — booking breakdown */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h4 className="mb-2 font-semibold text-[#1F3745]">
            Booking Breakdown
          </h4>
          {loading ? (
            <Skeleton className="mx-auto h-40 w-40 rounded-full" />
          ) : (
            <div className="flex items-center justify-center gap-6">
              <PieChart width={160} height={160}>
                <Pie
                  data={data?.pieData}
                  cx={75}
                  cy={75}
                  innerRadius={45}
                  outerRadius={75}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  stroke="none"
                >
                  <Cell fill={PALETTE.pieCompleted} />
                  <Cell fill={PALETTE.pieUpcoming} />
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} />
              </PieChart>
              <div className="space-y-3 text-sm">
                {data?.pieData.map((slice, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-sm"
                      style={{
                        background:
                          i === 0 ? PALETTE.pieCompleted : PALETTE.pieUpcoming,
                      }}
                    />
                    <span className="text-gray-600">
                      {slice.name} ({slice.value}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Top Teachers — real ratings */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h4 className="mb-4 font-semibold text-[#1F3745]">
            Top Teachers by Rating
          </h4>
          {loading ? (
            <div className="space-y-2">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-5" />
              ))}
            </div>
          ) : data?.topTeachers.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">
              No teachers yet
            </p>
          ) : (
            <div className="space-y-3">
              {data?.topTeachers.map((t, i) => {
                const max = data.topTeachers[0]?.sessions || 1;
                const pct = Math.round((t.sessions / max) * 100);
                return (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <span className="w-5 text-center font-bold text-[#547C90]">
                      {i + 1}
                    </span>
                    <span className="w-24 truncate text-gray-600">
                      {t.name}
                    </span>
                    <div className="flex-1 overflow-hidden rounded-full bg-[#EBF3F8]">
                      <div
                        className="h-2.5 rounded-full transition-all duration-700"
                        style={{
                          width: `${pct}%`,
                          background: PALETTE.primary,
                        }}
                      />
                    </div>
                    <span className="w-12 text-right font-semibold text-[#1F3745]">
                      ★ {t.avgRating.toFixed(1)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ROW 3 — Revenue chart */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h4 className="font-semibold text-[#1F3745]">
            Revenue vs Platform Cost
          </h4>
          <span className="text-sm text-gray-400">Last 6 months</span>
        </div>
        {loading ? (
          <Skeleton className="h-56 w-full" />
        ) : data?.expenseProfit.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-56 text-gray-400">
            <Icon
              icon="mdi:chart-line"
              width={40}
              className="opacity-20 mb-2"
            />
            <p className="text-sm">No booking data yet</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart
              data={data?.expenseProfit}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="gradExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={PALETTE.expense}
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="95%"
                    stopColor={PALETTE.expense}
                    stopOpacity={0}
                  />
                </linearGradient>
                <linearGradient id="gradProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={PALETTE.profit}
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="95%"
                    stopColor={PALETTE.profit}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: "#9CA3AF" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#9CA3AF" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v / 1000}k`}
              />
              <Tooltip
                formatter={(value) =>
                  value == null
                    ? ""
                    : `${(
                        Number(Array.isArray(value) ? value[0] : value) / 1000
                      ).toFixed(1)}k DA`
                }
              />
              <Area
                type="monotone"
                dataKey="expense"
                stroke={PALETTE.expense}
                strokeWidth={2.5}
                fill="url(#gradExpense)"
                dot={false}
                activeDot={{ r: 5 }}
                name="Platform Cost"
              />
              <Area
                type="monotone"
                dataKey="profit"
                stroke={PALETTE.profit}
                strokeWidth={2.5}
                fill="url(#gradProfit)"
                dot={false}
                activeDot={{ r: 5 }}
                name="Revenue"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
        <div className="mt-4 flex gap-6 text-sm text-gray-500">
          <span className="flex items-center gap-2">
            <span
              className="h-2 w-4 rounded-full"
              style={{ background: PALETTE.expense }}
            />
            Platform Cost (est. 20%)
          </span>
          <span className="flex items-center gap-2">
            <span
              className="h-2 w-4 rounded-full"
              style={{ background: PALETTE.profit }}
            />
            Revenue
          </span>
        </div>
      </div>
    </div>
  );
}
