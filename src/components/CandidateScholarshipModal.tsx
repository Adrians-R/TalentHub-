/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  X, 
  Award, 
  GraduationCap, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  ExternalLink,
  Clock,
  ShieldCheck,
  BookOpen,
  HelpCircle
} from "lucide-react";
import { TrainingProgram, Candidate, CandidateScholarshipApplication, DEFAULT_PROFILE_IMAGE } from "../types";
import { useLanguage } from "../context/LanguageContext";

interface CandidateScholarshipModalProps {
  isOpen: boolean;
  onClose: () => void;
  training: TrainingProgram | null;
  candidate: Candidate;
  onSubmitApplication: (application: CandidateScholarshipApplication) => void;
}

export default function CandidateScholarshipModal({
  isOpen,
  onClose,
  training,
  candidate,
  onSubmitApplication
}: CandidateScholarshipModalProps) {
  const { isIndonesian } = useLanguage();

  const [motivationEssay, setMotivationEssay] = useState("");
  const [careerGoals, setCareerGoals] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState(candidate.github || candidate.website || "");
  const [linkedinUrl, setLinkedinUrl] = useState(candidate.linkedin || "");
  const [gpaOrAchievement, setGpaOrAchievement] = useState("");
  const [economicBackground, setEconomicBackground] = useState("");
  const [weeklyCommitmentHours, setWeeklyCommitmentHours] = useState<number>(15);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen || !training) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!motivationEssay.trim() || motivationEssay.trim().length < 30) {
      setErrorMsg(
        isIndonesian 
          ? "Mohon tuliskan esai motivasi minimal 30 karakter untuk mempermudah penilaian kurasi beasiswa."
          : "Please write a motivation essay of at least 30 characters for scholarship curation."
      );
      return;
    }

    if (!careerGoals.trim()) {
      setErrorMsg(
        isIndonesian
          ? "Mohon cantumkan rencana dan target karir Anda setelah menyelesaikan program ini."
          : "Please specify your career goals upon completing this training."
      );
      return;
    }

    if (!agreeTerms) {
      setErrorMsg(
        isIndonesian
          ? "Anda wajib menyetujui komitmen kehadiran minimal 85% dan kepatuhan kode etik program."
          : "You must accept the 85% attendance commitment and code of conduct."
      );
      return;
    }

    setIsSubmitting(true);

    const newApplication: CandidateScholarshipApplication = {
      id: `sch_app_${Date.now()}`,
      candidateId: candidate.id,
      candidateName: candidate.fullName,
      candidateEmail: candidate.email,
      candidatePhone: candidate.phone,
      candidateAvatar: candidate.avatar || DEFAULT_PROFILE_IMAGE,
      trainingId: training.id,
      trainingTitle: training.title,
      provider: training.provider,
      format: training.format,
      motivationEssay: motivationEssay.trim(),
      careerGoals: careerGoals.trim(),
      portfolioUrl: portfolioUrl.trim() || undefined,
      linkedinUrl: linkedinUrl.trim() || undefined,
      gpaOrAchievement: gpaOrAchievement.trim() || undefined,
      economicBackground: economicBackground.trim() || undefined,
      weeklyCommitmentHours,
      submittedAt: new Date().toISOString().split("T")[0],
      status: "under_review",
      adminFeedback: isIndonesian 
        ? "Berkas formulir beasiswa Anda telah diterima oleh Tim Kurasi TalentHub & Mitra Penyelenggara. Pengumuman hasil kurasi akan diperbarui secara berkala." 
        : "Your scholarship submission has been received and is currently under review by our curation team."
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onSubmitApplication(newApplication);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 my-6 relative">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="h-11 w-11 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 shrink-0">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-md">
                  {isIndonesian ? "Formulir Seleksi Beasiswa" : "Scholarship Application"}
                </span>
                <span className="text-[10px] font-bold text-slate-400">
                  {training.type} • {training.format}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1">
                {training.title}
              </h3>
              <p className="text-xs text-slate-500 font-semibold">
                {isIndonesian ? "Penyelenggara Mitra:" : "Provider:"} <span className="text-slate-800 font-bold">{training.provider}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Info Banner */}
        <div className="p-3.5 bg-purple-50/70 border border-purple-100 rounded-2xl flex items-start gap-2.5 text-xs text-purple-950 font-medium">
          <GraduationCap className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-extrabold block text-purple-950">
              {isIndonesian ? "Program Beasiswa Selektif (Kuota Terbatas: 50 Kursi)" : "Competitive Scholarship (Limited Quota: 50 Spots)"}
            </span>
            <span className="text-purple-900/90 text-[11px] leading-relaxed block mt-0.5">
              {isIndonesian
                ? "Karena beasiswa memiliki kuota terbatas (contoh: 50 penerima dari 1.000+ pendaftar), seluruh kandidat melalui tahapan kurasi profil dan esai motivasi. Rincian alokasi biaya dan penetapan dana penuh diberikan secara resmi setelah kandidat dinyatakan lolos seleksi."
                : "Due to strictly limited quotas, all candidates undergo profile and essay curation. Full funding details and formal award letters are disclosed upon successful selection."}
            </span>
          </div>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2 text-xs text-red-700 font-bold">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Candidate Pre-fill Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">{isIndonesian ? "Nama Lengkap" : "Full Name"}</span>
              <span className="font-extrabold text-slate-800 text-xs block">{candidate.fullName}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">{isIndonesian ? "Email & Kontak" : "Email & Contact"}</span>
              <span className="font-extrabold text-slate-800 text-xs block">{candidate.email}</span>
            </div>
          </div>

          {/* Motivation Essay */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="font-extrabold text-slate-800">
                {isIndonesian ? "Esai Motivasi: Mengapa Anda Layak Menerima Beasiswa Ini? *" : "Motivation Statement *"}
              </label>
              <span className="text-[10px] text-slate-400 font-semibold">{motivationEssay.length} karakter</span>
            </div>
            <textarea
              rows={3}
              value={motivationEssay}
              onChange={(e) => setMotivationEssay(e.target.value)}
              placeholder={isIndonesian 
                ? "Ceritakan latar belakang Anda, antusiasme terhadap materi kurikulum, serta bagaimana beasiswa ini akan memberikan dampak nyata bagi karir Anda..."
                : "Describe your background, enthusiasm for this curriculum, and how this scholarship will impact your career..."}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
          </div>

          {/* Career Goals */}
          <div className="space-y-1">
            <label className="font-extrabold text-slate-800">
              {isIndonesian ? "Rencana & Target Karir Pasca Kelulusan *" : "Post-Graduation Career Goals *"}
            </label>
            <input
              type="text"
              value={careerGoals}
              onChange={(e) => setCareerGoals(e.target.value)}
              placeholder={isIndonesian 
                ? "Contoh: Bekerja sebagai Full-Stack Developer di industri Fintech dalam 6 bulan ke depan"
                : "e.g. Work as a Full-Stack Engineer at a high-growth tech startup within 6 months"}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
          </div>

          {/* Portfolio & LinkedIn Link */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-extrabold text-slate-800">
                {isIndonesian ? "Tautan Portofolio / GitHub / Proyek" : "Portfolio / GitHub Link"}
              </label>
              <input
                type="url"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                placeholder="https://github.com/..."
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            <div className="space-y-1">
              <label className="font-extrabold text-slate-800">
                {isIndonesian ? "Tautan Profil LinkedIn" : "LinkedIn Profile URL"}
              </label>
              <input
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/..."
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>
          </div>

          {/* Commitment & Eligibility */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-extrabold text-slate-800">
                {isIndonesian ? "Komitmen Waktu Belajar per Minggu" : "Weekly Time Commitment"}
              </label>
              <select
                value={weeklyCommitmentHours}
                onChange={(e) => setWeeklyCommitmentHours(Number(e.target.value))}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 cursor-pointer"
              >
                <option value={10}>10 {isIndonesian ? "Jam / Minggu (Part-time)" : "Hours / Week"}</option>
                <option value={15}>15 {isIndonesian ? "Jam / Minggu (Rekomendasi)" : "Hours / Week (Recommended)"}</option>
                <option value={20}>20+ {isIndonesian ? "Jam / Minggu (Intensif)" : "Hours / Week (Intensive)"}</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-extrabold text-slate-800">
                {isIndonesian ? "IPK / Prestasi Terakhir (Opsional)" : "GPA / Academic Merit (Optional)"}
              </label>
              <input
                type="text"
                value={gpaOrAchievement}
                onChange={(e) => setGpaOrAchievement(e.target.value)}
                placeholder={isIndonesian ? "Contoh: IPK 3.82 / Juara 2 Hackathon" : "e.g. GPA 3.82 / Hackathon Winner"}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>
          </div>

          {/* Agreement Checkbox */}
          <div className="pt-2">
            <label className="flex items-start gap-2.5 cursor-pointer bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="h-4 w-4 mt-0.5 rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
              />
              <span className="text-[11px] text-slate-600 leading-snug">
                {isIndonesian
                  ? "Saya menyatakan bahwa seluruh data di atas adalah benar. Saya berkomitmen mengikuti minimal 85% sesi pertemuan (online/offline) serta menyelesaikan seluruh modul kurikulum hingga tuntas."
                  : "I declare that all information is truthful. I commit to maintaining at least 85% attendance and completing all syllabus modules."}
              </span>
            </label>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
            >
              {isIndonesian ? "Batal" : "Cancel"}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white font-black rounded-xl text-xs transition-all shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
              <span>
                {isSubmitting 
                  ? (isIndonesian ? "Mengirim Berkas..." : "Submitting...") 
                  : (isIndonesian ? "Kirim Pengajuan Beasiswa" : "Submit Scholarship Application")}
              </span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
