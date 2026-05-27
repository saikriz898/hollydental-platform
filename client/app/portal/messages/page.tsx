"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { useChatThread } from "@/lib/useChatThread";
import { CLINIC } from "@/lib/constants";
import { toast } from "@/lib/toast";
import {
  Send,
  ChevronLeft,
  RefreshCw,
  AlertCircle,
  Trash2,
  Check,
  CheckCheck,
} from "lucide-react";

export default function PortalMessagesPage() {
  const { user } = useAuthStore();
  const patientId = user?.patientProfile?.id || null;

  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const {
    messages,
    loading,
    error,
    refetch,
    sendMessage,
    deleteMessage,
    markRead,
  } = useChatThread({ patientId, selfRole: "patient" });

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

  // Scroll the inner thread to the bottom when new messages arrive — only
  // when the patient is already at the bottom; otherwise show a pill.
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

  // Mark the thread read when the page becomes visible.
  useEffect(() => {
    if (!patientId) return;
    markRead();
    const onFocus = () => markRead();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [patientId, markRead]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = input.trim();
    if (!body || sending || !patientId) return;
    setSending(true);
    setSendError(null);
    try {
      await sendMessage(body);
      setInput("");
    } catch (err: any) {
      setSendError(err?.message || "Failed to send. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (id: string) => {
    const ok = await toast.confirm({
      title: "Delete message?",
      message: "This can't be undone.",
      confirmText: "Delete",
      danger: true,
    });
    if (!ok) return;
    try {
      await deleteMessage(id);
    } catch (err: any) {
      toast.error(err?.message || "Couldn't delete the message.");
    }
  };

  const lastMessage = messages[messages.length - 1];

  return (
    <div className="flex flex-col h-full">
      <div className="border border-gray-100 bg-white rounded-2xl overflow-hidden shadow-card grid grid-cols-1 lg:grid-cols-12 flex-1 min-h-0">
        <aside className="hidden lg:flex lg:col-span-4 border-r border-gray-100 p-4 space-y-4 flex-col h-full min-h-0 overflow-y-auto overscroll-contain shrink-0">
          <h3 className="font-serif text-sm font-bold text-navy shrink-0">Conversations</h3>
          <div className="border border-gold bg-gold/5 rounded-xl p-3 flex gap-3 cursor-pointer shrink-0">
            <div className="w-10 h-10 rounded-full bg-navy text-gold flex items-center justify-center font-bold text-xs shrink-0">
              RA
            </div>
            <div className="truncate flex-1">
              <span className="block text-xs font-bold text-navy truncate">
                {CLINIC.name} Support
              </span>
              <span className="block text-[10px] text-gray-400 truncate mt-0.5">
                {lastMessage
                  ? lastMessage.deleted
                    ? "Message deleted"
                    : lastMessage.body
                  : "Clinic responds within 24h"}
              </span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0 animate-pulse" />
          </div>
        </aside>

        <section className="col-span-1 lg:col-span-8 flex flex-col h-full min-h-0 bg-gray-50/50 overflow-hidden">
        <header className="bg-white border-b border-gray-100 p-4 flex items-center gap-3 shrink-0">
          <Link
            href="/portal/dashboard"
            className="lg:hidden text-navy hover:text-gold mr-1 focus:outline-none"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="w-9 h-9 rounded-full bg-navy text-gold flex items-center justify-center font-bold text-xs">
            RA
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-navy truncate">
              {CLINIC.name} Clinical Office
            </h4>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] text-gray-400 font-semibold">
                {loading
                  ? "Refreshing…"
                  : error
                  ? "Connection issue"
                  : "Live · auto-refresh every 5s"}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={refetch}
            className="text-[11px] inline-flex items-center gap-1.5 text-gold hover:text-gold-dark transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </header>

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="relative flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 space-y-3"
        >
          {loading && messages.length === 0 ? (
            <div className="text-center text-xs text-gray-400 py-10">
              Loading messages thread…
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center text-xs text-gray-400 py-10 max-w-sm mx-auto leading-relaxed">
              No messages yet. Send your first note to the clinic below — Dr. Roghay
              and the team typically respond within 24 hours.
            </div>
          ) : (
            messages.map((msg) => {
              const isPatient = msg.senderRole === "patient";
              const isPending = msg.id.startsWith("temp-");
              const isFailed = (msg as any).failed === true;
              const initial =
                (user?.patientProfile?.firstName?.[0] || "P").toUpperCase();
              return (
                <ChatBubble
                  key={msg.id}
                  side={isPatient ? "right" : "left"}
                  avatar={isPatient ? initial : "RA"}
                  pending={isPending}
                  failed={isFailed}
                  message={msg}
                  canDelete={false}
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
              placeholder="Type a message to Dr. Roghay…"
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
              ? `bg-gold text-navy ${
                  isRight ? "rounded-tr-none" : ""
                } font-medium ${pending ? "opacity-70" : ""} ${
                  failed ? "ring-1 ring-red-300" : ""
                }`
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
