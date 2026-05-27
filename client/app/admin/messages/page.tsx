"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLiveData } from "@/lib/useLiveData";
import { useChatThread } from "@/lib/useChatThread";
import { toast } from "@/lib/toast";
import {
  Send,
  Search,
  RefreshCw,
  AlertCircle,
  MessageSquare,
  Trash2,
  Check,
  CheckCheck,
} from "lucide-react";

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
}

interface Thread {
  patientId: string;
  lastMessage: string | null;
  lastMessageAt: string | null;
  unreadFromPatient: number;
  patient?: Patient | null;
}

function normalizeThreads(raw: any): Thread[] {
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.threads)) return raw.threads;
  return [];
}

export default function AdminMessagesPage() {
  const [activePatientId, setActivePatientId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [stickToBottom, setStickToBottom] = useState(true);
  const [unseenCount, setUnseenCount] = useState(0);

  const scrollToBottom = (smooth = true) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({
      top: el.scrollHeight,
      behavior: smooth ? "smooth" : "auto",
    });
  };

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const distanceFromBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight;
    const atBottom = distanceFromBottom < 80;
    setStickToBottom(atBottom);
    if (atBottom) setUnseenCount(0);
  };

  const {
    data: threads = [],
    loading: tLoading,
    refetch: refetchThreads,
  } = useLiveData<Thread[]>("/messages", {
    intervalMs: 10000,
    select: normalizeThreads,
    initialData: [],
  });

  // Auto-pick the most recent thread once threads arrive
  useEffect(() => {
    if (!activePatientId && threads.length > 0) {
      setActivePatientId(threads[0].patientId);
    }
  }, [threads, activePatientId]);

  const {
    messages,
    loading: mLoading,
    error: mError,
    refetch: refetchMessages,
    sendMessage,
    deleteMessage,
    markRead,
  } = useChatThread({
    patientId: activePatientId,
    selfRole: "admin",
  });

  // Reset composer + auto-scroll on conversation switch
  useEffect(() => {
    setInput("");
    setSendError(null);
    setUnseenCount(0);
    setStickToBottom(true);
    // Jump to the bottom instantly on a fresh conversation switch.
    requestAnimationFrame(() => scrollToBottom(false));
  }, [activePatientId]);

  // Track new incoming messages — only auto-scroll if the user is already at
  // the bottom. Otherwise, surface a "new messages" pill so they don't lose
  // their place while scrolling history.
  const lastCountRef = useRef(0);
  useEffect(() => {
    const prev = lastCountRef.current;
    const next = messages.length;
    lastCountRef.current = next;
    if (next === 0) return;
    if (stickToBottom) {
      requestAnimationFrame(() => scrollToBottom(true));
      setUnseenCount(0);
    } else if (next > prev) {
      setUnseenCount((c) => c + (next - prev));
    }
  }, [messages.length, stickToBottom]);

  // Mark thread read whenever the active conversation changes or window focuses
  useEffect(() => {
    if (!activePatientId) return;
    markRead();
    const onFocus = () => markRead();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [activePatientId, markRead]);

  const filteredThreads = useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term) return threads;
    return threads.filter((t) => {
      const name =
        `${t.patient?.firstName || ""} ${t.patient?.lastName || ""}`.toLowerCase();
      return (
        name.includes(term) ||
        t.lastMessage?.toLowerCase().includes(term) ||
        t.patient?.email?.toLowerCase().includes(term)
      );
    });
  }, [threads, search]);

  const activeThread = threads.find((t) => t.patientId === activePatientId);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = input.trim();
    if (!body || sending || !activePatientId) return;
    setSending(true);
    setSendError(null);
    try {
      await sendMessage(body);
      setInput("");
      refetchThreads();
    } catch (err: any) {
      setSendError(err?.message || "Failed to send.");
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (id: string) => {
    const ok = await toast.confirm({
      title: "Delete this message?",
      message: "This can't be undone.",
      confirmText: "Delete",
      danger: true,
    });
    if (!ok) return;
    try {
      await deleteMessage(id);
      refetchThreads();
    } catch (err: any) {
      toast.error(err?.message || "Couldn't delete the message.");
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <header className="border-b border-gray-200 pb-4 flex items-center justify-between gap-4 flex-wrap shrink-0">
        <div className="space-y-1">
          <span className="inline-flex items-center gap-1.5 text-[10px] uppercase font-semibold tracking-widest text-gold bg-gold/10 px-2.5 py-1 rounded-full">
            <MessageSquare className="w-3 h-3" /> Live Messaging
          </span>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-navy">
            Patient Messages
          </h1>
          <p className="text-gray-500 text-xs md:text-sm leading-relaxed">
            Auto-refreshes every 5 seconds. Reply, mark read, or delete any reply.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            refetchThreads();
            refetchMessages();
          }}
          className="border border-gray-200 hover:border-gold hover:text-gold text-navy font-semibold px-3.5 py-2 rounded-lg text-xs flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${tLoading || mLoading ? "animate-spin" : ""}`}
          />{" "}
          Refresh
        </button>
      </header>

      <div className="border border-gray-100 bg-white rounded-2xl overflow-hidden shadow-card grid grid-cols-1 lg:grid-cols-12 flex-1 min-h-0">
        {/* Threads */}
        <aside className="lg:col-span-4 border-r border-gray-100 flex flex-col h-full min-h-0 overflow-hidden shrink-0">
          <div className="p-4 border-b border-gray-100 shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search patients…"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-xs text-navy placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
              />
            </div>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
            {tLoading && threads.length === 0 ? (
              <div className="p-6 text-xs text-gray-400 text-center">
                Loading conversations…
              </div>
            ) : filteredThreads.length === 0 ? (
              <div className="p-6 text-xs text-gray-400 text-center">
                {threads.length === 0
                  ? "No patient messages yet."
                  : "No threads match your search."}
              </div>
            ) : (
              filteredThreads.map((t) => {
                const isActive = t.patientId === activePatientId;
                const name =
                  `${t.patient?.firstName || ""} ${t.patient?.lastName || ""}`.trim() ||
                  "Patient";
                return (
                  <button
                    key={t.patientId}
                    type="button"
                    onClick={() => setActivePatientId(t.patientId)}
                    className={`w-full text-left flex items-start gap-3 px-4 py-3 border-b border-gray-50 transition-colors ${
                      isActive ? "bg-gold/5" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full bg-gold/10 text-gold flex items-center justify-center font-bold text-xs shrink-0">
                      {name[0]?.toUpperCase() || "P"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-navy truncate">
                          {name}
                        </span>
                        {t.unreadFromPatient > 0 && (
                          <span className="text-[10px] font-bold bg-red-500 text-white px-1.5 rounded-full shrink-0">
                            {t.unreadFromPatient}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-500 truncate">
                        {t.lastMessage || "No messages yet"}
                      </p>
                      {t.lastMessageAt && (
                        <span className="block text-[9px] text-gray-400 mt-0.5">
                          {new Date(t.lastMessageAt).toLocaleString([], {
                            month: "short",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* Conversation */}
        <section className="col-span-1 lg:col-span-8 flex flex-col h-full min-h-0 bg-gray-50/40 overflow-hidden">
          {!activePatientId ? (
            <div className="flex-1 flex items-center justify-center text-xs text-gray-400 px-6 text-center">
              Select a conversation from the list to start replying.
            </div>
          ) : (
            <>
              <header className="bg-white border-b border-gray-100 p-4 flex items-center gap-3 shrink-0">
                <div className="w-9 h-9 rounded-full bg-gold/10 text-gold flex items-center justify-center font-bold text-xs">
                  {activeThread?.patient?.firstName?.[0]?.toUpperCase() || "P"}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-navy truncate">
                    {activeThread?.patient
                      ? `${activeThread.patient.firstName} ${activeThread.patient.lastName}`
                      : "Patient"}
                  </h4>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] text-gray-400 font-semibold">
                      {mLoading
                        ? "Refreshing…"
                        : mError
                        ? "Connection issue"
                        : "Live · auto-refresh every 5s"}
                    </span>
                  </div>
                </div>
              </header>

              <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="relative flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 space-y-3"
              >
                {mLoading && messages.length === 0 ? (
                  <div className="text-center text-xs text-gray-400 py-10">
                    Loading thread…
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-xs text-gray-400 py-10">
                    No messages yet — send the first reply below.
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isAdmin = msg.senderRole === "admin";
                    const isPending = msg.id.startsWith("temp-");
                    const isFailed = (msg as any).failed === true;
                    return (
                      <ChatBubble
                        key={msg.id}
                        side={isAdmin ? "right" : "left"}
                        avatar={
                          isAdmin
                            ? "RA"
                            : (activeThread?.patient?.firstName?.[0] || "P").toUpperCase()
                        }
                        pending={isPending}
                        failed={isFailed}
                        message={msg}
                        canDelete={false}
                        onDelete={() => handleDelete(msg.id)}
                      />
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {!stickToBottom && (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      scrollToBottom(true);
                      setStickToBottom(true);
                      setUnseenCount(0);
                    }}
                    className="absolute -top-12 left-1/2 -translate-x-1/2 bg-navy text-white text-[11px] font-semibold px-3 py-1.5 rounded-full shadow-lg hover:bg-navy/90 transition-colors flex items-center gap-1.5"
                  >
                    {unseenCount > 0
                      ? `${unseenCount} new ${
                          unseenCount === 1 ? "message" : "messages"
                        }`
                      : "Jump to latest"}
                    <span aria-hidden>↓</span>
                  </button>
                </div>
              )}

              <form
                onSubmit={handleSend}
                className="bg-white border-t border-gray-100 p-3 space-y-2 shrink-0"
              >
                {sendError && (
                  <div className="text-[11px] text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{sendError}</span>
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={`Reply to ${
                      activeThread?.patient?.firstName || "patient"
                    }…`}
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2.5 text-xs text-navy focus:outline-none focus:border-gold focus:bg-white transition-colors"
                    disabled={sending}
                  />
                  <button
                    type="submit"
                    disabled={sending || !input.trim()}
                    className="bg-gold hover:bg-gold-dark text-navy p-2.5 rounded-lg transition-colors focus:outline-none disabled:opacity-50"
                    aria-label="Send"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

/* -------------------- Bubble -------------------- */

interface BubbleProps {
  side: "left" | "right";
  avatar: string;
  pending?: boolean;
  failed?: boolean;
  canDelete?: boolean;
  onDelete?: () => void;
  message: {
    id: string;
    body: string;
    deleted?: boolean;
    createdAt: string;
    isRead?: boolean;
    readAt?: string | null;
  };
}

function ChatBubble({
  side,
  avatar,
  pending,
  failed,
  message,
  canDelete,
  onDelete,
}: BubbleProps) {
  const isRight = side === "right";

  return (
    <div
      className={`group flex gap-2.5 max-w-[85%] ${
        isRight ? "ml-auto flex-row-reverse" : "mr-auto"
      }`}
    >
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold ${
          isRight ? "bg-gold text-navy" : "bg-navy text-gold"
        }`}
      >
        {avatar}
      </div>
      <div className="flex flex-col items-end gap-1">
        <div
          className={`relative rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-sm ${
            isRight
              ? `bg-gold text-navy rounded-tr-none font-medium ${
                  pending ? "opacity-70" : ""
                } ${failed ? "ring-1 ring-red-300" : ""}`
              : "bg-white text-navy border border-gray-100 rounded-tl-none"
          } ${message.deleted ? "italic text-gray-400" : ""}`}
        >
          {canDelete && onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-2 -left-2 w-6 h-6 rounded-full bg-white border border-gray-200 shadow-sm text-red-500 flex items-center justify-center hover:bg-red-50"
              aria-label="Delete message"
              title="Delete message"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
          <p className="whitespace-pre-line break-words">
            {message.deleted
              ? "Message deleted"
              : message.body || "Message deleted"}
          </p>
          <div className="flex items-center justify-end gap-1 mt-1 text-[8px] font-semibold text-gray-400">
            <span>
              {pending
                ? "Sending…"
                : failed
                ? "Failed to send"
                : new Date(message.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
            </span>
            {isRight && !message.deleted && (
              <ReadReceipt
                isRead={!!message.isRead}
                pending={!!pending}
                failed={!!failed}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ReadReceipt({
  isRead,
  pending,
  failed,
}: {
  isRead: boolean;
  pending: boolean;
  failed: boolean;
}) {
  if (failed) return null;
  if (pending) {
    return <Check className="w-3 h-3 text-gray-400" aria-label="Sending" />;
  }
  return isRead ? (
    <CheckCheck className="w-3 h-3 text-emerald-600" aria-label="Read" />
  ) : (
    <CheckCheck className="w-3 h-3 text-gray-400" aria-label="Delivered" />
  );
}
