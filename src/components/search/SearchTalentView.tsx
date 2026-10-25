/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from "react";
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Banknote, 
  Award, 
  ShieldCheck, 
  Bookmark, 
  Filter, 
  ExternalLink,
  Github,
  Linkedin,
  Calendar,
  X,
  RefreshCw,
  AlertTriangle,
  Check,
  User,
  Inbox,
  AlertCircle,
  Video,
  Info,
  Crown
} from "lucide-react";
import { Candidate, Recruiter, Invitation, DEFAULT_PROFILE_IMAGE, getProfileAvatar } from "../../types";
import { CandidateRepository, SearchParams } from "../../repositories/CandidateRepository";
import { useLanguage } from "../../context/LanguageContext";

interface SearchTalentViewProps {
  recruiter: Recruiter;
  candidates: Candidate[];
  onSendInvitation: (invitation: Omit<Invitation, "id" | "createdAt" | "status">) => void;
  initialSearchSkill?: string;
}

export default function SearchTalentView({
  recruiter,
  candidates,
  onSendInvitation,
  initialSearchSkill = ""
}: SearchTalentViewProps) {
  const { t, isIndonesian, formatCurrency, formatCompactCurrency } = useLanguage();

  // 1. Instantiate the Repository Layer
  const candidateRepo = useMemo(() => new CandidateRepository(candidates), [candidates]);

  // 2. Multi-Facet Search Filter States (Default in IDR)
  const [searchQuery, setSearchQuery] = useState(initialSearchSkill);
  const [filterLocation, setFilterLocation] = useState("");
  const [isRemoteOnly, setIsRemoteOnly] = useState(false);
  const [salaryMin, setSalaryMin] = useState<number>(0);
  const [salaryMax, setSalaryMax] = useState<number>(100000000);
  const [minAtsScore, setMinAtsScore] = useState<number>(0);
  const [minExperienceYears, setMinExperienceYears] = useState<number>(0);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SearchParams["sortBy"]>("ats_score_desc");
  const [currentPage, setCurrentPage] = useState(1);

  // 3. UI Interactions, System Simulators & Modals States
  const [isDbOnline, setIsDbOnline] = useState(true);
  const [simulatedLoading, setSimulatedLoading] = useState(false);
  const [savedCandidateIds, setSavedCandidateIds] = useState<string[]>([]);
  const [skillsTaxonomy, setSkillsTaxonomy] = useState<string[]>([]);
  
  // Results holder state
  const [searchResults, setSearchResults] = useState<{
    data: Candidate[];
    totalCount: number;
    totalPages: number;
    error?: string;
  }>({ data: [], totalCount: 0, totalPages: 1 });

  // Modals / Details Drawers
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [invitingCandidate, setInvitingCandidate] = useState<Candidate | null>(null);

  // Proposal modal fields
  const [invitePosition, setInvitePosition] = useState("Senior Full-Stack Engineer (TypeScript/React)");
  const [inviteSalaryOffer, setInviteSalaryOffer] = useState("Rp 25.000.000 / bulan");
  const [inviteMeetLink, setInviteMeetLink] = useState("");
  const [inviteDate, setInviteDate] = useState("2026-07-22T14:30");
  const [inviteMessage, setInviteMessage] = useState(
    isIndonesian 
      ? "Halo, kami telah meninjau portofolio terverifikasi dan pencapaian Anda. Kami sangat tertarik dengan profil Anda dan ingin mengundang Anda untuk diskusi penjajakan kerja sama."
      : "Hi, we checked your verified portfolio and achievements. We are incredibly excited about your background and would love to propose a discovery pitch conversation."
  );

  // Sync invite message on language change if not dirty
  useEffect(() => {
    setInviteSalaryOffer(isIndonesian ? "Rp 25.000.000 / bulan" : "Rp 25,000,000 / month");
    setInviteMessage(
      isIndonesian 
        ? "Halo, kami telah meninjau portofolio terverifikasi dan pencapaian Anda. Kami sangat tertarik dengan profil Anda dan ingin mengundang Anda untuk diskusi penjajakan kerja sama."
        : "Hi, we checked your verified portfolio and achievements. We are incredibly excited about your background and would love to propose a discovery pitch conversation."
    );
  }, [isIndonesian]);

  // Success Confirmation State
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // 4. Initialize Bookmarks and Skills Taxonomy
  useEffect(() => {
    async function loadTaxonomy() {
      const taxonomy = await candidateRepo.getSkillsTaxonomy();
      setSkillsTaxonomy(taxonomy);
      const bookmarks = await candidateRepo.getBookmarks(recruiter.id);
      setSavedCandidateIds(bookmarks);
    }
    loadTaxonomy();
  }, [candidateRepo, recruiter.id]);

  // Sync initialSearchSkill if landing page query changes
  useEffect(() => {
    if (initialSearchSkill) {
      setSearchQuery(initialSearchSkill);
      setCurrentPage(1);
    }
  }, [initialSearchSkill]);

  // 5. Query Search Executer (handles simulation latency, database state, error catching)
  const fetchResults = async () => {
    setSimulatedLoading(true);
    // Explicitly configure Database Simulation Online/Offline
    CandidateRepository.setDbOnline(isDbOnline);

    // Apply 600ms latency to showcase elegant pulsars (shimmer loading state)
    await new Promise(resolve => setTimeout(resolve, 600));

    try {
      const params: SearchParams = {
        query: searchQuery,
        location: filterLocation,
        isRemote: isRemoteOnly || undefined,
        salaryMin,
        salaryMax,
        minAtsScore,
        minExperienceYears: minExperienceYears || undefined,
        skills: selectedSkills.length > 0 ? selectedSkills : undefined,
        page: currentPage,
        limit: 6, // 6 items per page for a beautifully structured bento grid
        sortBy
      };

      const results = await candidateRepo.search(params, recruiter.id, recruiter.subscriptionTier);

      if (results.success) {
        setSearchResults({
          data: results.data,
          totalCount: results.meta.totalCount,
          totalPages: results.meta.totalPages,
          error: undefined
        });
      } else {
        setSearchResults({
          data: [],
          totalCount: 0,
          totalPages: 1,
          error: results.error
        });
      }
    } catch (err: any) {
      setSearchResults({
        data: [],
        totalCount: 0,
        totalPages: 1,
        error: "Critical system connection exception occurred. Please verify configuration settings."
      });
    } finally {
      setSimulatedLoading(false);
    }
  };

  // Re-run search query whenever filter state dependencies mutate
  useEffect(() => {
    fetchResults();
  }, [
    searchQuery,
    filterLocation,
    isRemoteOnly,
    salaryMin,
    salaryMax,
    minAtsScore,
    minExperienceYears,
    selectedSkills,
    sortBy,
    currentPage,
    isDbOnline
  ]);

  // Handle bookmarking candidate profiles
  const handleToggleBookmark = async (candidateId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const updated = await candidateRepo.toggleBookmark(recruiter.id, candidateId);
      setSavedCandidateIds(updated);
      showToast(updated.includes(candidateId) ? "Candidate added to watchlists" : "Bookmark retracted");
    } catch (err) {
      showToast("Cannot toggle bookmark: DB is offline");
    }
  };

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  // 6. Direct Interview Pitch Form Submission (Successful Sourcing Pitch Flow)
  const handleSendInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invitingCandidate) return;

    // Strict validation rules: Check datetime in the future
    const selectedTime = new Date(inviteDate).getTime();
    const nowTime = Date.now();
    if (isNaN(selectedTime) || selectedTime < nowTime) {
      alert("Validation Error: Proposed schedule date must be set in the future.");
      return;
    }

    if (!inviteMeetLink.trim()) {
      alert(isIndonesian 
        ? "Tautan Google Meet wajib diisi secara manual oleh HR. Silakan buat tautan Google Meet baru dan tempelkan ke kolom yang tersedia."
        : "Google Meet link must be manually generated and entered by HR.");
      return;
    }

    onSendInvitation({
      recruiterId: recruiter.id,
      recruiterName: recruiter.fullName,
      companyName: recruiter.companyName,
      companyLogo: recruiter.companyLogo,
      candidateId: invitingCandidate.id,
      position: invitePosition,
      message: inviteMessage,
      salaryOffer: inviteSalaryOffer,
      interviewLink: inviteMeetLink.trim(),
      scheduledDate: inviteDate || undefined
    });

    setInvitingCandidate(null);
    setInviteMeetLink("");
    showToast(`Success! Sourcing Pitch proposal safely dispatched to ${invitingCandidate.fullName}`);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setFilterLocation("");
    setIsRemoteOnly(false);
    setSalaryMin(0);
    setSalaryMax(100000000);
    setMinAtsScore(0);
    setMinExperienceYears(0);
    setSelectedSkills([]);
    setCurrentPage(1);
    setSortBy("ats_score_desc");
  };

  const toggleSkillSelection = (skillName: string) => {
    setSelectedSkills(prev => 
      prev.includes(skillName) 
        ? prev.filter(s => s !== skillName)
        : [...prev, skillName]
    );
    setCurrentPage(1);
  };

  return (
    <div className="space-y-8" id="search-talent-sourcing-engine">
      
      {/* ----------------- SUB-HEADER SYSTEM & ROBUST CONTROLS ----------------- */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2">
            <Search className="h-5 w-5 text-blue-400" />
            <h2 className="text-lg font-extrabold tracking-tight">
              {isIndonesian ? "Mesin Penemuan & Perekrutan TalentHub" : "TalentHub Discovery & Sourcing Engine"}
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            {isIndonesian 
              ? "Temukan profil profesional terverifikasi berstandar tinggi. Evaluasi portofolio proyek teknis dan jadwalkan wawancara video langsung. Informasi kontak dilindungi hingga undangan pitch disetujui."
              : "Discover verified, top-tier professional profiles. Evaluate technical portfolio projects and schedule direct video interviews. Contact information is masked until pitches are approved."}
          </p>
        </div>

        {/* Interactive Simulation Panel (Robustness testing & rate limits) */}
        <div className="flex flex-wrap items-center gap-3.5 bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-bold text-slate-500">
              {isIndonesian ? "Gateway Layanan:" : "Service Gateway:"}
            </span>
            <button
              onClick={() => setIsDbOnline(!isDbOnline)}
              className={`px-3 py-1.5 rounded-lg font-bold text-[10px] transition-all cursor-pointer ${
                isDbOnline 
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                  : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
              }`}
              title="Click to simulate DB connection dropout"
            >
              {isIndonesian ? "Basis Data:" : "Database:"} {isDbOnline ? (isIndonesian ? "Online" : "Online") : (isIndonesian ? "Offline" : "Offline")}
            </button>
          </div>
          <div className="h-4 w-px bg-slate-800 hidden sm:block" />
          <div className="text-[10px] font-bold text-slate-400">
            {/* [PAID_FEATURE_TOGGLE] Paid subscription status commented out for Free Trial:
            {isIndonesian ? "Langganan:" : "Subscription:"} <span className="text-blue-400 font-extrabold">{recruiter.subscriptionTier} Plan</span> (Max {recruiter.subscriptionTier === "Enterprise" ? "120" : recruiter.subscriptionTier === "Premium" ? "60" : "20"} {isIndonesian ? "pencarian/menit" : "searches/min"})
            */}
            <span className="text-emerald-400 font-extrabold">{isIndonesian ? "Free Trial: Akses Penuh" : "Free Trial: Full Access"}</span> ({isIndonesian ? "Pencarian tanpa batas" : "Unlimited searches"})
          </div>
        </div>
      </div>

      {/* SUCCESS CONFIRMATION TOAST */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center space-x-3 text-xs font-bold animate-slide-up">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
          <span>{successToast}</span>
        </div>
      )}

      {/* ----------------- PRIMARY DOCK PANEL: LAYOUT ----------------- */}
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* SIDEBAR: MULTI-FACET FILTER CONTROLLER */}
        <aside className="lg:col-span-3 bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-6 self-start">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-blue-600" />
              <h3 className="font-extrabold text-slate-900 text-sm">
                {isIndonesian ? "Filter Pencarian" : "Sourcing Filters"}
              </h3>
            </div>
            <button 
              onClick={handleResetFilters}
              className="text-[10px] font-extrabold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
            >
              {isIndonesian ? "Reset Semua" : "Reset All"}
            </button>
          </div>

          <div className="space-y-5 text-xs font-semibold text-slate-700">
            {/* 1. Keyword search (Input Validation) */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">
                {isIndonesian ? "Kata Kunci Pencarian" : "Query search"}
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  maxLength={100}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder={isIndonesian ? "Pengembang React, Figma, backend..." : "React developer, Figma, system..."}
                  className="w-full pl-9 pr-3.5 py-2.5 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-xs transition-all"
                />
              </div>
            </div>

            {/* 2. Location (Fuzzy Trigram Simulator) */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">
                {isIndonesian ? "Lokasi Target" : "Target location"}
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  maxLength={100}
                  value={filterLocation}
                  onChange={(e) => {
                    setFilterLocation(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder={isIndonesian ? "Contoh: Jakarta, Bandung, Surabaya..." : "e.g. Jakarta, Singapore, Bandung..."}
                  className="w-full pl-9 pr-3.5 py-2.5 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-xs transition-all"
                />
              </div>
            </div>

            {/* 3. Skill Taxonomy Multi-select */}
            <div className="space-y-2">
              <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">
                {isIndonesian ? "Keahlian Wajib" : "Required Skills"}
              </label>
              <div className="flex flex-wrap gap-1 max-h-[140px] overflow-y-auto pr-1 border border-slate-100 p-2 rounded-xl bg-slate-50/50">
                {skillsTaxonomy.map(skill => {
                  const selected = selectedSkills.includes(skill);
                  return (
                    <button
                      key={skill}
                      onClick={() => toggleSkillSelection(skill)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                        selected 
                          ? "bg-blue-600 text-white border border-blue-600" 
                          : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      {skill}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Expected compensation slider (in IDR) */}
            <div className="space-y-2 border-t border-slate-100 pt-4">
              <div className="flex justify-between items-center text-[10px] text-slate-400 uppercase font-bold">
                <span>{isIndonesian ? "Rentang Gaji yang Diharapkan" : "Compensation Bounds"}</span>
                <span className="text-slate-800 font-extrabold">
                  {formatCompactCurrency(salaryMin)} - {formatCompactCurrency(salaryMax)}
                </span>
              </div>
              <div className="space-y-1">
                <input
                  type="range"
                  min="0"
                  max="100000000"
                  step="1000000"
                  value={salaryMin}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val > salaryMax) {
                      setSalaryMax(val);
                    }
                    setSalaryMin(val);
                    setCurrentPage(1);
                  }}
                  className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <input
                  type="range"
                  min="0"
                  max="100000000"
                  step="1000000"
                  value={salaryMax}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val < salaryMin) {
                      setSalaryMin(val);
                    }
                    setSalaryMax(val);
                    setCurrentPage(1);
                  }}
                  className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
            </div>

            {/* 5. Minimum Experience Selector */}
            <div className="space-y-1.5 border-t border-slate-100 pt-4">
              <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">
                {isIndonesian ? "Pengalaman Kerja Minimum" : "Min Professional Experience"}
              </label>
              <select
                value={minExperienceYears}
                onChange={(e) => {
                  setMinExperienceYears(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="w-full border border-slate-200 focus:border-blue-500 rounded-xl p-2.5 text-xs bg-white text-slate-700 font-bold"
              >
                <option value={0}>{isIndonesian ? "Semua Pengalaman" : "Any Experience"}</option>
                <option value={1}>{isIndonesian ? "1+ Tahun" : "1+ Years"}</option>
                <option value={3}>{isIndonesian ? "3+ Tahun" : "3+ Years"}</option>
                <option value={5}>{isIndonesian ? "5+ Tahun" : "5+ Years"}</option>
                <option value={7}>{isIndonesian ? "7+ Tahun" : "7+ Years"}</option>
              </select>
            </div>

            {/* 6. ATS Matching Quality threshold */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">
                  {isIndonesian ? "Kualitas Kecocokan ATS Min" : "Min ATS Match Quality"}
                </label>
                <span className="text-[10px] text-blue-600 font-extrabold">{minAtsScore}% {isIndonesian ? "Kecocokan" : "Match"}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="10"
                value={minAtsScore}
                onChange={(e) => {
                  setMinAtsScore(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* 7. Remote check */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <label htmlFor="remote-search-only" className="text-xs text-slate-600 font-semibold cursor-pointer">
                {isIndonesian ? "Hanya Profesional Remote" : "Remote Professionals Only"}
              </label>
              <input
                type="checkbox"
                id="remote-search-only"
                checked={isRemoteOnly}
                onChange={(e) => {
                  setIsRemoteOnly(e.target.checked);
                  setCurrentPage(1);
                }}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </div>

          </div>
        </aside>

        {/* RESULTS FEED AND CANDIDATES BENTO GRID */}
        <section className="lg:col-span-9 space-y-6">
          
          {/* HEADER RESULTS COUNT AND SORTING CONFIG */}
          <div className="bg-white p-4 border border-slate-100 rounded-2xl shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-slate-500 font-bold text-center sm:text-left">
              {simulatedLoading ? (
                <span className="text-blue-600 flex items-center gap-1.5 font-extrabold">
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" /> {isIndonesian ? "Mesin pencari sedang mencocokkan kandidat..." : "Discovery Engine sourcing matches..."}
                </span>
              ) : (
                <span>
                  {isIndonesian ? "Kandidat Ditemukan:" : "Discovered Matches:"} <span className="text-slate-800 font-extrabold">{searchResults.totalCount} {isIndonesian ? "Profil Terverifikasi" : "Verified Profiles"}</span>
                </span>
              )}
            </span>

            <div className="flex items-center space-x-2 text-xs">
              <span className="text-slate-400 font-bold text-[10px] uppercase">{isIndonesian ? "Urutkan:" : "Sort Sourcing Index:"}</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="border border-slate-200 rounded-lg p-1.5 text-xs text-slate-700 bg-white font-bold"
              >
                <option value="ats_score_desc">{isIndonesian ? "Relevansi Skor ATS %" : "ATS Match Relevance %"}</option>
                <option value="salary_asc">{isIndonesian ? "Gaji: Terendah ke Tertinggi" : "Compensation: Low to High"}</option>
                <option value="salary_desc">{isIndonesian ? "Gaji: Tertinggi ke Terendah" : "Compensation: High to Low"}</option>
                <option value="name_asc">{isIndonesian ? "Nama (A-Z)" : "Name Index (A-Z)"}</option>
              </select>
            </div>
          </div>

          {/* SYSTEM ERROR / DISNECTION DROPOUT HANDLER */}
          {searchResults.error && (
            <div className="bg-rose-50 border border-rose-150 rounded-2xl p-5 flex items-start space-x-3.5 text-rose-800 text-xs font-semibold animate-shake">
              <AlertTriangle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-extrabold text-rose-900">Sourcing Engine Intercepted Failure</h4>
                <p className="text-rose-600 leading-relaxed font-semibold">{searchResults.error}</p>
                {searchResults.error.includes("synchronization") && (
                  <button
                    onClick={() => {
                      setIsDbOnline(true);
                      fetchResults();
                    }}
                    className="mt-3 inline-flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                  >
                    <RefreshCw className="h-3 w-3" /> Reactivate Database Channel
                  </button>
                )}
              </div>
            </div>
          )}

          {/* 1. LOADING STATE (PRISTINE SHIMMER SKELETON CARDS) */}
          {simulatedLoading && !searchResults.error && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="sourcing-loading-skeletons">
              {[1, 2, 3, 4].map(idx => (
                <div 
                  key={idx} 
                  className="bg-white rounded-[24px] border border-slate-100 p-6 flex flex-col justify-between space-y-5 animate-pulse overflow-hidden"
                >
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3.5">
                      <div className="h-12 w-12 rounded-full bg-slate-100 shrink-0" />
                      <div className="space-y-2 flex-1 min-w-0">
                        <div className="h-3 w-28 bg-slate-200 rounded-md" />
                        <div className="h-2.5 w-16 bg-slate-100 rounded-md" />
                      </div>
                    </div>
                    <div className="h-14 bg-slate-50/50 rounded-xl border border-slate-100/50 p-2 space-y-2">
                      <div className="h-2 w-full bg-slate-100 rounded-md" />
                      <div className="h-2 w-3/4 bg-slate-100 rounded-md" />
                    </div>
                    <div className="flex gap-1.5">
                      <div className="h-5 w-14 bg-slate-100 rounded-md" />
                      <div className="h-5 w-16 bg-slate-100 rounded-md" />
                      <div className="h-5 w-12 bg-slate-100 rounded-md" />
                    </div>
                  </div>
                  <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
                    <div className="space-y-1">
                      <div className="h-2 w-10 bg-slate-100 rounded-md" />
                      <div className="h-3 w-16 bg-slate-200 rounded-md" />
                    </div>
                    <div className="h-8 w-24 bg-slate-200 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 2. SUCCESS STATE (DYNAMICAL STAGGERED GRID) */}
          {!simulatedLoading && !searchResults.error && searchResults.data.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="sourcing-results-active-grid">
              {searchResults.data.map((cand) => (
                <div
                  key={cand.id}
                  onClick={() => setSelectedCandidate(cand)}
                  className="bg-white rounded-[24px] border border-slate-200 hover:border-blue-400 hover:shadow-xl hover:-translate-y-0.5 p-5 sm:p-6 flex flex-col justify-between cursor-pointer transition-all relative group shadow-sm flex-1 overflow-hidden"
                >
                  <div>
                    {/* Card Header Profile metrics */}
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="flex items-center space-x-3 sm:space-x-3.5 min-w-0 flex-1">
                        <img
                          src={getProfileAvatar(cand.avatar)}
                          alt={cand.fullName}
                          referrerPolicy="no-referrer"
                          className="h-12 w-12 sm:h-14 sm:w-14 rounded-full object-cover border border-slate-100 shrink-0 shadow-xs"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = DEFAULT_PROFILE_IMAGE;
                          }}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="font-extrabold text-slate-900 text-sm truncate max-w-full">{cand.fullName}</h4>
                            {cand.verified && (
                              <span className="px-2 py-0.5 rounded-[6px] text-[8px] uppercase tracking-wider font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-0.5 shrink-0">
                                Verified
                              </span>
                            )}
                            {cand.membershipPlan === "Pro" && (
                              <span 
                                className="px-1.5 py-0.5 rounded-md text-[8px] font-black bg-amber-50 text-amber-800 border border-amber-300 flex items-center gap-0.5 shrink-0 shadow-2xs"
                                title={isIndonesian ? "Kandidat Premium (Talent Pro)" : "Premium Candidate (Talent Pro)"}
                              >
                                <Crown className="h-2.5 w-2.5 text-amber-600 shrink-0" />
                                <span>PRO</span>
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 font-bold truncate">{cand.location}</p>
                        </div>
                      </div>

                      {/* Bookmark watchlist toggles */}
                      <button
                        onClick={(e) => handleToggleBookmark(cand.id, e)}
                        className="p-1.5 rounded-full border border-slate-150 hover:bg-slate-50 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer shrink-0"
                      >
                        <Bookmark className={`h-3.5 w-3.5 ${savedCandidateIds.includes(cand.id) ? "fill-blue-600 text-blue-600" : ""}`} />
                      </button>
                    </div>

                    {/* Technical Headline Summary */}
                    <p className="text-xs text-slate-600 font-medium leading-relaxed mt-3.5 sm:mt-4 line-clamp-2 min-h-[2.5rem] break-words">
                      {cand.headline}
                    </p>

                    {/* Skill Badget Tags taxonomy */}
                    <div className="flex flex-wrap gap-1.5 mt-3.5 sm:mt-4">
                      {cand.skills.slice(0, 4).map((sk) => (
                        <span
                          key={sk.id}
                          className="text-[10px] font-bold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg border border-slate-100 hover:bg-slate-200 truncate max-w-[130px]"
                        >
                          {sk.name}
                        </span>
                      ))}
                      {cand.skills.length > 4 && (
                        <span className="text-[9px] font-bold text-slate-400 self-center shrink-0">
                          +{cand.skills.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Bottom: expected salary & direct action CTA */}
                  <div className="border-t border-slate-100 mt-5 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="min-w-0">
                      <span className="text-slate-400 font-bold block uppercase text-[8px] tracking-wide">
                        {isIndonesian ? "RENTANG GAJI DIHARAPKAN" : "COMPENSATION RANGE"}
                      </span>
                      <span className="font-extrabold text-slate-900 text-xs truncate block">{cand.expectedSalary}</span>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-2.5 shrink-0">
                      <div className="flex flex-col text-left sm:text-right shrink-0">
                        <span className="text-[8px] text-slate-400 font-bold uppercase">
                          {isIndonesian ? "Skor ATS" : "ATS score"}
                        </span>
                        <span className="text-xs text-emerald-600 font-extrabold">{cand.atsScore}% {isIndonesian ? "cocok" : "match"}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setInvitingCandidate(cand);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full text-[11px] font-bold shadow-md shadow-blue-200 hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer shrink-0"
                      >
                        {isIndonesian ? "Kirim Tawaran" : "Send Pitch"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 3. EMPTY STATE (ACTION-ORIENTED RECOVERY LAYOUT) */}
          {!simulatedLoading && !searchResults.error && searchResults.data.length === 0 && (
            <div className="bg-white rounded-3xl border border-slate-150 p-12 text-center space-y-4 shadow-sm" id="sourcing-empty-state">
              <Inbox className="h-12 w-12 text-slate-300 mx-auto" />
              <h4 className="font-extrabold text-slate-800 text-base">
                {isIndonesian ? "Tidak Ada Profesional yang Cocok Ditemukan" : "No Matching Professionals Discovered"}
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto font-semibold leading-relaxed">
                {isIndonesian 
                  ? "Tidak ada profil kandidat yang cocok dengan kombinasi filter ini. Coba perlebar rentang kompensasi atau kurangi filter keahlian untuk memperluas pencarian."
                  : "No indexed candidates match this combination of filters. Try widening compensation sliders or disabling skill selectors to increase search recall."}
              </p>
              <div className="pt-2">
                <button
                  onClick={handleResetFilters}
                  className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  {isIndonesian ? "Reset Kriteria Pencarian" : "Reset Search Criteria"}
                </button>
              </div>
            </div>
          )}

          {/* PAGINATION NAVIGATION MODULE (Overflow safe limits) */}
          {!simulatedLoading && !searchResults.error && searchResults.totalCount > 0 && (
            <div className="flex items-center justify-between border-t border-slate-100 pt-6">
              <span className="text-xs font-bold text-slate-500">
                {isIndonesian ? `Halaman ${currentPage} dari ${searchResults.totalPages}` : `Page ${currentPage} of ${searchResults.totalPages}`}
              </span>

              <div className="flex space-x-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className="px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isIndonesian ? "Sebelumnya" : "Previous"}
                </button>
                <button
                  disabled={currentPage === searchResults.totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(searchResults.totalPages, prev + 1))}
                  className="px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isIndonesian ? "Selanjutnya" : "Next"}
                </button>
              </div>
            </div>
          )}

        </section>

      </div>

      {/* ----------------- SLIDE-OVER DRAWER: DETAILED CANDIDATE PROFILE EVALUATION ----------------- */}
      {selectedCandidate && (
        <div 
          className="fixed inset-0 bg-slate-950/45 backdrop-blur-xs z-50 flex justify-end p-0 md:p-4" 
          id="candidate-detail-drawer-overlay"
          onClick={() => setSelectedCandidate(null)}
        >
          <div 
            className="bg-white w-full max-w-3xl h-full md:rounded-3xl shadow-2xl border-l border-slate-100 flex flex-col justify-between animate-slide-left overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header metrics */}
            <div className="p-4 sm:p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
              <div className="flex items-center space-x-3 sm:space-x-3.5 min-w-0">
                <img
                  src={getProfileAvatar(selectedCandidate.avatar)}
                  alt={selectedCandidate.fullName}
                  referrerPolicy="no-referrer"
                  className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl object-cover border border-slate-200 shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = DEFAULT_PROFILE_IMAGE;
                  }}
                />
                <div className="min-w-0">
                  <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5 flex-wrap">
                    <span className="truncate">{selectedCandidate.fullName}</span>
                    {selectedCandidate.verified && (
                      <span className="px-2 py-0.5 rounded text-[8px] uppercase tracking-wider font-extrabold bg-emerald-100 text-emerald-800 shrink-0">
                        {isIndonesian ? "Terverifikasi" : "Verified"}
                      </span>
                    )}
                    {selectedCandidate.membershipPlan === "Pro" && (
                      <span 
                        className="px-1.5 py-0.5 rounded-md text-[8px] font-black bg-amber-50 text-amber-800 border border-amber-300 flex items-center gap-0.5 shadow-2xs shrink-0"
                        title={isIndonesian ? "Kandidat Premium (Talent Pro)" : "Premium Candidate (Talent Pro)"}
                      >
                        <Crown className="h-2.5 w-2.5 text-amber-600 shrink-0" />
                        <span>PRO</span>
                      </span>
                    )}
                  </h3>
                  <p className="text-[10px] text-slate-500 font-bold truncate">{selectedCandidate.headline}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCandidate(null)}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full cursor-pointer shrink-0"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable Profile Body info */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 space-y-6 sm:space-y-8 text-xs font-semibold text-slate-700">
              
              {/* Alert Note about masked PII information (Security Blueprint) */}
              <div className="bg-blue-50/50 border border-blue-150 rounded-2xl p-3.5 sm:p-4 flex items-start space-x-2.5 text-blue-800">
                <AlertCircle className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                <p className="text-[10px] leading-relaxed font-bold">
                  {isIndonesian 
                    ? "Isolasi Keamanan Data Pribadi: Email & nomor telepon dilindungi untuk menjaga integritas rekrutmen. Kandidat menentukan kapan berbagi rincian kontak saat tahap tawaran."
                    : "PII Data Security Isolation: Contact emails & phone numbers remain masked to guarantee recruiter sourcing integrity. Candidates choose when to share raw contact details during the pitch stage."}
                </p>
              </div>

              {/* Key Sourcing metrics bento */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
                <div className="bg-slate-50 p-3 sm:p-3.5 rounded-2xl border border-slate-100 text-center">
                  <span className="text-[9px] uppercase text-slate-400 font-extrabold block">
                    {isIndonesian ? "Ekspektasi Gaji" : "Salary Expectation"}
                  </span>
                  <span className="text-xs font-extrabold text-slate-800 mt-1 block truncate">{selectedCandidate.expectedSalary}</span>
                </div>
                <div className="bg-slate-50 p-3 sm:p-3.5 rounded-2xl border border-slate-100 text-center">
                  <span className="text-[9px] uppercase text-slate-400 font-extrabold block">
                    {isIndonesian ? "Lokasi" : "Location Context"}
                  </span>
                  <span className="text-xs font-extrabold text-slate-800 mt-1 block truncate">{selectedCandidate.location}</span>
                </div>
                <div className="bg-slate-50 p-3 sm:p-3.5 rounded-2xl border border-slate-100 text-center">
                  <span className="text-[9px] uppercase text-slate-400 font-extrabold block">
                    {isIndonesian ? "Skor ATS" : "ATS Score Match"}
                  </span>
                  <span className="text-xs font-extrabold text-emerald-600 mt-1 block">{selectedCandidate.atsScore}% {isIndonesian ? "Kecocokan" : "Completion"}</span>
                </div>
                <div className="bg-slate-50 p-3 sm:p-3.5 rounded-2xl border border-slate-100 text-center">
                  <span className="text-[9px] uppercase text-slate-400 font-extrabold block">
                    {isIndonesian ? "Ketersediaan" : "Availability"}
                  </span>
                  <span className="text-xs font-extrabold text-blue-600 mt-1 block truncate">{selectedCandidate.availability}</span>
                </div>
              </div>

              {/* Secure masked Contact indicators */}
              <div className="space-y-2 border-t border-slate-100 pt-5">
                <h4 className="font-extrabold text-slate-900 text-[10px] uppercase tracking-wide">
                  {isIndonesian ? "Rincian Kontak Aman Kandidat" : "Candidate Secure Contact Details"}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                  <div className="p-3 border border-slate-100 rounded-xl bg-slate-50/50 flex items-center space-x-2 font-mono text-[10px] min-w-0">
                    <span className="font-extrabold text-slate-400 shrink-0">EMAIL:</span>
                    <span className="text-slate-600 truncate">{selectedCandidate.email}</span>
                  </div>
                  <div className="p-3 border border-slate-100 rounded-xl bg-slate-50/50 flex items-center space-x-2 font-mono text-[10px] min-w-0">
                    <span className="font-extrabold text-slate-400 shrink-0">{isIndonesian ? "TELEPON:" : "PHONE:"}</span>
                    <span className="text-slate-600 truncate">{selectedCandidate.phone}</span>
                  </div>
                </div>
              </div>

              {/* Professional background bio */}
              <div className="space-y-2">
                <h4 className="font-extrabold text-slate-900 text-[10px] uppercase tracking-wide">
                  {isIndonesian ? "Latar Belakang Profesional" : "Professional background"}
                </h4>
                <p className="text-xs text-slate-600 font-medium leading-relaxed bg-slate-50/40 p-4 rounded-2xl border border-slate-100">
                  {selectedCandidate.aboutMe}
                </p>
              </div>

              {/* Skills taxonomy detail grids */}
              <div className="space-y-3">
                <h4 className="font-extrabold text-slate-900 text-[10px] uppercase tracking-wide">
                  {isIndonesian ? "Matriks Kompetensi Keahlian" : "Skills Competencies Matrix"}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                  {selectedCandidate.skills.map(sk => (
                    <div key={sk.id} className="p-3 bg-white border border-slate-150 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-800 text-xs block">{sk.name}</span>
                        <span className="text-[10px] text-slate-400 block font-semibold">{sk.category}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md font-bold uppercase">
                          {sk.level}
                        </span>
                        <span className="text-[9px] text-slate-400 block pt-0.5 font-bold">
                          {sk.yearsOfExperience} {isIndonesian ? "thn exp" : "yrs exp"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Work History Timeline */}
              <div className="space-y-3">
                <h4 className="font-extrabold text-slate-900 text-[10px] uppercase tracking-wide">
                  {isIndonesian ? "Riwayat Pengalaman Kerja" : "Work History"}
                </h4>
                <div className="space-y-4 pl-4 border-l border-slate-200">
                  {selectedCandidate.experience.map(exp => (
                    <div key={exp.id} className="relative space-y-1.5">
                      <span className="h-2 w-2 rounded-full bg-blue-600 border border-white absolute -left-[20.5px] top-1" />
                      <div className="flex justify-between items-start">
                        <h5 className="font-bold text-slate-900 text-xs">{exp.position}</h5>
                        <span className="text-[9px] font-bold text-slate-400">{exp.startDate} – {exp.endDate}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-bold">{exp.company} • {exp.employmentType}</p>
                      <ul className="list-disc list-inside space-y-1 pl-1">
                        {exp.responsibilities.slice(0, 2).map((resp, i) => (
                          <li key={i} className="text-[11px] text-slate-500 font-medium leading-relaxed">
                            {resp}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verified certifications */}
              {selectedCandidate.certificates && selectedCandidate.certificates.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-extrabold text-slate-900 text-[10px] uppercase tracking-wide">
                    {isIndonesian ? "Sertifikasi Terverifikasi" : "Verified Certifications"}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {selectedCandidate.certificates.map(cert => (
                      <div key={cert.id} className="p-3.5 border border-slate-150 rounded-2xl bg-slate-50/40 flex items-start space-x-3">
                        <Award className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                        <div className="min-w-0">
                          <h5 className="font-bold text-slate-800 text-xs flex items-center gap-1">
                            <span className="truncate">{cert.name}</span>
                            {cert.verified && <Check className="h-3 w-3 text-emerald-600 shrink-0" />}
                          </h5>
                          <p className="text-[10px] text-slate-400 font-semibold">{cert.issuer} • {isIndonesian ? "Diterbitkan" : "Issued"}: {cert.issueDate}</p>
                          <p className="text-[9px] text-slate-400 font-mono mt-1 truncate">ID: {cert.credentialId}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Portfolio Projects showcase */}
              {selectedCandidate.portfolio && selectedCandidate.portfolio.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-extrabold text-slate-900 text-[10px] uppercase tracking-wide">
                    {isIndonesian ? "Studi Kasus & Proyek Portofolio" : "Active Case Studies & Projects"}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {selectedCandidate.portfolio.map(proj => (
                      <div key={proj.id} className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between">
                        <img 
                          src={proj.thumbnail} 
                          alt={proj.title} 
                          className="w-full h-32 object-cover" 
                        />
                        <div className="p-3.5 space-y-2">
                          <h5 className="font-bold text-slate-800 text-xs">{proj.title}</h5>
                          <p className="text-[11px] text-slate-500 font-medium leading-relaxed line-clamp-2">
                            {proj.description}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {proj.technology.map(t => (
                              <span key={t} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[9px] font-bold rounded">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="p-3 border-t border-slate-100 bg-slate-50/50 flex space-x-2">
                          {proj.githubUrl && (
                            <a 
                              href={proj.githubUrl} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="inline-flex items-center gap-1 text-[10px] font-extrabold text-slate-600 hover:text-blue-600"
                            >
                              <Github className="h-3.5 w-3.5" /> {isIndonesian ? "Repo Kode" : "Code Repo"}
                            </a>
                          )}
                          {proj.websiteUrl && (
                            <a 
                              href={proj.websiteUrl} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="inline-flex items-center gap-1 text-[10px] font-extrabold text-slate-600 hover:text-blue-600 ml-auto"
                            >
                              <ExternalLink className="h-3.5 w-3.5" /> {isIndonesian ? "Demo Langsung" : "Live Demo"}
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Bottom Sourcing engagement control */}
            <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50 flex flex-col-reverse sm:flex-row gap-2.5 sm:gap-3">
              <button
                onClick={() => setSelectedCandidate(null)}
                className="w-full sm:flex-1 py-2.5 sm:py-3 border border-slate-200 hover:bg-slate-100 rounded-2xl text-xs font-bold text-slate-600 bg-white transition-all cursor-pointer text-center"
              >
                {isIndonesian ? "Tutup Profil" : "Close Profile"}
              </button>
              <button
                onClick={() => {
                  setInvitingCandidate(selectedCandidate);
                  setSelectedCandidate(null);
                }}
                className="w-full sm:flex-1 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold shadow-md shadow-blue-200 transition-all cursor-pointer text-center"
              >
                {isIndonesian ? "Jadwalkan Pitch Wawancara" : "Schedule Interview Pitch"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- MODAL: DETAILED DIRECT INTERVIEW PROPOSAL ----------------- */}
      {invitingCandidate && (
        <div className="fixed inset-0 bg-slate-950/45 backdrop-blur-xs flex items-center justify-center z-50 p-3 sm:p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full max-h-[88vh] flex flex-col overflow-hidden relative animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setInvitingCandidate(null)}
              className="absolute top-4 right-4 bg-slate-100 hover:bg-slate-200 text-slate-500 p-2 rounded-full cursor-pointer z-20 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Modal Fixed Header */}
            <div className="flex items-center space-x-3 sm:space-x-3.5 border-b border-slate-100 p-4 sm:p-6 pb-4 pr-12 min-w-0 bg-white shrink-0">
              <img
                src={getProfileAvatar(invitingCandidate.avatar)}
                alt={invitingCandidate.fullName}
                className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl object-cover border border-slate-100 shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = DEFAULT_PROFILE_IMAGE;
                }}
              />
              <div className="min-w-0">
                <h3 className="font-extrabold text-slate-900 text-sm truncate">
                  {isIndonesian ? "Kirim Proposal Tawaran Wawancara" : "Send Sourcing Pitch Proposal"}
                </h3>
                <p className="text-xs text-slate-500 font-semibold truncate">
                  {isIndonesian ? "Kandidat yang dituju: " : "Sourcing candidate: "}<span className="font-bold text-blue-600">{invitingCandidate.fullName}</span>
                </p>
              </div>
            </div>

            {/* Form scrollable body */}
            <form onSubmit={handleSendInviteSubmit} className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 space-y-4 text-xs font-semibold text-slate-700">
                {/* 1. Job Position Title */}
                <div className="space-y-1">
                  <label className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wide">
                    {isIndonesian ? "Judul Posisi Lowongan" : "Target Position Title"}
                  </label>
                  <input
                    type="text"
                    required
                    value={invitePosition}
                    onChange={(e) => setInvitePosition(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl p-3 text-slate-800 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* 2. Compensation & Google Meet Link */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wide">
                      {isIndonesian ? "Tawaran Kompensasi/Gaji" : "Compensation Package Offer"}
                    </label>
                    <input
                      type="text"
                      required
                      value={inviteSalaryOffer}
                      onChange={(e) => setInviteSalaryOffer(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl p-3 text-slate-800"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wide flex items-center gap-1">
                      <Video className="h-3 w-3 text-blue-600" />
                      <span>{isIndonesian ? "Ruang Video Google Meet (Manual HR) *" : "Google Meet Video Link (Manual HR) *"}</span>
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://meet.google.com/abc-defg-hij"
                      value={inviteMeetLink}
                      onChange={(e) => setInviteMeetLink(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl p-3 text-slate-800 font-mono text-[10px] focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* 3. Proposed Calendar date */}
                <div className="space-y-1">
                  <label className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wide">
                    {isIndonesian ? "Rencana Tanggal & Waktu Wawancara" : "Proposed interview date"}
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={inviteDate}
                    onChange={(e) => setInviteDate(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl p-3 text-slate-800"
                  />
                </div>

                {/* 4. Sourcing Pitch Message Letter */}
                <div className="space-y-1">
                  <label className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wide">
                    {isIndonesian ? "Pesan Penawaran / Ajakan" : "Sourcing Pitch Cover Message"}
                  </label>
                  <textarea
                    required
                    value={inviteMessage}
                    onChange={(e) => setInviteMessage(e.target.value)}
                    rows={3}
                    className="w-full border border-slate-200 rounded-xl p-3 text-slate-800 leading-relaxed font-medium resize-none"
                  />
                </div>
              </div>

              {/* Fixed Modal Footer */}
              <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setInvitingCandidate(null)}
                  className="flex-1 py-2.5 sm:py-3 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl font-bold transition-colors cursor-pointer text-center"
                >
                  {isIndonesian ? "Batal" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 sm:py-3 rounded-xl font-bold shadow-md shadow-blue-200 cursor-pointer text-center"
                >
                  {isIndonesian ? "Kirim Tawaran Wawancara" : "Dispatch Sourcing Pitch"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
