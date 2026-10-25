/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Briefcase,
  Banknote,
  Building2,
  Clock,
  CheckCircle2,
  ArrowRight,
  Filter,
  Send,
  X,
  ExternalLink,
  ChevronRight,
  Users,
  ShieldCheck,
  FileText,
  AlertCircle,
  RefreshCw,
  Eye,
  Lock,
  UserCheck,
  LogIn,
  Video,
  Award
} from "lucide-react";
import { JobOpening, JobApplication, Candidate, DEFAULT_PROFILE_IMAGE, getProfileAvatar } from "../types";
import { useLanguage } from "../context/LanguageContext";

interface CandidateJobSearchViewProps {
  candidate?: Candidate;
  isLoggedIn?: boolean;
  currentUser?: { id: string; fullName: string; email: string; role: string } | null;
  onNavigateToTab?: (tab: string) => void;
}

export default function CandidateJobSearchView({
  candidate,
  isLoggedIn = false,
  currentUser = null,
  onNavigateToTab
}: CandidateJobSearchViewProps) {
  const { isIndonesian, formatCurrency } = useLanguage();

  // Active candidate representation
  const activeCandidate: Candidate = candidate || {
    id: currentUser?.id || "guest",
    fullName: currentUser?.fullName || (isIndonesian ? "Pengguna Tamu" : "Guest User"),
    email: currentUser?.email || "",
    phone: "+62 811-9876-5432",
    headline: "Professional Talent",
    aboutMe: "",
    location: "Jakarta, Indonesia",
    nationality: "Indonesian",
    avatar: DEFAULT_PROFILE_IMAGE,
    expectedSalary: "Rp 15.000.000 / bulan",
    availability: "Immediate",
    employmentType: ["Full-time"],
    preferredLocation: "Remote",
    openToWork: true,
    remote: true,
    hybrid: true,
    onsite: false,
    relocation: false,
    profileCompletion: 80,
    verified: false,
    atsScore: 85,
    skills: [],
    experience: [],
    education: [],
    certificates: [],
    portfolio: []
  };

  // Active view: 'browse' (Search Openings) or 'my-applications' (Track Applied)
  const [activeSubTab, setActiveSubTab] = useState<"browse" | "my-applications">("browse");

  // Jobs state
  const [jobs, setJobs] = useState<JobOpening[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState<boolean>(true);
  const [isLoadingApps, setIsLoadingApps] = useState<boolean>(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterWorkplace, setFilterWorkplace] = useState<string>("All");
  const [filterEmployment, setFilterEmployment] = useState<string>("All");
  const [filterExperience, setFilterExperience] = useState<string>("All");
  const [filterLocation, setFilterLocation] = useState<string>("");

  // Modal States
  const [selectedJobForDetail, setSelectedJobForDetail] = useState<JobOpening | null>(null);
  const [selectedJobForApply, setSelectedJobForApply] = useState<JobOpening | null>(null);
  const [authPromptModal, setAuthPromptModal] = useState<{
    open: boolean;
    jobTitle: string;
    reason: "unauthenticated" | "recruiter_role";
  } | null>(null);

  // Application Form State
  const [applyCoverNote, setApplyCoverNote] = useState<string>("");
  const [applyExpectedSalary, setApplyExpectedSalary] = useState<string>(activeCandidate.expectedSalary || "");
  const [applyPortfolioUrl, setApplyPortfolioUrl] = useState<string>(activeCandidate.website || "");
  const [applyShareProfile, setApplyShareProfile] = useState<boolean>(true);
  const [isSubmittingApp, setIsSubmittingApp] = useState<boolean>(false);
  const [applySuccessMsg, setApplySuccessMsg] = useState<string | null>(null);
  const [applyErrorMsg, setApplyErrorMsg] = useState<string | null>(null);
  const [acceptingAppId, setAcceptingAppId] = useState<string | null>(null);
  const [acceptFeedback, setAcceptFeedback] = useState<{ id: string; message: string; type: "success" | "error" } | null>(null);

  // Fetch Jobs
  const fetchJobs = async () => {
    setIsLoadingJobs(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.append("query", searchQuery.trim());
      if (filterLocation.trim()) params.append("location", filterLocation.trim());
      if (filterWorkplace !== "All") params.append("workplaceType", filterWorkplace);
      if (filterEmployment !== "All") params.append("employmentType", filterEmployment);
      if (filterExperience !== "All") params.append("experienceLevel", filterExperience);

      const res = await fetch(`/api/candidates/jobs?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs || []);
      }
    } catch (err) {
      console.error("Failed to fetch job openings:", err);
    } finally {
      setIsLoadingJobs(false);
    }
  };

  // Fetch Candidate Applications
  const fetchApplications = async () => {
    setIsLoadingApps(true);
    try {
      const res = await fetch("/api/candidates/applications");
      if (res.ok) {
        const data = await res.json();
        setApplications(data.applications || []);
      }
    } catch (err) {
      console.error("Failed to fetch applications:", err);
    } finally {
      setIsLoadingApps(false);
    }
  };

  // Candidate accepts job offer
  const handleAcceptOffer = async (appId: string) => {
    setAcceptingAppId(appId);
    setAcceptFeedback(null);
    try {
      const res = await fetch(`/api/candidates/applications/${appId}/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAcceptFeedback({
          id: appId,
          message: isIndonesian
            ? "Selamat! Anda telah resmi menyetujui dan menerima penawaran kerja ini."
            : "Congratulations! You have formally accepted this job offer.",
          type: "success"
        });
        await fetchApplications();
      } else {
        setAcceptFeedback({
          id: appId,
          message: data.error || (isIndonesian ? "Gagal menerima penawaran kerja." : "Failed to accept job offer."),
          type: "error"
        });
      }
    } catch (err) {
      setAcceptFeedback({
        id: appId,
        message: isIndonesian ? "Terjadi kesalahan jaringan." : "A network error occurred.",
        type: "error"
      });
    } finally {
      setAcceptingAppId(null);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchApplications();
  }, [searchQuery, filterWorkplace, filterEmployment, filterExperience, filterLocation]);

  // Check if candidate already applied for a job
  const hasAppliedForJob = (jobId: string) => {
    return applications.some((app) => app.jobId === jobId);
  };

  const getApplicationForJob = (jobId: string) => {
    return applications.find((app) => app.jobId === jobId);
  };

  // Initiate Application flow with authentication & role checks
  const handleInitiateApply = (job: JobOpening) => {
    if (!isLoggedIn || !currentUser) {
      setAuthPromptModal({
        open: true,
        jobTitle: job.title,
        reason: "unauthenticated"
      });
      return;
    }

    if (currentUser.role === "recruiter") {
      setAuthPromptModal({
        open: true,
        jobTitle: job.title,
        reason: "recruiter_role"
      });
      return;
    }

    setSelectedJobForApply(job);
    setApplyExpectedSalary(activeCandidate.expectedSalary || job.salaryFormatted);
  };

  // Handle Application Submit
  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJobForApply) return;

    if (!isLoggedIn || !currentUser) {
      setAuthPromptModal({
        open: true,
        jobTitle: selectedJobForApply.title,
        reason: "unauthenticated"
      });
      return;
    }

    if (currentUser.role === "recruiter") {
      setAuthPromptModal({
        open: true,
        jobTitle: selectedJobForApply.title,
        reason: "recruiter_role"
      });
      return;
    }

    setIsSubmittingApp(true);
    setApplyErrorMsg(null);

    try {
      const res = await fetch(`/api/candidates/jobs/${selectedJobForApply.id}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coverNote: applyCoverNote.trim(),
          expectedSalary: applyExpectedSalary.trim() || selectedJobForApply.salaryFormatted,
          portfolioUrl: applyPortfolioUrl.trim(),
          candidateName: activeCandidate.fullName,
          candidateEmail: activeCandidate.email,
          candidatePhone: activeCandidate.phone,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setApplySuccessMsg(
          isIndonesian
            ? `Selamat! Lamaran Anda untuk "${selectedJobForApply.title}" di ${selectedJobForApply.companyName} telah berhasil dikirim ke tim HR.`
            : `Success! Your application for "${selectedJobForApply.title}" at ${selectedJobForApply.companyName} has been submitted to HR.`
        );
        // Refresh jobs and applications
        await fetchApplications();
        await fetchJobs();

        setTimeout(() => {
          setSelectedJobForApply(null);
          setApplySuccessMsg(null);
          setApplyCoverNote("");
        }, 2000);
      } else {
        if (data.requireAuth) {
          setAuthPromptModal({
            open: true,
            jobTitle: selectedJobForApply.title,
            reason: "unauthenticated"
          });
        }
        setApplyErrorMsg(data.error || "Gagal mengirim lamaran. Silakan coba lagi.");
      }
    } catch (err) {
      setApplyErrorMsg("Terjadi gangguan jaringan saat mengirim lamaran.");
    } finally {
      setIsSubmittingApp(false);
    }
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setFilterWorkplace("All");
    setFilterEmployment("All");
    setFilterExperience("All");
    setFilterLocation("");
  };

  // Quick Cover Note Helpers
  const fillCoverTemplate = (type: "fullstack" | "frontend" | "general") => {
    if (type === "fullstack") {
      setApplyCoverNote(
        isIndonesian
          ? `Halo Tim HR ${selectedJobForApply?.companyName || ""}, saya memiliki 5+ tahun pengalaman dalam pengembangan React, TypeScript, dan arsitektur backend Node.js yang berskala tinggi. Saya tertarik melamar posisi ini karena kesesuaian teknologi dan visi perusahaan.`
          : `Hello HR Team at ${selectedJobForApply?.companyName || ""}, I bring 5+ years of hands-on experience in React, TypeScript, and scalable Node.js microservices. I am excited to apply for this role given the strong alignment with my technical stack.`
      );
    } else if (type === "frontend") {
      setApplyCoverNote(
        isIndonesian
          ? `Halo Tim HR, saya sangat tertarik dengan lowongan ini. Spesialisasi utama saya berfokus pada performa web modern, Next.js, Tailwind CSS, dan implementasi UI/UX berstandar tinggi.`
          : `Hello Hiring Team, I am enthusiastic about this opportunity. My core specialty is focused on modern web performance, Next.js, responsive Tailwind design, and clean component architectures.`
      );
    } else {
      setApplyCoverNote(
        isIndonesian
          ? `Halo, perkenalkan saya ${candidate.fullName}. Saya tertarik melamar lowongan ${selectedJobForApply?.title || ""} ini dan siap memberikan kontribusi terbaik bagi perusahaan.`
          : `Hello, my name is ${candidate.fullName}. I am keenly interested in this ${selectedJobForApply?.title || ""} position and eager to contribute to your company's growth.`
      );
    }
  };

  return (
    <div className="space-y-6" id="candidate-job-search-container">
      {/* Top Banner & Tab Navigation */}
      <div className="bg-white rounded-3xl border border-slate-100 p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="w-full lg:w-auto">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-extrabold border border-blue-100 flex items-center gap-1.5 shadow-2xs">
                <Briefcase className="h-3.5 w-3.5 text-blue-600" />
                {isIndonesian ? "Pusat Lowongan Kerja HR" : "HR Job Openings Hub"}
              </span>
              <span className="text-xs font-semibold text-slate-400">
                • {jobs.length} {isIndonesian ? "Lowongan Terbuka" : "Positions Active"}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-extrabold text-slate-900 mt-2">
              {isIndonesian ? "Jelajahi & Lamar Lowongan Kerja dari HR" : "Explore & Apply for HR Job Openings"}
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1 max-w-2xl">
              {isIndonesian
                ? "Temukan posisi strategis yang dipasang langsung oleh manajer perekrut dan HR terverifikasi. Kirim lamaran instan dengan profil digital dan portofolio Anda."
                : "Discover strategic roles posted directly by verified hiring managers. Submit instant applications with your digital talent profile and portfolio."}
            </p>
          </div>

          {/* Sub-Tabs: Browse vs My Applications */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200/80 w-full sm:w-auto shrink-0 justify-stretch sm:justify-start">
            <button
              id="subtab-browse-jobs"
              onClick={() => setActiveSubTab("browse")}
              className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2.5 sm:py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-2 ${
                activeSubTab === "browse"
                  ? "bg-white text-blue-700 shadow-sm font-extrabold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Search className="h-3.5 w-3.5" />
              <span>{isIndonesian ? "Cari Lowongan" : "Browse Jobs"}</span>
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-slate-200/70 text-slate-700 font-bold">
                {jobs.length}
              </span>
            </button>

            <button
              id="subtab-my-applications"
              onClick={() => setActiveSubTab("my-applications")}
              className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2.5 sm:py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-2 ${
                activeSubTab === "my-applications"
                  ? "bg-white text-blue-700 shadow-sm font-extrabold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              <span>{isIndonesian ? "Lamaran Saya" : "My Applications"}</span>
              {applications.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-blue-600 text-white font-bold">
                  {applications.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar & Quick Filters (Only shown when in Browse mode) */}
        {activeSubTab === "browse" && (
          <div className="pt-5 space-y-4">
            {/* Primary Search Bar */}
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  id="job-keyword-search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    isIndonesian
                      ? "Cari posisi pekerjaan, keahlian teknologi (React, Node, Cloud), atau perusahaan..."
                      : "Search by job title, tech skills (React, Node, Cloud), or company..."
                  }
                  className="w-full pl-10 pr-10 py-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-2xs"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="relative w-full md:w-56">
                <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  id="job-location-filter-input"
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                  placeholder={isIndonesian ? "Lokasi (Jakarta, Remote)" : "Location (Jakarta, Remote)"}
                  className="w-full pl-10 pr-3.5 py-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-2xs"
                />
              </div>

              {(searchQuery || filterLocation || filterWorkplace !== "All" || filterEmployment !== "All" || filterExperience !== "All") && (
                <button
                  id="job-filter-reset-btn"
                  onClick={handleResetFilters}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center space-x-1.5 shrink-0"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>{isIndonesian ? "Reset Filter" : "Reset Filters"}</span>
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-bold">
              <span className="text-slate-400 font-extrabold uppercase text-[10px] tracking-wider mr-1">
                {isIndonesian ? "Tipe Kerja:" : "Workplace:"}
              </span>
              {(["All", "Remote", "Hybrid", "Onsite"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterWorkplace(type)}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    filterWorkplace === type
                      ? "bg-slate-900 text-white shadow-2xs"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/80"
                  }`}
                >
                  {type === "All" ? (isIndonesian ? "Semua Tipe" : "All Types") : type}
                </button>
              ))}

              <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />

              <span className="text-slate-400 font-extrabold uppercase text-[10px] tracking-wider mr-1">
                {isIndonesian ? "Kontrak:" : "Type:"}
              </span>
              {(["All", "Full-time", "Internship", "Contract"] as const).map((emp) => (
                <button
                  key={emp}
                  onClick={() => setFilterEmployment(emp)}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    filterEmployment === emp
                      ? "bg-slate-900 text-white shadow-2xs"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/80"
                  }`}
                >
                  {emp === "All" 
                    ? (isIndonesian ? "Semua" : "All") 
                    : emp === "Internship" 
                    ? (isIndonesian ? "🎓 Magang" : "🎓 Internship") 
                    : emp}
                </button>
              ))}

              <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />

              <span className="text-slate-400 font-extrabold uppercase text-[10px] tracking-wider mr-1">
                {isIndonesian ? "Jenjang:" : "Level:"}
              </span>
              {(["All", "Junior", "Mid-level", "Senior", "Lead"] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setFilterExperience(lvl)}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    filterExperience === lvl
                      ? "bg-slate-900 text-white shadow-2xs"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/80"
                  }`}
                >
                  {lvl === "All" ? (isIndonesian ? "Semua Jenjang" : "All Levels") : lvl}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* VIEW: BROWSE JOBS */}
      {/* ========================================================================= */}
      {activeSubTab === "browse" && (
        <div className="space-y-4">
          {isLoadingJobs ? (
            <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center shadow-sm">
              <RefreshCw className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-700">
                {isIndonesian ? "Memuat lowongan kerja dari HR..." : "Fetching job openings from HR..."}
              </p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center shadow-sm space-y-4">
              <div className="h-16 w-16 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto text-slate-400">
                <Briefcase className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  {isIndonesian ? "Tidak Ada Lowongan yang Sesuai" : "No Matching Job Openings"}
                </h3>
                <p className="text-xs text-slate-500 font-semibold mt-1 max-w-md mx-auto">
                  {isIndonesian
                    ? "Coba sesuaikan kata kunci pencarian, hapus filter lokasi, atau pilih tipe kerja lainnya."
                    : "Try broadening your search keywords or resetting your location and workplace filters."}
                </p>
              </div>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold transition-all shadow-xs cursor-pointer inline-flex items-center space-x-2"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>{isIndonesian ? "Tampilkan Semua Lowongan" : "Show All Job Openings"}</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {jobs.map((job) => {
                const applied = hasAppliedForJob(job.id);
                const application = getApplicationForJob(job.id);

                return (
                  <div
                    key={job.id}
                    id={`job-card-${job.id}`}
                    className="bg-white rounded-3xl border border-slate-100 p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-slate-200 transition-all flex flex-col justify-between group relative overflow-hidden"
                  >
                    <div className="space-y-3.5 sm:space-y-4">
                      {/* Company Header & Badges */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start sm:items-center space-x-3 min-w-0">
                          <img
                            src={job.companyLogo}
                            alt={job.companyName}
                            className="h-11 w-11 sm:h-12 sm:w-12 rounded-2xl object-cover border border-slate-100 shadow-2xs p-0.5 bg-white shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center space-x-1.5">
                              <span className="text-xs font-extrabold text-slate-800 truncate">
                                {job.companyName}
                              </span>
                              <ShieldCheck className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                            </div>
                            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 mt-0.5">
                              {job.title}
                            </h3>
                            {job.department && (
                              <p className="text-[11px] font-semibold text-slate-500 truncate">
                                {job.department}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Workplace Badge */}
                        <span
                          className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold uppercase tracking-wider shrink-0 border ${
                            job.workplaceType === "Remote"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200/60"
                              : job.workplaceType === "Hybrid"
                              ? "bg-purple-50 text-purple-700 border-purple-200/60"
                              : "bg-slate-100 text-slate-700 border-slate-200"
                          }`}
                        >
                          {job.workplaceType}
                        </span>
                      </div>

                      {/* Meta Tags: Location, Salary, Experience */}
                      <div className="flex flex-wrap gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-bold text-slate-600">
                        <span className="flex items-center px-2.5 py-1 bg-slate-50 rounded-xl border border-slate-100">
                          <MapPin className="h-3.5 w-3.5 mr-1 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[140px]">{job.location}</span>
                        </span>
                        <span className="flex items-center px-2.5 py-1 bg-blue-50/70 text-blue-800 rounded-xl border border-blue-100 font-extrabold">
                          <Banknote className="h-3.5 w-3.5 mr-1 text-blue-600 shrink-0" />
                          <span className="truncate max-w-[160px]">{job.salaryFormatted}</span>
                        </span>
                        <span className="flex items-center px-2.5 py-1 bg-slate-50 rounded-xl border border-slate-100">
                          <Clock className="h-3.5 w-3.5 mr-1 text-slate-400 shrink-0" />
                          <span>{job.employmentType} • {job.experienceLevel}</span>
                        </span>
                      </div>

                      {/* Brief description snippet */}
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-normal">
                        {job.description}
                      </p>

                      {/* Skills Tags */}
                      {job.skills && job.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-0.5">
                          {job.skills.slice(0, 4).map((skill, sIdx) => (
                            <span
                              key={sIdx}
                              className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200/70"
                            >
                              {skill}
                            </span>
                          ))}
                          {job.skills.length > 4 && (
                            <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-slate-50 text-slate-400">
                              +{job.skills.length - 4}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Card Footer & Action Buttons */}
                    <div className="border-t border-slate-100 pt-3.5 sm:pt-4 mt-4 sm:mt-5 flex flex-wrap items-center justify-between gap-3">
                      <div className="text-[11px] font-semibold text-slate-400 flex items-center space-x-1.5">
                        <Users className="h-3.5 w-3.5" />
                        <span>
                          {job.applicantCount || 0} {isIndonesian ? "pelamar" : "applicants"}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                        <button
                          id={`view-job-details-btn-${job.id}`}
                          onClick={() => setSelectedJobForDetail(job)}
                          className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer flex items-center justify-center space-x-1"
                        >
                          <Eye className="h-3.5 w-3.5 text-slate-500" />
                          <span>{isIndonesian ? "Detail" : "Details"}</span>
                        </button>

                        {applied ? (
                          <span className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center space-x-1 shadow-2xs">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                            <span>{isIndonesian ? "Sudah Dilamar" : "Applied"}</span>
                          </span>
                        ) : (
                          <button
                            id={`apply-job-btn-${job.id}`}
                            onClick={() => handleInitiateApply(job)}
                            className="flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-extrabold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-xs cursor-pointer flex items-center justify-center space-x-1.5 hover:shadow-sm"
                          >
                            <span>{isIndonesian ? "Lamar Sekarang" : "Apply Now"}</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW: MY APPLICATIONS */}
      {/* ========================================================================= */}
      {activeSubTab === "my-applications" && (
        <div className="space-y-4">
          {isLoadingApps ? (
            <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center shadow-sm">
              <RefreshCw className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-700">
                {isIndonesian ? "Memuat riwayat lamaran Anda..." : "Loading your applications..."}
              </p>
            </div>
          ) : applications.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center shadow-sm space-y-4">
              <div className="h-16 w-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto">
                <FileText className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  {isIndonesian ? "Belum Ada Lamaran yang Dikirim" : "No Applications Submitted Yet"}
                </h3>
                <p className="text-xs text-slate-500 font-semibold mt-1 max-w-md mx-auto">
                  {isIndonesian
                    ? "Anda belum melamar posisi pekerjaan apa pun. Jelajahi lowongan yang dipasang oleh HR dan kirimkan lamaran pertama Anda."
                    : "You have not applied to any job openings yet. Explore roles posted by recruiters and submit your first application."}
                </p>
              </div>
              <button
                onClick={() => setActiveSubTab("browse")}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold transition-all shadow-xs cursor-pointer inline-flex items-center space-x-2"
              >
                <Search className="h-3.5 w-3.5" />
                <span>{isIndonesian ? "Cari Lowongan Kerja Sekarang" : "Browse Job Openings Now"}</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-blue-50/50 rounded-2xl border border-blue-100 p-4 flex items-center justify-between text-xs font-semibold text-blue-900">
                <div className="flex items-center space-x-2">
                  <Briefcase className="h-4 w-4 text-blue-600" />
                  <span>
                    {isIndonesian
                      ? `Anda telah mengirimkan ${applications.length} lamaran pekerjaan. Status lamaran akan diperbarui secara real-time saat HR meninjau berkas Anda.`
                      : `You have submitted ${applications.length} applications. Status will update in real-time as HR reviews your profile.`}
                  </span>
                </div>
              </div>

              <div className="grid gap-4">
                {applications.map((app) => {
                  const isRejected = app.status === "rejected";
                  const isOffered = app.status === "offered";
                  const isAccepted = app.status === "accepted";
                  const isInterview = app.status === "interview";
                  const isReviewing = app.status === "reviewing";
                  const isApplied = app.status === "applied";

                  // 30-day SLA Calculation for candidate view
                  const appliedTime = app.appliedAt ? new Date(app.appliedAt).getTime() : Date.now();
                  const daysElapsed = Math.floor((Date.now() - appliedTime) / (1000 * 60 * 60 * 24));
                  const daysRemaining = Math.max(0, 30 - daysElapsed);
                  const isExpired = app.isExpired || app.expiredReason === "30_days_limit" || (daysRemaining === 0 && (isApplied || isReviewing));

                  const statusColorMap: Record<string, string> = {
                    applied: "bg-amber-50 text-amber-700 border-amber-200",
                    reviewing: "bg-blue-50 text-blue-700 border-blue-200",
                    interview: "bg-purple-50 text-purple-700 border-purple-200",
                    offered: "bg-emerald-50 text-emerald-700 border-emerald-200",
                    accepted: "bg-teal-50 text-teal-800 border-teal-200",
                    rejected: isExpired ? "bg-stone-100 text-stone-600 border-stone-200" : "bg-slate-100 text-slate-600 border-slate-200",
                  };

                  const statusLabelMap: Record<string, string> = {
                    applied: isIndonesian ? "Terkirim (Menunggu Review)" : "Submitted (Pending Review)",
                    reviewing: isIndonesian ? "Sedang Ditinjau Tim HR" : "Under HR Review",
                    interview: isIndonesian ? "Tahap Wawancara" : "Interview Stage",
                    offered: isIndonesian ? "🎉 Menerima Penawaran Kerja" : "🎉 Job Offer Received",
                    accepted: isIndonesian ? "🎉 Tawaran Diterima & Disetujui" : "🎉 Offer Accepted & Finalized",
                    rejected: isExpired
                      ? isIndonesian ? "Kadaluarsa (Batas 30 Hari)" : "Expired (30-Day SLA Reached)"
                      : isIndonesian ? "Belum Sesuai (Final)" : "Not Selected (Final)",
                  };

                  return (
                    <div
                      key={app.id}
                      className={`bg-white rounded-3xl border p-5 sm:p-6 shadow-sm transition-all space-y-4 ${
                        isAccepted
                          ? "border-teal-200 bg-teal-50/20"
                          : isOffered
                          ? "border-emerald-300 ring-2 ring-emerald-100 bg-emerald-50/20"
                          : "border-slate-100 hover:border-slate-200"
                      }`}
                    >
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-5">
                        <div className="flex items-start space-x-3.5 sm:space-x-4 min-w-0">
                          <img
                            src={app.companyLogo}
                            alt={app.companyName}
                            className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl object-cover border border-slate-100 shadow-2xs p-0.5 bg-white shrink-0"
                          />
                          <div className="space-y-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                              <span className="text-xs font-extrabold text-slate-700">
                                {app.companyName}
                              </span>
                              <span className="text-slate-300 hidden sm:inline">•</span>
                              <span className="text-[11px] font-semibold text-slate-400">
                                {isIndonesian ? "Dilamar pada" : "Applied on"} {app.appliedAt}
                              </span>
                            </div>
                            <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                              {app.jobTitle}
                            </h3>
                            {app.coverNote && (
                              <p className="text-xs text-slate-500 line-clamp-1 italic bg-slate-50 px-3 py-1 rounded-xl border border-slate-100 mt-1 max-w-xl">
                                "{app.coverNote}"
                              </p>
                            )}
                            <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-600 pt-1">
                              <span className="flex items-center text-slate-500">
                                <Banknote className="h-3 w-3 text-slate-400 mr-1" />
                                {app.expectedSalary}
                              </span>

                              {/* 30-Day SLA Review Indicator for Candidate */}
                              {(isApplied || isReviewing) && !isExpired && (
                                <span
                                  className={`inline-flex items-center text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                                    daysRemaining <= 5
                                      ? "bg-amber-100 text-amber-900 border-amber-300 animate-pulse"
                                      : "bg-slate-100 text-slate-600 border-slate-200"
                                  }`}
                                  title={
                                    isIndonesian
                                      ? `Batas waktu peninjauan oleh HR adalah 30 hari. Sisa waktu: ${daysRemaining} hari.`
                                      : `HR review SLA limit is 30 days. ${daysRemaining} days remaining.`
                                  }
                                >
                                  <Clock className="h-3 w-3 mr-1 text-slate-500" />
                                  <span>
                                    {isIndonesian
                                      ? `Batas Review HR: ${daysRemaining} hari lagi`
                                      : `HR Review SLA: ${daysRemaining} days left`}
                                  </span>
                                </span>
                              )}

                              {isExpired && (
                                <span className="inline-flex items-center text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border bg-stone-100 text-stone-600 border-stone-200">
                                  <Clock className="h-3 w-3 mr-1 text-stone-500" />
                                  <span>
                                    {isIndonesian
                                      ? "Melewati batas review 30 hari (Ditolak otomatis)"
                                      : "Expired past 30-day review limit"}
                                  </span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Status & Actions */}
                        <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-2.5 shrink-0 w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                          <span
                            className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold border flex items-center space-x-1.5 shadow-2xs ${
                              statusColorMap[app.status] || "bg-slate-100 text-slate-700 border-slate-200"
                            }`}
                          >
                            <span className="h-2 w-2 rounded-full bg-current" />
                            <span>{statusLabelMap[app.status] || app.status}</span>
                          </span>

                          {app.interviewDate && (
                            <div className="flex flex-col items-start md:items-end gap-1">
                              <div className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-xl border border-purple-100">
                                📅 {isIndonesian ? "Wawancara:" : "Interview:"} {app.interviewDate}
                              </div>
                              {app.meetLink && (
                                <a
                                  href={app.meetLink}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center text-[11px] font-extrabold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2.5 py-1 rounded-xl transition-colors shadow-2xs"
                                >
                                  <Video className="h-3 w-3 mr-1 text-blue-600" />
                                  <span>{isIndonesian ? "Buka Google Meet" : "Join Google Meet"}</span>
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Job Offer Extended Section */}
                      {isOffered && (
                        <div className="mt-3 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-200 space-y-3">
                          <div className="flex items-center space-x-2">
                            <Award className="h-5 w-5 text-emerald-600" />
                            <h4 className="font-extrabold text-slate-900 text-sm">
                              {isIndonesian ? "Selamat! Anda Menerima Penawaran Kerja Resmi" : "Congratulations! You Have Received a Formal Job Offer"}
                            </h4>
                          </div>

                          <div className="grid sm:grid-cols-2 gap-3 text-xs bg-white/80 backdrop-blur-xs p-3.5 rounded-xl border border-emerald-100">
                            <div>
                              <span className="text-slate-400 font-semibold block text-[11px]">
                                {isIndonesian ? "Gaji & Kompensasi Ditawarkan" : "Offered Compensation"}
                              </span>
                              <span className="font-extrabold text-emerald-700 text-sm">
                                {app.offerSalary || app.expectedSalary}
                              </span>
                            </div>
                            {app.offerStartDate && (
                              <div>
                                <span className="text-slate-400 font-semibold block text-[11px]">
                                  {isIndonesian ? "Tanggal Mulai Bekerja" : "Estimated Start Date"}
                                </span>
                                <span className="font-extrabold text-slate-800 text-sm">
                                  {app.offerStartDate}
                                </span>
                              </div>
                            )}
                            {app.offerNotes && (
                              <div className="sm:col-span-2 pt-1 border-t border-slate-100">
                                <span className="text-slate-400 font-semibold block text-[11px]">
                                  {isIndonesian ? "Catatan dari Tim HR / Recruiter" : "Notes from Recruiter / HR"}
                                </span>
                                <p className="text-slate-700 italic mt-0.5">{app.offerNotes}</p>
                              </div>
                            )}
                          </div>

                          {acceptFeedback && acceptFeedback.id === app.id && (
                            <div
                              className={`p-3 rounded-xl text-xs font-bold ${
                                acceptFeedback.type === "success"
                                  ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                  : "bg-red-100 text-red-800 border border-red-200"
                              }`}
                            >
                              {acceptFeedback.message}
                            </div>
                          )}

                          <div className="flex items-center justify-end pt-1">
                            <button
                              disabled={acceptingAppId === app.id}
                              onClick={() => handleAcceptOffer(app.id)}
                              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-extrabold transition-all shadow-sm hover:shadow-md cursor-pointer flex items-center space-x-2"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                              <span>
                                {acceptingAppId === app.id
                                  ? isIndonesian ? "Menyetujui..." : "Accepting..."
                                  : isIndonesian ? "🎉 Terima & Setujui Penawaran Kerja" : "🎉 Accept & Finalize Job Offer"}
                              </span>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Job Offer Accepted Finalized Banner */}
                      {isAccepted && (
                        <div className="mt-2 p-4 rounded-2xl bg-teal-50 border border-teal-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                          <div className="flex items-center space-x-2.5 text-teal-900 font-bold">
                            <CheckCircle2 className="h-5 w-5 text-teal-600 shrink-0" />
                            <div>
                              <span>
                                {isIndonesian
                                  ? "Anda telah menyetujui tawaran kerja ini. Status final dan tidak dapat diubah."
                                  : "You have formally accepted this offer. Status is finalized and irreversible."}
                              </span>
                              {app.offerStartDate && (
                                <p className="text-[11px] font-semibold text-teal-700 mt-0.5">
                                  {isIndonesian ? "Estimasi Bergabung:" : "Expected Start Date:"} {app.offerStartDate}
                                </p>
                              )}
                            </div>
                          </div>
                          <span className="px-3 py-1 bg-white text-teal-800 border border-teal-200 rounded-xl font-extrabold text-[11px] shadow-2xs">
                            ✓ {isIndonesian ? "Resmi Diterima" : "Offer Finalized"}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: JOB DETAIL OVERVIEW */}
      {/* ========================================================================= */}
      {selectedJobForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[88vh] flex flex-col overflow-hidden border border-slate-100 shadow-2xl relative animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 p-5 sm:p-6 pb-4 bg-white shrink-0 gap-3">
              <div className="flex items-start space-x-3 sm:space-x-4 min-w-0">
                <img
                  src={selectedJobForDetail.companyLogo}
                  alt={selectedJobForDetail.companyName}
                  className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl object-cover border border-slate-100 shadow-sm p-1 bg-white shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs sm:text-sm font-extrabold text-slate-800 truncate">
                      {selectedJobForDetail.companyName}
                    </span>
                    <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0" />
                  </div>
                  <h2 className="text-base sm:text-xl font-extrabold text-slate-900 mt-0.5 truncate">
                    {selectedJobForDetail.title}
                  </h2>
                  <p className="text-[11px] sm:text-xs font-bold text-slate-500 mt-0.5 truncate">
                    {selectedJobForDetail.department} • Dipasang oleh HR {selectedJobForDetail.recruiterName}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedJobForDetail(null)}
                className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Body with custom-scrollbar */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-5 sm:p-6 space-y-5">
              {/* Quick Meta Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                <div className="bg-slate-50 p-2.5 sm:p-3 rounded-2xl border border-slate-100">
                  <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    {isIndonesian ? "Tipe Kerja" : "Workplace"}
                  </div>
                  <div className="text-xs font-bold text-slate-800 mt-0.5">
                    {selectedJobForDetail.workplaceType}
                  </div>
                </div>
                <div className="bg-slate-50 p-2.5 sm:p-3 rounded-2xl border border-slate-100">
                  <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    {isIndonesian ? "Kontrak" : "Employment"}
                  </div>
                  <div className="text-xs font-bold text-slate-800 mt-0.5">
                    {selectedJobForDetail.employmentType}
                  </div>
                </div>
                <div className="bg-slate-50 p-2.5 sm:p-3 rounded-2xl border border-slate-100">
                  <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    {isIndonesian ? "Jenjang" : "Level"}
                  </div>
                  <div className="text-xs font-bold text-slate-800 mt-0.5">
                    {selectedJobForDetail.experienceLevel}
                  </div>
                </div>
                <div className="bg-blue-50/60 p-2.5 sm:p-3 rounded-2xl border border-blue-100">
                  <div className="text-[10px] font-extrabold text-blue-700 uppercase tracking-wider">
                    {isIndonesian ? "Gaji Ditawarkan" : "Offered Salary"}
                  </div>
                  <div className="text-xs font-extrabold text-blue-900 mt-0.5 truncate">
                    {selectedJobForDetail.salaryFormatted}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                  {isIndonesian ? "Deskripsi Pekerjaan" : "Job Description"}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {selectedJobForDetail.description}
                </p>
              </div>

              {/* Responsibilities */}
              {selectedJobForDetail.responsibilities && selectedJobForDetail.responsibilities.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                    {isIndonesian ? "Tanggung Jawab Utama" : "Key Responsibilities"}
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {selectedJobForDetail.responsibilities.map((resp, rIdx) => (
                      <li key={rIdx} className="flex items-start space-x-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Requirements */}
              {selectedJobForDetail.requirements && selectedJobForDetail.requirements.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                    {isIndonesian ? "Kualifikasi & Persyaratan" : "Qualifications & Requirements"}
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {selectedJobForDetail.requirements.map((req, qIdx) => (
                      <li key={qIdx} className="flex items-start space-x-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Benefits */}
              {selectedJobForDetail.benefits && selectedJobForDetail.benefits.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                    {isIndonesian ? "Benefit & Fasilitas" : "Benefits & Perks"}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedJobForDetail.benefits.map((ben, bIdx) => (
                      <div
                        key={bIdx}
                        className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-700 flex items-center space-x-2"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span>{ben}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              {selectedJobForDetail.skills && selectedJobForDetail.skills.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                    {isIndonesian ? "Keahlian & Teknologi Terkait" : "Required Skills & Tech Stack"}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedJobForDetail.skills.map((sk, skIdx) => (
                      <span
                        key={skIdx}
                        className="px-3 py-1 rounded-xl text-xs font-bold bg-blue-50 text-blue-800 border border-blue-100"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons Footer */}
            <div className="border-t border-slate-100 p-4 sm:p-5 bg-slate-50 shrink-0 flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3">
              <button
                onClick={() => setSelectedJobForDetail(null)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer text-center"
              >
                {isIndonesian ? "Tutup" : "Close"}
              </button>

              {hasAppliedForJob(selectedJobForDetail.id) ? (
                <span className="w-full sm:w-auto px-5 py-2.5 rounded-2xl text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>{isIndonesian ? "Sudah Mengirim Lamaran" : "Already Applied"}</span>
                </span>
              ) : (
                <button
                  id="modal-detail-apply-btn"
                  onClick={() => {
                    const job = selectedJobForDetail;
                    setSelectedJobForDetail(null);
                    handleInitiateApply(job);
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-2xl text-xs font-extrabold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-xs cursor-pointer flex items-center justify-center space-x-2"
                >
                  <span>{isIndonesian ? "Lamar Posisi Ini Sekarang" : "Apply for this Position"}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: APPLICATION SUBMISSION */}
      {/* ========================================================================= */}
      {selectedJobForApply && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[88vh] flex flex-col overflow-hidden border border-slate-100 shadow-2xl relative animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 p-5 sm:p-6 pb-4 bg-white shrink-0 gap-3">
              <div className="min-w-0">
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-extrabold border border-blue-100">
                  {isIndonesian ? "Formulir Lamaran Pekerjaan" : "Job Application Form"}
                </span>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-2 truncate">
                  {selectedJobForApply.title}
                </h2>
                <p className="text-xs font-bold text-slate-500 truncate">
                  {selectedJobForApply.companyName} • {selectedJobForApply.location} ({selectedJobForApply.workplaceType})
                </p>
              </div>

              <button
                onClick={() => setSelectedJobForApply(null)}
                className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Application Form */}
            <form onSubmit={handleApplySubmit} className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto custom-scrollbar p-5 sm:p-6 space-y-4">
                {/* Candidate Preloaded Data Summary Card */}
                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-100 space-y-2">
                  <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    {isIndonesian ? "Data Pelamar (Otomatis dari Profil Terverifikasi)" : "Applicant Info (Synced from Profile)"}
                  </div>
                  <div className="flex items-center space-x-3">
                    <img
                      src={getProfileAvatar(activeCandidate.avatar)}
                      alt={activeCandidate.fullName}
                      className="h-10 w-10 rounded-xl object-cover border border-white shadow-xs shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = DEFAULT_PROFILE_IMAGE;
                      }}
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-extrabold text-slate-800 flex items-center gap-1">
                        <span className="truncate">{activeCandidate.fullName}</span>
                        <ShieldCheck className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                      </div>
                      <div className="text-[11px] font-semibold text-slate-500 truncate">
                        {activeCandidate.email} • {activeCandidate.phone}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Feedback Alerts */}
                {applySuccessMsg && (
                  <div className="bg-emerald-50 text-emerald-800 p-3.5 sm:p-4 rounded-2xl border border-emerald-200 text-xs font-bold flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>{applySuccessMsg}</span>
                  </div>
                )}

                {applyErrorMsg && (
                  <div className="bg-red-50 text-red-800 p-3.5 sm:p-4 rounded-2xl border border-red-200 text-xs font-bold flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
                    <span>{applyErrorMsg}</span>
                  </div>
                )}

                {/* Expected Salary Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-700">
                    {isIndonesian ? "Ekspektasi Gaji / Bulan" : "Expected Monthly Salary"}
                  </label>
                  <input
                    type="text"
                    id="apply-expected-salary"
                    value={applyExpectedSalary}
                    onChange={(e) => setApplyExpectedSalary(e.target.value)}
                    placeholder="Contoh: Rp 28.000.000 / bulan"
                    className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    required
                  />
                </div>

                {/* Portfolio / Website Link */}
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-700">
                    {isIndonesian ? "Tautan Portofolio / GitHub / LinkedIn" : "Portfolio / GitHub / LinkedIn URL"}
                  </label>
                  <input
                    type="text"
                    id="apply-portfolio-url"
                    value={applyPortfolioUrl}
                    onChange={(e) => setApplyPortfolioUrl(e.target.value)}
                    placeholder="https://alexrivera.dev"
                    className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  />
                </div>

                {/* Cover Note Pitch */}
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <label className="text-xs font-extrabold text-slate-700">
                      {isIndonesian ? "Surat Pengantar Singkat / Pesan ke HR" : "Quick Pitch / Message to HR"}
                    </label>
                    {/* Quick template helpers */}
                    <div className="flex items-center space-x-1">
                      <button
                        type="button"
                        onClick={() => fillCoverTemplate("fullstack")}
                        className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors cursor-pointer"
                      >
                        + Full Stack
                      </button>
                      <button
                        type="button"
                        onClick={() => fillCoverTemplate("frontend")}
                        className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors cursor-pointer"
                      >
                        + Frontend
                      </button>
                    </div>
                  </div>
                  <textarea
                    id="apply-cover-note"
                    rows={4}
                    value={applyCoverNote}
                    onChange={(e) => setApplyCoverNote(e.target.value)}
                    placeholder={
                      isIndonesian
                        ? "Jelaskan secara ringkas mengapa Anda adalah kandidat yang paling cocok untuk posisi ini..."
                        : "Briefly explain why your technical expertise aligns with this role..."
                    }
                    className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none"
                    required
                  />
                </div>

                {/* Share Profile Checkbox */}
                <div className="flex items-start space-x-2 pt-1">
                  <input
                    type="checkbox"
                    id="share-profile-checkbox"
                    checked={applyShareProfile}
                    onChange={(e) => setApplyShareProfile(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer shrink-0"
                    required
                  />
                  <label
                    htmlFor="share-profile-checkbox"
                    className="text-xs font-semibold text-slate-600 cursor-pointer"
                  >
                    {isIndonesian
                      ? "Sertakan skor ATS, sertifikat terverifikasi, dan portofolio saya untuk langsung ditinjau oleh HR."
                      : "Include my verified ATS score, certificates, and portfolio projects for direct HR evaluation."}
                  </label>
                </div>
              </div>

              {/* Submit Action Buttons Footer */}
              <div className="border-t border-slate-100 p-4 sm:p-5 bg-slate-50 shrink-0 flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedJobForApply(null)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-2xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors cursor-pointer text-center"
                >
                  {isIndonesian ? "Batal" : "Cancel"}
                </button>

                <button
                  type="submit"
                  id="submit-job-application-btn"
                  disabled={isSubmittingApp}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-2xl text-xs font-extrabold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-xs cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isSubmittingApp ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>{isIndonesian ? "Mengirimkan Lamaran..." : "Submitting..."}</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>{isIndonesian ? "Kirim Lamaran ke HR" : "Send Application to HR"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: AUTHENTICATION / CANDIDATE ACCOUNT REQUIRED */}
      {/* ========================================================================= */}
      {authPromptModal && authPromptModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-md w-full border border-slate-100 shadow-2xl p-6 sm:p-7 space-y-5 text-center">
            <div className="h-14 w-14 rounded-3xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center border border-blue-100 shadow-2xs">
              {authPromptModal.reason === "recruiter_role" ? (
                <UserCheck className="h-7 w-7 text-amber-600" />
              ) : (
                <Lock className="h-7 w-7 text-blue-600" />
              )}
            </div>

            <div className="space-y-2">
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                {authPromptModal.reason === "recruiter_role"
                  ? isIndonesian ? "Akun Kandidat Diperlukan" : "Candidate Account Required"
                  : isIndonesian ? "Login Diperlukan untuk Melamar" : "Sign In Required to Apply"}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                {authPromptModal.reason === "recruiter_role"
                  ? isIndonesian
                    ? `Anda saat ini masuk sebagai Perekrut (HR). Hanya akun Kandidat atau Pencari Kerja yang dapat mengirimkan lamaran untuk posisi "${authPromptModal.jobTitle}".`
                    : `You are currently logged in as a Recruiter. Only Candidate accounts can submit job applications for "${authPromptModal.jobTitle}".`
                  : isIndonesian
                    ? `Untuk melamar posisi "${authPromptModal.jobTitle}" dan mengirimkan profil serta berkas CV terverifikasi Anda ke tim HR, silakan masuk ke akun Kandidat Anda terlebih dahulu.`
                    : `To apply for "${authPromptModal.jobTitle}" and submit your verified credentials to HR, please sign in to your Candidate account first.`}
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              {authPromptModal.reason === "recruiter_role" ? (
                <button
                  id="auth-prompt-switch-btn"
                  onClick={() => {
                    setAuthPromptModal(null);
                    onNavigateToTab?.("login");
                  }}
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-extrabold transition-all shadow-xs cursor-pointer flex items-center justify-center space-x-2"
                >
                  <LogIn className="h-4 w-4" />
                  <span>{isIndonesian ? "Ganti ke Akun Kandidat" : "Switch to Candidate Account"}</span>
                </button>
              ) : (
                <>
                  <button
                    id="auth-prompt-login-btn"
                    onClick={() => {
                      setAuthPromptModal(null);
                      onNavigateToTab?.("login");
                    }}
                    className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-extrabold transition-all shadow-xs cursor-pointer flex items-center justify-center space-x-2"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>{isIndonesian ? "Masuk ke Akun Sekarang" : "Sign In to Account"}</span>
                  </button>
                  <button
                    id="auth-prompt-register-btn"
                    onClick={() => {
                      setAuthPromptModal(null);
                      onNavigateToTab?.("register");
                    }}
                    className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 text-slate-800 rounded-2xl text-xs font-bold transition-all border border-slate-200 cursor-pointer"
                  >
                    <span>{isIndonesian ? "Daftar Akun Kandidat Baru" : "Create New Candidate Account"}</span>
                  </button>
                </>
              )}

              <button
                id="auth-prompt-close-btn"
                onClick={() => setAuthPromptModal(null)}
                className="w-full py-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                {isIndonesian ? "Nanti Saja / Tutup" : "Dismiss / Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
