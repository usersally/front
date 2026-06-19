"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Icon } from "@iconify/react";
import { api, getErrorMessage } from "@/lib/api";
import BookSessionModal from "./bookSessionModal";

interface Teacher {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  avatar?: string;
  bio?: string;
  subject?: string[];
  levels?: string[];
  pricePerHour?: number;
  pricePerMonth?: number;
  availability?: { day: string; startTime: string; endTime: string }[];
  avgRating?: number;
  ratingCount?: number;
  inSchool?: boolean;
  cv?: string;
  createdAt?: string;
}

interface Rating {
  _id: string;
  rating: number;
  comment?: string;
  createdAt?: string;
  ratedBy?: { firstName?: string; lastName?: string; userName?: string };
}

function StarRating({ rating, count }: { rating?: number; count?: number }) {
  const stars = Math.round(rating ?? 0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <Icon
          key={s}
          icon={s <= stars ? "mdi:star" : "mdi:star-outline"}
          width={18}
          className={s <= stars ? "text-amber-400" : "text-gray-300"}
        />
      ))}
      <span className="ml-1 text-sm text-gray-500">
        {rating != null ? rating.toFixed(1) : "—"}
        {count != null && ` (${count})`}
      </span>
    </div>
  );
}

export default function TeacherProfilePage() {
  const params = useParams();
  const teacherId = params.id as string;

  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollMsg, setEnrollMsg] = useState<string | null>(null);
  const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const [teacherRes, ratingsRes] = await Promise.all([
          api.get<{ success: boolean; data: Teacher }>(`/teacher/${teacherId}`),
          api
            .get<{ success: boolean; data: Rating[] }>(
              `/rating/teacher/${teacherId}`,
            )
            .catch(() => ({ data: { success: true, data: [] } })),
        ]);
        setTeacher(teacherRes.data.data);
        setRatings(ratingsRes.data.data ?? []);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }
    if (teacherId) load();
  }, [teacherId]);

  const handleEnroll = async () => {
    try {
      setEnrolling(true);
      setEnrollMsg(null);
      await api.post(`/student/enroll/${teacherId}`);
      setEnrollMsg("Successfully enrolled with this teacher!");
    } catch (err) {
      setEnrollMsg(getErrorMessage(err));
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EBF3F8] p-6">
        <div className="animate-pulse space-y-6 max-w-4xl mx-auto">
          <div className="h-8 w-32 rounded bg-white" />
          <div className="h-56 rounded-2xl bg-white" />
          <div className="h-40 rounded-2xl bg-white" />
        </div>
      </div>
    );
  }

  if (error || !teacher) {
    return (
      <div className="min-h-screen bg-[#EBF3F8] p-6 flex items-center justify-center">
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm max-w-sm w-full">
          <Icon
            icon="mdi:alert-circle-outline"
            width={40}
            className="text-red-400 mx-auto mb-3"
          />
          <p className="font-semibold text-[#1F3745] mb-4">
            {error ?? "Teacher not found"}
          </p>
          <Link
            href="/student?tab=findTeacher"
            className="inline-flex items-center gap-2 rounded-xl bg-[#2F556B] px-5 py-2 text-sm font-semibold text-white hover:bg-[#1F3745] transition"
          >
            <Icon icon="mdi:arrow-left" width={16} />
            Back to Teachers
          </Link>
        </div>
      </div>
    );
  }

  const subjects = teacher.subject ?? [];
  const levels = teacher.levels ?? [];
  const slots = teacher.availability ?? [];

  return (
    <div className="min-h-screen bg-[#EBF3F8] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Back */}
        <Link
          href="/student?tab=findTeacher"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#547C90] hover:text-[#2F556B] transition"
        >
          <Icon icon="mdi:arrow-left" width={18} />
          Back to Teachers
        </Link>

        {/* Hero card */}
        <div className="mb-6 rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
          <div className="h-32 bg-linear-to-br from-[#2F556B] to-[#A8C8D8]" />

          <div className="px-6 pb-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between -mt-12">
              <div className="flex items-end gap-4">
                {teacher.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={teacher.avatar}
                    alt={teacher.firstName}
                    className="h-24 w-24 rounded-2xl object-cover ring-4 ring-white shadow-lg"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-[#EBF3F8] ring-4 ring-white shadow-lg">
                    <Icon icon="mdi:account" width={40} color="#2F556B" />
                  </div>
                )}
                <div className="pb-1">
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-[#1F3745]">
                      {teacher.firstName} {teacher.lastName}
                    </h1>
                    {teacher.inSchool && (
                      <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-600">
                        <Icon icon="mdi:school" width={12} />
                        In School
                      </span>
                    )}
                  </div>
                  <StarRating
                    rating={teacher.avgRating}
                    count={teacher.ratingCount}
                  />
                </div>
              </div>

              <div className="text-right">
                {teacher.pricePerHour != null ? (
                  <>
                    <p className="text-2xl font-bold text-[#2F556B]">
                      {teacher.pricePerHour.toLocaleString()}
                      <span className="text-sm font-normal text-gray-400">
                        {" "}
                        DA/hr
                      </span>
                    </p>
                    {teacher.pricePerMonth != null && (
                      <p className="text-sm text-gray-400">
                        {teacher.pricePerMonth.toLocaleString()} DA/month
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-gray-400">Price not set</p>
                )}
              </div>
            </div>

            {/* Subjects */}
            {subjects.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {subjects.map((s, i) => (
                  <span
                    key={i}
                    className="rounded-full bg-[#2F556B]/10 px-3 py-1 text-xs font-semibold text-[#2F556B]"
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleEnroll}
                disabled={enrolling}
                className="inline-flex items-center gap-2 rounded-xl bg-[#2F556B] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1F3745] transition disabled:opacity-60"
              >
                {enrolling ? (
                  <Icon icon="mdi:loading" width={16} className="animate-spin" />
                ) : (
                  <Icon icon="mdi:account-plus-outline" width={16} />
                )}
                Enroll
              </button>
              <button
                type="button"
                onClick={() => setShowBooking(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-[#2F556B] px-5 py-2.5 text-sm font-semibold text-[#2F556B] hover:bg-[#EBF3F8] transition"
              >
                <Icon icon="mdi:calendar-plus" width={16} />
                Book Session
              </button>
            </div>

            {enrollMsg && (
              <p
                className={`mt-3 text-sm ${enrollMsg.includes("Success") ? "text-emerald-600" : "text-red-500"}`}
              >
                {enrollMsg}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* About */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
              <h2 className="mb-3 font-bold text-[#1F3745] text-lg">About</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                {teacher.bio ?? "This teacher has not added a bio yet."}
              </p>
            </div>

            {/* Reviews */}
            <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
              <h2 className="mb-4 font-bold text-[#1F3745] text-lg">
                Student Reviews
              </h2>
              {ratings.length === 0 ? (
                <p className="text-sm text-gray-400">No reviews yet.</p>
              ) : (
                <div className="space-y-4">
                  {ratings.map((r) => (
                    <div
                      key={r._id}
                      className="rounded-xl border border-gray-100 bg-[#F9FBFC] p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <StarRating rating={r.rating} />
                        <span className="text-xs text-gray-400">
                          {r.createdAt
                            ? new Date(r.createdAt).toLocaleDateString()
                            : ""}
                        </span>
                      </div>
                      {r.comment && (
                        <p className="text-sm text-gray-600">{r.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar info */}
          <div className="space-y-6">
            {/* Levels */}
            <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
              <h3 className="mb-3 font-bold text-[#1F3745]">Teaching Levels</h3>
              {levels.length === 0 ? (
                <p className="text-sm text-gray-400">Not specified</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {levels.map((l, i) => (
                    <span
                      key={i}
                      className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-600"
                    >
                      {l}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Availability */}
            <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
              <h3 className="mb-3 font-bold text-[#1F3745]">Availability</h3>
              {slots.length === 0 ? (
                <p className="text-sm text-gray-400">No slots set</p>
              ) : (
                <div className="space-y-2">
                  {slots.map((s, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 rounded-xl bg-[#EBF3F8] px-3 py-2 text-sm text-[#2F556B]"
                    >
                      <Icon icon="mdi:clock-outline" width={16} />
                      <span className="font-medium">{s.day}</span>
                      <span className="text-gray-500">
                        {s.startTime} – {s.endTime}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Contact */}
            {(teacher.email || teacher.phoneNumber) && (
              <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
                <h3 className="mb-3 font-bold text-[#1F3745]">Contact</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  {teacher.email && (
                    <div className="flex items-center gap-2">
                      <Icon
                        icon="mdi:email-outline"
                        width={16}
                        className="text-[#547C90]"
                      />
                      {teacher.email}
                    </div>
                  )}
                  {teacher.phoneNumber && (
                    <div className="flex items-center gap-2">
                      <Icon
                        icon="mdi:phone-outline"
                        width={16}
                        className="text-[#547C90]"
                      />
                      {teacher.phoneNumber}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showBooking && teacher && (
        <BookSessionModal
          teacher={teacher}
          onClose={() => setShowBooking(false)}
        />
      )}
    </div>
  );
}
