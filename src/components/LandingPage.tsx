/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Search, 
  ArrowRight, 
  CheckCircle, 
  ShieldCheck, 
  Calendar,
  Award, 
  ExternalLink,
  ChevronRight,
  HelpCircle,
  TrendingUp,
  Users,
  Briefcase
} from "lucide-react";
import { Candidate, TrainingProgram, CareerArticle, DEFAULT_PROFILE_IMAGE } from "../types";
import { useLanguage } from "../context/LanguageContext";

interface LandingPageProps {
  candidates: Candidate[];
  trainings: TrainingProgram[];
  articles: CareerArticle[];
  onSearch: (query: string) => void;
  onSelectCandidate: (candidateId: string) => void;
  onTabChange: (tab: string) => void;
}

export default function LandingPage({
  candidates,
  trainings,
  articles,
  onSearch,
  onSelectCandidate,
  onTabChange,
}: LandingPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { t, formatCurrency, isIndonesian } = useLanguage();

  // [PAID_FEATURE_TOGGLE] Feature toggle for paid plans on Landing Page.
  // Set to true to re-display subscription pricing cards:
  const SHOW_PAID_PRICING_PLANS = false;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
    onTabChange("browse");
  };

  const handleSkillClick = (skill: string) => {
    onSearch(skill);
    onTabChange("browse");
  };

  const popularSkills = [
    "React", "TypeScript", "Node.js", "System Design", "UI/UX Design", "Growth Marketing", "SQL", "Figma"
  ];

  const statistics = [
    { value: "45.200+", label: t("hero_stats_profiles") },
    { value: isIndonesian ? "3,4 Hari" : "3.4 Days", label: t("hero_stats_time") },
    { value: "98,4%", label: t("hero_stats_satisfaction") },
    { value: "1.250+", label: t("hero_stats_companies") }
  ];

  const trustedCompanies = [
    { name: "Tokopedia" },
    { name: "Traveloka" },
    { name: "Bukalapak" },
    { name: "GoTo" },
    { name: "Telkom Indonesia" },
    { name: "Bank Mandiri Digital" }
  ];

  const faqs = isIndonesian ? [
    {
      q: "Bagaimana cara kerja model perekrutan terbalik (Reversed Recruitment)?",
      a: "Alih-alih pencari kerja harus melamar dan mengirim ratusan CV yang sering kali diabaikan, di TalentHub Anda cukup melengkapi profil terverifikasi dengan portofolio nyata dan skor ATS. Tim HR perusahaan akan langsung mencari dan mengirimkan undangan wawancara beserta tawaran gaji transparan dalam mata uang Rupiah."
    },
    {
      q: "Apa fungsi Lencana Terverifikasi (Verified Badge)?",
      a: "Tim moderasi kami memvalidasi identitas, keaslian sertifikat, dan riwayat pengalaman kandidat. Lencana terverifikasi memberikan jaminan kepada perusahaan bahwa kompetensi yang tercantum 100% valid dan siap dipekerjakan."
    },
    {
      q: "Apakah ada alat simulasi ATS dan analisis kesenjangan keahlian?",
      a: "Ya! Di dashboard kandidat, Anda dapat menggunakan AI ATS Resume Analyzer dan AI Skill Gap Explorer (didukung model Gemini) untuk menganalisis kesesuaian profil Anda dengan standar industri teknologi secara gratis."
    },
    {
      q: "Berapa biaya pendaftaran bagi kandidat dan pencari kerja?",
      a: "100% Gratis untuk seluruh kandidat. Anda tidak dipungut biaya apa pun untuk membuat profil, memamerkan portofolio, maupun menerima tawaran wawancara kerja."
    }
  ] : [
    {
      q: "How does the reversed recruitment model work?",
      a: "Instead of searching for job vacancies and sending hundreds of CVs, candidates build structured professional profiles with portfolios and certified credentials. Recruiters search our database using highly refined filters and proactively send direct Interview Invitations containing clear salary details in Indonesian Rupiah."
    },
    {
      q: "What is the Verified Badge on Candidate profiles?",
      a: "Our moderation team validates email, phone, certificates, and identity. A Verified badge guarantees to recruiters that the credentials and experience listed are 100% authentic, significantly reducing background-checking overheads."
    },
    {
      q: "Is there an ATS scoring calculator built-in?",
      a: "Yes! Candidates can upload their current resumes and utilize our server-side AI ATS checker (powered by Gemini) to analyze their score, identify missing industry-specific keywords, and receive layout improvements instantly."
    },
    {
      q: "Is it free for job seekers and candidates?",
      a: "100% Free for all candidates. You will never be charged for building your verified profile, showcasing your portfolio, or accepting interview invitations."
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen" id="landing-page-root">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-24 lg:pt-20 lg:pb-28 bg-white border-b border-slate-200">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-indigo-50/40 rounded-full blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12 xl:gap-16 items-start">
            
            {/* Left Column: Headline, Description, Search Bar, Skills & CTAs */}
            <div className="lg:col-span-7 space-y-7">
              
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-blue-50 border border-blue-100 text-blue-700 rounded-full text-xs font-extrabold tracking-wide uppercase">
                  <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse shrink-0" />
                  <span>{t("hero_badge")}</span>
                </div>
                
                <h1 className="text-3xl sm:text-4xl lg:text-[50px] font-black tracking-tight text-slate-900 leading-[1.15]">
                  {t("hero_title_1")} <br className="hidden sm:inline" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700">
                    {t("hero_title_highlight")}
                  </span> <br />
                  {t("hero_title_2")}
                </h1>
              </div>

              <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed max-w-xl">
                {t("hero_desc")}
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3.5">
                <button
                  id="hero-cta-candidate-btn"
                  onClick={() => onTabChange("candidate-dashboard")}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-7 py-3.5 rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-xl transition-all flex items-center justify-center space-x-2 text-sm cursor-pointer border border-transparent"
                >
                  <Briefcase className="h-4 w-4 text-blue-200" />
                  <span>{t("hero_cta_candidate")}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  id="hero-cta-recruiter-btn"
                  onClick={() => onTabChange("browse")}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3.5 rounded-xl transition-all text-sm flex items-center justify-center space-x-2 cursor-pointer shadow-xs"
                >
                  <Users className="h-4 w-4 text-slate-300" />
                  <span>{t("hero_cta_recruiter")}</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap gap-y-3 gap-x-6 text-xs text-slate-500 font-bold pt-2 border-t border-slate-100">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
                  <span>{isIndonesian ? "100% Talenta Terverifikasi" : "100% Identity-Verified Engineers"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4.5 w-4.5 text-blue-600 shrink-0" />
                  <span>{isIndonesian ? "Gaji Rupiah Transparan" : "Transparent IDR Salary Offers"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4.5 w-4.5 text-blue-600 shrink-0" />
                  <span>{isIndonesian ? "Undangan Wawancara Langsung" : "Direct Interview Pitches"}</span>
                </div>
              </div>

              {/* Search Bar */}
              <div className="pt-1">
                <form onSubmit={handleSearchSubmit} className="max-w-xl">
                  <div className="flex flex-col sm:flex-row gap-2 bg-slate-50 p-2 pl-4 rounded-2xl border border-slate-200 hover:border-slate-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                    <div className="relative flex-1 flex items-center">
                      <Search className="h-4.5 w-4.5 text-slate-400 mr-2.5 shrink-0" />
                      <input
                        type="text"
                        id="hero-search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t("hero_search_placeholder")}
                        className="w-full bg-transparent text-slate-800 placeholder-slate-400 focus:outline-hidden text-sm font-semibold py-2"
                      />
                    </div>
                    <button
                      type="submit"
                      id="hero-search-submit-btn"
                      className="bg-slate-950 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer shrink-0"
                    >
                      <span>{t("hero_search_btn")}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </form>

                {/* Popular Skills */}
                <div className="space-y-1.5 mt-3">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                    {t("hero_popular_skills")}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {popularSkills.map((skill) => (
                      <button
                        key={skill}
                        id={`skill-tag-${skill}`}
                        onClick={() => handleSkillClick(skill)}
                        className="text-xs font-bold px-2.5 py-1 bg-white hover:bg-blue-50 text-slate-600 hover:text-blue-700 rounded-lg transition-all cursor-pointer border border-slate-200 hover:border-blue-200"
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Visual Demo of Reversed Sourcing */}
            <div className="hidden lg:block lg:col-span-5 space-y-6">
              
              <div className="border border-slate-200/80 bg-slate-50/50 rounded-3xl p-6 relative shadow-xs">
                <span className="absolute -top-3 left-6 bg-slate-900 text-white text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full border border-slate-800 shadow-xs">
                  {isIndonesian ? "Alur Perekrutan Terbalik" : "Reversed Sourcing Flow"}
                </span>

                <div className="space-y-4 pt-2">
                  
                  {/* Step 1: Query */}
                  <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="bg-blue-100 text-blue-700 p-1.5 rounded-lg">
                          <Search className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-xs font-extrabold text-slate-800">
                          {isIndonesian ? "Perekrut Mencari di Basis Data" : "Recruiter Queries Database"}
                        </span>
                      </div>
                      <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded">
                        {isIndonesian ? "Pencarian Aktif" : "Active Query"}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold">"React"</span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded font-bold">"TypeScript"</span>
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold border border-emerald-200">"Terverifikasi ✓"</span>
                    </div>
                  </div>

                  {/* Connector */}
                  <div className="flex justify-center -my-2">
                    <div className="h-5 w-0.5 bg-slate-300 border-l border-dashed" />
                  </div>

                  {/* Step 2: Matched Verified Candidate */}
                  <div className="bg-white border-2 border-emerald-500/40 p-4 rounded-2xl shadow-sm relative">
                    <span className="absolute -top-2.5 right-4 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full text-[9px] font-black flex items-center border border-emerald-200 shadow-xs">
                      <ShieldCheck className="h-3 w-3 mr-1 text-emerald-600" />
                      {isIndonesian ? "TERVERIFIKASI RESMI" : "VERIFIED & ATS VALIDATED"}
                    </span>
                    <div className="flex items-center space-x-3">
                      <img
                        src={DEFAULT_PROFILE_IMAGE}
                        alt="Alex Rivera"
                        className="h-10 w-10 rounded-xl object-cover border border-slate-200"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = DEFAULT_PROFILE_IMAGE;
                        }}
                      />
                      <div>
                        <h4 className="text-xs font-extrabold text-slate-900">Alex Rivera</h4>
                        <p className="text-[11px] text-slate-500 font-medium">94% ATS Score • Senior Full Stack Engineer</p>
                      </div>
                    </div>
                  </div>

                  {/* Connector */}
                  <div className="flex justify-center -my-2">
                    <div className="h-5 w-0.5 bg-slate-300 border-l border-dashed" />
                  </div>

                  {/* Step 3: Direct Sourcing Pitch in IDR */}
                  <div className="bg-slate-900 text-white p-4.5 rounded-2xl shadow-xl space-y-3 relative overflow-hidden border border-slate-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="bg-blue-600 text-white p-1 rounded-lg">
                          <Calendar className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-xs font-black tracking-wide text-white uppercase">
                          {isIndonesian ? "Undangan Wawancara Diterima" : "Direct Sourcing Pitch"}
                        </span>
                      </div>
                      <span className="text-[11px] text-emerald-400 font-extrabold bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                        {formatCurrency(28000000, "month")}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 font-medium italic leading-relaxed">
                      {isIndonesian 
                        ? `"Halo Alex! Kami terkesan dengan portofolio Next.js dan skor ATS 94% Anda. Kami ingin menawarkan posisi Lead Architect dengan kompensasi Rp 28.000.000/bulan. Apakah ada waktu wawancara hari Kamis ini?"`
                        : `"Hi Alex! We reviewed your Next.js portfolio and 94% ATS score. We'd like to pitch a Lead Architect role with Rp 28,000,000/month. Are you available for a direct video interview this Thursday?"`}
                    </p>
                    <div className="flex justify-end pt-1">
                      <button 
                        onClick={() => onTabChange("candidate-dashboard")}
                        className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black px-3.5 py-1.5 rounded-lg transition-all cursor-pointer"
                      >
                        {isIndonesian ? "Terima & Masuk Jadwal" : "Accept & Schedule"}
                      </button>
                    </div>
                  </div>

                </div>
              </div>

            </div>

          </div>

          {/* Featured Statistics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-14 sm:mt-16 border-t border-slate-100 pt-10">
            {statistics.map((stat, idx) => (
              <div key={idx} className="bg-slate-50/70 hover:bg-slate-50 border border-slate-200/60 rounded-2xl p-4.5 transition-all text-center lg:text-left">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 block tracking-tight">
                  {stat.value}
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider block mt-1.5">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 2. Trusted Companies Banner */}
      <section className="bg-white border-b border-slate-100 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">
            {t("hero_trusted_by")}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10 md:gap-14 opacity-75">
            {trustedCompanies.map((comp) => (
              <span key={comp.name} className="text-base font-extrabold text-slate-600 tracking-tight flex items-center space-x-1.5">
                <span className="h-2 w-2 rounded-full bg-blue-600" />
                <span>{comp.name}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 3. How It Works 3-Step Section */}
      <section className="py-16 sm:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 text-xs font-bold text-blue-700 border border-blue-100">
              <span>{t("how_it_works_badge")}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t("how_it_works_title")}
            </h2>
            <p className="text-slate-600 font-medium text-sm sm:text-base">
              {t("how_it_works_subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Step 1 */}
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 relative hover:border-blue-300 transition-all">
              <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-700 font-black flex items-center justify-center text-base">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900">{t("step1_title")}</h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                {t("step1_desc")}
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 relative hover:border-blue-300 transition-all">
              <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-700 font-black flex items-center justify-center text-base">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900">{t("step2_title")}</h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                {t("step2_desc")}
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 relative hover:border-blue-300 transition-all">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-700 font-black flex items-center justify-center text-base">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900">{t("step3_title")}</h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                {t("step3_desc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Featured Candidates Section */}
      <section className="py-16 sm:py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 text-xs font-bold text-blue-700">
                <span>{t("featured_talent_badge")}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {t("featured_talent_title")}
              </h2>
              <p className="text-slate-500 font-medium text-xs sm:text-sm max-w-xl">
                {t("featured_talent_subtitle")}
              </p>
            </div>
            <button
              id="view-all-talents-btn"
              onClick={() => onTabChange("browse")}
              className="mt-4 sm:mt-0 inline-flex items-center space-x-1 text-blue-600 hover:text-blue-700 font-bold text-xs sm:text-sm cursor-pointer"
            >
              <span>{t("featured_view_all")}</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {candidates.map((cand) => (
              <div 
                key={cand.id} 
                id={`featured-cand-card-${cand.id}`}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-lg hover:-translate-y-0.5 transition-all p-5 sm:p-6 flex flex-col justify-between overflow-hidden"
              >
                <div>
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <img
                        src={cand.avatar || DEFAULT_PROFILE_IMAGE}
                        alt={cand.fullName}
                        className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl object-cover border border-slate-200 shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = DEFAULT_PROFILE_IMAGE;
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="font-extrabold text-slate-900 text-sm truncate max-w-full">
                            {cand.fullName}
                          </h3>
                          {cand.verified && (
                            <span className="px-2 py-0.5 rounded text-[9px] uppercase tracking-wider font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                              {t("verified_badge")}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 font-semibold truncate">{cand.location}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-black text-blue-800 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 shrink-0">
                      {cand.atsScore}% ATS
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 font-medium leading-relaxed mt-3.5 line-clamp-2 break-words">
                    {cand.headline}
                  </p>

                  <div className="flex flex-wrap gap-1 mt-3.5">
                    {cand.skills.slice(0, 3).map((skill) => (
                      <span
                        key={skill.id}
                        className="text-[10px] font-bold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md truncate max-w-[120px]"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-100 mt-5 pt-3.5 flex items-center justify-between gap-2">
                  <span className="text-xs text-slate-800 font-black truncate">{cand.expectedSalary}</span>
                  <button
                    id={`view-profile-landing-btn-${cand.id}`}
                    onClick={() => {
                      onSelectCandidate(cand.id);
                      onTabChange("browse");
                    }}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1 cursor-pointer shrink-0"
                  >
                    <span>{t("view_profile_btn")}</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Training & Skill Development Center */}
      <section className="py-16 sm:py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
            
            <div className="lg:col-span-5 space-y-5">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 text-xs font-bold text-emerald-700 border border-emerald-100">
                <Award className="h-3.5 w-3.5" />
                <span>{t("learning_section_badge")}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {t("learning_section_title")}
              </h2>
              <p className="text-slate-600 font-medium text-xs sm:text-sm leading-relaxed">
                {t("learning_section_subtitle")}
              </p>
              
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center space-x-2">
                  <span className="text-emerald-600 font-extrabold">✓</span>
                  <span className="text-xs sm:text-sm text-slate-700 font-bold">
                    {isIndonesian ? "Pelatihan Resmi Kominfo (Digital Talent Scholarship)" : "Official Ministry of Communication & Tech Curricula"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-emerald-600 font-extrabold">✓</span>
                  <span className="text-xs sm:text-sm text-slate-700 font-bold">
                    {isIndonesian ? "Sertifikasi Otomatis Meningkatkan Skor Profil" : "Automatic Verified Badge upon Certification"}
                  </span>
                </div>
              </div>

              <button
                id="landing-explore-training-btn"
                onClick={() => onTabChange("training")}
                className="mt-4 bg-slate-950 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-xs flex items-center space-x-1.5 cursor-pointer"
              >
                <span>{t("explore_trainings_btn")}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* List of featured trainings */}
            <div className="mt-10 lg:mt-0 lg:col-span-7 grid sm:grid-cols-2 gap-5">
              {trainings.slice(0, 2).map((prog) => (
                <div 
                  key={prog.id}
                  className="border border-slate-200 bg-white p-5 rounded-2xl flex flex-col justify-between shadow-xs hover:border-blue-300 transition-all"
                >
                  <div className="space-y-3">
                    <span className="text-[10px] font-extrabold text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {prog.type} • {prog.format}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm leading-snug">{prog.title}</h4>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed line-clamp-3">{prog.description}</p>
                  </div>
                  <div className="border-t border-slate-100 mt-4 pt-3 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500">{prog.provider}</span>
                    <button 
                      onClick={() => onTabChange("training")}
                      className="text-xs font-bold text-blue-600 hover:underline cursor-pointer flex items-center"
                    >
                      {isIndonesian ? "Daftar" : "Details"} <ExternalLink className="h-3 w-3 ml-1" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* 6. Pricing & Subscription Plans Section */}
      {/* [PAID_FEATURE_TOGGLE] Pricing plans section hidden for Free Trial. Change SHOW_PAID_PRICING_PLANS to true to restore: */}
      {SHOW_PAID_PRICING_PLANS && (
      <section className="py-16 sm:py-24 bg-slate-100/70 border-t border-slate-200" id="pricing-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-black tracking-wide uppercase">
              <span>{isIndonesian ? "Paket Berlangganan & Harga" : "Subscription Plans & Pricing"}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {isIndonesian ? "Investasi Terbaik untuk Pertumbuhan Karier & Rekrutmen" : "Transparent Plans for Candidates & Recruiters"}
            </h2>
            <p className="text-slate-600 font-medium text-xs sm:text-sm max-w-2xl mx-auto">
              {isIndonesian 
                ? "Daftar gratis untuk membangun profil atau merekrut talenta. Tingkatkan ke Talent Pro atau Recruiter Premium untuk audit AI tanpa batas dan hasil maksimal."
                : "Free to join for candidates and employers. Upgrade to Pro or Premium for unlimited AI scans, verified priority, and faster placement."}
            </p>
          </div>

          {/* Pricing Quick Cards Grid */}
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch">
            
            {/* Candidate Standard */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-all">
              <div className="space-y-4">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
                  {isIndonesian ? "Pencari Kerja" : "Candidates"}
                </span>
                <div>
                  <h3 className="text-xl font-black text-slate-900">{isIndonesian ? "Paket Standar" : "Standard Free"}</h3>
                  <div className="flex items-baseline space-x-1 mt-1">
                    <span className="text-3xl font-black text-slate-900">Rp 0</span>
                    <span className="text-xs text-slate-500 font-semibold">{isIndonesian ? "/ selamanya" : "/ forever"}</span>
                  </div>
                </div>
                <ul className="space-y-2.5 text-xs font-semibold text-slate-600 pt-2 border-t border-slate-100">
                  <li className="flex items-center space-x-2">
                    <span className="text-blue-600 font-black">✓</span>
                    <span>{isIndonesian ? "2x Kuota Audit AI ATS Resume" : "2x Free AI ATS Resume Scans"}</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-blue-600 font-black">✓</span>
                    <span>{isIndonesian ? "Profil Terverifikasi & Portofolio" : "Verified Profile & Portfolio"}</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-blue-600 font-black">✓</span>
                    <span>{isIndonesian ? "Terima Undangan Pitch HR Gaji IDR" : "Receive Direct Pitches with IDR"}</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => onTabChange("candidate-dashboard")}
                className="mt-6 w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all cursor-pointer text-center"
              >
                {isIndonesian ? "Mulai Gratis" : "Get Started Free"}
              </button>
            </div>

            {/* Candidate Talent Pro */}
            <div className="bg-gradient-to-b from-indigo-50/70 via-white to-white rounded-3xl border-2 border-indigo-600 p-6 sm:p-7 flex flex-col justify-between shadow-xl relative overflow-hidden">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-indigo-600 text-white">
                    {isIndonesian ? "Akselerasi Karier" : "Pro Talent"}
                  </span>
                  <span className="text-[10px] font-extrabold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                    👑 LinkedIn-Style PRO
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">Talent Pro</h3>
                  <div className="flex items-baseline space-x-1 mt-1">
                    <span className="text-3xl font-black text-indigo-700">Rp 49.000</span>
                    <span className="text-xs text-slate-500 font-semibold">{isIndonesian ? "/ bulan" : "/ month"}</span>
                  </div>
                </div>
                <ul className="space-y-2.5 text-xs font-semibold text-slate-700 pt-2 border-t border-slate-100">
                  <li className="flex items-center space-x-2 text-indigo-950 font-bold">
                    <span className="text-indigo-600 font-black">✓</span>
                    <span>{isIndonesian ? "Audit AI ATS & Keyword Tanpa Batas" : "Unlimited AI ATS Scans"}</span>
                  </li>
                  <li className="flex items-center space-x-2 text-slate-900 font-bold">
                    <span className="text-amber-500 font-black">👑</span>
                    <span>{isIndonesian ? "Lencana Mahkota PRO di Pencarian HR" : "PRO Crown Badge in Recruiter Search"}</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-indigo-600 font-black">✓</span>
                    <span>{isIndonesian ? "Generator Cover Letter AI Otomatis" : "AI Tailored Cover Letter Generator"}</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-indigo-600 font-black">✓</span>
                    <span>{isIndonesian ? "Prioritas Ranking Teratas di Hasil HR" : "Priority Ranking in Sourcing Directory"}</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => onTabChange("pricing")}
                className="mt-6 w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-extrabold shadow-md shadow-indigo-200 transition-all cursor-pointer text-center"
              >
                {isIndonesian ? "Lihat & Aktifkan Pro" : "Upgrade to Talent Pro"}
              </button>
            </div>

            {/* Recruiter Premium */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-all">
              <div className="space-y-4">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-blue-100 text-blue-800">
                  {isIndonesian ? "Untuk Tim Rekruter" : "For Recruiters"}
                </span>
                <div>
                  <h3 className="text-xl font-black text-slate-900">Recruiter Premium</h3>
                  <div className="flex items-baseline space-x-1 mt-1">
                    <span className="text-3xl font-black text-blue-700">Rp 1.499.000</span>
                    <span className="text-xs text-slate-500 font-semibold">{isIndonesian ? "/ bulan" : "/ month"}</span>
                  </div>
                </div>
                <ul className="space-y-2.5 text-xs font-semibold text-slate-600 pt-2 border-t border-slate-100">
                  <li className="flex items-center space-x-2">
                    <span className="text-blue-600 font-black">✓</span>
                    <span>{isIndonesian ? "60 Query Pencarian / menit" : "60 High-Speed Searches / min"}</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-blue-600 font-black">✓</span>
                    <span>{isIndonesian ? "50 Undangan Sourcing Wawancara / bln" : "50 Direct Sourcing Pitches / mo"}</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-blue-600 font-black">✓</span>
                    <span>{isIndonesian ? "Kontak WhatsApp & Telepon Terbuka" : "Direct WhatsApp & Email Access"}</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-blue-600 font-black">✓</span>
                    <span>{isIndonesian ? "Filter Talenta Terverifikasi & PRO" : "Verified & PRO Candidate Filter"}</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => onTabChange("pricing")}
                className="mt-6 w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer text-center"
              >
                {isIndonesian ? "Pilih Paket Rekruter" : "Explore Recruiter Plans"}
              </button>
            </div>

          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => onTabChange("pricing")}
              className="inline-flex items-center space-x-2 text-xs font-extrabold text-blue-600 hover:text-blue-800 bg-white border border-blue-200 px-5 py-2.5 rounded-xl shadow-2xs hover:shadow-xs transition-all cursor-pointer"
            >
              <span>{isIndonesian ? "Bandingkan Seluruh Fitur di Halaman Paket & Harga" : "View Full Comparison Table & Enterprise Plans"}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

        </div>
      </section>
      )}

      {/* 7. FAQs */}
      <section className="py-16 sm:py-20 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 space-y-2">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 text-xs font-bold text-blue-700">
              <span>{t("faq_badge")}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t("faq_title")}
            </h2>
            <p className="text-slate-500 font-semibold text-xs sm:text-sm">{t("faq_subtitle")}</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-slate-50/60 p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                <h4 className="font-bold text-slate-900 text-sm flex items-start space-x-2">
                  <HelpCircle className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>{faq.q}</span>
                </h4>
                <p className="text-xs text-slate-600 font-medium leading-relaxed mt-2 ml-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Call To Action Footer Banner */}
      <section className="bg-blue-600 text-white py-16 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-5">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t("cta_banner_title")}
          </h2>
          <p className="text-blue-100 max-w-xl mx-auto text-xs sm:text-sm font-semibold leading-relaxed">
            {t("cta_banner_desc")}
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-3">
            <button
              id="cta-join-candidate-btn"
              onClick={() => onTabChange("candidate-dashboard")}
              className="w-full sm:w-auto bg-white hover:bg-blue-50 text-blue-700 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm shadow-lg transition-all cursor-pointer flex items-center justify-center space-x-1.5"
            >
              <span>{t("cta_banner_candidate_btn")}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              id="cta-join-recruiter-btn"
              onClick={() => onTabChange("browse")}
              className="w-full sm:w-auto bg-blue-700 hover:bg-blue-800 text-white border border-blue-400 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center"
            >
              {t("cta_banner_recruiter_btn")}
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 text-xs font-semibold">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <span className="text-white text-base font-bold">TalentHub Indonesia</span>
            <p className="text-[11px] leading-relaxed text-slate-500">
              {t("footer_tagline")}
            </p>
          </div>
          <div>
            <span className="text-white uppercase tracking-wider font-bold mb-3 block">
              {t("footer_for_candidates")}
            </span>
            <ul className="space-y-2 text-slate-400">
              <li><button onClick={() => onTabChange("candidate-dashboard")} className="hover:text-white cursor-pointer">AI ATS Resume Checker</button></li>
              {/* [PAID_FEATURE_TOGGLE] Paid plan link commented out for Free Trial:
              <li><button onClick={() => onTabChange("pricing")} className="hover:text-white cursor-pointer">{isIndonesian ? "Paket Talent Pro" : "Talent Pro Plan"}</button></li>
              */}
              <li><button onClick={() => onTabChange("training")} className="hover:text-white cursor-pointer">{t("nav_learning")}</button></li>
              <li><button onClick={() => onTabChange("programs-scholarships")} className="hover:text-white cursor-pointer">{t("nav_scholarships")}</button></li>
            </ul>
          </div>
          <div>
            <span className="text-white uppercase tracking-wider font-bold mb-3 block">
              {t("footer_for_recruiters")}
            </span>
            <ul className="space-y-2 text-slate-400">
              <li><button onClick={() => onTabChange("browse")} className="hover:text-white cursor-pointer">{t("nav_browse_talent")}</button></li>
              {/* [PAID_FEATURE_TOGGLE] Paid plan link commented out for Free Trial:
              <li><button onClick={() => onTabChange("pricing")} className="hover:text-white cursor-pointer">{isIndonesian ? "Paket & Harga Rekruter" : "Recruiter Pricing & Plans"}</button></li>
              */}
              <li><button onClick={() => onTabChange("recruiter-dashboard")} className="hover:text-white cursor-pointer">{t("nav_dashboard")}</button></li>
              <li><button onClick={() => onTabChange("dev-docs")} className="hover:text-white cursor-pointer">{t("nav_dev_docs")}</button></li>
            </ul>
          </div>
          <div>
            <span className="text-white uppercase tracking-wider font-bold mb-3 block">
              {t("nav_simulation_tools")}
            </span>
            <ul className="space-y-2 text-slate-400">
              <li><button onClick={() => onTabChange("candidate-dashboard")} className="hover:text-white cursor-pointer">{t("nav_candidate_simulator")}</button></li>
              <li><button onClick={() => onTabChange("recruiter-dashboard")} className="hover:text-white cursor-pointer">{t("nav_recruiter_simulator")}</button></li>
              <li><button onClick={() => onTabChange("admin-dashboard")} className="hover:text-white cursor-pointer">{t("nav_admin_simulator")}</button></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800 mt-8 pt-8 text-center text-[10px] text-slate-500 font-bold">
          &copy; 2026 TalentHub Indonesia. {t("footer_rights")}
        </div>
      </footer>
    </div>
  );
}
