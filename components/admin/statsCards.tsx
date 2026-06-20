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

const CARD_STYLES = [
  {
    gradient: "linear-gradient(135deg, #1F3745 0%, #2F556B 55%, #547C90 100%)",
    shape: "rounded-[2rem] rounded-br-md",
    decor: "bg-[#7ABFA8]/30",
    decorPos: "top-0 right-0 w-24 h-24 rounded-full -translate-y-1/3 translate-x-1/4",
  },
  {
    gradient: "linear-gradient(135deg, #2D6A5A 0%, #7ABFA8 60%, #A8D8C8 100%)",
    shape: "rounded-[2rem] rounded-tl-md",
    decor: "bg-white/20",
    decorPos: "bottom-0 left-0 w-20 h-20 rounded-full translate-y-1/3 -translate-x-1/4",
  },
  {
    gradient: "linear-gradient(135deg, #B85C2C 0%, #F4A07A 55%, #FFD4BC 100%)",
    shape: "rounded-[2rem] rounded-tr-md",
    decor: "bg-[#1F3745]/10",
    decorPos: "top-1/2 right-2 w-16 h-16 rotate-45 rounded-xl",
  },
  {
    gradient: "linear-gradient(135deg, #3A6B8C 0%, #6BA3C4 50%, #A8C8D8 100%)",
    shape: "rounded-[2rem] rounded-bl-md",
    decor: "bg-white/25",
    decorPos: "top-3 left-3 w-14 h-14 rounded-full",
  },
];

function CardSkeleton({ style }: { style: (typeof CARD_STYLES)[number] }) {
  return (
    <div
      className={`animate-pulse h-36 ${style.shape}`}
      style={{ background: style.gradient, opacity: 0.45 }}
    />
  );
}

export default function StatsCards({ stats, loading }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {loading
        ? CARD_STYLES.map((style, i) => <CardSkeleton key={i} style={style} />)
        : stats.map((s, i) => {
            const style = CARD_STYLES[i % CARD_STYLES.length];
            return (
              <div
                key={s.label}
                className={`relative overflow-hidden p-5 text-white shadow-lg ${style.shape}`}
                style={{ background: style.gradient }}
              >
                <div
                  className={`absolute pointer-events-none ${style.decor} ${style.decorPos}`}
                />
                <div
                  className="absolute -bottom-6 -right-6 w-28 h-28 rounded-full border border-white/10"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                />

                <div className="relative z-10 flex flex-col gap-4 min-h-[7.5rem] justify-between">
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
                      <Icon icon={s.icon} width={22} className="text-white" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">
                      Live
                    </span>
                  </div>

                  <div>
                    <p className="text-4xl font-black tracking-tight leading-none">
                      {s.value.toLocaleString()}
                    </p>
                    <p className="text-sm font-medium text-white/85 mt-2">
                      {s.label}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
    </div>
  );
}
