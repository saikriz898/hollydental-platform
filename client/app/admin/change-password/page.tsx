"use client";

import dynamic from "next/dynamic";

// The change-password experience is identical for admins and patients;
// reuse the patient page component so we keep one source of truth.
const ChangePasswordPage = dynamic(
  () => import("@/app/portal/change-password/page"),
  { ssr: false }
);

export default function AdminChangePasswordPage() {
  return <ChangePasswordPage />;
}
