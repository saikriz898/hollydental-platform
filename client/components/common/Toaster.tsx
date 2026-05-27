"use client";

import { useEffect } from "react";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  X,
  ShieldAlert,
} from "lucide-react";
import { useToastStore, type ToastItem } from "@/store/useToast";

const VARIANT_STYLES: Record<
  ToastItem["variant"],
  { icon: React.ReactNode; ring: string; iconBg: string; title: string }
> = {
  success: {
    icon: <CheckCircle2 className="w-4 h-4" />,
    ring: "border-emerald-200",
    iconBg: "bg-emerald-50 text-emerald-600",
    title: "Success",
  },
  error: {
    icon: <XCircle className="w-4 h-4" />,
    ring: "border-red-200",
    iconBg: "bg-red-50 text-red-600",
    title: "Something went wrong",
  },
  warning: {
    icon: <AlertTriangle className="w-4 h-4" />,
    ring: "border-amber-200",
    iconBg: "bg-amber-50 text-amber-600",
    title: "Heads up",
  },
  info: {
    icon: <Info className="w-4 h-4" />,
    ring: "border-gray-200",
    iconBg: "bg-navy/5 text-navy",
    title: "Notice",
  },
};

export default function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  const confirms = useToastStore((s) => s.confirms);
  const dismiss = useToastStore((s) => s.dismiss);
  const resolveConfirm = useToastStore((s) => s.resolveConfirm);

  // Lock background scroll while a confirm is open.
  useEffect(() => {
    if (confirms.length === 0) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [confirms.length]);

  return (
    <>
      {/* Toast stack — bottom-right on desktop, bottom-center on mobile */}
      <div className="pointer-events-none fixed bottom-4 inset-x-4 sm:inset-x-auto sm:right-6 z-[100] flex flex-col gap-2 sm:max-w-sm w-auto">
        {toasts.map((t) => {
          const style = VARIANT_STYLES[t.variant];
          return (
            <div
              key={t.id}
              role="status"
              className={`pointer-events-auto bg-white shadow-xl border ${style.ring} rounded-2xl px-4 py-3 flex items-start gap-3 animate-fade-up`}
            >
              <span
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${style.iconBg}`}
              >
                {style.icon}
              </span>
              <div className="flex-1 min-w-0 text-navy">
                <p className="text-xs font-bold leading-tight">
                  {t.title || style.title}
                </p>
                <p className="text-xs text-gray-600 leading-snug mt-0.5 break-words">
                  {t.message}
                </p>
              </div>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                aria-label="Dismiss"
                className="text-gray-400 hover:text-navy transition-colors p-1 -mr-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Confirm dialogs — only the latest is shown */}
      {confirms.map((c, idx) => {
        if (idx !== confirms.length - 1) return null;
        return (
          <div
            key={c.id}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`confirm-${c.id}-title`}
          >
            <div
              className="absolute inset-0 bg-navy/40 backdrop-blur-sm animate-fade-in"
              onClick={() => resolveConfirm(c.id, false)}
            />
            <div className="relative bg-white border border-gray-100 rounded-2xl shadow-2xl max-w-sm w-full p-6 space-y-4 animate-fade-up z-10">
              <div className="flex items-start gap-3">
                <span
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    c.danger
                      ? "bg-red-50 text-red-600"
                      : "bg-gold/10 text-gold"
                  }`}
                >
                  <ShieldAlert className="w-4 h-4" />
                </span>
                <div className="space-y-1.5 flex-1 min-w-0">
                  <h3
                    id={`confirm-${c.id}-title`}
                    className="font-serif text-base font-bold text-navy leading-tight"
                  >
                    {c.title}
                  </h3>
                  {c.message && (
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {c.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => resolveConfirm(c.id, false)}
                  className="text-xs font-semibold text-navy border border-gray-200 hover:border-navy px-4 py-2 rounded-lg transition-colors"
                >
                  {c.cancelText}
                </button>
                <button
                  type="button"
                  onClick={() => resolveConfirm(c.id, true)}
                  className={`text-xs font-bold px-4 py-2 rounded-lg shadow transition-colors ${
                    c.danger
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "bg-gold hover:bg-gold-dark text-navy"
                  }`}
                >
                  {c.confirmText}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
