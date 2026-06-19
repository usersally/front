"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface StatProps {
  icon: string;
  iconBg: string;
  iconColor: string;
  target: number;
  suffix: string;
  sublabel: string;
  label: string;
  delay?: number;
}

function StatCard({
  icon,
  iconBg,
  iconColor,
  target,
  suffix,
  sublabel,
  label,
  delay = 0,
}: StatProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const duration = 1300;
        const startTime = performance.now() + delay;

        const tick = (now: number) => {
          const elapsed = Math.max(0, now - startTime);
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.round(eased * target));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.3 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, delay]);

  return (
    <div
      ref={ref}
      className="flex flex-col items-center gap-1.5 flex-1 min-w-[140px] rounded-2xl border border-white/15 bg-white/[0.07] px-8 py-6 hover:bg-white/[0.12] transition-colors"
    >
      <div
        className="flex items-center justify-center w-10 h-10 rounded-[10px] mb-1"
        style={{ background: iconBg }}
      >
        <i
          className={`ti ${icon} text-xl`}
          style={{ color: iconColor }}
          aria-hidden="true"
        />
      </div>
      <span className="text-[2.2rem] font-semibold text-white leading-none tracking-tight tabular-nums">
        {count}
        {suffix}
      </span>
      <span className="text-[0.6rem] uppercase tracking-widest text-white/35">
        {sublabel}
      </span>
      <span className="text-[0.75rem] uppercase tracking-widest text-white/50">
        {label}
      </span>
    </div>
  );
}

const STATS: StatProps[] = [
  {
    icon: "ti-users",
    iconBg: "rgba(84,124,144,0.25)",
    iconColor: "#7fbcd2",
    target: 500,
    suffix: "+",
    sublabel: "and counting",
    label: "Teachers",
    delay: 0,
  },
  {
    icon: "ti-book-2",
    iconBg: "rgba(29,158,117,0.2)",
    iconColor: "#5dcaa5",
    target: 30,
    suffix: "+",
    sublabel: "available now",
    label: "Subjects",
    delay: 180,
  },
  {
    icon: "ti-map-pin",
    iconBg: "rgba(186,117,23,0.2)",
    iconColor: "#efb84a",
    target: 15,
    suffix: "",
    sublabel: "across Algeria",
    label: "Cities",
    delay: 360,
  },
];

const TAGS = ["Math", "Physics", "Primary", "Alger"];

export default function HeroCards() {
  return (
    <section className="w-full h-screen relative overflow-hidden">
      {/* BACKGROUND IMAGE */}
      <Image
        src="/card3.jpg"
        alt="Book course"
        fill
        priority
        className="object-cover"
      />

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-linear-to-t from-[#1F3745]/90 via-[#1F3745]/60 to-[#1F3745]/30" />

      {/* CONTENT */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6 z-10">
        {/* EYEBROW */}
        <p className="text-xs uppercase tracking-[0.15em] text-white/40 mb-4">
          Algeria's #1 Learning Platform
        </p>

        {/* TITLE */}
        <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight max-w-2xl">
          Book Your Course Now
        </h1>

        {/* SUBTEXT */}
        <p className="text-sm md:text-base text-white/55 mb-7 max-w-md leading-relaxed">
          Stay updated with top teachers, announcements, and your learning
          journey.
        </p>

        {/* CTA */}
        <Link
          href="/auth/login"
          className="px-8 py-3 rounded-xl bg-[#547C90] hover:bg-[#3d6276] transition font-medium text-base mb-10"
        >
          Book Now
        </Link>

        {/* ========== STAT CARDS ========== */}
        <div className="flex gap-3 flex-wrap justify-center w-full max-width-[560px]">
          {STATS.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        {/* TAGS */}
        <div className="flex flex-wrap justify-center gap-2 mt-6">
          {TAGS.map((tag) => (
            <span
              key={tag}
              className="px-4 py-1.5 rounded-full border border-white/25 text-white/80 text-sm cursor-pointer hover:bg-white/15 hover:text-white transition"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
