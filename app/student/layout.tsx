import StudentNavbar from "@/components/student/navbar";
import StudentSidebar from "@/components/student/sidebar";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <StudentSidebar />
      <div className="flex-1">
        <StudentNavbar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
