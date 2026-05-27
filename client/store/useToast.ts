"use client";

import { create } from "zustand";

export type ToastVariant = "success" | "error" | "info" | "warning";

export interface ToastItem {
  id: string;
  variant: ToastVariant;
  title?: string;
  message: string;
  durationMs: number;
}

export interface ConfirmDialog {
  id: string;
  title: string;
  message?: string;
  confirmText: string;
  cancelText: string;
  danger?: boolean;
  resolve: (ok: boolean) => void;
}

interface ToastState {
  toasts: ToastItem[];
  confirms: ConfirmDialog[];
  push: (toast: Omit<ToastItem, "id">) => string;
  dismiss: (id: string) => void;
  pushConfirm: (dialog: Omit<ConfirmDialog, "id">) => string;
  resolveConfirm: (id: string, ok: boolean) => void;
}

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  confirms: [],
  push: (toast) => {
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `t_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    set((s) => ({ toasts: [...s.toasts, { id, ...toast }] }));
    if (toast.durationMs > 0) {
      setTimeout(() => get().dismiss(id), toast.durationMs);
    }
    return id;
  },
  dismiss: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
  pushConfirm: (dialog) => {
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `c_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    set((s) => ({ confirms: [...s.confirms, { id, ...dialog }] }));
    return id;
  },
  resolveConfirm: (id, ok) => {
    const target = get().confirms.find((c) => c.id === id);
    target?.resolve(ok);
    set((s) => ({ confirms: s.confirms.filter((c) => c.id !== id) }));
  },
}));
