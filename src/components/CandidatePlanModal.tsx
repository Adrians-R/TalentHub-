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
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  RotateCcw
} from "lucide-react";
import { Candidate } from "../types";

interface CandidatePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: Candidate;
  onUpdateCandidate: (updated: Candidate) => void;
  isIndonesian: boolean;
  onSuccessNotification?: (msg: string) => void;
}

export default function CandidatePlanModal({
  isOpen,
  onClose,
  candidate,
  onUpdateCandidate,
  isIndonesian,
  onSuccessNotification,
}: CandidatePlanModalProps) {
  if (!isOpen) return null;

  const currentPlan = candidate.membershipPlan || "Free";
  const quotaLimit = candidate.aiAtsQuotaLimit !== undefined ? candidate.aiAtsQuotaLimit : 2;
  const quotaUsed = candidate.aiAtsQuotaUsed || 0;
  const quotaRemaining = currentPlan === "Pro" ? 999 : Math.max(0, quotaLimit - quotaUsed);

  const handleUpgradeToPro = () => {
    const updated: Candidate = {
      ...candidate,
      membershipPlan: "Pro",
    };
    onUpdateCandidate(updated);
    if (onSuccessNotification) {
      onSuccessNotification(
        isIndonesian 
          ? "Selamat! Paket Anda berhasil ditingkatkan ke Talent Pro (Kuota AI ATS Tanpa Batas aktif)."
          : "Congratulations! You have upgraded to Talent Pro (Unlimited AI ATS Scans active)."
      );
    }
    onClose();
  };

  const handleDowngradeOrResetFree = () => {
    const updated: Candidate = {
      ...candidate,
      membershipPlan: "Free",
      aiAtsQuotaUsed: 0,
      aiAtsQuotaLimit: 2,
    };
    onUpdateCandidate(updated);
    if (onSuccessNotification) {
      onSuccessNotification(
        isIndonesian 
          ? "Paket disetel ke Paket Standar (Free). Kuota AI ATS direset menjadi 2x scan."
          : "Switched to Standard Package (Free). AI ATS quota reset to 2x scans."
      );
    }
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      id="candidate-plan-modal-backdrop"
    >
      <div 
        className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-3xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        id="candidate-plan-modal"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
                <Crown className="h-4 w-4" />
              </span>
              <h2 className="text-xl font-extrabold text-slate-900">
                {isIndonesian ? "Paket Keanggotaan & Kuota AI" : "Membership Packages & AI Quota"}
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {isIndonesian 
                ? "Pilih paket yang sesuai dengan kebutuhan akselerasi karier dan optimasi resume digital Anda."
                : "Choose the package tailored to your career acceleration and digital resume optimization needs."}
            </p>
          </div>
          <button 
            onClick={onClose}
            id="close-plan-modal-btn"
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Current Status Pill */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-xl font-extrabold text-xs ${
              currentPlan === "Pro" 
                ? "bg-amber-100 text-amber-900 border border-amber-300"
                : "bg-blue-100 text-blue-800 border border-blue-200"
            }`}>
              {currentPlan === "Pro" ? "👑 TALENT PRO" : "📦 PAKET STANDAR (FREE)"}
            </div>
            <div>
              <p className="font-bold text-slate-900">
                {isIndonesian ? "Status Paket Saat Ini" : "Current Active Plan"}: <span className="text-blue-600 font-extrabold">{currentPlan === "Pro" ? "Talent Pro Tier" : (isIndonesian ? "Paket Standar (Gratis)" : "Standard Tier (Free)")}</span>
              </p>
              <p className="text-slate-500 font-medium">
                {currentPlan === "Pro" 
                  ? (isIndonesian ? "Kuota AI ATS: Tanpa Batas (Unlimited)" : "AI ATS Quota: Unlimited")
                  : (isIndonesian 
                      ? `Kuota AI ATS: Tersisa ${quotaRemaining} dari ${quotaLimit} Scan Gratis`
                      : `AI ATS Quota: ${quotaRemaining} of ${quotaLimit} Free Scans Remaining`)}
              </p>
            </div>
          </div>
          {currentPlan === "Free" && quotaRemaining < quotaLimit && (
            <button
              onClick={handleDowngradeOrResetFree}
              className="text-[11px] font-bold text-slate-600 hover:text-blue-700 bg-white hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl cursor-pointer flex items-center justify-center space-x-1 transition-all"
              title={isIndonesian ? "Reset kuota demo ke 2x untuk pengujian" : "Reset demo quota to 2x for testing"}
            >
              <RotateCcw className="h-3 w-3" />
              <span>{isIndonesian ? "Reset Kuota Demo (2x)" : "Reset Demo Quota (2x)"}</span>
            </button>
          )}
        </div>

        {/* Pricing Cards Comparison */}
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Card 1: Standard / Free Tier */}
          <div className={`p-6 rounded-3xl border-2 space-y-5 transition-all flex flex-col justify-between ${
            currentPlan === "Free" 
              ? "border-blue-600 bg-blue-50/20 shadow-sm" 
              : "border-slate-200 bg-white"
          }`}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold tracking-widest uppercase px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
                  {isIndonesian ? "Dasar & Gratis" : "Basic & Free"}
                </span>
                {currentPlan === "Free" && (
                  <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-blue-600 text-white">
                    {isIndonesian ? "Paket Aktif" : "Active Plan"}
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  {isIndonesian ? "Paket Standar" : "Standard Package"}
                </h3>
                <div className="flex items-baseline space-x-1 mt-1">
                  <span className="text-2xl font-extrabold text-slate-900">Rp 0</span>
                  <span className="text-xs text-slate-500 font-semibold">{isIndonesian ? "/ selamanya" : "/ forever"}</span>
                </div>
                <p className="text-xs text-slate-500 mt-2 font-medium leading-relaxed">
                  {isIndonesian
                    ? "Akses esensial untuk mempublikasikan profil pencari kerja dan mencoba evaluasi AI bertenaga Gemini."
                    : "Essential access to publish your digital profile and test Gemini-powered AI evaluations."}
                </p>
              </div>

              {/* Feature Checklist */}
              <div className="space-y-2.5 border-t border-slate-100 pt-4 text-xs font-semibold text-slate-700">
                <div className="flex items-start space-x-2 text-blue-900 font-bold bg-blue-100/50 p-2 rounded-xl border border-blue-200">
                  <Zap className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>
                    {isIndonesian 
                      ? "2x Kuota Analisis AI ATS Resume (Termasuk dalam Paket)"
                      : "2x AI ATS Resume Scan Quota (Included in Package)"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>{isIndonesian ? "Profil Digital & Portofolio Publik" : "Public Digital Portfolio Profile"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>{isIndonesian ? "Terima Tawaran Interview Rekruter" : "Receive Direct Recruiter Pitches"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>{isIndonesian ? "Lamar Lowongan Kerja HR Terverifikasi" : "Apply to Verified Corporate Jobs"}</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-400">
                  <X className="h-4 w-4 text-slate-300 shrink-0" />
                  <span className="line-through">{isIndonesian ? "Audit Resume AI Tanpa Batas" : "Unlimited AI Resume Scans"}</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-400">
                  <X className="h-4 w-4 text-slate-300 shrink-0" />
                  <span className="line-through">{isIndonesian ? "Lencana Prioritas Top Talent" : "Top Talent Priority Badge"}</span>
                </div>
              </div>
            </div>

            <button
              disabled={currentPlan === "Free"}
              onClick={handleDowngradeOrResetFree}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentPlan === "Free"
                  ? "bg-slate-100 text-slate-400 cursor-default"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              {currentPlan === "Free" 
                ? (isIndonesian ? "Paket Saat Ini" : "Current Plan")
                : (isIndonesian ? "Beralih ke Paket Standar" : "Switch to Standard")}
            </button>
          </div>

          {/* Card 2: Talent Pro Tier */}
          <div className={`p-6 rounded-3xl border-2 space-y-5 transition-all flex flex-col justify-between relative overflow-hidden ${
            currentPlan === "Pro" 
              ? "border-amber-500 bg-amber-50/20 shadow-md" 
              : "border-indigo-600 bg-gradient-to-b from-indigo-50/40 to-white shadow-sm"
          }`}>
            <div className="absolute -right-12 -top-12 h-32 w-32 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold tracking-widest uppercase px-2.5 py-1 rounded-md bg-indigo-600 text-white shadow-sm">
                  {isIndonesian ? "Rekomendasi Karier" : "Recommended"}
                </span>
                {currentPlan === "Pro" && (
                  <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-amber-500 text-white flex items-center gap-1">
                    <Crown className="h-3 w-3" />
                    <span>{isIndonesian ? "Paket Aktif" : "Active Plan"}</span>
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-1.5">
                  <span>Talent Pro</span>
                  <Crown className="h-4 w-4 text-amber-500" />
                </h3>
                <div className="flex items-baseline space-x-1 mt-1">
                  <span className="text-2xl font-extrabold text-indigo-700">Rp 49.000</span>
                  <span className="text-xs text-slate-500 font-semibold">{isIndonesian ? "/ bulan" : "/ month"}</span>
                </div>
                <p className="text-xs text-slate-600 mt-2 font-medium leading-relaxed">
                  {isIndonesian
                    ? "Akselerasi pencarian kerja dengan audit ATS tak terbatas, rekomendasi kata kunci mendalam, dan lencana prioritas."
                    : "Accelerate your job search with unlimited ATS audits, deep keyword recommendations, and priority recruiter discoverability."}
                </p>
              </div>

              {/* Feature Checklist */}
              <div className="space-y-2.5 border-t border-slate-100 pt-4 text-xs font-semibold text-slate-700">
                <div className="flex items-start space-x-2 text-indigo-900 font-bold bg-indigo-100/60 p-2 rounded-xl border border-indigo-200">
                  <CheckCircle2 className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span>
                    {isIndonesian 
                      ? "Audit ATS & Analisis Kesenjangan AI Tanpa Batas (Unlimited)"
                      : "Unlimited AI ATS Audits & Core Skill Gap Analyses"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-indigo-600 shrink-0" />
                  <span>{isIndonesian ? "Lencana Prioritas 'Top Talent' Terverifikasi" : "Verified 'Top Talent' Priority Badge"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-indigo-600 shrink-0" />
                  <span>{isIndonesian ? "Rekomendasi Kata Kunci & Rekonstruksi Poin Kerja AI" : "AI Action Verb & Metric Rephrase Suggestions"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-indigo-600 shrink-0" />
                  <span>{isIndonesian ? "Notifikasi Instan saat Profil Diinspeksi HR" : "Instant Alerts when HR Views Your Profile"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-indigo-600 shrink-0" />
                  <span>{isIndonesian ? "Generator Surat Lamaran / Cover Letter AI" : "AI Cover Letter Custom Tailoring"}</span>
                </div>
              </div>
            </div>

            <button
              id="activate-talent-pro-btn"
              onClick={handleUpgradeToPro}
              className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center space-x-1.5 cursor-pointer ${
                currentPlan === "Pro"
                  ? "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-200"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200"
              }`}
            >
              <Crown className="h-4 w-4" />
              <span>
                {currentPlan === "Pro" 
                  ? (isIndonesian ? "Talent Pro Aktif (Perbarui)" : "Talent Pro Active (Renew)")
                  : (isIndonesian ? "Tingkatkan ke Talent Pro (Aktifkan)" : "Upgrade to Talent Pro (Activate)")}
              </span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

        </div>

        {/* Footer info note */}
        <div className="text-[11px] text-slate-500 text-center font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
          {isIndonesian 
            ? "💡 Model freemium ini memberikan 2 kali kesempatan analisis AI gratis bagi setiap pengguna baru untuk mencoba kualitas evaluasi sebelum beralih ke paket tanpa batas."
            : "💡 This freemium tier provides 2 free AI analysis credits for every candidate to experience evaluation quality before choosing an unlimited plan."}
        </div>
      </div>
    </div>
  );
}
