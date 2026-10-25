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
  Check,
  User,
  UserCheck,
  Send,
  Inbox,
  AlertCircle,
  ArrowRight,
  GraduationCap,
  Clock,
  Globe2,
  TrendingUp,
  ChevronRight,
  Info,
  Lock,
  ShieldAlert,
  Video,
  Building2,
  Crown
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Candidate, Recruiter, Invitation, SkillCategory, SkillLevel, DEFAULT_PROFILE_IMAGE, getProfileAvatar } from "../types";
import { useLanguage } from "../context/LanguageContext";

interface BrowseTalentViewProps {
  candidates: Candidate[];
  isLoggedIn: boolean;
  currentUser: any;
  onSendInvitation: (invitation: Omit<Invitation, "id" | "createdAt" | "status">) => void;
  onTabChange: (tab: string) => void;
}

// Helper to safely extract location parts (e.g. "Jakarta, DKI Jakarta" -> City: "Jakarta", Province: "DKI Jakarta")
const parseLocation = (locStr: string) => {
  const parts = locStr.split(",").map(p => p.trim());
  return {
    city: parts[0] || locStr,
    province: parts[1] || "Indonesia"
  };
};

export default function BrowseTalentView({
  candidates,
  isLoggedIn,
  currentUser,
  onSendInvitation,
  onTabChange
}: BrowseTalentViewProps) {
  const { t, formatCurrency, formatCompactCurrency, isIndonesian } = useLanguage();
  
  // --- ENRICH CANDIDATES WITH METADATA ---
  const enrichedCandidates = useMemo(() => {
    return candidates.map(cand => {
      const loc = parseLocation(cand.location);
      
      const maxExpYears = cand.skills.reduce((max, s) => Math.max(max, s.yearsOfExperience || 0), 0) || 
                          (cand.experience ? cand.experience.length * 3 : 1);
      
      const languages = cand.id === "cand_1" ? ["Bahasa Indonesia", "English"] :
                        cand.id === "cand_2" ? ["Bahasa Indonesia", "English"] :
                        cand.id === "cand_3" ? ["Bahasa Indonesia", "English", "Javanese"] : ["Bahasa Indonesia", "English"];

      let eduLevel = "S1 / Sarjana (Bachelor's)";
      if (cand.education && cand.education.length > 0) {
        const degree = cand.education[0].degree.toLowerCase();
        if (degree.includes("master") || degree.includes("s2") || degree.includes("msc")) {
          eduLevel = "S2 / Magister (Master's)";
        } else if (degree.includes("phd") || degree.includes("s3") || degree.includes("doktor")) {
          eduLevel = "S3 / Doktor (PhD)";
        } else if (degree.includes("bootcamp") || degree.includes("diploma") || degree.includes("d3")) {
          eduLevel = "D3 / Bootcamp / Vokasi";
        }
      }

      const talentScore = cand.atsScore || 85;

      return {
        ...cand,
        city: loc.city,
        province: loc.province,
        experienceYears: maxExpYears,
        languages,
        educationLevel: eduLevel,
        talentScore
      };
    });
  }, [candidates]);

  // --- FILTER STATES ---
  const [searchSkill, setSearchSkill] = useState("");
  const [searchRole, setSearchRole] = useState("");
  const [searchTech, setSearchTech] = useState("");
  const [searchCompany, setSearchCompany] = useState("");
  const [searchEducation, setSearchEducation] = useState("");
  const [searchCert, setSearchCert] = useState("");

  const [filterLocation, setFilterLocation] = useState("");
  const [filterProvince, setFilterProvince] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [filterMinExp, setFilterMinExp] = useState<number>(0);
  const [filterEducationLevels, setFilterEducationLevels] = useState<string[]>([]);
  const [filterEmploymentTypes, setFilterEmploymentTypes] = useState<string[]>([]);
  const [minTalentScore, setMinTalentScore] = useState<number>(50);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [openToWorkOnly, setOpenToWorkOnly] = useState<boolean>(false);
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [selectedAvailabilities, setSelectedAvailabilities] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

  // Sorting
  const [sortBy, setSortBy] = useState<string>("recommended");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Latency simulation
  const [isLoading, setIsLoading] = useState(false);

  // Modals & Details Drawers
  const [previewCandidate, setPreviewCandidate] = useState<any | null>(null);
  const [invitingCandidate, setInvitingCandidate] = useState<any | null>(null);
  
  // Access Restriction Modal State for non-HR or unauthenticated users
  const [authRestrictionModal, setAuthRestrictionModal] = useState<{
    isOpen: boolean;
    reason: "unauthenticated" | "candidate_role";
    candidateName?: string;
  }>({ isOpen: false, reason: "unauthenticated" });

  // Invite Interview Proposal Form Fields in IDR (Google Meet link manually entered by HR)
  const [invitePosition, setInvitePosition] = useState(isIndonesian ? "Senior Software Engineer" : "Senior Software Engineer");
  const [inviteSalaryOffer, setInviteSalaryOffer] = useState(isIndonesian ? "Rp 25.000.000 / bulan" : "Rp 25,000,000 / month");
  const [inviteMeetLink, setInviteMeetLink] = useState("");
  const [inviteDate, setInviteDate] = useState("2026-08-30T10:00");
  const [inviteMessage, setInviteMessage] = useState(
    isIndonesian 
      ? "Halo! Kami sangat terkesan dengan portofolio terverifikasi dan keahlian teknis Anda di TalentHub. Kami ingin mengundang Anda ke sesi wawancara langsung untuk membahas posisi strategis di tim kami."
      : "Hello! We are thoroughly impressed with your verified portfolio and technical achievements on TalentHub. We'd love to invite you to a direct discovery interview to discuss a key position on our team."
  );
  const [meetLinkError, setMeetLinkError] = useState<string | null>(null);

  // Bookmarks
  const [savedCandidateIds, setSavedCandidateIds] = useState<string[]>([]);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 350);
    return () => clearTimeout(timer);
  }, [
    searchSkill, searchRole, searchTech, searchCompany, searchEducation, searchCert,
    filterLocation, filterProvince, filterCity, filterMinExp, filterEducationLevels,
    filterEmploymentTypes, minTalentScore, selectedSkills,
    openToWorkOnly, verifiedOnly, selectedAvailabilities, selectedLanguages, sortBy
  ]);

  const triggerToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const handleToggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedCandidateIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
    triggerToast(
      savedCandidateIds.includes(id) 
        ? (isIndonesian ? "Dihapus dari daftar pantauan" : "Removed from watchlist")
        : (isIndonesian ? "Kandidat ditambahkan ke bookmark" : "Candidate added to bookmarks")
    );
  };

  const allProvinces = useMemo(() => {
    const set = new Set<string>();
    enrichedCandidates.forEach(c => { if (c.province) set.add(c.province); });
    return Array.from(set);
  }, [enrichedCandidates]);

  const allCities = useMemo(() => {
    const set = new Set<string>();
    enrichedCandidates.forEach(c => { if (c.city) set.add(c.city); });
    return Array.from(set);
  }, [enrichedCandidates]);

  const allSkillsList = useMemo(() => {
    const set = new Set<string>();
    enrichedCandidates.forEach(c => c.skills.forEach(s => set.add(s.name)));
    return Array.from(set).slice(0, 15);
  }, [enrichedCandidates]);

  const allLanguagesList = useMemo(() => {
    const set = new Set<string>();
    enrichedCandidates.forEach(c => c.languages?.forEach(l => set.add(l)));
    return Array.from(set);
  }, [enrichedCandidates]);

  // --- FILTERING ENGINE ---
  const filteredCandidates = useMemo(() => {
    let result = [...enrichedCandidates];

    if (searchSkill.trim()) {
      const q = searchSkill.toLowerCase().trim();
      result = result.filter(c => c.skills.some(s => s.name.toLowerCase().includes(q)));
    }
    if (searchRole.trim()) {
      const q = searchRole.toLowerCase().trim();
      result = result.filter(c => c.headline.toLowerCase().includes(q) || c.experience.some(exp => exp.position.toLowerCase().includes(q)));
    }
    if (searchTech.trim()) {
      const q = searchTech.toLowerCase().trim();
      result = result.filter(c => 
        c.skills.some(s => s.name.toLowerCase().includes(q)) || 
        c.portfolio.some(p => p.technology.some(t => t.toLowerCase().includes(q))) ||
        c.experience.some(e => e.technologiesUsed?.some(t => t.toLowerCase().includes(q)))
      );
    }
    if (searchCompany.trim()) {
      const q = searchCompany.toLowerCase().trim();
      result = result.filter(c => c.experience.some(e => e.company.toLowerCase().includes(q)));
    }
    if (searchEducation.trim()) {
      const q = searchEducation.toLowerCase().trim();
      result = result.filter(c => c.education.some(edu => edu.school.toLowerCase().includes(q) || edu.major.toLowerCase().includes(q)));
    }
    if (searchCert.trim()) {
      const q = searchCert.toLowerCase().trim();
      result = result.filter(c => c.certificates.some(cert => cert.name.toLowerCase().includes(q) || cert.issuer.toLowerCase().includes(q)));
    }

    if (filterLocation.trim()) {
      const q = filterLocation.toLowerCase().trim();
      result = result.filter(c => c.location.toLowerCase().includes(q) || c.preferredLocation.toLowerCase().includes(q));
    }
    if (filterProvince) {
      result = result.filter(c => c.province === filterProvince);
    }
    if (filterCity) {
      result = result.filter(c => c.city === filterCity);
    }
    if (filterMinExp > 0) {
      result = result.filter(c => c.experienceYears >= filterMinExp);
    }
    if (filterEducationLevels.length > 0) {
      result = result.filter(c => filterEducationLevels.includes(c.educationLevel));
    }
    if (filterEmploymentTypes.length > 0) {
      result = result.filter(c => c.employmentType.some(type => filterEmploymentTypes.includes(type)));
    }
    if (minTalentScore > 50) {
      result = result.filter(c => c.talentScore >= minTalentScore);
    }
    if (selectedSkills.length > 0) {
      result = result.filter(c => selectedSkills.every(reqSkill => c.skills.some(s => s.name.toLowerCase() === reqSkill.toLowerCase())));
    }
    if (openToWorkOnly) {
      result = result.filter(c => c.openToWork);
    }
    if (verifiedOnly) {
      result = result.filter(c => c.verified);
    }
    if (selectedAvailabilities.length > 0) {
      result = result.filter(c => selectedAvailabilities.includes(c.availability));
    }
    if (selectedLanguages.length > 0) {
      result = result.filter(c => c.languages?.some(l => selectedLanguages.includes(l)));
    }

    result.sort((a, b) => {
      if (sortBy === "recommended") {
        const scoreA = (a.verified ? 20 : 0) + a.talentScore;
        const scoreB = (b.verified ? 20 : 0) + b.talentScore;
        return scoreB - scoreA;
      }
      if (sortBy === "talent_score_desc") {
        return b.talentScore - a.talentScore;
      }
      if (sortBy === "recently_active") {
        return b.id.localeCompare(a.id);
      }
      if (sortBy === "experienced_desc") {
        return b.experienceYears - a.experienceYears;
      }
      if (sortBy === "newest") {
        return b.id.localeCompare(a.id);
      }
      return 0;
    });

    return result;
  }, [enrichedCandidates, searchSkill, searchRole, searchTech, searchCompany, searchEducation, searchCert, filterLocation, filterProvince, filterCity, filterMinExp, filterEducationLevels, filterEmploymentTypes, minTalentScore, selectedSkills, openToWorkOnly, verifiedOnly, selectedAvailabilities, selectedLanguages, sortBy]);

  const handleResetFilters = () => {
    setSearchSkill("");
    setSearchRole("");
    setSearchTech("");
    setSearchCompany("");
    setSearchEducation("");
    setSearchCert("");
    setFilterLocation("");
    setFilterProvince("");
    setFilterCity("");
    setFilterMinExp(0);
    setFilterEducationLevels([]);
    setFilterEmploymentTypes([]);
    setMinTalentScore(50);
    setSelectedSkills([]);
    setOpenToWorkOnly(false);
    setVerifiedOnly(false);
    setSelectedAvailabilities([]);
    setSelectedLanguages([]);
    setSortBy("recommended");
    setCurrentPage(1);
    triggerToast(isIndonesian ? "Semua filter pencarian berhasil direset" : "All filters cleared");
  };

  const handleToggleEdu = (edu: string) => {
    setFilterEducationLevels(prev => prev.includes(edu) ? prev.filter(x => x !== edu) : [...prev, edu]);
    setCurrentPage(1);
  };
  const handleToggleEmpType = (type: string) => {
    setFilterEmploymentTypes(prev => prev.includes(type) ? prev.filter(x => x !== type) : [...prev, type]);
    setCurrentPage(1);
  };
  const handleToggleAvail = (avail: string) => {
    setSelectedAvailabilities(prev => prev.includes(avail) ? prev.filter(x => x !== avail) : [...prev, avail]);
    setCurrentPage(1);
  };
  const handleToggleLang = (lang: string) => {
    setSelectedLanguages(prev => prev.includes(lang) ? prev.filter(x => x !== lang) : [...prev, lang]);
    setCurrentPage(1);
  };
  const handleToggleSkillTag = (skill: string) => {
    setSelectedSkills(prev => prev.includes(skill) ? prev.filter(x => x !== skill) : [...prev, skill]);
    setCurrentPage(1);
  };

  const aiRecommendedCandidates = useMemo(() => {
    return enrichedCandidates.map(cand => {
      let scoreBoost = 70;
      if (searchSkill && cand.skills.some(s => s.name.toLowerCase().includes(searchSkill.toLowerCase()))) {
        scoreBoost += 15;
      }
      if (searchRole && cand.headline.toLowerCase().includes(searchRole.toLowerCase())) {
        scoreBoost += 10;
      }
      if (cand.verified) scoreBoost += 5;
      if (cand.openToWork) scoreBoost += 4;
      
      const finalPercentage = Math.min(scoreBoost, 99);
      
      return {
        candidate: cand,
        percentage: finalPercentage,
        reason: cand.verified 
          ? (isIndonesian ? "Portofolio & sertifikasi terverifikasi siap rekrut." : "Verified portfolio & certifications ready for immediate hire.")
          : (isIndonesian ? "Keahlian relevan dengan kebutuhan teknologi modern." : "Matches high-demand modern tech stack criteria.")
      };
    })
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 3);
  }, [enrichedCandidates, searchSkill, searchRole, isIndonesian]);

  const totalCount = filteredCandidates.length;
  const totalPages = Math.ceil(totalCount / itemsPerPage) || 1;
  const paginatedCandidates = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCandidates.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCandidates, currentPage]);

  const handleInitiateInvite = (cand: any) => {
    if (!isLoggedIn || !currentUser) {
      setAuthRestrictionModal({
        isOpen: true,
        reason: "unauthenticated",
        candidateName: cand?.fullName || ""
      });
      return;
    }

    if (currentUser.role !== "recruiter") {
      setAuthRestrictionModal({
        isOpen: true,
        reason: "candidate_role",
        candidateName: cand?.fullName || ""
      });
      return;
    }

    // Permitted HR / Recruiter user
    setMeetLinkError(null);
    setInviteMeetLink(""); // Google Meet link must be generated manually by HR
    setInvitingCandidate(cand);
  };

  const handleSendInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invitingCandidate) return;

    if (!isLoggedIn || !currentUser) {
      setInvitingCandidate(null);
      setAuthRestrictionModal({
        isOpen: true,
        reason: "unauthenticated",
        candidateName: invitingCandidate.fullName
      });
      return;
    }

    if (currentUser.role !== "recruiter") {
      setInvitingCandidate(null);
      setAuthRestrictionModal({
        isOpen: true,
        reason: "candidate_role",
        candidateName: invitingCandidate.fullName
      });
      return;
    }

    if (!inviteMeetLink.trim()) {
      setMeetLinkError(t("google_meet_required_error"));
      return;
    }

    onSendInvitation({
      recruiterId: currentUser.id || "rec_1",
      recruiterName: currentUser.fullName || (isIndonesian ? "Manajer Rekrutmen HR" : "HR Recruitment Lead"),
      companyName: currentUser.companyName || "Nusantara Enterprise",
      companyLogo: currentUser.companyLogo || "https://images.unsplash.com/photo-1618401471353-b98aedd07871?auto=format&fit=crop&q=80&w=150",
      candidateId: invitingCandidate.id,
      position: invitePosition,
      message: inviteMessage,
      salaryOffer: inviteSalaryOffer,
      interviewLink: inviteMeetLink.trim(),
      scheduledDate: inviteDate
    });

    setInvitingCandidate(null);
    setInviteMeetLink("");
    setMeetLinkError(null);
    triggerToast(
      isIndonesian 
        ? `Undangan wawancara berhasil dikirimkan ke ${invitingCandidate.fullName}!` 
        : `Interview pitch sent successfully to ${invitingCandidate.fullName}!`
    );
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans antialiased text-slate-800 pb-24" id="browse-talent-root">
      
      {/* HERO SECTION */}
      <header className="relative bg-slate-950 text-white overflow-hidden py-14 px-6 lg:px-8 border-b border-slate-900 shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-950 to-slate-950" />
        
        <div className="max-w-7xl mx-auto relative z-10 space-y-6 text-center sm:text-left">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="h-3 w-3" />
              <span>{t("browse_hero_badge")}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-none">
              {t("browse_hero_title")}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed max-w-2xl">
              {t("browse_hero_desc")}
            </p>
          </div>

          {/* ADVANCED SOURCING SEARCH PARAMETERS */}
          <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
              <Search className="h-4 w-4 text-blue-500" />
              <span className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
                {isIndonesian ? "Parameter Pencarian Lanjutan" : "Advanced Sourcing Parameters"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 font-bold uppercase block">{t("filter_skill")}</label>
                <input 
                  type="text" 
                  value={searchSkill} 
                  onChange={(e) => { setSearchSkill(e.target.value); setCurrentPage(1); }}
                  placeholder="e.g. React, Python" 
                  className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 text-white rounded-xl px-3 py-2 text-xs transition-all placeholder:text-slate-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 font-bold uppercase block">{t("filter_role")}</label>
                <input 
                  type="text" 
                  value={searchRole} 
                  onChange={(e) => { setSearchRole(e.target.value); setCurrentPage(1); }}
                  placeholder="e.g. Full Stack Engineer" 
                  className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 text-white rounded-xl px-3 py-2 text-xs transition-all placeholder:text-slate-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 font-bold uppercase block">{t("filter_tech")}</label>
                <input 
                  type="text" 
                  value={searchTech} 
                  onChange={(e) => { setSearchTech(e.target.value); setCurrentPage(1); }}
                  placeholder="e.g. Docker, PostgreSQL" 
                  className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 text-white rounded-xl px-3 py-2 text-xs transition-all placeholder:text-slate-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 font-bold uppercase block">{t("filter_company")}</label>
                <input 
                  type="text" 
                  value={searchCompany} 
                  onChange={(e) => { setSearchCompany(e.target.value); setCurrentPage(1); }}
                  placeholder="e.g. Tokopedia, Gojek" 
                  className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 text-white rounded-xl px-3 py-2 text-xs transition-all placeholder:text-slate-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 font-bold uppercase block">{t("filter_education")}</label>
                <input 
                  type="text" 
                  value={searchEducation} 
                  onChange={(e) => { setSearchEducation(e.target.value); setCurrentPage(1); }}
                  placeholder="e.g. Universitas Indonesia" 
                  className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 text-white rounded-xl px-3 py-2 text-xs transition-all placeholder:text-slate-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 font-bold uppercase block">{t("filter_cert")}</label>
                <input 
                  type="text" 
                  value={searchCert} 
                  onChange={(e) => { setSearchCert(e.target.value); setCurrentPage(1); }}
                  placeholder="e.g. Kominfo DTS, AWS" 
                  className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 text-white rounded-xl px-3 py-2 text-xs transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            {(searchSkill || searchRole || searchTech || searchCompany || searchEducation || searchCert) && (
              <div className="flex justify-end pt-1">
                <button 
                  onClick={handleResetFilters}
                  className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors flex items-center space-x-1 cursor-pointer"
                >
                  <RefreshCw className="h-3 w-3" />
                  <span>{isIndonesian ? "Reset Input Pencarian" : "Reset Search Fields"}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* SUCCESS TOAST */}
      <AnimatePresence>
        {successToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl border border-slate-800 text-xs font-bold flex items-center space-x-3"
          >
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{successToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* THREE-COLUMN CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* 1. LEFT SIDEBAR FILTERS (SPAN 3) */}
          <aside className="lg:col-span-3 space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-5">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-blue-600" />
                  <span className="text-xs font-black uppercase text-slate-900 tracking-wide">
                    {isIndonesian ? "Filter Talenta" : "Sourcing Filters"}
                  </span>
                </div>
                <button 
                  onClick={handleResetFilters}
                  className="text-[10px] font-black text-blue-600 hover:text-blue-800 tracking-wider uppercase cursor-pointer"
                >
                  {isIndonesian ? "Reset Semua" : "Reset All"}
                </button>
              </div>

              {/* Verified & Open To Work Toggles */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label htmlFor="verified-cand-only" className="text-xs text-slate-700 font-bold cursor-pointer">
                    {t("filter_verified_only")}
                  </label>
                  <input 
                    type="checkbox" 
                    id="verified-cand-only"
                    checked={verifiedOnly}
                    onChange={(e) => { setVerifiedOnly(e.target.checked); setCurrentPage(1); }}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label htmlFor="opentowork-only" className="text-xs text-slate-700 font-bold cursor-pointer">
                    {t("filter_open_to_work")}
                  </label>
                  <input 
                    type="checkbox" 
                    id="opentowork-only"
                    checked={openToWorkOnly}
                    onChange={(e) => { setOpenToWorkOnly(e.target.checked); setCurrentPage(1); }}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Geography */}
              <div className="space-y-3 border-t border-slate-100 pt-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                  {t("filter_location")}
                </span>
                
                <div className="relative">
                  <MapPin className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input 
                    type="text" 
                    value={filterLocation}
                    onChange={(e) => { setFilterLocation(e.target.value); setCurrentPage(1); }}
                    placeholder={isIndonesian ? "Cari kota / provinsi..." : "City or region..."}
                    className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 text-xs rounded-lg text-slate-800 placeholder:text-slate-400 font-medium"
                  />
                </div>

                {allProvinces.length > 0 && (
                  <select
                    value={filterProvince}
                    onChange={(e) => { setFilterProvince(e.target.value); setCurrentPage(1); }}
                    className="w-full bg-slate-50 border border-slate-200 text-xs rounded-lg px-2.5 py-2 text-slate-700 font-semibold"
                  >
                    <option value="">{isIndonesian ? "Semua Wilayah" : "All Provinces"}</option>
                    {allProvinces.map(prov => (
                      <option key={prov} value={prov}>{prov}</option>
                    ))}
                  </select>
                )}
              </div>

              {/* Experience minimum */}
              <div className="space-y-2 border-t border-slate-100 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    {t("filter_experience")}
                  </span>
                  <span className="text-xs font-extrabold text-blue-600">
                    {filterMinExp > 0 ? `${filterMinExp}+ ${isIndonesian ? "Tahun" : "Years"}` : (isIndonesian ? "Semua" : "Any")}
                  </span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={filterMinExp}
                  onChange={(e) => { setFilterMinExp(Number(e.target.value)); setCurrentPage(1); }}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              {/* Talent Score Threshold */}
              <div className="space-y-2 border-t border-slate-100 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    {isIndonesian ? "Skor ATS Minimum" : "Min Talent Score"}
                  </span>
                  <span className="text-xs font-extrabold text-blue-600">{minTalentScore} / 100</span>
                </div>
                <input 
                  type="range"
                  min="50"
                  max="99"
                  step="5"
                  value={minTalentScore}
                  onChange={(e) => { setMinTalentScore(Number(e.target.value)); setCurrentPage(1); }}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              {/* Employment Types */}
              <div className="space-y-2 border-t border-slate-100 pt-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                  {t("filter_employment_type")}
                </span>
                <div className="space-y-1.5">
                  {["Full-time", "Contract", "Internship", "Freelance"].map(type => (
                    <div key={type} className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id={`emp-type-${type}`}
                        checked={filterEmploymentTypes.includes(type)}
                        onChange={() => handleToggleEmpType(type)}
                        className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <label htmlFor={`emp-type-${type}`} className="text-xs text-slate-700 font-semibold cursor-pointer">
                        {type === "Full-time" ? (isIndonesian ? "Penuh Waktu (Full-time)" : "Full-time") :
                         type === "Contract" ? (isIndonesian ? "Kontrak (Contract)" : "Contract") :
                         type === "Internship" ? (isIndonesian ? "Magang (Internship)" : "Internship") : type}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills checklist tags */}
              <div className="space-y-2.5 border-t border-slate-100 pt-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                  {isIndonesian ? "Daftar Keahlian Populer" : "Hot Skills Checklist"}
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                  {allSkillsList.map(skill => {
                    const active = selectedSkills.includes(skill);
                    return (
                      <button
                        key={skill}
                        onClick={() => handleToggleSkillTag(skill)}
                        className={`text-[10px] font-bold px-2 py-1 rounded-md transition-all cursor-pointer ${
                          active 
                            ? "bg-blue-600 text-white" 
                            : "bg-slate-50 text-slate-600 border border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        {skill}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          </aside>

          {/* 2. CENTER CANDIDATE FEED (SPAN 6) */}
          <main className="lg:col-span-6 space-y-6">
            
            {/* Sorting Header Bar */}
            <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-slate-600 font-bold text-center sm:text-left">
                {isLoading ? (
                  <span className="text-blue-600 flex items-center gap-1.5 font-bold">
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" /> {isIndonesian ? "Memuat basis data terverifikasi..." : "Querying verified database..."}
                  </span>
                ) : (
                  <span>
                    {isIndonesian ? "Hasil Ditemukan:" : "Discovered matches:"} <span className="text-slate-900 font-black">{totalCount} {isIndonesian ? "kandidat terverifikasi" : "verified talents"}</span>
                  </span>
                )}
              </span>

              <div className="flex items-center space-x-2 text-xs">
                <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">
                  {isIndonesian ? "Urutkan:" : "Sort by:"}
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-bold"
                >
                  <option value="recommended">{isIndonesian ? "Rekomendasi Terbaik" : "Recommended & Vetted"}</option>
                  <option value="talent_score_desc">{isIndonesian ? "Skor ATS Tertinggi" : "Highest Talent Score"}</option>
                  <option value="recently_active">{isIndonesian ? "Baru Aktif" : "Recently Active"}</option>
                  <option value="experienced_desc">{isIndonesian ? "Paling Berpengalaman" : "Most Experienced"}</option>
                </select>
              </div>
            </div>

            {/* CANDIDATE FEED */}
            {isLoading ? (
              <div className="space-y-6">
                {[1, 2, 3].map(idx => (
                  <div key={idx} className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 animate-pulse">
                    <div className="flex items-center space-x-4">
                      <div className="h-14 w-14 rounded-full bg-slate-200" />
                      <div className="space-y-2 flex-1">
                        <div className="h-3.5 w-1/3 bg-slate-200 rounded" />
                        <div className="h-2.5 w-1/4 bg-slate-100 rounded" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : paginatedCandidates.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-4 shadow-xs">
                <Inbox className="h-12 w-12 text-slate-300 mx-auto" />
                <div className="space-y-1.5">
                  <h4 className="font-extrabold text-slate-800 text-base">
                    {isIndonesian ? "Tidak Ada Profil yang Cocok" : "No Talent Matches Discovered"}
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
                    {isIndonesian 
                      ? "Coba atur ulang atau longgarkan filter pencarian Anda untuk melihat lebih banyak kandidat."
                      : "Try clearing some filters to explore more verified candidate profiles."}
                  </p>
                </div>
                <button
                  onClick={handleResetFilters}
                  className="bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer"
                >
                  {isIndonesian ? "Reset Filter" : "Clear Filter Rules"}
                </button>
              </div>
            ) : (
              <div className="space-y-5" id="candidate-bento-feed">
                {paginatedCandidates.map((cand) => (
                  <motion.div
                    key={cand.id}
                    layoutId={`candidate-card-${cand.id}`}
                    onClick={() => setPreviewCandidate(cand)}
                    className="bg-white rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md p-4 sm:p-6 flex flex-col justify-between cursor-pointer transition-all relative group overflow-hidden"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 sm:gap-4">
                      <div className="flex items-center space-x-3 sm:space-x-3.5 min-w-0 flex-1">
                        <img 
                          src={getProfileAvatar(cand.avatar)} 
                          alt={cand.fullName} 
                          className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl object-cover border border-slate-200 shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = DEFAULT_PROFILE_IMAGE;
                          }}
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h3 className="font-extrabold text-slate-900 text-sm truncate max-w-full">{cand.fullName}</h3>
                            {cand.verified && (
                              <span className="px-2 py-0.5 rounded-full text-[8px] uppercase tracking-wider font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-0.5 shrink-0">
                                <ShieldCheck className="h-2.5 w-2.5 text-emerald-600 shrink-0" />
                                <span>{t("verified_badge")}</span>
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
                            {cand.openToWork && (
                              <span className="px-2 py-0.5 rounded-full text-[8px] uppercase tracking-wider font-extrabold bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
                                {isIndonesian ? "Siap Kerja" : "Open To Work"}
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-1 text-slate-400 mt-1 min-w-0">
                            <MapPin className="h-3 w-3 shrink-0" />
                            <span className="text-[10px] font-bold truncate">{cand.location}</span>
                          </div>
                        </div>
                      </div>

                      {/* Talent Score Indicator */}
                      <div className="bg-slate-900 text-white rounded-xl px-2.5 sm:px-3 py-1.5 text-right border border-slate-800 shrink-0">
                        <span className="text-[7px] text-slate-400 font-extrabold block uppercase tracking-widest">
                          {isIndonesian ? "Skor ATS" : "Talent Score"}
                        </span>
                        <div className="flex items-center space-x-1 justify-end mt-0.5">
                          <TrendingUp className="h-3 w-3 text-blue-400 shrink-0" />
                          <span className="text-xs font-black text-blue-400">{cand.talentScore}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Headline */}
                    <div className="mt-3.5 space-y-1">
                      <p className="text-xs font-black text-slate-900 leading-tight break-words">
                        {cand.headline}
                      </p>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2 break-words">
                        {cand.aboutMe}
                      </p>
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1 mt-3.5">
                      {cand.skills.slice(0, 4).map(sk => (
                        <span 
                          key={sk.id}
                          className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md truncate max-w-[130px]"
                        >
                          {sk.name}
                        </span>
                      ))}
                      {cand.skills.length > 4 && (
                        <span className="text-[9px] font-bold text-slate-400 self-center shrink-0">
                          +{cand.skills.length - 4} {isIndonesian ? "lainnya" : "more"}
                        </span>
                      )}
                    </div>

                    {/* Experience & Education Brief */}
                    <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <div className="space-y-0.5 text-left min-w-0">
                        <span className="text-[8px] text-slate-400 font-extrabold uppercase tracking-wider block">
                          {isIndonesian ? "Pengalaman Terakhir" : "Key Experience"}
                        </span>
                        <div className="flex items-center space-x-1 text-slate-700 min-w-0">
                          <Briefcase className="h-3 w-3 text-slate-400 shrink-0" />
                          <span className="text-[10px] font-extrabold truncate">
                            {cand.experience && cand.experience.length > 0 
                              ? `${cand.experience[0].position} @ ${cand.experience[0].company}` 
                              : (isIndonesian ? "Belum ada riwayat" : "No history")}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-0.5 text-left min-w-0">
                        <span className="text-[8px] text-slate-400 font-extrabold uppercase tracking-wider block">
                          {isIndonesian ? "Pendidikan" : "Education"}
                        </span>
                        <div className="flex items-center space-x-1 text-slate-700 min-w-0">
                          <GraduationCap className="h-3 w-3 text-slate-400 shrink-0" />
                          <span className="text-[10px] font-extrabold truncate">
                            {cand.education && cand.education.length > 0 
                              ? `${cand.education[0].school}` 
                              : "Self-taught"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom: Expected Salary and Core CTAs */}
                    <div className="border-t border-slate-100 mt-4 pt-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="min-w-0 text-left">
                        <span className="text-[8px] text-slate-400 font-extrabold block uppercase tracking-wider">
                          {t("expected_salary")}
                        </span>
                        <span className="font-extrabold text-slate-900 text-xs truncate block">{cand.expectedSalary}</span>
                      </div>

                      <div className="flex items-center space-x-2 w-full sm:w-auto justify-end flex-wrap sm:flex-nowrap gap-y-2">
                        <button
                          onClick={(e) => handleToggleBookmark(cand.id, e)}
                          className="p-2 border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors shrink-0 cursor-pointer"
                          title="Bookmark"
                        >
                          <Bookmark className={`h-3.5 w-3.5 text-slate-400 ${savedCandidateIds.includes(cand.id) ? "fill-blue-600 text-blue-600" : ""}`} />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewCandidate(cand);
                          }}
                          className="px-3 py-2 border border-slate-200 text-[11px] font-bold rounded-xl text-slate-700 hover:bg-slate-50 transition-colors shrink-0 cursor-pointer"
                        >
                          {t("view_profile_btn")}
                        </button>

                        <button
                          id={`btn-invite-candidate-${cand.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleInitiateInvite(cand);
                          }}
                          className="flex-1 sm:flex-initial bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-3.5 py-2 rounded-xl text-[11px] hover:shadow-xs transition-all cursor-pointer text-center whitespace-nowrap"
                        >
                          {t("invite_interview_btn")}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {!isLoading && totalCount > 0 && (
              <div className="flex items-center justify-between border-t border-slate-200 pt-5">
                <span className="text-xs font-bold text-slate-500">
                  {isIndonesian ? "Halaman" : "Page"} <span className="text-slate-900 font-extrabold">{currentPage}</span> {isIndonesian ? "dari" : "of"} <span className="text-slate-900 font-extrabold">{totalPages}</span>
                </span>

                <div className="flex space-x-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => { setCurrentPage(prev => Math.max(1, prev - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="px-3.5 py-1.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isIndonesian ? "Sebelumnya" : "Previous"}
                  </button>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => { setCurrentPage(prev => Math.min(totalPages, prev + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="px-3.5 py-1.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isIndonesian ? "Selanjutnya" : "Next"}
                  </button>
                </div>
              </div>
            )}

          </main>

          {/* 3. RIGHT SIDEBAR: AI RECOMMENDATIONS PANEL (SPAN 3) */}
          <aside className="lg:col-span-3 space-y-6">
            <div className="bg-slate-950 text-white rounded-2xl p-5 shadow-lg border border-slate-800 space-y-5">
              
              <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
                <UserCheck className="h-4 w-4 text-blue-400" />
                <span className="text-xs font-black uppercase tracking-wider text-slate-200">
                  {isIndonesian ? "Rekomendasi AI Sourcing" : "AI Sourcing Matchmaker"}
                </span>
              </div>

              <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                {isIndonesian 
                  ? "Sistem rekomendasi otomatis mencocokkan portofolio talenta dengan kebutuhan industri teknologi Indonesia."
                  : "Neural matching engine aligns verified developer portfolios with active recruitment criteria."}
              </p>

              {/* Suggestions candidates */}
              <div className="space-y-3 pt-1">
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest block">
                  {isIndonesian ? "Kandidat Paling Sesuai" : "Top AI Matches"}
                </span>
                
                {aiRecommendedCandidates.map(({ candidate, percentage, reason }) => (
                  <div 
                    key={candidate.id}
                    onClick={() => setPreviewCandidate(candidate)}
                    className="bg-slate-900 p-3 border border-slate-800 rounded-xl hover:border-blue-500 transition-all cursor-pointer space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <img 
                          src={getProfileAvatar(candidate.avatar)} 
                          alt={candidate.fullName} 
                          className="h-8 w-8 rounded-lg object-cover border border-slate-700"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = DEFAULT_PROFILE_IMAGE;
                          }}
                        />
                        <div>
                          <h5 className="font-extrabold text-xs text-white truncate max-w-[90px]">{candidate.fullName}</h5>
                          <span className="text-[9px] text-slate-400 font-bold block">{candidate.location}</span>
                        </div>
                      </div>
                      
                      <span className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-[10px] font-black text-blue-400 rounded-md">
                        {percentage}% Match
                      </span>
                    </div>

                    <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                      {reason}
                    </p>
                  </div>
                ))}
              </div>

              <div className="bg-slate-900/80 p-3 border border-slate-800 rounded-xl flex items-start space-x-2 text-[10px] text-slate-400">
                <Info className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed font-medium">
                  {isIndonesian 
                    ? "Gaji yang ditampilkan dalam mata uang Rupiah (IDR) untuk kemudahan penawaran kompensasi."
                    : "Salaries are presented in Indonesian Rupiah (IDR) for direct compensation negotiations."}
                </p>
              </div>

            </div>
          </aside>

        </div>
      </div>

      {/* QUICK PREVIEW SIDEBAR DRAWER */}
      <AnimatePresence>
        {previewCandidate && (
          <div 
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex justify-end"
            id="quick-preview-overlay"
            onClick={() => setPreviewCandidate(null)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-2xl h-full shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                <div className="flex items-center space-x-3.5">
                  <img 
                    src={getProfileAvatar(previewCandidate.avatar)} 
                    alt={previewCandidate.fullName} 
                    className="h-12 w-12 rounded-xl object-cover border border-slate-200 shadow-xs"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = DEFAULT_PROFILE_IMAGE;
                    }}
                  />
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5 flex-wrap">
                      {previewCandidate.fullName}
                      {previewCandidate.verified && (
                        <span className="px-2 py-0.5 rounded-full text-[8px] uppercase tracking-wider font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-0.5">
                          {t("verified_badge")}
                        </span>
                      )}
                      {previewCandidate.membershipPlan === "Pro" && (
                        <span 
                          className="px-1.5 py-0.5 rounded-md text-[8px] font-black bg-amber-50 text-amber-800 border border-amber-300 flex items-center gap-0.5 shadow-2xs"
                          title={isIndonesian ? "Kandidat Premium (Talent Pro)" : "Premium Candidate (Talent Pro)"}
                        >
                          <Crown className="h-2.5 w-2.5 text-amber-600 shrink-0" />
                          <span>PRO</span>
                        </span>
                      )}
                    </h3>
                    <p className="text-[10px] text-slate-500 font-bold">{previewCandidate.headline}</p>
                  </div>
                </div>

                <button
                  onClick={() => setPreviewCandidate(null)}
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Scrollable body */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 text-xs font-semibold text-slate-700">
                
                {/* Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl text-center">
                    <span className="text-[8px] text-slate-400 font-extrabold uppercase tracking-wider block">{t("expected_salary")}</span>
                    <span className="font-black text-slate-900 mt-1 block">{previewCandidate.expectedSalary}</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl text-center">
                    <span className="text-[8px] text-slate-400 font-extrabold uppercase tracking-wider block">{t("filter_location")}</span>
                    <span className="font-black text-slate-900 mt-1 block">{previewCandidate.location}</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl text-center">
                    <span className="text-[8px] text-slate-400 font-extrabold uppercase tracking-wider block">Skor ATS</span>
                    <span className="font-black text-blue-600 mt-1 block">{previewCandidate.talentScore}%</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl text-center">
                    <span className="text-[8px] text-slate-400 font-extrabold uppercase tracking-wider block">{t("candidate_notice_period")}</span>
                    <span className="font-black text-emerald-600 mt-1 block">{previewCandidate.availability}</span>
                  </div>
                </div>

                {/* Summary */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">{t("profile_about_title")}</span>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed bg-slate-50 p-4 border border-slate-100 rounded-xl">
                    {previewCandidate.aboutMe}
                  </p>
                </div>

                {/* Skills */}
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">{t("profile_skills_title")}</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {previewCandidate.skills.map(sk => (
                      <div key={sk.id} className="p-3 border border-slate-100 rounded-xl bg-white flex items-center justify-between">
                        <div>
                          <span className="font-extrabold text-slate-800 text-xs block">{sk.name}</span>
                          <span className="text-[9px] text-slate-400 font-bold block">{sk.category}</span>
                        </div>
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[9px] font-black uppercase">
                          {sk.yearsOfExperience} {isIndonesian ? "Thn" : "Yrs"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Work Experience */}
                <div className="space-y-2.5">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">{t("profile_experience_title")}</span>
                  <div className="space-y-3 pl-3 border-l-2 border-slate-200">
                    {previewCandidate.experience?.map(exp => (
                      <div key={exp.id} className="space-y-1">
                        <div className="flex justify-between items-start">
                          <h5 className="font-black text-slate-900 text-xs">{exp.position}</h5>
                          <span className="text-[9px] text-slate-400 font-bold">{exp.startDate} – {exp.endDate}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-extrabold">{exp.company} • {exp.employmentType}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Certifications */}
                {previewCandidate.certificates && previewCandidate.certificates.length > 0 && (
                  <div className="space-y-2.5">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">{t("profile_cert_title")}</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {previewCandidate.certificates.map(cert => (
                        <div key={cert.id} className="p-3 border border-slate-100 rounded-xl bg-slate-50 flex items-start space-x-2.5">
                          <Award className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <h5 className="font-extrabold text-slate-800 text-xs">{cert.name}</h5>
                            <p className="text-[9px] text-slate-400 font-bold">{cert.issuer} • {cert.issueDate}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Drawer Footer Actions */}
              <div className="p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                <div>
                  <span className="text-[8px] text-slate-400 font-extrabold uppercase tracking-wider block">{t("expected_salary")}</span>
                  <span className="text-xs font-black text-slate-900">{previewCandidate.expectedSalary}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => handleToggleBookmark(previewCandidate.id, e)}
                    className="p-2.5 border border-slate-200 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                  >
                    <Bookmark className={`h-4 w-4 text-slate-500 ${savedCandidateIds.includes(previewCandidate.id) ? "fill-blue-600 text-blue-600" : ""}`} />
                  </button>

                  <button
                    id="btn-preview-invite-candidate"
                    onClick={() => {
                      const target = previewCandidate;
                      setPreviewCandidate(null);
                      handleInitiateInvite(target);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs shadow-xs transition-all cursor-pointer"
                  >
                    {t("invite_interview_btn")}
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DIRECT INTERVIEW PROPOSAL MODAL (FOR VERIFIED HR) */}
      <AnimatePresence>
        {invitingCandidate && (
          <div 
            className="fixed inset-0 bg-slate-950/45 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4"
            id="sourcing-pitch-modal"
            onClick={() => setInvitingCandidate(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl border border-slate-100 w-full max-w-lg max-h-[88vh] overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="p-4 sm:p-6 bg-slate-950 text-white flex items-center justify-between shrink-0">
                <div className="flex items-center space-x-3">
                  <Send className="h-5 w-5 text-blue-400 shrink-0" />
                  <div className="min-w-0">
                    <h3 className="font-extrabold text-sm text-white truncate">
                      {isIndonesian ? "Kirim Undangan Wawancara Langsung" : "Direct Interview Pitch"}
                    </h3>
                    <p className="text-[10px] text-slate-400 truncate">
                      {isIndonesian ? "Kandidat:" : "Sourcing:"} {invitingCandidate.fullName}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setInvitingCandidate(null)}
                  className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 rounded-full cursor-pointer shrink-0"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSendInviteSubmit} className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 space-y-4 text-xs font-semibold text-slate-700">
                  {/* HR Verified Header Banner */}
                  <div className="bg-blue-50/70 border border-blue-100 p-3 rounded-2xl flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <Building2 className="h-4 w-4 text-blue-600 shrink-0" />
                      <div className="min-w-0">
                        <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">
                          {isIndonesian ? "Pengirim Rekrutmen HR" : "HR Recruiter Sender"}
                        </span>
                        <span className="text-xs font-extrabold text-blue-900 truncate block">
                          {currentUser?.fullName || (isIndonesian ? "Manajer HR" : "HR Lead")} • {currentUser?.companyName || "Nusantara Enterprise"}
                        </span>
                      </div>
                    </div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 shrink-0">
                      <ShieldCheck className="h-3 w-3 mr-0.5 text-emerald-600" /> {isIndonesian ? "Terverifikasi" : "Verified"}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 font-extrabold uppercase">
                      {isIndonesian ? "POSISI YANG DITAWARKAN" : "PROPOSED POSITION"}
                    </label>
                    <input 
                      type="text" 
                      required
                      id="invite-position-input"
                      value={invitePosition}
                      onChange={(e) => setInvitePosition(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-400 font-extrabold uppercase">
                        {isIndonesian ? "TAWARAN GAJI (RUPIAH)" : "SALARY OFFER (IDR)"}
                      </label>
                      <input 
                        type="text" 
                        required
                        id="invite-salary-input"
                        value={inviteSalaryOffer}
                        onChange={(e) => setInviteSalaryOffer(e.target.value)}
                        className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-400 font-extrabold uppercase">
                        {isIndonesian ? "JADWAL WAWANCARA" : "INTERVIEW SCHEDULE"}
                      </label>
                      <input 
                        type="datetime-local" 
                        required
                        id="invite-date-input"
                        value={inviteDate}
                        onChange={(e) => setInviteDate(e.target.value)}
                        className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  {/* Google Meet Link (Manually Entered by HR) */}
                  <div className="space-y-2">
                    <label className="text-[10px] text-slate-700 font-black uppercase tracking-wider flex items-center gap-1.5">
                      <Video className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                      <span>{t("google_meet_manual_label")}</span>
                      <span className="text-red-500 font-bold">*</span>
                    </label>
                    
                    <input 
                      type="url" 
                      required
                      id="manual-google-meet-input"
                      placeholder="https://meet.google.com/abc-defg-hij"
                      value={inviteMeetLink}
                      onChange={(e) => {
                        setInviteMeetLink(e.target.value);
                        if (meetLinkError) setMeetLinkError(null);
                      }}
                      className={`w-full border ${meetLinkError ? 'border-red-500 ring-1 ring-red-400 bg-red-50/20' : 'border-slate-200'} rounded-xl px-3.5 py-2.5 text-slate-800 font-mono text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden`}
                    />
                    
                    <div className="flex items-start gap-2 text-[10px] text-slate-500 font-medium leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <Info className="h-3.5 w-3.5 text-blue-500 shrink-0 mt-0.5" />
                      <p>{t("google_meet_manual_tip")}</p>
                    </div>

                    {meetLinkError && (
                      <p className="text-[11px] font-bold text-red-600 flex items-center gap-1.5">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {meetLinkError}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 font-extrabold uppercase">
                      {isIndonesian ? "PESAN PENAWARAN" : "PITCH MESSAGE"}
                    </label>
                    <textarea 
                      rows={3}
                      required
                      id="invite-message-input"
                      value={inviteMessage}
                      onChange={(e) => setInviteMessage(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 leading-relaxed font-medium text-xs resize-none focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 shrink-0 flex flex-col-reverse sm:flex-row gap-2.5 sm:gap-3">
                  <button
                    type="button"
                    id="btn-cancel-pitch"
                    onClick={() => {
                      setInvitingCandidate(null);
                      setMeetLinkError(null);
                    }}
                    className="w-full sm:w-1/2 py-2.5 border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl transition-colors cursor-pointer text-center"
                  >
                    {isIndonesian ? "Batal" : "Cancel"}
                  </button>
                  <button
                    type="submit"
                    id="btn-submit-pitch"
                    className="w-full sm:w-1/2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-xs transition-all cursor-pointer text-center"
                  >
                    {isIndonesian ? "Kirim Undangan Wawancara" : "Send Interview Pitch"}
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ACCESS RESTRICTION MODAL (FOR UNAUTHENTICATED OR CANDIDATE ROLE USERS) */}
      <AnimatePresence>
        {authRestrictionModal.isOpen && (
          <div 
            className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-50 flex items-center justify-center p-4"
            id="auth-restriction-modal-overlay"
            onClick={() => setAuthRestrictionModal(prev => ({ ...prev, isOpen: false }))}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl border border-slate-100 max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-6 relative overflow-hidden"
              id="auth-restriction-modal"
            >
              <button
                onClick={() => setAuthRestrictionModal(prev => ({ ...prev, isOpen: false }))}
                className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                id="btn-close-restriction-modal"
              >
                <X className="h-4 w-4" />
              </button>

              {authRestrictionModal.reason === "unauthenticated" ? (
                <>
                  <div className="flex items-center space-x-3.5">
                    <div className="h-12 w-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0 shadow-xs">
                      <Lock className="h-6 w-6" />
                    </div>
                    <div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-100 text-blue-800">
                        {isIndonesian ? "Akses Terbatas: HR Saja" : "Restricted: HR Access Only"}
                      </span>
                      <h3 className="text-base font-black text-slate-900 leading-snug mt-1">
                        {t("hr_auth_required_title")}
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs text-slate-600 font-medium leading-relaxed">
                    <p>{t("hr_auth_required_desc")}</p>
                    {authRestrictionModal.candidateName && (
                      <div className="pt-2.5 border-t border-slate-200/80 flex items-center justify-between text-[11px] font-bold text-slate-700">
                        <span className="text-slate-500">{isIndonesian ? "Kandidat Dituju:" : "Target Talent:"}</span>
                        <span className="text-blue-600 font-extrabold">{authRestrictionModal.candidateName}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2.5 pt-1">
                    <button
                      type="button"
                      id="btn-modal-login-hr"
                      onClick={() => {
                        setAuthRestrictionModal(prev => ({ ...prev, isOpen: false }));
                        onTabChange("login");
                      }}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-xs transition-all flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <span>{t("btn_login_hr")}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                    
                    <button
                      type="button"
                      id="btn-modal-register-hr"
                      onClick={() => {
                        setAuthRestrictionModal(prev => ({ ...prev, isOpen: false }));
                        onTabChange("register");
                      }}
                      className="w-full py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition-colors text-center cursor-pointer"
                    >
                      {t("btn_register_hr")}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center space-x-3.5">
                    <div className="h-12 w-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0 shadow-xs">
                      <ShieldAlert className="h-6 w-6" />
                    </div>
                    <div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-100 text-amber-800">
                        {isIndonesian ? "Otoritas HR Diperlukan" : "HR Authority Required"}
                      </span>
                      <h3 className="text-base font-black text-slate-900 leading-snug mt-1">
                        {t("hr_role_restricted_title")}
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-3 bg-amber-50/50 p-4 rounded-2xl border border-amber-100 text-xs text-slate-600 font-medium leading-relaxed">
                    <p>{t("hr_role_restricted_desc")}</p>
                    <div className="pt-2.5 border-t border-amber-200/60 flex items-center justify-between text-[11px] font-bold text-slate-700">
                      <span className="text-slate-500">{isIndonesian ? "Akun Saat Ini:" : "Current Account:"}</span>
                      <span className="text-slate-900 font-extrabold">{currentUser?.fullName} ({isIndonesian ? "Kandidat" : "Candidate"})</span>
                    </div>
                  </div>

                  <div className="space-y-2.5 pt-1">
                    <button
                      type="button"
                      id="btn-modal-switch-hr"
                      onClick={() => {
                        setAuthRestrictionModal(prev => ({ ...prev, isOpen: false }));
                        onTabChange("login");
                      }}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-xs transition-all flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <span>{t("btn_switch_hr")}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                    
                    <button
                      type="button"
                      id="btn-modal-dismiss-restriction"
                      onClick={() => setAuthRestrictionModal(prev => ({ ...prev, isOpen: false }))}
                      className="w-full py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition-colors text-center cursor-pointer"
                    >
                      {isIndonesian ? "Kembali Menjelajah" : "Back to Browsing"}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
