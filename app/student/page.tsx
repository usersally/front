"use client";

import { Suspense } from "react";
import StudentDashboard from "@/components/student/dashboard";
import ExploreCoursesPage from "@/components/student/courses";
import MyBookingsPage from "@/components/student/myBooking";
import StudentProfilePage from "@/components/student/profile";
import FindTeacherPage from "@/components/student/findTeacher";
import StudentMessagesPage from "@/components/student/messages";
import { useStudentTab } from "@/components/student/Studenttabcontext";

export default function Page() {
  const { activeTab } = useStudentTab();

  return (
    <>
      {activeTab === "dashboard" && <StudentDashboard />}
      {activeTab === "courses" && <ExploreCoursesPage />}
      {activeTab === "bookings" && <MyBookingsPage />}
      {activeTab === "profile" && <StudentProfilePage />}
      {activeTab === "findTeacher" && <FindTeacherPage />}
      {activeTab === "messages" && (
        <Suspense fallback={<p className="p-6 text-sm text-[#547C90]">Loading messages…</p>}>
          <StudentMessagesPage />
        </Suspense>
      )}
    </>
  );
}
