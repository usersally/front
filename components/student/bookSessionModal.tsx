"use client";

import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { api, getErrorMessage, getUser } from "@/lib/api";
import { nextDateForWeekday, normalizeTime } from "@/lib/utils";

interface ScheduleSlot {
  day: string;
  startTime: string;
  endTime: string;
}

interface TeacherCourse {
  _id: string;
  title: string;
  price: number;
  schedule: ScheduleSlot[];
  teacher: string | { _id: string };
}

interface BookSessionModalProps {
  teacher: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  onClose: () => void;
  onBooked?: () => void;
}

export default function BookSessionModal({
  teacher,
  onClose,
  onBooked,
}: BookSessionModalProps) {
  const [courses, setCourses] = useState<TeacherCourse[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [courseId, setCourseId] = useState("");
  const [slotIndex, setSlotIndex] = useState(0);
  const [paymentType, setPaymentType] = useState<"single" | "monthly">(
    "single",
  );
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card">("cash");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const selectedCourse = courses.find((c) => c._id === courseId);
  const slots = selectedCourse?.schedule ?? [];
  const selectedSlot = slots[slotIndex];

  useEffect(() => {
    api
      .get<{ success: boolean; data: TeacherCourse[] }>("/courses")
      .then((res) => {
        const teacherCourses = res.data.data.filter((c) => {
          const teacherRef = c.teacher;
          const id =
            typeof teacherRef === "string" ? teacherRef : teacherRef?._id;
          return id === teacher._id;
        });
        setCourses(teacherCourses);
        if (teacherCourses[0]) setCourseId(teacherCourses[0]._id);
      })
      .catch(() => setError("Failed to load this teacher's courses."))
      .finally(() => setLoadingCourses(false));
  }, [teacher._id]);

  useEffect(() => {
    setSlotIndex(0);
  }, [courseId]);

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
    if (!selectedCourse || !selectedSlot) {
      setError("Please select a course session posted by the teacher.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await api.post("/booking", {
        courseId: selectedCourse._id,
        teacherId: teacher._id,
        date: nextDateForWeekday(selectedSlot.day),
        startTime: normalizeTime(selectedSlot.startTime),
        endTime: normalizeTime(selectedSlot.endTime),
        price: Number(selectedCourse.price) || 0,
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
            <h3 className="font-bold text-white text-lg">Book a Course</h3>
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

          {loadingCourses ? (
            <div className="flex items-center justify-center gap-2 py-8 text-sm text-[#547C90]">
              <Icon icon="mdi:loading" width={18} className="animate-spin" />
              Loading courses…
            </div>
          ) : courses.length === 0 ? (
            <p className="text-sm text-[#547C90] text-center py-6">
              This teacher has not posted any courses yet. Check back later or
              explore other courses.
            </p>
          ) : (
            <>
              <div>
                <label className="block mb-1 text-xs font-semibold uppercase tracking-wider text-[#547C90]">
                  Course
                </label>
                <select
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-[#F9FBFC] px-3 py-2.5 text-sm outline-none focus:border-[#2F556B] focus:ring-2 focus:ring-[#2F556B]/10"
                >
                  {courses.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.title} — {c.price.toLocaleString()} DA
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2 text-xs font-semibold uppercase tracking-wider text-[#547C90]">
                  Posted Session
                </label>
                {slots.length === 0 ? (
                  <p className="text-sm text-[#8AAFC0] bg-[#F6FAFD] rounded-xl px-3 py-2.5">
                    No sessions posted for this course yet.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {slots.map((slot, i) => (
                      <button
                        key={`${slot.day}-${slot.startTime}-${i}`}
                        type="button"
                        onClick={() => setSlotIndex(i)}
                        className={`w-full text-left rounded-xl px-3 py-2.5 text-sm font-semibold border-2 transition ${
                          slotIndex === i
                            ? "border-[#2F556B] bg-[#EBF3F8] text-[#1F3745]"
                            : "border-gray-200 bg-white text-[#547C90] hover:border-[#CBD9E0]"
                        }`}
                      >
                        {slot.day} · {slot.startTime} – {slot.endTime}
                      </button>
                    ))}
                  </div>
                )}
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
            </>
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
            disabled={
              loading || success || loadingCourses || !selectedCourse || !selectedSlot
            }
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
