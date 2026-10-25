/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Check, 
  X, 
  Crown, 
  Zap, 
  Building2, 
  UserCheck, 
  HelpCircle, 
  ArrowRight,
  ShieldCheck,
  Send,
  MessageSquare,
  FileCheck,
  Briefcase
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { Candidate, Recruiter } from "../types";

interface PricingViewProps {
  onTabChange: (tab: string) => void;
  currentUser?: any | null;
  candidate?: Candidate | null;
  onUpdateCandidate?: (candidate: Candidate) => void;
  recruiter?: Recruiter | null;
  onUpdateRecruiter?: (recruiter: Recruiter) => void;
  onOpenCandidatePlanModal?: () => void;
}

export default function PricingView({
  onTabChange,
  currentUser,
  candidate,
  onUpdateCandidate,
  recruiter,
  onUpdateRecruiter,
  onOpenCandidatePlanModal,
}: PricingViewProps) {
  const { isIndonesian, formatCurrency } = useLanguage();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [activeSegment, setActiveSegment] = useState<"candidate" | "recruiter">("candidate");
  const [showEnterpriseModal, setShowEnterpriseModal] = useState(false);
  const [enterpriseCompany, setEnterpriseCompany] = useState("");
  const [enterpriseEmail, setEnterpriseEmail] = useState("");
  const [enterpriseSeats, setEnterpriseSeats] = useState("5-10");
  const [enterpriseNotes, setEnterpriseNotes] = useState("");
  const [enterpriseSubmitted, setEnterpriseSubmitted] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleEnterpriseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEnterpriseSubmitted(true);
    setTimeout(() => {
      setShowEnterpriseModal(false);
      setEnterpriseSubmitted(false);
      setEnterpriseCompany("");
      setEnterpriseEmail("");
      setEnterpriseNotes("");
      setToastMessage(
        isIndonesian 
          ? "Permintaan demo & proposal Enterprise berhasil dikirim! Tim kami akan menghubungi Anda dalam 1x24 jam."
          : "Enterprise demo & proposal request submitted! Our corporate solutions team will reach out within 24 hours."
      );
      setTimeout(() => setToastMessage(null), 6000);
    }, 1500);
  };

  const handleCandidateProClick = () => {
    // [PAID_FEATURE_TOGGLE] In Free Trial mode, automatically grant Talent Pro access without payment.
    // Uncomment below to restore payment modal trigger:
    /*
    if (onOpenCandidatePlanModal) {
      onOpenCandidatePlanModal();
      return;
    }
    */
    if (candidate && onUpdateCandidate) {
      onUpdateCandidate({
        ...candidate,
        membershipPlan: "Pro"
      });
      setToastMessage(
        isIndonesian 
          ? "🎉 Mode Free Trial Aktif! Akun Anda telah di-upgrade ke Talent Pro (Audit AI ATS Tanpa Batas & Lencana PRO Aktif) secara gratis."
          : "🎉 Free Trial Mode Active! You've been upgraded to Talent Pro (Unlimited AI ATS Audits & PRO Badge Active) for free."
      );
      setTimeout(() => setToastMessage(null), 6000);
    } else {
      onTabChange("candidate-dashboard");
    }
  };

  const handleRecruiterUpgrade = (tier: "Premium" | "Enterprise") => {
    // [PAID_FEATURE_TOGGLE] In Free Trial mode, grant recruiter tier upgrades without invoices/payments.
    if (tier === "Enterprise") {
      setShowEnterpriseModal(true);
      return;
    }

    if (recruiter && onUpdateRecruiter) {
      onUpdateRecruiter({
        ...recruiter,
        subscriptionTier: tier
      });
      setToastMessage(
        isIndonesian 
          ? `🎉 Mode Free Trial Aktif! Paket perusahaan Anda berhasil ditingkatkan ke ${tier} Tier secara gratis tanpa biaya.`
          : `🎉 Free Trial Mode Active! Your company subscription has been updated to ${tier} Tier for free without charges.`
      );
      setTimeout(() => setToastMessage(null), 6000);
    } else {
      onTabChange("recruiter-dashboard");
    }
  };

  const pricingFaqs = isIndonesian ? [
    {
      q: "Bagaimana cara kerja batas kuota 2x scan ATS gratis bagi kandidat?",
      a: "Setiap kandidat baru yang mendaftar di TalentHub mendapatkan 2 kredit gratis evaluasi resume dengan AI Gemini. Anda dapat menggunakannya untuk melihat skor kecocokan kata kunci, tata letak, dan saran perbaikan. Setelah 2 scan gratis habis, Anda dapat meningkatkan ke Talent Pro seharga Rp 49.000/bulan untuk audit tanpa batas."
    },
    {
      q: "Apakah pencari kerja wajib berlangganan untuk menerima tawaran wawancara?",
      a: "Sama sekali tidak! Pembuatan profil terverifikasi, publikasi portofolio, lamaran ke lowongan, dan penerimaan tawaran wawancara dengan gaji transparan 100% GRATIS selamanya. Talent Pro adalah paket opsional bagi yang menginginkan optimasi AI tak terbatas dan prioritas ranking."
    },
    {
      q: "Metode pembayaran apa saja yang didukung?",
      a: "Kami mendukung QRIS (GoPay, OVO, Dana, ShopeePay), Virtual Account Bank (BCA, Mandiri, BNI, BRI, Permata), serta Kartu Kredit/Debit Visa & MasterCard dengan enkripsi transaksi standar bank."
    },
    {
      q: "Bagaimana sistem penagihan untuk tim HR & Rekruter?",
      a: "Paket Rekruter Premium dan Enterprise ditagih secara bulanan atau tahunan (hemat 20%). Setiap pembayaran secara otomatis menghasilkan faktur digital resmi (PDF) dengan rincian PPN yang dapat diunduh langsung dari dasbor penagihan."
    },
    {
      q: "Apakah saya bisa membatalkan atau mengubah paket sewaktu-waktu?",
      a: "Tentu saja. Anda dapat beralih paket atau menghentikan perpanjangan otomatis kapan saja langsung melalui menu pengaturan akun tanpa biaya penalti."
    }
  ] : [
    {
      q: "How does the candidate 2-free ATS scans quota work?",
      a: "Every new candidate profile receives 2 complimentary AI ATS resume scans powered by Google Gemini. This lets you experience keyword matching and layout audit capabilities. Once your 2 free credits are used, you can upgrade to Talent Pro for Rp 49,000/mo for unlimited scans."
    },
    {
      q: "Do candidates have to pay to receive interview offers?",
      a: "Never! Creating a verified profile, showcasing projects, applying to jobs, and accepting transparent Rupiah interview pitches is 100% FREE forever. Talent Pro is strictly optional for candidates seeking unlimited AI enhancements and priority discoverability."
    },
    {
      q: "What payment methods are supported?",
      a: "We support Indonesian QRIS (GoPay, OVO, Dana, ShopeePay), Major Bank Virtual Accounts (BCA, Mandiri, BNI, BRI), and International Visa/MasterCard Credit Cards."
    },
    {
      q: "How does billing work for Recruiter & Corporate accounts?",
      a: "Recruiter tiers are billed monthly or annually (save 20%). Invoices with tax breakdowns are automatically generated and downloadable in PDF format directly from your company billing portal."
    },
    {
      q: "Can I cancel or change plans anytime?",
      a: "Yes! You can upgrade, downgrade, or cancel auto-renewal at any time without cancellation fees."
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-12 sm:py-16" id="pricing-page-root">
      
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center space-x-3 text-xs font-semibold animate-fade-in">
          <Check className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white ml-2 cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header Title Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-blue-50 border border-blue-100 text-blue-700 rounded-full text-xs font-extrabold tracking-wide uppercase">
            <Crown className="h-3.5 w-3.5 text-blue-600" />
            <span>{isIndonesian ? "Paket Berlangganan & Harga Transparan" : "Subscription Plans & Pricing"}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            {isIndonesian ? "Pilihan Paket Transparan untuk" : "Transparent Plans Tailored for"}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700">
              {isIndonesian ? "Karier & Perekrutan" : "Talent & Companies"}
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
            {isIndonesian 
              ? "Mulai secara gratis untuk membangun profil dan mencari talenta. Tingkatkan ke fitur Pro atau Enterprise saat Anda siap mengakselerasi proses karier dan rekrutmen."
              : "Start free to build your verified profile and discover talent. Upgrade to Pro or Enterprise tiers when you're ready to accelerate placement."}
          </p>

          {/* [PAID_FEATURE_TOGGLE] Free Trial Notice Banner */}
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-center space-x-3 text-emerald-800 text-xs sm:text-sm font-bold shadow-xs">
            <span className="text-lg">🎉</span>
            <span>
              {isIndonesian
                ? "Mode Uji Coba Gratis (Free Trial) Sedang Berjalan: Semua fitur Talent Pro dan Recruiter dapat dinikmati 100% tanpa biaya pembayaran!"
                : "Free Trial Mode Active: All Talent Pro and Recruiter features are currently accessible 100% free of charge!"}
            </span>
          </div>
        </div>

        {/* Dual Switcher: Segment (Candidate vs Recruiter) & Billing Cycle (Monthly vs Annual) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          
          {/* Segment Selector */}
          <div className="bg-slate-200/70 p-1.5 rounded-2xl flex items-center space-x-1 border border-slate-200 shadow-2xs">
            <button
              id="segment-candidate-btn"
              onClick={() => setActiveSegment("candidate")}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-2 ${
                activeSegment === "candidate"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <UserCheck className="h-4 w-4 text-blue-600" />
              <span>{isIndonesian ? "Untuk Pencari Kerja (Kandidat)" : "For Job Seekers (Candidates)"}</span>
            </button>
            <button
              id="segment-recruiter-btn"
              onClick={() => setActiveSegment("recruiter")}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-2 ${
                activeSegment === "recruiter"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Building2 className="h-4 w-4 text-indigo-600" />
              <span>{isIndonesian ? "Untuk Perusahaan & Rekruter" : "For Employers & Recruiters"}</span>
            </button>
          </div>

          {/* Billing Cycle Toggle */}
          <div className="bg-white px-4 py-2 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center space-x-3 text-xs font-bold">
            <span className={billingCycle === "monthly" ? "text-slate-900" : "text-slate-400"}>
              {isIndonesian ? "Bulanan" : "Monthly"}
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === "monthly" ? "annual" : "monthly")}
              className="w-11 h-6 bg-slate-200 rounded-full p-0.5 transition-colors cursor-pointer relative"
              aria-label="Toggle Billing Cycle"
            >
              <div 
                className={`w-5 h-5 bg-blue-600 rounded-full transition-transform duration-200 shadow-xs ${
                  billingCycle === "annual" ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
            <div className="flex items-center space-x-1.5">
              <span className={billingCycle === "annual" ? "text-slate-900 font-extrabold" : "text-slate-400"}>
                {isIndonesian ? "Tahunan" : "Annual"}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                {isIndonesian ? "Hemat 20%" : "Save 20%"}
              </span>
            </div>
          </div>

        </div>

        {/* ------------------------------------------------------------- */}
        {/* SEGMENT 1: CANDIDATE PRICING CARDS */}
        {/* ------------------------------------------------------------- */}
        {activeSegment === "candidate" && (
          <div className="space-y-10 animate-in fade-in duration-300">
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
              
              {/* Plan 1: Standard (Free) */}
              <div className="bg-white rounded-3xl border-2 border-slate-200 p-7 sm:p-8 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-all">
                <div className="space-y-6">
                  
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-lg text-xs font-extrabold tracking-wider uppercase bg-slate-100 text-slate-700">
                      {isIndonesian ? "Dasar & Gratis" : "Basic & Free"}
                    </span>
                    {candidate?.membershipPlan !== "Pro" && (
                      <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        {isIndonesian ? "Paket Standar Aktif" : "Active Free Plan"}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-2xl font-black text-slate-900">
                      {isIndonesian ? "Paket Standar" : "Standard Tier"}
                    </h3>
                    <div className="flex items-baseline space-x-1.5 mt-2">
                      <span className="text-3xl sm:text-4xl font-black text-slate-900">Rp 0</span>
                      <span className="text-xs text-slate-500 font-semibold">{isIndonesian ? "/ selamanya" : "/ forever"}</span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed mt-2.5">
                      {isIndonesian
                        ? "Akses lengkap untuk membangun profil profesional terverifikasi, memamerkan portofolio proyek, dan mencoba 2x scan AI ATS resume gratis."
                        : "Full access to build a verified profile, showcase project portfolio, and experience 2 complimentary AI ATS scans."}
                    </p>
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-3 border-t border-slate-100 pt-5 text-xs font-semibold text-slate-700">
                    <div className="flex items-start space-x-2.5 bg-blue-50/70 p-2.5 rounded-xl border border-blue-100 text-blue-900 font-bold">
                      <Zap className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                      <span>
                        {isIndonesian 
                          ? "2x Kuota Audit AI ATS Resume (Termasuk Uji Coba Cerdas)" 
                          : "2x Free AI ATS Resume Scans (Try Before Upgrade)"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2.5">
                      <Check className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
                      <span>{isIndonesian ? "Profil Publik & Portofolio Proyek Terverifikasi" : "Verified Public Profile & Project Showcase"}</span>
                    </div>
                    <div className="flex items-center space-x-2.5">
                      <Check className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
                      <span>{isIndonesian ? "Terima Undangan Wawancara HR dengan Gaji Transparan" : "Receive Direct Sourcing Offers with IDR Salaries"}</span>
                    </div>
                    <div className="flex items-center space-x-2.5">
                      <Check className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
                      <span>{isIndonesian ? "Lamar ke Ratusan Lowongan Kerja Perusahaan" : "Apply to Unlimited Corporate Job Openings"}</span>
                    </div>
                    <div className="flex items-center space-x-2.5">
                      <Check className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
                      <span>{isIndonesian ? "Akses Katalog Program Pelatihan & Beasiswa" : "Access Training Programs & Scholarship Catalogs"}</span>
                    </div>
                    <div className="flex items-center space-x-2.5 text-slate-400">
                      <X className="h-4.5 w-4.5 text-slate-300 shrink-0" />
                      <span className="line-through">{isIndonesian ? "Audit AI ATS Tanpa Batas" : "Unlimited AI ATS Scans"}</span>
                    </div>
                    <div className="flex items-center space-x-2.5 text-slate-400">
                      <X className="h-4.5 w-4.5 text-slate-300 shrink-0" />
                      <span className="line-through">{isIndonesian ? "Lencana Mahkota Eksklusif 'PRO' LinkedIn-Style" : "Exclusive LinkedIn-Style 'PRO' Crown Badge"}</span>
                    </div>
                  </div>

                </div>

                <div className="pt-6 border-t border-slate-100 mt-6">
                  <button
                    onClick={() => onTabChange("candidate-dashboard")}
                    className="w-full py-3 rounded-xl text-xs font-extrabold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-all cursor-pointer flex items-center justify-center space-x-1.5"
                  >
                    <span>{isIndonesian ? "Gunakan Paket Standar" : "Continue with Standard"}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Plan 2: Talent Pro */}
              <div className="bg-gradient-to-b from-indigo-50/70 via-white to-white rounded-3xl border-2 border-indigo-600 p-7 sm:p-8 flex flex-col justify-between shadow-xl relative overflow-hidden">
                <div className="absolute -right-10 -top-10 h-32 w-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
                
                <div className="space-y-6 relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-lg text-xs font-black tracking-wider uppercase bg-indigo-600 text-white shadow-xs">
                      {isIndonesian ? "Akselerasi Karier" : "Career Accelerator"}
                    </span>
                    {candidate?.membershipPlan === "Pro" && (
                      <span className="text-[11px] font-black px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                        <Crown className="h-3.5 w-3.5 text-amber-600" />
                        <span>{isIndonesian ? "Talent Pro Aktif" : "Talent Pro Active"}</span>
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                      <span>Talent Pro</span>
                      <Crown className="h-5 w-5 text-amber-500" />
                    </h3>
                    <div className="flex items-baseline space-x-1.5 mt-2">
                      <span className="text-3xl sm:text-4xl font-black text-indigo-700">
                        {billingCycle === "monthly" ? "Rp 49.000" : "Rp 39.000"}
                      </span>
                      <span className="text-xs text-slate-500 font-semibold">
                        {isIndonesian ? "/ bulan" : "/ month"}
                        {billingCycle === "annual" && (isIndonesian ? " (ditagih tahunan Rp 468.000)" : " (billed annually)")}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed mt-2.5">
                      {isIndonesian
                        ? "Maksimalkan peluang dilirik rekruter papan atas dengan audit ATS tanpa batas, lencana PRO bergengsi, dan generator surat lamaran AI."
                        : "Maximize interview offers with unlimited ATS audits, prestigious PRO crown badge, and tailored AI cover letters."}
                    </p>
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-3 border-t border-slate-100 pt-5 text-xs font-semibold text-slate-700">
                    <div className="flex items-start space-x-2.5 bg-indigo-100/60 p-2.5 rounded-xl border border-indigo-200 text-indigo-950 font-bold">
                      <Check className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                      <span>
                        {isIndonesian 
                          ? "Audit ATS & AI Skill Gap Analyzer Tanpa Batas (Unlimited Scans)" 
                          : "Unlimited AI ATS Audits & Core Skill Gap Analyses"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2.5">
                      <Crown className="h-4.5 w-4.5 text-amber-500 shrink-0" />
                      <span className="font-bold text-slate-900">
                        {isIndonesian ? "Lencana Mahkota 'PRO' LinkedIn-Style di Pencarian Rekruter" : "LinkedIn-Style 'PRO' Crown Badge in HR Search"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2.5">
                      <Check className="h-4.5 w-4.5 text-indigo-600 shrink-0" />
                      <span>{isIndonesian ? "Rekomendasi Kata Kunci & Rekonstruksi Poin Pengalaman AI" : "AI Action Verb & Metric Rephrase Suggestions"}</span>
                    </div>
                    <div className="flex items-center space-x-2.5">
                      <Check className="h-4.5 w-4.5 text-indigo-600 shrink-0" />
                      <span>{isIndonesian ? "Generator Surat Lamaran / Cover Letter AI Otomatis" : "AI Cover Letter Custom Tailoring Generator"}</span>
                    </div>
                    <div className="flex items-center space-x-2.5">
                      <Check className="h-4.5 w-4.5 text-indigo-600 shrink-0" />
                      <span>{isIndonesian ? "Prioritas Teratas di Pencarian Sourcing Tim HR" : "Top Search Placement in Recruiter Queries"}</span>
                    </div>
                    <div className="flex items-center space-x-2.5">
                      <Check className="h-4.5 w-4.5 text-indigo-600 shrink-0" />
                      <span>{isIndonesian ? "Notifikasi Instan saat Profil Diinspeksi Perekrut" : "Instant Alerts when Recruiters Inspect Profile"}</span>
                    </div>
                  </div>

                </div>

                <div className="pt-6 border-t border-slate-100 mt-6 relative z-10">
                  <button
                    id="pricing-upgrade-talent-pro-btn"
                    onClick={handleCandidateProClick}
                    className="w-full py-3.5 rounded-xl text-xs font-extrabold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 transition-all cursor-pointer flex items-center justify-center space-x-2"
                  >
                    <Crown className="h-4 w-4 text-amber-300" />
                    <span>
                      {candidate?.membershipPlan === "Pro"
                        ? (isIndonesian ? "Kelola / Perbarui Talent Pro" : "Manage Talent Pro")
                        : (isIndonesian ? "Aktifkan Talent Pro Sekarang" : "Upgrade to Talent Pro Now")}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* SEGMENT 2: RECRUITER / B2B PRICING CARDS */}
        {/* ------------------------------------------------------------- */}
        {activeSegment === "recruiter" && (
          <div className="space-y-10 animate-in fade-in duration-300">
            <div className="grid lg:grid-cols-3 gap-8 items-stretch">
              
              {/* Recruiter Tier 1: Starter */}
              <div className="bg-white rounded-3xl border-2 border-slate-200 p-7 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-all">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-lg text-[10px] font-extrabold tracking-wider uppercase bg-slate-100 text-slate-700">
                      Starter
                    </span>
                    {recruiter?.subscriptionTier === "Free" && (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        {isIndonesian ? "Paket Aktif" : "Active Plan"}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-slate-900">
                      {isIndonesian ? "Starter Recruiter" : "Starter Sourcing"}
                    </h3>
                    <div className="flex items-baseline space-x-1 mt-2">
                      <span className="text-3xl font-black text-slate-900">Rp 0</span>
                      <span className="text-xs text-slate-500 font-semibold">{isIndonesian ? "/ bulan" : "/ month"}</span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed mt-2">
                      {isIndonesian
                        ? "Akses eksplorasi awal basis data talenta untuk startup tahap awal atau rekrutmen berskala kecil."
                        : "Essential candidate database querying for early startups and small-scale hiring."}
                    </p>
                  </div>

                  <div className="space-y-3 border-t border-slate-100 pt-5 text-xs font-semibold text-slate-700">
                    <div className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>{isIndonesian ? "20 Pencarian Query Kandidat / menit" : "20 Candidate Search Queries / min"}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>{isIndonesian ? "5 Undangan Wawancara Langsung / bulan" : "5 Direct Sourcing Pitches / month"}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>{isIndonesian ? "Pencarian Multi-Filter (Skill, Lokasi)" : "Multi-Filter Candidate Search"}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-400">
                      <X className="h-4 w-4 text-slate-300 shrink-0" />
                      <span className="line-through">{isIndonesian ? "Kontak Telepon / WhatsApp Langsung" : "Direct WhatsApp / Phone Contact"}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-400">
                      <X className="h-4 w-4 text-slate-300 shrink-0" />
                      <span className="line-through">{isIndonesian ? "Integrasi ATS Eksternal & API" : "ATS Integration & API Access"}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 mt-6">
                  <button
                    onClick={() => onTabChange("browse")}
                    className="w-full py-3 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-all cursor-pointer"
                  >
                    {isIndonesian ? "Mulai Cari Talenta" : "Start Searching"}
                  </button>
                </div>
              </div>

              {/* Recruiter Tier 2: Premium (Most Popular) */}
              <div className="bg-gradient-to-b from-blue-50/70 via-white to-white rounded-3xl border-2 border-blue-600 p-7 flex flex-col justify-between shadow-xl relative overflow-hidden">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-lg text-[10px] font-black tracking-wider uppercase bg-blue-600 text-white shadow-xs">
                      {isIndonesian ? "Paling Populer" : "Most Popular"}
                    </span>
                    {recruiter?.subscriptionTier === "Premium" && (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-300">
                        {isIndonesian ? "Paket Aktif" : "Active Plan"}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-slate-900">
                      {isIndonesian ? "Premium Recruiter" : "Recruiter Premium"}
                    </h3>
                    <div className="flex items-baseline space-x-1 mt-2">
                      <span className="text-3xl font-black text-blue-700">
                        {billingCycle === "monthly" ? "Rp 1.499.000" : "Rp 1.199.000"}
                      </span>
                      <span className="text-xs text-slate-500 font-semibold">{isIndonesian ? "/ bulan" : "/ month"}</span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed mt-2">
                      {isIndonesian
                        ? "Dirancang untuk tim HR & Tech Recruiter yang aktif merekrut talenta terverifikasi setiap bulan."
                        : "Engineered for active tech recruiters requiring high-speed candidate outreach and verified talent access."}
                    </p>
                  </div>

                  <div className="space-y-3 border-t border-slate-100 pt-5 text-xs font-semibold text-slate-700">
                    <div className="flex items-center space-x-2 text-blue-900 font-bold bg-blue-100/50 p-2 rounded-xl">
                      <Check className="h-4 w-4 text-blue-600 shrink-0" />
                      <span>{isIndonesian ? "60 Pencarian Query Kandidat / menit" : "60 High-Speed Searches / min"}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-blue-900 font-bold bg-blue-100/50 p-2 rounded-xl">
                      <Check className="h-4 w-4 text-blue-600 shrink-0" />
                      <span>{isIndonesian ? "50 Undangan Sourcing Proposal Langsung / bulan" : "50 Direct Interview Sourcing Pitches / mo"}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>{isIndonesian ? "Kontak Telepon, WhatsApp & Email Terbuka" : "Full WhatsApp & Email Contact Access"}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>{isIndonesian ? "Filter Eksklusif Talenta Terverifikasi & Lencana PRO" : "Verified & PRO Candidate Prioritized Filter"}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>{isIndonesian ? "Analitik Pipeline Wawancara & Response Rate" : "Pipeline Analytics & Sourcing Response Rate"}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 mt-6">
                  <button
                    id="pricing-upgrade-premium-recruiter-btn"
                    onClick={() => handleRecruiterUpgrade("Premium")}
                    className="w-full py-3.5 rounded-xl text-xs font-black bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 transition-all cursor-pointer flex items-center justify-center space-x-1.5"
                  >
                    <span>{isIndonesian ? "Pilih Paket Premium" : "Choose Premium Tier"}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Recruiter Tier 3: Enterprise */}
              <div className="bg-slate-900 text-white rounded-3xl border border-slate-800 p-7 flex flex-col justify-between shadow-xl">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-lg text-[10px] font-black tracking-wider uppercase bg-slate-800 text-amber-400 border border-slate-700">
                      Enterprise
                    </span>
                    {recruiter?.subscriptionTier === "Enterprise" && (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-900 font-extrabold">
                        {isIndonesian ? "Paket Aktif" : "Active Plan"}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-white">
                      Enterprise Custom
                    </h3>
                    <div className="flex items-baseline space-x-1 mt-2">
                      <span className="text-3xl font-black text-amber-400">
                        {billingCycle === "monthly" ? "Rp 4.999.000" : "Rp 3.999.000"}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold">{isIndonesian ? "/ bulan" : "/ month"}</span>
                    </div>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed mt-2">
                      {isIndonesian
                        ? "Solusi perekrutan skala besar untuk korporasi, unicorn, dan agensi rekrutmen dengan integrasi API penuh."
                        : "High-volume recruitment solution with full ATS API integrations and dedicated talent matching."}
                    </p>
                  </div>

                  <div className="space-y-3 border-t border-slate-800 pt-5 text-xs font-semibold text-slate-300">
                    <div className="flex items-center space-x-2 text-amber-300 font-bold">
                      <Check className="h-4 w-4 text-amber-400 shrink-0" />
                      <span>{isIndonesian ? "120 Query / menit & Undangan Wawancara Tanpa Batas" : "120 Queries / min & Unlimited Direct Pitches"}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-amber-400 shrink-0" />
                      <span>{isIndonesian ? "Akses API TalentHub (Greenhouse, Lever, Workday)" : "Direct TalentHub API & ATS Webhooks"}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-amber-400 shrink-0" />
                      <span>{isIndonesian ? "Multi-Seat Hingga 10 Anggota Tim Rekruter" : "Multi-Seat Support (Up to 10 Recruiters)"}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-amber-400 shrink-0" />
                      <span>{isIndonesian ? "Dedicated Account Manager & Kurasi Khusus" : "Dedicated Account Manager & Custom Shortlisting"}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-amber-400 shrink-0" />
                      <span>{isIndonesian ? "Export Data Kandidat (CSV/JSON/PDF) & SLA 24/7" : "Candidate Export (CSV/JSON) & 24/7 SLA Support"}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-800 mt-6">
                  <button
                    id="pricing-contact-enterprise-btn"
                    onClick={() => setShowEnterpriseModal(true)}
                    className="w-full py-3.5 rounded-xl text-xs font-extrabold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all cursor-pointer flex items-center justify-center space-x-1.5"
                  >
                    <span>{isIndonesian ? "Hubungi Tim Enterprise" : "Contact Enterprise Sales"}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* SECTION 3: FEATURE MATRIX COMPARISON */}
        {/* ------------------------------------------------------------- */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h3 className="text-xl font-extrabold text-slate-900">
              {isIndonesian ? "Perbandingan Fitur Terperinci" : "Detailed Feature Matrix"}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              {isIndonesian 
                ? "Bandingkan setiap kapabilitas yang Anda dapatkan di setiap tingkatan paket."
                : "Compare every feature and capability unlocked at each subscription level."}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-extrabold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">{isIndonesian ? "Fitur & Kapabilitas" : "Feature / Capability"}</th>
                  <th className="py-3 px-4 text-center">{isIndonesian ? "Kandidat Standar" : "Candidate Standard"}</th>
                  <th className="py-3 px-4 text-center text-indigo-700 bg-indigo-50/50 rounded-t-xl">{isIndonesian ? "Talent Pro (Rp 49k)" : "Talent Pro (Rp 49k)"}</th>
                  <th className="py-3 px-4 text-center">{isIndonesian ? "Rekruter Premium" : "Recruiter Premium"}</th>
                  <th className="py-3 px-4 text-center">{isIndonesian ? "Enterprise" : "Enterprise"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-900">{isIndonesian ? "Audit AI ATS Resume (Gemini AI)" : "AI ATS Resume Audit"}</td>
                  <td className="py-3 px-4 text-center">2x {isIndonesian ? "Scan Gratis" : "Free Scans"}</td>
                  <td className="py-3 px-4 text-center font-black text-indigo-700 bg-indigo-50/30">Tanpa Batas (Unlimited)</td>
                  <td className="py-3 px-4 text-center">N/A</td>
                  <td className="py-3 px-4 text-center">N/A</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-900">{isIndonesian ? "Lencana Mahkota PRO di Pencarian" : "PRO Crown Badge in Search"}</td>
                  <td className="py-3 px-4 text-center text-slate-400"><X className="h-4 w-4 mx-auto text-slate-300" /></td>
                  <td className="py-3 px-4 text-center text-indigo-700 bg-indigo-50/30 font-bold">✓ {isIndonesian ? "Aktif (Lencana Emas)" : "Active (Gold Crown)"}</td>
                  <td className="py-3 px-4 text-center text-slate-400">-</td>
                  <td className="py-3 px-4 text-center text-slate-400">-</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-900">{isIndonesian ? "Generator Cover Letter AI" : "AI Cover Letter Tailoring"}</td>
                  <td className="py-3 px-4 text-center text-slate-400"><X className="h-4 w-4 mx-auto text-slate-300" /></td>
                  <td className="py-3 px-4 text-center text-indigo-700 bg-indigo-50/30 font-bold">✓ Termasuk</td>
                  <td className="py-3 px-4 text-center text-slate-400">-</td>
                  <td className="py-3 px-4 text-center text-slate-400">-</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-900">{isIndonesian ? "Batas Pencarian Kandidat" : "Candidate Search Limit"}</td>
                  <td className="py-3 px-4 text-center">-</td>
                  <td className="py-3 px-4 text-center text-indigo-700 bg-indigo-50/30">-</td>
                  <td className="py-3 px-4 text-center font-semibold">60 query / min</td>
                  <td className="py-3 px-4 text-center font-bold text-emerald-700">120 query / min</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-900">{isIndonesian ? "Kredit Undangan Wawancara / bln" : "Direct Interview Pitches / mo"}</td>
                  <td className="py-3 px-4 text-center">{isIndonesian ? "Terima Bebas" : "Receive Unlimited"}</td>
                  <td className="py-3 px-4 text-center text-indigo-700 bg-indigo-50/30">{isIndonesian ? "Terima Bebas + Prioritas" : "Receive + Top Priority"}</td>
                  <td className="py-3 px-4 text-center font-bold">50 {isIndonesian ? "Undangan" : "Pitches"}</td>
                  <td className="py-3 px-4 text-center font-black text-emerald-700">Tanpa Batas (Unlimited)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-900">{isIndonesian ? "Akses API & Integrasi ATS" : "API & ATS Webhooks"}</td>
                  <td className="py-3 px-4 text-center text-slate-400"><X className="h-4 w-4 mx-auto text-slate-300" /></td>
                  <td className="py-3 px-4 text-center text-slate-400 bg-indigo-50/30"><X className="h-4 w-4 mx-auto text-slate-300" /></td>
                  <td className="py-3 px-4 text-center text-slate-400"><X className="h-4 w-4 mx-auto text-slate-300" /></td>
                  <td className="py-3 px-4 text-center font-black text-emerald-700">✓ {isIndonesian ? "Akses Penuh" : "Full Access"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* SECTION 4: BILLING & MONETIZATION FAQ */}
        {/* ------------------------------------------------------------- */}
        <div className="max-w-4xl mx-auto space-y-6 pt-6">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              {isIndonesian ? "Pertanyaan Seputar Paket & Pembayaran" : "Pricing & Billing FAQs"}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              {isIndonesian ? "Hal-hal yang sering ditanyakan mengenai langganan dan metode penagihan." : "Common questions about subscriptions and payment methods."}
            </p>
          </div>

          <div className="space-y-4">
            {pricingFaqs.map((faq, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
                <h4 className="text-sm font-extrabold text-slate-900 flex items-start space-x-2">
                  <HelpCircle className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>{faq.q}</span>
                </h4>
                <p className="text-xs text-slate-600 font-medium leading-relaxed pl-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 text-center space-y-5 border border-slate-800 relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
              {isIndonesian ? "Siap Memulai Langkah Karier atau Perekrutan?" : "Ready to Supercharge Your Hiring or Career?"}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 font-medium leading-relaxed">
              {isIndonesian 
                ? "Daftar sekarang dan rasakan efisiensi perekrutan terbalik tanpa perantara yang rumit."
                : "Join verified builders and innovative companies recruiting through transparent direct sourcing."}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              <button
                onClick={() => onTabChange("candidate-dashboard")}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                {isIndonesian ? "Masuk Dashboard Kandidat" : "Open Candidate Dashboard"}
              </button>
              <button
                onClick={() => onTabChange("browse")}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-bold text-xs transition-all cursor-pointer"
              >
                {isIndonesian ? "Jelajahi Direktori Talenta" : "Browse Talent Directory"}
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Enterprise Inquiry Modal */}
      {showEnterpriseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <h3 className="text-lg font-black text-slate-900">
                  {isIndonesian ? "Konsultasi Paket Enterprise" : "Enterprise Custom Solution"}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {isIndonesian ? "Solusi ATS API, multi-seat rekruter, dan kurasi talenta khusus." : "Custom ATS integration, dedicated seats, and personalized talent matchmaking."}
                </p>
              </div>
              <button 
                onClick={() => setShowEnterpriseModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {enterpriseSubmitted ? (
              <div className="text-center py-8 space-y-3">
                <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <Check className="h-6 w-6" />
                </div>
                <h4 className="text-sm font-extrabold text-slate-900">
                  {isIndonesian ? "Permintaan Berhasil Terkirim!" : "Inquiry Submitted Successfully!"}
                </h4>
                <p className="text-xs text-slate-500 font-medium max-w-xs mx-auto">
                  {isIndonesian ? "Tim representatif enterprise kami akan menghubungi Anda melalui email dalam 1x24 jam." : "Our enterprise solutions team will contact you via email shortly."}
                </p>
              </div>
            ) : (
              <form onSubmit={handleEnterpriseSubmit} className="space-y-4 text-xs font-semibold text-slate-700">
                <div className="space-y-1.5">
                  <label>{isIndonesian ? "Nama Perusahaan" : "Company Name"}</label>
                  <input
                    type="text"
                    required
                    value={enterpriseCompany}
                    onChange={(e) => setEnterpriseCompany(e.target.value)}
                    placeholder="e.g. PT Inovasi Solusi Global"
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs bg-slate-50 focus:bg-white focus:outline-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label>{isIndonesian ? "Email Resmi HR / Perusahaan" : "Corporate Work Email"}</label>
                  <input
                    type="email"
                    required
                    value={enterpriseEmail}
                    onChange={(e) => setEnterpriseEmail(e.target.value)}
                    placeholder="talent-acquisition@company.com"
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs bg-slate-50 focus:bg-white focus:outline-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label>{isIndonesian ? "Estimasi Kebutuhan Rekruter / Kursi (Seats)" : "Estimated Hiring Seats Needed"}</label>
                  <select
                    value={enterpriseSeats}
                    onChange={(e) => setEnterpriseSeats(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs bg-slate-50 focus:bg-white focus:outline-blue-500"
                  >
                    <option value="1-5">1 - 5 {isIndonesian ? "Rekruter" : "Recruiters"}</option>
                    <option value="5-10">5 - 10 {isIndonesian ? "Rekruter" : "Recruiters"}</option>
                    <option value="10-25">10 - 25 {isIndonesian ? "Rekruter" : "Recruiters"}</option>
                    <option value="25+">25+ {isIndonesian ? "Rekruter / Multi-Divisi" : "Recruiters / Multi-Division"}</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label>{isIndonesian ? "Catatan Khusus / Sistem ATS yang Digunakan" : "Special Requirements / Current ATS"}</label>
                  <textarea
                    rows={3}
                    value={enterpriseNotes}
                    onChange={(e) => setEnterpriseNotes(e.target.value)}
                    placeholder={isIndonesian ? "Contoh: Butuh integrasi dengan Greenhouse dan rekrutmen 20 Senior Backend Engineer kuartal ini..." : "e.g. Need Greenhouse webhook sync and 20 Senior Engineers this quarter..."}
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs bg-slate-50 focus:bg-white focus:outline-blue-500"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-slate-950 hover:bg-slate-800 text-white rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center space-x-1.5"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>{isIndonesian ? "Kirim Permintaan Demo & Penawaran" : "Submit Request & Schedule Demo"}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
