/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  MessageCircle, 
  X, 
  Send, 
  AlertCircle, 
  HelpCircle, 
  CheckCircle2, 
  PhoneCall, 
  Mail, 
  User, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink,
  LifeBuoy,
  MessageSquare,
  ShieldAlert,
  Headphones,
  Info
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { TrainingProposal, DEFAULT_PROFILE_IMAGE } from "../types";

interface SupportChatWidgetProps {
  currentUser?: any | null;
  onTicketSubmitted?: (ticket: TrainingProposal) => void;
}

export default function SupportChatWidget({
  currentUser,
  onTicketSubmitted
}: SupportChatWidgetProps) {
  const { isIndonesian } = useLanguage();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"report" | "inquiry" | "faq">("report");
  const [showTooltip, setShowTooltip] = useState(true);

  // Form Fields
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userRole, setUserRole] = useState("candidate");
  
  // Issue Report Fields
  const [issueCategory, setIssueCategory] = useState("account_login");
  const [issueSubject, setIssueSubject] = useState("");
  const [issueDescription, setIssueDescription] = useState("");
  const [pageUrl, setPageUrl] = useState("");

  // General Inquiry Fields
  const [inquiryTopic, setInquiryTopic] = useState("general_platform");
  const [inquirySubject, setInquirySubject] = useState("");
  const [inquiryMessage, setInquiryMessage] = useState("");

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedTicketId, setSubmittedTicketId] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Auto-populate user data if logged in
  useEffect(() => {
    if (currentUser) {
      if (currentUser.name && !userName) setUserName(currentUser.name);
      if (currentUser.email && !userEmail) setUserEmail(currentUser.email);
      if (currentUser.role) setUserRole(currentUser.role);
    }
  }, [currentUser]);

  // Set current URL when opened
  useEffect(() => {
    if (isOpen && typeof window !== "undefined") {
      setPageUrl(window.location.pathname + window.location.search);
    }
  }, [isOpen]);

  const handleToggleOpen = () => {
    setIsOpen(prev => !prev);
    setShowTooltip(false);
  };

  const handleResetForm = () => {
    setIsSuccess(false);
    setIssueSubject("");
    setIssueDescription("");
    setInquirySubject("");
    setInquiryMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userName.trim() || !userEmail.trim() || !userPhone.trim()) {
      alert(isIndonesian ? "Harap lengkapi nama, email, dan nomor kontak Anda." : "Please provide your name, email, and phone number.");
      return;
    }

    const isReport = activeTab === "report";
    const subject = isReport ? issueSubject.trim() : inquirySubject.trim();
    const details = isReport ? issueDescription.trim() : inquiryMessage.trim();

    if (!subject || !details) {
      alert(isIndonesian ? "Harap isi subjek dan penjelasan rincian." : "Please fill in the subject and message details.");
      return;
    }

    setSubmitting(true);

    const ticketId = `tkt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const categoryTag = isReport ? `[Kendala: ${issueCategory}]` : `[Topik: ${inquiryTopic}]`;
    const fullDescription = `${categoryTag} ${details}${pageUrl ? `\n\n[Halaman Terkait: ${pageUrl}]` : ""}\n[Peran Akun: ${userRole}]`;

    const payload: TrainingProposal = {
      id: ticketId,
      type: isReport ? "complaint" : "general_inquiry",
      partnerName: userName.trim(),
      institutionName: currentUser?.companyName || (userRole === "recruiter" ? "Perusahaan / Rekruter" : "Talenta / Pengguna Publik"),
      email: userEmail.trim(),
      phone: userPhone.trim(),
      programTitle: subject,
      category: isReport ? "Data" : "Product",
      programType: "Free",
      format: "Online",
      duration: "N/A",
      certification: false,
      description: fullDescription,
      syllabusOverview: isReport ? `Kategori Masalah: ${issueCategory}` : `Topik Pertanyaan: ${inquiryTopic}`,
      requirements: [`Dilaporkan oleh ${userName} (${userRole})`],
      registrationLink: pageUrl || "https://talenthub.id",
      imageUrl: DEFAULT_PROFILE_IMAGE,
      submittedAt: new Date().toISOString(),
      status: "pending",
      adminNotes: isIndonesian ? "Masuk melalui Widget Bantuan & Layanan Chat." : "Submitted via Support Chat Widget."
    };

    try {
      const response = await fetch("/api/programs/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        setSubmittedTicketId(data.proposal?.id || payload.id);
      } else {
        setSubmittedTicketId(payload.id);
      }
    } catch (err) {
      console.warn("Ticket submitted locally:", err);
      setSubmittedTicketId(payload.id);
    } finally {
      setSubmitting(false);
      setIsSuccess(true);
      onTicketSubmitted?.(payload);
    }
  };

  // Instant FAQ Items
  const faqItems = [
    {
      q: isIndonesian ? "Berapa lama proses verifikasi profil talenta?" : "How long does talent profile verification take?",
      a: isIndonesian 
        ? "Tim kurator kami memverifikasi portofolio dan dokumen talenta dalam 1x24 jam kerja. Anda akan menerima notifikasi email setelah status berubah menjadi 'Terverifikasi'."
        : "Our curator team verifies candidate portfolios within 1 business day. You'll receive an email once verified."
    },
    {
      q: isIndonesian ? "Bagaimana perusahaan dapat menghubungi dan merekrut talenta?" : "How can companies source and interview candidates?",
      a: isIndonesian 
        ? "Perusahaan terverifikasi dapat mengakses tab 'Cari Talenta', menyaring kandidat berdasarkan skill dan skor asesmen, lalu mengirimkan 'Sourcing Invitation' langsung."
        : "Verified recruiters can access the 'Browse Talent' tab, filter candidates, and send direct 'Sourcing Invitations'."
    },
    {
      q: isIndonesian ? "Apakah semua program pelatihan di katalog berbayar?" : "Are training courses and bootcamps paid or free?",
      a: isIndonesian 
        ? "Katalog menyediakan berbagai pilihan program: Gratis (Free), Beasiswa Pemerintah/NGO, serta program kemitraan industri bersertifikat."
        : "The catalog features Free programs, Government/NGO Scholarships, and certified industry partnerships."
    },
    {
      q: isIndonesian ? "Bagaimana jika saya lupa password atau link verifikasi kedaluwarsa?" : "What if I forgot my password or verification link expired?",
      a: isIndonesian 
        ? "Silakan klik 'Lupa Kata Sandi' pada halaman login. Link pemulihan akan dikirimkan ke email Anda dalam hitungan detik."
        : "Click 'Forgot Password' on the login screen to receive a quick reset link via email."
    },
    {
      q: isIndonesian ? "Ingin mengajukan program pelatihan akademi Anda ke katalog?" : "Want to publish your academy's training program?",
      a: isIndonesian 
        ? "Silakan buka halaman Pelatihan dan klik tombol 'Ajukan Kemitraan' untuk mengirimkan proposal kurikulum langsung ke Super Admin."
        : "Visit the Training page and click 'Propose Partnership' to submit your curriculum directly."
    }
  ];

  return (
    <div className="relative pointer-events-auto" id="support-chat-widget-container">
      {/* ========================================================================= */}
      {/* 1. FLOATING CHAT / SUPPORT POPOVER WINDOW */}
      {/* ========================================================================= */}
      {isOpen && (
        <div 
          className="fixed bottom-22 right-4 sm:right-6 z-50 w-[92vw] sm:w-[410px] max-h-[85vh] bg-white rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 fade-in duration-150"
          id="support-chat-popover"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300">
                  <Headphones className="h-5 w-5" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                  <span>{isIndonesian ? "Pusat Bantuan & Layanan" : "Help & Support Center"}</span>
                  <span className="bg-blue-500/30 text-blue-200 border border-blue-400/30 text-[9px] font-extrabold px-1.5 py-0.2 rounded-md">
                    TalentHub
                  </span>
                </h3>
                <p className="text-[11px] text-slate-300 font-medium">
                  {isIndonesian ? "Online • Respon Cepat < 24 Jam" : "Online • Quick response < 24h"}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
              title={isIndonesian ? "Tutup Bantuan" : "Close Support"}
              id="close-support-widget-btn"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Tab Selector */}
          <div className="p-2 bg-slate-100/80 border-b border-slate-200/80 grid grid-cols-3 gap-1 shrink-0">
            <button
              type="button"
              onClick={() => { setActiveTab("report"); setIsSuccess(false); }}
              className={`py-2 px-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === "report"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              id="tab-report-issue"
            >
              <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
              <span>{isIndonesian ? "Laporkan Kendala" : "Report Issue"}</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab("inquiry"); setIsSuccess(false); }}
              className={`py-2 px-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === "inquiry"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              id="tab-general-inquiry"
            >
              <MessageSquare className="h-3.5 w-3.5 text-blue-500" />
              <span>{isIndonesian ? "Tanya Admin" : "Inquiry"}</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab("faq"); setIsSuccess(false); }}
              className={`py-2 px-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === "faq"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              id="tab-quick-faq"
            >
              <HelpCircle className="h-3.5 w-3.5 text-purple-500" />
              <span>{isIndonesian ? "FAQ Kilat" : "Quick FAQ"}</span>
            </button>
          </div>

          {/* Popover Content Body */}
          <div className="p-4 sm:p-5 overflow-y-auto flex-1 text-xs space-y-4">
            
            {/* SUCCESS STATE */}
            {isSuccess ? (
              <div className="text-center py-6 px-2 space-y-4 animate-in fade-in duration-150">
                <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600 border border-emerald-200">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                
                <div className="space-y-1.5">
                  <h4 className="text-base font-black text-slate-900">
                    {activeTab === "report" 
                      ? (isIndonesian ? "Laporan Kendala Diterima!" : "Issue Report Received!") 
                      : (isIndonesian ? "Pertanyaan Anda Terkirim!" : "Inquiry Dispatched!")}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    {isIndonesian 
                      ? "Tiket telah diteruskan langsung ke Pusat Pesan Super Admin. Tim dukungan kami akan menindaklanjuti via Email atau WhatsApp Anda."
                      : "Your ticket has been sent to Super Admin Inbox. Our support team will respond via Email or WhatsApp."}
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 text-left space-y-1.5">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-400 font-bold">{isIndonesian ? "Nomor Tiket:" : "Ticket ID:"}</span>
                    <span className="font-mono font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                      #{submittedTicketId.slice(-6).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-400 font-bold">{isIndonesian ? "Pelapor:" : "Sender:"}</span>
                    <span className="font-extrabold text-slate-800 truncate max-w-[180px]">{userName}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-400 font-bold">{isIndonesian ? "Estimasi Respon:" : "Response SLA:"}</span>
                    <span className="font-extrabold text-emerald-700">&lt; 24 Jam Kerja</span>
                  </div>
                </div>

                {/* Direct WhatsApp Action for Urgent cases */}
                <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-center justify-between text-left">
                  <div className="space-y-0.5">
                    <p className="text-[11px] font-extrabold text-emerald-950">{isIndonesian ? "Butuh Bantuan Mendesak?" : "Urgent Inquiry?"}</p>
                    <p className="text-[10px] text-emerald-800">{isIndonesian ? "Chat WhatsApp Helpdesk resmi kami" : "Chat with official WhatsApp helpdesk"}</p>
                  </div>
                  <a
                    href="https://wa.me/6281288990000?text=Halo%20Admin%20TalentHub,%20saya%20membutuhkan%20bantuan%20seputar%20platform."
                    target="_blank"
                    rel="noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] px-3 py-1.5 rounded-xl flex items-center gap-1 transition-colors shrink-0"
                  >
                    <PhoneCall className="h-3 w-3" />
                    <span>WhatsApp</span>
                  </a>
                </div>

                <div className="pt-2 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    {isIndonesian ? "Kirim Pesan Lain" : "Send Another"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    {isIndonesian ? "Tutup" : "Close"}
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* 1. REPORT ISSUE FORM */}
                {activeTab === "report" && (
                  <form onSubmit={handleSubmit} className="space-y-3.5" id="form-report-issue">
                    <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-2xl text-[11px] text-amber-900 flex items-start space-x-2">
                      <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-extrabold block">{isIndonesian ? "Layanan Aduan & Pelaporan Bug" : "Issue & Bug Helpdesk"}</span>
                        <span className="text-amber-800">
                          {isIndonesian 
                            ? "Laporkan kendala akses login, error halaman, tautan rusak, atau masalah teknis lainnya." 
                            : "Report broken links, login issues, platform bugs, or technical challenges."}
                        </span>
                      </div>
                    </div>

                    {/* Category Selection */}
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">{isIndonesian ? "Kategori Kendala *" : "Issue Category *"}</label>
                      <select
                        value={issueCategory}
                        onChange={(e) => setIssueCategory(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
                      >
                        <option value="account_login">{isIndonesian ? "Kendala Akun & Login" : "Account & Login"}</option>
                        <option value="broken_link">{isIndonesian ? "Tautan / Tombol Rusak" : "Broken Link / Button"}</option>
                        <option value="verification_issue">{isIndonesian ? "Masalah Verifikasi KTP / Portofolio" : "Verification Issue"}</option>
                        <option value="program_application">{isIndonesian ? "Kendala Lamaran / Sourcing" : "Application & Sourcing"}</option>
                        <option value="system_bug">{isIndonesian ? "Bug / Tampilan Error Halaman" : "UI Bug / System Error"}</option>
                        <option value="other">{isIndonesian ? "Lainnya" : "Other"}</option>
                      </select>
                    </div>

                    {/* Sender Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div className="space-y-1">
                        <label className="font-bold text-slate-700">{isIndonesian ? "Nama Anda *" : "Your Name *"}</label>
                        <input
                          type="text"
                          required
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          placeholder="e.g. Ahmad Fauzi"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-slate-700">{isIndonesian ? "Email Aktif *" : "Active Email *"}</label>
                        <input
                          type="email"
                          required
                          value={userEmail}
                          onChange={(e) => setUserEmail(e.target.value)}
                          placeholder="ahmad@gmail.com"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">{isIndonesian ? "No. WhatsApp / Telepon *" : "WhatsApp / Phone *"}</label>
                      <input
                        type="text"
                        required
                        value={userPhone}
                        onChange={(e) => setUserPhone(e.target.value)}
                        placeholder="+62 812-3456-7890"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
                      />
                    </div>

                    {/* Issue Subject */}
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">{isIndonesian ? "Judul Kendala *" : "Issue Title *"}</label>
                      <input
                        type="text"
                        required
                        value={issueSubject}
                        onChange={(e) => setIssueSubject(e.target.value)}
                        placeholder={isIndonesian ? "Contoh: Tombol lamar magang tidak merespon saat diklik" : "e.g. Apply button not responding"}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
                      />
                    </div>

                    {/* Issue Details */}
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">{isIndonesian ? "Rincian Masalah & Langkah yang Dilakukan *" : "Issue Details & Steps *"}</label>
                      <textarea
                        required
                        rows={3}
                        value={issueDescription}
                        onChange={(e) => setIssueDescription(e.target.value)}
                        placeholder={isIndonesian ? "Ceritakan apa yang terjadi, pesan error yang muncul, atau link yang bermasalah..." : "Describe what happened and any error messages seen..."}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white py-2.5 rounded-xl font-extrabold transition-all shadow-md shadow-amber-600/20 cursor-pointer flex items-center justify-center gap-2 mt-2"
                      id="btn-submit-issue"
                    >
                      <Send className={`h-3.5 w-3.5 ${submitting ? "animate-spin" : ""}`} />
                      <span>
                        {submitting 
                          ? (isIndonesian ? "Mengirim Laporan..." : "Submitting Report...") 
                          : (isIndonesian ? "Kirim Laporan Kendala" : "Submit Issue Report")}
                      </span>
                    </button>
                  </form>
                )}

                {/* 2. GENERAL INQUIRY FORM */}
                {activeTab === "inquiry" && (
                  <form onSubmit={handleSubmit} className="space-y-3.5" id="form-general-inquiry">
                    <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-2xl text-[11px] text-blue-900 flex items-start space-x-2">
                      <MessageSquare className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-extrabold block">{isIndonesian ? "Tanya Admin & Konsultasi Layanan" : "Ask Admin & General Inquiries"}</span>
                        <span className="text-blue-800">
                          {isIndonesian 
                            ? "Punya pertanyaan seputar cara kerja platform, rekrutmen talenta, atau beasiswa? Tanyakan di sini." 
                            : "Got questions about talent sourcing, candidate profiles, or platform guides? Ask our admin."}
                        </span>
                      </div>
                    </div>

                    {/* Inquiry Topic */}
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">{isIndonesian ? "Topik Pertanyaan *" : "Inquiry Topic *"}</label>
                      <select
                        value={inquiryTopic}
                        onChange={(e) => setInquiryTopic(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/30"
                      >
                        <option value="general_platform">{isIndonesian ? "Informasi Umum Platform" : "General Platform Info"}</option>
                        <option value="recruiter_sourcing">{isIndonesian ? "Pertanyaan Rekrutmen & Sourcing HR" : "HR Sourcing & Hiring"}</option>
                        <option value="candidate_career">{isIndonesian ? "Bimbingan Karir & Portofolio" : "Candidate Career Guidance"}</option>
                        <option value="scholarship_inquiry">{isIndonesian ? "Tanya Beasiswa & Magang" : "Scholarship & Internships"}</option>
                        <option value="institutional_partnership">{isIndonesian ? "Kerjasama Instansi / Kampus" : "Institutional Partnership"}</option>
                        <option value="other">{isIndonesian ? "Lainnya" : "Other"}</option>
                      </select>
                    </div>

                    {/* Sender Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div className="space-y-1">
                        <label className="font-bold text-slate-700">{isIndonesian ? "Nama Anda *" : "Your Name *"}</label>
                        <input
                          type="text"
                          required
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          placeholder="e.g. Siska Nirmala"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/30"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-slate-700">{isIndonesian ? "Email Aktif *" : "Active Email *"}</label>
                        <input
                          type="email"
                          required
                          value={userEmail}
                          onChange={(e) => setUserEmail(e.target.value)}
                          placeholder="siska@company.id"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/30"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">{isIndonesian ? "No. WhatsApp / Telepon *" : "WhatsApp / Phone *"}</label>
                      <input
                        type="text"
                        required
                        value={userPhone}
                        onChange={(e) => setUserPhone(e.target.value)}
                        placeholder="+62 813-9988-1122"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/30"
                      />
                    </div>

                    {/* Inquiry Subject */}
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">{isIndonesian ? "Subjek Pertanyaan *" : "Subject *"}</label>
                      <input
                        type="text"
                        required
                        value={inquirySubject}
                        onChange={(e) => setInquirySubject(e.target.value)}
                        placeholder={isIndonesian ? "Contoh: Cara mengundang 10 talenta sekaligus untuk interview" : "e.g. How to invite multiple candidates"}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/30"
                      />
                    </div>

                    {/* Inquiry Message */}
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">{isIndonesian ? "Pesan / Pertanyaan Anda *" : "Your Question / Message *"}</label>
                      <textarea
                        required
                        rows={3}
                        value={inquiryMessage}
                        onChange={(e) => setInquiryMessage(e.target.value)}
                        placeholder={isIndonesian ? "Tuliskan pertanyaan Anda secara jelas..." : "Type your inquiry here..."}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2.5 rounded-xl font-extrabold transition-all shadow-md shadow-blue-600/20 cursor-pointer flex items-center justify-center gap-2 mt-2"
                      id="btn-submit-inquiry"
                    >
                      <Send className={`h-3.5 w-3.5 ${submitting ? "animate-spin" : ""}`} />
                      <span>
                        {submitting 
                          ? (isIndonesian ? "Mengirim Pertanyaan..." : "Submitting Inquiry...") 
                          : (isIndonesian ? "Kirim Pertanyaan ke Admin" : "Submit Inquiry to Admin")}
                      </span>
                    </button>
                  </form>
                )}

                {/* 3. QUICK FAQ ACCORDION */}
                {activeTab === "faq" && (
                  <div className="space-y-3" id="faq-accordion-list">
                    <div className="p-3 bg-purple-50/70 border border-purple-200/80 rounded-2xl text-[11px] text-purple-900 flex items-start space-x-2">
                      <HelpCircle className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-extrabold block">{isIndonesian ? "Jawaban Cepat & Pertanyaan Umum" : "Instant Answers & FAQ"}</span>
                        <span className="text-purple-800">
                          {isIndonesian ? "Temukan jawaban langsung untuk pertanyaan yang paling sering diajukan." : "Find quick answers to common platform questions."}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {faqItems.map((item, idx) => {
                        const isExpanded = expandedFaq === idx;
                        return (
                          <div 
                            key={idx}
                            className="border border-slate-200 rounded-2xl bg-slate-50/70 overflow-hidden transition-all"
                          >
                            <button
                              type="button"
                              onClick={() => setExpandedFaq(isExpanded ? null : idx)}
                              className="w-full p-3 text-left font-extrabold text-slate-800 hover:text-blue-600 flex items-center justify-between gap-2 cursor-pointer"
                            >
                              <span className="text-xs leading-snug">{item.q}</span>
                              {isExpanded ? (
                                <ChevronUp className="h-4 w-4 text-slate-400 shrink-0" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
                              )}
                            </button>
                            {isExpanded && (
                              <div className="px-3 pb-3 text-xs text-slate-600 font-medium leading-relaxed border-t border-slate-200/60 pt-2 bg-white">
                                {item.a}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-1.5">
                      <p className="text-[11px] text-slate-500 font-medium">
                        {isIndonesian ? "Masih butuh bantuan lain?" : "Still need assistance?"}
                      </p>
                      <button
                        type="button"
                        onClick={() => setActiveTab("inquiry")}
                        className="text-xs font-black text-blue-600 hover:underline cursor-pointer"
                      >
                        {isIndonesian ? "→ Tanyakan Langsung ke Admin" : "→ Ask Our Admin Directly"}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

          </div>

          {/* Footer branding */}
          <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-semibold shrink-0">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>TalentHub HelpDesk v2.4</span>
            </span>
            <span>{isIndonesian ? "Respon Dijamin" : "Guaranteed Support"}</span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. FLOATING ACTION TRIGGER BUBBLE (Bottom-Right Corner) */}
      {/* ========================================================================= */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
        
        {/* Friendly Invitation Tooltip */}
        {!isOpen && showTooltip && (
          <div className="hidden sm:flex items-center space-x-2 bg-slate-900 text-white text-xs font-bold py-2 px-3.5 rounded-2xl shadow-xl border border-slate-800 animate-in fade-in slide-in-from-right-4 duration-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-0.5" />
            <span>{isIndonesian ? "Butuh Bantuan atau Laporkan Kendala?" : "Need Help or Report an Issue?"}</span>
            <button
              onClick={(e) => { e.stopPropagation(); setShowTooltip(false); }}
              className="text-slate-400 hover:text-white p-0.5 rounded-md hover:bg-slate-800 transition-colors ml-1 cursor-pointer"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}

        {/* Floating Bubble Button */}
        <button
          onClick={handleToggleOpen}
          className={`h-14 w-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl cursor-pointer relative group ${
            isOpen
              ? "bg-slate-900 text-white hover:bg-slate-800 rotate-90 shadow-slate-900/30"
              : "bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 shadow-blue-600/30"
          }`}
          id="support-chat-bubble-btn"
          aria-label={isIndonesian ? "Buka Pusat Bantuan" : "Open Help Center"}
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <>
              <MessageCircle className="h-6 w-6 group-hover:animate-wiggle" />
              {/* Online Pulse Indicator */}
              <span className="absolute top-0 right-0 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white" />
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
