"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { api, getErrorMessage } from "@/lib/api";

// ─────────────────────────────────────────────
//  TYPES  (matches student.ts + user.ts + enrollment.ts)
// ─────────────────────────────────────────────
interface StudentProfile {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  avatar?: string;
  role: "student";
  userName: string;
  level: string;
  enrollementDate: string;
  createdAt: string;
}

interface EnrolledTeacher {
  _id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  subject: string[];
  pricePerHour: number;
  avgRating?: number;
}

interface Enrollment {
  _id: string;
  teacher: EnrolledTeacher;
  course?: { _id: string; title: string };
  status: "active" | "completed" | "cancelled";
  progress: number;
  enrolledAt: string;
}

interface ProfileResponse {
  success: boolean;
  data: StudentProfile;
}

interface EnrollmentsResponse {
  success: boolean;
  data: Enrollment[];
}

// ─────────────────────────────────────────────
//  HOOKS
// ─────────────────────────────────────────────
function useProfile() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const { data: res } = await api.get<ProfileResponse>("/student/me");
        setProfile(res.data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return { profile, setProfile, loading, error };
}

function useEnrollments() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { data: res } = await api.get<EnrollmentsResponse>(
          "/student/enrollments",
        );
        setEnrollments(res.data);
      } catch {
        // non-fatal
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return { enrollments, loading };
}

// ─────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────
function formatDate(d: string | null | undefined) {
  if (!d) return "—";
  const date = new Date(d);
  if (isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

const STATUS_CFG = {
  active: { label: "Active", bg: "bg-emerald-50", text: "text-emerald-600" },
  completed: {
    label: "Completed",
    bg: "bg-sky-50",
    text: "text-sky-600",
  },
  cancelled: { label: "Cancelled", bg: "bg-red-50", text: "text-red-500" },
};

// ─────────────────────────────────────────────
//  EDIT MODAL
// ─────────────────────────────────────────────
interface EditField {
  key: keyof StudentProfile;
  label: string;
  type?: string;
}

const EDIT_FIELDS: EditField[] = [
  { key: "firstName", label: "First Name" },
  { key: "lastName", label: "Last Name" },
  { key: "phoneNumber", label: "Phone Number", type: "tel" },
  { key: "userName", label: "Username" },
  { key: "level", label: "Level" },
];

function EditModal({
  profile,
  onClose,
  onSaved,
}: {
  profile: StudentProfile;
  onClose: () => void;
  onSaved: (updated: StudentProfile) => void;
}) {
  const [form, setForm] = useState<Partial<StudentProfile>>({
    firstName: profile.firstName,
    lastName: profile.lastName,
    phoneNumber: profile.phoneNumber,
    userName: profile.userName,
    level: profile.level,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      const { data: res } = await api.patch<ProfileResponse>(
        "/student/me",
        form,
      );
      onSaved(res.data);
      onClose();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#2F556B]">
          <h3 className="font-bold text-white text-lg">Edit Profile</h3>
          <button
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

          {EDIT_FIELDS.map((f) => (
            <div key={f.key}>
              <label className="block mb-1 text-xs font-semibold uppercase tracking-wider text-[#547C90]">
                {f.label}
              </label>
              <input
                type={f.type ?? "text"}
                value={(form[f.key] as string) ?? ""}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, [f.key]: e.target.value }))
                }
                className="w-full rounded-xl border border-gray-200 bg-[#F9FBFC] px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-[#2F556B] focus:ring-2 focus:ring-[#2F556B]/10 transition"
              />
            </div>
          ))}
        </div>

        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 rounded-xl bg-[#2F556B] py-2.5 text-sm font-semibold text-white hover:bg-[#1F3745] transition disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {saving && (
              <Icon icon="mdi:loading" width={16} className="animate-spin" />
            )}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  AVATAR UPLOAD
// ─────────────────────────────────────────────
function AvatarUpload({
  profile,
  onUploaded,
}: {
  profile: StudentProfile;
  onUploaded: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("avatar", file);
      const { data: res } = await api.patch<{ data: { avatar: string } }>(
        "/student/me/avatar",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      onUploaded(res.data.avatar);
    } catch {
      // silent
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative group">
      {profile.avatar ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={profile.avatar}
          alt="avatar"
          className="h-24 w-24 rounded-2xl object-cover ring-4 ring-white shadow-lg"
        />
      ) : (
        <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-[#EBF3F8] ring-4 ring-white shadow-lg">
          <Icon icon="mdi:account" width={40} color="#2F556B" />
        </div>
      )}
      <button
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        {uploading ? (
          <Icon
            icon="mdi:loading"
            width={22}
            className="animate-spin text-white"
          />
        ) : (
          <Icon icon="mdi:camera" width={22} className="text-white" />
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />
    </div>
  );
}

// ─────────────────────────────────────────────
//  ENROLLMENT CARD
// ─────────────────────────────────────────────
function EnrollmentCard({ enr }: { enr: Enrollment }) {
  const cfg = STATUS_CFG[enr.status];

  return (
    <div className="flex items-center gap-4 rounded-2xl bg-white border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow">
      {enr.teacher?.avatar ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={enr.teacher.avatar}
          alt={enr.teacher.firstName}
          className="h-12 w-12 shrink-0 rounded-xl object-cover"
        />
      ) : (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EBF3F8]">
          <Icon icon="mdi:account" width={24} color="#2F556B" />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-semibold text-[#1F3745] truncate">
            {enr.teacher
              ? `${enr.teacher.firstName} ${enr.teacher.lastName}`
              : "Teacher"}
          </span>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${cfg.bg} ${cfg.text}`}
          >
            {cfg.label}
          </span>
        </div>

        <div className="flex flex-wrap gap-1 mb-2">
          {enr.teacher?.subject?.slice(0, 2).map((s, i) => (
            <span
              key={i}
              className="rounded-md bg-[#2F556B]/10 px-1.5 py-0.5 text-xs font-medium text-[#2F556B]"
            >
              {s}
            </span>
          ))}
        </div>

        {/* Progress bar */}
        {enr.status === "active" && (
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-[#2F556B] transition-all duration-700"
                style={{ width: `${enr.progress}%` }}
              />
            </div>
            <span className="text-xs text-gray-400 shrink-0">
              {enr.progress}%
            </span>
          </div>
        )}

        <p className="text-xs text-gray-400 mt-1">
          Enrolled {formatDate(enr.enrolledAt)}
        </p>
      </div>

      <div className="text-right shrink-0">
        <p className="text-sm font-bold text-[#1F3745]">
          {enr.teacher?.pricePerHour?.toLocaleString()}
          <span className="text-xs font-normal text-gray-400"> DA/hr</span>
        </p>
        <a
          href={`/student/teachers/${enr.teacher?._id}`}
          className="mt-1 text-xs text-[#2F556B] hover:underline"
        >
          View →
        </a>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  PAGE
// ─────────────────────────────────────────────
export default function StudentProfilePage() {
  const { profile, setProfile, loading, error } = useProfile();
  const { enrollments, loading: enrollLoading } = useEnrollments();
  const [showEdit, setShowEdit] = useState(false);

  const handleAvatarUploaded = (url: string) => {
    if (profile) setProfile({ ...profile, avatar: url });
  };

  const handleProfileSaved = (updated: StudentProfile) => {
    setProfile(updated);
  };

  const activeEnr = enrollments.filter((e) => e.status === "active");
  const pastEnr = enrollments.filter((e) => e.status !== "active");

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EBF3F8] p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-48 rounded-2xl bg-white" />
          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 rounded-2xl bg-white" />
            ))}
          </div>
          <div className="h-64 rounded-2xl bg-white" />
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-[#EBF3F8] p-6 flex items-center justify-center">
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm max-w-sm w-full">
          <Icon
            icon="mdi:alert-circle-outline"
            width={40}
            className="text-red-400 mx-auto mb-3"
          />
          <p className="font-semibold text-[#1F3745]">
            {error ?? "Profile not found"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EBF3F8] p-6">
      {/* PROFILE CARD */}
      <div className="mb-6 rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
        {/* Banner */}
        <div className="h-28 bg-linear-to-br from-[#2F556B] to-[#A8C8D8]" />

        <div className="px-6 pb-6">
          {/* Avatar row */}
          <div className="flex items-end justify-between -mt-12 mb-4">
            <AvatarUpload profile={profile} onUploaded={handleAvatarUploaded} />
            <button
              onClick={() => setShowEdit(true)}
              className="flex items-center gap-2 rounded-xl border border-[#2F556B] px-4 py-2 text-sm font-semibold text-[#2F556B] hover:bg-[#EBF3F8] transition"
            >
              <Icon icon="mdi:pencil-outline" width={16} />
              Edit Profile
            </button>
          </div>

          {/* Name & meta */}
          <div className="mb-5">
            <h2 className="text-2xl font-bold text-[#1F3745]">
              {profile.firstName} {profile.lastName}
            </h2>
            <p className="text-sm text-[#547C90]">@{profile.userName}</p>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: "mdi:email-outline",
                label: "Email",
                value: profile.email,
              },
              {
                icon: "mdi:phone-outline",
                label: "Phone",
                value: profile.phoneNumber,
              },
              {
                icon: "mdi:school-outline",
                label: "Level",
                value: profile.level,
              },
              {
                icon: "mdi:calendar-check-outline",
                label: "Enrolled Since",
                value: formatDate(profile.enrollementDate),
              },
              {
                icon: "mdi:account-outline",
                label: "Member Since",
                value: formatDate(profile.createdAt),
              },
              {
                icon: "mdi:shield-account-outline",
                label: "Role",
                value: "Student",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-xl bg-[#F9FBFC] border border-gray-100 px-4 py-3"
              >
                <Icon
                  icon={item.icon}
                  width={18}
                  className="text-[#547C90] shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-xs text-gray-400">{item.label}</p>
                  <p className="text-sm font-semibold text-[#1F3745] truncate">
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* QUICK STATS */}
      <div className="grid grid-cols-2 gap-4 mb-6 lg:grid-cols-4">
        {[
          {
            icon: "mdi:book-open-outline",
            label: "Active Enrollments",
            value: activeEnr.length,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
          },
          {
            icon: "mdi:check-all",
            label: "Completed",
            value: pastEnr.filter((e) => e.status === "completed").length,
            color: "text-sky-600",
            bg: "bg-sky-50",
          },
          {
            icon: "mdi:account-multiple-outline",
            label: "Teachers",
            value: new Set(enrollments.map((e) => e.teacher?._id)).size,
            color: "text-[#2F556B]",
            bg: "bg-[#EBF3F8]",
          },
          {
            icon: "mdi:cash-multiple",
            label: "Total Invested",
            value: `${enrollments
              .reduce((s, e) => s + (e.teacher?.pricePerHour ?? 0), 0)
              .toLocaleString()} DA`,
            color: "text-violet-600",
            bg: "bg-violet-50",
          },
        ].map((s, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 rounded-2xl ${s.bg} px-4 py-4`}
          >
            <Icon icon={s.icon} width={22} className={s.color} />
            <div>
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ENROLLMENTS */}
      <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-[#1F3745] text-lg">My Enrollments</h3>
          <a
            href="/student/find"
            className="flex items-center gap-1 rounded-xl bg-[#2F556B] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1F3745] transition"
          >
            <Icon icon="mdi:plus" width={14} />
            Enroll
          </a>
        </div>

        {enrollLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse flex gap-4 rounded-2xl border border-gray-100 p-4"
              >
                <div className="h-12 w-12 rounded-xl bg-gray-200 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-40 rounded bg-gray-200" />
                  <div className="h-3 w-24 rounded bg-gray-200" />
                  <div className="h-2 w-full rounded-full bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        ) : enrollments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Icon
              icon="mdi:book-open-outline"
              width={40}
              className="text-gray-300 mb-3"
            />
            <p className="text-sm text-gray-400">
              No enrollments yet. Find a teacher to get started!
            </p>
          </div>
        ) : (
          <>
            {activeEnr.length > 0 && (
              <div className="mb-5">
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#547C90]">
                  Active
                </h4>
                <div className="space-y-3">
                  {activeEnr.map((e) => (
                    <EnrollmentCard key={e._id} enr={e} />
                  ))}
                </div>
              </div>
            )}

            {pastEnr.length > 0 && (
              <div>
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#547C90]">
                  Past
                </h4>
                <div className="space-y-3">
                  {pastEnr.map((e) => (
                    <EnrollmentCard key={e._id} enr={e} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* CHANGE PASSWORD */}
      <div className="mt-6 rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
        <h3 className="font-bold text-[#1F3745] text-lg mb-4">Security</h3>
        <a
          href="/student/settings/password"
          className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-600 hover:bg-[#EBF3F8] hover:border-[#2F556B] transition group"
        >
          <Icon
            icon="mdi:lock-outline"
            width={18}
            className="text-[#547C90] group-hover:text-[#2F556B]"
          />
          <span className="flex-1">Change Password</span>
          <Icon icon="mdi:chevron-right" width={18} className="text-gray-400" />
        </a>
      </div>

      {/* EDIT MODAL */}
      {showEdit && (
        <EditModal
          profile={profile}
          onClose={() => setShowEdit(false)}
          onSaved={handleProfileSaved}
        />
      )}
    </div>
  );
}
