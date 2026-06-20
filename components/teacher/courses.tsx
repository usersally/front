"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { api, getErrorMessage } from "@/lib/api";

// ─────────────────────────────────────────────
//  TYPES
// ─────────────────────────────────────────────
interface Schedule {
  day: string;
  startTime: string;
  endTime: string;
}

interface Course {
  _id: string;
  title: string;
  description: string;
  price: number;
  level: string;
  grade?: string;
  subject?: string;
  image?: string | null;
  schedule: Schedule[];
  createdAt: string;
}

// ─────────────────────────────────────────────
//  CONSTANTS
// ─────────────────────────────────────────────
const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const DAY_LETTERS = ["M", "T", "W", "T", "F", "S", "S"];

/** Education levels replacing old Beginner/Intermediate/Advanced */
const LEVELS = ["Primary", "Secondary", "High School"] as const;
type Level = (typeof LEVELS)[number];

/** Grades per level */
const GRADES: Record<Level, string[]> = {
  Primary: ["Year 1", "Year 2", "Year 3", "Year 4", "Year 5"],
  Secondary: ["Year 1", "Year 2", "Year 3", "BE"],
  "High School": ["Year 1", "Year 2", "BAC"],
};

const SUBJECTS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "History",
  "Geography",
  "Literature",
  "Philosophy",
  "Computer Science",
  "Economics",
  "Languages",
  "Other",
];

const DEFAULT_LEVEL: Level = "Primary";
const EMPTY_FORM = {
  title: "",
  description: "",
  price: "",
  level: DEFAULT_LEVEL as string,
  grade: GRADES[DEFAULT_LEVEL][0],
  subject: "",
};

// ─────────────────────────────────────────────
//  HOOK — fetch teacher's OWN courses
//  Uses /teacher/courses so the teacher sees every
//  course they've created — all go live immediately.
// ─────────────────────────────────────────────
function useTeacherCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const { data: res } = await api.get<{
        success: boolean;
        data: Course[];
      }>("/teacher/courses");
      setCourses(res.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  return { courses, loading, error, reload: load };
}

// ─────────────────────────────────────────────
//  DISPLAY HELPERS
// ─────────────────────────────────────────────
const LEVEL_COLOUR: Record<string, string> = {
  Primary: "#D1FAE5",
  Secondary: "#FEF3C7",
  "High School": "#FCE7F3",
};

/** Subject → icon + soft palette. Each pairing is a Tailwind 100/600-ish duo
 *  so colour stays in the same pastel family as LEVEL_COLOUR. */
const SUBJECT_META: Record<string, { icon: string; bg: string; fg: string }> = {
  Mathematics: {
    icon: "mdi:calculator-variant-outline",
    bg: "#E0F2FE",
    fg: "#0369A1",
  },
  Physics: { icon: "mdi:atom-variant", bg: "#EDE9FE", fg: "#6D28D9" },
  Chemistry: { icon: "mdi:flask-outline", bg: "#FCE7F3", fg: "#BE185D" },
  Biology: { icon: "mdi:dna", bg: "#D1FAE5", fg: "#047857" },
  History: { icon: "mdi:bank-outline", bg: "#FEF3C7", fg: "#92400E" },
  Geography: { icon: "mdi:earth", bg: "#DBEAFE", fg: "#1D4ED8" },
  Literature: {
    icon: "mdi:book-open-page-variant-outline",
    bg: "#FFE4E6",
    fg: "#BE123C",
  },
  Philosophy: {
    icon: "mdi:lightbulb-on-outline",
    bg: "#FFF7ED",
    fg: "#C2410C",
  },
  "Computer Science": { icon: "mdi:laptop", bg: "#E0E7FF", fg: "#4338CA" },
  Economics: { icon: "mdi:finance", bg: "#ECFCCB", fg: "#3F6212" },
  Languages: { icon: "mdi:translate", bg: "#CFFAFE", fg: "#0E7490" },
  Other: { icon: "mdi:shape-outline", bg: "#F1F5F9", fg: "#475569" },
};

function subjectMeta(subject?: string) {
  return (subject && SUBJECT_META[subject]) || SUBJECT_META.Other;
}

function minutesBetween(start: string, end: string): number {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  if ([sh, sm, eh, em].some((n) => Number.isNaN(n))) return 0;
  return Math.max(0, eh * 60 + em - (sh * 60 + sm));
}

// ─────────────────────────────────────────────
//  WEEKLY STRIP — glanceable 7-day schedule chip
// ─────────────────────────────────────────────
function WeeklyStrip({ schedule }: { schedule: Schedule[] }) {
  return (
    <div className="flex items-center gap-1">
      {DAYS.map((day, i) => {
        const slot = schedule.find((s) => s.day === day);
        return (
          <div
            key={day}
            title={slot ? `${day} ${slot.startTime}–${slot.endTime}` : day}
            className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold transition-colors
              ${slot ? "bg-[#2F556B] text-white" : "bg-[#EBF3F8] text-[#A9C4D4]"}`}
          >
            {DAY_LETTERS[i]}
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────
//  SMALL ICON ACTION BUTTON — used by card + list row
// ─────────────────────────────────────────────
function ActionIconButton({
  icon,
  label,
  onClick,
  danger,
  disabled,
  spinning,
}: {
  icon: string;
  label: string;
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean;
  spinning?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50
        ${danger ? "text-red-400 hover:text-red-600 hover:bg-red-50" : "text-[#547C90] hover:text-[#2F556B] hover:bg-[#EBF3F8]"}`}
    >
      <Icon icon={icon} width={16} className={spinning ? "animate-spin" : ""} />
    </button>
  );
}

// ─────────────────────────────────────────────
//  SHARED FORM STATE
// ─────────────────────────────────────────────
interface FormState {
  title: string;
  description: string;
  price: string;
  level: string;
  grade: string;
  subject: string;
}

// ─────────────────────────────────────────────
//  SHARED FORM FIELDS (used by Create + Edit)
// ─────────────────────────────────────────────
function CourseFormFields({
  form,
  setForm,
  schedule,
  setSchedule,
  imageFile,
  setImageFile,
  imagePreview,
  setImagePreview,
}: {
  form: FormState;
  setForm: (f: FormState) => void;
  schedule: Schedule[];
  setSchedule: (s: Schedule[]) => void;
  imageFile: File | null;
  setImageFile: (f: File | null) => void;
  imagePreview: string | null;
  setImagePreview: (s: string | null) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  // When level changes, reset grade to the first option for the new level
  function handleLevelChange(newLevel: string) {
    const grades = GRADES[newLevel as Level] ?? [];
    setForm({ ...form, level: newLevel, grade: grades[0] ?? "" });
  }

  function updateSchedule(i: number, field: keyof Schedule, val: string) {
    setSchedule(
      schedule.map((s, idx) => (idx === i ? { ...s, [field]: val } : s)),
    );
  }
  function addSlot() {
    setSchedule([
      ...schedule,
      { day: "Monday", startTime: "09:00", endTime: "10:00" },
    ]);
  }
  function removeSlot(i: number) {
    setSchedule(schedule.filter((_, idx) => idx !== i));
  }
  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  }

  const currentGrades = GRADES[form.level as Level] ?? [];

  return (
    <>
      {/* Image upload */}
      <div>
        <label className="text-xs font-semibold text-[#547C90] uppercase tracking-wider">
          Course Image
        </label>
        <div
          onClick={() => fileRef.current?.click()}
          className="mt-1 w-full h-32 rounded-xl border-2 border-dashed border-[#D4E8F0] flex items-center
            justify-center cursor-pointer hover:border-[#2F556B]/50 transition-colors overflow-hidden relative"
        >
          {imagePreview ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imagePreview}
                alt="preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <span className="text-white text-xs font-semibold">
                  Change image
                </span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-1 text-[#547C90]">
              <Icon
                icon="mdi:image-plus-outline"
                width={28}
                className="opacity-40"
              />
              <span className="text-xs opacity-50">Click to upload image</span>
            </div>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
        {imageFile && (
          <button
            onClick={() => {
              setImageFile(null);
              setImagePreview(null);
              if (fileRef.current) fileRef.current.value = "";
            }}
            className="mt-1 text-xs text-red-400 hover:text-red-600 cursor-pointer"
          >
            Remove image
          </button>
        )}
      </div>

      {/* Title */}
      <div>
        <label className="text-xs font-semibold text-[#547C90] uppercase tracking-wider">
          Title *
        </label>
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="e.g. Advanced Mathematics"
          className="mt-1 w-full rounded-xl border border-[#D4E8F0] px-3 py-2.5 text-sm text-[#1F3745]
            focus:outline-none focus:ring-2 focus:ring-[#2F556B]/30"
        />
      </div>

      {/* Description */}
      <div>
        <label className="text-xs font-semibold text-[#547C90] uppercase tracking-wider">
          Description *
        </label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={3}
          placeholder="What will students learn?"
          className="mt-1 w-full rounded-xl border border-[#D4E8F0] px-3 py-2.5 text-sm text-[#1F3745]
            focus:outline-none focus:ring-2 focus:ring-[#2F556B]/30 resize-none"
        />
      </div>

      {/* Price + Level */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-[#547C90] uppercase tracking-wider">
            Price (DA) *
          </label>
          <input
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            placeholder="1500"
            className="mt-1 w-full rounded-xl border border-[#D4E8F0] px-3 py-2.5 text-sm text-[#1F3745]
              focus:outline-none focus:ring-2 focus:ring-[#2F556B]/30"
          />
        </div>

        {/* Level dropdown — Primary / Secondary / High School */}
        <div>
          <label className="text-xs font-semibold text-[#547C90] uppercase tracking-wider">
            Level *
          </label>
          <select
            value={form.level}
            onChange={(e) => handleLevelChange(e.target.value)}
            className="mt-1 w-full rounded-xl border border-[#D4E8F0] px-3 py-2.5 text-sm text-[#1F3745]
              focus:outline-none focus:ring-2 focus:ring-[#2F556B]/30 bg-white"
          >
            {LEVELS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grade — dependent on Level */}
      <div>
        <label className="text-xs font-semibold text-[#547C90] uppercase tracking-wider">
          Grade *
        </label>
        <select
          value={form.grade}
          onChange={(e) => setForm({ ...form, grade: e.target.value })}
          className="mt-1 w-full rounded-xl border border-[#D4E8F0] px-3 py-2.5 text-sm text-[#1F3745]
            focus:outline-none focus:ring-2 focus:ring-[#2F556B]/30 bg-white"
        >
          {currentGrades.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>

      {/* Subject — dropdown */}
      <div>
        <label className="text-xs font-semibold text-[#547C90] uppercase tracking-wider">
          Subject
        </label>
        <select
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          className="mt-1 w-full rounded-xl border border-[#D4E8F0] px-3 py-2.5 text-sm text-[#1F3745]
            focus:outline-none focus:ring-2 focus:ring-[#2F556B]/30 bg-white"
        >
          <option value="">— Select a subject —</option>
          {SUBJECTS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Schedule */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-[#547C90] uppercase tracking-wider">
            Schedule
          </label>
          <button
            onClick={addSlot}
            className="text-xs text-[#2F556B] font-semibold flex items-center gap-1 hover:opacity-70 cursor-pointer"
          >
            <Icon icon="mdi:plus" width={14} /> Add slot
          </button>
        </div>
        <div className="space-y-2">
          {schedule.map((s, i) => (
            <div
              key={i}
              className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-center"
            >
              <select
                value={s.day}
                onChange={(e) => updateSchedule(i, "day", e.target.value)}
                className="rounded-lg border border-[#D4E8F0] px-2 py-2 text-xs text-[#1F3745] bg-white
                  focus:outline-none focus:ring-2 focus:ring-[#2F556B]/20"
              >
                {DAYS.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
              <input
                type="time"
                value={s.startTime}
                onChange={(e) => updateSchedule(i, "startTime", e.target.value)}
                className="rounded-lg border border-[#D4E8F0] px-2 py-2 text-xs text-[#1F3745]
                  focus:outline-none focus:ring-2 focus:ring-[#2F556B]/20"
              />
              <input
                type="time"
                value={s.endTime}
                onChange={(e) => updateSchedule(i, "endTime", e.target.value)}
                className="rounded-lg border border-[#D4E8F0] px-2 py-2 text-xs text-[#1F3745]
                  focus:outline-none focus:ring-2 focus:ring-[#2F556B]/20"
              />
              {schedule.length > 1 && (
                <button
                  onClick={() => removeSlot(i)}
                  className="text-red-400 hover:text-red-600 cursor-pointer"
                >
                  <Icon icon="mdi:close" width={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────
//  HELPER — build FormData payload
// ─────────────────────────────────────────────
async function fileToDataUrl(file: File): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function buildPayload(
  form: FormState,
  schedule: Schedule[],
  imageFile: File | null,
): Promise<object> {
  const payload: Record<string, unknown> = {
    ...form,
    price: Number(form.price),
    grade: form.grade,
    schedule,
  };

  if (imageFile) {
    payload.image = await fileToDataUrl(imageFile);
  }

  return payload;
}

// ─────────────────────────────────────────────
//  CREATE COURSE MODAL — also handles "Duplicate"
// ─────────────────────────────────────────────
function CreateCourseModal({
  onClose,
  onCreated,
  duplicateFrom,
}: {
  onClose: () => void;
  onCreated: () => void;
  duplicateFrom?: Course | null;
}) {
  const initialForm: FormState = duplicateFrom
    ? {
        title: `${duplicateFrom.title} (Copy)`,
        description: duplicateFrom.description,
        price: String(duplicateFrom.price),
        level: duplicateFrom.level,
        grade:
          duplicateFrom.grade ??
          (GRADES[duplicateFrom.level as Level]?.[0] || ""),
        subject: duplicateFrom.subject ?? "",
      }
    : EMPTY_FORM;
  const initialSchedule: Schedule[] = duplicateFrom?.schedule?.length
    ? duplicateFrom.schedule
    : [{ day: "Monday", startTime: "09:00", endTime: "10:00" }];

  const [form, setForm] = useState<FormState>(initialForm);
  const [schedule, setSchedule] = useState<Schedule[]>(initialSchedule);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleSubmit() {
    if (!form.title || !form.description || !form.price) {
      setErr("Title, description and price are required.");
      return;
    }
    try {
      setSaving(true);
      setErr(null);
      const payload = await buildPayload(form, schedule, imageFile);
      await api.post("/courses", payload);
      onCreated();
      onClose();
    } catch (e) {
      setErr(getErrorMessage(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EBF3F8]">
          <h2 className="font-bold text-[#1F3745] text-lg flex items-center gap-2">
            <Icon
              icon={
                duplicateFrom ? "mdi:content-copy" : "mdi:plus-circle-outline"
              }
              width={20}
              className="text-[#2F556B]"
            />
            {duplicateFrom ? "Duplicate Course" : "Create New Course"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <Icon icon="mdi:close" width={22} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {err && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-2">
              {err}
            </div>
          )}
          {duplicateFrom && (
            <div className="text-xs text-[#547C90] bg-[#EBF3F8] border border-[#D4E8F0] rounded-xl px-4 py-2 flex items-center gap-2">
              <Icon
                icon="mdi:information-outline"
                width={15}
                className="shrink-0"
              />
              Details copied from &ldquo;{duplicateFrom.title}&rdquo;. Re-upload
              an image if needed — it doesn&apos;t carry over.
            </div>
          )}
          <CourseFormFields
            form={form}
            setForm={setForm}
            schedule={schedule}
            setSchedule={setSchedule}
            imageFile={imageFile}
            setImageFile={setImageFile}
            imagePreview={imagePreview}
            setImagePreview={setImagePreview}
          />
        </div>

        <div className="px-6 py-4 border-t border-[#EBF3F8] flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[#D4E8F0] text-sm text-[#547C90]
              hover:bg-[#EBF3F8] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-5 py-2 rounded-xl bg-[#2F556B] text-white text-sm font-semibold
              hover:bg-[#1F3745] transition-colors disabled:opacity-50 cursor-pointer"
          >
            {saving
              ? "Saving…"
              : duplicateFrom
                ? "Create Duplicate"
                : "Create Course"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  EDIT COURSE MODAL
// ─────────────────────────────────────────────
function EditCourseModal({
  course,
  onClose,
  onSaved,
}: {
  course: Course;
  onClose: () => void;
  onSaved: () => void;
}) {
  // Derive initial grade: prefer stored grade, else first grade for the level
  const initialLevel = (course.level as Level) ?? DEFAULT_LEVEL;
  const initialGrade = course.grade ?? (GRADES[initialLevel]?.[0] || "");

  const [form, setForm] = useState<FormState>({
    title: course.title,
    description: course.description,
    price: String(course.price),
    level: initialLevel,
    grade: initialGrade,
    subject: course.subject ?? "",
  });
  const [schedule, setSchedule] = useState<Schedule[]>(
    course.schedule?.length
      ? course.schedule
      : [{ day: "Monday", startTime: "09:00", endTime: "10:00" }],
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    course.image ?? null,
  );
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleSave() {
    if (!form.title || !form.description || !form.price) {
      setErr("Title, description and price are required.");
      return;
    }
    try {
      setSaving(true);
      setErr(null);
      const payload = await buildPayload(form, schedule, imageFile);
      await api.patch(`/courses/${course._id}`, payload);
      onSaved();
      onClose();
    } catch (e) {
      setErr(getErrorMessage(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EBF3F8]">
          <h2 className="font-bold text-[#1F3745] text-lg flex items-center gap-2">
            <Icon
              icon="mdi:pencil-outline"
              width={20}
              className="text-[#2F556B]"
            />
            Edit Course
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <Icon icon="mdi:close" width={22} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {err && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-2">
              {err}
            </div>
          )}
          <CourseFormFields
            form={form}
            setForm={setForm}
            schedule={schedule}
            setSchedule={setSchedule}
            imageFile={imageFile}
            setImageFile={setImageFile}
            imagePreview={imagePreview}
            setImagePreview={setImagePreview}
          />
        </div>

        <div className="px-6 py-4 border-t border-[#EBF3F8] flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[#D4E8F0] text-sm text-[#547C90]
              hover:bg-[#EBF3F8] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 rounded-xl bg-[#2F556B] text-white text-sm font-semibold
              hover:bg-[#1F3745] transition-colors disabled:opacity-50 cursor-pointer"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  COURSE CARD — grid view
// ─────────────────────────────────────────────
function CourseCard({
  course,
  index,
  onDeleted,
  onEdit,
  onDuplicate,
}: {
  course: Course;
  index: number;
  onDeleted: () => void;
  onEdit: (c: Course) => void;
  onDuplicate: (c: Course) => void;
}) {
  const meta = subjectMeta(course.subject);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm("Delete this course? This cannot be undone.")) return;
    try {
      setDeleting(true);
      // FIX: use the correct REST param name /:id (not /:_id)
      await api.delete(`/courses/${course._id}`);
      onDeleted();
    } catch (e) {
      alert(getErrorMessage(e));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div
      className="bg-white rounded-2xl border border-[#D4E8F0] shadow-sm overflow-hidden
        hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col animate-cardIn"
      style={{ animationDelay: `${Math.min(index, 12) * 45}ms` }}
    >
      {/* Banner */}
      <div
        className="h-32 flex items-center justify-center relative overflow-hidden"
        style={
          course.image
            ? undefined
            : { background: `linear-gradient(135deg, ${meta.bg}, #ffffff)` }
        }
      >
        {course.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <Icon
            icon={meta.icon}
            width={44}
            style={{ color: meta.fg, opacity: 0.55 }}
          />
        )}
        {course.image && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-transparent" />
        )}
        <span
          className="absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm"
          style={{
            background: course.image
              ? "rgba(255,255,255,0.9)"
              : (LEVEL_COLOUR[course.level] ?? "#EBF3F8"),
            color: "#1F3745",
          }}
        >
          {course.level}
          {course.grade ? ` · ${course.grade}` : ""}
        </span>
        {course.subject && (
          <span
            className="absolute top-3 left-3 flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full"
            style={{
              background: course.image ? "rgba(255,255,255,0.9)" : meta.bg,
              color: meta.fg,
            }}
          >
            <Icon icon={meta.icon} width={11} />
            {course.subject}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-2.5 flex-1">
        <h3 className="font-bold text-[#1F3745] text-sm leading-snug line-clamp-2">
          {course.title}
        </h3>
        <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
          {course.description}
        </p>
        <div className="mt-auto pt-1">
          <WeeklyStrip schedule={course.schedule} />
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-[#EBF3F8] bg-[#F7FBFD] flex items-center justify-between">
        <span className="text-sm font-bold text-[#1F3745]">
          {course.price.toLocaleString()} DA
        </span>
        <div className="flex items-center gap-0.5">
          <ActionIconButton
            icon="mdi:content-copy"
            label="Duplicate"
            onClick={() => onDuplicate(course)}
          />
          <ActionIconButton
            icon="mdi:pencil-outline"
            label="Edit"
            onClick={() => onEdit(course)}
          />
          <ActionIconButton
            icon={deleting ? "mdi:loading" : "mdi:trash-can-outline"}
            label="Delete"
            danger
            disabled={deleting}
            spinning={deleting}
            onClick={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  COURSE LIST ROW — list view
// ─────────────────────────────────────────────
function CourseListRow({
  course,
  index,
  onDeleted,
  onEdit,
  onDuplicate,
}: {
  course: Course;
  index: number;
  onDeleted: () => void;
  onEdit: (c: Course) => void;
  onDuplicate: (c: Course) => void;
}) {
  const meta = subjectMeta(course.subject);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm("Delete this course? This cannot be undone.")) return;
    try {
      setDeleting(true);
      await api.delete(`/courses/${course._id}`);
      onDeleted();
    } catch (e) {
      alert(getErrorMessage(e));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div
      className="bg-white rounded-2xl border border-[#D4E8F0] shadow-sm hover:shadow-md
        transition-all duration-200 p-3.5 flex items-center gap-4 animate-cardIn"
      style={{ animationDelay: `${Math.min(index, 12) * 35}ms` }}
    >
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 overflow-hidden"
        style={{ background: meta.bg }}
      >
        {course.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <Icon icon={meta.icon} width={24} style={{ color: meta.fg }} />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-bold text-[#1F3745] text-sm truncate">
            {course.title}
          </h3>
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0"
            style={{
              background: LEVEL_COLOUR[course.level] ?? "#EBF3F8",
              color: "#1F3745",
            }}
          >
            {course.level}
            {course.grade ? ` · ${course.grade}` : ""}
          </span>
        </div>
        <p className="text-xs text-gray-400 truncate mt-0.5">
          {course.description}
        </p>
      </div>

      <div className="hidden md:block shrink-0">
        <WeeklyStrip schedule={course.schedule} />
      </div>

      <div className="text-sm font-bold text-[#1F3745] shrink-0 w-20 text-right hidden sm:block">
        {course.price.toLocaleString()} DA
      </div>

      <div className="flex items-center gap-0.5 shrink-0">
        <ActionIconButton
          icon="mdi:content-copy"
          label="Duplicate"
          onClick={() => onDuplicate(course)}
        />
        <ActionIconButton
          icon="mdi:pencil-outline"
          label="Edit"
          onClick={() => onEdit(course)}
        />
        <ActionIconButton
          icon={deleting ? "mdi:loading" : "mdi:trash-can-outline"}
          label="Delete"
          danger
          disabled={deleting}
          spinning={deleting}
          onClick={handleDelete}
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  FILTER CHIP HELPERS
// ─────────────────────────────────────────────
function chipClass(active: boolean) {
  return `flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap
    transition-all duration-200 cursor-pointer
    ${active ? "bg-[#2F556B] text-white shadow-sm" : "bg-white text-[#547C90] border border-[#D4E8F0] hover:bg-[#EBF3F8]"}`;
}

function CountPill({
  active,
  children,
}: {
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold
        ${active ? "bg-white/20 text-white" : "bg-[#EBF3F8] text-[#547C90]"}`}
    >
      {children}
    </span>
  );
}

const cardAnimationStyles = `
@keyframes cardIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-cardIn { animation: cardIn 0.4s ease-out both; }
`;

type SortKey = "newest" | "price-asc" | "price-desc" | "title";
type ModalState =
  | { mode: "create" }
  | { mode: "duplicate"; source: Course }
  | null;

// ─────────────────────────────────────────────
//  PAGE
// ─────────────────────────────────────────────
export default function TeacherCoursesPage() {
  const { courses, loading, error, reload } = useTeacherCourses();
  const [modal, setModal] = useState<ModalState>(null);
  const [editCourse, setEditCourse] = useState<Course | null>(null);

  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortKey>("newest");
  const [view, setView] = useState<"grid" | "list">("grid");

  // ── Derived insights ──
  const insights = useMemo(() => {
    const subjects = new Set(courses.map((c) => c.subject).filter(Boolean));
    const weeklyMinutes = courses.reduce(
      (sum, c) =>
        sum +
        (c.schedule ?? []).reduce(
          (s, slot) => s + minutesBetween(slot.startTime, slot.endTime),
          0,
        ),
      0,
    );
    return {
      total: courses.length,
      subjects: subjects.size,
      weeklyHours: Math.round((weeklyMinutes / 60) * 10) / 10,
    };
  }, [courses]);

  const subjectsPresent = useMemo(
    () =>
      Array.from(
        new Set(courses.map((c) => c.subject).filter(Boolean) as string[]),
      ).sort((a, b) => a.localeCompare(b)),
    [courses],
  );

  // ── Search + filter + sort ──
  const visibleCourses = useMemo(() => {
    let list = courses;
    if (subjectFilter !== "all") {
      list = list.filter((c) => c.subject === subjectFilter);
    }
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((c) =>
        `${c.title} ${c.subject ?? ""} ${c.description}`
          .toLowerCase()
          .includes(q),
      );
    }
    const sorted = [...list];
    switch (sortBy) {
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "title":
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        sorted.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
    }
    return sorted;
  }, [courses, subjectFilter, search, sortBy]);

  const hasActiveFilters = search.trim() !== "" || subjectFilter !== "all";

  return (
    <div className="p-6 min-h-screen bg-[#EBF3F8]">
      <style>{cardAnimationStyles}</style>

      {/* Header */}
      <div className="flex items-end justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1F3745] tracking-tight">
            My Courses
          </h1>
          <p className="text-sm text-[#547C90] mt-1">
            {loading
              ? "Loading…"
              : `${courses.length} course${courses.length !== 1 ? "s" : ""} · live the moment you publish them`}
          </p>
        </div>
        <button
          onClick={() => setModal({ mode: "create" })}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2F556B] text-white
            text-sm font-semibold hover:bg-[#1F3745] transition-colors shadow-sm cursor-pointer"
        >
          <Icon icon="mdi:plus" width={18} /> New Course
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
          <Icon icon="mdi:alert-circle-outline" width={18} /> {error}
        </div>
      )}

      {/* Insight strip */}
      {!loading && courses.length > 0 && (
        <div
          className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#EBF3F8]
            bg-white rounded-2xl border border-[#D4E8F0] shadow-sm mb-6 overflow-hidden"
        >
          {[
            {
              label: "Live Courses",
              value: insights.total,
              icon: "mdi:book-open-variant",
              colour: "#2F556B",
            },
            {
              label: "Subjects Taught",
              value: insights.subjects,
              icon: "mdi:shape-outline",
              colour: "#7ABFA8",
            },
            {
              label: "Weekly Hours",
              value: `${insights.weeklyHours}h`,
              icon: "mdi:clock-outline",
              colour: "#F4A07A",
            },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: s.colour + "18" }}
              >
                <Icon icon={s.icon} width={20} style={{ color: s.colour }} />
              </div>
              <div>
                <p className="text-xl font-extrabold text-[#1F3745] leading-none">
                  {s.value}
                </p>
                <p className="text-[11px] text-[#547C90] mt-1">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Controls — search, sort, view toggle, subject chips */}
      {!loading && courses.length > 0 && (
        <div className="flex flex-col gap-3 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-full border border-[#D4E8F0] flex-1 min-w-0">
              <Icon
                icon="mdi:magnify"
                width={18}
                className="text-[#547C90] shrink-0"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search your courses..."
                className="bg-transparent outline-none text-sm text-[#1F3745] placeholder:text-[#8AAFC0] w-full"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortKey)}
              className="text-sm rounded-full border border-[#D4E8F0] bg-white px-4 py-2.5 text-[#1F3745]
                outline-none cursor-pointer shrink-0"
            >
              <option value="newest">Newest first</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="title">Title: A–Z</option>
            </select>

            <div className="flex items-center gap-1 bg-white rounded-full border border-[#D4E8F0] p-1 shrink-0">
              <button
                onClick={() => setView("grid")}
                aria-label="Grid view"
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer
                  ${view === "grid" ? "bg-[#2F556B] text-white" : "text-[#547C90] hover:bg-[#EBF3F8]"}`}
              >
                <Icon icon="mdi:view-grid-outline" width={16} />
              </button>
              <button
                onClick={() => setView("list")}
                aria-label="List view"
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer
                  ${view === "list" ? "bg-[#2F556B] text-white" : "text-[#547C90] hover:bg-[#EBF3F8]"}`}
              >
                <Icon icon="mdi:view-list-outline" width={16} />
              </button>
            </div>
          </div>

          {subjectsPresent.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
              <button
                onClick={() => setSubjectFilter("all")}
                className={chipClass(subjectFilter === "all")}
              >
                All
                <CountPill active={subjectFilter === "all"}>
                  {courses.length}
                </CountPill>
              </button>
              {subjectsPresent.map((subj) => {
                const meta = subjectMeta(subj);
                const count = courses.filter((c) => c.subject === subj).length;
                const active = subjectFilter === subj;
                return (
                  <button
                    key={subj}
                    onClick={() => setSubjectFilter(subj)}
                    className={chipClass(active)}
                  >
                    <Icon icon={meta.icon} width={13} />
                    {subj}
                    <CountPill active={active}>{count}</CountPill>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Grid / List */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl bg-white overflow-hidden border border-[#D4E8F0]"
            >
              <div className="h-36 bg-[#D4E8F0] animate-pulse" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-[#D4E8F0] rounded animate-pulse w-3/4" />
                <div className="h-3 bg-[#D4E8F0] rounded animate-pulse" />
                <div className="h-3 bg-[#D4E8F0] rounded animate-pulse w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-[#547C90]">
          <Icon
            icon="mdi:book-search-outline"
            width={56}
            className="opacity-25"
          />
          <p className="text-lg font-semibold opacity-50">No courses yet</p>
          <button
            onClick={() => setModal({ mode: "create" })}
            className="mt-2 px-5 py-2.5 rounded-xl bg-[#2F556B] text-white text-sm font-semibold
              hover:bg-[#1F3745] transition-colors cursor-pointer"
          >
            Create your first course
          </button>
        </div>
      ) : visibleCourses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-[#547C90]">
          <Icon
            icon="mdi:filter-remove-outline"
            width={48}
            className="opacity-25"
          />
          <p className="text-base font-semibold opacity-50">
            No courses match your filters
          </p>
          {hasActiveFilters && (
            <button
              onClick={() => {
                setSearch("");
                setSubjectFilter("all");
              }}
              className="text-xs font-semibold text-[#2F556B] hover:underline cursor-pointer"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {visibleCourses.map((c, i) => (
            <CourseCard
              key={c._id}
              course={c}
              index={i}
              onDeleted={reload}
              onEdit={setEditCourse}
              onDuplicate={(course) =>
                setModal({ mode: "duplicate", source: course })
              }
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {visibleCourses.map((c, i) => (
            <CourseListRow
              key={c._id}
              course={c}
              index={i}
              onDeleted={reload}
              onEdit={setEditCourse}
              onDuplicate={(course) =>
                setModal({ mode: "duplicate", source: course })
              }
            />
          ))}
        </div>
      )}

      {modal && (
        <CreateCourseModal
          onClose={() => setModal(null)}
          onCreated={reload}
          duplicateFrom={modal.mode === "duplicate" ? modal.source : null}
        />
      )}
      {editCourse && (
        <EditCourseModal
          course={editCourse}
          onClose={() => setEditCourse(null)}
          onSaved={reload}
        />
      )}
    </div>
  );
}
