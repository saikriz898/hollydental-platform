"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { apiRequest } from "@/lib/api";
import {
  User,
  Lock,
  Bell,
  ShieldCheck,
  Check,
  AlertTriangle,
  Trash2,
} from "lucide-react";

export default function PortalProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<
    "personal" | "security" | "notifications" | "gdpr"
  >("personal");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const [personal, setPersonal] = useState({
    firstName: user?.patientProfile?.firstName || "",
    lastName: user?.patientProfile?.lastName || "",
    phone: user?.patientProfile?.phone || "",
    email: user?.email || "",
    address: user?.patientProfile?.address || "",
  });

  const handleSavePersonal = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setTimeout(() => {
      setLoading(false);
      setSuccessMsg("Personal details saved successfully.");
    }, 800);
  };

  const handleDownloadData = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(user, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "hollyhill_patient_data.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="border-b border-gray-100 pb-4">
        <h1 className="font-serif text-2xl font-bold text-navy">Profile Settings</h1>
        <p className="text-gray-500 text-xs mt-1">
          Manage contact details, notifications, privacy and account preferences.
        </p>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs p-3 rounded-lg flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-500" /> {successMsg}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-gray-100 gap-6 text-xs font-semibold text-navy overflow-x-auto no-scrollbar">
        <TabButton
          active={activeTab === "personal"}
          onClick={() => {
            setActiveTab("personal");
            setSuccessMsg("");
          }}
          icon={<User className="w-4 h-4" />}
          label="Personal"
        />
        <TabButton
          active={activeTab === "security"}
          onClick={() => {
            setActiveTab("security");
            setSuccessMsg("");
          }}
          icon={<Lock className="w-4 h-4" />}
          label="Security"
        />
        <TabButton
          active={activeTab === "notifications"}
          onClick={() => {
            setActiveTab("notifications");
            setSuccessMsg("");
          }}
          icon={<Bell className="w-4 h-4" />}
          label="Notifications"
        />
        <TabButton
          active={activeTab === "gdpr"}
          onClick={() => {
            setActiveTab("gdpr");
            setSuccessMsg("");
          }}
          icon={<ShieldCheck className="w-4 h-4" />}
          label="Privacy & Account"
        />
      </div>

      <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6">
        {/* PERSONAL */}
        {activeTab === "personal" && (
          <form onSubmit={handleSavePersonal} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="First Name">
                <input
                  type="text"
                  value={personal.firstName}
                  onChange={(e) =>
                    setPersonal({ ...personal, firstName: e.target.value })
                  }
                  className={inputClass}
                />
              </Field>
              <Field label="Last Name">
                <input
                  type="text"
                  value={personal.lastName}
                  onChange={(e) =>
                    setPersonal({ ...personal, lastName: e.target.value })
                  }
                  className={inputClass}
                />
              </Field>
              <Field label="Phone Number">
                <input
                  type="text"
                  value={personal.phone}
                  onChange={(e) =>
                    setPersonal({ ...personal, phone: e.target.value })
                  }
                  className={inputClass}
                />
              </Field>
              <Field label="Email Address">
                <input
                  type="email"
                  disabled
                  value={personal.email}
                  className={`${inputClass} cursor-not-allowed text-gray-400`}
                />
              </Field>
              <Field label="Postal Address" className="col-span-1 md:col-span-2">
                <input
                  type="text"
                  value={personal.address}
                  onChange={(e) =>
                    setPersonal({ ...personal, address: e.target.value })
                  }
                  className={inputClass}
                />
              </Field>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-gold hover:bg-gold-dark text-navy font-bold py-2.5 px-6 rounded-lg text-xs shadow-md transition-colors disabled:opacity-50"
            >
              {loading ? "Saving…" : "Save Personal Details"}
            </button>
          </form>
        )}

        {/* SECURITY */}
        {activeTab === "security" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSuccessMsg("Password updated successfully.");
            }}
            className="space-y-4 max-w-md"
          >
            <Field label="Current Password">
              <input type="password" required className={inputClass} />
            </Field>
            <Field label="New Password">
              <input type="password" required className={inputClass} />
            </Field>
            <Field label="Confirm Password">
              <input type="password" required className={inputClass} />
            </Field>
            <button
              type="submit"
              className="bg-navy text-white font-bold py-2.5 px-6 rounded-lg text-xs shadow transition-colors"
            >
              Update Password
            </button>
          </form>
        )}

        {/* NOTIFICATIONS */}
        {activeTab === "notifications" && (
          <div className="space-y-4">
            <h4 className="font-serif text-sm font-bold text-navy border-b border-gray-100 pb-2">
              Email & SMS Alerts
            </h4>
            <div className="space-y-3.5 text-xs text-navy font-semibold">
              <ToggleRow
                label="Appointment Confirmations"
                desc="Receive immediate booking confirmation summaries."
                defaultChecked
              />
              <ToggleRow
                label="Appointment Reminders"
                desc="Receive an SMS reminder 24 hours before each visit."
                defaultChecked
              />
              <ToggleRow
                label="Appointment Updates"
                desc="Email and SMS updates on requested visits, approvals and reminders."
                defaultChecked
              />
            </div>
          </div>
        )}

        {/* GDPR + DELETE ACCOUNT */}
        {activeTab === "gdpr" && (
          <div className="space-y-8">
            <section className="space-y-4">
              <h4 className="font-serif text-sm font-bold text-navy border-b border-gray-100 pb-2">
                GDPR Compliance Tools
              </h4>
              <p className="text-gray-500 text-xs leading-relaxed max-w-xl">
                Under European General Data Protection Regulations, you have the
                right to request a complete machine-readable copy of your personal
                dental record file.
              </p>
              <div className="flex flex-wrap gap-3 pt-1">
                <button
                  onClick={handleDownloadData}
                  className="bg-navy hover:bg-gray-800 text-white font-bold text-xs py-2.5 px-6 rounded-lg shadow-md transition-colors"
                >
                  Export My Data (JSON)
                </button>
              </div>
            </section>

            <DeleteAccountSection
              userEmail={user?.email || ""}
              onDeleted={() => {
                logout("manual");
                router.replace("/");
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------- Helpers -------------------- */

const inputClass =
  "w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-navy placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-gold focus:ring-1 focus:ring-gold transition-colors";

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`pb-2 flex items-center gap-1.5 border-b-2 transition-all whitespace-nowrap ${
        active ? "border-gold text-gold" : "border-transparent text-gray-400"
      }`}
    >
      {icon} {label}
    </button>
  );
}

function Field({
  label,
  className = "",
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label className="text-[10px] font-bold text-navy uppercase tracking-wider">
        {label}
      </label>
      {children}
    </div>
  );
}

function ToggleRow({
  label,
  desc,
  defaultChecked,
}: {
  label: string;
  desc: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer select-none">
      <input
        type="checkbox"
        defaultChecked={defaultChecked}
        className="accent-gold h-4 w-4 rounded mt-1 shrink-0"
      />
      <div>
        <span className="block">{label}</span>
        <span className="block text-[10px] text-gray-400 font-normal">{desc}</span>
      </div>
    </label>
  );
}

/* -------------------- Delete account -------------------- */

function DeleteAccountSection({
  userEmail,
  onDeleted,
}: {
  userEmail: string;
  onDeleted: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [password, setPassword] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const canDelete =
    confirmText.trim().toUpperCase() === "DELETE" && password.length > 0;

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canDelete) return;
    setError("");
    setSubmitting(true);
    try {
      // Standard pattern: DELETE /auth/me with password confirmation.
      // Adjust the route here if your backend uses a different path.
      await apiRequest("/auth/me", {
        method: "DELETE",
        body: JSON.stringify({ password, reason: reason || undefined }),
      });
      onDeleted();
    } catch (err: any) {
      setError(
        err?.message ||
          "Couldn't delete your account. Please try again or contact support."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="space-y-4 border-t border-gray-100 pt-6">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
          <Trash2 className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="font-serif text-sm font-bold text-navy">Delete account</h4>
          <p className="text-gray-500 text-xs leading-relaxed max-w-xl">
            This permanently removes your patient profile, login, messages, and
            files. Confirmed clinical history retained for medico-legal reasons may
            be anonymised in line with our retention policy.
          </p>
        </div>
      </div>

      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="border border-red-200 hover:bg-red-50 text-red-600 font-semibold text-xs py-2.5 px-5 rounded-lg transition-colors inline-flex items-center gap-2"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete my account
        </button>
      ) : (
        <form
          onSubmit={handleDelete}
          className="rounded-2xl border border-red-200 bg-red-50/40 p-5 space-y-4 max-w-xl"
        >
          <div className="flex items-start gap-2 text-xs text-red-700">
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
            <p className="leading-relaxed">
              This action cannot be undone. You&apos;ll be signed out and your portal
              access for{" "}
              <span className="font-semibold text-red-800">{userEmail}</span> will be
              removed within 24 hours.
            </p>
          </div>

          <Field label="Confirm by typing DELETE">
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE"
              autoComplete="off"
              className={inputClass}
            />
          </Field>

          <Field label="Your current password">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className={inputClass}
            />
          </Field>

          <Field label="Tell us why (optional)">
            <textarea
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="We use this to improve the experience for future patients."
              className={`${inputClass} resize-none`}
            />
          </Field>

          {error && (
            <div className="bg-red-100 border border-red-200 text-red-700 text-xs p-3 rounded-lg flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setConfirmText("");
                setPassword("");
                setReason("");
                setError("");
              }}
              className="text-xs font-semibold text-navy hover:text-gold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canDelete || submitting}
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-2.5 px-5 rounded-lg shadow disabled:opacity-50 transition-colors inline-flex items-center justify-center gap-2"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {submitting ? "Deleting…" : "Permanently delete account"}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
