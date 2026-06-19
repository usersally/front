"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

// ─────────────────────────────────────────────
//  BOOKING MODAL
// ─────────────────────────────────────────────

function BookingModal({
  course,
  onClose,
  onBooked,
}: {
  course: Course;
  onClose: () => void;
  onBooked: () => void;
}) {
  const [date, setDate] = useState("");
  const [paymentType, setPaymentType] = useState<"single" | "monthly">(
    "single",
  );
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card">("cash");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const firstSchedule = course.schedule?.[0];

  const handleSubmit = async () => {
    if (!date) {
      setError("Please pick a date.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await api.post("/bookings", {
        courseId: course._id,
        teacherId: course.teacher._id,
        date,
        startTime: firstSchedule?.startTime ?? "09:00",
        endTime: firstSchedule?.endTime ?? "10:00",
        price: course.price,
        paymentType,
        paymentMethod,
      });
      onBooked();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Failed to book. Try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(15,30,40,0.65)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 24,
          width: "100%",
          maxWidth: 460,
          boxShadow: "0 24px 80px rgba(15,30,40,0.3)",
          animation: "modalIn .22s cubic-bezier(.22,1,.36,1)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg,#1F3745,#2F556B)",
            padding: "22px 28px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: ".72rem",
                  color: "rgba(235,243,248,.6)",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: ".5px",
                }}
              >
                Booking
              </p>
              <h3
                style={{
                  margin: "4px 0 0",
                  color: "#EBF3F8",
                  fontSize: "1.05rem",
                  fontWeight: 800,
                  lineHeight: 1.3,
                }}
              >
                {course.title}
              </h3>
            </div>
            <button
              onClick={onClose}
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "none",
                borderRadius: "50%",
                width: 32,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#EBF3F8",
                fontSize: 16,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              ×
            </button>
          </div>
          <div
            style={{ marginTop: 14, display: "flex", gap: 8, flexWrap: "wrap" }}
          >
            <span
              style={{
                background: "rgba(235,243,248,.15)",
                color: "#EBF3F8",
                borderRadius: 20,
                padding: "3px 12px",
                fontSize: ".78rem",
                fontWeight: 700,
              }}
            >
              {course.price.toLocaleString()} DZD
            </span>
            {firstSchedule && (
              <span
                style={{
                  background: "rgba(235,243,248,.15)",
                  color: "#EBF3F8",
                  borderRadius: 20,
                  padding: "3px 12px",
                  fontSize: ".78rem",
                  fontWeight: 700,
                }}
              >
                {firstSchedule.day} · {firstSchedule.startTime} –{" "}
                {firstSchedule.endTime}
              </span>
            )}
          </div>
        </div>
        <div
          style={{
            padding: "24px 28px 28px",
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                fontSize: ".75rem",
                fontWeight: 700,
                color: "#547C90",
                textTransform: "uppercase",
                letterSpacing: ".5px",
                marginBottom: 8,
              }}
            >
              Session Date
            </label>
            <input
              type="date"
              value={date}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setDate(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: 12,
                border: "1.5px solid #CBD9E0",
                fontSize: ".9rem",
                fontWeight: 600,
                color: "#1F3745",
                outline: "none",
                fontFamily: "inherit",
                boxSizing: "border-box",
              }}
            />
          </div>
          <div>
            <label
              style={{
                display: "block",
                fontSize: ".75rem",
                fontWeight: 700,
                color: "#547C90",
                textTransform: "uppercase",
                letterSpacing: ".5px",
                marginBottom: 8,
              }}
            >
              Session Type
            </label>
            <div style={{ display: "flex", gap: 10 }}>
              {(["single", "monthly"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setPaymentType(t)}
                  style={{
                    flex: 1,
                    padding: "10px 0",
                    borderRadius: 12,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontWeight: 700,
                    fontSize: ".88rem",
                    border: `2px solid ${paymentType === t ? "#2F556B" : "#E2EDF3"}`,
                    background: paymentType === t ? "#EBF3F8" : "#fff",
                    color: paymentType === t ? "#1F3745" : "#8AACBD",
                    transition: "all .15s",
                  }}
                >
                  {t === "single" ? "Single" : "Monthly"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label
              style={{
                display: "block",
                fontSize: ".75rem",
                fontWeight: 700,
                color: "#547C90",
                textTransform: "uppercase",
                letterSpacing: ".5px",
                marginBottom: 8,
              }}
            >
              Payment Method
            </label>
            <div style={{ display: "flex", gap: 10 }}>
              {(["cash", "card"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setPaymentMethod(m)}
                  style={{
                    flex: 1,
                    padding: "10px 0",
                    borderRadius: 12,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontWeight: 700,
                    fontSize: ".88rem",
                    border: `2px solid ${paymentMethod === m ? "#2F556B" : "#E2EDF3"}`,
                    background: paymentMethod === m ? "#EBF3F8" : "#fff",
                    color: paymentMethod === m ? "#1F3745" : "#8AACBD",
                    transition: "all .15s",
                  }}
                >
                  {m === "cash" ? "💵 Cash" : "💳 Card"}
                </button>
              ))}
            </div>
          </div>
          {error && (
            <p
              style={{
                margin: 0,
                fontSize: ".82rem",
                color: "#e05252",
                fontWeight: 600,
                background: "#FFF0F0",
                borderRadius: 10,
                padding: "8px 14px",
              }}
            >
              {error}
            </p>
          )}
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              padding: "13px 24px",
              borderRadius: 14,
              border: "none",
              background: loading
                ? "#8AACBD"
                : "linear-gradient(90deg,#1F3745,#2F556B)",
              color: "#EBF3F8",
              fontWeight: 800,
              fontSize: ".95rem",
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              transition: "opacity .2s",
            }}
          >
            {loading ? "Booking…" : "Confirm Booking →"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  TYPES
// ─────────────────────────────────────────────

interface Schedule {
  day: string;
  startTime: string;
  endTime: string;
}

interface Teacher {
  _id: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
}

interface Course {
  _id: string;
  title: string;
  description: string;
  price: number;
  level: string;
  subject: string;
  image: string | null;
  isPublished: boolean;
  teacher: Teacher;
  schedule: Schedule[];
  createdAt: string;
}

// ─────────────────────────────────────────────
//  PLACEHOLDER IMAGE
// ─────────────────────────────────────────────

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80";

const AVATAR_FALLBACK = (name: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2F556B&color=fff&size=64`;

// ─────────────────────────────────────────────
//  SAVE ICON
// ─────────────────────────────────────────────

function SaveIcon({
  saved,
  onClick,
}: {
  saved: boolean;
  onClick: (e: React.MouseEvent) => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={saved ? "Unsave course" : "Save course"}
      style={{
        background: saved ? "rgba(47,85,107,0.92)" : "rgba(255,255,255,0.18)",
        border: "none",
        borderRadius: "50%",
        width: 36,
        height: 36,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        backdropFilter: "blur(8px)",
        transition: "all .2s",
        flexShrink: 0,
      }}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill={saved ? "#EBF3F8" : "none"}
        stroke={saved ? "#EBF3F8" : "#EBF3F8"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    </button>
  );
}

// ─────────────────────────────────────────────
//  LEVEL BADGE
// ─────────────────────────────────────────────

function LevelBadge({ level }: { level: string }) {
  const colors: Record<string, string> = {
    primary: "#4A9B7F",
    secondary: "#2F556B",
    university: "#7B5EA7",
    bem: "#C97D3A",
  };
  const bg = colors[level?.toLowerCase()] ?? "#547C90";

  return (
    <span
      style={{
        background: bg,
        color: "#fff",
        fontSize: ".68rem",
        fontWeight: 700,
        padding: "3px 10px",
        borderRadius: 20,
        textTransform: "capitalize",
        letterSpacing: ".4px",
      }}
    >
      {level}
    </span>
  );
}

// ─────────────────────────────────────────────
//  COURSE CARD
// ─────────────────────────────────────────────

function CourseCard({
  course,
  saved,
  onSave,
  onClick,
  onTeacherClick,
  isBooked,
}: {
  course: Course;
  saved: boolean;
  onSave: (e: React.MouseEvent) => void;
  onClick: () => void;
  onTeacherClick: (e: React.MouseEvent) => void;
  isBooked?: boolean;
}) {
  const teacherName =
    `${course.teacher?.firstName ?? ""} ${course.teacher?.lastName ?? ""}`.trim();
  const firstSchedule = course.schedule?.[0];

  return (
    <div
      onClick={onClick}
      style={{
        background: "#fff",
        borderRadius: 20,
        overflow: "hidden",
        boxShadow: "0 2px 16px rgba(31,55,69,0.09)",
        cursor: "pointer",
        transition: "transform .2s, box-shadow .2s",
        display: "flex",
        flexDirection: "column",
        border: "1px solid #E2EDF3",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform =
          "translateY(-4px)";
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 8px 32px rgba(31,55,69,0.16)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 2px 16px rgba(31,55,69,0.09)";
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", height: 180, flexShrink: 0 }}>
        <img
          src={course.image ?? FALLBACK_IMAGE}
          alt={course.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
          }}
        />
        {/* Overlay top-right: save + level */}
        <div
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 8,
          }}
        >
          <SaveIcon saved={saved} onClick={onSave} />
          {isBooked && (
            <span
              style={{
                background: "#4A9B7F",
                color: "#fff",
                fontSize: ".65rem",
                fontWeight: 800,
                padding: "3px 10px",
                borderRadius: 20,
                letterSpacing: ".3px",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Booked
            </span>
          )}
        </div>
        <div style={{ position: "absolute", top: 12, left: 12 }}>
          <LevelBadge level={course.level} />
        </div>
        {/* Schedule ribbon */}
        {firstSchedule && (
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              background:
                "linear-gradient(0deg, rgba(31,55,69,0.82) 0%, transparent 100%)",
              padding: "18px 14px 10px",
              display: "flex",
              gap: 10,
              alignItems: "center",
            }}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#EBF3F8"
              strokeWidth="2.2"
              strokeLinecap="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span
              style={{ color: "#EBF3F8", fontSize: ".75rem", fontWeight: 600 }}
            >
              {firstSchedule.day} · {firstSchedule.startTime} –{" "}
              {firstSchedule.endTime}
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div
        style={{
          padding: "16px 18px 18px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
          flex: 1,
        }}
      >
        {/* Subject tag */}
        {course.subject && (
          <span
            style={{
              color: "#547C90",
              fontSize: ".72rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: ".6px",
            }}
          >
            {course.subject}
          </span>
        )}

        {/* Title */}
        <h3
          style={{
            margin: 0,
            fontSize: "1rem",
            fontWeight: 800,
            color: "#1F3745",
            lineHeight: 1.35,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {course.title}
        </h3>

        {/* Description */}
        <p
          style={{
            margin: 0,
            fontSize: ".82rem",
            color: "#5A7A8A",
            lineHeight: 1.55,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            flex: 1,
          }}
        >
          {course.description}
        </p>

        {/* Footer: teacher + price */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 4,
            paddingTop: 12,
            borderTop: "1px solid #EBF3F8",
          }}
        >
          {/* Teacher */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <img
              src={
                course.teacher?.avatarUrl ?? AVATAR_FALLBACK(teacherName || "T")
              }
              alt={teacherName}
              title={`View ${teacherName}'s profile`}
              onClick={onTeacherClick}
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid #EBF3F8",
                cursor: "pointer",
                transition: "transform .15s, box-shadow .15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLImageElement).style.transform =
                  "scale(1.12)";
                (e.currentTarget as HTMLImageElement).style.boxShadow =
                  "0 0 0 3px #2F556B44";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLImageElement).style.transform =
                  "scale(1)";
                (e.currentTarget as HTMLImageElement).style.boxShadow = "none";
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = AVATAR_FALLBACK(
                  teacherName || "T",
                );
              }}
            />
            <span
              style={{ fontSize: ".78rem", fontWeight: 600, color: "#2F556B" }}
            >
              {teacherName || "Teacher"}
            </span>
          </div>
          {/* Price */}
          <span
            style={{
              fontWeight: 800,
              fontSize: ".95rem",
              color: "#1F3745",
            }}
          >
            {course.price.toLocaleString()}{" "}
            <span
              style={{ fontSize: ".72rem", fontWeight: 600, color: "#547C90" }}
            >
              DZD
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  DETAIL MODAL
// ─────────────────────────────────────────────

function CourseModal({
  course,
  saved,
  onSave,
  onClose,
  onTeacherClick,
  isBooked,
  onBook,
}: {
  course: Course;
  saved: boolean;
  onSave: () => void;
  onClose: () => void;
  onTeacherClick: () => void;
  isBooked: boolean;
  onBook: () => void;
}) {
  const [showBooking, setShowBooking] = useState(false);
  const teacherName =
    `${course.teacher?.firstName ?? ""} ${course.teacher?.lastName ?? ""}`.trim();

  // Close on backdrop click
  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      onClick={handleBackdrop}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(15,30,40,0.6)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 24,
          width: "100%",
          maxWidth: 620,
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 24px 80px rgba(15,30,40,0.3)",
          animation: "modalIn .25s cubic-bezier(.22,1,.36,1)",
        }}
      >
        {/* Hero image */}
        <div style={{ position: "relative", height: 240 }}>
          <img
            src={course.image ?? FALLBACK_IMAGE}
            alt={course.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              borderRadius: "24px 24px 0 0",
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "24px 24px 0 0",
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.0) 40%, rgba(15,30,40,0.65) 100%)",
            }}
          />
          {/* Close */}
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: 14,
              right: 14,
              background: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(8px)",
              border: "none",
              borderRadius: "50%",
              width: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#fff",
              fontSize: 18,
              fontWeight: 700,
            }}
          >
            ×
          </button>
          {/* Level */}
          <div style={{ position: "absolute", top: 14, left: 14 }}>
            <LevelBadge level={course.level} />
          </div>
          {/* Title overlay */}
          <div
            style={{ position: "absolute", bottom: 16, left: 20, right: 20 }}
          >
            <h2
              style={{
                margin: 0,
                color: "#fff",
                fontSize: "1.25rem",
                fontWeight: 800,
                lineHeight: 1.3,
              }}
            >
              {course.title}
            </h2>
          </div>
        </div>

        {/* Content */}
        <div
          style={{
            padding: "24px 28px 28px",
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          {/* Teacher + Price row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <img
                src={
                  course.teacher?.avatarUrl ??
                  AVATAR_FALLBACK(teacherName || "T")
                }
                alt={teacherName}
                title={`View ${teacherName}'s profile`}
                onClick={onTeacherClick}
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid #EBF3F8",
                  cursor: "pointer",
                  transition: "transform .15s, box-shadow .15s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLImageElement).style.transform =
                    "scale(1.1)";
                  (e.currentTarget as HTMLImageElement).style.boxShadow =
                    "0 0 0 3px #2F556B44";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLImageElement).style.transform =
                    "scale(1)";
                  (e.currentTarget as HTMLImageElement).style.boxShadow =
                    "none";
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = AVATAR_FALLBACK(
                    teacherName || "T",
                  );
                }}
              />
              <div>
                <div
                  style={{
                    fontSize: ".72rem",
                    color: "#547C90",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: ".5px",
                  }}
                >
                  Teacher
                </div>
                <div
                  style={{
                    fontSize: ".92rem",
                    fontWeight: 700,
                    color: "#1F3745",
                  }}
                >
                  {teacherName || "—"}
                </div>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontSize: ".72rem",
                  color: "#547C90",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: ".5px",
                }}
              >
                Price
              </div>
              <div
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 800,
                  color: "#1F3745",
                }}
              >
                {course.price.toLocaleString()}{" "}
                <span
                  style={{
                    fontSize: ".8rem",
                    color: "#547C90",
                    fontWeight: 600,
                  }}
                >
                  DZD
                </span>
              </div>
            </div>
          </div>

          {/* Subject */}
          {course.subject && (
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span
                style={{
                  fontSize: ".72rem",
                  color: "#547C90",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: ".5px",
                  minWidth: 60,
                }}
              >
                Subject
              </span>
              <span
                style={{ fontSize: ".9rem", fontWeight: 600, color: "#2F556B" }}
              >
                {course.subject}
              </span>
            </div>
          )}

          {/* Description */}
          <div>
            <div
              style={{
                fontSize: ".72rem",
                color: "#547C90",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: ".5px",
                marginBottom: 8,
              }}
            >
              About this course
            </div>
            <p
              style={{
                margin: 0,
                fontSize: ".9rem",
                color: "#3D6070",
                lineHeight: 1.65,
              }}
            >
              {course.description}
            </p>
          </div>

          {/* Schedule */}
          {course.schedule?.length > 0 && (
            <div>
              <div
                style={{
                  fontSize: ".72rem",
                  color: "#547C90",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: ".5px",
                  marginBottom: 10,
                }}
              >
                Schedule
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {course.schedule.map((s, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      background: "#EBF3F8",
                      borderRadius: 12,
                      padding: "10px 16px",
                    }}
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#2F556B"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span
                      style={{
                        fontWeight: 700,
                        color: "#1F3745",
                        fontSize: ".88rem",
                        minWidth: 90,
                      }}
                    >
                      {s.day}
                    </span>
                    <span
                      style={{
                        color: "#547C90",
                        fontSize: ".85rem",
                        fontWeight: 600,
                      }}
                    >
                      {s.startTime} – {s.endTime}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
            <button
              onClick={onSave}
              style={{
                flex: "0 0 auto",
                padding: "12px 18px",
                background: saved ? "#EBF3F8" : "#fff",
                border: `2px solid ${saved ? "#2F556B" : "#CBD9E0"}`,
                borderRadius: 14,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontWeight: 700,
                fontSize: ".88rem",
                color: saved ? "#2F556B" : "#547C90",
                transition: "all .2s",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill={saved ? "#2F556B" : "none"}
                stroke="#2F556B"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
              {saved ? "Saved" : "Save"}
            </button>
            {isBooked ? (
              <div
                style={{
                  flex: 1,
                  padding: "12px 24px",
                  borderRadius: 14,
                  background: "#EBF3F8",
                  border: "2px solid #4A9B7F",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#4A9B7F"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span
                  style={{
                    fontWeight: 800,
                    fontSize: ".95rem",
                    color: "#4A9B7F",
                  }}
                >
                  Booked
                </span>
              </div>
            ) : (
              <button
                onClick={() => setShowBooking(true)}
                style={{
                  flex: 1,
                  padding: "12px 24px",
                  background: "linear-gradient(90deg, #1F3745, #2F556B)",
                  border: "none",
                  borderRadius: 14,
                  color: "#EBF3F8",
                  fontWeight: 800,
                  fontSize: ".95rem",
                  cursor: "pointer",
                  transition: "opacity .2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = ".88")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                Book a session →
              </button>
            )}
          </div>
        </div>
      </div>

      {showBooking && (
        <BookingModal
          course={course}
          onClose={() => setShowBooking(false)}
          onBooked={() => {
            setShowBooking(false);
            onBook();
            onClose();
          }}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
//  MAIN PAGE
// ─────────────────────────────────────────────

export default function CoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Course | null>(null);
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [booked, setBooked] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [filterLevel, setFilterLevel] = useState("all");

  const goToTeacher = (teacherId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    router.push(`/teachers/${teacherId}`);
  };

  useEffect(() => {
    api
      .get<{ success: boolean; data: Course[] }>("/course")
      .then((res) => setCourses(res.data.data))
      .catch(() => setError("Failed to load courses. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  const toggleSave = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSaved((prev) => {
      const next = new Set(prev);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const levels = [
    "all",
    ...Array.from(new Set(courses.map((c) => c.level).filter(Boolean))),
  ];

  const filtered = courses.filter((c) => {
    const matchSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase()) ||
      c.subject?.toLowerCase().includes(search.toLowerCase());
    const matchLevel = filterLevel === "all" || c.level === filterLevel;
    return matchSearch && matchLevel;
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');

        * { box-sizing: border-box; }

        .courses-root {
          font-family: 'Nunito', sans-serif;
          min-height: 100vh;
          background: #F0F6FA;
          padding: 0 0 60px;
        }

        /* HEADER */
        .courses-header {
          background: linear-gradient(135deg, #1F3745 0%, #2F556B 100%);
          padding: 48px 32px 32px;
          position: relative;
          overflow: hidden;
        }

        .courses-header::after {
          content: '';
          position: absolute;
          width: 320px; height: 320px;
          border-radius: 50%;
          background: rgba(255,255,255,0.04);
          top: -80px; right: -60px;
          pointer-events: none;
        }

        .courses-header-inner {
          max-width: 1600px;
          margin: 0 auto;
        }

        .courses-header h1 {
          margin: 0 0 6px;
          color: #EBF3F8;
          font-size: 2rem;
          font-weight: 900;
          letter-spacing: -.5px;
        }

        .courses-header p {
          margin: 0 0 24px;
          color: rgba(235,243,248,0.65);
          font-size: .95rem;
        }

        /* SEARCH + FILTERS */
        .courses-controls {
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
        }

        .search-wrap {
          position: relative;
          flex: 1;
          min-width: 200px;
        }

        .search-wrap svg {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
        }

        .courses-search {
          width: 100%;
          padding: 11px 14px 11px 40px;
          background: rgba(255,255,255,0.12);
          border: 1.5px solid rgba(235,243,248,0.25);
          border-radius: 12px;
          color: #EBF3F8;
          font-family: 'Nunito', sans-serif;
          font-size: .9rem;
          font-weight: 600;
          outline: none;
          transition: all .2s;
        }

        .courses-search::placeholder { color: rgba(235,243,248,0.45); }
        .courses-search:focus { border-color: rgba(235,243,248,0.5); background: rgba(255,255,255,0.18); }

        .filter-btn {
          padding: 10px 18px;
          border-radius: 12px;
          border: 1.5px solid rgba(235,243,248,0.25);
          background: transparent;
          color: rgba(235,243,248,0.7);
          font-family: 'Nunito', sans-serif;
          font-weight: 700;
          font-size: .82rem;
          cursor: pointer;
          transition: all .2s;
          text-transform: capitalize;
          white-space: nowrap;
        }

        .filter-btn.active {
          background: #EBF3F8;
          border-color: #EBF3F8;
          color: #1F3745;
        }

        /* GRID */
        .courses-body {
          max-width: 1600px;
          margin: 0 auto;
          padding: 32px 20px 0;
        }

        .courses-count {
          font-size: .82rem;
          color: #547C90;
          font-weight: 700;
          margin-bottom: 20px;
        }

        .courses-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 22px;
        }

        /* STATES */
        .courses-empty, .courses-error {
          text-align: center;
          padding: 64px 20px;
          color: #547C90;
        }

        .courses-empty h3, .courses-error h3 {
          font-size: 1.1rem;
          font-weight: 800;
          color: #2F556B;
          margin: 0 0 8px;
        }

        .courses-empty p, .courses-error p {
          font-size: .88rem;
          margin: 0;
        }

        /* SKELETON */
        .skeleton-card {
          background: #fff;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid #E2EDF3;
        }

        .skeleton-img {
          height: 180px;
          background: linear-gradient(90deg, #E2EDF3 25%, #EBF3F8 50%, #E2EDF3 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
        }

        .skeleton-body { padding: 16px 18px 18px; display: flex; flex-direction: column; gap: 10px; }

        .skeleton-line {
          height: 12px;
          border-radius: 6px;
          background: linear-gradient(90deg, #E2EDF3 25%, #EBF3F8 50%, #E2EDF3 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
        }

        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        @keyframes modalIn {
          from { opacity: 0; transform: scale(.96) translateY(12px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>

      <div className="courses-root">
        {/* Header */}
        <div className="courses-header">
          <div className="courses-header-inner">
            <h1>Explore Courses</h1>
            <p>Find the right teacher for every subject and level</p>
            <div className="courses-controls">
              <div className="search-wrap">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="rgba(235,243,248,0.5)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  className="courses-search"
                  placeholder="Search by title, subject…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              {levels.map((l) => (
                <button
                  key={l}
                  className={`filter-btn ${filterLevel === l ? "active" : ""}`}
                  onClick={() => setFilterLevel(l)}
                >
                  {l === "all" ? "All levels" : l}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="courses-body">
          {loading && (
            <div className="courses-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton-card">
                  <div className="skeleton-img" />
                  <div className="skeleton-body">
                    <div className="skeleton-line" style={{ width: "40%" }} />
                    <div className="skeleton-line" style={{ width: "80%" }} />
                    <div className="skeleton-line" style={{ width: "60%" }} />
                    <div className="skeleton-line" style={{ width: "90%" }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="courses-error">
              <h3>Something went wrong</h3>
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="courses-empty">
              <h3>No courses found</h3>
              <p>
                {search || filterLevel !== "all"
                  ? "Try adjusting your search or filters."
                  : "No published courses yet."}
              </p>
            </div>
          )}

          {!loading && !error && filtered.length > 0 && (
            <>
              <p className="courses-count">
                {filtered.length} course{filtered.length !== 1 ? "s" : ""} found
              </p>
              <div className="courses-grid">
                {filtered.map((course) => (
                  <CourseCard
                    key={course._id}
                    course={course}
                    saved={saved.has(course._id)}
                    onSave={(e) => toggleSave(course._id, e)}
                    onClick={() => setSelected(course)}
                    onTeacherClick={(e) => goToTeacher(course.teacher._id, e)}
                    isBooked={booked.has(course._id)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <CourseModal
          course={selected}
          saved={saved.has(selected._id)}
          onSave={() => toggleSave(selected._id)}
          onClose={() => setSelected(null)}
          onTeacherClick={() => goToTeacher(selected.teacher._id)}
          isBooked={booked.has(selected._id)}
          onBook={() => setBooked((prev) => new Set(prev).add(selected._id))}
        />
      )}
    </>
  );
}
