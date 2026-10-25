/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  Briefcase,
  Plus,
  Users,
  Eye,
  CheckCircle2,
  Clock,
  MapPin,
  Banknote,
  Building2,
  Trash2,
  Edit3,
  Calendar,
  Send,
  X,
  Search,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  FileText,
  ShieldCheck,
  Check,
  Award,
  Mail,
  Phone,
  Globe,
  Github,
  Linkedin,
  Video,
  RotateCcw,
  FileCheck2,
  UserCheck,
  XCircle
} from "lucide-react";
import { JobOpening, JobApplication, Recruiter, Candidate, DEFAULT_PROFILE_IMAGE, getProfileAvatar } from "../types";
import { useLanguage } from "../context/LanguageContext";
import { MOCK_CANDIDATES } from "../data/mockData";
import { downloadCandidateCv } from "../utils/generatePdfCv";

interface RecruiterJobManagementViewProps {
  recruiter: Recruiter;
}

export default function RecruiterJobManagementView({
  recruiter
}: RecruiterJobManagementViewProps) {
  const { isIndonesian, formatCurrency } = useLanguage();

  const [jobs, setJobs] = useState<JobOpening[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState<boolean>(true);
  const [activeJobForApplicants, setActiveJobForApplicants] = useState<JobOpening | null>(null);
  const [applicants, setApplicants] = useState<JobApplication[]>([]);
  const [isLoadingApplicants, setIsLoadingApplicants] = useState<boolean>(false);

  // New Job Modal State
  const [isCreatingJob, setIsCreatingJob] = useState<boolean>(false);
  const [filterJobType, setFilterJobType] = useState<string>("all");
  const [formTitle, setFormTitle] = useState<string>("");
  const [formDepartment, setFormDepartment] = useState<string>("Engineering");
  const [formLocation, setFormLocation] = useState<string>(recruiter.location || "Jakarta, Indonesia");
  const [formWorkplace, setFormWorkplace] = useState<"Remote" | "Hybrid" | "Onsite">("Hybrid");
  const [formEmployment, setFormEmployment] = useState<"Full-time" | "Contract" | "Part-time" | "Internship" | "Freelance">("Full-time");
  const [formExperience, setFormExperience] = useState<"Entry" | "Junior" | "Mid-level" | "Senior" | "Lead">("Mid-level");
  const [formSalary, setFormSalary] = useState<string>("Rp 20.000.000 - Rp 30.000.000 / bulan");
  const [formDescription, setFormDescription] = useState<string>("");
  const [formResponsibilities, setFormResponsibilities] = useState<string>(
    "Merancang dan mengembangkan modul aplikasi berkinerja tinggi\nBerkolaborasi dengan tim produk dan desainer UI/UX\nMenulis kode yang bersih, terdokumentasi, dan teruji secara otomatis"
  );
  const [formRequirements, setFormRequirements] = useState<string>(
    "3+ tahun pengalaman di bidang terkait\nKemahiran mendalam pada stack teknologi yang relevan\nKemampuan komunikasi tim dan pemecahan masalah yang baik"
  );
  const [formBenefits, setFormBenefits] = useState<string>(
    "Asuransi Kesehatan & Gigi\nTunjangan Pengembangan Diri & Kursus\nJam Kerja Fleksibel & Tunjangan WFH"
  );
  const [formSkills, setFormSkills] = useState<string>("React, TypeScript, Node.js, Tailwind CSS");
  const [isSubmittingJob, setIsSubmittingJob] = useState<boolean>(false);
  const [formSuccessMsg, setFormSuccessMsg] = useState<string | null>(null);
  const [formErrorMsg, setFormErrorMsg] = useState<string | null>(null);

  // ---------------------------------------------------------------------------
  // INTERVIEW SCHEDULING MODAL STATE
  // ---------------------------------------------------------------------------
  const [schedulingApp, setSchedulingApp] = useState<JobApplication | null>(null);
  const [interviewDateVal, setInterviewDateVal] = useState<string>("");
  const [interviewTimeVal, setInterviewTimeVal] = useState<string>("14:00");
  const [interviewMeetLink, setInterviewMeetLink] = useState<string>("");
  const [interviewNotes, setInterviewNotes] = useState<string>("");
  const [isSubmittingInterview, setIsSubmittingInterview] = useState<boolean>(false);

  // ---------------------------------------------------------------------------
  // JOB OFFER MODAL STATE
  // ---------------------------------------------------------------------------
  const [offeringApp, setOfferingApp] = useState<JobApplication | null>(null);
  const [offerSalaryVal, setOfferSalaryVal] = useState<string>("");
  const [offerStartDate, setOfferStartDate] = useState<string>("");
  const [offerNotes, setOfferNotes] = useState<string>("");
  const [isSubmittingOffer, setIsSubmittingOffer] = useState<boolean>(false);

  // ---------------------------------------------------------------------------
  // CANDIDATE CV & DOSSIER VIEWER MODAL STATE
  // ---------------------------------------------------------------------------
  const [viewingCandidateApp, setViewingCandidateApp] = useState<JobApplication | null>(null);
  const [viewingCandidateProfile, setViewingCandidateProfile] = useState<Candidate | null>(null);
  const [isLoadingCandidateProfile, setIsLoadingCandidateProfile] = useState<boolean>(false);
  const [isDownloadingCv, setIsDownloadingCv] = useState<boolean>(false);

  const handleDownloadViewingCv = async () => {
    if (!viewingCandidateApp) return;
    setIsDownloadingCv(true);
    try {
      await downloadCandidateCv(viewingCandidateApp, viewingCandidateProfile, isIndonesian);
      showToast(
        isIndonesian ? "Berkas PDF CV berhasil diunduh!" : "Candidate PDF CV downloaded successfully!",
        "success"
      );
    } catch (err) {
      console.error("Failed to generate/download candidate CV:", err);
      showToast(
        isIndonesian ? "Gagal mengunduh berkas CV. Silakan coba lagi." : "Failed to download CV. Please try again.",
        "error"
      );
    } finally {
      setIsDownloadingCv(false);
    }
  };

  // Toast feedback message
  const [toastMsg, setToastMsg] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);

  const showToast = (text: string, type: "success" | "error" | "info" = "success") => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Fetch Jobs
  const fetchRecruiterJobs = async () => {
    setIsLoadingJobs(true);
    try {
      const res = await fetch("/api/recruiters/jobs");
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs || []);
        if (data.jobs && data.jobs.length > 0 && !activeJobForApplicants) {
          setActiveJobForApplicants(data.jobs[0]);
        }
      }
    } catch (err) {
      console.error("Failed to fetch recruiter jobs:", err);
    } finally {
      setIsLoadingJobs(false);
    }
  };

  // Fetch Applicants for active job
  const fetchApplicantsForJob = async (jobId: string) => {
    setIsLoadingApplicants(true);
    try {
      const res = await fetch(`/api/recruiters/jobs/${jobId}/applicants`);
      if (res.ok) {
        const data = await res.json();
        setApplicants(data.applications || []);
      }
    } catch (err) {
      console.error("Failed to fetch applicants:", err);
    } finally {
      setIsLoadingApplicants(false);
    }
  };

  useEffect(() => {
    fetchRecruiterJobs();
  }, []);

  useEffect(() => {
    if (activeJobForApplicants) {
      fetchApplicantsForJob(activeJobForApplicants.id);
    }
  }, [activeJobForApplicants]);

  // Handle Application Status Update
  const handleUpdateStatus = async (
    appId: string,
    newStatus: "applied" | "reviewing" | "interview" | "offered" | "rejected",
    interviewDate?: string,
    meetLink?: string
  ) => {
    try {
      const res = await fetch(`/api/recruiters/applications/${appId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, interviewDate, meetLink }),
      });

      if (res.ok) {
        setApplicants((prev) =>
          prev.map((a) =>
            a.id === appId
              ? {
                  ...a,
                  status: newStatus,
                  interviewDate: interviewDate !== undefined ? interviewDate : a.interviewDate,
                  meetLink: meetLink !== undefined ? meetLink : a.meetLink,
                }
              : a
          )
        );

        if (viewingCandidateApp && viewingCandidateApp.id === appId) {
          setViewingCandidateApp((prev) =>
            prev
              ? {
                  ...prev,
                  status: newStatus,
                  interviewDate: interviewDate !== undefined ? interviewDate : prev.interviewDate,
                  meetLink: meetLink !== undefined ? meetLink : prev.meetLink,
                }
              : null
          );
        }
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  // ---------------------------------------------------------------------------
  // OPEN CANDIDATE CV & DOSSIER MODAL
  // When clicked, updates status to "reviewing" if it was "applied", and opens full CV!
  // ---------------------------------------------------------------------------
  const handleOpenCandidateCV = async (app: JobApplication, autoMarkReviewing: boolean = true) => {
    if (autoMarkReviewing && app.status === "applied") {
      await handleUpdateStatus(app.id, "reviewing");
      app = { ...app, status: "reviewing" };
    }

    setViewingCandidateApp(app);
    setIsLoadingCandidateProfile(true);

    try {
      // 1. Try to fetch from /api/candidates/profile/:id
      const res = await fetch(`/api/candidates/profile/${app.candidateId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.candidate) {
          setViewingCandidateProfile(data.candidate);
          setIsLoadingCandidateProfile(false);
          return;
        }
      }

      // 2. Fallback to /api/candidates/all
      const resAll = await fetch("/api/candidates/all");
      if (resAll.ok) {
        const dataAll = await resAll.json();
        const found = (dataAll.candidates || []).find((c: Candidate) => c.id === app.candidateId || c.fullName === app.candidateName);
        if (found) {
          setViewingCandidateProfile(found);
          setIsLoadingCandidateProfile(false);
          return;
        }
      }

      // 3. Fallback to mock data
      const mockFound = MOCK_CANDIDATES.find((c) => c.id === app.candidateId || c.fullName === app.candidateName);
      if (mockFound) {
        setViewingCandidateProfile(mockFound);
      } else {
        // Construct fallback candidate profile from application record
        setViewingCandidateProfile({
          id: app.candidateId,
          fullName: app.candidateName,
          email: app.candidateEmail,
          phone: app.candidatePhone || "+62 812-3456-7890",
          headline: app.candidateHeadline || "Professional Candidate",
          aboutMe: app.coverNote || "Kandidat berpengalaman dengan motivasi tinggi untuk bergabung dan memberikan kontribusi terbaik bagi perusahaan.",
          location: "Jakarta, Indonesia",
          nationality: "Indonesian",
          avatar: app.candidateAvatar || DEFAULT_PROFILE_IMAGE,
          expectedSalary: app.expectedSalary || "Rp 20.000.000 / bulan",
          availability: "Immediate",
          employmentType: ["Full-time"],
          preferredLocation: "Jakarta / Remote",
          openToWork: true,
          remote: true,
          hybrid: true,
          onsite: false,
          relocation: true,
          profileCompletion: 95,
          verified: true,
          atsScore: 92,
          resumeUrl: app.resumeUrl,
          portfolioUrl: app.portfolioUrl,
          skills: [
            { id: "sk_1", name: "React", level: 3 as any, yearsOfExperience: 4, category: "Programming" as any, endorsements: 18 },
            { id: "sk_2", name: "TypeScript", level: 3 as any, yearsOfExperience: 4, category: "Programming" as any, endorsements: 14 },
            { id: "sk_3", name: "Node.js", level: 2 as any, yearsOfExperience: 3, category: "Programming" as any, endorsements: 11 },
          ],
          experience: [
            {
              id: "exp_1",
              company: "Tech Enterprise",
              position: "Software Engineer",
              employmentType: "Full-time",
              startDate: "2023-01",
              endDate: "Present",
              current: true,
              description: "Mengembangkan sistem web berkinerja tinggi",
              responsibilities: [
                "Merancang komponen frontend modular dengan React & TypeScript",
                "Meningkatkan skor Web Vitals dan kecepatan rendering hingga 35%",
              ],
            },
          ],
          education: [
            {
              id: "edu_1",
              institution: "Universitas Indonesia",
              degree: "Sarjana Komputer (S.Kom)",
              fieldOfStudy: "Teknik Informatika",
              startDate: "2018",
              endDate: "2022",
              grade: "3.85 / 4.00",
            },
          ],
          certificates: [
            {
              id: "cert_1",
              name: "Certified Cloud & Frontend Practitioner",
              issuer: "AWS & Global Tech",
              issueDate: "2025-04",
              credentialId: "CERT-99827-ATS",
              verified: true,
            },
          ],
          portfolio: [
            {
              id: "proj_1",
              title: "Enterprise Dashboard Platform",
              description: "Aplikasi dashboard analitik modern dengan real-time metrics",
              thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600",
              link: app.portfolioUrl || "https://example.com/project",
              technologies: ["React", "TypeScript", "Tailwind CSS"],
            },
          ],
        });
      }
    } catch (e) {
      console.error("Error loading candidate profile:", e);
    } finally {
      setIsLoadingCandidateProfile(false);
    }
  };

  // ---------------------------------------------------------------------------
  // OPEN SCHEDULE INTERVIEW MODAL
  // ---------------------------------------------------------------------------
  const handleOpenScheduleModal = (app: JobApplication) => {
    setSchedulingApp(app);
    // Set default tomorrow at 14:00
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split("T")[0];
    setInterviewDateVal(dateStr);
    setInterviewTimeVal("14:00");
    setInterviewMeetLink(app.meetLink || "");
    setInterviewNotes(
      isIndonesian
        ? `Sesi wawancara teknis dan diskusi studi kasus bersama tim perekrut untuk posisi ${app.jobTitle}.`
        : `Technical interview and case study session with the hiring squad for the ${app.jobTitle} position.`
    );
  };

  // SUBMIT INTERVIEW SCHEDULE
  const handleSubmitInterviewSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schedulingApp) return;

    setIsSubmittingInterview(true);
    try {
      const formattedDate = `${interviewDateVal}, ${interviewTimeVal} WIB (Google Meet)`;
      await handleUpdateStatus(schedulingApp.id, "interview", formattedDate, interviewMeetLink);
      showToast(
        isIndonesian
          ? `Jadwal wawancara untuk ${schedulingApp.candidateName} berhasil ditetapkan!`
          : `Interview scheduled successfully for ${schedulingApp.candidateName}!`
      );
      setSchedulingApp(null);
    } catch (err) {
      console.error("Error saving interview schedule:", err);
      showToast(isIndonesian ? "Gagal menyimpan jadwal wawancara." : "Failed to save interview schedule.", "error");
    } finally {
      setIsSubmittingInterview(false);
    }
  };

  // ---------------------------------------------------------------------------
  // OPEN EXTEND JOB OFFER MODAL
  // ---------------------------------------------------------------------------
  const handleOpenOfferModal = (app: JobApplication) => {
    setOfferingApp(app);
    setOfferSalaryVal(app.expectedSalary || (activeJobForApplicants?.salaryFormatted ?? "Rp 25.000.000 / bulan"));
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setOfferStartDate(nextMonth.toISOString().split("T")[0]);
    setOfferNotes(
      isIndonesian
        ? `Selamat! Berdasarkan hasil evaluasi berkas dan kualifikasi profesional Anda, ${recruiter.companyName} dengan bangga menawarkan posisi resmi ${app.jobTitle}.`
        : `Congratulations! Following your dossier evaluation and stellar credentials, ${recruiter.companyName} is thrilled to extend a formal job offer for the ${app.jobTitle} position.`
    );
  };

  // SUBMIT FORMAL JOB OFFER
  const handleSubmitJobOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!offeringApp) return;

    setIsSubmittingOffer(true);
    try {
      await handleUpdateStatus(offeringApp.id, "offered");
      showToast(
        isIndonesian
          ? `Tawaran pekerjaan resmi berhasil dikirimkan kepada ${offeringApp.candidateName}!`
          : `Formal job offer sent successfully to ${offeringApp.candidateName}!`
      );
      setOfferingApp(null);
    } catch (err) {
      console.error("Error sending job offer:", err);
      showToast(isIndonesian ? "Gagal mengirim tawaran pekerjaan." : "Failed to send job offer.", "error");
    } finally {
      setIsSubmittingOffer(false);
    }
  };

  // Handle Create Job Submit
  const handleCreateJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingJob(true);
    setFormErrorMsg(null);

    const responsibilitiesArr = formResponsibilities
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    const requirementsArr = formRequirements
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    const benefitsArr = formBenefits
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    const skillsArr = formSkills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      const res = await fetch("/api/recruiters/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formTitle.trim(),
          department: formDepartment.trim(),
          location: formLocation.trim(),
          workplaceType: formWorkplace,
          employmentType: formEmployment,
          experienceLevel: formExperience,
          salaryFormatted: formSalary.trim(),
          description: formDescription.trim(),
          responsibilities: responsibilitiesArr,
          requirements: requirementsArr,
          benefits: benefitsArr,
          skills: skillsArr,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setFormSuccessMsg(
          isIndonesian ? "Lowongan pekerjaan baru berhasil dipublikasikan!" : "New job opening published successfully!"
        );
        await fetchRecruiterJobs();
        setTimeout(() => {
          setIsCreatingJob(false);
          setFormSuccessMsg(null);
          setFormTitle("");
          setFormDescription("");
        }, 1200);
      } else {
        setFormErrorMsg(data.error || "Gagal membuat lowongan pekerjaan.");
      }
    } catch (err) {
      setFormErrorMsg("Terjadi gangguan jaringan saat memposting lowongan.");
    } finally {
      setIsSubmittingJob(false);
    }
  };

  return (
    <div className="space-y-6" id="recruiter-jobs-management-container">
      {/* Toast Notification */}
      {toastMsg && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-xl border text-xs font-extrabold flex items-center space-x-2 animate-in fade-in slide-in-from-bottom-3 duration-200 ${
            toastMsg.type === "success"
              ? "bg-emerald-600 text-white border-emerald-500"
              : toastMsg.type === "error"
              ? "bg-red-600 text-white border-red-500"
              : "bg-slate-900 text-white border-slate-800"
          }`}
        >
          {toastMsg.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-white" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 text-white" />
          )}
          <span>{toastMsg.text}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-extrabold border border-blue-100 flex items-center gap-1.5 shadow-2xs">
              <Briefcase className="h-3.5 w-3.5 text-blue-600" />
              {isIndonesian ? "Pusat Manajemen Lowongan Kerja HR" : "HR Job Openings & Applicant Management"}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2">
            {isIndonesian ? "Kelola Lowongan & Tinjau Pelamar Masuk" : "Manage Live Postings & Review Inbound Applicants"}
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1 max-w-2xl">
            {isIndonesian
              ? "Pasang lowongan pekerjaan baru yang dapat dicari dan dilamar langsung oleh kandidat bertalenta. Tinjau resume ATS, profil digital, dan atur tahap seleksi secara terstruktur."
              : "Post live openings that verified candidates can discover and apply for directly. Review their ATS resume, digital profile, and advance them through structured selection stages."}
          </p>
        </div>

        <button
          id="btn-open-create-job-modal"
          onClick={() => setIsCreatingJob(true)}
          className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs transition-all shadow-xs shrink-0 cursor-pointer flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>{isIndonesian ? "Pasang Lowongan Baru" : "Post New Job"}</span>
        </button>
      </div>

      {/* Main 2-Column Layout: Left (Job Openings List), Right (Applicants for Selected Job) */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left Column: Job Openings List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">
              {isIndonesian ? `Lowongan Aktif (${jobs.length})` : `Active Openings (${jobs.length})`}
            </h3>
            <button
              onClick={fetchRecruiterJobs}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1 cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>{isIndonesian ? "Segarkan" : "Refresh"}</span>
            </button>
          </div>

          {/* Quick Filter Tabs */}
          {jobs.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {[
                { id: "all", label: isIndonesian ? "Semua" : "All" },
                { id: "Full-time", label: "Full-time" },
                { id: "Internship", label: isIndonesian ? "Magang" : "Internship" },
                { id: "Contract", label: isIndonesian ? "Kontrak" : "Contract" },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilterJobType(f.id)}
                  className={`px-3 py-1.5 rounded-xl font-extrabold transition-all shrink-0 cursor-pointer ${
                    filterJobType === f.id
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {f.label} {f.id === "all" ? `(${jobs.length})` : `(${jobs.filter(j => j.employmentType === f.id).length})`}
                </button>
              ))}
            </div>
          )}

          {isLoadingJobs ? (
            <div className="bg-white rounded-3xl border border-slate-100 p-8 text-center shadow-sm">
              <RefreshCw className="h-6 w-6 text-blue-600 animate-spin mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-500">
                {isIndonesian ? "Memuat data lowongan..." : "Loading jobs..."}
              </p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-100 p-8 text-center shadow-sm space-y-3">
              <div className="h-12 w-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
                <Briefcase className="h-6 w-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">
                {isIndonesian ? "Belum Ada Lowongan Dipasang" : "No Job Openings Posted Yet"}
              </h4>
              <p className="text-xs text-slate-500 font-semibold max-w-xs mx-auto">
                {isIndonesian
                  ? "Klik tombol di atas untuk mulai memasang lowongan pekerjaan atau program magang pertama Anda."
                  : "Click the button above to publish your company's first job or internship opening."}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {jobs
                .filter((j) => filterJobType === "all" || j.employmentType === filterJobType)
                .map((job) => {
                const isSelected = activeJobForApplicants?.id === job.id;

                return (
                  <div
                    key={job.id}
                    id={`recruiter-job-item-${job.id}`}
                    onClick={() => setActiveJobForApplicants(job)}
                    className={`p-5 rounded-3xl border transition-all cursor-pointer text-left relative overflow-hidden ${
                      isSelected
                        ? "bg-blue-50/50 border-blue-300 shadow-sm ring-2 ring-blue-500/20"
                        : "bg-white border-slate-100 hover:border-slate-200 shadow-2xs hover:shadow-xs"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <span className="text-xs font-extrabold text-slate-700">
                            {job.companyName}
                          </span>
                          <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
                        </div>
                        <h4 className="text-sm font-extrabold text-slate-900 mt-0.5">
                          {job.title}
                        </h4>
                        <div className="flex items-center gap-1.5 flex-wrap text-[11px] font-semibold text-slate-500 mt-1">
                          <span>{job.department}</span>
                          <span>•</span>
                          <span>{job.location} ({job.workplaceType})</span>
                          <span>•</span>
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            job.employmentType === "Internship"
                              ? "bg-amber-50 text-amber-800 border border-amber-200"
                              : "bg-slate-100 text-slate-700"
                          }`}>
                            {job.employmentType === "Internship" ? (isIndonesian ? "🎓 Magang / Intern" : "🎓 Internship") : job.employmentType}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold shrink-0 border ${
                          job.status === "active"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-slate-100 text-slate-600 border-slate-200"
                        }`}
                      >
                        {job.status === "active" ? (isIndonesian ? "Aktif" : "Active") : job.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100/80 pt-3 mt-3 text-xs font-bold">
                      <span className="text-blue-800 text-[11px] font-extrabold">
                        {job.salaryFormatted}
                      </span>

                      <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-extrabold flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>
                          {job.applicantCount || 0} {isIndonesian ? "Pelamar" : "Applicants"}
                        </span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Applicants for the Selected Job */}
        <div className="lg:col-span-7 space-y-4">
          {activeJobForApplicants ? (
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                      {isIndonesian ? "Pelamar untuk Posisi:" : "Applicants for:"}
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">
                    {activeJobForApplicants.title}
                  </h3>
                  <p className="text-xs font-bold text-slate-500">
                    {activeJobForApplicants.companyName} • {isIndonesian ? "Dipasang pada" : "Posted on"} {activeJobForApplicants.postedAt}
                  </p>
                </div>

                <span className="px-3 py-1 rounded-2xl bg-blue-50 text-blue-700 text-xs font-extrabold border border-blue-100">
                  {applicants.length} {isIndonesian ? "Total Berkas Masuk" : "Total Applications"}
                </span>
              </div>

              {/* Applicants List */}
              {isLoadingApplicants ? (
                <div className="p-8 text-center">
                  <RefreshCw className="h-6 w-6 text-blue-600 animate-spin mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-500">
                    {isIndonesian ? "Memuat berkas pelamar..." : "Loading applicant applications..."}
                  </p>
                </div>
              ) : applicants.length === 0 ? (
                <div className="p-8 text-center space-y-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <Users className="h-8 w-8 text-slate-400 mx-auto" />
                  <h4 className="text-sm font-bold text-slate-800">
                    {isIndonesian ? "Belum Ada Pelamar Masuk" : "No Candidates Applied Yet"}
                  </h4>
                  <p className="text-xs text-slate-500 font-semibold max-w-sm mx-auto">
                    {isIndonesian
                      ? "Lowongan ini sudah aktif di portal pencarian kerja kandidat. Pelamar baru akan muncul di sini secara otomatis."
                      : "This opening is live in the candidate job search portal. Inbound applications will appear here automatically."}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {applicants.map((app) => {
                    const isRejected = app.status === "rejected";
                    const isOffered = app.status === "offered";
                    const isAccepted = app.status === "accepted";
                    const isInterview = app.status === "interview";
                    const isReviewing = app.status === "reviewing";
                    const isApplied = app.status === "applied";

                    // 30-day review SLA calculation
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
                      rejected: isExpired ? "bg-stone-100 text-stone-600 border-stone-200" : "bg-red-50 text-red-600 border-red-200",
                    };

                    const statusLabelMap: Record<string, string> = {
                      applied: isIndonesian ? "Lamaran Baru" : "New Application",
                      reviewing: isIndonesian ? "Sedang Ditinjau" : "Under Review",
                      interview: isIndonesian ? "Wawancara" : "Interview",
                      offered: isIndonesian ? "Penawaran Kerja" : "Job Offer",
                      accepted: isIndonesian ? "🎉 Tawaran Diterima" : "🎉 Offer Accepted",
                      rejected: isExpired
                        ? isIndonesian ? "Kadaluarsa (30 Hari)" : "Expired (30 Days Limit)"
                        : isIndonesian ? "Ditolak (Final)" : "Rejected (Final)",
                    };

                    return (
                      <div
                        key={app.id}
                        id={`applicant-card-${app.id}`}
                        className={`p-5 rounded-2xl border transition-all space-y-3 ${
                          isRejected
                            ? "bg-slate-50/80 border-slate-200 opacity-80"
                            : isAccepted
                            ? "bg-teal-50/30 border-teal-200 shadow-2xs"
                            : isOffered
                            ? "bg-emerald-50/30 border-emerald-200"
                            : "bg-slate-50/50 hover:bg-white hover:border-slate-200 hover:shadow-xs border-slate-100"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <div className="flex items-center space-x-3">
                            <img
                              src={getProfileAvatar(app.candidateAvatar)}
                              alt={app.candidateName}
                              className="h-11 w-11 rounded-xl object-cover border border-white shadow-2xs shrink-0"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = DEFAULT_PROFILE_IMAGE;
                              }}
                            />
                            <div>
                              <div className="flex items-center space-x-1.5">
                                <h4 className="text-sm font-extrabold text-slate-900">
                                  {app.candidateName}
                                </h4>
                                <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
                              </div>
                              <p className="text-[11px] font-semibold text-slate-500">
                                {app.candidateEmail} • {app.candidatePhone}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            {/* 30-Day SLA Review Indicator for Pending / Reviewing Applications */}
                            {(isApplied || isReviewing) && !isExpired && (
                              <span
                                className={`inline-flex items-center text-[10px] font-extrabold px-2.5 py-1 rounded-full border shadow-2xs ${
                                  daysRemaining <= 5
                                    ? "bg-amber-100 text-amber-900 border-amber-300"
                                    : "bg-slate-100 text-slate-700 border-slate-200"
                                }`}
                                title={
                                  isIndonesian
                                    ? `Batas waktu peninjauan HR adalah 30 hari sejak lamaran diajukan. Sisa waktu: ${daysRemaining} hari.`
                                    : `HR review SLA limit is 30 days from application date. ${daysRemaining} days remaining.`
                                }
                              >
                                <Clock className="h-3 w-3 mr-1 text-slate-500" />
                                <span>
                                  {isIndonesian
                                    ? daysRemaining <= 5
                                      ? `⚠️ Sisa ${daysRemaining} hari review`
                                      : `SLA HR: ${daysRemaining} hari lagi`
                                    : daysRemaining <= 5
                                    ? `⚠️ ${daysRemaining} days SLA left`
                                    : `SLA: ${daysRemaining} days left`}
                                </span>
                              </span>
                            )}

                            <span
                              className={`px-3 py-1 rounded-full text-[11px] font-extrabold border flex items-center space-x-1 shadow-2xs ${
                                statusColorMap[app.status] || "bg-slate-100 text-slate-700"
                              }`}
                            >
                              <span>{statusLabelMap[app.status] || app.status}</span>
                            </span>
                          </div>
                        </div>

                        {/* Cover Note & Pitch */}
                        {app.coverNote && (
                          <div className="bg-white p-3 rounded-xl border border-slate-100 text-xs text-slate-700 italic">
                            "{app.coverNote}"
                          </div>
                        )}

                        {/* Interview Details Badge (If Scheduled) */}
                        {app.interviewDate && (
                          <div className="p-3 bg-purple-50/70 border border-purple-100 rounded-xl flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-purple-900">
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-purple-600 shrink-0" />
                              <span>
                                {isIndonesian ? "Jadwal Wawancara:" : "Scheduled Interview:"} {app.interviewDate}
                              </span>
                            </div>
                            {app.meetLink && (
                              <a
                                href={app.meetLink}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center text-[11px] font-extrabold text-purple-700 bg-white hover:bg-purple-100 border border-purple-200 px-2.5 py-1 rounded-lg transition-colors"
                              >
                                <Video className="h-3.5 w-3.5 mr-1 text-purple-600" />
                                <span>{isIndonesian ? "Buka Google Meet" : "Join Meet"}</span>
                              </a>
                            )}
                          </div>
                        )}

                        {/* Meta Tags: Salary, Portfolio, Date */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100 text-xs font-bold text-slate-600">
                          <div className="flex items-center space-x-3">
                            <span className="flex items-center text-slate-700">
                              <Banknote className="h-3.5 w-3.5 text-emerald-600 mr-1" />
                              {app.expectedSalary}
                            </span>

                            {app.portfolioUrl && (
                              <a
                                href={app.portfolioUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center text-blue-600 hover:underline text-[11px]"
                              >
                                <ExternalLink className="h-3 w-3 mr-1" />
                                <span>{isIndonesian ? "Portofolio" : "Portfolio"}</span>
                              </a>
                            )}
                          </div>

                          <div className="flex items-center space-x-2 text-[11px] font-semibold text-slate-400">
                            <span>
                              {isIndonesian ? "Melamar pada" : "Applied"} {app.appliedAt}
                            </span>
                            {app.expiresAt && (
                              <span title={isIndonesian ? "Batas akhir review HR (30 hari)" : "HR review expiration (30 days)"}>
                                • {isIndonesian ? "Batas Review:" : "Review SLA:"} {app.expiresAt}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Stage Controls with Strict Business & Accessibility Rules */}
                        <div className="flex flex-wrap items-center justify-end gap-1.5 pt-2 border-t border-slate-100">
                          {/* 1. BUTTON: MARK FOR REVIEW / BUKA CV */}
                          <button
                            disabled={isRejected || isOffered || isAccepted || isInterview || isExpired}
                            onClick={() => handleOpenCandidateCV(app, true)}
                            title={
                              isRejected || isExpired
                                ? isIndonesian ? "Lamaran telah ditolak atau kadaluarsa" : "Application is rejected or expired"
                                : isAccepted
                                ? isIndonesian ? "Kandidat telah menerima tawaran kerja resmi" : "Candidate accepted formal job offer"
                                : isOffered
                                ? isIndonesian ? "Kandidat telah menerima tawaran" : "Offer already extended"
                                : isInterview
                                ? isIndonesian ? "Kandidat sedang dalam tahap wawancara" : "Candidate in interview stage"
                                : isIndonesian ? "Tandai berkas sedang ditinjau dan buka CV kandidat" : "Mark as under review and open candidate CV"
                            }
                            className={`px-3 py-1.5 rounded-xl text-[11px] font-extrabold transition-all flex items-center space-x-1.5 ${
                              isReviewing
                                ? "bg-blue-600 text-white shadow-2xs cursor-pointer hover:bg-blue-700"
                                : isRejected || isOffered || isAccepted || isInterview || isExpired
                                ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-50"
                                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 cursor-pointer shadow-2xs"
                            }`}
                          >
                            <FileText className="h-3.5 w-3.5" />
                            <span>{isIndonesian ? "Review Berkas & CV" : "Review File & CV"}</span>
                          </button>

                          {/* 2. BUTTON: SCHEDULE INTERVIEW */}
                          <button
                            disabled={isRejected || isOffered || isAccepted || isExpired}
                            onClick={() => handleOpenScheduleModal(app)}
                            title={
                              isRejected || isExpired
                                ? isIndonesian ? "Lamaran telah ditolak atau kadaluarsa" : "Application is rejected or expired"
                                : isAccepted
                                ? isIndonesian ? "Kandidat telah menerima tawaran kerja resmi" : "Offer already accepted"
                                : isOffered
                                ? isIndonesian ? "Tawaran kerja telah diberikan" : "Job offer already made"
                                : isIndonesian ? "Atur jadwal wawancara langsung" : "Schedule direct interview"
                            }
                            className={`px-3 py-1.5 rounded-xl text-[11px] font-extrabold transition-all flex items-center space-x-1.5 ${
                              isInterview
                                ? "bg-purple-600 text-white shadow-2xs cursor-pointer hover:bg-purple-700"
                                : isRejected || isOffered || isAccepted || isExpired
                                ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-50"
                                : "bg-white text-purple-700 hover:bg-purple-50 border border-purple-200 cursor-pointer shadow-2xs"
                            }`}
                          >
                            <Calendar className="h-3.5 w-3.5" />
                            <span>
                              {isInterview
                                ? isIndonesian ? "Ubah Jadwal Interview" : "Reschedule Interview"
                                : isIndonesian ? "Jadwalkan Interview" : "Schedule Interview"}
                            </span>
                          </button>

                          {/* 3. BUTTON: MAKE / EXTEND JOB OFFER */}
                          <button
                            disabled={isRejected || isOffered || isAccepted || isExpired}
                            onClick={() => handleOpenOfferModal(app)}
                            title={
                              isRejected || isExpired
                                ? isIndonesian ? "Lamaran telah ditolak, tidak dapat memberi tawaran" : "Application rejected, cannot make offer"
                                : isAccepted
                                ? isIndonesian ? "Kandidat telah menerima tawaran kerja resmi" : "Offer already accepted by candidate"
                                : isOffered
                                ? isIndonesian ? "Tawaran resmi telah terkirim" : "Formal offer already extended"
                                : isIndonesian ? "Kirimkan penawaran pekerjaan resmi" : "Extend formal job offer"
                            }
                            className={`px-3 py-1.5 rounded-xl text-[11px] font-extrabold transition-all flex items-center space-x-1.5 ${
                              isAccepted
                                ? "bg-teal-600 text-white shadow-2xs cursor-default"
                                : isOffered
                                ? "bg-emerald-600 text-white shadow-2xs cursor-default"
                                : isRejected || isExpired
                                ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-50"
                                : "bg-white text-emerald-700 hover:bg-emerald-50 border border-emerald-200 cursor-pointer shadow-2xs"
                            }`}
                          >
                            <Award className="h-3.5 w-3.5" />
                            <span>
                              {isAccepted
                                ? isIndonesian ? "✓ Tawaran Diterima Kandidat" : "✓ Offer Accepted"
                                : isOffered
                                ? isIndonesian ? "✓ Tawaran Diberikan" : "✓ Offer Extended"
                                : isIndonesian ? "Beri Tawaran Kerja" : "Make Job Offer"}
                            </span>
                          </button>

                          {/* 4. BUTTON: REJECT / TOLAK (Disabled when Offered/Accepted, Irreversible once Rejected) */}
                          {isRejected || isExpired ? (
                            <button
                              disabled
                              title={
                                isExpired
                                  ? isIndonesian ? "Lamaran telah kadaluarsa melewati batas waktu 30 hari" : "Application expired past 30-day limit"
                                  : isIndonesian ? "Keputusan penolakan bersifat final dan tidak dapat diubah" : "Rejection is final and irreversible"
                              }
                              className="px-3 py-1.5 rounded-xl text-[11px] font-extrabold bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-60 flex items-center space-x-1"
                            >
                              <X className="h-3.5 w-3.5" />
                              <span>
                                {isExpired
                                  ? isIndonesian ? "Kadaluarsa (30 Hari)" : "Expired (30 Days)"
                                  : isIndonesian ? "Ditolak (Final)" : "Rejected (Final)"}
                              </span>
                            </button>
                          ) : (
                            <button
                              disabled={isOffered || isAccepted}
                              onClick={async () => {
                                await handleUpdateStatus(app.id, "rejected");
                                showToast(
                                  isIndonesian
                                    ? `Lamaran ${app.candidateName} telah ditolak.`
                                    : `Application for ${app.candidateName} rejected.`,
                                  "info"
                                );
                              }}
                              title={
                                isAccepted
                                  ? isIndonesian ? "Kandidat telah menerima tawaran kerja resmi, lamaran tidak dapat ditolak" : "Candidate accepted job offer, cannot reject"
                                  : isOffered
                                  ? isIndonesian ? "Tawaran kerja telah diberikan kepada kandidat, lamaran tidak dapat ditolak" : "Job offer has been extended, cannot reject"
                                  : isIndonesian ? "Tolak berkas pelamar ini (keputusan final)" : "Reject applicant (final decision)"
                              }
                              className={`px-3 py-1.5 rounded-xl text-[11px] font-extrabold flex items-center space-x-1 transition-all ${
                                isOffered || isAccepted
                                  ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-50"
                                  : "bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 cursor-pointer shadow-2xs"
                              }`}
                            >
                              <X className="h-3.5 w-3.5" />
                              <span>{isIndonesian ? "Tolak" : "Reject"}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center shadow-sm text-slate-400 font-semibold text-xs">
              {isIndonesian
                ? "Pilih salah satu lowongan di kolom kiri untuk melihat daftar pelamar."
                : "Select an active job opening from the left column to review its applicants."}
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: SCHEDULE INTERVIEW MODAL (Replaces broken prompt)                */}
      {/* ========================================================================= */}
      {schedulingApp && (
        <div
          id="schedule-interview-modal-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden border border-slate-100 shadow-2xl relative animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 p-6 pb-4 bg-slate-50/50">
              <div className="flex items-center space-x-3">
                <img
                  src={getProfileAvatar(schedulingApp.candidateAvatar)}
                  alt={schedulingApp.candidateName}
                  className="h-12 w-12 rounded-2xl object-cover border border-slate-200 shadow-2xs shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = DEFAULT_PROFILE_IMAGE;
                  }}
                />
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[10px] font-extrabold border border-purple-100">
                    {isIndonesian ? "Jadwal Sesi Wawancara" : "Interview Scheduling Hub"}
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 mt-1">
                    {schedulingApp.candidateName}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500">
                    {schedulingApp.jobTitle}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSchedulingApp(null)}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full cursor-pointer transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitInterviewSchedule} className="p-6 space-y-4 text-xs">
              {/* Date & Time Selection */}
              <div className="grid sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="font-extrabold text-slate-700 flex items-center space-x-1">
                    <Calendar className="h-3.5 w-3.5 text-purple-600" />
                    <span>{isIndonesian ? "Tanggal Wawancara *" : "Interview Date *"}</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={interviewDateVal}
                    onChange={(e) => setInterviewDateVal(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-extrabold text-slate-700 flex items-center space-x-1">
                    <Clock className="h-3.5 w-3.5 text-purple-600" />
                    <span>{isIndonesian ? "Waktu (WIB) *" : "Time (WIB) *"}</span>
                  </label>
                  <input
                    type="time"
                    required
                    value={interviewTimeVal}
                    onChange={(e) => setInterviewTimeVal(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Quick Suggestion Chips */}
              <div className="flex flex-wrap gap-1.5">
                <span className="text-[10px] text-slate-400 font-bold self-center mr-1">
                  {isIndonesian ? "Pilihan Cepat:" : "Quick Slots:"}
                </span>
                {["10:00", "13:30", "15:00", "16:30"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setInterviewTimeVal(t)}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold cursor-pointer transition-all border ${
                      interviewTimeVal === t
                        ? "bg-purple-600 text-white border-purple-600"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-purple-50"
                    }`}
                  >
                    {t} WIB
                  </button>
                ))}
              </div>

              {/* Google Meet Link (Manually Entered by HR) */}
              <div className="space-y-1.5">
                <label className="font-extrabold text-slate-700 flex items-center space-x-1">
                  <Video className="h-3.5 w-3.5 text-blue-600" />
                  <span>{isIndonesian ? "Tautan Google Meet (Wajib Diisi HR)" : "Google Meet Link (Entered by HR)"}</span>
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  required
                  value={interviewMeetLink}
                  onChange={(e) => setInterviewMeetLink(e.target.value)}
                  placeholder="https://meet.google.com/abc-defg-hij"
                  className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all font-mono"
                />
              </div>

              {/* Interview Agenda & Notes */}
              <div className="space-y-1.5">
                <label className="font-extrabold text-slate-700">
                  {isIndonesian ? "Agenda / Catatan untuk Kandidat" : "Agenda & Candidate Instructions"}
                </label>
                <textarea
                  rows={2}
                  value={interviewNotes}
                  onChange={(e) => setInterviewNotes(e.target.value)}
                  placeholder={
                    isIndonesian
                      ? "Jelaskan susunan acara atau dokumen yang perlu dipersiapkan kandidat..."
                      : "Provide session focus, topics, or materials required..."
                  }
                  className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setSchedulingApp(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors cursor-pointer"
                >
                  {isIndonesian ? "Batal" : "Cancel"}
                </button>

                <button
                  type="submit"
                  disabled={isSubmittingInterview}
                  className="px-5 py-2 rounded-xl text-xs font-extrabold bg-purple-600 hover:bg-purple-700 text-white transition-all shadow-xs cursor-pointer flex items-center space-x-1.5 disabled:opacity-50"
                >
                  {isSubmittingInterview ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>{isIndonesian ? "Menyimpan..." : "Saving..."}</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>{isIndonesian ? "Konfirmasi Jadwal Wawancara" : "Confirm Schedule"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: EXTEND JOB OFFER MODAL                                           */}
      {/* ========================================================================= */}
      {offeringApp && (
        <div
          id="extend-offer-modal-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden border border-slate-100 shadow-2xl relative animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 p-6 pb-4 bg-emerald-50/50">
              <div className="flex items-center space-x-3">
                <img
                  src={getProfileAvatar(offeringApp.candidateAvatar)}
                  alt={offeringApp.candidateName}
                  className="h-12 w-12 rounded-2xl object-cover border border-emerald-200 shadow-2xs shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = DEFAULT_PROFILE_IMAGE;
                  }}
                />
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold border border-emerald-200">
                    {isIndonesian ? "Pemberian Penawaran Kerja Resmi" : "Formal Job Offer Hub"}
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 mt-1">
                    {offeringApp.candidateName}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500">
                    {offeringApp.jobTitle}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setOfferingApp(null)}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full cursor-pointer transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitJobOffer} className="p-6 space-y-4 text-xs">
              {/* Proposed Salary */}
              <div className="space-y-1.5">
                <label className="font-extrabold text-slate-700 flex items-center space-x-1">
                  <Banknote className="h-3.5 w-3.5 text-emerald-600" />
                  <span>{isIndonesian ? "Paket Kompensasi / Gaji Ditawarkan *" : "Offered Monthly Compensation *"}</span>
                </label>
                <input
                  type="text"
                  required
                  value={offerSalaryVal}
                  onChange={(e) => setOfferSalaryVal(e.target.value)}
                  placeholder="cth. Rp 28.000.000 / bulan + Asuransi"
                  className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                />
              </div>

              {/* Start Date */}
              <div className="space-y-1.5">
                <label className="font-extrabold text-slate-700 flex items-center space-x-1">
                  <Calendar className="h-3.5 w-3.5 text-emerald-600" />
                  <span>{isIndonesian ? "Estimasi Tanggal Mulai Bergabung" : "Target Onboarding Start Date"}</span>
                </label>
                <input
                  type="date"
                  value={offerStartDate}
                  onChange={(e) => setOfferStartDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                />
              </div>

              {/* Formal Offer Message */}
              <div className="space-y-1.5">
                <label className="font-extrabold text-slate-700">
                  {isIndonesian ? "Pesan Resmi Penawaran" : "Official Offer Letter Statement"}
                </label>
                <textarea
                  rows={3}
                  value={offerNotes}
                  onChange={(e) => setOfferNotes(e.target.value)}
                  className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setOfferingApp(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors cursor-pointer"
                >
                  {isIndonesian ? "Batal" : "Cancel"}
                </button>

                <button
                  type="submit"
                  disabled={isSubmittingOffer}
                  className="px-5 py-2 rounded-xl text-xs font-extrabold bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-xs cursor-pointer flex items-center space-x-1.5 disabled:opacity-50"
                >
                  {isSubmittingOffer ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>{isIndonesian ? "Mengirimkan..." : "Sending Offer..."}</span>
                    </>
                  ) : (
                    <>
                      <Award className="h-3.5 w-3.5" />
                      <span>{isIndonesian ? "Kirim Penawaran Resmi" : "Send Formal Offer"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: CANDIDATE FULL CV & DOSSIER VIEWER                               */}
      {/* ========================================================================= */}
      {viewingCandidateApp && (
        <div
          id="candidate-cv-dossier-modal-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-100 shadow-2xl relative animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 p-5 sm:p-6 bg-slate-50 shrink-0 gap-3">
              <div className="flex items-start space-x-4 min-w-0">
                <img
                  src={getProfileAvatar(viewingCandidateApp.candidateAvatar)}
                  alt={viewingCandidateApp.candidateName}
                  className="h-14 w-14 rounded-2xl object-cover border-2 border-white shadow-xs shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = DEFAULT_PROFILE_IMAGE;
                  }}
                />
                <div className="min-w-0">
                  <div className="flex items-center space-x-2 flex-wrap">
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                      {viewingCandidateApp.candidateName}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-extrabold flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3" />
                      <span>{isIndonesian ? "Talenta Terverifikasi" : "Verified Talent"}</span>
                    </span>
                    {viewingCandidateProfile?.atsScore && (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                        {viewingCandidateProfile.atsScore}% ATS Match
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-slate-600 mt-0.5">
                    {viewingCandidateApp.candidateHeadline}
                  </p>
                  <p className="text-[11px] font-bold text-slate-400 mt-0.5">
                    {viewingCandidateApp.candidateEmail} • {viewingCandidateApp.candidatePhone}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <button
                  type="button"
                  onClick={handleDownloadViewingCv}
                  disabled={isDownloadingCv}
                  className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 active:bg-blue-200 text-blue-700 border border-blue-200 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-1.5 shadow-2xs cursor-pointer disabled:opacity-50"
                  title={isIndonesian ? "Unduh berkas CV lengkap kandidat" : "Download candidate's complete CV"}
                >
                  {isDownloadingCv ? (
                    <RefreshCw className="h-3.5 w-3.5 animate-spin text-blue-600" />
                  ) : (
                    <FileCheck2 className="h-3.5 w-3.5 text-blue-600" />
                  )}
                  <span>
                    {isDownloadingCv
                      ? isIndonesian
                        ? "Mengunduh..."
                        : "Downloading..."
                      : isIndonesian
                      ? "Unduh PDF CV"
                      : "Download PDF CV"}
                  </span>
                </button>
                <button
                  onClick={() => {
                    setViewingCandidateApp(null);
                    setViewingCandidateProfile(null);
                  }}
                  className="p-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-full cursor-pointer transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Scrollable CV Dossier Body */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 text-xs font-semibold text-slate-700">
              {isLoadingCandidateProfile ? (
                <div className="p-12 text-center">
                  <RefreshCw className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-3" />
                  <p className="text-xs font-bold text-slate-500">
                    {isIndonesian ? "Memuat berkas dossier lengkap kandidat..." : "Loading complete candidate dossier..."}
                  </p>
                </div>
              ) : (
                <>
                  {/* Applied Context & Cover Letter */}
                  <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 sm:p-5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700">
                        {isIndonesian ? "Surat Lamaran Pekerjaan (Cover Note)" : "Application Cover Note"}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500">
                        {isIndonesian ? "Melamar untuk:" : "Applied for:"} {viewingCandidateApp.jobTitle}
                      </span>
                    </div>
                    <p className="text-xs text-slate-800 italic leading-relaxed font-medium">
                      "{viewingCandidateApp.coverNote || (isIndonesian ? "Tidak ada catatan pengantar terlampir." : "No cover note attached.")}"
                    </p>
                    <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-blue-100/80 text-[11px] font-bold text-slate-600">
                      <span className="flex items-center">
                        <Banknote className="h-3.5 w-3.5 text-emerald-600 mr-1" />
                        {isIndonesian ? "Ekspektasi Gaji:" : "Expected Salary:"} {viewingCandidateApp.expectedSalary}
                      </span>
                      <span className="text-slate-400">•</span>
                      <span>
                        {isIndonesian ? "Ketersediaan:" : "Availability:"} {viewingCandidateProfile?.availability || "Immediate"}
                      </span>
                    </div>
                  </div>

                  {/* Summary / About Me */}
                  {viewingCandidateProfile?.aboutMe && (
                    <div className="space-y-2">
                      <h4 className="font-extrabold text-slate-900 text-[11px] uppercase tracking-wider">
                        {isIndonesian ? "Ringkasan Profil & Latar Belakang" : "Professional Summary & Bio"}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100 font-medium">
                        {viewingCandidateProfile.aboutMe}
                      </p>
                    </div>
                  )}

                  {/* Skills Grid */}
                  {viewingCandidateProfile?.skills && viewingCandidateProfile.skills.length > 0 && (
                    <div className="space-y-2.5">
                      <h4 className="font-extrabold text-slate-900 text-[11px] uppercase tracking-wider">
                        {isIndonesian ? "Matriks Keahlian & Keterampilan Teknis" : "Skills & Technical Competencies"}
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                        {viewingCandidateProfile.skills.map((sk) => (
                          <div
                            key={sk.id}
                            className="p-3 bg-white border border-slate-150 rounded-xl flex items-center justify-between shadow-2xs"
                          >
                            <div>
                              <span className="font-bold text-slate-900 text-xs block">{sk.name}</span>
                              <span className="text-[10px] text-slate-400 font-semibold">{sk.category}</span>
                            </div>
                            <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-extrabold">
                              {sk.yearsOfExperience} {isIndonesian ? "thn" : "yrs"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Work Experience */}
                  {viewingCandidateProfile?.experience && viewingCandidateProfile.experience.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-extrabold text-slate-900 text-[11px] uppercase tracking-wider">
                        {isIndonesian ? "Riwayat Pengalaman Kerja" : "Work Experience History"}
                      </h4>
                      <div className="space-y-4 pl-4 border-l-2 border-slate-200">
                        {viewingCandidateProfile.experience.map((exp) => (
                          <div key={exp.id} className="relative space-y-1.5">
                            <span className="h-2.5 w-2.5 rounded-full bg-blue-600 border-2 border-white absolute -left-[21px] top-1" />
                            <div className="flex justify-between items-start">
                              <h5 className="font-bold text-slate-900 text-xs">{exp.position}</h5>
                              <span className="text-[10px] font-bold text-slate-400">
                                {exp.startDate} – {exp.endDate}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 font-bold">
                              {exp.company} • {exp.employmentType}
                            </p>
                            {exp.responsibilities && exp.responsibilities.length > 0 && (
                              <ul className="list-disc list-inside space-y-1 pl-1">
                                {exp.responsibilities.map((resp, i) => (
                                  <li key={i} className="text-[11px] text-slate-600 font-medium leading-relaxed">
                                    {resp}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Education & Certifications */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* Education */}
                    {viewingCandidateProfile?.education && viewingCandidateProfile.education.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-extrabold text-slate-900 text-[11px] uppercase tracking-wider">
                          {isIndonesian ? "Riwayat Pendidikan" : "Education Background"}
                        </h4>
                        <div className="space-y-2">
                          {viewingCandidateProfile.education.map((edu) => (
                            <div key={edu.id} className="p-3.5 border border-slate-150 rounded-2xl bg-slate-50/50">
                              <h5 className="font-bold text-slate-800 text-xs">{edu.degree}</h5>
                              <p className="text-[11px] text-slate-500 font-semibold">{edu.institution} ({edu.startDate} – {edu.endDate})</p>
                              {edu.grade && (
                                <span className="text-[10px] text-emerald-700 font-extrabold bg-emerald-50 px-2 py-0.5 rounded-md mt-1 inline-block">
                                  IPK / Grade: {edu.grade}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Certifications */}
                    {viewingCandidateProfile?.certificates && viewingCandidateProfile.certificates.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-extrabold text-slate-900 text-[11px] uppercase tracking-wider">
                          {isIndonesian ? "Sertifikasi Resmi" : "Official Certifications"}
                        </h4>
                        <div className="space-y-2">
                          {viewingCandidateProfile.certificates.map((cert) => (
                            <div key={cert.id} className="p-3.5 border border-slate-150 rounded-2xl bg-slate-50/50 flex items-start space-x-2.5">
                              <Award className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                              <div className="min-w-0">
                                <h5 className="font-bold text-slate-800 text-xs truncate">{cert.name}</h5>
                                <p className="text-[10px] text-slate-500 font-semibold">{cert.issuer} • {cert.issueDate}</p>
                                <p className="text-[9px] text-slate-400 font-mono mt-0.5 truncate">ID: {cert.credentialId}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Portfolio Projects */}
                  {viewingCandidateProfile?.portfolio && viewingCandidateProfile.portfolio.length > 0 && (
                    <div className="space-y-2.5">
                      <h4 className="font-extrabold text-slate-900 text-[11px] uppercase tracking-wider">
                        {isIndonesian ? "Studi Kasus & Proyek Portofolio" : "Portfolio Case Studies & Projects"}
                      </h4>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {viewingCandidateProfile.portfolio.map((proj) => (
                          <div key={proj.id} className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs flex flex-col justify-between bg-white">
                            {proj.thumbnail && (
                              <img src={proj.thumbnail} alt={proj.title} className="w-full h-28 object-cover" />
                            )}
                            <div className="p-3.5 space-y-1.5 flex-1 flex flex-col justify-between">
                              <div>
                                <h5 className="font-bold text-slate-900 text-xs">{proj.title}</h5>
                                <p className="text-[11px] text-slate-500 font-medium line-clamp-2 mt-0.5">{proj.description}</p>
                              </div>
                              {proj.link && (
                                <a
                                  href={proj.link}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center text-[10px] font-extrabold text-blue-600 hover:underline pt-1"
                                >
                                  <span>{isIndonesian ? "Buka Tautan Proyek" : "View Live Demo"}</span>
                                  <ExternalLink className="h-3 w-3 ml-1" />
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer with Pipeline Stage Progression Controls */}
            <div className="border-t border-slate-100 p-4 sm:p-5 bg-slate-50 shrink-0 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-500">
                  {isIndonesian ? "Status Saat Ini:" : "Current Status:"}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border ${
                    viewingCandidateApp.status === "accepted"
                      ? "bg-teal-50 text-teal-800 border-teal-200"
                      : viewingCandidateApp.status === "offered"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : viewingCandidateApp.status === "rejected"
                      ? "bg-red-50 text-red-600 border-red-200"
                      : viewingCandidateApp.status === "interview"
                      ? "bg-purple-50 text-purple-700 border-purple-200"
                      : "bg-blue-50 text-blue-700 border-blue-200"
                  }`}
                >
                  {viewingCandidateApp.status === "accepted"
                    ? isIndonesian ? "🎉 Tawaran Diterima" : "🎉 Offer Accepted"
                    : viewingCandidateApp.status === "offered"
                    ? isIndonesian ? "Penawaran Kerja" : "Job Offer"
                    : viewingCandidateApp.status === "rejected"
                    ? isIndonesian ? "Ditolak (Final)" : "Rejected (Final)"
                    : viewingCandidateApp.status === "interview"
                    ? isIndonesian ? "Wawancara" : "Interview"
                    : isIndonesian ? "Sedang Ditinjau" : "Under Review"}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* 1. Schedule Interview */}
                <button
                  disabled={
                    viewingCandidateApp.status === "rejected" ||
                    viewingCandidateApp.status === "offered" ||
                    viewingCandidateApp.status === "accepted" ||
                    viewingCandidateApp.isExpired
                  }
                  onClick={() => {
                    const current = viewingCandidateApp;
                    setViewingCandidateApp(null);
                    handleOpenScheduleModal(current);
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs font-extrabold bg-purple-600 hover:bg-purple-700 text-white cursor-pointer transition-all shadow-xs flex items-center space-x-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{isIndonesian ? "Jadwalkan Interview" : "Schedule Interview"}</span>
                </button>

                {/* 2. Extend Offer */}
                <button
                  disabled={
                    viewingCandidateApp.status === "rejected" ||
                    viewingCandidateApp.status === "offered" ||
                    viewingCandidateApp.status === "accepted" ||
                    viewingCandidateApp.isExpired
                  }
                  onClick={() => {
                    const current = viewingCandidateApp;
                    setViewingCandidateApp(null);
                    handleOpenOfferModal(current);
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs font-extrabold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer transition-all shadow-xs flex items-center space-x-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Award className="h-3.5 w-3.5" />
                  <span>
                    {viewingCandidateApp.status === "accepted"
                      ? isIndonesian ? "✓ Tawaran Diterima" : "✓ Offer Accepted"
                      : viewingCandidateApp.status === "offered"
                      ? isIndonesian ? "✓ Tawaran Terkirim" : "✓ Offer Extended"
                      : isIndonesian ? "Beri Tawaran Kerja" : "Make Job Offer"}
                  </span>
                </button>

                {/* 3. Reject Button */}
                {viewingCandidateApp.status === "rejected" || viewingCandidateApp.isExpired ? (
                  <button
                    disabled
                    title={isIndonesian ? "Keputusan penolakan bersifat final" : "Rejection is final"}
                    className="px-3 py-2 rounded-xl text-xs font-extrabold bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-60 flex items-center space-x-1"
                  >
                    <X className="h-3.5 w-3.5" />
                    <span>{isIndonesian ? "Ditolak (Final)" : "Rejected (Final)"}</span>
                  </button>
                ) : (
                  <button
                    disabled={viewingCandidateApp.status === "offered" || viewingCandidateApp.status === "accepted"}
                    onClick={async () => {
                      await handleUpdateStatus(viewingCandidateApp.id, "rejected");
                      setViewingCandidateApp(null);
                      showToast(isIndonesian ? "Lamaran ditolak." : "Application rejected.", "info");
                    }}
                    title={
                      viewingCandidateApp.status === "offered" || viewingCandidateApp.status === "accepted"
                        ? isIndonesian ? "Tawaran telah diberikan/diterima, lamaran tidak dapat ditolak" : "Offer extended/accepted, cannot reject"
                        : isIndonesian ? "Tolak lamaran ini" : "Reject application"
                    }
                    className={`px-3 py-2 rounded-xl text-xs font-extrabold flex items-center space-x-1 transition-all ${
                      viewingCandidateApp.status === "offered" || viewingCandidateApp.status === "accepted"
                        ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-50"
                        : "bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 cursor-pointer shadow-2xs"
                    }`}
                  >
                    <X className="h-3.5 w-3.5" />
                    <span>{isIndonesian ? "Tolak Lamaran" : "Reject"}</span>
                  </button>
                )}

                {/* 4. Close Button */}
                <button
                  onClick={() => {
                    setViewingCandidateApp(null);
                    setViewingCandidateProfile(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-200 hover:bg-slate-300 text-slate-700 cursor-pointer transition-colors"
                >
                  {isIndonesian ? "Tutup" : "Close"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: CREATE / POST NEW JOB OPENING                                    */}
      {/* ========================================================================= */}
      {isCreatingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[88vh] flex flex-col overflow-hidden border border-slate-100 shadow-2xl relative animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 p-6 pb-4 bg-white shrink-0">
              <div>
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-extrabold border border-blue-100">
                  {isIndonesian ? "Portal Perekrutan Perusahaan" : "Corporate Hiring Hub"}
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 mt-2">
                  {isIndonesian ? "Pasang Lowongan Pekerjaan Baru" : "Post a New Job Opening"}
                </h2>
                <p className="text-xs font-bold text-slate-500">
                  {recruiter.companyName} • {recruiter.fullName}
                </p>
              </div>

              <button
                onClick={() => setIsCreatingJob(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateJobSubmit} className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-8 space-y-4">
                {/* Alert notifications */}
                {formSuccessMsg && (
                  <div className="bg-emerald-50 text-emerald-800 p-4 rounded-2xl border border-emerald-200 text-xs font-bold flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>{formSuccessMsg}</span>
                  </div>
                )}

                {formErrorMsg && (
                  <div className="bg-red-50 text-red-800 p-4 rounded-2xl border border-red-200 text-xs font-bold flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
                    <span>{formErrorMsg}</span>
                  </div>
                )}

                {/* Job Title & Department */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-slate-700">
                      {isIndonesian ? "Judul Posisi Pekerjaan *" : "Job Title *"}
                    </label>
                    <input
                      type="text"
                      required
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="cth. Senior Fullstack Engineer"
                      className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-slate-700">
                      {isIndonesian ? "Departemen / Divisi" : "Department / Division"}
                    </label>
                    <input
                      type="text"
                      value={formDepartment}
                      onChange={(e) => setFormDepartment(e.target.value)}
                      placeholder="cth. Engineering, Product, Design"
                      className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Location & Workplace Type */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-slate-700">
                      {isIndonesian ? "Lokasi Penempatan" : "Location"}
                    </label>
                    <input
                      type="text"
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                      placeholder="cth. Jakarta, Indonesia atau Remote"
                      className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-slate-700">
                      {isIndonesian ? "Tipe Tempat Kerja" : "Workplace Type"}
                    </label>
                    <select
                      value={formWorkplace}
                      onChange={(e) => setFormWorkplace(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    >
                      <option value="Remote">Remote</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="Onsite">Onsite</option>
                    </select>
                  </div>
                </div>

                {/* Employment Type & Level & Salary */}
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-slate-700">
                      {isIndonesian ? "Tipe Kontrak / Posisi" : "Employment / Role Type"}
                    </label>
                    <select
                      value={formEmployment}
                      onChange={(e) => {
                        const val = e.target.value as any;
                        setFormEmployment(val);
                        if (val === "Internship" && (!formSalary || formSalary.includes("20.000.000"))) {
                          setFormSalary("Rp 4.500.000 - Rp 6.500.000 / bulan");
                          setFormExperience("Entry");
                        }
                      }}
                      className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Internship">{isIndonesian ? "Magang / Internship" : "Internship / Magang"}</option>
                      <option value="Contract">Contract (Kontrak)</option>
                      <option value="Part-time">Part-time (Paruh Waktu)</option>
                      <option value="Freelance">Freelance / Proyek</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-slate-700">
                      {isIndonesian ? "Jenjang Pengalaman" : "Experience Level"}
                    </label>
                    <select
                      value={formExperience}
                      onChange={(e) => setFormExperience(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    >
                      <option value="Entry">{isIndonesian ? "Entry / Mahasiswa / Fresh Grad" : "Entry / Student / Fresh Grad"}</option>
                      <option value="Junior">Junior (0-2 thn)</option>
                      <option value="Mid-level">Mid-level (3-5 thn)</option>
                      <option value="Senior">Senior (5+ thn)</option>
                      <option value="Lead">Lead / Principal</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-slate-700">
                      {formEmployment === "Internship"
                        ? (isIndonesian ? "Uang Saku / Stipend" : "Stipend / Allowance")
                        : (isIndonesian ? "Rentang Gaji" : "Salary Range")}
                    </label>
                    <input
                      type="text"
                      value={formSalary}
                      onChange={(e) => setFormSalary(e.target.value)}
                      placeholder={formEmployment === "Internship" ? "cth. Rp 4.500.000 - Rp 6.500.000 / bln" : "cth. Rp 20.000.000 - Rp 30.000.000 / bln"}
                      className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-700">
                    {isIndonesian ? "Ringkasan Deskripsi Pekerjaan *" : "Job Summary *"}
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder={
                      isIndonesian
                        ? "Jelaskan peran ini secara garis besar dan dampaknya terhadap tim..."
                        : "Describe the core mission and scope of this role..."
                    }
                    className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none"
                  />
                </div>

                {/* Responsibilities */}
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-700">
                    {isIndonesian ? "Tanggung Jawab Utama (1 per baris)" : "Key Responsibilities (1 per line)"}
                  </label>
                  <textarea
                    rows={3}
                    value={formResponsibilities}
                    onChange={(e) => setFormResponsibilities(e.target.value)}
                    className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none"
                  />
                </div>

                {/* Requirements */}
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-700">
                    {isIndonesian ? "Persyaratan & Kualifikasi (1 per baris)" : "Qualifications & Requirements (1 per line)"}
                  </label>
                  <textarea
                    rows={3}
                    value={formRequirements}
                    onChange={(e) => setFormRequirements(e.target.value)}
                    className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none"
                  />
                </div>

                {/* Skills */}
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-700">
                    {isIndonesian ? "Keahlian & Teknologi Terkait (Pisahkan dengan koma)" : "Required Skills (Comma separated)"}
                  </label>
                  <input
                    type="text"
                    value={formSkills}
                    onChange={(e) => setFormSkills(e.target.value)}
                    placeholder="React, TypeScript, Node.js, Cloud, Docker"
                    className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="border-t border-slate-100 p-5 bg-slate-50 flex items-center justify-between shrink-0">
                <button
                  type="button"
                  onClick={() => setIsCreatingJob(false)}
                  className="px-5 py-2.5 rounded-2xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors cursor-pointer"
                >
                  {isIndonesian ? "Batal" : "Cancel"}
                </button>

                <button
                  type="submit"
                  id="btn-submit-new-job"
                  disabled={isSubmittingJob}
                  className="px-6 py-2.5 rounded-2xl text-xs font-extrabold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-xs cursor-pointer flex items-center space-x-2 disabled:opacity-50"
                >
                  {isSubmittingJob ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>{isIndonesian ? "Mempublikasikan..." : "Publishing..."}</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      <span>{isIndonesian ? "Publikasikan Lowongan" : "Publish Job Opening"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
