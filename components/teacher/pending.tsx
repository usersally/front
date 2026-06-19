"use client";

import { Icon } from "@iconify/react";
import { logout } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function TeacherPendingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#EBF3F8] flex items-center justify-center p-6">
      <div className="max-w-md w-full rounded-2xl bg-white border border-gray-100 shadow-sm p-8 text-center">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-[#EBF3F8]">
          <Icon icon="mdi:file-document-outline" width={40} color="#2F556B" />
        </div>
        <h1 className="text-2xl font-bold text-[#1F3745] mb-2">
          Application Under Review
        </h1>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          Thank you for applying to teach on CourSally. Our team is reviewing
          your CV. You will receive an email once your application is approved
          or rejected.
        </p>
        <div className="rounded-xl bg-amber-50 border border-amber-100 px-4 py-3 text-sm text-amber-700 mb-6">
          You cannot access the teacher dashboard until your CV is approved.
        </div>
        <button
          type="button"
          onClick={() => {
            logout();
            router.push("/auth/login");
          }}
          className="w-full rounded-xl bg-[#2F556B] py-2.5 text-sm font-semibold text-white hover:bg-[#1F3745] transition"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
