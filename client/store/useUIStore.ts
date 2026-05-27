import { create } from "zustand";

export type LoginModalView = "signin" | "forgot" | "force-change-password";

interface UIState {
  isLoginModalOpen: boolean;
  isRegisterModalOpen: boolean;
  loginModalView: LoginModalView;
  /** Pre-selected service slug for the booking flow (e.g. when arriving from a service page). */
  bookingServiceSlug: string | null;
  onLoginSuccess: (() => void) | null;
  openLoginModal: (
    onSuccess?: () => void,
    options?: { view?: LoginModalView }
  ) => void;
  closeLoginModal: () => void;
  setLoginModalView: (view: LoginModalView) => void;
  openRegisterModal: () => void;
  closeRegisterModal: () => void;
  setBookingServiceSlug: (slug: string | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isLoginModalOpen: false,
  isRegisterModalOpen: false,
  loginModalView: "signin",
  bookingServiceSlug: null,
  onLoginSuccess: null,
  openLoginModal: (onSuccess, options) =>
    set({
      isLoginModalOpen: true,
      isRegisterModalOpen: false,
      loginModalView: options?.view || "signin",
      onLoginSuccess: onSuccess || null,
    }),
  closeLoginModal: () =>
    set({ isLoginModalOpen: false, onLoginSuccess: null, loginModalView: "signin" }),
  setLoginModalView: (view) => set({ loginModalView: view }),
  openRegisterModal: () =>
    set({
      isRegisterModalOpen: true,
      isLoginModalOpen: false,
    }),
  closeRegisterModal: () => set({ isRegisterModalOpen: false }),
  setBookingServiceSlug: (slug) => set({ bookingServiceSlug: slug }),
}));
