/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Mail, 
  Lock, 
  LogIn, 
  AlertCircle, 
  CheckCircle2, 
  Eye, 
  EyeOff,
  ShieldCheck,
  KeyRound,
  RefreshCw,
  ArrowLeft
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { getOrCreateDeviceId } from "../../utils/device";

interface LoginViewProps {
  onSuccess: (user: any, token?: string) => void;
  onNavigate: (tab: string) => void;
  initialEmail?: string;
}

export default function LoginView({ onSuccess, onNavigate, initialEmail = "" }: LoginViewProps) {
  const { isIndonesian } = useLanguage();

  const [rememberMe, setRememberMe] = useState(() => {
    try {
      return localStorage.getItem("talenthub_remember_me") === "true";
    } catch {
      return false;
    }
  });

  const [email, setEmail] = useState(() => {
    if (initialEmail) return initialEmail;
    try {
      if (localStorage.getItem("talenthub_remember_me") === "true") {
        return localStorage.getItem("talenthub_saved_email") || "";
      }
    } catch {}
    return "";
  });

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Multi-step device authentication state
  // "credentials" = Email & Password input step
  // "otp" = New device detected, 6-digit Email OTP required step
  const [authStep, setAuthStep] = useState<"credentials" | "otp">("credentials");
  const [otpCode, setOtpCode] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpCooldown, setOtpCooldown] = useState(0);
  const [devOtpHint, setDevOtpHint] = useState<string | null>(null);

  // Countdown timer for OTP resend cooldown
  useEffect(() => {
    if (otpCooldown <= 0) return;
    const timer = setInterval(() => {
      setOtpCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [otpCooldown]);

  const handleRememberToggle = (checked: boolean) => {
    setRememberMe(checked);
    if (!checked) {
      try {
        localStorage.removeItem("talenthub_remember_me");
        localStorage.removeItem("talenthub_saved_email");
      } catch {}
    }
  };

  /**
   * Step 1: Submit Email and Password.
   * If recognized device: logs in immediately.
   * If new / unrecognized device: triggers OTP email step.
   */
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email.trim() || !password) {
      setError(isIndonesian ? "Mohon isi semua bidang masuk." : "Please fill out all login fields.");
      return;
    }

    const trimmedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmedEmail)) {
      setError(isIndonesian ? "Silakan masukkan alamat email yang valid." : "Please enter a valid email address.");
      return;
    }

    setLoading(true);
    const deviceId = getOrCreateDeviceId();

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: trimmedEmail, 
          password, 
          rememberMe,
          deviceId 
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.unverified) {
          setError(data.error);
          setTimeout(() => {
            onNavigate(`verify-email?email=${encodeURIComponent(data.email)}`);
          }, 2000);
          return;
        }
        throw new Error(data.error || (isIndonesian ? "Gagal masuk. Periksa kembali kredensial Anda." : "Login failed. Please verify your credentials."));
      }

      // Check if new/unrecognized device requires Email OTP verification
      if (data.requiresOtp) {
        setAuthStep("otp");
        setOtpCode("");
        setOtpCooldown(45);
        if (data.devPreviewOtp) {
          setDevOtpHint(data.devPreviewOtp);
        }
        setSuccess(
          data.message || 
          (isIndonesian 
            ? "Perangkat baru terdeteksi. Kode OTP 6-digit telah dikirimkan ke email Anda." 
            : "New device detected. A 6-digit OTP has been dispatched to your email.")
        );
        return;
      }

      // Recognized Device: Login successful directly!
      if (data.token || data.sessionId) {
        try {
          localStorage.setItem("talenthub_session_token", data.token || data.sessionId);
          localStorage.setItem("talenthub_user", JSON.stringify(data.user));
        } catch {}
      }

      if (rememberMe) {
        try {
          localStorage.setItem("talenthub_remember_me", "true");
          localStorage.setItem("talenthub_saved_email", trimmedEmail);
        } catch {}
      } else {
        try {
          localStorage.removeItem("talenthub_remember_me");
          localStorage.removeItem("talenthub_saved_email");
        } catch {}
      }

      setSuccess(isIndonesian ? "Berhasil masuk! Menyiapkan ruang kerja Anda..." : "Successfully authenticated! Preparing workspace...");
      setTimeout(() => {
        onSuccess(data.user, data.token || data.sessionId);
      }, 700);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Step 2: Verify Email OTP for new/unrecognized device.
   * On success: trusts the device and logs into Dashboard.
   */
  const handleVerifyDeviceOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedOtp = otpCode.trim();

    if (!trimmedOtp || trimmedOtp.length !== 6) {
      setError(isIndonesian ? "Masukkan 6 digit kode OTP yang telah dikirim." : "Enter the 6-digit OTP code received.");
      return;
    }

    setOtpLoading(true);
    const deviceId = getOrCreateDeviceId();

    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmedEmail,
          code: trimmedOtp,
          rememberMe,
          deviceId
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || (isIndonesian ? "Verifikasi kode OTP gagal." : "OTP verification failed."));
      }

      setSuccess(isIndonesian ? "Perangkat berhasil diverifikasi! Mengalihkan ke Dasbor..." : "Device verified! Redirecting to Dashboard...");

      try {
        localStorage.setItem("talenthub_user", JSON.stringify(data.user));
        if (data.token || data.sessionId) {
          localStorage.setItem("talenthub_session_token", data.token || data.sessionId);
        }
        if (rememberMe) {
          localStorage.setItem("talenthub_remember_me", "true");
          localStorage.setItem("talenthub_saved_email", trimmedEmail);
        }
      } catch {}

      setTimeout(() => {
        onSuccess(data.user, data.token || data.sessionId);
      }, 600);

    } catch (err: any) {
      setError(err.message || (isIndonesian ? "Verifikasi kode OTP gagal." : "OTP verification failed."));
    } finally {
      setOtpLoading(false);
    }
  };

  /**
   * Resend OTP for new device verification
   */
  const handleResendOtp = async () => {
    if (otpCooldown > 0 || otpLoading) return;
    setError(null);
    setSuccess(null);
    setOtpLoading(true);

    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || (isIndonesian ? "Gagal mengirim ulang kode OTP." : "Failed to resend OTP code."));
      }

      setOtpCooldown(45);
      if (data.devPreviewOtp) {
        setDevOtpHint(data.devPreviewOtp);
      }
      setSuccess(data.message || (isIndonesian ? "Kode OTP baru telah dikirimkan ke email Anda." : "New OTP code sent to your email."));
    } catch (err: any) {
      setError(err.message || (isIndonesian ? "Terjadi kesalahan saat mengirim ulang OTP." : "Error resending OTP."));
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto my-12 p-8 bg-white rounded-3xl border border-slate-100 shadow-xl space-y-6" id="login-card-container">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          {authStep === "credentials" 
            ? (isIndonesian ? "Selamat Datang Kembali" : "Welcome Back")
            : (isIndonesian ? "Verifikasi Keamanan Perangkat" : "Device Security Verification")}
        </h2>
        <p className="text-xs text-slate-500 font-semibold leading-relaxed">
          {authStep === "credentials"
            ? (isIndonesian ? "Masukkan email dan kata sandi untuk mengakses portal TalentHub" : "Enter your email and password to enter your TalentHub workspace")
            : (isIndonesian ? `Perangkat baru terdeteksi. Masukkan kode OTP 6-digit yang dikirim ke ${email}` : `New device detected. Enter the 6-digit OTP sent to ${email}`)}
        </p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="flex items-start space-x-2.5 p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 text-xs font-semibold animate-shake" id="login-error-alert">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-start space-x-2.5 p-4 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 text-xs font-semibold" id="login-success-alert">
          <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{success}</span>
        </div>
      )}

      {/* STEP 1: Email and Password Form */}
      {authStep === "credentials" && (
        <form onSubmit={handlePasswordLogin} className="space-y-4" id="login-form" autoComplete="off" data-lpignore="true">
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wide">
              {isIndonesian ? "Alamat Email" : "Email Address"}
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                id="login-email-input"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-semibold text-slate-900"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wide">
                {isIndonesian ? "Kata Sandi" : "Password"}
              </label>
              <button
                id="forgot-password-link"
                type="button"
                onClick={() => onNavigate("forgot-password")}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
              >
                {isIndonesian ? "Lupa Kata Sandi?" : "Forgot Password?"}
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                id="login-password-input"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-semibold text-slate-900"
                required
                disabled={loading}
              />
              <button
                type="button"
                id="login-password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 transition-colors cursor-pointer"
                title={showPassword ? (isIndonesian ? "Sembunyikan kata sandi" : "Hide password") : (isIndonesian ? "Tampilkan kata sandi" : "Show password")}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center space-x-2 cursor-pointer select-none">
              <input
                id="login-remember-checkbox"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => handleRememberToggle(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                disabled={loading}
              />
              <span className="text-xs font-bold text-slate-600">
                {isIndonesian ? "Ingat saya di perangkat ini" : "Remember me on this device"}
              </span>
            </label>
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm py-3 px-4 rounded-xl shadow-lg shadow-blue-200 hover:shadow-xl transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center space-x-1.5">
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>{isIndonesian ? "Memverifikasi kredensial..." : "Verifying credentials..."}</span>
              </span>
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                <span>{isIndonesian ? "Masuk" : "Sign In"}</span>
              </>
            )}
          </button>
        </form>
      )}

      {/* STEP 2: Email OTP Form for New/Unrecognized Device */}
      {authStep === "otp" && (
        <form onSubmit={handleVerifyDeviceOtp} className="space-y-4" id="login-otp-form">
          <div className="p-3.5 bg-blue-50/80 rounded-2xl border border-blue-100 flex items-start space-x-2.5 text-xs text-blue-900 font-medium">
            <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              {isIndonesian 
                ? "Perangkat ini belum dikenali. Kami telah mengirimkan kode verifikasi 6-digit ke email Anda untuk mengamankan akun." 
                : "This device is not recognized yet. We sent a 6-digit verification OTP to your email to secure your account."}
            </span>
          </div>

          <div className="space-y-2.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wide">
                {isIndonesian ? "Kode OTP (6 Digit)" : "OTP Security Code (6 Digits)"}
              </label>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={otpCooldown > 0 || otpLoading}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 disabled:text-slate-400 disabled:no-underline hover:underline flex items-center space-x-1 cursor-pointer"
              >
                <RefreshCw className={`h-3 w-3 ${otpLoading ? "animate-spin" : ""}`} />
                <span>
                  {otpCooldown > 0 
                    ? (isIndonesian ? `Kirim ulang (${otpCooldown}s)` : `Resend (${otpCooldown}s)`)
                    : (isIndonesian ? "Kirim Ulang Kode" : "Resend Code")}
                </span>
              </button>
            </div>

            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                id="login-otp-code-input"
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                placeholder="123456"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-base tracking-widest font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-center sm:text-left"
                required
                autoFocus
                disabled={otpLoading}
              />
            </div>

            {/* Sandbox auto-fill helper for developer testing */}
            {devOtpHint && (
              <div className="p-3 bg-blue-50/90 border border-blue-200/80 rounded-xl flex items-center justify-between text-xs text-blue-900">
                <div className="flex items-center space-x-2">
                  <span className="font-bold">🔑 {isIndonesian ? "Kode Terkirim:" : "Dispatched OTP:"}</span>
                  <code className="bg-white px-2 py-0.5 rounded font-mono font-bold text-blue-700 border border-blue-200 text-sm">
                    {devOtpHint}
                  </code>
                </div>
                <button
                  type="button"
                  onClick={() => setOtpCode(devOtpHint)}
                  className="text-[11px] font-extrabold text-blue-600 hover:text-blue-800 bg-white px-2.5 py-1 rounded-md border border-blue-200 cursor-pointer transition-colors"
                >
                  {isIndonesian ? "Isi Otomatis" : "Auto-fill"}
                </button>
              </div>
            )}
          </div>

          <button
            id="login-verify-otp-btn"
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm py-3 px-4 rounded-xl shadow-lg shadow-blue-200 hover:shadow-xl transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            disabled={otpLoading || otpCode.length !== 6}
          >
            {otpLoading ? (
              <span className="flex items-center space-x-1.5">
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>{isIndonesian ? "Memvalidasi OTP..." : "Verifying OTP..."}</span>
              </span>
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                <span>{isIndonesian ? "Verifikasi OTP & Masuk" : "Verify OTP & Sign In"}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthStep("credentials");
              setError(null);
              setSuccess(null);
            }}
            className="w-full py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center justify-center space-x-1 cursor-pointer transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>{isIndonesian ? "Kembali ke Masuk Kata Sandi" : "Back to Password Login"}</span>
          </button>
        </form>
      )}

      {/* Footer link to Register */}
      <div className="text-center pt-2">
        <span className="text-xs text-slate-500 font-semibold">
          {isIndonesian ? "Belum punya akun TalentHub? " : "New to TalentHub? "}
        </span>
        <button
          id="login-signup-link"
          onClick={() => onNavigate("register")}
          className="text-xs font-black text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
        >
          {isIndonesian ? "Buat akun sekarang" : "Create an account"}
        </button>
      </div>
    </div>
  );
}
