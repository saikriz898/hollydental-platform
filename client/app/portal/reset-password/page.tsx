"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock, CheckCircle2, ShieldAlert, KeyRound, Mail } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { toast } from "@/lib/toast";

const PASSWORD_RULE =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/;

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const passwordValid = PASSWORD_RULE.test(password);
  const passwordsMatch = password.length > 0 && password === confirm;
  const formValid =
    email.includes("@") && code.length >= 6 && passwordValid && passwordsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!passwordValid) {
      setError(
        "Password must be at least 10 characters and include upper, lower, digit and one of @$!%*?&."
      );
      return;
    }
    if (!passwordsMatch) {
      setError("Passwords don't match.");
      return;
    }
    setSubmitting(true);
    try {
      await apiRequest("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({
          email: email.trim(),
          code: code.trim().toUpperCase(),
          newPassword: password,
        }),
      });
      setDone(true);
      toast.success("Password reset. Please sign in with the new password.");
    } catch (err: any) {
      setError(err?.message || "Could not reset your password. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[480px] bg-white rounded-2xl p-8 border border-gray-100 shadow-2xl space-y-6">
      <div className="w-12 h-12 rounded-full bg-gold/10 text-gold flex items-center justify-center mx-auto">
        <Lock className="w-6 h-6" />
      </div>

      {done ? (
        <div className="text-center space-y-4">
          <div className="text-emerald-500 text-sm font-bold flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-5 h-5" /> Password Reset Complete
          </div>
          <p className="text-gray-500 text-xs leading-relaxed">
            Your credentials have been updated. You can now sign in with your
            new password.
          </p>
          <Link
            href="/portal/login"
            className="bg-gold hover:bg-gold-dark text-navy font-bold text-xs py-2.5 px-6 rounded-lg inline-block shadow"
          >
            Sign In Now
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <h2 className="font-serif text-2xl font-bold text-navy">
              Reset your password
            </h2>
            <p className="text-gray-500 text-xs leading-relaxed">
              Enter the 8-character reset code provided by the clinic, then
              choose a new secure password.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-xs p-3 rounded-lg flex items-center gap-2.5">
              <ShieldAlert className="w-4 h-4 text-red-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field
              label="Email"
              icon={<Mail className="w-3.5 h-3.5 text-gold" />}
            >
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field
              label="Reset code"
              icon={<KeyRound className="w-3.5 h-3.5 text-gold" />}
            >
              <input
                type="text"
                required
                maxLength={12}
                placeholder="ABCD1234"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className={`${inputClass} tracking-[0.4em] font-mono uppercase`}
              />
            </Field>
            <Field
              label="New password"
              icon={<Lock className="w-3.5 h-3.5 text-gold" />}
            >
              <input
                type="password"
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field
              label="Confirm password"
              icon={<Lock className="w-3.5 h-3.5 text-gold" />}
            >
              <input
                type="password"
                required
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className={inputClass}
              />
            </Field>
            <button
              type="submit"
              disabled={!formValid || submitting}
              className="w-full bg-gold hover:bg-gold-dark text-navy font-bold py-3 rounded-lg text-xs uppercase tracking-wider shadow-md disabled:opacity-40 transition-colors"
            >
              {submitting ? "Updating…" : "Reset password"}
            </button>
          </form>
          <p className="text-[11px] text-gray-500 text-center">
            Need a new code? Use{" "}
            <Link
              href="/portal/forgot-password"
              className="text-gold font-bold hover:underline"
            >
              forgot password
            </Link>{" "}
            again.
          </p>
        </div>
      )}
    </div>
  );
}

const inputClass =
  "w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-navy placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-gold focus:ring-1 focus:ring-gold transition-colors";

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-bold text-navy uppercase tracking-wider flex items-center gap-1.5">
        {icon}
        {label}
      </label>
      {children}
    </div>
  );
}
