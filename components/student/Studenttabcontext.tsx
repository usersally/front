"use client";

import { createContext, useContext, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export type StudentTab =
  | "dashboard"
  | "courses"
  | "bookings"
  | "profile"
  | "findTeacher";

const VALID_TABS: StudentTab[] = [
  "dashboard",
  "courses",
  "bookings",
  "profile",
  "findTeacher",
];

interface TabContextValue {
  activeTab: StudentTab;
  setActiveTab: (tab: StudentTab) => void;
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
    (tab: StudentTab) => {
      if (pathname === "/student") {
        router.replace(`/student?tab=${tab}`, { scroll: false });
      } else {
        router.push(`/student?tab=${tab}`);
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
