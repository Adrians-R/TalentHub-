import React, { useState } from "react";
import { Mail, AlertCircle, CheckCircle2, ArrowLeft, KeyRound } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

interface ForgotPasswordViewProps {
  onSuccess: (email: string) => void;
  onNavigate: (tab: string) => void;
}

export default function ForgotPasswordView({ onSuccess, onNavigate }: ForgotPasswordViewProps) {
  const { isIndonesian } = useLanguage();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email.trim()) {
      setError(isIndonesian ? "Silakan masukkan alamat email Anda." : "Please enter your email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError(isIndonesian ? "Silakan masukkan alamat email yang valid." : "Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || (isIndonesian ? "Permintaan pemulihan kata sandi gagal." : "Password recovery request failed."));
      }

      setSuccess(isIndonesian 
        ? "Jika email Anda terdaftar, kami telah mengirimkan instruksi pemulihan ke kotak masuk email Anda."
        : "If your email is registered, we have dispatched recovery instructions to your email inbox.");
      setTimeout(() => {
        // Automatically redirect to the Reset Password view
        onNavigate(`reset-password?email=${encodeURIComponent(email.trim().toLowerCase())}`);
      }, 3000);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto my-12 p-8 bg-white rounded-3xl border border-slate-100 shadow-xl space-y-6" id="forgot-password-container">
      <div className="flex justify-center">
        <div className="bg-blue-50 text-blue-600 p-3.5 rounded-2xl border border-blue-100">
          <KeyRound className="h-6 w-6" />
        </div>
      </div>

      <div className="text-center space-y-2">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          {isIndonesian ? "Pulihkan Kata Sandi" : "Recover Password"}
        </h2>
        <p className="text-xs text-slate-500 font-semibold leading-relaxed">
          {isIndonesian 
            ? "Jangan khawatir! Berikan email terdaftar Anda dan kami akan mengirimkan token aman untuk memulihkan akses." 
            : "No worries! Tell us your workspace email and we will dispatch secure token keys to restore accessibility."}
        </p>
      </div>

      {error && (
        <div className="flex items-start space-x-2.5 p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 text-xs font-semibold animate-shake" id="forgot-password-error">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-start space-x-2.5 p-4 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 text-xs font-semibold" id="forgot-password-success">
          <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4.5" id="forgot-password-form">
        <div className="space-y-1.5">
          <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wide">
            {isIndonesian ? "Alamat Email" : "Email Address"}
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              id="forgot-password-email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="budi@example.com"
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-semibold text-slate-900"
              required
              disabled={loading}
            />
          </div>
        </div>

        <button
          id="forgot-password-submit-btn"
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
              <span>{isIndonesian ? "Mengirim token..." : "Dispatching token..."}</span>
            </span>
          ) : (
            <span>{isIndonesian ? "Kirim Token Pemulihan" : "Dispatch Secure Token"}</span>
          )}
        </button>
      </form>

      <div className="text-center pt-2 border-t border-slate-100">
        <button
          id="forgot-password-back-btn"
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
