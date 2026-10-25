/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  LayoutDashboard,
  Building2,
  ShieldCheck, 
  Briefcase, 
  BookOpen, 
  Users, 
  Search, 
  Filter, 
  ExternalLink, 
  Eye, 
  RefreshCw, 
  CheckCircle2, 
  XCircle,
  AlertCircle,
  Clock, 
  Calendar, 
  MapPin, 
  Award, 
  GraduationCap, 
  FileText,
  FileCheck,
  ChevronRight,
  TrendingUp,
  Activity,
  Check,
  X,
  Lock,
  ChevronDown,
  Plus,
  Pencil,
  Trash2,
  Edit3,
  Inbox,
  MessageSquare,
  PhoneCall,
  Send,
  HelpCircle,
  Globe,
  Mail,
  CheckSquare,
  Target
} from "lucide-react";
import { 
  Candidate, 
  Recruiter, 
  TrainingProgram, 
  Scholarship, 
  Internship, 
  CareerArticle, 
  JobOpening,
  TrainingProposal,
  CandidateScholarshipApplication,
  DEFAULT_PROFILE_IMAGE
} from "../types";
import { 
  MOCK_CANDIDATES, 
  MOCK_RECRUITERS, 
  MOCK_TRAININGS, 
  MOCK_SCHOLARSHIPS, 
  MOCK_INTERNSHIPS,
  MOCK_JOB_OPENINGS,
  MOCK_PROPOSALS,
  MOCK_SCHOLARSHIP_APPLICATIONS
} from "../data/mockData";
import { useLanguage } from "../context/LanguageContext";

interface AdminPanelProps {
  candidates?: Candidate[];
  onVerifyCandidate?: (candidateId: string) => void;
  recruiters?: Recruiter[];
  onVerifyRecruiter?: (recruiterId: string, action: "approve" | "reject", updatedRecruiter?: Recruiter) => void;
  trainings: TrainingProgram[];
  onUpdateTrainings?: (trainings: TrainingProgram[]) => void;
  scholarships?: Scholarship[];
  onUpdateScholarships?: (scholarships: Scholarship[]) => void;
  internships?: Internship[];
  onUpdateInternships?: (internships: Internship[]) => void;
  articles?: CareerArticle[];
  scholarshipApplications?: CandidateScholarshipApplication[];
  onUpdateScholarshipApplication?: (appId: string, status: "under_review" | "interview_scheduled" | "approved" | "rejected", adminFeedback?: string) => void;
}

interface AdminTelemetry {
  totalCandidates: number;
  registeredCandidates: number;
  verifiedCandidates: number;
  totalRecruiters: number;
  registeredHrPersonnel: number;
  pendingHrVerifications: number;
  verifiedRecruiters: number;
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  totalInvitations: number;
  totalUsers: number;
  monthlyRevenue: string;
  systemUptime: string;
  cpuUsage: string;
  memoryUsage: string;
}

export default function AdminPanel({
  candidates: initialCandidates,
  onVerifyCandidate,
  recruiters: initialRecruiters,
  onVerifyRecruiter,
  trainings: initialTrainings,
  onUpdateTrainings,
  scholarships: initialScholarships,
  onUpdateScholarships,
  internships: initialInternships,
  onUpdateInternships,
  scholarshipApplications: initialScholarshipApps,
  onUpdateScholarshipApplication,
}: AdminPanelProps) {
  const { isIndonesian } = useLanguage();

  // Navigation Tab State
  const [activeTab, setActiveTab] = useState<
    "overview" | "inbox" | "hr-verification" | "candidate-verification" | "job-moderation" | "programs-catalog" | "users-audit"
  >("overview");

  // State collections
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates || MOCK_CANDIDATES);
  const [recruiters, setRecruiters] = useState<Recruiter[]>(initialRecruiters || MOCK_RECRUITERS);
  const [trainings, setTrainings] = useState<TrainingProgram[]>(initialTrainings || MOCK_TRAININGS);
  const [scholarships, setScholarships] = useState<Scholarship[]>(initialScholarships || MOCK_SCHOLARSHIPS);
  const [internships, setInternships] = useState<Internship[]>(initialInternships || MOCK_INTERNSHIPS);
  const [scholarshipApps, setScholarshipApps] = useState<CandidateScholarshipApplication[]>(
    initialScholarshipApps || MOCK_SCHOLARSHIP_APPLICATIONS
  );
  const [inspectScholarshipApp, setInspectScholarshipApp] = useState<CandidateScholarshipApplication | null>(null);
  const [reviewFeedbackInput, setReviewFeedbackInput] = useState("");
  const [jobs, setJobs] = useState<JobOpening[]>(MOCK_JOB_OPENINGS);
  const [proposals, setProposals] = useState<TrainingProposal[]>(MOCK_PROPOSALS);
  const [selectedProposal, setSelectedProposal] = useState<TrainingProposal | null>(null);
  const [proposalTypeFilter, setProposalTypeFilter] = useState<string>("all");
  const [proposalStatusFilter, setProposalStatusFilter] = useState<string>("all");
  const [proposalSearchTerm, setProposalSearchTerm] = useState<string>("");
  const [registeredUsers, setRegisteredUsers] = useState<any[]>([
    { id: "cand_1", name: "Alex Rivera", email: "alex@rivera.com", role: "candidate", status: "verified", createdAt: "2026-01-15" },
    { id: "rec_1", name: "Elena Rostova", email: "elena@techcorp.com", role: "recruiter", company: "TechCorp Global", status: "verified", createdAt: "2026-02-01" },
    { id: "adm_1", name: "Sarah Connor (Super Admin)", email: "admin@talenthub.com", role: "admin", status: "active", createdAt: "2025-12-01" }
  ]);
  const [telemetry, setTelemetry] = useState<AdminTelemetry | null>(null);
  const [loading, setLoading] = useState(false);

  // Proposal Approval & Review Modals
  const [approveProposalModal, setApproveProposalModal] = useState<{
    isOpen: boolean;
    proposal: TrainingProposal | null;
    editedTitle: string;
    editedProvider: string;
    editedCategory: "Coding" | "Design" | "Product" | "Data" | "Marketing" | "Language";
    editedType: "Free" | "Government" | "NGO" | "Private";
    editedFormat: "Online" | "Offline";
    editedDuration: string;
    editedCert: boolean;
    editedLink: string;
    editedDesc: string;
    adminNotes: string;
    loading: boolean;
  }>({
    isOpen: false,
    proposal: null,
    editedTitle: "",
    editedProvider: "",
    editedCategory: "Coding",
    editedType: "Private",
    editedFormat: "Online",
    editedDuration: "4 Minggu",
    editedCert: true,
    editedLink: "",
    editedDesc: "",
    adminNotes: "",
    loading: false
  });

  const [replyNotesModal, setReplyNotesModal] = useState<{
    isOpen: boolean;
    proposal: TrainingProposal | null;
    newStatus: "pending" | "under_review" | "approved" | "rejected";
    notes: string;
    saving: boolean;
  }>({
    isOpen: false,
    proposal: null,
    newStatus: "under_review",
    notes: "",
    saving: false
  });

  // Catalog Subtab State
  const [catalogSubTab, setCatalogSubTab] = useState<"trainings" | "scholarships" | "internships" | "scholarship-applications">("trainings");

  // Filter and Search States
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [formatFilter, setFormatFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Modal States
  const [inspectRecruiter, setInspectRecruiter] = useState<Recruiter | null>(null);
  const [inspectCandidate, setInspectCandidate] = useState<Candidate | null>(null);
  const [inspectJob, setInspectJob] = useState<JobOpening | null>(null);
  const [selectedProgramDetail, setSelectedProgramDetail] = useState<{
    type: "training" | "scholarship" | "internship";
    data: any;
  } | null>(null);

  // Program CRUD Modal States
  const [trainingModal, setTrainingModal] = useState<{
    isOpen: boolean;
    isEdit: boolean;
    data: Partial<TrainingProgram>;
  }>({
    isOpen: false,
    isEdit: false,
    data: {
      title: "",
      provider: "",
      category: "Coding",
      type: "Free",
      format: "Online",
      duration: "4 Minggu",
      certification: true,
      description: "",
      imageUrl: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&q=80&w=300",
      link: "https://digitalent.kominfo.go.id"
    }
  });

  const [scholarshipModal, setScholarshipModal] = useState<{
    isOpen: boolean;
    isEdit: boolean;
    data: Partial<Scholarship>;
  }>({
    isOpen: false,
    isEdit: false,
    data: {
      title: "",
      provider: "",
      amount: "Pendanaan Penuh",
      deadline: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
      category: "Teknologi & Sains",
      description: "",
      requirements: ["Mahasiswa / WNI Aktif", "IPK Minimum 3.00"],
      link: "https://beasiswa.kemdikbud.go.id"
    }
  });

  const [internshipModal, setInternshipModal] = useState<{
    isOpen: boolean;
    isEdit: boolean;
    data: Partial<Internship>;
  }>({
    isOpen: false,
    isEdit: false,
    data: {
      title: "",
      company: "",
      location: "Jakarta, Indonesia",
      type: "Remote",
      duration: "3 Bulan",
      stipend: "Rp 5.000.000 / bulan",
      description: "",
      requirements: ["Mahasiswa tingkat akhir atau fresh graduate"],
      link: "https://careers.talenthub.id"
    }
  });

  const [deleteConfirmModal, setDeleteConfirmModal] = useState<{
    isOpen: boolean;
    type: "training" | "scholarship" | "internship";
    id: string;
    title: string;
  } | null>(null);

  const [trainingRequirementsText, setTrainingRequirementsText] = useState("");
  const [scholarshipRequirementsText, setScholarshipRequirementsText] = useState("");
  const [internshipRequirementsText, setInternshipRequirementsText] = useState("");
  const [savingProgram, setSavingProgram] = useState(false);
  const [deletingProgramId, setDeletingProgramId] = useState<string | null>(null);

  // Action feedback message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync props to state
  useEffect(() => {
    if (initialCandidates && initialCandidates.length > 0) setCandidates(initialCandidates);
  }, [initialCandidates]);

  useEffect(() => {
    if (initialRecruiters && initialRecruiters.length > 0) setRecruiters(initialRecruiters);
  }, [initialRecruiters]);

  useEffect(() => {
    if (initialTrainings && initialTrainings.length > 0) setTrainings(initialTrainings);
  }, [initialTrainings]);

  useEffect(() => {
    if (initialScholarships && initialScholarships.length > 0) setScholarships(initialScholarships);
  }, [initialScholarships]);

  useEffect(() => {
    if (initialInternships && initialInternships.length > 0) setInternships(initialInternships);
  }, [initialInternships]);

  useEffect(() => {
    if (initialScholarshipApps && initialScholarshipApps.length > 0) setScholarshipApps(initialScholarshipApps);
  }, [initialScholarshipApps]);

  // Fetch telemetry & all dataset on mount
  const fetchAllAdminData = async () => {
    setLoading(true);
    try {
      // 1. Telemetry Overview
      const resOverview = await fetch("/api/admin/overview");
      if (resOverview.ok) {
        const data = await resOverview.json();
        if (data.stats) setTelemetry(data.stats);
      }

      // 2. Recruiters
      const resRecruiters = await fetch("/api/admin/recruiters");
      if (resRecruiters.ok) {
        const data = await resRecruiters.json();
        if (data.recruiters && Array.isArray(data.recruiters)) setRecruiters(data.recruiters);
      }

      // 3. Candidates
      const resCandidates = await fetch("/api/admin/candidates");
      if (resCandidates.ok) {
        const data = await resCandidates.json();
        if (data.candidates && Array.isArray(data.candidates)) setCandidates(data.candidates);
      }

      // 4. Jobs
      const resJobs = await fetch("/api/admin/jobs");
      if (resJobs.ok) {
        const data = await resJobs.json();
        if (data.jobs && Array.isArray(data.jobs)) setJobs(data.jobs);
      }

      // 5. Educational Programs
      const resPrograms = await fetch("/api/programs");
      if (resPrograms.ok) {
        const data = await resPrograms.json();
        if (data.trainings && Array.isArray(data.trainings)) setTrainings(data.trainings);
        if (data.scholarships && Array.isArray(data.scholarships)) setScholarships(data.scholarships);
        if (data.internships && Array.isArray(data.internships)) setInternships(data.internships);
      }

      // 6. Registered Auth Users
      const resUsers = await fetch("/api/admin/users");
      if (resUsers.ok) {
        const data = await resUsers.json();
        if (data.users && Array.isArray(data.users)) setRegisteredUsers(data.users);
      }

      // 7. Incoming Proposals & Inbox Messages
      const resProposals = await fetch("/api/admin/proposals");
      if (resProposals.ok) {
        const data = await resProposals.json();
        if (data.proposals && Array.isArray(data.proposals)) setProposals(data.proposals);
      }
    } catch (e) {
      console.warn("Notice: Admin data loaded with standard local fallback defaults.", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAdminData();
  }, []);

  // -------------------------------------------------------------
  // Proposal & Inbox Handlers
  // -------------------------------------------------------------
  const handleOpenApproveModal = (prop: TrainingProposal) => {
    setApproveProposalModal({
      isOpen: true,
      proposal: prop,
      editedTitle: prop.programTitle || "",
      editedProvider: prop.institutionName || "",
      editedCategory: (prop.category as any) || "Coding",
      editedType: (prop.programType as any) || "Private",
      editedFormat: (prop.format as any) || "Online",
      editedDuration: prop.duration || "4 Minggu",
      editedCert: prop.certification !== undefined ? prop.certification : true,
      editedLink: prop.registrationLink || "https://talenthub.id",
      editedDesc: prop.description || prop.syllabusOverview || "",
      adminNotes: prop.adminNotes || (isIndonesian ? "Telah didiskusikan via telepon dengan PIC dan disetujui untuk diterbitkan." : "Discussed via phone with PIC and approved for catalog."),
      loading: false
    });
  };

  const handleConfirmApproveProposal = async () => {
    if (!approveProposalModal.proposal) return;
    const prop = approveProposalModal.proposal;
    setApproveProposalModal(prev => ({ ...prev, loading: true }));

    try {
      const res = await fetch(`/api/admin/proposals/${prop.id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminNotes: approveProposalModal.adminNotes,
          title: approveProposalModal.editedTitle,
          provider: approveProposalModal.editedProvider,
          category: approveProposalModal.editedCategory,
          type: approveProposalModal.editedType,
          format: approveProposalModal.editedFormat,
          duration: approveProposalModal.editedDuration,
          certification: approveProposalModal.editedCert,
          description: approveProposalModal.editedDesc,
          link: approveProposalModal.editedLink
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.training) {
          setTrainings(prev => [data.training, ...prev]);
          onUpdateTrainings?.([data.training, ...trainings]);
        }
        setProposals(prev => prev.map(p => p.id === prop.id ? { ...p, status: "approved", adminNotes: approveProposalModal.adminNotes } : p));
        if (selectedProposal && selectedProposal.id === prop.id) {
          setSelectedProposal({ ...selectedProposal, status: "approved", adminNotes: approveProposalModal.adminNotes });
        }
        showToast(isIndonesian ? "Proposal berhasil disetujui! Program pelatihan telah dibuat & masuk ke Katalog." : "Proposal approved! Training program created in catalog.");
      } else {
        // Fallback local creation
        const newTraining: TrainingProgram = {
          id: `tr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          title: approveProposalModal.editedTitle || prop.programTitle,
          provider: approveProposalModal.editedProvider || prop.institutionName,
          category: approveProposalModal.editedCategory || prop.category || "Coding",
          type: approveProposalModal.editedType || prop.programType || "Private",
          format: approveProposalModal.editedFormat || prop.format || "Online",
          duration: approveProposalModal.editedDuration || prop.duration || "4 Minggu",
          certification: approveProposalModal.editedCert,
          description: approveProposalModal.editedDesc || prop.description,
          requirements: prop.requirements && prop.requirements.length > 0 ? prop.requirements : ["Warga Negara Indonesia (WNI)"],
          imageUrl: prop.imageUrl || "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&q=80&w=300",
          link: approveProposalModal.editedLink || prop.registrationLink || "https://talenthub.id"
        };
        setTrainings(prev => [newTraining, ...prev]);
        onUpdateTrainings?.([newTraining, ...trainings]);
        setProposals(prev => prev.map(p => p.id === prop.id ? { ...p, status: "approved", adminNotes: approveProposalModal.adminNotes } : p));
        if (selectedProposal && selectedProposal.id === prop.id) {
          setSelectedProposal({ ...selectedProposal, status: "approved", adminNotes: approveProposalModal.adminNotes });
        }
        showToast(isIndonesian ? "Proposal disetujui! Program pelatihan diterbitkan ke katalog." : "Proposal approved & published to catalog.");
      }
    } catch (err) {
      console.error("Error approving proposal:", err);
      showToast(isIndonesian ? "Gagal memproses persetujuan proposal." : "Failed to process proposal approval.");
    } finally {
      setApproveProposalModal(prev => ({ ...prev, isOpen: false, loading: false }));
    }
  };

  const handleOpenStatusModal = (prop: TrainingProposal, status: "pending" | "under_review" | "approved" | "rejected") => {
    setReplyNotesModal({
      isOpen: true,
      proposal: prop,
      newStatus: status,
      notes: prop.adminNotes || (status === "under_review" ? (isIndonesian ? "Sedang dalam tahap koordinasi lanjutan via telepon / email dengan PIC." : "Under discussion with partner PIC.") : ""),
      saving: false
    });
  };

  const handleSaveProposalStatus = async () => {
    if (!replyNotesModal.proposal) return;
    const prop = replyNotesModal.proposal;
    setReplyNotesModal(prev => ({ ...prev, saving: true }));

    try {
      await fetch(`/api/admin/proposals/${prop.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: replyNotesModal.newStatus,
          adminNotes: replyNotesModal.notes
        })
      });

      setProposals(prev => prev.map(p => p.id === prop.id ? { ...p, status: replyNotesModal.newStatus, adminNotes: replyNotesModal.notes } : p));
      if (selectedProposal && selectedProposal.id === prop.id) {
        setSelectedProposal({ ...selectedProposal, status: replyNotesModal.newStatus, adminNotes: replyNotesModal.notes });
      }
      showToast(isIndonesian ? `Status proposal berhasil diperbarui ke "${replyNotesModal.newStatus}".` : "Proposal status updated successfully.");
    } catch (err) {
      console.error("Error updating proposal:", err);
      setProposals(prev => prev.map(p => p.id === prop.id ? { ...p, status: replyNotesModal.newStatus, adminNotes: replyNotesModal.notes } : p));
      if (selectedProposal && selectedProposal.id === prop.id) {
        setSelectedProposal({ ...selectedProposal, status: replyNotesModal.newStatus, adminNotes: replyNotesModal.notes });
      }
      showToast(isIndonesian ? "Status proposal diperbarui secara lokal." : "Proposal status updated locally.");
    } finally {
      setReplyNotesModal(prev => ({ ...prev, isOpen: false, saving: false }));
    }
  };

  const handleDeleteProposal = async (propId: string) => {
    if (!confirm(isIndonesian ? "Apakah Anda yakin ingin menghapus pesan/proposal ini dari Inbox?" : "Are you sure you want to delete this proposal from Inbox?")) return;
    
    try {
      await fetch(`/api/admin/proposals/${propId}`, { method: "DELETE" });
    } catch (err) {
      console.warn("Delete error:", err);
    }
    setProposals(prev => prev.filter(p => p.id !== propId));
    if (selectedProposal?.id === propId) setSelectedProposal(null);
    showToast(isIndonesian ? "Pesan proposal dihapus dari Inbox." : "Proposal deleted from Inbox.");
  };

  // Handle Recruiter Verification
  const handleRecruiterVerificationAction = async (recruiterId: string, action: "approve" | "reject") => {
    const isApproved = action === "approve";
    // Optimistic UI Update
    setRecruiters(prev => prev.map(r => {
      if (r.id === recruiterId || r.email.toLowerCase() === recruiterId.toLowerCase()) {
        return {
          ...r,
          hrVerified: isApproved,
          hrVerificationStatus: isApproved ? "verified" : "pending_review",
          hrVerificationTier: isApproved ? "verified_admin" : "pending_manual_review"
        };
      }
      return r;
    }));

    if (onVerifyRecruiter) {
      onVerifyRecruiter(recruiterId, action);
    }

    try {
      const res = await fetch(`/api/admin/recruiters/${recruiterId}/verify`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action })
      });
      if (res.ok) {
        showToast(
          isApproved 
            ? (isIndonesian ? "Akreditasi HR berhasil disetujui!" : "HR accreditation successfully approved!") 
            : (isIndonesian ? "Status verifikasi HR ditolak / ditangguhkan." : "HR verification status rejected.")
        );
      }
    } catch (e) {
      console.warn("Recruiter verification synced locally:", e);
    }
    setInspectRecruiter(null);
  };

  // Handle Candidate Verification
  const handleCandidateVerificationAction = async (candidateId: string) => {
    const target = candidates.find(c => c.id === candidateId);
    if (!target) return;
    const newVerified = !target.verified;

    // Optimistic UI update
    setCandidates(prev => prev.map(c => {
      if (c.id === candidateId) {
        return {
          ...c,
          verified: newVerified,
          profileCompletion: newVerified ? Math.max(c.profileCompletion || 0, 95) : c.profileCompletion
        };
      }
      return c;
    }));

    if (onVerifyCandidate && newVerified) {
      onVerifyCandidate(candidateId);
    }

    try {
      const res = await fetch(`/api/admin/candidates/${candidateId}/verify`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verified: newVerified })
      });
      if (res.ok) {
        showToast(
          newVerified 
            ? (isIndonesian ? "Lencana talenta terverifikasi berhasil diberikan!" : "Candidate verified badge granted!") 
            : (isIndonesian ? "Lencana verifikasi talenta dicabut." : "Candidate verification removed.")
        );
      }
    } catch (e) {
      console.warn("Candidate verification synced locally:", e);
    }
    setInspectCandidate(null);
  };

  // Handle Job Status Change
  const handleJobStatusAction = async (jobId: string, status: "active" | "paused" | "closed" | "delete") => {
    if (status === "delete") {
      setJobs(prev => prev.filter(j => j.id !== jobId));
      showToast(isIndonesian ? "Lowongan berhasil dihapus dari platform." : "Job listing removed.");
    } else {
      setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status } : j));
      showToast(isIndonesian ? `Status lowongan diubah menjadi: ${status}` : `Job status updated to ${status}`);
    }

    try {
      await fetch(`/api/admin/jobs/${jobId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: status === "delete" ? undefined : status, action: status === "delete" ? "delete" : undefined })
      });
    } catch (e) {
      console.warn("Job status updated locally:", e);
    }
    setInspectJob(null);
  };

  // -------------------------------------------------------------
  // CRUD HANDLERS FOR EDUCATIONAL & CAREER PROGRAMS
  // -------------------------------------------------------------

  // 1. Training CRUD Handlers
  const handleOpenCreateTraining = () => {
    setTrainingRequirementsText("Warga Negara Indonesia (WNI)\nBerusia minimal 18 tahun\nMemiliki laptop dan koneksi internet stabil");
    setTrainingModal({
      isOpen: true,
      isEdit: false,
      data: {
        title: "",
        provider: "",
        category: "Coding",
        type: "Free",
        format: "Online",
        duration: "8 Minggu",
        certification: true,
        description: "",
        imageUrl: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&q=80&w=300",
        link: "https://digitalent.kominfo.go.id"
      }
    });
  };

  const handleOpenEditTraining = (training: TrainingProgram) => {
    const reqText = Array.isArray(training.requirements)
      ? training.requirements.join("\n")
      : typeof training.requirements === "string"
      ? training.requirements
      : "Warga Negara Indonesia (WNI)\nBerusia minimal 18 tahun";
    setTrainingRequirementsText(reqText);
    setTrainingModal({
      isOpen: true,
      isEdit: true,
      data: { ...training }
    });
  };

  const handleSaveTraining = async (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    const { isEdit, data } = trainingModal;
    if (!data.title?.trim() || !data.provider?.trim()) {
      alert(isIndonesian ? "Judul program dan lembaga penyelenggara wajib diisi." : "Program title and provider are required.");
      return;
    }

    setSavingProgram(true);
    const reqArray = trainingRequirementsText
      .split("\n")
      .map(r => r.trim())
      .filter(Boolean);

    const payload: TrainingProgram = {
      id: data.id || `tr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: data.title.trim(),
      provider: data.provider.trim(),
      category: data.category || "Coding",
      type: data.type || "Free",
      format: data.format || "Online",
      duration: data.duration || "4 Minggu",
      certification: Boolean(data.certification),
      description: data.description || "",
      requirements: reqArray.length > 0 ? reqArray : ["Warga Negara Indonesia (WNI)"],
      imageUrl: data.imageUrl || "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&q=80&w=300",
      link: data.link || "https://digitalent.kominfo.go.id"
    };

    let updatedList: TrainingProgram[];
    if (isEdit) {
      updatedList = trainings.map(t => t.id === payload.id ? payload : t);
    } else {
      updatedList = [payload, ...trainings];
    }
    setTrainings(updatedList);
    onUpdateTrainings?.(updatedList);
    setTrainingModal(prev => ({ ...prev, isOpen: false }));
    showToast(isEdit 
      ? (isIndonesian ? "Program pelatihan berhasil diperbarui!" : "Training program updated successfully!") 
      : (isIndonesian ? "Program pelatihan baru berhasil ditambahkan ke katalog!" : "New training program added to catalog!")
    );

    try {
      if (isEdit) {
        await fetch(`/api/admin/trainings/${payload.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } else {
        await fetch("/api/admin/trainings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      }
    } catch (err) {
      console.warn("Training synced locally:", err);
    } finally {
      setSavingProgram(false);
    }
  };

  const handleDeleteTraining = async (id: string) => {
    setDeletingProgramId(id);
    const updatedList = trainings.filter(t => t.id !== id);
    setTrainings(updatedList);
    onUpdateTrainings?.(updatedList);
    setDeleteConfirmModal(null);
    showToast(isIndonesian ? "Program pelatihan berhasil dihapus dari katalog." : "Training program removed from catalog.");

    try {
      await fetch(`/api/admin/trainings/${id}`, { method: "DELETE" });
    } catch (err) {
      console.warn("Training delete synced locally:", err);
    } finally {
      setDeletingProgramId(null);
    }
  };

  // 2. Scholarship CRUD Handlers
  const handleOpenCreateScholarship = () => {
    setScholarshipRequirementsText("Warga Negara Indonesia (WNI)\nIPK Minimum 3.00 / 4.00\nSurat Penerimaan (LoA) atau Mahasiswa Aktif");
    setScholarshipModal({
      isOpen: true,
      isEdit: false,
      data: {
        title: "",
        provider: "",
        amount: "Pendanaan Penuh (Full Funding)",
        deadline: new Date(Date.now() + 45 * 86400000).toISOString().split("T")[0],
        category: "Teknologi & Sains",
        description: "",
        requirements: ["Warga Negara Indonesia (WNI)", "IPK Minimum 3.00 / 4.00", "Surat Penerimaan (LoA) atau Mahasiswa Aktif"],
        link: "https://beasiswa.kemdikbud.go.id"
      }
    });
  };

  const handleOpenEditScholarship = (sch: Scholarship) => {
    const reqText = Array.isArray(sch.requirements)
      ? sch.requirements.join("\n")
      : typeof sch.requirements === "string"
      ? sch.requirements
      : "Warga Negara Indonesia (WNI)\nIPK Minimum 3.00 / 4.00";
    setScholarshipRequirementsText(reqText);
    setScholarshipModal({
      isOpen: true,
      isEdit: true,
      data: { ...sch }
    });
  };

  const handleSaveScholarship = async (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    const { isEdit, data } = scholarshipModal;
    if (!data.title?.trim() || !data.provider?.trim()) {
      alert(isIndonesian ? "Nama program beasiswa dan lembaga penyedia wajib diisi." : "Scholarship title and provider are required.");
      return;
    }

    setSavingProgram(true);
    const reqArray = scholarshipRequirementsText
      .split("\n")
      .map(r => r.trim())
      .filter(Boolean);

    const payload: Scholarship = {
      id: data.id || `sch_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: data.title.trim(),
      provider: data.provider.trim(),
      amount: data.amount || "Pendanaan Penuh",
      deadline: data.deadline || new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
      category: data.category || "General Technology",
      description: data.description || "",
      requirements: reqArray.length > 0 ? reqArray : ["Warga Negara Indonesia (WNI)"],
      link: data.link || "https://beasiswa.kemdikbud.go.id"
    };

    let updatedList: Scholarship[];
    if (isEdit) {
      updatedList = scholarships.map(s => s.id === payload.id ? payload : s);
    } else {
      updatedList = [payload, ...scholarships];
    }
    setScholarships(updatedList);
    onUpdateScholarships?.(updatedList);
    setScholarshipModal(prev => ({ ...prev, isOpen: false }));
    showToast(isEdit 
      ? (isIndonesian ? "Program beasiswa berhasil diperbarui!" : "Scholarship program updated successfully!") 
      : (isIndonesian ? "Program beasiswa baru berhasil ditambahkan ke katalog!" : "New scholarship added to catalog!")
    );

    try {
      if (isEdit) {
        await fetch(`/api/admin/scholarships/${payload.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } else {
        await fetch("/api/admin/scholarships", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      }
    } catch (err) {
      console.warn("Scholarship synced locally:", err);
    } finally {
      setSavingProgram(false);
    }
  };

  const handleDeleteScholarship = async (id: string) => {
    setDeletingProgramId(id);
    const updatedList = scholarships.filter(s => s.id !== id);
    setScholarships(updatedList);
    onUpdateScholarships?.(updatedList);
    setDeleteConfirmModal(null);
    showToast(isIndonesian ? "Program beasiswa berhasil dihapus dari katalog." : "Scholarship removed from catalog.");

    try {
      await fetch(`/api/admin/scholarships/${id}`, { method: "DELETE" });
    } catch (err) {
      console.warn("Scholarship delete synced locally:", err);
    } finally {
      setDeletingProgramId(null);
    }
  };

  // 3. Internship CRUD Handlers
  const handleOpenCreateInternship = () => {
    setInternshipRequirementsText("Mahasiswa tingkat akhir atau fresh graduate\nPortofolio proyek relevan\nKemampuan komunikasi yang baik");
    setInternshipModal({
      isOpen: true,
      isEdit: false,
      data: {
        title: "",
        company: "",
        location: "Jakarta Selatan (Hybrid)",
        type: "Remote",
        duration: "3 - 6 Bulan",
        stipend: "Rp 5.000.000 / bulan",
        description: "",
        requirements: ["Mahasiswa tingkat akhir atau fresh graduate", "Portofolio proyek relevan"],
        link: "https://careers.talenthub.id"
      }
    });
  };

  const handleOpenEditInternship = (intern: Internship) => {
    const reqText = Array.isArray(intern.requirements)
      ? intern.requirements.join("\n")
      : typeof intern.requirements === "string"
      ? intern.requirements
      : "Mahasiswa tingkat akhir atau fresh graduate\nPortofolio proyek relevan";
    setInternshipRequirementsText(reqText);
    setInternshipModal({
      isOpen: true,
      isEdit: true,
      data: { ...intern }
    });
  };

  const handleSaveInternship = async (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    const { isEdit, data } = internshipModal;
    if (!data.title?.trim() || !data.company?.trim()) {
      alert(isIndonesian ? "Posisi magang dan nama mitra perusahaan wajib diisi." : "Internship position and company partner are required.");
      return;
    }

    setSavingProgram(true);
    const reqArray = internshipRequirementsText
      .split("\n")
      .map(r => r.trim())
      .filter(Boolean);

    const payload: Internship = {
      id: data.id || `int_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: data.title.trim(),
      company: data.company.trim(),
      location: data.location || "Jakarta / Remote",
      type: data.type || "Remote",
      duration: data.duration || "3 Bulan",
      stipend: data.stipend || "Rp 5.000.000 / bulan",
      description: data.description || "",
      requirements: reqArray.length > 0 ? reqArray : ["Mahasiswa tingkat akhir atau fresh graduate"],
      link: data.link || "https://careers.talenthub.id"
    };

    let updatedList: Internship[];
    if (isEdit) {
      updatedList = internships.map(i => i.id === payload.id ? payload : i);
    } else {
      updatedList = [payload, ...internships];
    }
    setInternships(updatedList);
    onUpdateInternships?.(updatedList);
    setInternshipModal(prev => ({ ...prev, isOpen: false }));
    showToast(isEdit 
      ? (isIndonesian ? "Program magang institusional berhasil diperbarui!" : "Internship program updated successfully!") 
      : (isIndonesian ? "Program magang baru berhasil ditambahkan ke katalog!" : "New internship added to catalog!")
    );

    try {
      if (isEdit) {
        await fetch(`/api/admin/internships/${payload.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } else {
        await fetch("/api/admin/internships", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      }
    } catch (err) {
      console.warn("Internship synced locally:", err);
    } finally {
      setSavingProgram(false);
    }
  };

  const handleDeleteInternship = async (id: string) => {
    setDeletingProgramId(id);
    const updatedList = internships.filter(i => i.id !== id);
    setInternships(updatedList);
    onUpdateInternships?.(updatedList);
    setDeleteConfirmModal(null);
    showToast(isIndonesian ? "Program magang berhasil dihapus dari katalog." : "Internship removed from catalog.");

    try {
      await fetch(`/api/admin/internships/${id}`, { method: "DELETE" });
    } catch (err) {
      console.warn("Internship delete synced locally:", err);
    } finally {
      setDeletingProgramId(null);
    }
  };

  // Metrics
  const pendingHrCount = recruiters.filter(r => !r.hrVerified || r.hrVerificationStatus === "pending_review").length;
  const verifiedCandidatesCount = candidates.filter(c => c.verified).length;
  const activeJobsCount = jobs.filter(j => j.status === "active").length;
  const totalProgramsCount = trainings.length + scholarships.length + internships.length;

  // Filtered Lists
  const filteredRecruiters = recruiters.filter(r => {
    const matchesSearch = 
      r.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.email.toLowerCase().includes(searchTerm.toLowerCase());
    const isPending = !r.hrVerified || r.hrVerificationStatus === "pending_review";
    const matchesStatus = 
      statusFilter === "all" ? true :
      statusFilter === "pending" ? isPending :
      statusFilter === "verified" ? !isPending : true;
    return matchesSearch && matchesStatus;
  });

  const filteredCandidates = candidates.filter(c => {
    const matchesSearch = 
      c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.headline.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = 
      statusFilter === "all" ? true :
      statusFilter === "verified" ? c.verified :
      statusFilter === "unverified" ? !c.verified : true;
    return matchesSearch && matchesStatus;
  });

  const filteredJobs = jobs.filter(j => {
    const matchesSearch = 
      j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || j.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredTrainings = trainings.filter(t => {
    const matchesSearch = 
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || t.category.toLowerCase() === categoryFilter.toLowerCase();
    const matchesFormat = formatFilter === "all" || t.format.toLowerCase() === formatFilter.toLowerCase();
    return matchesSearch && matchesCategory && matchesFormat;
  });

  const filteredScholarships = scholarships.filter(s => {
    const matchesSearch = 
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || s.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const filteredInternships = internships.filter(i => {
    const matchesSearch = 
      i.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || i.title.toLowerCase().includes(categoryFilter.toLowerCase()) || i.description.toLowerCase().includes(categoryFilter.toLowerCase());
    const matchesFormat = formatFilter === "all" || i.type.toLowerCase() === formatFilter.toLowerCase();
    return matchesSearch && matchesCategory && matchesFormat;
  });

  const filteredScholarshipApps = scholarshipApps.filter(app => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      term === "" ||
      app.candidateName.toLowerCase().includes(term) ||
      app.candidateEmail.toLowerCase().includes(term) ||
      app.trainingTitle.toLowerCase().includes(term) ||
      app.provider.toLowerCase().includes(term);
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleReviewScholarshipApp = (
    appId: string, 
    status: "under_review" | "interview_scheduled" | "approved" | "rejected"
  ) => {
    setScholarshipApps(prev => prev.map(a => {
      if (a.id === appId) {
        return {
          ...a,
          status,
          adminFeedback: reviewFeedbackInput || a.adminFeedback || (status === "approved" ? "Selamat! Berkas dan esai beasiswa Anda telah disetujui komite kurasi." : ""),
          reviewedAt: new Date().toISOString().split("T")[0],
          reviewedBy: "Super Admin TalentHub"
        };
      }
      return a;
    }));

    if (onUpdateScholarshipApplication) {
      onUpdateScholarshipApplication(
        appId, 
        status, 
        reviewFeedbackInput || (status === "approved" ? "Selamat! Berkas dan esai beasiswa Anda telah disetujui komite kurasi." : undefined)
      );
    }

    showToast(
      status === "approved" 
        ? (isIndonesian ? "Beasiswa disetujui! Kredensial dan akses pelatihan otomatis diterbitkan ke dasbor kandidat." : "Scholarship approved! Course access granted to candidate.")
        : status === "rejected"
        ? (isIndonesian ? "Status aplikasi diubah menjadi Ditolak." : "Scholarship application marked as Rejected.")
        : (isIndonesian ? "Status kurasi beasiswa diperbarui." : "Scholarship curation status updated.")
    );
    setInspectScholarshipApp(null);
    setReviewFeedbackInput("");
  };

  const pendingProposalsCount = proposals.filter(p => p.status === "pending").length;

  const filteredProposals = proposals.filter(p => {
    const term = proposalSearchTerm.toLowerCase();
    const matchesSearch = 
      p.institutionName.toLowerCase().includes(term) ||
      p.partnerName.toLowerCase().includes(term) ||
      p.email.toLowerCase().includes(term) ||
      p.phone.toLowerCase().includes(term) ||
      (p.programTitle ? p.programTitle.toLowerCase().includes(term) : false) ||
      (p.description ? p.description.toLowerCase().includes(term) : false);
    const matchesType = proposalTypeFilter === "all" || p.type === proposalTypeFilter;
    const matchesStatus = proposalStatusFilter === "all" || p.status === proposalStatusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200" id="super-admin-workspace">
      
      {/* Toast Feedback Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center space-x-3 animate-in slide-in-from-bottom-5 duration-200">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white ml-2 cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-slate-950 text-white rounded-3xl border border-slate-850 p-6 sm:p-8 shadow-xl mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="bg-purple-600 text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-md">
              {isIndonesian ? "Pusat Kontrol Super Admin" : "Super Admin Console"}
            </span>
            <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-md border border-emerald-800/60">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{isIndonesian ? "Sistem Aktif & Terlindungi" : "System Live & Monitored"}</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
            <ShieldCheck className="h-7 w-7 text-purple-400" />
            {isIndonesian ? "Tata Kelola & Pengawasan Platform" : "Platform Governance & Operations"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-semibold max-w-3xl">
            {isIndonesian 
              ? "Kelola verifikasi legalitas recruiter, validasi lencana talenta, moderasi lowongan kerja aktif, serta pengawasan direktori program pelatihan dan beasiswa terakreditasi." 
              : "Oversee recruiter accreditation, candidate credential verification, job opening moderation, and accredited training & scholarship programs."}
          </p>
        </div>

        {/* Global Action Toolbar */}
        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={fetchAllAdminData}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-200 hover:text-white border border-slate-800 text-xs font-bold transition-all cursor-pointer disabled:opacity-50 shadow-xs"
            title="Refresh All Telemetry"
            id="admin-refresh-telemetry-btn"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-purple-400" : "text-slate-400"}`} />
            <span>{isIndonesian ? "Segarkan Data" : "Refresh Data"}</span>
          </button>
        </div>
      </div>

      {/* Main Admin Navigation Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-3 mb-6 no-scrollbar border-b border-slate-200/80">
        <button
          onClick={() => { setActiveTab("overview"); setSearchTerm(""); setStatusFilter("all"); }}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "overview"
              ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
              : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200/70 hover:bg-slate-50"
          }`}
          id="admin-tab-overview"
        >
          <LayoutDashboard className="h-4 w-4" />
          <span>{isIndonesian ? "Ringkasan Ekosistem" : "Overview & Analytics"}</span>
        </button>

        <button
          onClick={() => { setActiveTab("inbox"); setProposalSearchTerm(""); setProposalStatusFilter("all"); setProposalTypeFilter("all"); }}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "inbox"
              ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
              : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200/70 hover:bg-slate-50"
          }`}
          id="admin-tab-inbox"
        >
          <Inbox className="h-4 w-4 text-blue-500" />
          <span>{isIndonesian ? "Pusat Pesan & Proposal Pelatihan" : "Inbox & Proposals"}</span>
          {pendingProposalsCount > 0 ? (
            <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse">
              {pendingProposalsCount}
            </span>
          ) : (
            <span className="bg-slate-100 text-slate-600 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
              {proposals.length}
            </span>
          )}
        </button>

        <button
          onClick={() => { setActiveTab("hr-verification"); setSearchTerm(""); setStatusFilter("all"); }}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "hr-verification"
              ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
              : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200/70 hover:bg-slate-50"
          }`}
          id="admin-tab-hr-verification"
        >
          <Building2 className="h-4 w-4 text-purple-500" />
          <span>{isIndonesian ? "Verifikasi HR & Perusahaan" : "HR & Company Verification"}</span>
          {pendingHrCount > 0 && (
            <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">
              {pendingHrCount}
            </span>
          )}
        </button>

        <button
          onClick={() => { setActiveTab("candidate-verification"); setSearchTerm(""); setStatusFilter("all"); }}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "candidate-verification"
              ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
              : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200/70 hover:bg-slate-50"
          }`}
          id="admin-tab-candidate-verification"
        >
          <ShieldCheck className="h-4 w-4 text-blue-500" />
          <span>{isIndonesian ? "Verifikasi Talenta" : "Talent Verification"}</span>
        </button>

        <button
          onClick={() => { setActiveTab("job-moderation"); setSearchTerm(""); setStatusFilter("all"); }}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "job-moderation"
              ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
              : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200/70 hover:bg-slate-50"
          }`}
          id="admin-tab-job-moderation"
        >
          <Briefcase className="h-4 w-4 text-emerald-500" />
          <span>{isIndonesian ? "Moderasi Lowongan" : "Job Moderation"}</span>
          <span className="bg-slate-100 text-slate-700 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
            {jobs.length}
          </span>
        </button>

        <button
          onClick={() => { setActiveTab("programs-catalog"); setSearchTerm(""); setCategoryFilter("all"); setFormatFilter("all"); }}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "programs-catalog"
              ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
              : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200/70 hover:bg-slate-50"
          }`}
          id="admin-tab-programs-catalog"
        >
          <BookOpen className="h-4 w-4 text-blue-500" />
          <span>{isIndonesian ? "Katalog Program & Pelatihan" : "Programs & Training Catalog"}</span>
          <span className="bg-blue-50 text-blue-700 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
            {totalProgramsCount}
          </span>
        </button>

        <button
          onClick={() => { setActiveTab("users-audit"); setSearchTerm(""); setStatusFilter("all"); }}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "users-audit"
              ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
              : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200/70 hover:bg-slate-50"
          }`}
          id="admin-tab-users-audit"
        >
          <Users className="h-4 w-4 text-slate-500" />
          <span>{isIndonesian ? "Pengguna & Log Audit" : "Users & Audit Logs"}</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. OVERVIEW & ANALYTICS VIEW */}
      {/* ========================================================================= */}
      {activeTab === "overview" && (
        <div className="space-y-8 animate-in fade-in duration-150" id="admin-overview-view">
          
          {/* Top Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  {isIndonesian ? "Total Talenta Terdaftar" : "Total Candidates"}
                </span>
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <Users className="h-4 w-4" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-black text-slate-900 tracking-tight">{candidates.length}</span>
                <div className="text-[11px] font-bold text-blue-600 mt-1 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>{verifiedCandidatesCount} {isIndonesian ? "Terverifikasi" : "Verified"}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  {isIndonesian ? "Mitra HR & Perusahaan" : "HR & Recruiters"}
                </span>
                <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                  <Building2 className="h-4 w-4" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-black text-slate-900 tracking-tight">{recruiters.length}</span>
                <div className="text-[11px] font-bold mt-1">
                  {pendingHrCount > 0 ? (
                    <span className="text-amber-600 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{pendingHrCount} {isIndonesian ? "Menunggu Verifikasi" : "Pending Review"}</span>
                    </span>
                  ) : (
                    <span className="text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>{isIndonesian ? "Semua Terakreditasi" : "All Accredited"}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  {isIndonesian ? "Lowongan Kerja Aktif" : "Active Job Listings"}
                </span>
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                  <Briefcase className="h-4 w-4" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-black text-slate-900 tracking-tight">{activeJobsCount}</span>
                <div className="text-[11px] font-bold text-emerald-600 mt-1">
                  {jobs.length} {isIndonesian ? "Total Terpublikasi" : "Total Openings"}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  {isIndonesian ? "Program Terkurasi" : "Curated Programs"}
                </span>
                <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                  <BookOpen className="h-4 w-4" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-black text-slate-900 tracking-tight">{totalProgramsCount}</span>
                <div className="text-[11px] font-bold text-slate-500 mt-1">
                  {trainings.length} {isIndonesian ? "Pelatihan" : "Trainings"} • {scholarships.length} {isIndonesian ? "Beasiswa" : "Grants"}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Action Alerts */}
          {pendingProposalsCount > 0 && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start space-x-3.5">
                <div className="p-2.5 bg-blue-600 text-white rounded-2xl shrink-0">
                  <Inbox className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    {isIndonesian ? `${pendingProposalsCount} Proposal Pelatihan & Kemitraan Menunggu Tanggapan` : `${pendingProposalsCount} Training Proposals Pending Action`}
                  </h3>
                  <p className="text-xs text-slate-600 font-semibold mt-0.5">
                    {isIndonesian 
                      ? "Mitra akademi dan industri telah mengajukan proposal kurikulum pelatihan. Hubungi PIC untuk berdiskusi lalu klik 'Setujui' untuk menerbitkan ke katalog." 
                      : "Partner institutions submitted training curriculum proposals. Connect with PIC and approve to publish directly into catalog."}
                  </p>
                </div>
              </div>
              <button
                onClick={() => { setActiveTab("inbox"); setProposalStatusFilter("pending"); }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all shrink-0 cursor-pointer shadow-xs"
              >
                {isIndonesian ? "Buka Inbox Proposal" : "Open Proposal Inbox"}
              </button>
            </div>
          )}

          {pendingHrCount > 0 && (
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200/80 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start space-x-3.5">
                <div className="p-2.5 bg-purple-600 text-white rounded-2xl shrink-0">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    {isIndonesian ? `${pendingHrCount} Pengajuan Verifikasi HR Menunggu Tinjauan` : `${pendingHrCount} HR Verifications Pending Review`}
                  </h3>
                  <p className="text-xs text-slate-600 font-semibold mt-0.5">
                    {isIndonesian 
                      ? "Beberapa perusahaan telah mengunggah dokumen legalitas (NIB/SIUP) atau mendaftarkan domain korporat untuk mendapatkan lencana verified sourcing." 
                      : "Recruiters have submitted company registration documents or business emails awaiting admin accreditation."}
                  </p>
                </div>
              </div>
              <button
                onClick={() => { setActiveTab("hr-verification"); setStatusFilter("pending"); }}
                className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all shrink-0 cursor-pointer shadow-xs"
              >
                {isIndonesian ? "Tinjau Dokumen HR" : "Review HR Submissions"}
              </button>
            </div>
          )}

          {/* Activity Logs & Platform Telemetry Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* System Health */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Activity className="h-4 w-4 text-purple-600" />
                  <span>{isIndonesian ? "Kesehatan Server & Keamanan" : "System Telemetry & Health"}</span>
                </h3>
                <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {telemetry?.systemUptime || "99.98%"} Uptime
                </span>
              </div>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-500 font-semibold">{isIndonesian ? "Beban CPU Rata-rata" : "CPU Load"}</span>
                  <span className="font-bold text-slate-900">{telemetry?.cpuUsage || "14.2%"}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-500 font-semibold">{isIndonesian ? "Penggunaan Memori" : "Memory Utilization"}</span>
                  <span className="font-bold text-slate-900">{telemetry?.memoryUsage || "428 MB / 1024 MB"}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-500 font-semibold">{isIndonesian ? "Sesi Admin Aktif" : "Active Sessions"}</span>
                  <span className="font-bold text-emerald-600">{telemetry?.totalUsers ? telemetry.totalUsers + 12 : 28} Active</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500 font-semibold">{isIndonesian ? "Enkripsi Database" : "Database Security"}</span>
                  <span className="font-bold text-purple-600 flex items-center gap-1">
                    <Lock className="h-3 w-3" />
                    <span>AES-256 Validated</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Verifications */}
            <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-blue-600" />
                  <span>{isIndonesian ? "Aktivitas Tata Kelola Terbaru" : "Recent Governance Actions"}</span>
                </h3>
                <span className="text-[11px] font-bold text-slate-400">Live Audit Trail</span>
              </div>
              <div className="space-y-3 text-xs">
                {recruiters.slice(0, 3).map((r, i) => (
                  <div key={r.id || i} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/70 border border-slate-100">
                    <div className="flex items-center space-x-3">
                      <div className="h-9 w-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs shrink-0">
                        {r.companyName ? r.companyName.charAt(0) : "C"}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{r.companyName}</div>
                        <div className="text-[11px] text-slate-500 font-medium">{r.fullName} • {r.email}</div>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${
                      r.hrVerified 
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                        : "bg-amber-50 text-amber-700 border border-amber-100"
                    }`}>
                      {r.hrVerified ? (isIndonesian ? "Terakreditasi" : "Verified") : (isIndonesian ? "Menunggu" : "Pending")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. OVERVIEW & ANALYTICS VIEW */}
      {/* ========================================================================= */}
      {activeTab === "overview" && (
        <div className="space-y-8 animate-in fade-in duration-150" id="admin-overview-view">
          {/* ... */}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. ADMIN INBOX & PARTNERSHIP PROPOSALS VIEW */}
      {/* ========================================================================= */}
      {activeTab === "inbox" && (
        <div className="space-y-6 animate-in fade-in duration-150" id="admin-inbox-view">
          {/* Header & Filter Controls */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-7 shadow-xs space-y-5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                    <Inbox className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                      <span>{isIndonesian ? "Pusat Pesan, Proposal Kemitraan & Aduan" : "Admin Inbox & Partnership Proposals"}</span>
                      {pendingProposalsCount > 0 && (
                        <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                          {pendingProposalsCount} {isIndonesian ? "Baru" : "New"}
                        </span>
                      )}
                    </h2>
                    <p className="text-xs text-slate-500 font-semibold">
                      {isIndonesian 
                        ? "Kelola proposal penyelenggaraan pelatihan dari mitra industri, diskusikan via telepon, dan klik 'Setujui' untuk menerbitkan program langsung ke katalog." 
                        : "Review inbound training proposals from partners, coordinate via phone/WhatsApp, and approve to publish directly to public catalog."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="relative min-w-[200px]">
                  <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={proposalSearchTerm}
                    onChange={(e) => setProposalSearchTerm(e.target.value)}
                    placeholder={isIndonesian ? "Cari PIC, instansi, judul..." : "Search PIC, organization, title..."}
                    className="w-full pl-8 pr-7 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <select
                  value={proposalTypeFilter}
                  onChange={(e) => setProposalTypeFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 cursor-pointer"
                >
                  <option value="all">{isIndonesian ? "Semua Jenis Pesan" : "All Types"}</option>
                  <option value="training_proposal">{isIndonesian ? "Proposal Pelatihan" : "Training Proposals"}</option>
                  <option value="complaint">{isIndonesian ? "Aduan / Kendala" : "Complaints"}</option>
                  <option value="general_inquiry">{isIndonesian ? "Pertanyaan Umum" : "General Inquiries"}</option>
                </select>

                <select
                  value={proposalStatusFilter}
                  onChange={(e) => setProposalStatusFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 cursor-pointer"
                >
                  <option value="all">{isIndonesian ? "Semua Status" : "All Status"}</option>
                  <option value="pending">{isIndonesian ? "Menunggu Diskusi" : "Pending Action"}</option>
                  <option value="under_review">{isIndonesian ? "Dalam Pembahasan" : "Under Review"}</option>
                  <option value="approved">{isIndonesian ? "Disetujui & Diterbitkan" : "Approved & Published"}</option>
                  <option value="rejected">{isIndonesian ? "Ditolak" : "Rejected"}</option>
                </select>
              </div>
            </div>

            {/* Workflow Guidance Card */}
            <div className="bg-gradient-to-r from-blue-50/80 via-slate-50 to-indigo-50/60 border border-blue-150 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-3 text-xs text-slate-700 font-semibold">
                <div className="h-8 w-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 font-bold">
                  <PhoneCall className="h-4 w-4" />
                </div>
                <div>
                  <span className="font-extrabold text-slate-900 block">{isIndonesian ? "Alur Kerja Standar Verifikasi Pelatihan:" : "Standard Partner Workflow:"}</span>
                  <span className="text-[11px] text-slate-600">
                    {isIndonesian 
                      ? "1. Mitra kirim form proposal → 2. Super admin hubungi PIC via Telepon / WhatsApp → 3. Capai kesepakatan → 4. Klik 'Setujui' untuk menerbitkan ke Katalog publik." 
                      : "1. Partner submits proposal → 2. Super admin calls PIC via phone/WhatsApp → 3. Finalize agreement → 4. Click 'Approve' to publish into Catalog."}
                  </span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[11px] font-extrabold text-blue-700 bg-white/90 border border-blue-200 px-3 py-1 rounded-xl shadow-2xs">
                  {filteredProposals.length} {isIndonesian ? "Pesan Ditemukan" : "Messages Found"}
                </span>
              </div>
            </div>

            {/* Split Master - Detail Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
              {/* Left Column: Proposal Tickets List */}
              <div className="lg:col-span-5 space-y-3 max-h-[750px] overflow-y-auto pr-1">
                {filteredProposals.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100 text-slate-400 space-y-2">
                    <Inbox className="h-8 w-8 mx-auto text-slate-300" />
                    <p className="text-xs font-semibold">{isIndonesian ? "Tidak ada proposal atau pesan yang cocok dengan filter." : "No proposals match current filter."}</p>
                  </div>
                ) : (
                  filteredProposals.map((prop) => {
                    const isSelected = selectedProposal?.id === prop.id;
                    const isTraining = prop.type === "training_proposal";
                    const isComplaint = prop.type === "complaint";

                    return (
                      <div
                        key={prop.id}
                        onClick={() => setSelectedProposal(prop)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer text-left space-y-2.5 ${
                          isSelected
                            ? "bg-blue-50/70 border-blue-400 ring-2 ring-blue-500/20 shadow-xs"
                            : "bg-white hover:bg-slate-50 border-slate-200/80 shadow-2xs"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            isTraining ? "bg-blue-100 text-blue-800" : isComplaint ? "bg-amber-100 text-amber-800" : "bg-purple-100 text-purple-800"
                          }`}>
                            {isTraining ? <GraduationCap className="h-3 w-3" /> : isComplaint ? <AlertCircle className="h-3 w-3" /> : <HelpCircle className="h-3 w-3" />}
                            <span>{isTraining ? (isIndonesian ? "Proposal Pelatihan" : "Training Proposal") : isComplaint ? (isIndonesian ? "Aduan" : "Complaint") : (isIndonesian ? "Pertanyaan" : "Inquiry")}</span>
                          </span>

                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                            prop.status === "approved" ? "bg-emerald-100 text-emerald-800" :
                            prop.status === "under_review" ? "bg-blue-100 text-blue-800" :
                            prop.status === "rejected" ? "bg-rose-100 text-rose-800" :
                            "bg-amber-100 text-amber-900 animate-pulse"
                          }`}>
                            {prop.status === "approved" ? (isIndonesian ? "Disetujui" : "Approved") :
                             prop.status === "under_review" ? (isIndonesian ? "Dalam Pembahasan" : "Under Review") :
                             prop.status === "rejected" ? (isIndonesian ? "Ditolak" : "Rejected") :
                             (isIndonesian ? "Menunggu Respon" : "Pending")}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-xs font-black text-slate-900 line-clamp-1">
                            {prop.programTitle || prop.institutionName}
                          </h4>
                          <p className="text-[11px] text-slate-600 font-semibold line-clamp-1">
                            {prop.partnerName} • <span className="text-slate-900 font-bold">{prop.institutionName}</span>
                          </p>
                        </div>

                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                          {prop.description || prop.syllabusOverview}
                        </p>

                        <div className="flex items-center justify-between pt-1 border-t border-slate-100/80 text-[10px] text-slate-400 font-semibold">
                          <span>{new Date(prop.submittedAt).toLocaleDateString(isIndonesian ? "id-ID" : "en-US", { day: "numeric", month: "short", year: "numeric" })}</span>
                          <span className="font-mono text-slate-400">ID: {prop.id.slice(-6)}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Right Column: Detailed Proposal Review Pane */}
              <div className="lg:col-span-7">
                {selectedProposal ? (
                  <div className="bg-slate-50/80 rounded-3xl border border-slate-200/90 p-5 sm:p-6 space-y-6">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-mono font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                            {selectedProposal.id}
                          </span>
                          <span className="text-xs text-slate-500 font-semibold">
                            {isIndonesian ? "Diterima pada" : "Submitted on"} {new Date(selectedProposal.submittedAt).toLocaleString(isIndonesian ? "id-ID" : "en-US")}
                          </span>
                        </div>
                        <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1">
                          {selectedProposal.programTitle || selectedProposal.institutionName}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-xl text-xs font-black ${
                          selectedProposal.status === "approved" ? "bg-emerald-100 text-emerald-800 border border-emerald-200" :
                          selectedProposal.status === "under_review" ? "bg-blue-100 text-blue-800 border border-blue-200" :
                          selectedProposal.status === "rejected" ? "bg-rose-100 text-rose-800 border border-rose-200" :
                          "bg-amber-100 text-amber-900 border border-amber-200"
                        }`}>
                          {selectedProposal.status === "approved" ? (isIndonesian ? "✓ Disetujui & Masuk Katalog" : "✓ Approved & in Catalog") :
                           selectedProposal.status === "under_review" ? (isIndonesian ? "◷ Sedang Dibahas via Telepon" : "◷ Under Review") :
                           selectedProposal.status === "rejected" ? (isIndonesian ? "✕ Ditolak" : "✕ Rejected") :
                           (isIndonesian ? "● Menunggu Diskusi Admin" : "● Pending Admin Action")}
                        </span>
                      </div>
                    </div>

                    {/* PIC & Partner Contact Card */}
                    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 space-y-3 shadow-2xs">
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <Building2 className="h-4 w-4 text-blue-600" />
                        <span>{isIndonesian ? "Informasi Kontak PIC & Lembaga Pengusul" : "Partner & PIC Contact Information"}</span>
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-3 bg-slate-50 rounded-xl space-y-0.5">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">{isIndonesian ? "Lembaga / Instansi" : "Organization"}</span>
                          <p className="font-extrabold text-slate-900 text-sm">{selectedProposal.institutionName}</p>
                        </div>

                        <div className="p-3 bg-slate-50 rounded-xl space-y-0.5">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">{isIndonesian ? "Nama Narahubung (PIC)" : "Contact Person (PIC)"}</span>
                          <p className="font-extrabold text-slate-900 text-sm">{selectedProposal.partnerName}</p>
                        </div>

                        <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">{isIndonesian ? "Nomor Telepon / WhatsApp" : "Phone / WhatsApp"}</span>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-800">{selectedProposal.phone}</span>
                            <a
                              href={`https://wa.me/${selectedProposal.phone.replace(/[^0-9]/g, "")}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] font-black text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors"
                            >
                              <PhoneCall className="h-3 w-3" />
                              <span>WhatsApp</span>
                            </a>
                          </div>
                        </div>

                        <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">{isIndonesian ? "Alamat Email Resmi" : "Official Email"}</span>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-800 truncate mr-2">{selectedProposal.email}</span>
                            <a
                              href={`mailto:${selectedProposal.email}?subject=Tindak Lanjut Proposal Program Pelatihan: ${encodeURIComponent(selectedProposal.programTitle || selectedProposal.institutionName)}`}
                              className="text-[11px] font-black text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors shrink-0"
                            >
                              <Mail className="h-3 w-3" />
                              <span>Email</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Proposal or Issue/Inquiry Details */}
                    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 space-y-4 shadow-2xs text-xs">
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        {selectedProposal.type === "training_proposal" ? (
                          <>
                            <GraduationCap className="h-4 w-4 text-purple-600" />
                            <span>{isIndonesian ? "Rincian Konten & Kurikulum Pelatihan" : "Curriculum & Program Proposal Details"}</span>
                          </>
                        ) : selectedProposal.type === "complaint" ? (
                          <>
                            <AlertCircle className="h-4 w-4 text-amber-600" />
                            <span>{isIndonesian ? "Rincian Laporan Kendala / Bug Pengguna" : "User Issue & Bug Report Details"}</span>
                          </>
                        ) : (
                          <>
                            <HelpCircle className="h-4 w-4 text-blue-600" />
                            <span>{isIndonesian ? "Rincian Pertanyaan & Bantuan Pengguna" : "General Inquiry & Support Details"}</span>
                          </>
                        )}
                      </h4>

                      {/* Meta Tags for Training Proposals */}
                      {selectedProposal.type === "training_proposal" && (
                        <div className="flex flex-wrap gap-2">
                          {selectedProposal.category && (
                            <span className="bg-blue-50 text-blue-700 font-bold px-2.5 py-1 rounded-lg border border-blue-100">
                              {selectedProposal.category}
                            </span>
                          )}
                          {selectedProposal.programType && (
                            <span className="bg-purple-50 text-purple-700 font-bold px-2.5 py-1 rounded-lg border border-purple-100">
                              {selectedProposal.programType}
                            </span>
                          )}
                          {selectedProposal.format && (
                            <span className="bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-lg border border-emerald-100">
                              {selectedProposal.format}
                            </span>
                          )}
                          {selectedProposal.duration && (
                            <span className="bg-slate-100 text-slate-700 font-bold px-2.5 py-1 rounded-lg border border-slate-200">
                              {selectedProposal.duration}
                            </span>
                          )}
                          {selectedProposal.certification !== undefined && (
                            <span className="bg-amber-50 text-amber-700 font-bold px-2.5 py-1 rounded-lg border border-amber-100">
                              {selectedProposal.certification ? (isIndonesian ? "Sertifikasi Resmi" : "Certified") : (isIndonesian ? "Tanpa Sertifikat" : "Non-Certified")}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Description / Message Body */}
                      <div className="space-y-1">
                        <span className="text-[11px] font-extrabold text-slate-500">
                          {selectedProposal.type === "training_proposal"
                            ? (isIndonesian ? "Deskripsi / Tujuan Pelatihan:" : "Program Description:")
                            : (isIndonesian ? "Isi Pesan / Rincian Kendala Pengguna:" : "User Message / Issue Details:")}
                        </span>
                        <p className="text-slate-800 bg-slate-50 p-3 rounded-xl leading-relaxed whitespace-pre-wrap">
                          {selectedProposal.description || (isIndonesian ? "Belum ada deskripsi rinci." : "No description provided.")}
                        </p>
                      </div>

                      {/* Syllabus Overview (Only for training) */}
                      {selectedProposal.type === "training_proposal" && selectedProposal.syllabusOverview && (
                        <div className="space-y-1">
                          <span className="text-[11px] font-extrabold text-slate-500">{isIndonesian ? "Ikhtisar Silabus / Modul Pembelajaran:" : "Syllabus Overview:"}</span>
                          <p className="text-slate-800 bg-slate-50 p-3 rounded-xl leading-relaxed whitespace-pre-wrap font-mono text-[11px]">
                            {selectedProposal.syllabusOverview}
                          </p>
                        </div>
                      )}

                      {/* Requirements (Only for training) */}
                      {selectedProposal.type === "training_proposal" && selectedProposal.requirements && selectedProposal.requirements.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="text-[11px] font-extrabold text-slate-500">{isIndonesian ? "Syarat Calon Peserta:" : "Eligibility Requirements:"}</span>
                          <ul className="space-y-1 bg-slate-50 p-3 rounded-xl">
                            {selectedProposal.requirements.map((req, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-slate-700">
                                <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                                <span>{req}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Registration Link */}
                      {selectedProposal.registrationLink && (
                        <div className="space-y-1">
                          <span className="text-[11px] font-extrabold text-slate-500">
                            {selectedProposal.type === "training_proposal"
                              ? (isIndonesian ? "Tautan Pendaftaran Mitra:" : "Registration Link:")
                              : (isIndonesian ? "Halaman URL Terkait:" : "Related Page URL:")}
                          </span>
                          <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl">
                            <Globe className="h-4 w-4 text-slate-400 shrink-0" />
                            <a
                              href={selectedProposal.registrationLink}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 font-bold hover:underline truncate"
                            >
                              {selectedProposal.registrationLink}
                            </a>
                            <ExternalLink className="h-3.5 w-3.5 text-blue-500 shrink-0 ml-auto" />
                          </div>
                        </div>
                      )}

                      {/* Super Admin Internal Notes */}
                      <div className="space-y-1 pt-2 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-extrabold text-slate-500">{isIndonesian ? "Catatan Super Admin:" : "Super Admin Internal Notes:"}</span>
                          <button
                            onClick={() => handleOpenStatusModal(selectedProposal, selectedProposal.status)}
                            className="text-[11px] font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Pencil className="h-3 w-3" />
                            <span>{isIndonesian ? "Edit Catatan" : "Edit Notes"}</span>
                          </button>
                        </div>
                        <p className="text-slate-700 bg-amber-50/60 border border-amber-200/60 p-2.5 rounded-xl italic">
                          {selectedProposal.adminNotes || (isIndonesian ? "Belum ada catatan internal." : "No internal notes recorded yet.")}
                        </p>
                      </div>
                    </div>

                    {/* Action Execution Toolbar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <div className="flex items-center gap-2">
                        {selectedProposal.status !== "under_review" && selectedProposal.status !== "approved" && (
                          <button
                            type="button"
                            onClick={() => handleOpenStatusModal(selectedProposal, "under_review")}
                            className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                          >
                            <PhoneCall className="h-3.5 w-3.5" />
                            <span>{isIndonesian ? "Tandai Sedang Ditelepon" : "Mark Under Discussion"}</span>
                          </button>
                        )}

                        {selectedProposal.status !== "rejected" && selectedProposal.status !== "approved" && (
                          <button
                            type="button"
                            onClick={() => handleOpenStatusModal(selectedProposal, "rejected")}
                            className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                          >
                            <X className="h-3.5 w-3.5" />
                            <span>{isIndonesian ? "Tolak Proposal" : "Reject Proposal"}</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleDeleteProposal(selectedProposal.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                          title={isIndonesian ? "Hapus Pesan" : "Delete Message"}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Primary Action Button */}
                      {selectedProposal.type === "training_proposal" ? (
                        selectedProposal.status !== "approved" ? (
                          <button
                            type="button"
                            onClick={() => handleOpenApproveModal(selectedProposal)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all shadow-md shadow-emerald-600/20 cursor-pointer flex items-center gap-2"
                            id="btn-approve-and-create-program"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            <span>{isIndonesian ? "Setujui & Publikasikan ke Katalog" : "Approve & Publish to Catalog"}</span>
                          </button>
                        ) : (
                          <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            <span>{isIndonesian ? "Program Pelatihan Sudah Diterbitkan" : "Training Program Active in Catalog"}</span>
                          </div>
                        )
                      ) : (
                        selectedProposal.status !== "approved" ? (
                          <button
                            type="button"
                            onClick={() => handleOpenStatusModal(selectedProposal, "approved")}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all shadow-md shadow-emerald-600/20 cursor-pointer flex items-center gap-2"
                            id="btn-resolve-issue-inquiry"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            <span>{isIndonesian ? "Tandai Sudah Selesai Ditangani" : "Mark as Resolved & Handled"}</span>
                          </button>
                        ) : (
                          <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            <span>{isIndonesian ? "Laporan Selesai Ditangani" : "Issue Marked as Resolved"}</span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50/80 rounded-3xl border border-slate-200/70 p-12 text-center space-y-3 flex flex-col items-center justify-center min-h-[400px]">
                    <div className="h-12 w-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 shadow-2xs">
                      <Inbox className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-800">
                        {isIndonesian ? "Pilih Pesan atau Proposal" : "Select a Message or Proposal"}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium max-w-sm mt-1">
                        {isIndonesian 
                          ? "Klik salah satu tiket proposal di daftar sebelah kiri untuk meninjau narahubung PIC, silabus, dan mengeksekusi persetujuan program." 
                          : "Click any ticket in the left list to review contact details, curriculum syllabus, and approve training publication."}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. HR & RECRUITER VERIFICATION VIEW */}
      {/* ========================================================================= */}
      {activeTab === "hr-verification" && (
        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-7 shadow-xs space-y-6 animate-in fade-in duration-150" id="admin-hr-verification-view">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-purple-600" />
                <span>{isIndonesian ? "Verifikasi Legalitas Recruiter & HR" : "HR & Corporate Verification"}</span>
              </h2>
              <p className="text-xs text-slate-500 font-semibold">
                {isIndonesian ? "Tinjau legalitas perusahaan, domain email bisnis, dan dokumen SIUP/NIB." : "Review corporate documents, business email domains, and accreditation."}
              </p>
            </div>

            {/* Filter controls */}
            <div className="flex items-center gap-2.5">
              <div className="relative min-w-[200px]">
                <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={isIndonesian ? "Cari nama / perusahaan..." : "Search recruiter / company..."}
                  className="w-full pl-8 pr-7 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 cursor-pointer"
              >
                <option value="all">{isIndonesian ? "Semua Status" : "All Status"}</option>
                <option value="pending">{isIndonesian ? "Menunggu Verifikasi" : "Pending Review"}</option>
                <option value="verified">{isIndonesian ? "Terakreditasi" : "Verified"}</option>
              </select>
            </div>
          </div>

          {/* Table of Recruiters */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse table-fixed min-w-[760px]">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-widest text-[10px] font-extrabold bg-slate-50/50">
                  <th className="py-3.5 pl-4 w-[28%]">{isIndonesian ? "Perusahaan & PIC HR" : "Company & HR Lead"}</th>
                  <th className="py-3.5 px-3 w-[22%]">{isIndonesian ? "Email & Domain" : "Business Email"}</th>
                  <th className="py-3.5 px-3 w-[18%]">{isIndonesian ? "Metode Verifikasi" : "Verification Type"}</th>
                  <th className="py-3.5 px-3 w-[16%]">{isIndonesian ? "Status Akreditasi" : "Accreditation Status"}</th>
                  <th className="py-3.5 pr-4 text-right w-[16%]">{isIndonesian ? "Aksi Tindakan" : "Action"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredRecruiters.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-slate-400 font-semibold">
                      {isIndonesian ? "Tidak ada profil recruiter yang sesuai dengan filter." : "No recruiter records match the filter."}
                    </td>
                  </tr>
                ) : (
                  filteredRecruiters.map((rec) => {
                    const isVerified = Boolean(rec.hrVerified && rec.hrVerificationStatus === "verified");
                    return (
                      <tr key={rec.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 pl-4">
                          <div className="flex items-center space-x-3">
                            <div className="h-9 w-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs shrink-0 border border-purple-200">
                              {rec.companyName ? rec.companyName.charAt(0) : "C"}
                            </div>
                            <div className="overflow-hidden">
                              <div className="font-bold text-slate-900 truncate">{rec.companyName}</div>
                              <div className="text-[11px] text-slate-500 font-medium truncate">{rec.fullName} • {rec.hrJobTitle || "Talent Lead"}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-slate-600 font-semibold truncate">
                          {rec.email}
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="inline-block bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-bold">
                            {rec.hrVerificationMethod === "corporate_domain" ? "Corporate Domain" : rec.hrVerificationMethod === "linkedin_document" ? "Legal Doc & NIB" : "Admin Review"}
                          </span>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                            isVerified
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              : "bg-amber-50 text-amber-700 border border-amber-100"
                          }`}>
                            {isVerified ? (
                              <>
                                <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                                <span>{isIndonesian ? "Terakreditasi" : "Verified HR"}</span>
                              </>
                            ) : (
                              <>
                                <Clock className="h-3 w-3 text-amber-600" />
                                <span>{isIndonesian ? "Menunggu Verifikasi" : "Pending Review"}</span>
                              </>
                            )}
                          </span>
                        </td>
                        <td className="py-3.5 pr-4 text-right space-x-1.5">
                          <button
                            onClick={() => setInspectRecruiter(rec)}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer inline-flex items-center gap-1"
                          >
                            <Eye className="h-3 w-3" />
                            <span>{isIndonesian ? "Periksa" : "Inspect"}</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. CANDIDATE & TALENT VERIFICATION VIEW */}
      {/* ========================================================================= */}
      {activeTab === "candidate-verification" && (
        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-7 shadow-xs space-y-6 animate-in fade-in duration-150" id="admin-candidate-verification-view">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-blue-600" />
                <span>{isIndonesian ? "Verifikasi Talenta & Lencana Keahlian" : "Candidate & Talent Verification"}</span>
              </h2>
              <p className="text-xs text-slate-500 font-semibold">
                {isIndonesian ? "Audit keabsahan profil talenta, portfolio terverifikasi, dan skor ATS." : "Audit candidate identities, verified portfolio repositories, and ATS readiness."}
              </p>
            </div>

            {/* Filter controls */}
            <div className="flex items-center gap-2.5">
              <div className="relative min-w-[200px]">
                <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={isIndonesian ? "Cari nama / keahlian..." : "Search talent / skills..."}
                  className="w-full pl-8 pr-7 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 cursor-pointer"
              >
                <option value="all">{isIndonesian ? "Semua Status" : "All Status"}</option>
                <option value="verified">{isIndonesian ? "Terverifikasi" : "Verified Badge"}</option>
                <option value="unverified">{isIndonesian ? "Belum Terverifikasi" : "Unverified"}</option>
              </select>
            </div>
          </div>

          {/* Candidates Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse table-fixed min-w-[760px]">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-widest text-[10px] font-extrabold bg-slate-50/50">
                  <th className="py-3.5 pl-4 w-[30%]">{isIndonesian ? "Talenta & Keahlian Utama" : "Candidate & Title"}</th>
                  <th className="py-3.5 px-3 w-[18%]">{isIndonesian ? "Lokasi & Gaji" : "Location & Salary"}</th>
                  <th className="py-3.5 px-3 w-[16%]">{isIndonesian ? "Kelengkapan Profil" : "Profile Completeness"}</th>
                  <th className="py-3.5 px-3 w-[18%]">{isIndonesian ? "Lencana Terverifikasi" : "Verified Status"}</th>
                  <th className="py-3.5 pr-4 text-right w-[18%]">{isIndonesian ? "Aksi Moderasi" : "Action"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredCandidates.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-slate-400 font-semibold">
                      {isIndonesian ? "Tidak ada profil kandidat yang sesuai." : "No candidates found."}
                    </td>
                  </tr>
                ) : (
                  filteredCandidates.map((cand) => (
                    <tr key={cand.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 pl-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={cand.avatar || DEFAULT_PROFILE_IMAGE}
                            alt={cand.fullName}
                            className="h-9 w-9 rounded-xl object-cover shrink-0 border border-slate-100"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = DEFAULT_PROFILE_IMAGE;
                            }}
                            referrerPolicy="no-referrer"
                          />
                          <div className="overflow-hidden">
                            <div className="font-bold text-slate-900 truncate">{cand.fullName}</div>
                            <div className="text-[11px] text-slate-500 font-medium truncate">{cand.headline}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-slate-600 font-semibold">
                        <div className="truncate">{cand.location}</div>
                        <div className="text-[10px] text-slate-400 truncate">{cand.expectedSalary}</div>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-bold text-slate-700">
                            <span>{cand.profileCompletion || 85}%</span>
                            <span className="text-blue-600">ATS {cand.atsScore || 90}</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className="bg-blue-600 h-full rounded-full" 
                              style={{ width: `${cand.profileCompletion || 85}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        {cand.verified ? (
                          <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold">
                            <CheckCircle2 className="h-3 w-3 text-blue-600" />
                            <span>{isIndonesian ? "Terverifikasi" : "Verified Badge"}</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[10px] font-semibold">
                            {isIndonesian ? "Standar" : "Unverified"}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 pr-4 text-right space-x-1.5">
                        <button
                          onClick={() => handleCandidateVerificationAction(cand.id)}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                            cand.verified 
                              ? "bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 border border-slate-200" 
                              : "bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
                          }`}
                        >
                          {cand.verified ? (isIndonesian ? "Cabut Verifikasi" : "Unverify") : (isIndonesian ? "Verifikasi Profil" : "Verify Badge")}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. JOB OPENINGS MODERATION VIEW */}
      {/* ========================================================================= */}
      {activeTab === "job-moderation" && (
        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-7 shadow-xs space-y-6 animate-in fade-in duration-150" id="admin-job-moderation-view">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-emerald-600" />
                <span>{isIndonesian ? "Moderasi & Audit Lowongan Kerja" : "Job Openings Moderation"}</span>
              </h2>
              <p className="text-xs text-slate-500 font-semibold">
                {isIndonesian ? "Pengawasan seluruh lowongan kerja aktif yang dipublikasikan oleh recruiter." : "Audit all active vacancies posted by recruiters across the platform."}
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="relative min-w-[200px]">
                <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={isIndonesian ? "Cari posisi / perusahaan..." : "Search position / company..."}
                  className="w-full pl-8 pr-7 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 cursor-pointer"
              >
                <option value="all">{isIndonesian ? "Semua Status" : "All Status"}</option>
                <option value="active">{isIndonesian ? "Aktif" : "Active"}</option>
                <option value="paused">{isIndonesian ? "Ditangguhkan" : "Paused"}</option>
                <option value="closed">{isIndonesian ? "Ditutup" : "Closed"}</option>
              </select>
            </div>
          </div>

          {/* Job Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse table-fixed min-w-[760px]">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-widest text-[10px] font-extrabold bg-slate-50/50">
                  <th className="py-3.5 pl-4 w-[32%]">{isIndonesian ? "Posisi & Perusahaan" : "Job Title & Company"}</th>
                  <th className="py-3.5 px-3 w-[20%]">{isIndonesian ? "Rentang Gaji & Lokasi" : "Salary & Location"}</th>
                  <th className="py-3.5 px-3 w-[18%]">{isIndonesian ? "Tipe Pekerjaan" : "Employment Type"}</th>
                  <th className="py-3.5 px-3 w-[14%]">{isIndonesian ? "Status Lowongan" : "Status"}</th>
                  <th className="py-3.5 pr-4 text-right w-[16%]">{isIndonesian ? "Aksi Moderasi" : "Action"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredJobs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-slate-400 font-semibold">
                      {isIndonesian ? "Tidak ada lowongan yang sesuai." : "No job openings found."}
                    </td>
                  </tr>
                ) : (
                  filteredJobs.map((job) => (
                    <tr key={job.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 pl-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={job.companyLogo || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=100"}
                            alt={job.companyName}
                            className="h-9 w-9 rounded-xl object-cover shrink-0 border border-slate-100"
                            referrerPolicy="no-referrer"
                          />
                          <div className="overflow-hidden">
                            <div className="font-bold text-slate-900 truncate">{job.title}</div>
                            <div className="text-[11px] text-slate-500 font-medium truncate">{job.companyName}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-slate-600 font-semibold truncate">
                        <div>{job.salaryRange}</div>
                        <div className="text-[10px] text-slate-400">{job.location}</div>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-bold">
                          {job.type} • {job.experienceLevel}
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                          job.status === "active"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : job.status === "paused"
                            ? "bg-amber-50 text-amber-700 border border-amber-100"
                            : "bg-slate-100 text-slate-600"
                        }`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="py-3.5 pr-4 text-right space-x-1">
                        <button
                          onClick={() => handleJobStatusAction(job.id, job.status === "active" ? "paused" : "active")}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                        >
                          {job.status === "active" ? (isIndonesian ? "Tangguhkan" : "Pause") : (isIndonesian ? "Aktifkan" : "Activate")}
                        </button>
                        <button
                          onClick={() => handleJobStatusAction(job.id, "delete")}
                          className="bg-red-50 hover:bg-red-100 text-red-700 px-2 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                          title="Hapus Lowongan"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. PROGRAMS & TRAINING CATALOG VIEW */}
      {/* ========================================================================= */}
      {activeTab === "programs-catalog" && (
        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-7 shadow-xs space-y-6 animate-in fade-in duration-150" id="admin-view-trainings">
          
          {/* Header & Subtabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="flex items-center space-x-1.5 p-1 bg-slate-100 rounded-2xl max-w-fit">
              <button
                id="admin-subtab-trainings"
                onClick={() => {
                  setCatalogSubTab("trainings");
                  setCategoryFilter("all");
                  setFormatFilter("all");
                }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  catalogSubTab === "trainings"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <BookOpen className="h-3.5 w-3.5 text-blue-600" />
                <span>{isIndonesian ? "Pelatihan & Bootcamp" : "Trainings & Bootcamps"}</span>
                <span className="bg-blue-50 text-blue-700 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
                  {trainings.length}
                </span>
              </button>

              <button
                id="admin-subtab-scholarships"
                onClick={() => {
                  setCatalogSubTab("scholarships");
                  setCategoryFilter("all");
                  setFormatFilter("all");
                }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  catalogSubTab === "scholarships"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <GraduationCap className="h-3.5 w-3.5 text-purple-600" />
                <span>{isIndonesian ? "Program Beasiswa" : "Scholarships"}</span>
                <span className="bg-purple-50 text-purple-700 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
                  {scholarships.length}
                </span>
              </button>

              <button
                id="admin-subtab-internships"
                onClick={() => {
                  setCatalogSubTab("internships");
                  setCategoryFilter("all");
                  setFormatFilter("all");
                }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  catalogSubTab === "internships"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Briefcase className="h-3.5 w-3.5 text-emerald-600" />
                <span>{isIndonesian ? "Magang Institusional" : "Internships"}</span>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
                  {internships.length}
                </span>
              </button>

              <button
                id="admin-subtab-scholarship-apps"
                onClick={() => {
                  setCatalogSubTab("scholarship-applications");
                  setCategoryFilter("all");
                  setFormatFilter("all");
                }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  catalogSubTab === "scholarship-applications"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <GraduationCap className="h-3.5 w-3.5 text-purple-600" />
                <span>{isIndonesian ? "Kurasi Beasiswa Kandidat" : "Candidate Applications"}</span>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
                  {scholarshipApps.length}
                </span>
              </button>
            </div>

            {/* Search & Filter Toolbar with Add Button */}
            <div className="flex flex-wrap items-center gap-2.5">
              {catalogSubTab !== "scholarship-applications" && (
                <button
                  id="admin-btn-create-program"
                  onClick={() => {
                    if (catalogSubTab === "trainings") handleOpenCreateTraining();
                    else if (catalogSubTab === "scholarships") handleOpenCreateScholarship();
                    else handleOpenCreateInternship();
                  }}
                  className="inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>
                    {catalogSubTab === "trainings" 
                      ? (isIndonesian ? "Tambah Pelatihan" : "Add Training")
                      : catalogSubTab === "scholarships"
                      ? (isIndonesian ? "Tambah Beasiswa" : "Add Scholarship")
                      : (isIndonesian ? "Tambah Magang" : "Add Internship")
                    }
                  </span>
                </button>
              )}

              <div className="relative min-w-[200px]">
                <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={
                    catalogSubTab === "trainings"
                      ? (isIndonesian ? "Cari pelatihan / mitra..." : "Search trainings...")
                      : catalogSubTab === "scholarships"
                      ? (isIndonesian ? "Cari beasiswa / penyedia..." : "Search scholarships...")
                      : catalogSubTab === "internships"
                      ? (isIndonesian ? "Cari posisi / perusahaan..." : "Search internships...")
                      : (isIndonesian ? "Cari kandidat / program beasiswa..." : "Search applicant / program...")
                  }
                  className="w-full pl-8 pr-7 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {catalogSubTab === "trainings" && (
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-700 cursor-pointer"
                >
                  <option value="all">{isIndonesian ? "Semua Kategori" : "All Categories"}</option>
                  <option value="Coding">Coding</option>
                  <option value="Design">Design</option>
                  <option value="Product">Product</option>
                  <option value="Data">Data</option>
                  <option value="Marketing">Marketing</option>
                </select>
              )}

              {(catalogSubTab === "trainings" || catalogSubTab === "internships") && (
                <select
                  value={formatFilter}
                  onChange={(e) => setFormatFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-700 cursor-pointer"
                >
                  <option value="all">{isIndonesian ? "Semua Format" : "All Formats"}</option>
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              )}

              {catalogSubTab === "scholarship-applications" && (
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-700 cursor-pointer"
                >
                  <option value="all">{isIndonesian ? "Semua Status Kurasi" : "All Curation Status"}</option>
                  <option value="submitted">{isIndonesian ? "Menunggu Kurasi (Submitted)" : "Submitted"}</option>
                  <option value="under_review">{isIndonesian ? "Sedang Ditinjau (Under Review)" : "Under Review"}</option>
                  <option value="interview_scheduled">{isIndonesian ? "Tahap Wawancara" : "Interview Scheduled"}</option>
                  <option value="approved">{isIndonesian ? "Disetujui (Approved)" : "Approved"}</option>
                  <option value="rejected">{isIndonesian ? "Ditolak (Rejected)" : "Rejected"}</option>
                </select>
              )}
            </div>
          </div>

          {/* 1. TRAININGS TABLE */}
          {catalogSubTab === "trainings" && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse table-fixed min-w-[760px]" id="admin-trainings-table">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-widest text-[10px] font-extrabold bg-slate-50/50">
                    <th className="py-3.5 pl-4 w-[32%]">{isIndonesian ? "Program & Kurikulum" : "Program & Curriculum"}</th>
                    <th className="py-3.5 px-3 w-[20%]">{isIndonesian ? "Penyelenggara / Mitra" : "Provider / Organization"}</th>
                    <th className="py-3.5 px-3 w-[16%]">{isIndonesian ? "Kategori & Tipe" : "Category & Type"}</th>
                    <th className="py-3.5 px-3 w-[14%]">{isIndonesian ? "Format & Durasi" : "Format & Duration"}</th>
                    <th className="py-3.5 px-3 w-[10%]">{isIndonesian ? "Sertifikasi" : "Certification"}</th>
                    <th className="py-3.5 pr-4 text-right w-[120px]">{isIndonesian ? "Aksi" : "Action"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredTrainings.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-slate-400 font-semibold">
                        {isIndonesian ? "Tidak ada program pelatihan yang sesuai." : "No training programs found."}
                      </td>
                    </tr>
                  ) : (
                    filteredTrainings.map((prog) => (
                      <tr key={prog.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 pl-4">
                          <div className="flex items-center space-x-3">
                            <img 
                              src={prog.imageUrl || "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&q=80&w=120"} 
                              alt={prog.title}
                              className="h-10 w-10 rounded-xl object-cover shrink-0 border border-slate-100"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&q=80&w=120";
                              }}
                              referrerPolicy="no-referrer"
                            />
                            <div className="overflow-hidden">
                              <div className="font-bold text-slate-900 truncate">{prog.title}</div>
                              <div className="text-[11px] text-slate-500 font-medium truncate">{prog.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-slate-600 font-semibold truncate">
                          {prog.provider}
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="space-y-1">
                            <span className="inline-block bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-bold">
                              {prog.category}
                            </span>
                            <span className={`inline-block ml-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                              prog.type === "Free" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                              prog.type === "Government" ? "bg-blue-50 text-blue-700 border border-blue-100" :
                              "bg-purple-50 text-purple-700 border border-purple-100"
                            }`}>
                              {prog.type}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-slate-600 font-semibold truncate">
                          {prog.format} • {prog.duration}
                        </td>
                        <td className="py-3.5 px-3">
                          {prog.certification ? (
                            <span className="text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full uppercase inline-flex items-center gap-1">
                              <CheckCircle2 className="h-2.5 w-2.5 text-blue-600" />
                              <span>{isIndonesian ? "Sertifikat" : "Certified"}</span>
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-semibold">Standard</span>
                          )}
                        </td>
                        <td className="py-3.5 pr-4 text-right">
                          <div className="flex items-center justify-end space-x-1">
                            <button
                              onClick={() => setSelectedProgramDetail({ type: "training", data: prog })}
                              className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-1.5 rounded-lg text-[11px] font-bold cursor-pointer transition-all"
                              title={isIndonesian ? "Lihat Detail" : "View Details"}
                            >
                              <Eye className="h-3.5 w-3.5 text-slate-600" />
                            </button>
                            <button
                              onClick={() => handleOpenEditTraining(prog)}
                              className="bg-blue-50 hover:bg-blue-100 text-blue-700 p-1.5 rounded-lg text-[11px] font-bold cursor-pointer transition-all"
                              title={isIndonesian ? "Edit Pelatihan" : "Edit Training"}
                            >
                              <Edit3 className="h-3.5 w-3.5 text-blue-600" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmModal({ isOpen: true, type: "training", id: prog.id, title: prog.title })}
                              className="bg-red-50 hover:bg-red-100 text-red-700 p-1.5 rounded-lg text-[11px] font-bold cursor-pointer transition-all"
                              title={isIndonesian ? "Hapus Pelatihan" : "Delete Training"}
                            >
                              <Trash2 className="h-3.5 w-3.5 text-red-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* 2. SCHOLARSHIPS TABLE */}
          {catalogSubTab === "scholarships" && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse table-fixed min-w-[760px]" id="admin-scholarships-table">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-widest text-[10px] font-extrabold bg-slate-50/50">
                    <th className="py-3.5 pl-4 w-[31%]">{isIndonesian ? "Nama Beasiswa & Kategori" : "Scholarship & Category"}</th>
                    <th className="py-3.5 px-3 w-[21%]">{isIndonesian ? "Lembaga Penyelenggara" : "Provider Institution"}</th>
                    <th className="py-3.5 px-3 w-[22%]">{isIndonesian ? "Kuota & Status Seleksi" : "Quota & Selection Status"}</th>
                    <th className="py-3.5 px-3 w-[14%]">{isIndonesian ? "Batas Pendaftaran" : "Deadline"}</th>
                    <th className="py-3.5 pr-4 text-right w-[120px]">{isIndonesian ? "Aksi" : "Action"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredScholarships.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-slate-400 font-semibold">
                        {isIndonesian ? "Tidak ada program beasiswa yang sesuai." : "No scholarships found."}
                      </td>
                    </tr>
                  ) : (
                    filteredScholarships.map((sch) => (
                      <tr key={sch.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 pl-4">
                          <div className="overflow-hidden">
                            <div className="font-bold text-slate-900 truncate">{sch.title}</div>
                            <span className="inline-block bg-purple-50 text-purple-700 border border-purple-100 px-2 py-0.5 rounded text-[10px] font-bold mt-0.5">
                              {sch.category}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-slate-600 font-semibold truncate">
                          {sch.provider}
                        </td>
                        <td className="py-3.5 px-3 font-bold text-slate-900">
                          <div className="flex flex-col">
                            <span className="text-xs font-black text-purple-700">
                              {sch.quota || 50} {isIndonesian ? "Kursi Tersedia" : "Spots Available"}
                            </span>
                            <span className="text-[10px] text-slate-500 font-semibold">
                              {(sch.applicantCount || 1000).toLocaleString('id-ID')}+ {isIndonesian ? "Pelamar (Tahap Kurasi)" : "Applicants (In Review)"}
                            </span>
                            <span className="text-[9px] text-slate-400 font-medium mt-0.5">
                              {isIndonesian ? "*Rincian dana dibuka pasca lolos" : "*Funding revealed post-selection"}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-slate-600">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3 text-slate-400" />
                            <span>{sch.deadline}</span>
                          </div>
                        </td>
                        <td className="py-3.5 pr-4 text-right">
                          <div className="flex items-center justify-end space-x-1">
                            <button
                              onClick={() => setSelectedProgramDetail({ type: "scholarship", data: sch })}
                              className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-1.5 rounded-lg text-[11px] font-bold cursor-pointer transition-all"
                              title={isIndonesian ? "Lihat Detail" : "View Details"}
                            >
                              <Eye className="h-3.5 w-3.5 text-slate-600" />
                            </button>
                            <button
                              onClick={() => handleOpenEditScholarship(sch)}
                              className="bg-purple-50 hover:bg-purple-100 text-purple-700 p-1.5 rounded-lg text-[11px] font-bold cursor-pointer transition-all"
                              title={isIndonesian ? "Edit Beasiswa" : "Edit Scholarship"}
                            >
                              <Edit3 className="h-3.5 w-3.5 text-purple-600" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmModal({ isOpen: true, type: "scholarship", id: sch.id, title: sch.title })}
                              className="bg-red-50 hover:bg-red-100 text-red-700 p-1.5 rounded-lg text-[11px] font-bold cursor-pointer transition-all"
                              title={isIndonesian ? "Hapus Beasiswa" : "Delete Scholarship"}
                            >
                              <Trash2 className="h-3.5 w-3.5 text-red-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* 3. INTERNSHIPS TABLE */}
          {catalogSubTab === "internships" && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse table-fixed min-w-[760px]" id="admin-internships-table">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-widest text-[10px] font-extrabold bg-slate-50/50">
                    <th className="py-3.5 pl-4 w-[32%]">{isIndonesian ? "Posisi & Lokasi" : "Position & Location"}</th>
                    <th className="py-3.5 px-3 w-[22%]">{isIndonesian ? "Perusahaan Mitra" : "Company Partner"}</th>
                    <th className="py-3.5 px-3 w-[16%]">{isIndonesian ? "Tipe Kerja" : "Work Type"}</th>
                    <th className="py-3.5 px-3 w-[18%]">{isIndonesian ? "Durasi & Uang Saku" : "Duration & Stipend"}</th>
                    <th className="py-3.5 pr-4 text-right w-[120px]">{isIndonesian ? "Aksi" : "Action"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredInternships.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-slate-400 font-semibold">
                        {isIndonesian ? "Tidak ada program magang yang sesuai." : "No internships found."}
                      </td>
                    </tr>
                  ) : (
                    filteredInternships.map((intn) => (
                      <tr key={intn.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 pl-4">
                          <div className="overflow-hidden">
                            <div className="font-bold text-slate-900 truncate">{intn.title}</div>
                            <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-0.5 truncate">
                              <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                              <span>{intn.location}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-slate-600 font-semibold truncate">
                          {intn.company}
                        </td>
                        <td className="py-3.5 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            intn.type === "Remote" ? "bg-blue-50 text-blue-700 border border-blue-100" :
                            intn.type === "Hybrid" ? "bg-purple-50 text-purple-700 border border-purple-100" :
                            "bg-slate-100 text-slate-700"
                          }`}>
                            {intn.type}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-slate-700 font-semibold">
                          <div>
                            <span className="font-bold text-emerald-700">{intn.stipend}</span>
                            <div className="text-[10px] text-slate-400 font-normal">{intn.duration}</div>
                          </div>
                        </td>
                        <td className="py-3.5 pr-4 text-right">
                          <div className="flex items-center justify-end space-x-1">
                            <button
                              onClick={() => setSelectedProgramDetail({ type: "internship", data: intn })}
                              className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-1.5 rounded-lg text-[11px] font-bold cursor-pointer transition-all"
                              title={isIndonesian ? "Lihat Detail" : "View Details"}
                            >
                              <Eye className="h-3.5 w-3.5 text-slate-600" />
                            </button>
                            <button
                              onClick={() => handleOpenEditInternship(intn)}
                              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 p-1.5 rounded-lg text-[11px] font-bold cursor-pointer transition-all"
                              title={isIndonesian ? "Edit Magang" : "Edit Internship"}
                            >
                              <Edit3 className="h-3.5 w-3.5 text-emerald-600" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmModal({ isOpen: true, type: "internship", id: intn.id, title: intn.title })}
                              className="bg-red-50 hover:bg-red-100 text-red-700 p-1.5 rounded-lg text-[11px] font-bold cursor-pointer transition-all"
                              title={isIndonesian ? "Hapus Magang" : "Delete Internship"}
                            >
                              <Trash2 className="h-3.5 w-3.5 text-red-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* 4. CANDIDATE SCHOLARSHIP APPLICATIONS CURATION TABLE */}
          {catalogSubTab === "scholarship-applications" && (
            <div className="border border-slate-100 rounded-2xl overflow-hidden animate-in fade-in duration-150">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <GraduationCap className="h-4 w-4 text-purple-600" />
                  <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                    {isIndonesian ? "Antrean Aplikasi Beasiswa Kandidat" : "Candidate Scholarship Applications Queue"}
                  </span>
                </div>
                <span className="text-[11px] font-bold text-slate-500">
                  {isIndonesian ? "Total Pengajuan" : "Total Applications"}: {filteredScholarshipApps.length}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse table-fixed min-w-[900px]" id="admin-scholarship-apps-table">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-widest text-[10px] font-extrabold bg-slate-50/40">
                      <th className="py-3 pl-4 w-[28%]">{isIndonesian ? "Kandidat Pengusul" : "Applicant"}</th>
                      <th className="py-3 px-3 w-[26%]">{isIndonesian ? "Program Target" : "Target Program"}</th>
                      <th className="py-3 px-3 w-[16%]">{isIndonesian ? "Kualifikasi / Jam" : "Qualification / Hours"}</th>
                      <th className="py-3 px-3 w-[16%]">{isIndonesian ? "Status Kurasi" : "Curation Status"}</th>
                      <th className="py-3 pr-4 text-right w-[14%]">{isIndonesian ? "Aksi" : "Actions"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-medium">
                    {filteredScholarshipApps.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-400 font-semibold text-xs">
                          {isIndonesian ? "Tidak ada aplikasi beasiswa yang cocok dengan filter." : "No scholarship applications match the filter."}
                        </td>
                      </tr>
                    ) : (
                      filteredScholarshipApps.map((app) => (
                        <tr key={app.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3.5 pl-4">
                            <div className="flex items-center space-x-3">
                              <img
                                src={app.candidateAvatar || DEFAULT_PROFILE_IMAGE}
                                alt={app.candidateName}
                                className="h-9 w-9 rounded-full object-cover border border-slate-200 shrink-0"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = DEFAULT_PROFILE_IMAGE;
                                }}
                              />
                              <div className="overflow-hidden">
                                <p className="font-extrabold text-slate-900 truncate">{app.candidateName}</p>
                                <p className="text-[11px] text-slate-500 truncate">{app.candidateEmail}</p>
                                <span className="text-[10px] text-slate-400 font-mono">{app.candidatePhone}</span>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-3">
                            <div>
                              <p className="font-bold text-slate-900 truncate" title={app.trainingTitle}>{app.trainingTitle}</p>
                              <p className="text-[11px] text-slate-500 truncate">{app.provider}</p>
                              <span className={`inline-block mt-0.5 text-[10px] font-bold px-1.5 py-0.2 rounded ${
                                app.format === "Online" ? "bg-blue-50 text-blue-700" : "bg-emerald-50 text-emerald-700"
                              }`}>
                                {app.format}
                              </span>
                            </div>
                          </td>

                          <td className="py-3.5 px-3">
                            <div className="space-y-0.5">
                              <div className="text-[11px] font-bold text-slate-800 truncate" title={app.gpaOrAchievement || "-"}>
                                {app.gpaOrAchievement || "-"}
                              </div>
                              <div className="text-[10px] text-slate-500 flex items-center gap-1">
                                <Clock className="h-3 w-3 text-slate-400" />
                                <span>{app.weeklyCommitmentHours} {isIndonesian ? "jam/minggu" : "hrs/week"}</span>
                              </div>
                              <div className="text-[10px] text-slate-400">
                                {new Date(app.submittedAt).toLocaleDateString(isIndonesian ? "id-ID" : "en-US")}
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-3">
                            <div>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black ${
                                app.status === "approved" ? "bg-emerald-100 text-emerald-800 border border-emerald-200" :
                                app.status === "interview_scheduled" ? "bg-purple-100 text-purple-800 border border-purple-200" :
                                app.status === "rejected" ? "bg-rose-100 text-rose-800 border border-rose-200" :
                                "bg-amber-100 text-amber-900 border border-amber-200"
                              }`}>
                                {app.status === "approved" ? (isIndonesian ? "✓ Beasiswa Disetujui" : "✓ Approved") :
                                 app.status === "interview_scheduled" ? (isIndonesian ? "◷ Wawancara" : "◷ Interview") :
                                 app.status === "rejected" ? (isIndonesian ? "✕ Ditolak" : "✕ Rejected") :
                                 (isIndonesian ? "● Ditinjau" : "● Under Review")}
                              </span>
                              {app.adminFeedback && (
                                <p className="text-[10px] text-slate-500 mt-1 line-clamp-1 italic" title={app.adminFeedback}>
                                  "{app.adminFeedback}"
                                </p>
                              )}
                            </div>
                          </td>

                          <td className="py-3.5 pr-4 text-right">
                            <div className="flex items-center justify-end space-x-1.5">
                              <button
                                onClick={() => {
                                  setInspectScholarshipApp(app);
                                  setReviewFeedbackInput(app.adminFeedback || "");
                                }}
                                className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-2.5 py-1.5 rounded-lg text-[11px] font-bold cursor-pointer transition-all flex items-center gap-1"
                                title={isIndonesian ? "Tinjau Berkas & Esai" : "Review Dossier & Essay"}
                              >
                                <Eye className="h-3.5 w-3.5" />
                                <span>{isIndonesian ? "Tinjau" : "Review"}</span>
                              </button>
                              {app.status !== "approved" && (
                                <button
                                  onClick={() => handleReviewScholarshipApp(app.id, "approved")}
                                  className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 p-1.5 rounded-lg text-[11px] font-bold cursor-pointer transition-all"
                                  title={isIndonesian ? "Setujui Beasiswa Langsung" : "Quick Approve Scholarship"}
                                >
                                  <Check className="h-3.5 w-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. USERS & AUDIT LOG VIEW */}
      {/* ========================================================================= */}
      {activeTab === "users-audit" && (
        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-7 shadow-xs space-y-6 animate-in fade-in duration-150" id="admin-users-audit-view">
          <div className="flex items-center justify-between border-b border-slate-100 pb-5">
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <Users className="h-5 w-5 text-slate-700" />
                <span>{isIndonesian ? "Direktori Akun & Hak Akses" : "User Management & Access Control"}</span>
              </h2>
              <p className="text-xs text-slate-500 font-semibold">
                {isIndonesian ? "Daftar seluruh akun terdaftar beserta peranan otorisasi sistem." : "Complete listing of registered system accounts and security roles."}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">{isIndonesian ? "Akun Kandidat" : "Candidate Accounts"}</span>
              <div className="text-xl font-black text-slate-900 mt-1">{candidates.length}</div>
              <p className="text-[11px] text-slate-500 mt-1">{isIndonesian ? "Pencari kerja aktif dengan resume terverifikasi" : "Active jobseekers with verified profiles"}</p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">{isIndonesian ? "Akun HR & Recruiter" : "Recruiter Accounts"}</span>
              <div className="text-xl font-black text-slate-900 mt-1">{recruiters.length}</div>
              <p className="text-[11px] text-slate-500 mt-1">{isIndonesian ? "Perusahaan & lembaga rekrutmen mitra" : "Corporate partners and sourcing leads"}</p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">{isIndonesian ? "Otoritas Super Admin" : "Super Admin Authorities"}</span>
              <div className="text-xl font-black text-purple-700 mt-1">
                {registeredUsers.filter(u => u.role === "admin").length || 1} {isIndonesian ? "Super Admin" : "Super Admin"}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">{isIndonesian ? "Hak akses penuh terhadap tata kelola platform" : "Full access privileges for governance"}</p>
            </div>
          </div>

          {/* Registered Users Table */}
          <div className="border border-slate-100 rounded-2xl overflow-hidden">
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                {isIndonesian ? "Daftar Akun Pengguna Terdaftar" : "Registered User Accounts"}
              </span>
              <span className="text-[11px] font-bold text-slate-500">
                Total: {registeredUsers.length} {isIndonesian ? "Pengguna" : "Users"}
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse table-fixed min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-widest text-[10px] font-extrabold bg-slate-50/30">
                    <th className="py-3 pl-4 w-[35%]">{isIndonesian ? "Nama & Email Pengguna" : "User Profile"}</th>
                    <th className="py-3 px-3 w-[20%]">{isIndonesian ? "Peran / Otoritas" : "System Role"}</th>
                    <th className="py-3 px-3 w-[20%]">{isIndonesian ? "Afiliasi / Entitas" : "Organization"}</th>
                    <th className="py-3 pr-4 text-right w-[25%]">{isIndonesian ? "Status Akun" : "Account Status"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-medium">
                  {registeredUsers.map((usr) => (
                    <tr key={usr.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 pl-4">
                        <div className="flex items-center space-x-3">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs ${
                            usr.role === "admin" ? "bg-purple-100 text-purple-700" :
                            usr.role === "recruiter" ? "bg-blue-100 text-blue-700" :
                            "bg-slate-100 text-slate-700"
                          }`}>
                            {(usr.fullName || usr.name || usr.email || "U").charAt(0).toUpperCase()}
                          </div>
                          <div className="overflow-hidden">
                            <div className="font-bold text-slate-900 truncate">{usr.fullName || usr.name || "User"}</div>
                            <div className="text-[11px] text-slate-500 font-mono truncate">{usr.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          usr.role === "admin" ? "bg-purple-50 text-purple-700 border border-purple-150" :
                          usr.role === "recruiter" ? "bg-blue-50 text-blue-700 border border-blue-150" :
                          "bg-emerald-50 text-emerald-700 border border-emerald-150"
                        }`}>
                          {usr.role === "admin" ? (isIndonesian ? "Super Admin" : "Super Admin") :
                           usr.role === "recruiter" ? (isIndonesian ? "Recruiter / HR" : "Recruiter / HR") :
                           (isIndonesian ? "Kandidat" : "Candidate")}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-slate-600">
                        {usr.companyName || usr.company || (usr.role === "admin" ? "TalentHub Core Governance" : "Talent Marketplace")}
                      </td>
                      <td className="py-3.5 pr-4 text-right">
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded text-[10px] font-bold">
                          {isIndonesian ? "Aktif & Terverifikasi" : "Active & Verified"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* RECRUITER INSPECTION MODAL */}
      {/* ========================================================================= */}
      {inspectRecruiter && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-2xl w-full p-6 sm:p-7 space-y-6">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-base">
                  {inspectRecruiter.companyName ? inspectRecruiter.companyName.charAt(0) : "C"}
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">{inspectRecruiter.companyName}</h3>
                  <p className="text-xs text-slate-500 font-semibold">{inspectRecruiter.fullName} • {inspectRecruiter.hrJobTitle || "Talent Lead"}</p>
                </div>
              </div>
              <button onClick={() => setInspectRecruiter(null)} className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">{isIndonesian ? "Email Korporat" : "Business Email"}</span>
                  <div className="font-bold text-slate-800">{inspectRecruiter.email}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">{isIndonesian ? "Nomor NIB / SIUP" : "Company Registration / NIB"}</span>
                  <div className="font-bold text-slate-800">{inspectRecruiter.companyRegistrationNumber || "NIB-8120391203"}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">{isIndonesian ? "Ukuran Perusahaan" : "Company Size"}</span>
                  <div className="font-bold text-slate-800">{inspectRecruiter.companySize || "51-200 Karyawan"}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">{isIndonesian ? "Status Akreditasi" : "Status"}</span>
                  <div className="font-bold text-purple-600">{inspectRecruiter.hrVerified ? "Verified HR" : "Pending Review"}</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => handleRecruiterVerificationAction(inspectRecruiter.id, "reject")}
                className="px-4 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 border border-red-200 cursor-pointer"
              >
                {isIndonesian ? "Tolak / Tangguhkan" : "Reject"}
              </button>
              <button
                onClick={() => handleRecruiterVerificationAction(inspectRecruiter.id, "approve")}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 cursor-pointer shadow-xs"
              >
                {isIndonesian ? "Setujui Akreditasi" : "Approve HR Verification"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PROGRAM DETAIL MODAL */}
      {/* ========================================================================= */}
      {selectedProgramDetail && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-2xl w-full p-6 sm:p-7 space-y-6">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                  selectedProgramDetail.type === "training" ? "bg-blue-50 text-blue-700 border border-blue-100" :
                  selectedProgramDetail.type === "scholarship" ? "bg-purple-50 text-purple-700 border border-purple-100" :
                  "bg-emerald-50 text-emerald-700 border border-emerald-100"
                }`}>
                  {selectedProgramDetail.type === "training" ? "Pelatihan / Bootcamp" : selectedProgramDetail.type === "scholarship" ? "Program Beasiswa" : "Magang Mitra"}
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  {selectedProgramDetail.data.title}
                </h3>
                <p className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-slate-400" />
                  <span>{selectedProgramDetail.data.provider || selectedProgramDetail.data.company}</span>
                </p>
              </div>
              <button onClick={() => setSelectedProgramDetail(null)} className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {selectedProgramDetail.type === "training" && selectedProgramDetail.data.imageUrl && (
                <img 
                  src={selectedProgramDetail.data.imageUrl} 
                  alt={selectedProgramDetail.data.title}
                  className="w-full h-44 rounded-2xl object-cover border border-slate-100 shadow-xs"
                  referrerPolicy="no-referrer"
                />
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                {selectedProgramDetail.type === "training" && (
                  <>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">{isIndonesian ? "Kategori" : "Category"}</span>
                      <div className="font-extrabold text-slate-800">{selectedProgramDetail.data.category}</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">{isIndonesian ? "Format & Durasi" : "Format & Duration"}</span>
                      <div className="font-extrabold text-slate-800">{selectedProgramDetail.data.format} • {selectedProgramDetail.data.duration}</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">{isIndonesian ? "Sertifikasi" : "Certification"}</span>
                      <div className="font-extrabold text-blue-600">
                        {selectedProgramDetail.data.certification ? (isIndonesian ? "Sertifikat Resmi" : "Certified") : "Standard"}
                      </div>
                    </div>
                  </>
                )}

                {selectedProgramDetail.type === "scholarship" && (
                  <>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">{isIndonesian ? "Kuota & Pendaftar" : "Quota & Applicants"}</span>
                      <div className="font-extrabold text-purple-700">
                        {selectedProgramDetail.data.quota || 50} {isIndonesian ? "Kursi" : "Spots"} ({(selectedProgramDetail.data.applicantCount || 1000).toLocaleString('id-ID')}+ Pelamar)
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">{isIndonesian ? "Batas Akhir" : "Deadline"}</span>
                      <div className="font-extrabold text-slate-800">{selectedProgramDetail.data.deadline}</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">{isIndonesian ? "Alokasi Dana Pasca Seleksi" : "Post-Selection Award"}</span>
                      <div className="font-extrabold text-emerald-600">{selectedProgramDetail.data.amount}</div>
                      <span className="text-[9px] text-slate-400 block font-medium mt-0.5">
                        {isIndonesian ? "*Dibuka resmi hanya untuk kandidat terpilih" : "*Revealed only upon candidate selection"}
                      </span>
                    </div>
                  </>
                )}

                {selectedProgramDetail.type === "internship" && (
                  <>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">{isIndonesian ? "Uang Saku" : "Stipend"}</span>
                      <div className="font-extrabold text-emerald-600">{selectedProgramDetail.data.stipend}</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">{isIndonesian ? "Tipe & Lokasi" : "Type & Location"}</span>
                      <div className="font-extrabold text-slate-800">{selectedProgramDetail.data.type} • {selectedProgramDetail.data.location}</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">{isIndonesian ? "Durasi" : "Duration"}</span>
                      <div className="font-extrabold text-slate-800">{selectedProgramDetail.data.duration}</div>
                    </div>
                  </>
                )}
              </div>

              <div className="space-y-1.5">
                <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                  {isIndonesian ? "Deskripsi & Kurikulum Program" : "Description & Curriculum"}
                </h4>
                <p className="text-slate-600 leading-relaxed bg-white p-3.5 rounded-xl border border-slate-100">
                  {selectedProgramDetail.data.description || "Tidak ada deskripsi rinci."}
                </p>
              </div>

              {selectedProgramDetail.data.requirements && Array.isArray(selectedProgramDetail.data.requirements) && (
                <div className="space-y-1.5">
                  <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                    {isIndonesian ? "Persyaratan & Kualifikasi Peserta" : "Eligibility & Requirements"}
                  </h4>
                  <ul className="space-y-1 bg-slate-50/60 p-3 rounded-xl border border-slate-100">
                    {selectedProgramDetail.data.requirements.map((req: string, idx: number) => (
                      <li key={idx} className="flex items-start space-x-2 text-slate-700">
                        <CheckCircle2 className="h-3.5 w-3.5 text-blue-600 shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="text-[11px] text-slate-400 font-semibold">
                ID: <span className="font-mono text-slate-600">{selectedProgramDetail.data.id}</span>
              </div>
              <div className="flex items-center space-x-3">
                {selectedProgramDetail.data.link && (
                  <a
                    href={selectedProgramDetail.data.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    <span>{isIndonesian ? "Buka Tautan Resmi" : "Visit Official Link"}</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
                <button
                  onClick={() => setSelectedProgramDetail(null)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
                >
                  {isIndonesian ? "Tutup" : "Close"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. CREATE / EDIT TRAINING MODAL */}
      {/* ========================================================================= */}
      {trainingModal.isOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150" id="admin-training-modal">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-2xl w-full p-6 sm:p-7 space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-2xl bg-blue-50 border border-blue-150 flex items-center justify-center text-blue-600">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {trainingModal.isEdit 
                      ? (isIndonesian ? "Edit Program Pelatihan" : "Edit Training Program")
                      : (isIndonesian ? "Tambah Program Pelatihan Baru" : "Add New Training Program")
                    }
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold">
                    {isIndonesian ? "Kurasi kurikulum pelatihan resmi untuk pencari kerja." : "Curate official training curriculum for jobseekers."}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setTrainingModal(prev => ({ ...prev, isOpen: false }))}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 max-h-[68vh] overflow-y-auto pr-1 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1 sm:col-span-2">
                  <label className="font-extrabold text-slate-700">{isIndonesian ? "Nama Program Pelatihan *" : "Training Program Title *"}</label>
                  <input
                    type="text"
                    value={trainingModal.data.title || ""}
                    onChange={(e) => setTrainingModal(prev => ({ ...prev, data: { ...prev.data, title: e.target.value } }))}
                    placeholder="Contoh: Digital Talent Scholarship - Fullstack AI Engineer"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-extrabold text-slate-700">{isIndonesian ? "Penyelenggara / Mitra *" : "Provider / Institution *"}</label>
                  <input
                    type="text"
                    value={trainingModal.data.provider || ""}
                    onChange={(e) => setTrainingModal(prev => ({ ...prev, data: { ...prev.data, provider: e.target.value } }))}
                    placeholder="Contoh: Kominfo & Dicoding"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-extrabold text-slate-700">{isIndonesian ? "Kategori Pelatihan" : "Category"}</label>
                  <select
                    value={trainingModal.data.category || "Coding"}
                    onChange={(e) => setTrainingModal(prev => ({ ...prev, data: { ...prev.data, category: e.target.value } }))}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                  >
                    <option value="Coding">Coding & Software</option>
                    <option value="Design">UI/UX & Product Design</option>
                    <option value="Product">Product Management</option>
                    <option value="Data">Data Science & AI</option>
                    <option value="Marketing">Digital Marketing</option>
                    <option value="Other">Lainnya / Umum</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-extrabold text-slate-700">{isIndonesian ? "Tipe Pembiayaan" : "Type"}</label>
                  <select
                    value={trainingModal.data.type || "Free"}
                    onChange={(e) => setTrainingModal(prev => ({ ...prev, data: { ...prev.data, type: e.target.value as any } }))}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                  >
                    <option value="Free">Gratis (Free)</option>
                    <option value="Government">Program Pemerintah (Government)</option>
                    <option value="Paid">Berbayar / Subsidi</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-extrabold text-slate-700">{isIndonesian ? "Format Pembelajaran" : "Format"}</label>
                  <select
                    value={trainingModal.data.format || "Online"}
                    onChange={(e) => setTrainingModal(prev => ({ ...prev, data: { ...prev.data, format: e.target.value as any } }))}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                  >
                    <option value="Online">Online / Daring</option>
                    <option value="Offline">Offline / Tatap Muka</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-extrabold text-slate-700">{isIndonesian ? "Durasi Program *" : "Duration *"}</label>
                  <input
                    type="text"
                    value={trainingModal.data.duration || ""}
                    onChange={(e) => setTrainingModal(prev => ({ ...prev, data: { ...prev.data, duration: e.target.value } }))}
                    placeholder="Contoh: 12 Minggu, 3 Bulan"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-extrabold text-slate-700">{isIndonesian ? "Tautan Pendaftaran Resmi" : "Official Link"}</label>
                  <input
                    type="url"
                    value={trainingModal.data.link || ""}
                    onChange={(e) => setTrainingModal(prev => ({ ...prev, data: { ...prev.data, link: e.target.value } }))}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="font-extrabold text-slate-700">{isIndonesian ? "URL Gambar Banner" : "Banner Image URL"}</label>
                  <input
                    type="url"
                    value={trainingModal.data.imageUrl || ""}
                    onChange={(e) => setTrainingModal(prev => ({ ...prev, data: { ...prev.data, imageUrl: e.target.value } }))}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div className="flex items-center space-x-2 sm:col-span-2 py-1">
                  <input
                    type="checkbox"
                    id="training-cert-checkbox"
                    checked={trainingModal.data.certification ?? true}
                    onChange={(e) => setTrainingModal(prev => ({ ...prev, data: { ...prev.data, certification: e.target.checked } }))}
                    className="h-4 w-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor="training-cert-checkbox" className="font-extrabold text-slate-800 cursor-pointer">
                    {isIndonesian ? "Menyediakan Sertifikat Kelulusan Resmi Terakreditasi" : "Provides Official Accredited Certificate"}
                  </label>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="font-extrabold text-slate-700">{isIndonesian ? "Deskripsi & Silabus *" : "Description & Syllabus *"}</label>
                  <textarea
                    rows={3}
                    value={trainingModal.data.description || ""}
                    onChange={(e) => setTrainingModal(prev => ({ ...prev, data: { ...prev.data, description: e.target.value } }))}
                    placeholder="Ringkasan kurikulum, tujuan pembelajaran, dan benefit program..."
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="font-extrabold text-slate-700">{isIndonesian ? "Kualifikasi / Persyaratan Peserta (Satu baris per syarat)" : "Requirements (One per line)"}</label>
                  <textarea
                    rows={3}
                    value={trainingRequirementsText}
                    onChange={(e) => setTrainingRequirementsText(e.target.value)}
                    placeholder="Warga Negara Indonesia (WNI)&#10;Berusia minimal 18 tahun&#10;Memiliki laptop dan koneksi internet"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono text-[11px]"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setTrainingModal(prev => ({ ...prev, isOpen: false }))}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors"
              >
                {isIndonesian ? "Batal" : "Cancel"}
              </button>
              <button
                type="button"
                id="btn-save-training-modal"
                disabled={savingProgram}
                onClick={handleSaveTraining}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-5 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all shadow-xs inline-flex items-center gap-1.5"
              >
                {savingProgram && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
                <span>{isIndonesian ? (savingProgram ? "Menyimpan..." : "Simpan Pelatihan") : (savingProgram ? "Saving..." : "Save Training")}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 9. CREATE / EDIT SCHOLARSHIP MODAL */}
      {/* ========================================================================= */}
      {scholarshipModal.isOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150" id="admin-scholarship-modal">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-2xl w-full p-6 sm:p-7 space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-2xl bg-purple-50 border border-purple-150 flex items-center justify-center text-purple-600">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {scholarshipModal.isEdit 
                      ? (isIndonesian ? "Edit Program Beasiswa" : "Edit Scholarship Program")
                      : (isIndonesian ? "Tambah Program Beasiswa Baru" : "Add New Scholarship Program")
                    }
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold">
                    {isIndonesian ? "Daftarkan beasiswa pendidikan dan pelatihan karir." : "Register educational and career advancement scholarships."}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setScholarshipModal(prev => ({ ...prev, isOpen: false }))}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 max-h-[68vh] overflow-y-auto pr-1 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1 sm:col-span-2">
                  <label className="font-extrabold text-slate-700">{isIndonesian ? "Nama Beasiswa *" : "Scholarship Title *"}</label>
                  <input
                    type="text"
                    value={scholarshipModal.data.title || ""}
                    onChange={(e) => setScholarshipModal(prev => ({ ...prev, data: { ...prev.data, title: e.target.value } }))}
                    placeholder="Contoh: Beasiswa Talenta Digital Indonesia 2026"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-extrabold text-slate-700">{isIndonesian ? "Lembaga Penyelenggara *" : "Provider Institution *"}</label>
                  <input
                    type="text"
                    value={scholarshipModal.data.provider || ""}
                    onChange={(e) => setScholarshipModal(prev => ({ ...prev, data: { ...prev.data, provider: e.target.value } }))}
                    placeholder="Contoh: Yayasan Beasiswa Teknologi Mandiri"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-extrabold text-slate-700">{isIndonesian ? "Kategori Bidang" : "Category"}</label>
                  <input
                    type="text"
                    value={scholarshipModal.data.category || ""}
                    onChange={(e) => setScholarshipModal(prev => ({ ...prev, data: { ...prev.data, category: e.target.value } }))}
                    placeholder="Contoh: Teknologi, Kepemimpinan, Riset"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-extrabold text-slate-700">{isIndonesian ? "Kuota Kursi Beasiswa *" : "Scholarship Quota Spots *"}</label>
                  <input
                    type="number"
                    value={scholarshipModal.data.quota || 50}
                    onChange={(e) => setScholarshipModal(prev => ({ ...prev, data: { ...prev.data, quota: parseInt(e.target.value) || 0 } }))}
                    placeholder="50"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-extrabold text-slate-700">{isIndonesian ? "Batas Pendaftaran *" : "Deadline *"}</label>
                  <input
                    type="text"
                    value={scholarshipModal.data.deadline || ""}
                    onChange={(e) => setScholarshipModal(prev => ({ ...prev, data: { ...prev.data, deadline: e.target.value } }))}
                    placeholder="Contoh: 30 April 2026"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-extrabold text-slate-700">{isIndonesian ? "Estimasi Pendaftar / Pelamar" : "Estimated Applicants"}</label>
                  <input
                    type="number"
                    value={scholarshipModal.data.applicantCount || 1000}
                    onChange={(e) => setScholarshipModal(prev => ({ ...prev, data: { ...prev.data, applicantCount: parseInt(e.target.value) || 0 } }))}
                    placeholder="1000"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-extrabold text-slate-700">
                    {isIndonesian ? "Alokasi Dana Pasca Seleksi *" : "Post-Selection Award Funds *"}
                  </label>
                  <input
                    type="text"
                    value={scholarshipModal.data.amount || ""}
                    onChange={(e) => setScholarshipModal(prev => ({ ...prev, data: { ...prev.data, amount: e.target.value } }))}
                    placeholder="Contoh: Rp 50.000.000 Biaya Kuliah + Uang Saku"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div className="sm:col-span-2 p-3 bg-purple-50/70 border border-purple-150 rounded-2xl text-[11px] text-purple-900 font-medium">
                  {isIndonesian
                    ? "ℹ️ Kebijakan Seleksi: Rincian dana beasiswa di atas sengaja disembunyikan dari tahap pendaftaran awal karena tingginya peminat (ribuan pelamar untuk puluhan kuota). Rincian dana resmi akan diumumkan dan diserahkan kepada kandidat yang lolos seleksi."
                    : "ℹ️ Selection Policy: Funding breakdown is hidden during initial stages due to competitive quotas and will only be officially disclosed to candidates who pass selection."}
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="font-extrabold text-slate-700">{isIndonesian ? "Tautan Pendaftaran Resmi" : "Official Link"}</label>
                  <input
                    type="url"
                    value={scholarshipModal.data.link || ""}
                    onChange={(e) => setScholarshipModal(prev => ({ ...prev, data: { ...prev.data, link: e.target.value } }))}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="font-extrabold text-slate-700">{isIndonesian ? "Deskripsi Program *" : "Description *"}</label>
                  <textarea
                    rows={3}
                    value={scholarshipModal.data.description || ""}
                    onChange={(e) => setScholarshipModal(prev => ({ ...prev, data: { ...prev.data, description: e.target.value } }))}
                    placeholder="Jelaskan tujuan beasiswa, penerima manfaat yang ditargetkan, dan tahapan seleksi..."
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="font-extrabold text-slate-700">{isIndonesian ? "Persyaratan Peserta (Satu baris per syarat)" : "Requirements (One per line)"}</label>
                  <textarea
                    rows={3}
                    value={scholarshipRequirementsText}
                    onChange={(e) => setScholarshipRequirementsText(e.target.value)}
                    placeholder="Mahasiswa aktif tingkat akhir atau fresh graduate&#10;IPK minimal 3.25&#10;Memiliki portofolio proyek teknologi"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono text-[11px]"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setScholarshipModal(prev => ({ ...prev, isOpen: false }))}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors"
              >
                {isIndonesian ? "Batal" : "Cancel"}
              </button>
              <button
                type="button"
                id="btn-save-scholarship-modal"
                disabled={savingProgram}
                onClick={handleSaveScholarship}
                className="bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white px-5 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all shadow-xs inline-flex items-center gap-1.5"
              >
                {savingProgram && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
                <span>{isIndonesian ? (savingProgram ? "Menyimpan..." : "Simpan Beasiswa") : (savingProgram ? "Saving..." : "Save Scholarship")}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 10. CREATE / EDIT INTERNSHIP MODAL */}
      {/* ========================================================================= */}
      {internshipModal.isOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150" id="admin-internship-modal">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-2xl w-full p-6 sm:p-7 space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-2xl bg-emerald-50 border border-emerald-150 flex items-center justify-center text-emerald-600">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {internshipModal.isEdit 
                      ? (isIndonesian ? "Edit Lowongan Magang" : "Edit Internship Opportunity")
                      : (isIndonesian ? "Tambah Lowongan Magang Baru" : "Add New Internship Opportunity")
                    }
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold">
                    {isIndonesian ? "Daftarkan program magang industri dan kemitraan kampus." : "Register industry internships and partner programs."}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setInternshipModal(prev => ({ ...prev, isOpen: false }))}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 max-h-[68vh] overflow-y-auto pr-1 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1 sm:col-span-2">
                  <label className="font-extrabold text-slate-700">{isIndonesian ? "Posisi / Judul Magang *" : "Position Title *"}</label>
                  <input
                    type="text"
                    value={internshipModal.data.title || ""}
                    onChange={(e) => setInternshipModal(prev => ({ ...prev, data: { ...prev.data, title: e.target.value } }))}
                    placeholder="Contoh: Junior AI Engineer Intern"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-extrabold text-slate-700">{isIndonesian ? "Perusahaan Mitra *" : "Company Partner *"}</label>
                  <input
                    type="text"
                    value={internshipModal.data.company || ""}
                    onChange={(e) => setInternshipModal(prev => ({ ...prev, data: { ...prev.data, company: e.target.value } }))}
                    placeholder="Contoh: Nusantara Tech Labs"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-extrabold text-slate-700">{isIndonesian ? "Lokasi Penempatan *" : "Location *"}</label>
                  <input
                    type="text"
                    value={internshipModal.data.location || ""}
                    onChange={(e) => setInternshipModal(prev => ({ ...prev, data: { ...prev.data, location: e.target.value } }))}
                    placeholder="Contoh: Jakarta Selatan / Remote Indonesia"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-extrabold text-slate-700">{isIndonesian ? "Tipe Kerja" : "Work Type"}</label>
                  <select
                    value={internshipModal.data.type || "Hybrid"}
                    onChange={(e) => setInternshipModal(prev => ({ ...prev, data: { ...prev.data, type: e.target.value as any } }))}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                  >
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-site">On-site</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-extrabold text-slate-700">{isIndonesian ? "Uang Saku (Stipend) *" : "Stipend *"}</label>
                  <input
                    type="text"
                    value={internshipModal.data.stipend || ""}
                    onChange={(e) => setInternshipModal(prev => ({ ...prev, data: { ...prev.data, stipend: e.target.value } }))}
                    placeholder="Contoh: Rp 4.500.000 / bln"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-extrabold text-slate-700">{isIndonesian ? "Durasi Magang *" : "Duration *"}</label>
                  <input
                    type="text"
                    value={internshipModal.data.duration || ""}
                    onChange={(e) => setInternshipModal(prev => ({ ...prev, data: { ...prev.data, duration: e.target.value } }))}
                    placeholder="Contoh: 3 - 6 Bulan"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="font-extrabold text-slate-700">{isIndonesian ? "Tautan Pendaftaran Resmi" : "Official Link"}</label>
                  <input
                    type="url"
                    value={internshipModal.data.link || ""}
                    onChange={(e) => setInternshipModal(prev => ({ ...prev, data: { ...prev.data, link: e.target.value } }))}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="font-extrabold text-slate-700">{isIndonesian ? "Deskripsi Pekerjaan *" : "Job Description *"}</label>
                  <textarea
                    rows={3}
                    value={internshipModal.data.description || ""}
                    onChange={(e) => setInternshipModal(prev => ({ ...prev, data: { ...prev.data, description: e.target.value } }))}
                    placeholder="Deskripsi tugas harian, tim pendamping, dan teknologi yang digunakan..."
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="font-extrabold text-slate-700">{isIndonesian ? "Persyaratan Kualifikasi (Satu baris per syarat)" : "Requirements (One per line)"}</label>
                  <textarea
                    rows={3}
                    value={internshipRequirementsText}
                    onChange={(e) => setInternshipRequirementsText(e.target.value)}
                    placeholder="Mahasiswa tingkat 3/4 atau fresh graduate&#10;Menguasai dasar Python / TypeScript&#10;Bersedia magang penuh waktu"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono text-[11px]"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setInternshipModal(prev => ({ ...prev, isOpen: false }))}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors"
              >
                {isIndonesian ? "Batal" : "Cancel"}
              </button>
              <button
                type="button"
                id="btn-save-internship-modal"
                disabled={savingProgram}
                onClick={handleSaveInternship}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white px-5 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all shadow-xs inline-flex items-center gap-1.5"
              >
                {savingProgram && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
                <span>{isIndonesian ? (savingProgram ? "Menyimpan..." : "Simpan Lowongan") : (savingProgram ? "Saving..." : "Save Opportunity")}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 11. DELETE CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      {deleteConfirmModal && deleteConfirmModal.isOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150" id="admin-delete-confirm-modal">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-md w-full p-6 space-y-5">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-2xl bg-red-50 border border-red-150 flex items-center justify-center text-red-600 shrink-0">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">
                  {isIndonesian ? "Konfirmasi Hapus Program" : "Confirm Program Deletion"}
                </h3>
                <p className="text-xs text-slate-500 font-semibold">
                  {isIndonesian ? "Tindakan ini tidak dapat dibatalkan." : "This action cannot be undone."}
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-xs text-slate-700 leading-relaxed">
                {isIndonesian 
                  ? `Apakah Anda yakin ingin menghapus "${deleteConfirmModal.title}" dari katalog publik?`
                  : `Are you sure you want to permanently delete "${deleteConfirmModal.title}" from the public catalog?`
                }
              </p>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmModal(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors"
              >
                {isIndonesian ? "Batal" : "Cancel"}
              </button>
              <button
                type="button"
                id="btn-confirm-delete-program"
                disabled={deletingProgramId === deleteConfirmModal.id}
                onClick={() => {
                  if (deleteConfirmModal.type === "training") handleDeleteTraining(deleteConfirmModal.id);
                  else if (deleteConfirmModal.type === "scholarship") handleDeleteScholarship(deleteConfirmModal.id);
                  else if (deleteConfirmModal.type === "internship") handleDeleteInternship(deleteConfirmModal.id);
                }}
                className="bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white px-5 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all shadow-xs inline-flex items-center gap-1.5"
              >
                {deletingProgramId === deleteConfirmModal.id && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
                <span>{isIndonesian ? (deletingProgramId === deleteConfirmModal.id ? "Menghapus..." : "Hapus Permanen") : (deletingProgramId === deleteConfirmModal.id ? "Deleting..." : "Delete Permanently")}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 12. APPROVE PARTNER PROPOSAL & PUBLISH MODAL */}
      {/* ========================================================================= */}
      {approveProposalModal && approveProposalModal.isOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150" id="admin-approve-proposal-modal">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-3xl w-full p-6 sm:p-7 space-y-6 max-h-[90vh] flex flex-col">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="h-11 w-11 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {isIndonesian ? "Setujui Proposal & Terbitkan ke Katalog Pelatihan" : "Approve Proposal & Publish to Training Catalog"}
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold">
                    {isIndonesian 
                      ? `Pengusul: ${approveProposalModal.proposal.partnerName} (${approveProposalModal.proposal.institutionName})` 
                      : `Partner: ${approveProposalModal.proposal.partnerName} (${approveProposalModal.proposal.institutionName})`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setApproveProposalModal(null)}
                className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 overflow-y-auto pr-1 text-xs">
              <div className="p-3.5 bg-blue-50/80 border border-blue-200 rounded-2xl flex items-start space-x-3 text-blue-900">
                <PhoneCall className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-extrabold">{isIndonesian ? "Verifikasi Komunikasi Mitra Selesai" : "Partner Direct Verification"}</p>
                  <p className="text-[11px] text-blue-800 font-medium mt-0.5">
                    {isIndonesian 
                      ? "Form ini telah diisi secara otomatis dari data proposal. Anda dapat menyesuaikan harga, silabus, tanggal mulai, dan kuota sebelum program aktif di katalog publik."
                      : "Form prepopulated from proposal details. Review and tweak schedule, fees, and quota prior to publishing."}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1 sm:col-span-2">
                  <label className="font-extrabold text-slate-700">{isIndonesian ? "Judul Program Pelatihan *" : "Training Program Title *"}</label>
                  <input
                    type="text"
                    value={approveProposalModal.data.title || ""}
                    onChange={(e) => setApproveProposalModal(prev => prev ? ({ ...prev, data: { ...prev.data, title: e.target.value } }) : null)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-extrabold text-slate-700">{isIndonesian ? "Lembaga Penyelenggara / Mitra *" : "Provider / Institution *"}</label>
                  <input
                    type="text"
                    value={approveProposalModal.data.provider || ""}
                    onChange={(e) => setApproveProposalModal(prev => prev ? ({ ...prev, data: { ...prev.data, provider: e.target.value } }) : null)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-extrabold text-slate-700">{isIndonesian ? "Kategori Bidang *" : "Category *"}</label>
                  <input
                    type="text"
                    value={approveProposalModal.data.category || ""}
                    onChange={(e) => setApproveProposalModal(prev => prev ? ({ ...prev, data: { ...prev.data, category: e.target.value } }) : null)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-extrabold text-slate-700">{isIndonesian ? "Format Pelaksanaan *" : "Delivery Format *"}</label>
                  <select
                    value={approveProposalModal.data.format || "Online"}
                    onChange={(e) => setApproveProposalModal(prev => prev ? ({ ...prev, data: { ...prev.data, format: e.target.value } }) : null)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500/20"
                  >
                    <option value="Online">Online / Daring</option>
                    <option value="Offline">Offline / Tatap Muka</option>
                    <option value="Hybrid">Hybrid (Kombinasi)</option>
                    <option value="Self-Paced">Self-Paced (Mandiri)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-extrabold text-slate-700">{isIndonesian ? "Tingkat Kemahiran *" : "Level *"}</label>
                  <select
                    value={approveProposalModal.data.level || "Beginner"}
                    onChange={(e) => setApproveProposalModal(prev => prev ? ({ ...prev, data: { ...prev.data, level: e.target.value } }) : null)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500/20"
                  >
                    <option value="Beginner">Beginner / Pemula</option>
                    <option value="Intermediate">Intermediate / Menengah</option>
                    <option value="Advanced">Advanced / Mahir</option>
                    <option value="All Levels">All Levels (Semua Jenjang)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-extrabold text-slate-700">{isIndonesian ? "Biaya / Harga Tampil *" : "Price Tag *"}</label>
                  <input
                    type="text"
                    value={approveProposalModal.data.price || "Gratis"}
                    onChange={(e) => setApproveProposalModal(prev => prev ? ({ ...prev, data: { ...prev.data, price: e.target.value } }) : null)}
                    placeholder="Contoh: Gratis atau Rp 1.500.000"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-extrabold text-slate-700">{isIndonesian ? "Estimasi Durasi *" : "Duration *"}</label>
                  <input
                    type="text"
                    value={approveProposalModal.data.duration || "4 Minggu"}
                    onChange={(e) => setApproveProposalModal(prev => prev ? ({ ...prev, data: { ...prev.data, duration: e.target.value } }) : null)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-extrabold text-slate-700">{isIndonesian ? "Tanggal Mulai / Batch" : "Start Date / Batch"}</label>
                  <input
                    type="text"
                    value={approveProposalModal.data.startDate || ""}
                    onChange={(e) => setApproveProposalModal(prev => prev ? ({ ...prev, data: { ...prev.data, startDate: e.target.value } }) : null)}
                    placeholder="Contoh: 15 Mei 2026"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-extrabold text-slate-700">{isIndonesian ? "Kuota Peserta" : "Participant Quota"}</label>
                  <input
                    type="text"
                    value={approveProposalModal.data.quota || ""}
                    onChange={(e) => setApproveProposalModal(prev => prev ? ({ ...prev, data: { ...prev.data, quota: e.target.value } }) : null)}
                    placeholder="Contoh: 50 Kursi"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="font-extrabold text-slate-700">{isIndonesian ? "Tautan Pendaftaran Mitra *" : "Partner Registration Link *"}</label>
                  <input
                    type="url"
                    value={approveProposalModal.data.link || ""}
                    onChange={(e) => setApproveProposalModal(prev => prev ? ({ ...prev, data: { ...prev.data, link: e.target.value } }) : null)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="font-extrabold text-slate-700">{isIndonesian ? "Deskripsi Program *" : "Program Description *"}</label>
                  <textarea
                    rows={3}
                    value={approveProposalModal.data.description || ""}
                    onChange={(e) => setApproveProposalModal(prev => prev ? ({ ...prev, data: { ...prev.data, description: e.target.value } }) : null)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                {/* Email notification to partner */}
                <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-2xl sm:col-span-2 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-emerald-600" />
                    <span className="font-extrabold text-emerald-950">{isIndonesian ? "Kirim Notifikasi Email Konfirmasi ke Mitra" : "Dispatch Confirmation Email to Partner"}</span>
                  </div>
                  <p className="text-[11px] text-emerald-800">
                    {isIndonesian 
                      ? `Sistem akan mengirim email resmi ke ${approveProposalModal.proposal.email} memberitahukan bahwa program telah berhasil disetujui dan tayang di katalog.`
                      : `An official system notice will be emailed to ${approveProposalModal.proposal.email} confirming program catalog publication.`}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setApproveProposalModal(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors"
              >
                {isIndonesian ? "Batal" : "Cancel"}
              </button>
              <button
                type="button"
                onClick={handleConfirmApproveProposal}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all shadow-md shadow-emerald-600/20 inline-flex items-center gap-1.5"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>{isIndonesian ? "Konfirmasi & Publikasikan Program" : "Confirm & Publish Program"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 13. STATUS UPDATE / ADMIN NOTES MODAL */}
      {/* ========================================================================= */}
      {replyNotesModal && replyNotesModal.isOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150" id="admin-status-notes-modal">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-lg w-full p-6 space-y-5">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
                <Pencil className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">
                  {isIndonesian ? "Perbarui Status & Catatan Diskusi" : "Update Status & Discussion Notes"}
                </h3>
                <p className="text-xs text-slate-500 font-semibold truncate max-w-xs">
                  {replyNotesModal.proposal.programTitle || replyNotesModal.proposal.institutionName}
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-extrabold text-slate-700">{isIndonesian ? "Status Tiket Proposal" : "Ticket Status"}</label>
                <select
                  value={replyNotesModal.status}
                  onChange={(e) => setReplyNotesModal(prev => prev ? ({ ...prev, status: e.target.value as any }) : null)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="pending">{isIndonesian ? "Pending / Menunggu Hubungan Admin" : "Pending Action"}</option>
                  <option value="under_review">{isIndonesian ? "Under Review (Sedang Ditelepon / Dibahas)" : "Under Review (In Phone Discussion)"}</option>
                  <option value="approved">{isIndonesian ? "Disetujui (Approved)" : "Approved"}</option>
                  <option value="rejected">{isIndonesian ? "Ditolak (Rejected)" : "Rejected"}</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-extrabold text-slate-700">{isIndonesian ? "Catatan Internal Super Admin" : "Internal Admin Notes"}</label>
                <textarea
                  rows={4}
                  value={replyNotesModal.adminNotes}
                  onChange={(e) => setReplyNotesModal(prev => prev ? ({ ...prev, adminNotes: e.target.value }) : null)}
                  placeholder={isIndonesian ? "Tuliskan hasil pembicaraan telepon dengan PIC, kesepakatan jadwal, atau alasan penolakan..." : "Record phone discussion outcomes, schedule agreement, or rejection notes..."}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setReplyNotesModal(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors"
              >
                {isIndonesian ? "Batal" : "Cancel"}
              </button>
              <button
                type="button"
                onClick={handleSaveProposalStatus}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all shadow-xs inline-flex items-center gap-1.5"
              >
                <Check className="h-4 w-4" />
                <span>{isIndonesian ? "Simpan Perubahan" : "Save Changes"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 14. SCHOLARSHIP APPLICATION CURATION & DOSSIER MODAL */}
      {/* ========================================================================= */}
      {inspectScholarshipApp && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150" id="admin-scholarship-review-modal">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-2xl w-full p-6 sm:p-7 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3.5">
                <img
                  src={inspectScholarshipApp.candidateAvatar || DEFAULT_PROFILE_IMAGE}
                  alt={inspectScholarshipApp.candidateName}
                  className="h-12 w-12 rounded-2xl object-cover border border-slate-200 shadow-xs"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = DEFAULT_PROFILE_IMAGE;
                  }}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-black text-slate-900">
                      {inspectScholarshipApp.candidateName}
                    </h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      inspectScholarshipApp.status === "approved" ? "bg-emerald-100 text-emerald-800" :
                      inspectScholarshipApp.status === "interview_scheduled" ? "bg-purple-100 text-purple-800" :
                      inspectScholarshipApp.status === "rejected" ? "bg-rose-100 text-rose-800" :
                      "bg-amber-100 text-amber-900"
                    }`}>
                      {inspectScholarshipApp.status === "approved" ? (isIndonesian ? "Disetujui" : "Approved") :
                       inspectScholarshipApp.status === "interview_scheduled" ? (isIndonesian ? "Wawancara" : "Interview") :
                       inspectScholarshipApp.status === "rejected" ? (isIndonesian ? "Ditolak" : "Rejected") :
                       (isIndonesian ? "Menunggu Kurasi" : "Under Review")}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    {inspectScholarshipApp.candidateEmail} • {inspectScholarshipApp.candidatePhone}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setInspectScholarshipApp(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 cursor-pointer transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Target Training Info */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
              <div className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
                {isIndonesian ? "Program Pelatihan yang Diajukan (Beasiswa 100% Didanai)" : "Target Training Program (100% Funded Scholarship)"}
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-sm font-black text-slate-900">{inspectScholarshipApp.trainingTitle}</h4>
                  <p className="text-xs text-slate-600 font-semibold">{inspectScholarshipApp.provider}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-xl text-xs font-bold ${
                    inspectScholarshipApp.format === "Online" ? "bg-blue-100 text-blue-800" : "bg-emerald-100 text-emerald-800"
                  }`}>
                    {inspectScholarshipApp.format}
                  </span>
                  <span className="bg-amber-100 text-amber-900 px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-amber-700" />
                    {inspectScholarshipApp.weeklyCommitmentHours} {isIndonesian ? "Jam/Minggu" : "Hrs/Wk"}
                  </span>
                </div>
              </div>
            </div>

            {/* Candidate Dossier Details */}
            <div className="space-y-4 text-xs">
              {/* Motivation Essay */}
              <div className="space-y-1.5">
                <label className="font-extrabold text-slate-800 flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-blue-600" />
                  <span>{isIndonesian ? "Esai Motivasi & Latar Belakang Ekonomi/Akademik" : "Motivation Essay & Background"}</span>
                </label>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">
                  {inspectScholarshipApp.motivationEssay || (inspectScholarshipApp as any).reasonForScholarship || (isIndonesian ? "Tidak ada esai yang dilampirkan." : "No essay provided.")}
                </div>
              </div>

              {/* Career Goals */}
              {inspectScholarshipApp.careerGoals && (
                <div className="space-y-1.5">
                  <label className="font-extrabold text-slate-800 flex items-center gap-1.5">
                    <Target className="h-3.5 w-3.5 text-purple-600" />
                    <span>{isIndonesian ? "Target Karir & Rencana Pasca Kelulusan" : "Career Goals Post-Graduation"}</span>
                  </label>
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 leading-relaxed font-medium">
                    {inspectScholarshipApp.careerGoals}
                  </div>
                </div>
              )}

              {/* GPA / Achievements & Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    {isIndonesian ? "IPK / Prestasi Utama" : "GPA / Key Achievements"}
                  </span>
                  <p className="font-bold text-slate-800 text-xs">
                    {inspectScholarshipApp.gpaOrAchievement || "-"}
                  </p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    {isIndonesian ? "Tautan Portofolio / LinkedIn" : "Portfolio / LinkedIn"}
                  </span>
                  <div className="flex items-center gap-2 truncate">
                    {inspectScholarshipApp.portfolioUrl ? (
                      <a 
                        href={inspectScholarshipApp.portfolioUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-blue-600 hover:underline font-bold text-xs flex items-center gap-1 truncate"
                      >
                        <ExternalLink className="h-3 w-3 shrink-0" />
                        <span className="truncate">{inspectScholarshipApp.portfolioUrl}</span>
                      </a>
                    ) : (
                      <span className="text-slate-400 font-medium">-</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Admin Curation Feedback Note Input */}
              <div className="space-y-1.5 pt-2">
                <label className="font-extrabold text-slate-800 flex items-center gap-1.5">
                  <Pencil className="h-3.5 w-3.5 text-amber-600" />
                  <span>{isIndonesian ? "Catatan Panitia Kurasi / Umpan Balik untuk Kandidat" : "Committee Curation Feedback / Notes"}</span>
                </label>
                <textarea
                  rows={3}
                  value={reviewFeedbackInput}
                  onChange={(e) => setReviewFeedbackInput(e.target.value)}
                  placeholder={isIndonesian 
                    ? "Contoh: Berkas Anda sangat kuat. Anda dijadwalkan wawancara teknis pada hari Kamis pukul 14.00 WIB." 
                    : "E.g.: Strong profile. You are scheduled for an interview on Thursday at 2 PM."}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setInspectScholarshipApp(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors"
              >
                {isIndonesian ? "Tutup" : "Close"}
              </button>

              <div className="flex flex-wrap items-center gap-2">
                {inspectScholarshipApp.status !== "rejected" && (
                  <button
                    type="button"
                    onClick={() => handleReviewScholarshipApp(inspectScholarshipApp.id, "rejected")}
                    className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all"
                  >
                    {isIndonesian ? "Tolak Aplikasi" : "Reject Application"}
                  </button>
                )}

                {inspectScholarshipApp.status !== "interview_scheduled" && inspectScholarshipApp.status !== "approved" && (
                  <button
                    type="button"
                    onClick={() => handleReviewScholarshipApp(inspectScholarshipApp.id, "interview_scheduled")}
                    className="bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all"
                  >
                    {isIndonesian ? "Jadwalkan Wawancara" : "Schedule Interview"}
                  </button>
                )}

                {inspectScholarshipApp.status !== "approved" && (
                  <button
                    type="button"
                    onClick={() => handleReviewScholarshipApp(inspectScholarshipApp.id, "approved")}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all shadow-md shadow-emerald-600/20 inline-flex items-center gap-1.5"
                  >
                    <Check className="h-4 w-4" />
                    <span>{isIndonesian ? "Setujui Beasiswa (100% Funded)" : "Approve Full Scholarship"}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
