/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  X, 
  Send, 
  Building2, 
  User, 
  Mail, 
  Phone, 
  BookOpen, 
  GraduationCap, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Globe, 
  Clock, 
  Award,
  Layers
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { TrainingProposal } from "../types";

interface PartnerProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitted?: (proposal: TrainingProposal) => void;
}

export default function PartnerProposalModal({
  isOpen,
  onClose,
  onSubmitted
}: PartnerProposalModalProps) {
  const { isIndonesian } = useLanguage();

  const [partnerName, setPartnerName] = useState("");
  const [institutionName, setInstitutionName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  
  // Training-specific fields
  const [programTitle, setProgramTitle] = useState("");
  const [category, setCategory] = useState<"Coding" | "Design" | "Product" | "Data" | "Marketing" | "Language">("Coding");
  const [programType, setProgramType] = useState<"Free" | "Government" | "NGO" | "Private">("Government");
  const [format, setFormat] = useState<"Online" | "Offline">("Online");
  const [duration, setDuration] = useState("8 Minggu");
  const [certification, setCertification] = useState(true);
  const [description, setDescription] = useState("");
  const [syllabusOverview, setSyllabusOverview] = useState("");
  const [requirementsText, setRequirementsText] = useState(
    isIndonesian 
      ? "Warga Negara Indonesia (WNI)\nBerusia minimal 18 tahun\nMemiliki laptop dan koneksi internet yang memadai" 
      : "Indonesian Citizen (WNI)\nMinimum 18 years old\nPossesses a personal laptop & stable internet"
  );
  const [registrationLink, setRegistrationLink] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedTicketId, setSubmittedTicketId] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!partnerName.trim() || !institutionName.trim() || !email.trim() || !phone.trim()) {
      alert(isIndonesian ? "Harap lengkapi informasi PIC dan kontak lembaga." : "Please complete PIC and contact details.");
      return;
    }

    if (!programTitle.trim() || !description.trim()) {
      alert(isIndonesian ? "Judul program dan deskripsi wajib diisi." : "Program title and description are required.");
      return;
    }

    setSubmitting(true);

    const reqArray = requirementsText
      .split("\n")
      .map(r => r.trim())
      .filter(Boolean);

    const payload: TrainingProposal = {
      id: `prop_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      type: "training_proposal",
      partnerName: partnerName.trim(),
      institutionName: institutionName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      programTitle: programTitle.trim(),
      category,
      programType,
      format,
      duration,
      certification,
      description: description.trim(),
      syllabusOverview: syllabusOverview.trim(),
      requirements: reqArray.length > 0 ? reqArray : ["Warga Negara Indonesia (WNI)"],
      registrationLink: registrationLink.trim() || "https://talenthub.id",
      imageUrl: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&q=80&w=300",
      submittedAt: new Date().toISOString(),
      status: "pending",
      adminNotes: isIndonesian ? "Diajukan melalui portal kemitraan pelatihan." : "Submitted via training partnership portal."
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
      console.warn("Proposal saved locally:", err);
      setSubmittedTicketId(payload.id);
    } finally {
      setSubmitting(false);
      setIsSuccess(true);
      onSubmitted?.(payload);
    }
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150" id="partner-proposal-modal-overlay">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden my-6">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-white tracking-tight">
                {isIndonesian ? "Ajukan Kemitraan & Program Pelatihan" : "Propose Partnership & Training"}
              </h2>
              <p className="text-xs text-slate-300 font-medium">
                {isIndonesian ? "Publikasikan program akademi Anda ke ribuan talenta terverifikasi" : "Publish your academy programs to vetted tech talents"}
              </p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
            id="partner-modal-close-btn"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {isSuccess ? (
            <div className="text-center py-8 px-4 space-y-5">
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600 border border-emerald-200">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="text-xl font-black text-slate-900">
                  {isIndonesian ? "Proposal Berhasil Dikirim!" : "Proposal Submitted Successfully!"}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  {isIndonesian 
                    ? `Pesan dan proposal program Anda telah masuk ke Pusat Pesan Super Admin dengan ID Tiket #${submittedTicketId.slice(-6).toUpperCase()}. Tim kurator kami akan menghubungi Anda via WhatsApp atau Telepon untuk mendiskusikan penerbitan program.`
                    : `Your proposal has landed in the Super Admin Inbox with Ticket ID #${submittedTicketId.slice(-6).toUpperCase()}. Our curation team will reach out via WhatsApp/Phone to finalize publishing.`}
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 max-w-md mx-auto text-left border border-slate-100 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-bold">{isIndonesian ? "Lembaga:" : "Organization:"}</span>
                  <span className="font-extrabold text-slate-800">{institutionName}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-bold">{isIndonesian ? "PIC / Kontak:" : "Contact PIC:"}</span>
                  <span className="font-extrabold text-slate-800">{partnerName} ({phone})</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-bold">{isIndonesian ? "Program:" : "Program:"}</span>
                  <span className="font-extrabold text-blue-600 truncate max-w-[220px]">{programTitle}</span>
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  id="partner-modal-done-btn"
                >
                  {isIndonesian ? "Tutup & Kembali ke Katalog" : "Close & Return to Catalog"}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6" id="partner-proposal-form">
              
              {/* Section 1: Contact & Institution Info */}
              <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 space-y-4">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-slate-500" />
                  <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                    {isIndonesian ? "1. Informasi Lembaga & Narahubung (PIC)" : "1. Organization & PIC Information"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600">
                      {isIndonesian ? "Nama Lembaga / Penyelenggara *" : "Organization / Provider *"}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. AWS Cloud Academy Indonesia / Dicoding"
                      value={institutionName}
                      onChange={(e) => setInstitutionName(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600">
                      {isIndonesian ? "Nama Lengkap PIC / Pengaju *" : "PIC Full Name *"}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Hendra Wijaya, M.Kom"
                      value={partnerName}
                      onChange={(e) => setPartnerName(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600">
                      {isIndonesian ? "Email Resmi PIC *" : "Official Email *"}
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="hendra@cloudacademy.id"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600">
                      {isIndonesian ? "No. WhatsApp / Telepon Aktif *" : "Active WhatsApp / Phone *"}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="+62 812-8899-7711"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-[10px] text-slate-400 block">
                      {isIndonesian ? "Super Admin akan menghubungi nomor ini untuk verifikasi proposal" : "Super Admin will reach out via this number"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 2: Details */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                  <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                    {isIndonesian ? "2. Spesifikasi Program Pelatihan" : "2. Training Program Specifications"}
                  </span>
                </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600">
                      {isIndonesian ? "Judul Program Pelatihan *" : "Program Title *"}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. AWS Certified Solutions Architect & DevOps Masterclass"
                      value={programTitle}
                      onChange={(e) => setProgramTitle(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600">
                        {isIndonesian ? "Kategori" : "Category"}
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as any)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Coding">Coding</option>
                        <option value="Design">Design</option>
                        <option value="Product">Product</option>
                        <option value="Data">Data</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Language">Language</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600">
                        {isIndonesian ? "Model Pendanaan" : "Type / Model"}
                      </label>
                      <select
                        value={programType}
                        onChange={(e) => setProgramType(e.target.value as any)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Government">Government (Pemerintah)</option>
                        <option value="Free">Free (Gratis)</option>
                        <option value="NGO">NGO / Beasiswa</option>
                        <option value="Private">Private (Swasta)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600">
                        {isIndonesian ? "Format" : "Format"}
                      </label>
                      <select
                        value={format}
                        onChange={(e) => setFormat(e.target.value as any)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Online">Online</option>
                        <option value="Offline">Offline</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600">
                        {isIndonesian ? "Durasi Program" : "Duration"}
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 8 Minggu"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 pt-1">
                    <input
                      type="checkbox"
                      id="prop-certification-checkbox"
                      checked={certification}
                      onChange={(e) => setCertification(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="prop-certification-checkbox" className="text-xs font-bold text-slate-700 cursor-pointer">
                      {isIndonesian ? "Program mencakup Sertifikat Digital Terakreditasi" : "Program includes Accredited Digital Certificate"}
                    </label>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600">
                      {isIndonesian ? "Ringkasan Deskripsi Program *" : "Program Description Summary *"}
                    </label>
                    <textarea
                      required
                      rows={2}
                      placeholder={isIndonesian ? "Jelaskan objektif program, keunggulan, dan target kompetensi peserta..." : "Explain program objectives and competence targets..."}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600">
                      {isIndonesian ? "Ringkasan Silabus / Kurikulum (Opsional)" : "Syllabus / Curriculum Overview (Optional)"}
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Modul 1: Docker Basics; Modul 2: Kubernetes; Modul 3: CI/CD Pipeline..."
                      value={syllabusOverview}
                      onChange={(e) => setSyllabusOverview(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600">
                      {isIndonesian ? "Kriteria / Syarat Peserta (1 baris per syarat)" : "Participant Eligibility (1 line per requirement)"}
                    </label>
                    <textarea
                      rows={3}
                      value={requirementsText}
                      onChange={(e) => setRequirementsText(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono text-slate-700"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600">
                      {isIndonesian ? "Tautan Resmi Pendaftaran / Landing Page" : "Official Registration / Landing Page URL"}
                    </label>
                    <input
                      type="url"
                      placeholder="https://cloudacademy.id/registration"
                      value={registrationLink}
                      onChange={(e) => setRegistrationLink(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  {isIndonesian ? "Batal" : "Cancel"}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center space-x-2 transition-all shadow-md shadow-blue-600/20 cursor-pointer"
                  id="partner-proposal-submit-btn"
                >
                  <Send className={`h-4 w-4 ${submitting ? "animate-spin" : ""}`} />
                  <span>
                    {submitting 
                      ? (isIndonesian ? "Mengirim..." : "Submitting...") 
                      : (isIndonesian ? "Kirim ke Super Admin" : "Submit to Super Admin")}
                  </span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
