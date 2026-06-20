"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";

import StudentNavbar from "../../components/student/navbar";
import StudentSidebar from "../../components/student/sidebar";
import { StudentTabProvider } from "../../components/student/Studenttabcontext";

function useAuthGuard() {
  const router = useRouter();

  if (typeof window !== "undefined") {
    const raw = localStorage.getItem("user");
    if (!raw) {
      router.push("/auth/login");
      return false;
    }
    const user = JSON.parse(raw);
    if (user.role !== "student") {
      router.push("/");
      return false;
    }
  }

  return true;
}

function StudentShell({ children }: { children: React.ReactNode }) {
  const authorized = useAuthGuard();

  if (!authorized) return null;

  return (
    <StudentTabProvider>
      <div className="flex min-h-screen bg-[#EBF3F8] overflow-hidden">
        <StudentSidebar />
        <div className="ml-64 flex flex-col flex-1 min-h-screen min-w-0">
          <StudentNavbar />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </StudentTabProvider>
  );
}

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={null}>
      <StudentShell>{children}</StudentShell>
    </Suspense>
  );
}
