"use client";

import { createContext, useContext, useState } from "react";

export type StudentTab =
  | "dashboard"
  | "courses"
  | "bookings"
  | "profile"
  | "findTeacher";

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
  const [activeTab, setActiveTab] = useState<StudentTab>("dashboard");
  return (
    <TabContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabContext.Provider>
  );
}

export const useStudentTab = () => useContext(TabContext);
