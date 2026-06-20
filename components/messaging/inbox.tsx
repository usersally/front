"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { api, getErrorMessage, getUser } from "@/lib/api";

interface Partner {
  _id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: string;
  email?: string;
}

interface Conversation {
  partnerId: string;
  partner: Partner | null;
  lastMessage: string;
  lastMessageAt: string;
  unread: number;
}

interface ChatMessage {
  _id: string;
  senderId: string;
  receiverId: string;
  body: string;
  read: boolean;
  createdAt: string;
}

interface MessagesInboxProps {
  subtitle: string;
  /** Open a thread with this user on mount (e.g. from teacher profile). */
  initialPartnerId?: string | null;
}

export default function MessagesInbox({
  subtitle,
  initialPartnerId = null,
}: MessagesInboxProps) {
  const currentUser = getUser();

  // ─────────────────────────────────────────────
  //  STATE
  // ─────────────────────────────────────────────
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activePartnerId, setActivePartnerId] = useState<string | null>(
    initialPartnerId,
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Which partner the current `messages` array belongs to — lets us derive
  // "thread is loading" below instead of storing a separate loading flag.
  const [messagesPartnerId, setMessagesPartnerId] = useState<string | null>(
    null,
  );

  const [draft, setDraft] = useState("");
  const [loadingList, setLoadingList] = useState(true);
  const [sending, setSending] = useState(false);

  // Cached profile for a partner with no conversation yet (e.g. clicked
  // "Message" from a teacher profile). fetchedPartnerId tracks which
  // partner it belongs to, so a stale fetch can't leak into the UI.
  const [fetchedPartner, setFetchedPartner] = useState<Partner | null>(null);
  const [fetchedPartnerId, setFetchedPartnerId] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // ─────────────────────────────────────────────
  //  DERIVED STATE
  // ─────────────────────────────────────────────
  const loadingThread =
    activePartnerId !== null && messagesPartnerId !== activePartnerId;

  // ─────────────────────────────────────────────
  //  DATA FETCHING
  // ─────────────────────────────────────────────
  const loadConversations = useCallback(async () => {
    try {
      const { data: res } = await api.get<{
        success: boolean;
        data: Conversation[];
      }>("/messages/conversations");
      setConversations(res.data);
      setLoadingList(false);
    } catch (err) {
      setError(getErrorMessage(err));
      setLoadingList(false);
    }
  }, []);

  const loadThread = useCallback(
    async (partnerId: string) => {
      try {
        const { data: res } = await api.get<{
          success: boolean;
          data: ChatMessage[];
        }>(`/messages/thread/${partnerId}`);
        setMessages(res.data);
        setMessagesPartnerId(partnerId);
        setError(null);
        await loadConversations();
      } catch (err) {
        setError(getErrorMessage(err));
      }
    },
    [loadConversations],
  );

  // ─────────────────────────────────────────────
  //  SYNC ACTIVE PARTNER FROM URL PROP
  //  (adjusted during render, not in an effect, so a `?with=` change
  //  doesn't trigger an extra cascading render)
  // ─────────────────────────────────────────────
  const [prevInitialPartnerId, setPrevInitialPartnerId] =
    useState(initialPartnerId);
  if (initialPartnerId !== prevInitialPartnerId) {
    setPrevInitialPartnerId(initialPartnerId);
    if (initialPartnerId) setActivePartnerId(initialPartnerId);
  }

  // ─────────────────────────────────────────────
  //  EFFECTS
  // ─────────────────────────────────────────────

  // Initial conversation list load
  useEffect(() => {
    Promise.resolve().then(() => loadConversations());
  }, [loadConversations]);

  // Load the active thread whenever the selected partner changes
  useEffect(() => {
    if (activePartnerId) {
      Promise.resolve().then(() => loadThread(activePartnerId));
    }
  }, [activePartnerId, loadThread]);

  // Keep the thread scrolled to the latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ─────────────────────────────────────────────
  //  PARTNER PROFILE LOOKUP (for brand-new conversations
  //  that don't appear in `conversations` yet)
  // ─────────────────────────────────────────────
  const activeConv = conversations.find((c) => c.partnerId === activePartnerId);

  const activePartner =
    activeConv?.partner ??
    (fetchedPartnerId === activePartnerId ? fetchedPartner : null);

  useEffect(() => {
    if (!activePartnerId || activeConv?.partner) return;

    let ignore = false;
    api
      .get<{ success: boolean; data: Partner }>(
        `/messages/partner/${activePartnerId}`,
      )
      .then((res) => {
        if (ignore) return;
        setFetchedPartner(res.data.data);
        setFetchedPartnerId(activePartnerId);
      })
      .catch(() => {
        if (ignore) return;
        setFetchedPartner(null);
        setFetchedPartnerId(activePartnerId);
      });
    return () => {
      ignore = true;
    };
  }, [activePartnerId, activeConv?.partner]);

  // ─────────────────────────────────────────────
  //  SEND MESSAGE
  // ─────────────────────────────────────────────
  async function handleSend() {
    if (!activePartnerId || !draft.trim()) return;
    setSending(true);
    setError(null);
    try {
      const { data: res } = await api.post<{
        success: boolean;
        data: ChatMessage;
      }>("/messages", {
        receiverId: activePartnerId,
        body: draft.trim(),
      });
      setMessages((prev) => [...prev, res.data]);
      setDraft("");
      await loadConversations();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSending(false);
    }
  }

  // ─────────────────────────────────────────────
  //  HELPERS
  // ─────────────────────────────────────────────
  const initials = (p?: Partner | null) =>
    p ? `${p.firstName?.[0] ?? ""}${p.lastName?.[0] ?? ""}`.toUpperCase() : "?";

  // ─────────────────────────────────────────────
  //  RENDER
  // ─────────────────────────────────────────────
  return (
    <div className="p-6 min-h-screen bg-[#EBF3F8]">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-[#1F3745] tracking-tight">
          Messages
        </h1>
        <p className="text-sm text-[#547C90] mt-1">{subtitle}</p>
      </div>

      {error && (
        <div className="mb-4 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-[#D4E8F0] shadow-sm overflow-hidden flex h-[calc(100vh-180px)]">
        {/* Conversation list */}
        <div className="w-72 border-r border-[#EBF3F8] flex flex-col shrink-0">
          <div className="p-4 border-b border-[#EBF3F8] text-xs font-semibold uppercase tracking-wider text-[#547C90]">
            Conversations
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-[#F7FBFD]">
            {loadingList ? (
              <p className="p-4 text-sm text-[#547C90]">Loading…</p>
            ) : conversations.length === 0 ? (
              <p className="p-4 text-sm text-[#8AAFC0]">
                No conversations yet. Message someone from their profile.
              </p>
            ) : (
              conversations.map((c) => (
                <button
                  key={c.partnerId}
                  type="button"
                  onClick={() => setActivePartnerId(c.partnerId)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-[#F7FBFD] transition-colors cursor-pointer ${
                    activePartnerId === c.partnerId ? "bg-[#EBF3F8]" : ""
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-[#2F556B] text-white shrink-0 flex items-center justify-center text-xs font-bold overflow-hidden">
                    {c.partner?.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={c.partner.avatar}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      initials(c.partner)
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-sm font-semibold text-[#1F3745] truncate">
                        {c.partner
                          ? `${c.partner.firstName} ${c.partner.lastName}`
                          : "User"}
                      </span>
                      {c.unread > 0 && (
                        <span className="w-5 h-5 rounded-full bg-[#2F556B] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                          {c.unread}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#547C90] truncate mt-0.5">
                      {c.lastMessage}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Active thread */}
        <div className="flex-1 flex flex-col min-w-0">
          {activePartnerId ? (
            <>
              <div className="px-6 py-4 border-b border-[#EBF3F8] flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#2F556B] text-white flex items-center justify-center text-xs font-bold overflow-hidden">
                  {activePartner?.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={activePartner.avatar}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    initials(activePartner)
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1F3745]">
                    {activePartner
                      ? `${activePartner.firstName} ${activePartner.lastName}`
                      : "Conversation"}
                  </p>
                  {activePartner && (
                    <p className="text-xs text-[#547C90] capitalize">
                      {activePartner.role}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-[#F6FAFD]">
                {loadingThread ? (
                  <p className="text-sm text-[#547C90] text-center">
                    Loading messages…
                  </p>
                ) : messages.length === 0 ? (
                  <p className="text-sm text-[#8AAFC0] text-center">
                    No messages yet. Say hello!
                  </p>
                ) : (
                  messages.map((m) => {
                    const mine = m.senderId === currentUser?._id;
                    return (
                      <div
                        key={m._id}
                        className={`flex ${mine ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                            mine
                              ? "bg-[#2F556B] text-white rounded-br-md"
                              : "bg-white border border-[#D4E8F0] text-[#1F3745] rounded-bl-md"
                          }`}
                        >
                          <p>{m.body}</p>
                          <p
                            className={`text-[10px] mt-1 ${mine ? "text-white/60" : "text-[#8AAFC0]"}`}
                          >
                            {new Date(m.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={bottomRef} />
              </div>

              <div className="px-6 py-4 border-t border-[#EBF3F8] flex items-center gap-3">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Type a message…"
                  className="flex-1 px-4 py-2.5 rounded-xl border border-[#D4E8F0] text-sm text-[#1F3745] focus:outline-none focus:ring-2 focus:ring-[#2F556B]/20"
                />
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={sending || !draft.trim()}
                  className="w-10 h-10 rounded-xl bg-[#2F556B] text-white flex items-center justify-center hover:bg-[#1F3745] transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Icon
                    icon={sending ? "mdi:loading" : "mdi:send"}
                    width={18}
                    className={sending ? "animate-spin" : ""}
                  />
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
