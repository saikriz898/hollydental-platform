"use client";

import { useToastStore, type ToastVariant } from "@/store/useToast";

interface ToastOptions {
  title?: string;
  durationMs?: number;
}

interface ConfirmOptions {
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
}

const DEFAULT_DURATION = 4500;

function show(variant: ToastVariant, message: string, options?: ToastOptions) {
  return useToastStore.getState().push({
    variant,
    message,
    title: options?.title,
    durationMs: options?.durationMs ?? DEFAULT_DURATION,
  });
}

/**
 * Tiny imperative toast API used across the app. Prefer this over the native
 * window.alert/confirm dialogs so we get consistent styling and zero browser
 * chrome flicker.
 */
export const toast = {
  success: (message: string, options?: ToastOptions) =>
    show("success", message, options),
  error: (message: string, options?: ToastOptions) =>
    show("error", message, options),
  info: (message: string, options?: ToastOptions) =>
    show("info", message, options),
  warning: (message: string, options?: ToastOptions) =>
    show("warning", message, options),
  dismiss: (id: string) => useToastStore.getState().dismiss(id),
  /**
   * Promise-based confirm dialog. Resolves true when the user clicks confirm,
   * false otherwise. Pass `danger: true` for destructive actions.
   */
  confirm: (options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      useToastStore.getState().pushConfirm({
        title: options.title,
        message: options.message,
        confirmText: options.confirmText || "Confirm",
        cancelText: options.cancelText || "Cancel",
        danger: options.danger,
        resolve,
      });
    });
  },
};

export default toast;
