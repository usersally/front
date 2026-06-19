"use client";

import { Icon } from "@iconify/react";

export interface StatCardItem {
  label: string;
  value: number;
  icon: string;
  colour: string;
}

interface StatsCardsProps {
  stats: StatCardItem[];
  loading?: boolean;
}

function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl bg-[#D4E8F0] dark:bg-white/5 h-28" />
  );
}

export default function StatsCards({ stats, loading }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {loading
        ? [...Array(4)].map((_, i) => <CardSkeleton key={i} />)
        : stats.map((s, i) => (
            <div
              key={i}
              className="bg-white dark:bg-[#16242C] rounded-2xl p-5 shadow-sm border border-[#D4E8F0] dark:border-[#23394A] flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: s.colour + "20" }}
                >
                  <Icon icon={s.icon} width={22} style={{ color: s.colour }} />
                </div>
                <Icon
                  icon="mdi:trending-up"
                  width={16}
                  className="text-[#7ABFA8]"
                />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-[#1F3745] dark:text-white">
                  {s.value}
                </p>
                <p className="text-xs text-[#547C90] dark:text-[#8AAFC0] mt-0.5">
                  {s.label}
                </p>
              </div>
            </div>
          ))}
    </div>
  );
}
