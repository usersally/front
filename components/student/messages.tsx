"use client";

import { useSearchParams } from "next/navigation";
import MessagesInbox from "@/components/messaging/inbox";

export default function StudentMessagesPage() {
  const searchParams = useSearchParams();
  const withUserId = searchParams.get("with");

  return (
    <MessagesInbox
      subtitle="Your conversations with teachers"
      initialPartnerId={withUserId}
    />
  );
}
