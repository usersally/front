import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

/** Next calendar date (YYYY-MM-DD, local) for the given weekday name. */
export function nextDateForWeekday(dayName: string): string {
  const target = DAY_NAMES.indexOf(dayName as (typeof DAY_NAMES)[number]);
  if (target < 0) {
    return formatLocalDate(new Date());
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let diff = target - today.getDay();
  if (diff <= 0) diff += 7;
  const next = new Date(today);
  next.setDate(today.getDate() + diff);
  return formatLocalDate(next);
}

function formatLocalDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function normalizeTime(value: string): string {
  const parts = value.trim().split(":");
  const hours = parts[0]?.padStart(2, "0") ?? "00";
  const minutes = parts[1]?.padStart(2, "0") ?? "00";
  return `${hours}:${minutes}`;
}
