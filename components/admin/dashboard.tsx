"use client";

import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import {
  AdminStats,
  AuthUser,
  getAdminStats,
  getErrorMessage,
  getUser,
} from "@/lib/api";
import StatsCards, { StatCardItem } from "./statsCards";

// ─────────────────────────────────────────────
//  HOOK
// ─────────────────────────────────────────────
function useAdminStats() {
  const [data, setData] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const stats = await getAdminStats();
        setData(stats);
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
const STAT_COLOURS = ["#2F556B", "#7ABFA8", "#F4A07A", "#A8C8D8"];

const quickLinks = [
  {
    label: "Manage Users",
    href: "/admin/users",
    icon: "mdi:account-multiple-outline",
    colour: STAT_COLOURS[0],
  },
  {
    label: "Manage Students",
    href: "/admin/students",
    icon: "mdi:school-outline",
    colour: STAT_COLOURS[1],
  },
  {
    label: "Manage Teachers",
    href: "/admin/teachers",
    icon: "mdi:account-tie-outline",
    colour: STAT_COLOURS[2],
  },
  {
    label: "Manage Courses",
    href: "/admin/courses",
    icon: "mdi:book-open-variant",
    colour: STAT_COLOURS[3],
  },
];

// ─────────────────────────────────────────────
//  PAGE
// ─────────────────────────────────────────────
export default function AdminDashboardPage() {
  const { data, loading, error } = useAdminStats();
  const [admin, setAdmin] = useState<AuthUser | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAdmin(getUser());
  }, []);

  const stats: StatCardItem[] = data
    ? [
        {
          label: "Total Users",
          value: data.totalUsers,
          icon: "mdi:account-multiple-outline",
          colour: STAT_COLOURS[0],
        },
        {
          label: "Total Students",
          value: data.totalStudents,
          icon: "mdi:school-outline",
          colour: STAT_COLOURS[1],
        },
        {
          label: "Total Teachers",
          value: data.totalTeachers,
          icon: "mdi:account-tie-outline",
          colour: STAT_COLOURS[2],
        },
        {
          label: "Total Courses",
          value: data.totalCourses,
          icon: "mdi:book-open-variant",
          colour: STAT_COLOURS[3],
        },
      ]
    : [];

  return (
    <div className="min-h-full">
      {/* ── Header ── */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#1F3745] dark:text-white tracking-tight">
          Welcome back, {admin?.firstName ?? "Admin"} 👋
        </h1>
        <p className="text-sm text-[#547C90] dark:text-[#8AAFC0] mt-1">
          Here is an overview of the CourSally platform.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 px-4 py-3 text-sm text-red-600 dark:text-red-400">
          <Icon icon="mdi:alert-circle-outline" width={18} />
          {error}
        </div>
      )}

      {/* ── Stat cards ── */}
      <div className="mb-8">
        <StatsCards stats={stats} loading={loading} />
      </div>

      {/* ── Quick actions ── */}
      <div className="bg-white dark:bg-[#16242C] rounded-2xl p-6 shadow-sm border border-[#D4E8F0] dark:border-[#23394A]">
        <h4 className="font-semibold text-[#1F3745] dark:text-white mb-4">
          Quick Actions
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map((q) => (
            <Link
              key={q.href}
              href={q.href}
              className="flex items-center gap-3 p-4 rounded-xl border border-[#D4E8F0] dark:border-[#23394A] hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: q.colour + "20" }}
              >
                <Icon icon={q.icon} width={20} style={{ color: q.colour }} />
              </div>
              <span className="text-sm font-medium text-[#1F3745] dark:text-white">
                {q.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
