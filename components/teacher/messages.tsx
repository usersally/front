"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

// Placeholder conversations — replace with real API data when messaging backend is ready
const MOCK_CONVERSATIONS = [
  {
    id: "1",
    name: "Sara Benali",
    lastMessage: "When is the next session?",
    time: "10:24",
    unread: 2,
    initials: "SB",
  },
  {
    id: "2",
    name: "Omar Taleb",
    lastMessage: "Thank you for the explanation!",
    time: "09:15",
    unread: 0,
    initials: "OT",
  },
  {
    id: "3",
    name: "Rania Larbi",
    lastMessage: "Can I reschedule Friday?",
    time: "Yesterday",
    unread: 1,
    initials: "RL",
  },
  {
    id: "4",
    name: "Amine Khelifi",
    lastMessage: "I sent you the homework.",
    time: "Yesterday",
    unread: 0,
    initials: "AK",
  },
];

export default function TeacherMessagesPage() {
  const [active, setActive] = useState<string | null>(null);

  const activeConv = MOCK_CONVERSATIONS.find((c) => c.id === active);

  return (
    <div className="p-6 min-h-screen bg-[#EBF3F8]">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-[#1F3745] tracking-tight">
          Messages
        </h1>
        <p className="text-sm text-[#547C90] mt-1">
          Your conversations with students
        </p>
      </div>

      <div
        className="bg-white rounded-2xl border border-[#D4E8F0] shadow-sm overflow-hidden
        flex h-[calc(100vh-180px)]"
      >
        {/* ── Conversation list ── */}
        <div className="w-72 border-r border-[#EBF3F8] flex flex-col shrink-0">
          {/* Search */}
          <div className="p-4 border-b border-[#EBF3F8]">
            <div className="relative">
              <Icon
                icon="mdi:magnify"
                width={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#547C90]"
              />
              <input
                placeholder="Search…"
                className="w-full pl-8 pr-3 py-2 rounded-xl border border-[#D4E8F0] text-sm
                  text-[#1F3745] focus:outline-none focus:ring-2 focus:ring-[#2F556B]/20"
              />
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#F7FBFD]">
            {MOCK_CONVERSATIONS.map((c) => (
              <button
                key={c.id}
                onClick={() => setActive(c.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-left
                  hover:bg-[#F7FBFD] transition-colors duration-150 cursor-pointer
                  ${active === c.id ? "bg-[#EBF3F8]" : ""}`}
              >
                {/* Avatar */}
                <div
                  className="w-10 h-10 rounded-full bg-[#2F556B] text-white shrink-0
                  flex items-center justify-center text-xs font-bold"
                >
                  {c.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-[#1F3745] truncate">
                      {c.name}
                    </span>
                    <span className="text-[10px] text-[#547C90] shrink-0 ml-1">
                      {c.time}
                    </span>
                  </div>
                  <p className="text-xs text-[#547C90] truncate mt-0.5">
                    {c.lastMessage}
                  </p>
                </div>
                {c.unread > 0 && (
                  <span
                    className="w-5 h-5 rounded-full bg-[#2F556B] text-white text-[10px]
                    font-bold flex items-center justify-center shrink-0"
                  >
                    {c.unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── Chat area ── */}
        <div className="flex-1 flex flex-col">
          {activeConv ? (
            <>
              {/* Chat header */}
              <div className="px-6 py-4 border-b border-[#EBF3F8] flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full bg-[#2F556B] text-white
                  flex items-center justify-center text-xs font-bold"
                >
                  {activeConv.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1F3745]">
                    {activeConv.name}
                  </p>
                  <p className="text-xs text-[#547C90]">Student</p>
                </div>
              </div>

              {/* Messages area */}
              <div className="flex-1 p-6 flex flex-col items-center justify-center text-[#547C90]">
                <Icon
                  icon="mdi:message-outline"
                  width={48}
                  className="opacity-20 mb-3"
                />
                <p className="text-sm opacity-50 text-center">
                  Messaging backend coming soon.
                  <br />
                  Wire up your WebSocket or REST endpoint here.
                </p>
              </div>

              {/* Input */}
              <div className="px-6 py-4 border-t border-[#EBF3F8] flex items-center gap-3">
                <input
                  placeholder="Type a message…"
                  className="flex-1 px-4 py-2.5 rounded-xl border border-[#D4E8F0] text-sm
                    text-[#1F3745] focus:outline-none focus:ring-2 focus:ring-[#2F556B]/20"
                />
                <button
                  className="w-10 h-10 rounded-xl bg-[#2F556B] text-white
                  flex items-center justify-center hover:bg-[#1F3745] transition-colors cursor-pointer"
                >
                  <Icon icon="mdi:send" width={18} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-[#547C90] gap-3">
              <Icon
                icon="mdi:message-text-outline"
                width={56}
                className="opacity-20"
              />
              <p className="text-base font-semibold opacity-40">
                Select a conversation
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
