/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Mail, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { getOrCreateDeviceId } from "../../utils/device";

interface EmailVerificationViewProps {
  onNavigate: (tab: string) => void;
  onSuccess?: (user: any, token?: string) => void;
  initialEmail?: string;
  initialCodeHint?: string;
}

export default function EmailVerificationView({ 
  onNavigate, 
  onSuccess,
  initialEmail = "", 
  initialCodeHint = "" 
}: EmailVerificationViewProps) {
  const { isIndonesian } = useLanguage();
  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState("");
  const [devCodeHint, setDevCodeHint] = useState<string | null>(initialCodeHint || null);
  const [resendCooldown, setResendCooldown] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (initialEmail) {
      setEmail(initialEmail);
    }
  }, [initialEmail]);

  useEffect(() => {
    if (initialCodeHint) {
      setDevCodeHint(initialCodeHint);
    }
  }, [initialCodeHint]);

  // Resend countdown timer logic
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const trimmedCode = code.trim();
    if (!trimmedCode) {
      setError(isIndonesian ? "Silakan masukkan kode verifikasi 6 digit." : "Please enter the 6-digit verification code.");
      return;
    }

    if (trimmedCode.length !== 6 || isNaN(Number(trimmedCode))) {
      setError(isIndonesian ? "Kode verifikasi harus terdiri dari 6 digit angka." : "Verification code must be exactly 6 numerical digits.");
      return;
    }

    setLoading(true);
    const deviceId = getOrCreateDeviceId();

    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: email.trim().toLowerCase(), 
          code: trimmedCode,
          deviceId
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || (isIndonesian ? "Verifikasi email gagal." : "Email verification failed."));
      }

      setSuccess(
        isIndonesian 
          ? "Alamat email Anda telah diverifikasi! Mengarahkan ke Dasbor..." 
          : "Your email address is verified! Redirecting to Dashboard..."
      );

      // Save user session and automatically log the user into the Dashboard
      if (data.user) {
        try {
          localStorage.setItem("talenthub_user", JSON.stringify(data.user));
          if (data.token || data.sessionId) {
            localStorage.setItem("talenthub_session_token", data.token || data.sessionId);
          }
        } catch {}
      }

      setTimeout(() => {
        if (onSuccess && data.user) {
          onSuccess(data.user, data.token || data.sessionId);
        } else if (data.user?.role) {
          onNavigate(`${data.user.role}-dashboard`);
        } else {
          onNavigate("candidate-dashboard");
        }
      }, 900);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError(null);
    setSuccess(null);

    if (!email.trim()) {
      setError(isIndonesian ? "Tentukan email Anda untuk meminta kode baru." : "Please specify your email to request a new code.");
      return;
    }

    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || (isIndonesian ? "Gagal mengirim ulang kode verifikasi." : "Failed to resend verification code."));
      }

      if (data.devVerificationCode) {
        setDevCodeHint(data.devVerificationCode);
      }
      setSuccess(isIndonesian 
        ? "Kode keamanan 6 digit baru telah dikirim. Silakan periksa kotak masuk email Anda." 
        : "A fresh 6-digit security code has been dispatched. Please check your email inbox.");
      setResendCooldown(60); // 60 seconds cooldown

    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto my-12 p-8 bg-white rounded-3xl border border-slate-100 shadow-xl space-y-6" id="email-verification-container">
      <div className="flex justify-center">
        <div className="bg-blue-50 text-blue-600 p-3.5 rounded-2xl border border-blue-100">
          <Mail className="h-6 w-6" />
        </div>
      </div>

      <div className="text-center space-y-2">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          {isIndonesian ? "Verifikasi Email" : "Verify Email"}
        </h2>
        <p className="text-xs text-slate-500 font-semibold leading-relaxed">
          {isIndonesian 
            ? <>Kami telah mengirimkan kode verifikasi ke <strong className="text-slate-700">{email || "email Anda"}</strong>. Masukkan di bawah ini untuk membuka akun Anda.</>
            : <>We sent a verification security code to <strong className="text-slate-700">{email || "your email"}</strong>. Enter it below to unlock workspace registration.</>}
        </p>
      </div>

      {error && (
        <div className="flex items-start space-x-2.5 p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 text-xs font-semibold animate-shake" id="verify-email-error">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-start space-x-2.5 p-4 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 text-xs font-semibold" id="verify-email-success">
          <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4.5" id="verify-email-form">
        <div className="space-y-1.5">
          <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wide">
            {isIndonesian ? "Kode 6-Digit Angka" : "6-Digit Numerical Code"}
          </label>
          <input
            id="verify-email-code-input"
            type="text"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            placeholder="000000"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-center text-xl font-black tracking-widest focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-900"
            required
            autoFocus
            disabled={loading}
          />
        </div>

        {/* Sandbox test helper */}
        {devCodeHint && (
          <div className="p-3 bg-blue-50/90 border border-blue-200/80 rounded-xl flex items-center justify-between text-xs text-blue-900">
            <div className="flex items-center space-x-2">
              <span className="font-bold">🔑 {isIndonesian ? "Kode Verifikasi:" : "Verification Code:"}</span>
              <code className="bg-white px-2 py-0.5 rounded font-mono font-bold text-blue-700 border border-blue-200 text-sm">
                {devCodeHint}
              </code>
            </div>
            <button
              type="button"
              onClick={() => setCode(devCodeHint)}
              className="text-[11px] font-extrabold text-blue-600 hover:text-blue-800 bg-white px-2.5 py-1 rounded-md border border-blue-200 cursor-pointer transition-colors"
            >
              {isIndonesian ? "Isi Otomatis" : "Auto-fill"}
            </button>
          </div>
        )}

        <button
          id="verify-email-submit-btn"
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm py-3 px-4 rounded-xl shadow-lg shadow-blue-200 hover:shadow-xl transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
          disabled={loading || code.trim().length !== 6}
        >
          {loading ? (
            <span className="flex items-center space-x-1.5">
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>{isIndonesian ? "Memverifikasi kode..." : "Verifying code..."}</span>
            </span>
          ) : (
            <span>{isIndonesian ? "Verifikasi & Masuk ke Dasbor" : "Verify & Enter Dashboard"}</span>
          )}
        </button>
      </form>

      <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
        <button
          id="verify-email-back-btn"
          onClick={() => onNavigate("login")}
          className="inline-flex items-center space-x-1 text-xs font-bold text-slate-500 hover:text-slate-900 cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>{isIndonesian ? "Kembali ke Masuk" : "Back to Login"}</span>
        </button>

        <button
          id="verify-email-resend-btn"
          type="button"
          onClick={handleResend}
          disabled={resendCooldown > 0}
          className={`font-black tracking-wide uppercase text-[11px] ${
            resendCooldown > 0
              ? "text-slate-400 cursor-not-allowed"
              : "text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
          }`}
        >
          {resendCooldown > 0 
            ? (isIndonesian ? `Kirim Ulang (${resendCooldown}d)` : `Resend Code (${resendCooldown}s)`)
            : (isIndonesian ? "Kirim Ulang Kode" : "Resend Security Code")}
        </button>
      </div>
    </div>
  );
}
