import React, { useState, useEffect } from "react";
import { Lock, AlertCircle, CheckCircle2, ArrowLeft, KeyRound } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

interface ResetPasswordViewProps {
  onNavigate: (tab: string) => void;
  initialToken?: string;
}

export default function ResetPasswordView({ onNavigate, initialToken = "" }: ResetPasswordViewProps) {
  const { isIndonesian } = useLanguage();
  const [token, setToken] = useState(initialToken);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (initialToken) {
      setToken(initialToken);
    }
  }, [initialToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!token.trim() || !password || !confirmPassword) {
      setError(isIndonesian ? "Mohon isi semua bidang kata sandi baru." : "Please fill out all reset password fields.");
      return;
    }

    if (password.length < 8) {
      setError(isIndonesian ? "Kata sandi harus terdiri dari minimal 8 karakter." : "Password must be at least 8 characters long.");
      return;
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError(isIndonesian ? "Kata sandi harus mengandung setidaknya satu huruf dan satu angka." : "Password must contain at least one letter and one number.");
      return;
    }

    if (password !== confirmPassword) {
      setError(isIndonesian ? "Konfirmasi kata sandi tidak cocok." : "Passwords do not match. Please verify your entries.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: token.trim(), password, confirmPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || (isIndonesian ? "Gagal mengatur ulang kata sandi. Token tidak valid atau kadaluarsa." : "Password reset failed. Invalid or expired token."));
      }

      setSuccess(isIndonesian ? "Kata sandi berhasil diperbarui! Mengarahkan ke halaman masuk dalam 2 detik..." : "Your password has been successfully updated! Redirecting to login in 2 seconds...");
      setTimeout(() => {
        onNavigate("login");
      }, 2000);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto my-12 p-8 bg-white rounded-3xl border border-slate-100 shadow-xl space-y-6" id="reset-password-container">
      <div className="flex justify-center">
        <div className="bg-blue-50 text-blue-600 p-3.5 rounded-2xl border border-blue-100">
          <KeyRound className="h-6 w-6" />
        </div>
      </div>

      <div className="text-center space-y-2">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          {isIndonesian ? "Atur Kata Sandi Baru" : "Set New Password"}
        </h2>
        <p className="text-xs text-slate-500 font-semibold leading-relaxed">
          {isIndonesian 
            ? "Masukkan kode token pemulihan Anda dan tentukan kata sandi akun yang baru." 
            : "Provide your unique secure recovery token code and specify your new account password."}
        </p>
      </div>

      {error && (
        <div className="flex items-start space-x-2.5 p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 text-xs font-semibold animate-shake" id="reset-password-error">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-start space-x-2.5 p-4 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 text-xs font-semibold" id="reset-password-success">
          <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4.5" id="reset-password-form">
        <div className="space-y-1.5">
          <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wide">
            {isIndonesian ? "Token Pemulihan Aman" : "Secure Reset Token"}
          </label>
          <div className="relative">
            <input
              id="reset-password-token-input"
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder={isIndonesian ? "Tempel token dari log server / email..." : "Paste token from server log..."}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-mono text-xs font-bold text-slate-800"
              required
              disabled={loading}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wide">
            {isIndonesian ? "Kata Sandi Baru" : "New Password"}
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              id="reset-password-password-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-semibold text-slate-900"
              required
              disabled={loading}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wide">
            {isIndonesian ? "Konfirmasi Kata Sandi Baru" : "Confirm New Password"}
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              id="reset-password-confirm-password-input"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-semibold text-slate-900"
              required
              disabled={loading}
            />
          </div>
        </div>

        <button
          id="reset-password-submit-btn"
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
              <span>{isIndonesian ? "Memperbarui kredensial..." : "Updating credentials..."}</span>
            </span>
          ) : (
            <span>{isIndonesian ? "Perbarui Kata Sandi" : "Update Password"}</span>
          )}
        </button>
      </form>

      <div className="text-center pt-2 border-t border-slate-100">
        <button
          id="reset-password-back-btn"
          onClick={() => onNavigate("login")}
          className="inline-flex items-center space-x-1.5 text-xs font-black text-slate-600 hover:text-slate-900 cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>{isIndonesian ? "Kembali ke halaman masuk" : "Return to login"}</span>
        </button>
      </div>
    </div>
  );
}
