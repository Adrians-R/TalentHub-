import React, { useState, useMemo } from "react";
import { 
  User, 
  Mail, 
  Lock, 
  UserPlus, 
  AlertCircle, 
  Building2, 
  Briefcase, 
  Phone, 
  Globe, 
  Users, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  Info,
  FileText,
  ChevronDown,
  Linkedin,
  UploadCloud,
  Check,
  FileCheck2
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

interface RegisterViewProps {
  onSuccess: (email: string, code?: string) => void;
  onNavigate: (tab: string) => void;
}

const PUBLIC_EMAIL_DOMAINS = [
  "gmail.com", "yahoo.com", "ymail.com", "hotmail.com", "outlook.com", 
  "live.com", "icloud.com", "mail.com", "aol.com", "zoho.com", 
  "proton.me", "protonmail.com", "gmx.com", "yandex.com"
];

export default function RegisterView({ onSuccess, onNavigate }: RegisterViewProps) {
  const { t, isIndonesian } = useLanguage();
  
  // Base fields
  const [role, setRole] = useState<"candidate" | "recruiter">("candidate");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Recruiter / HR Specific fields
  const [hrJobTitle, setHrJobTitle] = useState("");
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [companySize, setCompanySize] = useState("51-200 Karyawan");
  const [location, setLocation] = useState("Jakarta Selatan, DKI Jakarta");
  const [companyRegistrationNumber, setCompanyRegistrationNumber] = useState("");
  const [hrLinkedInUrl, setHrLinkedInUrl] = useState("");
  const [companyLinkedInUrl, setCompanyLinkedInUrl] = useState("");
  const [companyIdDocName, setCompanyIdDocName] = useState("");
  const [authorizedDeclarationAccepted, setAuthorizedDeclarationAccepted] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Real-time email domain detection
  const emailDomainInfo = useMemo(() => {
    if (!email || !email.includes("@")) return null;
    const parts = email.trim().split("@");
    if (parts.length < 2 || !parts[1].includes(".")) return null;
    const domain = parts[1].toLowerCase();
    const isPublic = PUBLIC_EMAIL_DOMAINS.includes(domain);
    return {
      domain,
      isCorporate: !isPublic,
      isPublic
    };
  }, [email]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCompanyIdDocName(file.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Common validations
    if (!fullName.trim() || !email.trim() || !password || !confirmPassword || !role) {
      setError(isIndonesian ? "Mohon lengkapi semua bidang utama yang diperlukan." : "Please fill out all required fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError(isIndonesian ? "Silakan masukkan alamat email yang valid." : "Please enter a valid email address.");
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
      setError(isIndonesian ? "Konfirmasi kata sandi tidak cocok." : "Passwords do not match. Please verify your password entry.");
      return;
    }

    // HR Specific validations
    if (role === "recruiter") {
      if (!hrJobTitle.trim()) {
        setError(isIndonesian ? "Mohon isi jabatan atau posisi HR / Talent Acquisition Anda." : "Please specify your official HR / Talent Acquisition title.");
        return;
      }

      if (!phone.trim()) {
        setError(isIndonesian ? "Mohon cantumkan nomor telepon / kontak HR resmi kantor." : "Please provide your official corporate HR contact phone number.");
        return;
      }

      if (!companyName.trim()) {
        setError(isIndonesian ? "Mohon isi nama resmi badan usaha / perusahaan tempat Anda merekrut." : "Please specify your official company / employer entity name.");
        return;
      }

      if (!authorizedDeclarationAccepted) {
        setError(isIndonesian ? "Anda wajib menyetujui pernyataan otoritas & kepatuhan resmi HR." : "You must accept the official HR authorization and compliance declaration.");
        return;
      }
    }

    setLoading(true);

    try {
      const payload: any = {
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        password,
        confirmPassword,
        role
      };

      if (role === "recruiter") {
        payload.hrJobTitle = hrJobTitle.trim();
        payload.phone = phone.trim();
        payload.companyName = companyName.trim();
        payload.companyWebsite = companyWebsite.trim() || `https://${email.trim().split("@")[1] || "company.com"}`;
        payload.companySize = companySize;
        payload.location = location.trim();
        payload.companyRegistrationNumber = companyRegistrationNumber.trim();
        payload.hrLinkedInUrl = hrLinkedInUrl.trim();
        payload.companyLinkedInUrl = companyLinkedInUrl.trim();
        payload.companyIdDocName = companyIdDocName.trim();
        payload.authorizedDeclarationAccepted = true;
      }

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || (isIndonesian ? "Gagal membuat akun. Silakan coba lagi." : "Failed to create account. Please try again."));
      }

      setSuccess(
        isIndonesian 
          ? "Pendaftaran berhasil! Mengirimkan kode OTP verifikasi ke email Anda..." 
          : "Registration successful! Dispatching security OTP code to your inbox..."
      );
      
      setTimeout(() => {
        onSuccess(email.trim().toLowerCase(), data.devVerificationCode);
      }, 1500);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className={`w-full mx-auto my-6 sm:my-10 p-5 sm:p-8 md:p-9 bg-white rounded-3xl border border-slate-100 shadow-xl space-y-6 transition-all duration-300 ${
        role === "recruiter" ? "max-w-3xl" : "max-w-md"
      }`} 
      id="register-card-container"
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug sm:leading-tight" id="register-title">
          {role === "recruiter" 
            ? (isIndonesian ? "Registrasi & Verifikasi HR Perusahaan" : "Company HR Registration & Verification")
            : (isIndonesian ? "Buat Ruang Kerja Talenta" : "Create Candidate Workspace")}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed max-w-xl mx-auto" id="register-subtitle">
          {role === "recruiter"
            ? (isIndonesian ? "Akses portal sourcing talenta terverifikasi dan publikasi lowongan resmi untuk organisasi Anda" : "Access verified talent sourcing and publish official job openings for your organization")
            : (isIndonesian ? "Bergabunglah dengan TalentHub untuk membangun portofolio terverifikasi dan temukan karir impian" : "Join TalentHub to build a verified portfolio and connect with top employers")}
        </p>
      </div>

      {/* Error alert */}
      {error && (
        <div className="flex items-start space-x-2.5 p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 text-xs font-semibold animate-shake" id="register-error-alert">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Success alert */}
      {success && (
        <div className="flex items-start space-x-2.5 p-4 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 text-xs font-semibold" id="register-success-alert">
          <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6" id="register-form">
        {/* Role Selector Tabs */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            {t("auth_role_label")}
          </label>
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3" id="register-role-toggle">
            <button
              id="register-role-candidate-btn"
              type="button"
              onClick={() => setRole("candidate")}
              className={`py-2.5 sm:py-3 px-3 sm:px-4 rounded-2xl text-xs sm:text-sm font-extrabold border transition-all cursor-pointer flex items-center justify-center space-x-2 text-center ${
                role === "candidate"
                  ? "bg-blue-50 border-blue-300 text-blue-700 shadow-2xs ring-2 ring-blue-100"
                  : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
              disabled={loading}
            >
              <User className="h-4 w-4 shrink-0" />
              <span>{t("auth_role_candidate")}</span>
            </button>
            <button
              id="register-role-recruiter-btn"
              type="button"
              onClick={() => setRole("recruiter")}
              className={`py-2.5 sm:py-3 px-3 sm:px-4 rounded-2xl text-xs sm:text-sm font-extrabold border transition-all cursor-pointer flex items-center justify-center space-x-2 text-center ${
                role === "recruiter"
                  ? "bg-blue-50 border-blue-300 text-blue-700 shadow-2xs ring-2 ring-blue-100"
                  : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
              disabled={loading}
            >
              <Building2 className="h-4 w-4 shrink-0" />
              <span>{t("auth_role_recruiter")}</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CANDIDATE REGISTRATION FORM (Streamlined & Simple for Job Seekers)         */}
        {/* ========================================================================= */}
        {role === "candidate" && (
          <div className="space-y-4" id="candidate-registration-fields">
            <div className="p-3.5 bg-blue-50/70 rounded-2xl border border-blue-100 flex items-start space-x-2.5 text-xs text-blue-900 font-medium">
              <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
              <span className="leading-relaxed">
                {t("auth_candidate_intro_badge")}
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 tracking-wide">
                <span className="inline-flex items-center gap-1">
                  {t("auth_full_name_label")}
                  <span className="text-red-500 font-bold">*</span>
                </span>
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  id="register-name-input"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Alex Rivera"
                  className="w-full pl-11 pr-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 tracking-wide">
                <span className="inline-flex items-center gap-1">
                  {t("auth_email_label")}
                  <span className="text-red-500 font-bold">*</span>
                </span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  id="register-email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex.rivera@example.com"
                  className="w-full pl-11 pr-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 tracking-wide">
                <span className="inline-flex items-center gap-1">
                  {t("auth_password_label")}
                  <span className="text-red-500 font-bold">*</span>
                </span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  id="register-password-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isIndonesian ? "Min. 8 karakter (huruf & angka)" : "Min. 8 characters (letters & numbers)"}
                  className="w-full pl-11 pr-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 tracking-wide">
                <span className="inline-flex items-center gap-1">
                  {t("auth_confirm_password_label")}
                  <span className="text-red-500 font-bold">*</span>
                </span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  id="register-confirm-password-input"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={isIndonesian ? "Ulangi kata sandi Anda" : "Repeat your password"}
                  className="w-full pl-11 pr-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal"
                  required
                  disabled={loading}
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* RECRUITER / HR REGISTRATION & VERIFICATION FORM (Differentiated for HR)    */}
        {/* ========================================================================= */}
        {role === "recruiter" && (
          <div className="space-y-6" id="recruiter-hr-registration-fields">
            {/* HR Security & Verification Notice */}
            <div className="p-4 sm:p-4.5 bg-gradient-to-r from-blue-50/90 via-indigo-50/50 to-blue-50/90 rounded-2xl border border-blue-100 flex items-start gap-3.5 shadow-2xs">
              <div className="h-9 w-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm shadow-blue-200">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="space-y-1 min-w-0 flex-1">
                <h4 className="text-xs sm:text-sm font-extrabold text-blue-950 tracking-tight">
                  {isIndonesian ? "Verifikasi Kredensial & Otoritas HR" : "HR Credential & Authority Verification"}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {t("auth_hr_verification_notice")}
                </p>
              </div>
            </div>

            {/* Section 1: HR Representative Details */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-2.5">
                <div className="h-6 w-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <User className="h-3.5 w-3.5" />
                </div>
                <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 tracking-wide">
                  {isIndonesian ? "1. Identitas & Kontak Petugas HR" : "1. HR Officer Identity & Contact"}
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 tracking-wide">
                    <span className="inline-flex items-center gap-1">
                      {t("auth_full_name_label")}
                      <span className="text-red-500 font-bold">*</span>
                    </span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    <input
                      id="register-hr-name-input"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Elena Rostova"
                      className="w-full pl-11 pr-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 tracking-wide">
                    <span className="inline-flex items-center gap-1">
                      {t("auth_hr_job_title_label")}
                      <span className="text-red-500 font-bold">*</span>
                    </span>
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    <input
                      id="register-hr-title-input"
                      type="text"
                      value={hrJobTitle}
                      onChange={(e) => setHrJobTitle(e.target.value)}
                      placeholder={t("auth_hr_job_title_placeholder")}
                      className="w-full pl-11 pr-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 flex flex-col justify-between">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 tracking-wide mb-1.5">
                      <span className="inline-flex items-center gap-1">
                        {t("auth_email_label")} ({isIndonesian ? "Email Kantor" : "Work Email"})
                        <span className="text-red-500 font-bold">*</span>
                      </span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                      <input
                        id="register-hr-email-input"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="elena.r@techcorp.io"
                        className="w-full pl-11 pr-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>
                  
                  {/* Real-time email domain detection indicator */}
                  {emailDomainInfo?.isCorporate && (
                    <div className="flex items-center space-x-1.5 p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-[11px] font-semibold mt-2 shadow-2xs">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>{t("auth_corporate_domain_detected")} (@{emailDomainInfo.domain})</span>
                    </div>
                  )}

                  {emailDomainInfo?.isPublic && (
                    <div className="flex items-center space-x-1.5 p-2.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-[11px] font-medium mt-2 shadow-2xs">
                      <Info className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                      <span>{t("auth_public_domain_notice")}</span>
                    </div>
                  )}

                  {!emailDomainInfo && (
                    <p className="text-[11px] text-slate-500 pl-0.5 font-medium leading-tight mt-1.5">
                      {t("auth_hr_work_email_hint")}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5 flex flex-col justify-between">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 tracking-wide mb-1.5">
                      <span className="inline-flex items-center gap-1">
                        {t("auth_hr_phone_label")}
                        <span className="text-red-500 font-bold">*</span>
                      </span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                      <input
                        id="register-hr-phone-input"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder={t("auth_hr_phone_placeholder")}
                        className="w-full pl-11 pr-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 pl-0.5 font-medium leading-tight mt-1.5">
                    {isIndonesian ? "Untuk koordinasi cepat & verifikasi resmi" : "For direct corporate contact & verification"}
                  </p>
                </div>
              </div>

              {/* HR LinkedIn Profile */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 tracking-wide">
                  {t("auth_hr_linkedin_label")}
                </label>
                <div className="relative">
                  <Linkedin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-600 pointer-events-none" />
                  <input
                    id="register-hr-linkedin-input"
                    type="url"
                    value={hrLinkedInUrl}
                    onChange={(e) => setHrLinkedInUrl(e.target.value)}
                    placeholder={t("auth_hr_linkedin_placeholder")}
                    className="w-full pl-11 pr-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal font-mono"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Company Legal Entity & Profile */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-2.5">
                <div className="h-6 w-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Building2 className="h-3.5 w-3.5" />
                </div>
                <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 tracking-wide">
                  {isIndonesian ? "2. Informasi Legalitas & Profil Perusahaan" : "2. Company Legal Entity & Profile"}
                </h4>
              </div>

              {/* Company Name & Website */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 tracking-wide">
                    <span className="inline-flex items-center gap-1">
                      {t("auth_company_name_label")}
                      <span className="text-red-500 font-bold">*</span>
                    </span>
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    <input
                      id="register-company-name-input"
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder={t("auth_company_name_placeholder")}
                      className="w-full pl-11 pr-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 tracking-wide">
                    {t("auth_company_website_label")}
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    <input
                      id="register-company-website-input"
                      type="text"
                      value={companyWebsite}
                      onChange={(e) => setCompanyWebsite(e.target.value)}
                      placeholder={t("auth_company_website_placeholder")}
                      className="w-full pl-11 pr-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal font-mono"
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              {/* Company LinkedIn & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 tracking-wide">
                    {t("auth_company_linkedin_label")}
                  </label>
                  <div className="relative">
                    <Linkedin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-600 pointer-events-none" />
                    <input
                      id="register-company-linkedin-input"
                      type="url"
                      value={companyLinkedInUrl}
                      onChange={(e) => setCompanyLinkedInUrl(e.target.value)}
                      placeholder={t("auth_company_linkedin_placeholder")}
                      className="w-full pl-11 pr-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal font-mono"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 tracking-wide">
                    {t("auth_company_location_label")}
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    <input
                      id="register-company-location-input"
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder={t("auth_company_location_placeholder")}
                      className="w-full pl-11 pr-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal"
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              {/* Company Size & NIB / NPWP Registration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 tracking-wide">
                    {t("auth_company_size_label")}
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    <select
                      id="register-company-size-select"
                      value={companySize}
                      onChange={(e) => setCompanySize(e.target.value)}
                      className="w-full pl-11 pr-10 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all font-semibold text-slate-900 appearance-none cursor-pointer"
                      disabled={loading}
                    >
                      <option value="1-10 Karyawan">1-10 {isIndonesian ? "Karyawan" : "Employees"}</option>
                      <option value="11-50 Karyawan">11-50 {isIndonesian ? "Karyawan" : "Employees"}</option>
                      <option value="51-200 Karyawan">51-200 {isIndonesian ? "Karyawan" : "Employees"}</option>
                      <option value="201-1000 Karyawan">201-1000 {isIndonesian ? "Karyawan" : "Employees"}</option>
                      <option value="1000+ Karyawan">1000+ {isIndonesian ? "Karyawan" : "Employees"}</option>
                    </select>
                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 tracking-wide">
                    {t("auth_company_reg_number_label")}
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    <input
                      id="register-company-reg-input"
                      type="text"
                      value={companyRegistrationNumber}
                      onChange={(e) => setCompanyRegistrationNumber(e.target.value)}
                      placeholder={t("auth_company_reg_number_placeholder")}
                      className="w-full pl-11 pr-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal font-mono"
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              {/* Employee ID / Business Card proof file upload */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 tracking-wide">
                  {t("auth_company_id_doc_label")}
                </label>
                <div className="relative border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-2xl p-3 sm:p-4 bg-slate-50/70 transition-colors flex items-center justify-between gap-3">
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="h-9 w-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                      {companyIdDocName ? <FileCheck2 className="h-5 w-5 text-emerald-600" /> : <UploadCloud className="h-5 w-5 text-blue-600" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">
                        {companyIdDocName || (isIndonesian ? "Pilih dokumen ID card / kartu nama..." : "Select employee ID or business card...")}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate font-medium">
                        {companyIdDocName ? (isIndonesian ? "File siap diverifikasi ✓" : "File attached successfully ✓") : t("auth_company_id_doc_hint")}
                      </p>
                    </div>
                  </div>
                  <label 
                    htmlFor="register-id-doc-upload" 
                    className="cursor-pointer shrink-0 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-blue-700 shadow-2xs transition-all inline-flex items-center space-x-1"
                  >
                    <span>{isIndonesian ? "Pilih File" : "Browse"}</span>
                  </label>
                  <input 
                    id="register-id-doc-upload" 
                    type="file" 
                    accept="image/*,.pdf" 
                    className="hidden" 
                    onChange={handleFileUpload} 
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Password Credentials */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-2.5">
                <div className="h-6 w-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Lock className="h-3.5 w-3.5" />
                </div>
                <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 tracking-wide">
                  {isIndonesian ? "3. Keamanan Akun & Kata Sandi" : "3. Account Security & Password"}
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 tracking-wide">
                    <span className="inline-flex items-center gap-1">
                      {t("auth_password_label")}
                      <span className="text-red-500 font-bold">*</span>
                    </span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    <input
                      id="register-hr-password-input"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={isIndonesian ? "Min. 8 karakter (1 angka)" : "Min. 8 characters (1 number)"}
                      className="w-full pl-11 pr-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 tracking-wide">
                    <span className="inline-flex items-center gap-1">
                      {t("auth_confirm_password_label")}
                      <span className="text-red-500 font-bold">*</span>
                    </span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    <input
                      id="register-hr-confirm-password-input"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder={isIndonesian ? "Ulangi kata sandi" : "Repeat password"}
                      className="w-full pl-11 pr-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: HR Authorization Declaration */}
            <div className="p-4 bg-slate-50/90 rounded-2xl border border-slate-200/80 space-y-2">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  id="register-hr-declaration-checkbox"
                  type="checkbox"
                  checked={authorizedDeclarationAccepted}
                  onChange={(e) => setAuthorizedDeclarationAccepted(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer shrink-0"
                  required
                />
                <span className="text-xs sm:text-sm font-semibold text-slate-700 leading-relaxed">
                  {t("auth_hr_declaration_label")}
                </span>
              </label>
            </div>
          </div>
        )}

        {/* Submit button */}
        <button
          id="register-submit-btn"
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm py-3.5 px-5 rounded-xl shadow-md shadow-blue-200 hover:shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 mt-4"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center space-x-2">
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>{isIndonesian ? "Memproses verifikasi akun..." : "Processing verification..."}</span>
            </span>
          ) : (
            <>
              {role === "recruiter" ? (
                <>
                  <ShieldCheck className="h-4.5 w-4.5" />
                  <span>{t("auth_register_hr_btn")}</span>
                </>
              ) : (
                <>
                  <UserPlus className="h-4.5 w-4.5" />
                  <span>{t("auth_register_candidate_btn")}</span>
                </>
              )}
            </>
          )}
        </button>
      </form>

      {/* Login link */}
      <div className="text-center pt-2 border-t border-slate-100">
        <span className="text-xs sm:text-sm text-slate-500 font-medium">
          {t("auth_have_account")}{" "}
        </span>
        <button
          id="register-login-link"
          onClick={() => onNavigate("login")}
          className="text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
        >
          {t("auth_login_link")}
        </button>
      </div>
    </div>
  );
}
