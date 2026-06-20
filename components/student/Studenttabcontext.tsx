"use client";

import { createContext, useContext, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export type StudentTab =
  | "dashboard"
  | "courses"
  | "bookings"
  | "profile"
  | "findTeacher"
  | "messages";

const VALID_TABS: StudentTab[] = [
  "dashboard",
  "courses",
  "bookings",
  "profile",
  "findTeacher",
  "messages",
];

interface TabContextValue {
  activeTab: StudentTab;
  setActiveTab: (tab: StudentTab, extra?: { with?: string }) => void;
}

const TabContext = createContext<TabContextValue>({
  activeTab: "dashboard",
  setActiveTab: () => {},
});

export function StudentTabProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const tabFromUrl = searchParams.get("tab") as StudentTab | null;
  const activeTab =
    tabFromUrl && VALID_TABS.includes(tabFromUrl) ? tabFromUrl : "dashboard";

  const setActiveTab = useCallback(
    (tab: StudentTab, extra?: { with?: string }) => {
      const params = new URLSearchParams();
      params.set("tab", tab);
      if (extra?.with) params.set("with", extra.with);
      if (pathname === "/student") {
        router.replace(`/student?${params.toString()}`, { scroll: false });
      } else {
        router.push(`/student?${params.toString()}`);
      }
    },
    [pathname, router],
  );

  return (
    <TabContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabContext.Provider>
  );
}

export const useStudentTab = () => useContext(TabContext);
