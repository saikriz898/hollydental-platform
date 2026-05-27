"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUIStore } from "@/store/useUIStore";

/**
 * Forgot password is a view inside the LoginModal. This standalone
 * route opens the modal directly on the forgot view and bounces home.
 */
export default function PortalForgotPasswordRedirect() {
  const router = useRouter();
  const { openLoginModal } = useUIStore();

  useEffect(() => {
    openLoginModal(undefined, { view: "forgot" });
    router.replace("/");
  }, [router, openLoginModal]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center text-navy">
      <p className="text-sm font-semibold">Opening account recovery…</p>
    </div>
  );
}
