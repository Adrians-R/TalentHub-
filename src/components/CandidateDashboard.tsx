/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from "react";
import { 
  User, 
  MapPin, 
  Briefcase, 
  BookOpen, 
  Award, 
  FileText, 
  Video, 
  CheckCircle2, 
  AlertCircle, 
  ArrowUpRight, 
  ChevronLeft,
  ChevronRight, 
  Plus, 
  Trash2, 
  Edit3, 
  Target,
  FileCheck,
  Send, 
  Calendar, 
  Banknote, 
  Activity, 
  Maximize2, 
  FileSpreadsheet,
  Settings,
  Bell,
  Search,
  Download,
  Camera,
  Upload,
  Image,
  RefreshCw,
  Check,
  X,
  ShieldCheck,
  Shield,
  Lock,
  Eye,
  EyeOff,
  MailCheck,
  Mail,
  Key,
  Info,
  Smartphone,
  ExternalLink,
  Globe,
  ImageIcon,
  Crown,
  Zap,
  RotateCcw,
  QrCode,
  CreditCard,
  GraduationCap,
  Printer,
  Clock,
  Users
} from "lucide-react";
import CandidateJobSearchView from "./CandidateJobSearchView";
import CandidatePlanModal from "./CandidatePlanModal";
import InstructorVideoReplayModal from "./InstructorVideoReplayModal";
import { downloadCandidateCv } from "../utils/generatePdfCv";
import { 
  Candidate, 
  Skill, 
  WorkExperience, 
  Education, 
  Certificate, 
  PortfolioProject, 
  Invitation, 
  Message,
  SkillCategory,
  SkillLevel,
  EnrolledTraining,
  CandidateScholarshipApplication,
  DEFAULT_PROFILE_IMAGE,
  getProfileAvatar,
  isDefaultAvatar
} from "../types";
import { useLanguage } from "../context/LanguageContext";

export const PORTFOLIO_COVER_PRESETS = [
  {
    id: "port-cov-1",
    label: "Fintech & Analytics",
    url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "port-cov-2",
    label: "Mobile App UI",
    url: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "port-cov-3",
    label: "SaaS Dashboard",
    url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "port-cov-4",
    label: "Cloud Architecture",
    url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "port-cov-5",
    label: "E-Commerce & Retail",
    url: "https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "port-cov-6",
    label: "AI & Neural Tech",
    url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800"
  }
];

const PRESET_COVERS = [
  {
    id: "cov-1",
    name: "Tech Nexus Gradient",
    url: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=1200&h=400"
  },
  {
    id: "cov-2",
    name: "Minimal Blue Waves",
    url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200&h=400"
  },
  {
    id: "cov-3",
    name: "Developer Workspace",
    url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1200&h=400"
  },
  {
    id: "cov-4",
    name: "Dark Indigo Matrix",
    url: "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=1200&h=400"
  }
];

interface CandidateDashboardProps {
  candidate: Candidate;
  onUpdateCandidate: (updated: Candidate) => void;
  invitations: Invitation[];
  onUpdateInvitationStatus: (invitationId: string, status: "accepted" | "rejected" | "scheduled") => void;
  messages: Message[];
  onSendMessage: (invitationId: string, content: string) => void;
  isLoggedIn?: boolean;
  currentUser?: any;
}

export default function CandidateDashboard({
  candidate,
  onUpdateCandidate,
  invitations,
  onUpdateInvitationStatus,
  messages,
  onSendMessage,
  isLoggedIn = true,
  currentUser,
}: CandidateDashboardProps) {
  const { t, formatCurrency, isIndonesian } = useLanguage();
  // Navigation inside candidate panel
  const [innerTab, setInnerTab] = useState<string>("dashboard");

  // Candidate Sub-tabs scroll state & affordance tracking
  const candidateTabsScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftPos, setScrollLeftPos] = useState(0);

  const checkCandidateTabsScroll = React.useCallback(() => {
    const el = candidateTabsScrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    const isOverflowing = maxScroll > 4;
    setHasOverflow(isOverflowing);
    setCanScrollLeft(el.scrollLeft > 6);
    setCanScrollRight(el.scrollLeft < maxScroll - 6);
    if (maxScroll > 0) {
      setScrollProgress(Math.min(100, Math.max(0, (el.scrollLeft / maxScroll) * 100)));
    } else {
      setScrollProgress(0);
    }
  }, []);

  React.useEffect(() => {
    const timer = setTimeout(checkCandidateTabsScroll, 50);
    const el = candidateTabsScrollRef.current;
    
    let observer: ResizeObserver | null = null;
    if (el && typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(() => {
        checkCandidateTabsScroll();
      });
      observer.observe(el);
    }

    window.addEventListener("resize", checkCandidateTabsScroll);
    return () => {
      clearTimeout(timer);
      if (observer) observer.disconnect();
      window.removeEventListener("resize", checkCandidateTabsScroll);
    };
  }, [checkCandidateTabsScroll, innerTab]);

  const handleCandidateTabsScroll = (direction: "left" | "right") => {
    if (!candidateTabsScrollRef.current) return;
    const amount = direction === "left" ? -280 : 280;
    candidateTabsScrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    setTimeout(checkCandidateTabsScroll, 320);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!candidateTabsScrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - candidateTabsScrollRef.current.offsetLeft);
    setScrollLeftPos(candidateTabsScrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !candidateTabsScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - candidateTabsScrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    candidateTabsScrollRef.current.scrollLeft = scrollLeftPos - walk;
    checkCandidateTabsScroll();
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const handleSelectTab = (tabId: string) => {
    setInnerTab(tabId);
    setTimeout(() => {
      const btn = document.getElementById(`candidate-tab-btn-${tabId}`);
      if (btn && candidateTabsScrollRef.current) {
        btn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      }
    }, 50);
  };

  // State for AI resume input
  const [resumeText, setResumeText] = useState(`ALEX RIVERA
alex.rivera@example.com | Jakarta, Indonesia

RINGKASAN PROFESIONAL / PROFESSIONAL SUMMARY
Senior Software Engineer berpengalaman 5+ tahun dalam pengembangan arsitektur web modern, React, TypeScript, dan microservices berkinerja tinggi.

KEAHLIAN / SKILLS
React, TypeScript, Next.js, Node.js, Tailwind CSS, PostgreSQL, Docker, GCP

PENGALAMAN KERJA / EXPERIENCE
Senior Frontend Engineer - Tokopedia (2022-2025)
- Memimpin pengembangan modul checkout pembayaran berkecepatan tinggi.
- Mengoptimalkan web vitals hingga meningkatkan konversi sebesar 24%.`);
  
  const [targetHeadline, setTargetHeadline] = useState("Senior Frontend & Cloud Engineer");
  const [isAILoading, setIsAILoading] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [quotaToast, setQuotaToast] = useState<string | null>(null);

  // Membership & Quota calculations
  const membershipPlan = candidate.membershipPlan || "Free";
  const quotaLimit = candidate.aiAtsQuotaLimit !== undefined ? candidate.aiAtsQuotaLimit : 2;
  const quotaUsed = candidate.aiAtsQuotaUsed || 0;
  const quotaRemaining = membershipPlan === "Pro" ? 999 : Math.max(0, quotaLimit - quotaUsed);
  // [PAID_FEATURE_TOGGLE] Free Trial Mode: All paid quota restrictions are lifted.
  // Original logic to restore paid quotas:
  // const isQuotaExhausted = membershipPlan !== "Pro" && quotaRemaining <= 0;
  const isQuotaExhausted = false;

  // State for AI Skill Gap
  const [skillGapRole, setSkillGapRole] = useState("Lead Cloud Solutions Architect");
  const [isSkillGapLoading, setIsSkillGapLoading] = useState(false);
  const [skillGapResult, setSkillGapResult] = useState<any>(null);

  // Training Tab State & Modals
  const [trainingSubTab, setTrainingSubTab] = useState<"courses" | "scholarships">("courses");
  const [selectedReplayTraining, setSelectedReplayTraining] = useState<EnrolledTraining | null>(null);
  const [viewingTicket, setViewingTicket] = useState<EnrolledTraining | null>(null);
  const [viewingClassroom, setViewingClassroom] = useState<EnrolledTraining | null>(null);
  const [viewingInvoice, setViewingInvoice] = useState<EnrolledTraining | null>(null);
  const [trainingStatusFilter, setTrainingStatusFilter] = useState<"all" | "in_progress" | "completed">("all");
  const [copiedInvoiceNumber, setCopiedInvoiceNumber] = useState(false);

  // State for adding items
  const [editingAbout, setEditingAbout] = useState(false);
  const [aboutValue, setAboutValue] = useState(candidate.aboutMe);

  const [addingSkill, setAddingSkill] = useState(false);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillCategory, setNewSkillCategory] = useState<SkillCategory>(SkillCategory.Programming);
  const [newSkillLevel, setNewSkillLevel] = useState<SkillLevel>(SkillLevel.Intermediate);
  const [newSkillExp, setNewSkillExp] = useState(2);

  const [addingExp, setAddingExp] = useState(false);
  const [newExpCompany, setNewExpCompany] = useState("");
  const [newExpPos, setNewExpPos] = useState("");
  const [newExpStart, setNewExpStart] = useState("2025-01");
  const [newExpEnd, setNewExpEnd] = useState("Present");
  const [newExpCurrent, setNewExpCurrent] = useState(true);
  const [newExpDesc, setNewExpDesc] = useState("");

  // State for adding Education
  const [addingEdu, setAddingEdu] = useState(false);
  const [newEduSchool, setNewEduSchool] = useState("");
  const [newEduDegree, setNewEduDegree] = useState("");
  const [newEduMajor, setNewEduMajor] = useState("");
  const [newEduGpa, setNewEduGpa] = useState("");
  const [newEduYear, setNewEduYear] = useState<number>(2025);
  const [newEduActivities, setNewEduActivities] = useState("");

  // State for adding Certificate
  const [addingCert, setAddingCert] = useState(false);
  const [newCertName, setNewCertName] = useState("");
  const [newCertIssuer, setNewCertIssuer] = useState("");
  const [newCertIssueDate, setNewCertIssueDate] = useState("2025-01");
  const [newCertExpiryDate, setNewCertExpiryDate] = useState("Never");
  const [newCertId, setNewCertId] = useState("");

  // State for adding Portfolio
  const [addingPortfolio, setAddingPortfolio] = useState(false);
  const [newProjTitle, setNewProjTitle] = useState("");
  const [newProjRole, setNewProjRole] = useState("");
  const [newProjDesc, setNewProjDesc] = useState("");
  const [newProjTechs, setNewProjTechs] = useState("React, Tailwind CSS");
  const [newProjUrl, setNewProjUrl] = useState("");
  const [newProjGithubUrl, setNewProjGithubUrl] = useState("");
  const [newProjFigmaUrl, setNewProjFigmaUrl] = useState("");
  const [newProjThumbnail, setNewProjThumbnail] = useState("");
  const [isDraggingProjThumbnail, setIsDraggingProjThumbnail] = useState(false);
  const projThumbnailFileInputRef = useRef<HTMLInputElement>(null);
  const projProfileThumbnailFileInputRef = useRef<HTMLInputElement>(null);

  const [activeInvitationId, setActiveInvitationId] = useState<string | null>(
    invitations.length > 0 ? invitations[0].id : null
  );
  const [chatInputValue, setChatInputValue] = useState("");

  // State for Account Settings Photo Management
  const [customCoverUrl, setCustomCoverUrl] = useState("");
  const [photoFeedbackMsg, setPhotoFeedbackMsg] = useState<string | null>(null);
  const [isDraggingAvatar, setIsDraggingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverFileInputRef = useRef<HTMLInputElement>(null);

  // --- ACCOUNT SETTINGS EXTENDED FEATURES ---
  // Priority 1: Email Verification Simulation & State
  const isEmailVerified = candidate.emailVerified !== false;
  const [emailVerifyModalOpen, setEmailVerifyModalOpen] = useState(false);
  const [inputOtpCode, setInputOtpCode] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCooldown, setOtpCooldown] = useState(0);
  const [otpError, setOtpError] = useState<string | null>(null);

  const startOtpCooldownTimer = () => {
    setOtpCooldown(60);
    const interval = setInterval(() => {
      setOtpCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendVerificationEmail = () => {
    setIsSendingOtp(true);
    setOtpError(null);
    setTimeout(() => {
      setIsSendingOtp(false);
      setOtpSent(true);
      startOtpCooldownTimer();
      setPhotoFeedbackMsg(
        isIndonesian 
          ? `Kode verifikasi 6 digit telah dikirimkan ke ${candidate.email}!` 
          : `6-digit verification code sent to ${candidate.email}!`
      );
      setTimeout(() => setPhotoFeedbackMsg(null), 4000);
    }, 600);
  };

  const handleConfirmOtpCode = (overrideCode?: string) => {
    const code = (overrideCode || inputOtpCode).trim();
    if (!code || code.length < 6) {
      setOtpError(isIndonesian ? "Harap masukkan 6 digit kode verifikasi." : "Please enter the 6-digit verification code.");
      return;
    }
    setOtpError(null);
    onUpdateCandidate({ ...candidate, emailVerified: true });
    setEmailVerifyModalOpen(false);
    setInputOtpCode("");
    setOtpSent(false);
    setPhotoFeedbackMsg(
      isIndonesian 
        ? "Selamat! Email Anda berhasil diverifikasi secara resmi." 
        : "Success! Your email address has been officially verified."
    );
    setTimeout(() => setPhotoFeedbackMsg(null), 4500);
  };

  // Priority 2: Notification Preferences
  const [notificationPrefs, setNotificationPrefs] = useState({
    interviewInvites: candidate.notificationPreferences?.interviewInvites ?? true,
    directMessages: candidate.notificationPreferences?.directMessages ?? true,
    jobRecommendations: candidate.notificationPreferences?.jobRecommendations ?? true,
    weeklyDigest: candidate.notificationPreferences?.weeklyDigest ?? false,
    urgentSourcingAlerts: candidate.notificationPreferences?.urgentSourcingAlerts ?? true,
  });

  const handleToggleNotification = (key: keyof typeof notificationPrefs) => {
    const updated = { ...notificationPrefs, [key]: !notificationPrefs[key] };
    setNotificationPrefs(updated);
    onUpdateCandidate({
      ...candidate,
      notificationPreferences: updated,
    });
    setPhotoFeedbackMsg(
      isIndonesian ? "Preferensi notifikasi diperbarui!" : "Notification preference updated!"
    );
    setTimeout(() => setPhotoFeedbackMsg(null), 3000);
  };

  // Priority 3: Change Password & Security
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  // Compute password strength score (0-4)
  const computePasswordStrength = (pass: string) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1;
    if (/\d/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const passwordStrengthScore = computePasswordStrength(newPassword);

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!currentPassword) {
      setPasswordError(isIndonesian ? "Harap masukkan kata sandi Anda saat ini." : "Please enter your current password.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError(isIndonesian ? "Kata sandi baru minimal harus 8 karakter." : "New password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError(isIndonesian ? "Konfirmasi kata sandi baru tidak cocok." : "New password and confirmation do not match.");
      return;
    }

    // Success
    setPasswordSuccess(isIndonesian ? "Kata sandi akun Anda berhasil diperbarui dengan aman!" : "Your account password has been updated securely!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPhotoFeedbackMsg(isIndonesian ? "Kata sandi berhasil diperbarui!" : "Password updated successfully!");
    setTimeout(() => {
      setPasswordSuccess(null);
      setPhotoFeedbackMsg(null);
    }, 4500);
  };

  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert(isIndonesian ? "Harap pilih file gambar (JPG, PNG, WebP)." : "Please select an image file (JPG, PNG, WebP).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert(isIndonesian ? "Ukuran gambar maksimum adalah 5MB." : "Maximum image file size is 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const resultUrl = event.target?.result as string;
      if (resultUrl) {
        onUpdateCandidate({ ...candidate, avatar: resultUrl });
        setPhotoFeedbackMsg(isIndonesian ? "Foto profil berhasil diperbarui!" : "Profile photo updated successfully!");
        setTimeout(() => setPhotoFeedbackMsg(null), 4000);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingAvatar(false);
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) {
      alert(isIndonesian ? "Ukuran gambar maksimum adalah 5MB." : "Maximum image file size is 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const resultUrl = event.target?.result as string;
      if (resultUrl) {
        onUpdateCandidate({ ...candidate, avatar: resultUrl });
        setPhotoFeedbackMsg(isIndonesian ? "Foto profil berhasil diperbarui!" : "Profile photo updated successfully!");
        setTimeout(() => setPhotoFeedbackMsg(null), 4000);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetAvatar = () => {
    const defaultAvatar = DEFAULT_PROFILE_IMAGE;
    onUpdateCandidate({ ...candidate, avatar: defaultAvatar });
    setPhotoFeedbackMsg(isIndonesian ? "Foto profil diatur ulang ke foto standar default!" : "Profile photo reset to standard default image!");
    setTimeout(() => setPhotoFeedbackMsg(null), 4000);
  };

  const handleCoverFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert(isIndonesian ? "Harap pilih file gambar (JPG, PNG, WebP)." : "Please select an image file (JPG, PNG, WebP).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert(isIndonesian ? "Ukuran gambar maksimum adalah 5MB." : "Maximum image file size is 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const resultUrl = event.target?.result as string;
      if (resultUrl) {
        onUpdateCandidate({ ...candidate, coverImage: resultUrl });
        setPhotoFeedbackMsg(isIndonesian ? "Gambar sampul berhasil diperbarui!" : "Header cover updated successfully!");
        setTimeout(() => setPhotoFeedbackMsg(null), 4000);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handler: Analyze Resume
  const handleAnalyzeResume = async () => {
    // [PAID_FEATURE_TOGGLE] Quota paywall check commented out for Free Trial period.
    // Uncomment below to re-enable quota limit enforcement:
    /*
    if (isQuotaExhausted) {
      setQuotaToast(
        isIndonesian 
          ? "Kuota gratis telah habis (0/2 scan tersisa). Silakan upgrade ke Talent Pro untuk audit AI tanpa batas!"
          : "Free quota exhausted (0/2 scans remaining). Upgrade to Talent Pro for unlimited AI audits!"
      );
      setShowPlanModal(true);
      return;
    }
    */

    setIsAILoading(true);
    setAiResult(null);
    try {
      const response = await fetch("/api/ai/analyze-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, targetHeadline }),
      });
      const data = await response.json();
      setAiResult(data);

      const nextQuotaUsed = membershipPlan === "Pro" ? quotaUsed : quotaUsed + 1;

      if (data?.score) {
        onUpdateCandidate({
          ...candidate,
          atsScore: data.score,
          aiAtsQuotaUsed: nextQuotaUsed,
        });
      } else {
        onUpdateCandidate({
          ...candidate,
          aiAtsQuotaUsed: nextQuotaUsed,
        });
      }

      if (membershipPlan !== "Pro") {
        const remainingAfter = Math.max(0, quotaLimit - nextQuotaUsed);
        setQuotaToast(
          isIndonesian 
            ? `Audit AI ATS berhasil! Terpakai 1 kuota (Tersisa: ${remainingAfter}/${quotaLimit} Scan Gratis).`
            : `AI ATS audit complete! 1 credit used (Remaining: ${remainingAfter}/${quotaLimit} Free Scans).`
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAILoading(false);
    }
  };

  // Handler: Skill Gap Analysis
  const handleSkillGapAnalysis = async () => {
    setIsSkillGapLoading(true);
    setSkillGapResult(null);
    try {
      const currentSkillList = candidate.skills.map(s => s.name);
      const response = await fetch("/api/ai/skill-gap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentSkills: currentSkillList, targetRole: skillGapRole }),
      });
      const data = await response.json();
      setSkillGapResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSkillGapLoading(false);
    }
  };

  // Handler: Add Skill
  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    const newSkill: Skill = {
      id: `sk_gen_${Date.now()}`,
      name: newSkillName.trim(),
      level: newSkillLevel,
      yearsOfExperience: newSkillExp,
      category: newSkillCategory,
      endorsements: 0
    };
    const updatedSkills = [...candidate.skills, newSkill];
    onUpdateCandidate({ ...candidate, skills: updatedSkills });
    setNewSkillName("");
    setAddingSkill(false);
  };

  // Handler: Remove Skill
  const handleRemoveSkill = (skillId: string) => {
    const updatedSkills = candidate.skills.filter(s => s.id !== skillId);
    onUpdateCandidate({ ...candidate, skills: updatedSkills });
  };

  // Handler: Add Experience
  const handleAddExperience = () => {
    if (!newExpCompany.trim() || !newExpPos.trim()) return;
    const newExperience: WorkExperience = {
      id: `exp_gen_${Date.now()}`,
      company: newExpCompany.trim(),
      position: newExpPos.trim(),
      employmentType: "Full-time",
      startDate: newExpStart,
      endDate: newExpCurrent ? "Present" : newExpEnd,
      current: newExpCurrent,
      responsibilities: [newExpDesc.trim()],
      achievements: [],
      technologiesUsed: ["React", "TypeScript"]
    };
    const updatedExp = [newExperience, ...candidate.experience];
    onUpdateCandidate({ ...candidate, experience: updatedExp });
    setNewExpCompany("");
    setNewExpPos("");
    setNewExpDesc("");
    setAddingExp(false);
  };

  // Handler: Add Education
  const handleAddEducation = () => {
    if (!newEduSchool.trim() || !newEduDegree.trim() || !newEduMajor.trim()) return;
    const newEdu: Education = {
      id: `edu_gen_${Date.now()}`,
      school: newEduSchool.trim(),
      degree: newEduDegree.trim(),
      major: newEduMajor.trim(),
      gpa: newEduGpa.trim() || "4.0",
      graduationYear: Number(newEduYear) || 2025,
      activities: newEduActivities.trim() || undefined
    };
    const updatedEdu = [newEdu, ...candidate.education];
    onUpdateCandidate({ ...candidate, education: updatedEdu });
    setNewEduSchool("");
    setNewEduDegree("");
    setNewEduMajor("");
    setNewEduGpa("");
    setNewEduActivities("");
    setAddingEdu(false);
  };

  // Handler: Remove Education
  const handleRemoveEducation = (eduId: string) => {
    const updatedEdu = candidate.education.filter(e => e.id !== eduId);
    onUpdateCandidate({ ...candidate, education: updatedEdu });
  };

  // Handler: Add Certificate
  const handleAddCertificate = () => {
    if (!newCertName.trim() || !newCertIssuer.trim()) return;
    const newCertificate: Certificate = {
      id: `cert_gen_${Date.now()}`,
      name: newCertName.trim(),
      issuer: newCertIssuer.trim(),
      issueDate: newCertIssueDate,
      expirationDate: newCertExpiryDate.trim() || "Never",
      credentialId: newCertId.trim() || `ID-${Math.floor(Math.random() * 900000 + 100000)}`,
      verified: false
    };
    const updatedCerts = [newCertificate, ...(candidate.certificates || [])];
    onUpdateCandidate({ ...candidate, certificates: updatedCerts });
    setNewCertName("");
    setNewCertIssuer("");
    setNewCertId("");
    setAddingCert(false);
  };

  // Handler: Remove Certificate
  const handleRemoveCertificate = (certId: string) => {
    const updatedCerts = (candidate.certificates || []).filter(c => c.id !== certId);
    onUpdateCandidate({ ...candidate, certificates: updatedCerts });
  };

  // Handlers for Portfolio Project Cover Image Upload
  const handleProjThumbnailFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert(isIndonesian ? "Harap pilih file gambar (JPG, PNG, WebP)." : "Please select an image file (JPG, PNG, WebP).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert(isIndonesian ? "Ukuran gambar maksimum adalah 5MB." : "Maximum image file size is 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const resultUrl = event.target?.result as string;
      if (resultUrl) {
        setNewProjThumbnail(resultUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleProjThumbnailDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingProjThumbnail(false);
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) {
      alert(isIndonesian ? "Ukuran gambar maksimum adalah 5MB." : "Maximum image file size is 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const resultUrl = event.target?.result as string;
      if (resultUrl) {
        setNewProjThumbnail(resultUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handler: Add Portfolio
  const handleAddPortfolio = () => {
    if (!newProjTitle.trim() || !newProjRole.trim() || !newProjDesc.trim()) return;
    const finalThumbnail = newProjThumbnail.trim() || 
      PORTFOLIO_COVER_PRESETS[Math.floor(Math.random() * PORTFOLIO_COVER_PRESETS.length)].url;

    const newProj: PortfolioProject = {
      id: `proj_gen_${Date.now()}`,
      title: newProjTitle.trim(),
      thumbnail: finalThumbnail,
      description: newProjDesc.trim(),
      role: newProjRole.trim(),
      technology: newProjTechs.split(",").map(t => t.trim()).filter(Boolean),
      websiteUrl: newProjUrl.trim() || undefined,
      githubUrl: newProjGithubUrl.trim() || undefined,
      figmaUrl: newProjFigmaUrl.trim() || undefined
    };
    const updatedPortfolio = [newProj, ...candidate.portfolio];
    onUpdateCandidate({ ...candidate, portfolio: updatedPortfolio });
    setNewProjTitle("");
    setNewProjRole("");
    setNewProjDesc("");
    setNewProjTechs("React, Tailwind CSS");
    setNewProjUrl("");
    setNewProjGithubUrl("");
    setNewProjFigmaUrl("");
    setNewProjThumbnail("");
    setAddingPortfolio(false);
  };

  // Handler: Remove Portfolio
  const handleRemovePortfolio = (projId: string) => {
    const updatedPortfolio = candidate.portfolio.filter(p => p.id !== projId);
    onUpdateCandidate({ ...candidate, portfolio: updatedPortfolio });
  };

  // Handler: Remove Experience
  const handleRemoveExperience = (expId: string) => {
    const updatedExp = candidate.experience.filter(e => e.id !== expId);
    onUpdateCandidate({ ...candidate, experience: updatedExp });
  };

  // Chat message send
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInputValue.trim() || !activeInvitationId) return;
    onSendMessage(activeInvitationId, chatInputValue.trim());
    setChatInputValue("");
  };

  // Load a sample resume for candidate testing
  const handleLoadSampleResume = () => {
    setResumeText(`ALEX RIVERA
alex.rivera@example.com | San Francisco, CA | https://alexrivera.dev

PROFESSIONAL SUMMARY
Highly capable Senior Full Stack Developer with 6+ years of specialized engineering in building high-throughput UI components, Node.js REST controllers, and Docker cloud deployments. Leading agile sprints and reducing page rendering lags.

CORE CAPABILITIES
React, Next.js Server Components, TypeScript, Redis, Node.js microservices, Docker, SQL Databases, Tailwind CSS

PROFESSIONAL EXPERIENCE
Vercel Inc. — Senior Software Engineer (2024 - Present)
- Architecting low-latency layout loaders resulting in 22% Next.js performance enhancements.
- Tutoring 6 entry-level and intermediate coders.

Stripe — Software Engineer II (2021 - 2024)
- Built global checkout components, handling $50M transaction traffic.
- Overhauled middleware error retries lowering page-load fails by 30%.`);
  };

  const activeInvitation = invitations.find(i => i.id === activeInvitationId);

  // Dynamically synchronize message threads with the backend
  const [activeChatMessages, setActiveChatMessages] = useState<Message[]>([]);

  React.useEffect(() => {
    if (!activeInvitationId) {
      setActiveChatMessages([]);
      return;
    }
    // Fallback/Initial sync
    setActiveChatMessages(messages.filter(m => m.invitationId === activeInvitationId));

    // Dynamic fetch from backend
    fetch(`/api/candidates/messages/${activeInvitationId}`)
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error();
      })
      .then((data) => {
        if (data.messages) {
          setActiveChatMessages(data.messages);
        }
      })
      .catch(() => {});
  }, [activeInvitationId, messages]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="candidate-workspace">
      
      {/* Upper Cover Header Card */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden relative mb-8">
        <div className="h-44 sm:h-56 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 relative overflow-hidden">
          {candidate.coverImage && (
            <img 
              src={candidate.coverImage} 
              alt="Cover background" 
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
          <div className="absolute top-4 right-4 bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-white border border-white/25 shadow-xs">
            {isIndonesian ? "Ruang Kerja Talenta Pribadi" : "Personal Talent Workspace"}
          </div>
        </div>

        <div className="px-6 pb-6 pt-3 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            
            {/* Left: Avatar (floats across cover seam) + Candidate info on white background */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 min-w-0 flex-1">
              {/* Avatar with negative top margin to float across the cover boundary */}
              <div className="relative group shrink-0 -mt-16 sm:-mt-20">
                <img
                  src={getProfileAvatar(candidate.avatar)}
                  alt={candidate.fullName}
                  className="h-28 w-28 sm:h-32 sm:w-32 rounded-3xl object-cover border-4 border-white shadow-xl ring-1 ring-slate-150 bg-white"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = DEFAULT_PROFILE_IMAGE;
                  }}
                />
                <button
                  onClick={() => setInnerTab("settings")}
                  title={isIndonesian ? "Ubah foto profil di Pengaturan Akun" : "Change profile photo in Account Settings"}
                  className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity flex flex-col items-center justify-center text-white cursor-pointer"
                >
                  <Camera className="h-6 w-6 mb-1" />
                  <span className="text-[10px] font-bold">{isIndonesian ? "Ubah Foto" : "Edit Photo"}</span>
                </button>
              </div>

              {/* Text Block - sits strictly on the white card surface */}
              <div className="space-y-1.5 min-w-0 flex-1 pt-1 sm:pt-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight truncate max-w-full">
                    {candidate.fullName}
                  </h1>
                  {candidate.verified && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 shadow-2xs shrink-0">
                      <ShieldCheck className="h-3 w-3 text-emerald-600 shrink-0" />
                      <span>{t("verified_badge")}</span>
                    </span>
                  )}
                  {membershipPlan === "Pro" && (
                    <span
                      className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-50 text-amber-800 border border-amber-300 flex items-center gap-1 shadow-2xs shrink-0"
                      title={isIndonesian ? "Kandidat Premium (Talent Pro)" : "Premium Candidate (Talent Pro)"}
                    >
                      <Crown className="h-3 w-3 text-amber-500 shrink-0" />
                      <span>PRO</span>
                    </span>
                  )}
                </div>

                <p className="text-sm font-semibold text-slate-600 max-w-2xl break-words">
                  {candidate.headline}
                </p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500 font-bold pt-0.5">
                  <span className="flex items-center"><MapPin className="h-3.5 w-3.5 mr-1 text-slate-400 shrink-0" /> {candidate.location}</span>
                  <span className="flex items-center"><Banknote className="h-3.5 w-3.5 mr-1 text-slate-400 shrink-0" /> {t("expected_salary")}: {formatCurrency(candidate.expectedSalary, "bln")}</span>
                  <span className="flex items-center"><Calendar className="h-3.5 w-3.5 mr-1 text-slate-400 shrink-0" /> {isIndonesian ? "Ketersediaan" : "Availability"}: {candidate.availability}</span>
                </div>
              </div>
            </div>

            {/* Right: Visibility Toggle */}
            <div className="flex items-center space-x-3 bg-slate-50 p-2.5 rounded-2xl border border-slate-100 shadow-2xs self-start md:self-end shrink-0">
              <div className="text-left sm:text-right">
                <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{isIndonesian ? "Visibilitas" : "Visibility"}</div>
                <div className="text-xs font-bold text-slate-800">{isIndonesian ? "Terbuka untuk Perekrut" : "Open to Recruiters"}</div>
              </div>
              <button
                id="visibility-toggle-btn"
                onClick={() => onUpdateCandidate({ ...candidate, openToWork: !candidate.openToWork })}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  candidate.openToWork ? "bg-emerald-500" : "bg-slate-300"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    candidate.openToWork ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

          </div>
        </div>

        {/* Quota Toast Notification Banner */}
        {quotaToast && (
          <div className="mx-6 mb-3 p-3.5 bg-indigo-50 border border-indigo-200 rounded-2xl text-xs font-bold text-indigo-900 flex items-center justify-between shadow-xs animate-fade-in">
            <div className="flex items-center space-x-2">
              <Info className="h-4 w-4 text-indigo-600 shrink-0" />
              <span>{quotaToast}</span>
            </div>
            <button
              onClick={() => setQuotaToast(null)}
              className="text-indigo-400 hover:text-indigo-800 text-xs px-2 py-1 rounded-lg hover:bg-indigo-100 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Dashboard inner tabs navigation with swipeable indicator and scroll controls */}
        <div className="relative border-t border-slate-100 bg-slate-50/70 select-none">
          <div className="relative flex items-center">
            {/* Left Scroll Trigger Button */}
            {canScrollLeft && (
              <button
                type="button"
                onClick={() => handleCandidateTabsScroll("left")}
                aria-label="Scroll left"
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-xl bg-white/95 backdrop-blur-xs border border-slate-200 text-slate-700 shadow-md flex items-center justify-center hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 cursor-pointer transition-all hover:scale-105 active:scale-95"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            )}

            {/* Left Edge Gradient Fade */}
            {canScrollLeft && (
              <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-slate-50 via-slate-50/90 to-transparent pointer-events-none rounded-bl-3xl z-10" />
            )}

            {/* Horizontal Scrollable Tabs Container */}
            <div
              ref={candidateTabsScrollRef}
              onScroll={checkCandidateTabsScroll}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUpOrLeave}
              onMouseLeave={handleMouseUpOrLeave}
              className={`flex items-center space-x-1 overflow-x-auto no-scrollbar px-4 sm:px-6 py-1 scroll-smooth w-full ${
                isDragging ? "cursor-grabbing" : hasOverflow ? "cursor-grab" : "cursor-default"
              }`}
            >
              {[
                { id: "dashboard", label: isIndonesian ? "Dashboard" : "Dashboard", icon: Activity },
                { id: "jobs", label: isIndonesian ? "Cari Lowongan HR" : "HR Job Openings", icon: Search },
                { id: "profile", label: isIndonesian ? "Profil Saya" : "My Profile", icon: User },
                { id: "resume", label: isIndonesian ? "Resume & ATS" : "Resume & ATS", icon: FileText },
                { id: "portfolio", label: isIndonesian ? "Portofolio" : "Portfolio", icon: Award },
                { id: "certificates", label: isIndonesian ? "Sertifikat" : "Certificates", icon: BookOpen },
                { id: "training", label: isIndonesian ? "Pelatihan" : "Training", icon: Award },
                { 
                  id: "invitations", 
                  label: isIndonesian ? "Undangan Interview" : "Interview Invitations", 
                  icon: FileSpreadsheet,
                  badge: invitations.filter(i => i.status === "pending").length || undefined
                },
                { id: "notifications", label: isIndonesian ? "Notifikasi" : "Notifications", icon: Bell },
                { id: "settings", label: isIndonesian ? "Pengaturan" : "Settings", icon: Settings },
              ].map((tab) => {
                const Icon = tab.icon;
                const active = innerTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    id={`candidate-tab-btn-${tab.id}`}
                    onClick={() => handleSelectTab(tab.id)}
                    className={`flex items-center space-x-1.5 px-4 py-3 text-xs font-bold tracking-wide border-b-2 transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                      active 
                        ? "border-blue-600 text-blue-700 font-extrabold bg-white/70" 
                        : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/60 rounded-t-lg"
                    }`}
                  >
                    <Icon className={`h-4 w-4 shrink-0 ${active ? "text-blue-600" : "text-slate-400"}`} />
                    <span>{tab.label}</span>
                    {tab.badge !== undefined && (
                      <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black leading-tight ${
                        active 
                          ? "bg-blue-100 text-blue-700" 
                          : "bg-slate-200 text-slate-600"
                      }`}>
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Right Edge Gradient Fade */}
            {canScrollRight && (
              <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-slate-50 via-slate-50/90 to-transparent pointer-events-none rounded-br-3xl z-10" />
            )}

            {/* Right Scroll Trigger Button */}
            {canScrollRight && (
              <button
                type="button"
                onClick={() => handleCandidateTabsScroll("right")}
                aria-label="Scroll right"
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-xl bg-white/95 backdrop-blur-xs border border-slate-200 text-slate-700 shadow-md flex items-center justify-center hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 cursor-pointer transition-all hover:scale-105 active:scale-95"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Horizontal Scroll Track Progress Indicator */}
          {hasOverflow && (
            <div className="w-full bg-slate-200/50 h-1 overflow-hidden px-1">
              <div 
                className="bg-blue-500 h-full rounded-full transition-all duration-150"
                style={{
                  width: `${Math.max(15, 100 * (candidateTabsScrollRef.current ? candidateTabsScrollRef.current.clientWidth / candidateTabsScrollRef.current.scrollWidth : 0.25))}%`,
                  transform: `translateX(${(scrollProgress * (100 - Math.max(15, 100 * (candidateTabsScrollRef.current ? candidateTabsScrollRef.current.clientWidth / candidateTabsScrollRef.current.scrollWidth : 0.25)))) / 100}%)`,
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* ----------------- TAB: DASHBOARD ----------------- */}
      {innerTab === "dashboard" && (
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Left Columns (Tracker and Quick Actions) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Profile Completion percentage panel */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{isIndonesian ? "Kelengkapan Profil Digital" : "Digital Discovery Completion"}</h3>
                  <p className="text-xs text-slate-500 font-semibold">{isIndonesian ? "Skor lebih tinggi menghasilkan 4x tawaran langsung dari Perekrut." : "Higher score results in 4x more direct Recruiter pitches."}</p>
                </div>
                <span className="text-xl font-extrabold text-blue-600 bg-blue-50 px-3.5 py-1.5 rounded-2xl border border-blue-100">
                  {candidate.profileCompletion}%
                </span>
              </div>
              
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-600 h-full rounded-full transition-all"
                  style={{ width: `${candidate.profileCompletion}%` }}
                />
              </div>

              {/* Suggestions */}
              {candidate.profileCompletion < 100 && (
                <div className="bg-amber-50 rounded-2xl border border-amber-100 p-4 space-y-3">
                  <div className="flex items-center space-x-2 text-amber-800 font-bold text-xs">
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                    <span>{isIndonesian ? "Rekomendasi untuk mencapai 100% visibilitas:" : "Recommended to hit 100% visibility:"}</span>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-2 text-xs text-slate-600 font-bold">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-amber-500">•</span>
                      <span>{isIndonesian ? "Rekam Video Pitch 1 Menit (+10%)" : "Record 1-Min Video pitch (+10%)"}</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-amber-500">•</span>
                      <span>{isIndonesian ? "Validasi Kredensial Sertifikat (+15%)" : "Validate Certification Credentials (+15%)"}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Feature Banner: HR Job Openings & Direct Application */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-3xl p-6 text-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 relative overflow-hidden">
              <div className="space-y-1.5 z-10 max-w-xl">
                <span className="px-3 py-1 rounded-full bg-white/20 text-white text-[10px] font-extrabold tracking-wider uppercase border border-white/20 inline-flex items-center gap-1">
                  <Briefcase className="h-3 w-3" />
                  {isIndonesian ? "Fitur Baru • Lowongan Kerja HR" : "New Feature • HR Job Openings"}
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-white">
                  {isIndonesian
                    ? "Lamar Langsung ke Lowongan Kerja yang Dipasang HR"
                    : "Apply Directly to Live Openings Posted by HR Recruiters"}
                </h3>
                <p className="text-xs text-blue-100 font-medium">
                  {isIndonesian
                    ? "Jelajahi puluhan posisi baru dari perusahaan terverifikasi. Kirim lamaran instan dengan profil & skor resume ATS Anda."
                    : "Discover verified corporate job postings. Submit instant applications with your digital portfolio and ATS verified resume."}
                </p>
              </div>

              <button
                id="dash-explore-jobs-btn"
                onClick={() => setInnerTab("jobs")}
                className="px-5 py-3 rounded-2xl bg-white text-blue-700 hover:bg-blue-50 font-extrabold text-xs transition-all shadow-md shrink-0 cursor-pointer flex items-center space-x-2 z-10"
              >
                <Search className="h-4 w-4" />
                <span>{isIndonesian ? "Cari Lowongan Sekarang" : "Explore Job Openings"}</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Recent Invitations */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">{isIndonesian ? "Undangan Interview Masuk" : "Direct Interview Invitations"}</h3>
                <button 
                  onClick={() => setInnerTab("invitations")}
                  className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                >
                  {isIndonesian ? `Lihat Semua (${invitations.length})` : `View All (${invitations.length})`}
                </button>
              </div>

              {invitations.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs font-semibold">
                  {isIndonesian ? "Belum ada tawaran interview dari perekrut. Aktifkan \"Terbuka untuk Perekrut\" agar profil Anda muncul!" : "No recruiters have pitched to you yet. Enable \"Open to work\" to trigger discovery appearances!"}
                </div>
              ) : (
                <div className="space-y-4">
                  {invitations.slice(0, 2).map((inv) => (
                    <div 
                      key={inv.id}
                      className="p-4 border border-slate-100 hover:border-slate-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={inv.companyLogo}
                          alt={inv.companyName}
                          className="h-10 w-10 rounded-xl object-cover"
                        />
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">{inv.position}</h4>
                          <p className="text-xs text-slate-500 font-semibold">{inv.companyName} • {isIndonesian ? "Tawaran Gaji:" : "Pitch Offer:"} {formatCurrency(inv.salaryOffer, "bln")}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                          inv.status === "pending" 
                            ? "bg-amber-50 text-amber-700 border border-amber-100" 
                            : inv.status === "accepted" || inv.status === "scheduled"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : "bg-red-50 text-red-700 border border-red-100"
                        }`}>
                          {inv.status === "pending" ? (isIndonesian ? "Menunggu" : "Pending") : inv.status === "accepted" ? (isIndonesian ? "Diterima" : "Accepted") : inv.status === "scheduled" ? (isIndonesian ? "Terjadwal" : "Scheduled") : (isIndonesian ? "Ditolak" : "Rejected")}
                        </span>
                        
                        {inv.status === "pending" && (
                          <div className="flex space-x-1">
                            <button
                              id={`accept-inv-btn-${inv.id}`}
                              onClick={() => onUpdateInvitationStatus(inv.id, "accepted")}
                              className="text-[10px] font-bold bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1 rounded-lg cursor-pointer"
                            >
                              {isIndonesian ? "Terima" : "Accept"}
                            </button>
                            <button
                              id={`reject-inv-btn-${inv.id}`}
                              onClick={() => onUpdateInvitationStatus(inv.id, "rejected")}
                              className="text-[10px] font-bold bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-2.5 py-1 rounded-lg cursor-pointer transition-colors"
                            >
                              {isIndonesian ? "Tolak" : "Reject"}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Experience Timeline */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900">{isIndonesian ? "Lini Masa Riwayat Karier" : "Career Progress Timeline"}</h3>
              <div className="relative border-l-2 border-slate-100 pl-4 ml-2 space-y-6">
                {candidate.experience.map((exp, index) => (
                  <div key={exp.id} className="relative">
                    <span className="absolute -left-[23px] top-1 h-3 w-3 rounded-full bg-blue-600 ring-4 ring-white" />
                    <span className="text-[10px] font-extrabold text-slate-400">{exp.startDate} – {exp.endDate}</span>
                    <h4 className="font-bold text-slate-800 text-sm leading-snug">{exp.position}</h4>
                    <p className="text-xs text-slate-500 font-bold">{exp.company} • {exp.employmentType}</p>
                    {exp.responsibilities && exp.responsibilities.length > 0 && (
                      <p className="text-xs text-slate-600 font-medium leading-relaxed mt-1">{exp.responsibilities[0]}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Columns (Visit stats & recommended learning pathways) */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Visitors metric card */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">{isIndonesian ? "Statistik Profil" : "SaaS Analytics"}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="text-2xl font-extrabold text-slate-900">28</div>
                  <div className="text-[10px] text-slate-500 font-bold mt-1">{isIndonesian ? "Kunjungan Profil" : "Profile Views"}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="text-2xl font-extrabold text-blue-600">14</div>
                  <div className="text-[10px] text-slate-500 font-bold mt-1">{isIndonesian ? "Kemunculan Pencarian" : "Appearances"}</div>
                </div>
              </div>
              <div className="border-t border-slate-100 pt-3 flex items-center space-x-3 text-xs text-slate-600 font-bold">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{isIndonesian ? "3 Perekrut melihat profil Anda dalam 48 jam terakhir" : "3 Recruiters viewed you in last 48 hrs"}</span>
              </div>
            </div>

            {/* PDF Resume status card */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{isIndonesian ? "Resume Terverifikasi ATS" : "ATS Verified Resume"}</h3>
              <div className="flex items-center justify-between p-3.5 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                <div className="flex items-center space-x-2.5">
                  <FileText className="h-8 w-8 text-blue-600" />
                  <div>
                    <h4 className="text-xs font-bold text-blue-950">Primary Resume.pdf</h4>
                    <p className="text-[10px] text-blue-600 font-semibold">{isIndonesian ? "Skor ATS Terkalkulasi:" : "Calculated Score:"} {candidate.atsScore}%</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => downloadCandidateCv(undefined, candidate, isIndonesian)}
                    className="p-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-bold"
                    title={isIndonesian ? "Unduh Berkas PDF CV" : "Download PDF CV"}
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>{isIndonesian ? "Unduh PDF" : "Download PDF"}</span>
                  </button>
                  <button 
                    onClick={() => setInnerTab("resume")}
                    className="text-xs font-bold text-slate-500 hover:text-slate-700 hover:underline cursor-pointer px-1"
                  >
                    {isIndonesian ? "Edit" : "Edit"}
                  </button>
                </div>
              </div>
            </div>

            {/* Recommended bootcamps / NGO training */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900">{isIndonesian ? "Rekomendasi Pembelajaran" : "Recommended Learning"}</h3>
              <p className="text-xs text-slate-500 font-semibold">{isIndonesian ? "Tingkatkan daya saing Anda dengan menutup kesenjangan teknologi." : "Enhance your discoverability by matching missing technology gaps."}</p>
              
              <div className="space-y-3">
                <div className="p-3 border border-slate-100 hover:border-slate-200 rounded-xl space-y-1">
                  <span className="text-[9px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase">Coding</span>
                  <h4 className="text-xs font-bold text-slate-800">Advanced React Native Frameworks</h4>
                  <p className="text-[10px] text-slate-400 font-medium">{isIndonesian ? "Diselenggarakan oleh Kominfo • Bootcamp Daring" : "Provided by Kominfo • Online Bootcamp"}</p>
                </div>
                <div className="p-3 border border-slate-100 hover:border-slate-200 rounded-xl space-y-1">
                  <span className="text-[9px] font-extrabold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-100 uppercase">DevOps</span>
                  <h4 className="text-xs font-bold text-slate-800">AWS DevOps Engineer Professional</h4>
                  <p className="text-[10px] text-slate-400 font-medium">{isIndonesian ? "Diselenggarakan oleh AWS • Belajar Mandiri" : "Provided by Amazon Web Services • Self-paced"}</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ----------------- TAB: HR JOB OPENINGS & APPLICATIONS ----------------- */}
      {innerTab === "jobs" && (
        <CandidateJobSearchView
          candidate={candidate}
          isLoggedIn={isLoggedIn}
          currentUser={currentUser || { id: candidate.id, fullName: candidate.fullName, email: candidate.email, role: "candidate" }}
          onNavigateToTab={(tab) => setInnerTab(tab)}
        />
      )}

      {/* ----------------- TAB: MY PROFILE BUILDER ----------------- */}
      {innerTab === "profile" && (
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Main info, work history, skills, portfolios */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* About me */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <h3 className="text-base font-bold text-slate-900">{isIndonesian ? "Tentang Saya" : "About Me"}</h3>
                <button
                  id="edit-about-me-btn"
                  onClick={() => setEditingAbout(!editingAbout)}
                  className={`text-xs font-bold ${
                    editingAbout
                      ? "text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-2 py-0.5 rounded-lg"
                      : "text-blue-600 hover:text-blue-700"
                  } flex items-center space-x-1 cursor-pointer transition-colors`}
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>{editingAbout ? (isIndonesian ? "Batal" : "Cancel") : (isIndonesian ? "Ubah" : "Edit")}</span>
                </button>
              </div>

              {editingAbout ? (
                <div className="space-y-3">
                  <textarea
                    id="about-me-textarea"
                    value={aboutValue}
                    onChange={(e) => setAboutValue(e.target.value)}
                    rows={4}
                    className="w-full border border-slate-200 rounded-xl p-3 text-xs font-medium focus:outline-blue-500 text-slate-800"
                  />
                  <button
                    id="save-about-me-btn"
                    onClick={() => {
                      onUpdateCandidate({ ...candidate, aboutMe: aboutValue });
                      setEditingAbout(false);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    {isIndonesian ? "Simpan Tentang Saya" : "Save About Me"}
                  </button>
                </div>
              ) : (
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  {candidate.aboutMe}
                </p>
              )}
            </div>

            {/* Skills manager list */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <h3 className="text-base font-bold text-slate-900">{isIndonesian ? "Vektor Keahlian & Rekomendasi" : "Skill Vectors & Endorsements"}</h3>
                <button
                  id="add-skill-trigger"
                  onClick={() => setAddingSkill(!addingSkill)}
                  className={`text-xs font-bold ${
                    addingSkill
                      ? "text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-2 py-0.5 rounded-lg"
                      : "text-blue-600 hover:text-blue-700"
                  } flex items-center space-x-1 cursor-pointer transition-colors`}
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>{addingSkill ? (isIndonesian ? "Batal" : "Cancel") : (isIndonesian ? "Tambah Keahlian" : "Add Skill")}</span>
                </button>
              </div>

              {addingSkill && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/50 grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{isIndonesian ? "Nama Keahlian" : "Skill Name"}</label>
                    <input
                      type="text"
                      id="input-skill-name"
                      placeholder="e.g. Kubernetes, React Native"
                      value={newSkillName}
                      onChange={(e) => setNewSkillName(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{isIndonesian ? "Kategori" : "Category"}</label>
                    <select
                      id="select-skill-category"
                      value={newSkillCategory}
                      onChange={(e) => setNewSkillCategory(e.target.value as any)}
                      className="w-full border border-slate-200 rounded-lg p-2 text-xs text-slate-800 bg-white"
                    >
                      {Object.values(SkillCategory).map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{isIndonesian ? "Tingkat Keahlian" : "Expertise Level"}</label>
                    <select
                      id="select-skill-level"
                      value={newSkillLevel}
                      onChange={(e) => setNewSkillLevel(e.target.value as any)}
                      className="w-full border border-slate-200 rounded-lg p-2 text-xs text-slate-800 bg-white"
                    >
                      {Object.values(SkillLevel).map(lvl => (
                        <option key={lvl} value={lvl}>{lvl}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{isIndonesian ? "Tahun Pengalaman" : "Years Experience"}</label>
                    <input
                      type="number"
                      id="input-skill-exp"
                      min={0}
                      value={newSkillExp}
                      onChange={(e) => setNewSkillExp(parseInt(e.target.value) || 0)}
                      className="w-full border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                    />
                  </div>
                  <div className="sm:col-span-2 pt-2 text-right">
                    <button
                      id="save-new-skill-btn"
                      onClick={handleAddSkill}
                      className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                    >
                      {isIndonesian ? "Simpan Vektor Keahlian" : "Save Skill Vector"}
                    </button>
                  </div>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                {candidate.skills.map((skill) => (
                  <div 
                    key={skill.id}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="font-bold text-slate-800 text-xs">{skill.name}</span>
                        <span className="text-[9px] font-bold text-slate-400">({skill.category})</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-semibold mt-1">
                        {skill.level} • {skill.yearsOfExperience} {isIndonesian ? "thn peng." : "yrs exp"} • {skill.endorsements} {isIndonesian ? "Dukungan" : "Endorsements"}
                      </div>
                    </div>
                    <button
                      id={`delete-skill-${skill.id}`}
                      onClick={() => handleRemoveSkill(skill.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Experience editor */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <h3 className="text-base font-bold text-slate-900">{isIndonesian ? "Pengalaman Kerja" : "Work Experience"}</h3>
                <button
                  id="add-exp-trigger"
                  onClick={() => setAddingExp(!addingExp)}
                  className={`text-xs font-bold ${
                    addingExp
                      ? "text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-2 py-0.5 rounded-lg"
                      : "text-blue-600 hover:text-blue-700"
                  } flex items-center space-x-1 cursor-pointer transition-colors`}
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>{addingExp ? (isIndonesian ? "Batal" : "Cancel") : (isIndonesian ? "Tambah Pengalaman" : "Add Experience")}</span>
                </button>
              </div>

              {addingExp && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/50 space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{isIndonesian ? "Perusahaan" : "Company"}</label>
                      <input
                        type="text"
                        id="input-exp-company"
                        value={newExpCompany}
                        onChange={(e) => setNewExpCompany(e.target.value)}
                        placeholder="e.g. Tokopedia"
                        className="w-full border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{isIndonesian ? "Posisi / Jabatan" : "Position"}</label>
                      <input
                        type="text"
                        id="input-exp-position"
                        value={newExpPos}
                        onChange={(e) => setNewExpPos(e.target.value)}
                        placeholder="e.g. Senior Frontend Dev"
                        className="w-full border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{isIndonesian ? "Tanggal Mulai" : "Start Date"}</label>
                      <input
                        type="month"
                        id="input-exp-start"
                        value={newExpStart}
                        onChange={(e) => setNewExpStart(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{isIndonesian ? "Tanggal Selesai" : "End Date"}</label>
                      <input
                        type="month"
                        id="input-exp-end"
                        disabled={newExpCurrent}
                        value={newExpEnd}
                        onChange={(e) => setNewExpEnd(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg p-2 text-xs text-slate-800 disabled:bg-slate-100"
                      />
                    </div>
                    <div className="sm:col-span-2 flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="checkbox-exp-current"
                        checked={newExpCurrent}
                        onChange={(e) => setNewExpCurrent(e.target.checked)}
                        className="h-4 w-4"
                      />
                      <label htmlFor="checkbox-exp-current" className="text-xs font-bold text-slate-600">
                        {isIndonesian ? "Masih bekerja di sini saat ini" : "Currently work here"}
                      </label>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{isIndonesian ? "Ringkasan Tanggung Jawab" : "Brief Responsibilities"}</label>
                    <textarea
                      id="input-exp-desc"
                      value={newExpDesc}
                      onChange={(e) => setNewExpDesc(e.target.value)}
                      placeholder={isIndonesian ? "Contoh: Memimpin penulisan ulang fitur checkout dan membimbing intern..." : "e.g. Led checkout feature rewrites and mentored interns..."}
                      rows={3}
                      className="w-full border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800"
                    />
                  </div>

                  <div className="text-right">
                    <button
                      id="save-new-exp-btn"
                      onClick={handleAddExperience}
                      className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                    >
                      {isIndonesian ? "Simpan Pengalaman Kerja" : "Save Work History"}
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {candidate.experience.map((exp) => (
                  <div key={exp.id} className="p-4 border border-slate-100 rounded-2xl relative">
                    <div className="flex justify-between items-start mb-2 pr-2">
                      <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                        {exp.startDate} - {exp.endDate}
                      </span>
                      <button
                        id={`delete-exp-${exp.id}`}
                        onClick={() => handleRemoveExperience(exp.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <h4 className="font-extrabold text-slate-800 text-sm">{exp.position}</h4>
                    <p className="text-xs text-slate-500 font-bold mb-3">{exp.company} • {exp.employmentType}</p>
                    
                    {exp.responsibilities && exp.responsibilities.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{isIndonesian ? "Tanggung Jawab" : "Responsibilities"}</span>
                        <p className="text-xs text-slate-600 font-medium leading-relaxed">{exp.responsibilities[0]}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Education History editor */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <h3 className="text-base font-bold text-slate-900">{isIndonesian ? "Riwayat Pendidikan" : "Education History"}</h3>
                <button
                  id="add-edu-trigger"
                  onClick={() => setAddingEdu(!addingEdu)}
                  className={`text-xs font-bold ${
                    addingEdu
                      ? "text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-2 py-0.5 rounded-lg"
                      : "text-blue-600 hover:text-blue-700"
                  } flex items-center space-x-1 cursor-pointer transition-colors`}
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>{addingEdu ? (isIndonesian ? "Batal" : "Cancel") : (isIndonesian ? "Tambah Pendidikan" : "Add Education")}</span>
                </button>
              </div>

              {addingEdu && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/50 space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{isIndonesian ? "Sekolah / Universitas" : "School / University"}</label>
                      <input
                        type="text"
                        id="input-edu-school"
                        value={newEduSchool}
                        onChange={(e) => setNewEduSchool(e.target.value)}
                        placeholder="e.g. Universitas Indonesia"
                        className="w-full border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{isIndonesian ? "Gelar" : "Degree"}</label>
                      <input
                        type="text"
                        id="input-edu-degree"
                        value={newEduDegree}
                        onChange={(e) => setNewEduDegree(e.target.value)}
                        placeholder="e.g. Sarjana Komputer (S.Kom)"
                        className="w-full border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{isIndonesian ? "Jurusan / Program Studi" : "Major / Field of Study"}</label>
                      <input
                        type="text"
                        id="input-edu-major"
                        value={newEduMajor}
                        onChange={(e) => setNewEduMajor(e.target.value)}
                        placeholder="e.g. Teknik Informatika"
                        className="w-full border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{isIndonesian ? "IPK / Nilai" : "GPA"}</label>
                      <input
                        type="text"
                        id="input-edu-gpa"
                        value={newEduGpa}
                        onChange={(e) => setNewEduGpa(e.target.value)}
                        placeholder="e.g. 3.85"
                        className="w-full border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{isIndonesian ? "Tahun Kelulusan" : "Graduation Year"}</label>
                      <input
                        type="number"
                        id="input-edu-year"
                        value={newEduYear}
                        onChange={(e) => setNewEduYear(parseInt(e.target.value) || 2025)}
                        className="w-full border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{isIndonesian ? "Aktivitas & Organisasi" : "Activities & Societies"}</label>
                      <input
                        type="text"
                        id="input-edu-activities"
                        value={newEduActivities}
                        onChange={(e) => setNewEduActivities(e.target.value)}
                        placeholder="e.g. Komunitas Robotika, Hackathon"
                        className="w-full border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="text-right">
                    <button
                      id="save-new-edu-btn"
                      onClick={handleAddEducation}
                      className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                    >
                      {isIndonesian ? "Simpan Pendidikan" : "Save Education"}
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {(candidate.education || []).map((edu) => (
                  <div key={edu.id} className="p-4 border border-slate-100 rounded-2xl relative">
                    <button
                      id={`delete-edu-${edu.id}`}
                      onClick={() => handleRemoveEducation(edu.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 absolute top-4 right-4 p-1 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100 mr-12 inline-block">
                      {isIndonesian ? "Lulus:" : "Graduated:"} {edu.graduationYear}
                    </span>
                    <h4 className="font-extrabold text-slate-800 text-sm mt-2">{edu.degree} in {edu.major}</h4>
                    <p className="text-xs text-slate-500 font-bold mb-2">{edu.school} • IPK: {edu.gpa}</p>
                    {edu.activities && (
                      <p className="text-xs text-slate-600 font-medium leading-relaxed italic">"{edu.activities}"</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Portfolios editor */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{isIndonesian ? "Studi Kasus Proyek Portofolio" : "Portfolio Project Case Studies"}</h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {isIndonesian ? "Unggah cover proyek, link demo, dan teknologi yang digunakan." : "Upload project covers, demo links, and tech stack."}
                  </p>
                </div>
                <button
                  id="add-portfolio-profile-trigger"
                  onClick={() => setAddingPortfolio(!addingPortfolio)}
                  className={`text-xs font-bold ${
                    addingPortfolio
                      ? "text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-2 py-0.5 rounded-lg"
                      : "text-blue-600 hover:text-blue-700"
                  } flex items-center space-x-1 cursor-pointer transition-colors`}
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>{addingPortfolio ? (isIndonesian ? "Batal" : "Cancel") : (isIndonesian ? "Tambah Proyek" : "Add Project")}</span>
                </button>
              </div>

              {addingPortfolio && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/50 space-y-4">
                  {/* Hidden file input for profile tab cover upload */}
                  <input
                    type="file"
                    ref={projProfileThumbnailFileInputRef}
                    onChange={handleProjThumbnailFileUpload}
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    className="hidden"
                    id="proj-profile-cover-file-input"
                  />

                  {/* Portfolio Cover Image Upload & Selection Section */}
                  <div className="space-y-2 p-3 bg-white rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                        <ImageIcon className="h-3.5 w-3.5 text-blue-600" />
                        <span>{isIndonesian ? "Foto Sampul Proyek (Cover Image)" : "Project Cover Image"}</span>
                      </label>
                      {newProjThumbnail && (
                        <button
                          type="button"
                          id="proj-profile-clear-thumbnail-btn"
                          onClick={() => setNewProjThumbnail("")}
                          className="text-[10px] font-bold text-red-600 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <X className="h-3 w-3" />
                          <span>{isIndonesian ? "Hapus Sampul" : "Remove Cover"}</span>
                        </button>
                      )}
                    </div>

                    {/* Live Preview or Drag-Drop Zone */}
                    {newProjThumbnail ? (
                      <div className="relative rounded-xl overflow-hidden border border-slate-200 group/thumb h-36 bg-slate-900">
                        <img
                          src={newProjThumbnail}
                          alt="Cover Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end justify-between p-3">
                          <span className="bg-emerald-600/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                            <Check className="h-3 w-3" />
                            <span>{isIndonesian ? "Sampul Terpilih" : "Cover Selected"}</span>
                          </span>
                          <button
                            type="button"
                            id="proj-profile-change-cover-btn"
                            onClick={() => projProfileThumbnailFileInputRef.current?.click()}
                            className="bg-white/90 hover:bg-white text-slate-800 text-[10px] font-bold px-2.5 py-1 rounded-md shadow-xs flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Camera className="h-3 w-3 text-blue-600" />
                            <span>{isIndonesian ? "Ganti File" : "Change File"}</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onDragOver={(e) => { e.preventDefault(); setIsDraggingProjThumbnail(true); }}
                        onDragLeave={() => setIsDraggingProjThumbnail(false)}
                        onDrop={handleProjThumbnailDrop}
                        onClick={() => projProfileThumbnailFileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-1.5 ${
                          isDraggingProjThumbnail 
                            ? "border-blue-500 bg-blue-50/50" 
                            : "border-slate-300 hover:border-blue-400 hover:bg-slate-50/80"
                        }`}
                        id="proj-profile-dropzone"
                      >
                        <div className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                          <Upload className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-700">
                            {isIndonesian ? "Klik untuk unggah file cover atau seret ke sini" : "Click to browse or drag & drop cover image"}
                          </p>
                          <p className="text-[10px] text-slate-400 font-medium">
                            JPG, PNG, WebP (Maks. 5MB) • Rekomendasi rasio 16:9
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Quick Presets Gallery */}
                    <div className="pt-1.5 border-t border-slate-100 space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        {isIndonesian ? "Atau pilih template cover cepat:" : "Or pick a quick cover preset:"}
                      </span>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                        {PORTFOLIO_COVER_PRESETS.map((preset) => {
                          const isSelected = newProjThumbnail === preset.url;
                          return (
                            <button
                              key={preset.id}
                              type="button"
                              id={`proj-profile-preset-${preset.id}`}
                              onClick={() => setNewProjThumbnail(preset.url)}
                              className={`group relative rounded-lg overflow-hidden border text-left p-0.5 cursor-pointer transition-all ${
                                isSelected 
                                  ? "border-blue-600 ring-2 ring-blue-500/30" 
                                  : "border-slate-200 hover:border-slate-400"
                              }`}
                            >
                              <img
                                src={preset.url}
                                alt={preset.label}
                                className="w-full h-9 object-cover rounded-md"
                              />
                              <p className="text-[8.5px] font-bold text-slate-600 truncate mt-0.5 px-0.5 leading-tight">
                                {preset.label}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{isIndonesian ? "Judul Proyek" : "Project Title"} *</label>
                      <input
                        type="text"
                        id="input-portfolio-title"
                        value={newProjTitle}
                        onChange={(e) => setNewProjTitle(e.target.value)}
                        placeholder="e.g. Portal Analitik Terdistribusi"
                        className="w-full border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{isIndonesian ? "Peran Anda" : "Your Role"} *</label>
                      <input
                        type="text"
                        id="input-portfolio-role"
                        value={newProjRole}
                        onChange={(e) => setNewProjRole(e.target.value)}
                        placeholder="e.g. Lead Architect"
                        className="w-full border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{isIndonesian ? "Teknologi (pisahkan dengan koma)" : "Technologies (comma-separated)"}</label>
                      <input
                        type="text"
                        id="input-portfolio-tech"
                        value={newProjTechs}
                        onChange={(e) => setNewProjTechs(e.target.value)}
                        placeholder="React, Next.js, Docker, GCP"
                        className="w-full border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{isIndonesian ? "URL Demo / Website" : "Live Demo / Website URL"}</label>
                      <input
                        type="text"
                        id="input-portfolio-url"
                        value={newProjUrl}
                        onChange={(e) => setNewProjUrl(e.target.value)}
                        placeholder="https://myproject.app"
                        className="w-full border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{isIndonesian ? "URL Repositori GitHub" : "GitHub Repository URL"}</label>
                      <input
                        type="text"
                        id="input-portfolio-github"
                        value={newProjGithubUrl}
                        onChange={(e) => setNewProjGithubUrl(e.target.value)}
                        placeholder="https://github.com/alex/analytics"
                        className="w-full border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{isIndonesian ? "URL Desain Figma" : "Figma Design URL"}</label>
                      <input
                        type="text"
                        id="input-portfolio-figma"
                        value={newProjFigmaUrl}
                        onChange={(e) => setNewProjFigmaUrl(e.target.value)}
                        placeholder="https://figma.com/file/..."
                        className="w-full border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{isIndonesian ? "Deskripsi Proyek" : "Project Description"} *</label>
                    <textarea
                      id="input-portfolio-desc"
                      value={newProjDesc}
                      onChange={(e) => setNewProjDesc(e.target.value)}
                      placeholder={isIndonesian ? "Jelaskan pilihan desain, arsitektur, dan pencapaian Anda..." : "Describe your design choices and milestones..."}
                      rows={3}
                      className="w-full border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800"
                    />
                  </div>
                  <div className="text-right">
                    <button
                      id="save-new-portfolio-btn"
                      onClick={handleAddPortfolio}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors shadow-sm"
                    >
                      {isIndonesian ? "Simpan Proyek" : "Save Project"}
                    </button>
                  </div>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                {candidate.portfolio.map((proj) => (
                  <div key={proj.id} className="border border-slate-100 rounded-2xl overflow-hidden hover:border-slate-200 transition-colors bg-slate-50/20 p-3.5 space-y-3 relative group">
                    <button
                      id={`delete-proj-profile-${proj.id}`}
                      onClick={() => handleRemovePortfolio(proj.id)}
                      className="absolute top-2 right-2 bg-white text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-full border border-red-100 shadow-xs cursor-pointer transition-colors z-10"
                      title={isIndonesian ? "Hapus proyek" : "Delete project"}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    <div className="w-full h-32 rounded-xl overflow-hidden bg-slate-100 border border-slate-100 relative">
                      <img
                        src={proj.thumbnail || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600"}
                        alt={proj.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600";
                        }}
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-xs">{proj.title}</h4>
                      <p className="text-[10px] text-blue-600 font-bold mt-0.5">{proj.role}</p>
                      <p className="text-[11px] text-slate-600 font-medium leading-relaxed mt-1.5 line-clamp-2">{proj.description}</p>
                      
                      {/* Tech Chips */}
                      {proj.technology && proj.technology.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2.5">
                          {proj.technology.map((tech) => (
                            <span key={tech} className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[9.5px] font-semibold">{tech}</span>
                          ))}
                        </div>
                      )}

                      {/* Project Action Links */}
                      {(proj.websiteUrl || proj.githubUrl || proj.figmaUrl) && (
                        <div className="flex flex-wrap items-center gap-2 pt-2.5 mt-2.5 border-t border-slate-100">
                          {proj.websiteUrl && (
                            <a
                              href={proj.websiteUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50/80 hover:bg-blue-100 px-2 py-0.5 rounded-md transition-colors"
                            >
                              <Globe className="h-3 w-3" />
                              <span>Demo</span>
                              <ExternalLink className="h-2.5 w-2.5 opacity-70" />
                            </a>
                          )}
                          {proj.githubUrl && (
                            <a
                              href={proj.githubUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded-md transition-colors"
                            >
                              <FileText className="h-3 w-3" />
                              <span>GitHub</span>
                              <ExternalLink className="h-2.5 w-2.5 opacity-70" />
                            </a>
                          )}
                          {proj.figmaUrl && (
                            <a
                              href={proj.figmaUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[10px] font-bold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-2 py-0.5 rounded-md transition-colors"
                            >
                              <Award className="h-3 w-3" />
                              <span>Figma</span>
                              <ExternalLink className="h-2.5 w-2.5 opacity-70" />
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right column: cover, photos, video links */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Identity & Contact builder */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900">{isIndonesian ? "Kontak & Tautan Digital" : "Contact & Digital Links"}</h3>
              <div className="space-y-3.5">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Email</span>
                  <p className="text-xs text-slate-700 font-bold">{candidate.email}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{isIndonesian ? "Nomor Telepon" : "Phone Number"}</span>
                  <p className="text-xs text-slate-700 font-bold">{candidate.phone}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{isIndonesian ? "Situs Web Pribadi" : "Personal Website"}</span>
                  <p className="text-xs text-blue-600 font-bold truncate">{candidate.website || (isIndonesian ? "Belum diisi" : "Not provided")}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{isIndonesian ? "Profil GitHub" : "Github Profile"}</span>
                  <p className="text-xs text-blue-600 font-bold truncate">{candidate.github || (isIndonesian ? "Belum diisi" : "Not provided")}</p>
                </div>
              </div>
            </div>

            {/* Video Elevator pitch container */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900">{isIndonesian ? "Video Perkenalan 1 Menit" : "1-Minute Video Elevator Pitch"}</h3>
              <p className="text-xs text-slate-500 font-semibold">
                {isIndonesian 
                  ? "Sampaikan pencapaian utama Anda. Profil dengan video perkenalan menarik 70% lebih banyak perhatian perekrut." 
                  : "Pitch your STAR achievements. Profiles with video introductions attract 70% higher recruiter attention."}
              </p>
              
              {candidate.videoUrl ? (
                <div className="space-y-3">
                  <video 
                    src={candidate.videoUrl} 
                    controls 
                    className="w-full rounded-2xl shadow-inner border border-slate-100 h-44 object-cover"
                  />
                  <button 
                    onClick={() => onUpdateCandidate({ ...candidate, videoUrl: undefined })}
                    className="w-full py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold text-xs rounded-xl cursor-pointer transition-colors"
                  >
                    {isIndonesian ? "Hapus Video" : "Delete Video"}
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-slate-200 rounded-2xl py-8 text-center bg-slate-50 cursor-pointer hover:bg-slate-100/50 transition-colors">
                  <Video className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                  <span className="text-xs font-bold text-slate-700 block">{isIndonesian ? "Unggah Video Pengenalan MP4" : "Upload MP4 Introduction"}</span>
                  <span className="text-[10px] text-slate-400 font-bold mt-1 block">
                    {isIndonesian ? "(Batas 60 detik • Maks 20MB)" : "(Limit 60s • Max 20MB)"}
                  </span>
                  <button 
                    id="simulate-video-upload"
                    onClick={() => onUpdateCandidate({ 
                      ...candidate, 
                      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-his-computer-34281-large.mp4",
                      profileCompletion: Math.min(100, candidate.profileCompletion + 10)
                    })}
                    className="mt-3.5 text-xs font-extrabold text-blue-600 border border-blue-200 bg-white hover:bg-blue-50 px-4 py-1.5 rounded-lg cursor-pointer shadow-sm"
                  >
                    {isIndonesian ? "Simulasikan Unggah" : "Simulate Upload"}
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* ----------------- TAB: AI RESUME ATS & SKILL GAP ----------------- */}
      {innerTab === "resume" && (
        <div className="space-y-8" id="ai-workspace-panel">
          
          {/* Quota Toast */}
          {quotaToast && (
            <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl flex items-center justify-between shadow-lg shadow-blue-500/20 animate-fade-in text-xs font-bold">
              <div className="flex items-center space-x-2.5">
                <Info className="h-4 w-4 text-blue-200 shrink-0" />
                <span>{quotaToast}</span>
              </div>
              <button 
                onClick={() => setQuotaToast(null)} 
                className="p-1 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Banner */}
          <div className="bg-slate-900 text-white p-6 rounded-3xl relative overflow-hidden border border-slate-800">
            <div className="absolute right-0 top-0 h-full w-48 opacity-10 bg-radial-gradient from-blue-500 to-transparent" />
            <div className="space-y-2 max-w-2xl">
              <span className="inline-flex items-center space-x-1 text-blue-400 font-extrabold text-[10px] uppercase tracking-widest bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-500/20">
                <FileText className="h-3 w-3" /> <span>{isIndonesian ? "Layanan Akselerasi Karier" : "Career Acceleration Services"}</span>
              </span>
              <h2 className="text-2xl font-extrabold tracking-tight">
                {isIndonesian ? "Audit ATS & Analisis Kesenjangan Keahlian" : "ATS Audit & Core Skill Gap Analysis"}
              </h2>
              <p className="text-slate-300 text-xs font-medium leading-relaxed">
                {isIndonesian 
                  ? "Server TalentHub berkomunikasi langsung dengan model Gemini untuk mengevaluasi kesesuaian profesional, menghitung matriks kecocokan, dan mengidentifikasi area peningkatan resume."
                  : "TalentHub's Express server directly communicates with Gemini models to evaluate professional alignment, calculate exact matching matrices, and point out layout vulnerabilities."}
              </p>
            </div>
          </div>

          {/* ATS Checker Grid */}
          <div className="grid lg:grid-cols-12 gap-8">
            
            {/* Left Col: ATS Resume Checker (Full size) */}
            <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-6">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    {isIndonesian ? "Pemeriksa Kepatuhan ATS & Kata Kunci" : "ATS Compliance & Keyword Checker"}
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold">
                    {isIndonesian ? "Uji kata kunci profil Anda terhadap target posisi perekrut." : "Test your profile keywords against a target recruiter headline."}
                  </p>
                </div>
                <button
                  id="load-sample-resume-btn"
                  onClick={handleLoadSampleResume}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl cursor-pointer"
                >
                  {isIndonesian ? "Muat Contoh Teks" : "Load Sample Text"}
                </button>
              </div>

              <div className="space-y-4">
                {/* Quota & Plan Status Bar - [PAID_FEATURE_TOGGLE] Configured for Free Trial */}
                <div className="p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs bg-emerald-50/70 border-emerald-200 text-emerald-900" id="ats-quota-banner">
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <span className="p-1.5 rounded-lg shrink-0 bg-emerald-200/60 text-emerald-800">
                      <Zap className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <div className="font-extrabold flex items-center gap-1.5 flex-wrap">
                        <span>
                          {isIndonesian ? "Masa Uji Coba Gratis: Audit AI ATS Tanpa Batas" : "Free Trial Mode: Unlimited AI ATS Audits"}
                        </span>
                        <span className="text-[10px] font-black bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded-md uppercase">FREE TRIAL</span>
                      </div>
                      <p className="text-[11px] opacity-85 font-medium mt-0.5">
                        {isIndonesian ? "Semua fitur audit kata kunci & perbaikan resume dapat digunakan gratis tanpa biaya." : "All keyword matching & resume enhancement features are fully free during the trial."}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                    {/* [PAID_FEATURE_TOGGLE] Paid plan upgrade button commented out for Free Trial period.
                        Uncomment the block below to restore paid checkout button:
                    <button
                      onClick={() => setShowPlanModal(true)}
                      className="px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center space-x-1 shadow-2xs bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                      <Crown className="h-3 w-3" />
                      <span>{isIndonesian ? "Upgrade Pro (Rp 49k)" : "Upgrade Pro (Rp 49k)"}</span>
                    </button>
                    */}
                    <div className="px-3 py-1.5 rounded-xl text-xs font-black bg-emerald-200/60 text-emerald-900 border border-emerald-300 flex items-center space-x-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
                      <span>{isIndonesian ? "Akses Penuh Aktif" : "Full Access Active"}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">
                    {isIndonesian ? "Target Judul Posisi" : "Target Role Headline"}
                  </label>
                  <input
                    type="text"
                    id="ats-target-headline"
                    value={targetHeadline}
                    onChange={(e) => setTargetHeadline(e.target.value)}
                    placeholder="e.g. Senior DevOps & Kubernetes Engineer"
                    className="w-full border border-slate-200 rounded-xl p-3 text-xs text-slate-800 font-semibold bg-slate-50 focus:bg-white focus:outline-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">
                    {isIndonesian ? "Teks Konten Resume" : "Resume Text Content"}
                  </label>
                  <textarea
                    id="ats-resume-textarea"
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    rows={12}
                    className="w-full border border-slate-200 rounded-xl p-3.5 text-xs text-slate-800 font-mono bg-slate-50/50 focus:bg-white focus:outline-blue-500 leading-relaxed"
                    placeholder={isIndonesian ? "Salin dan tempel teks resume Anda di sini..." : "Copy-paste raw text from your resume here..."}
                  />
                </div>

                <button
                  id="scan-resume-trigger-btn"
                  onClick={handleAnalyzeResume}
                  disabled={isAILoading}
                  className={`w-full py-3 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer disabled:bg-slate-400 ${
                    isQuotaExhausted 
                      ? "bg-amber-600 hover:bg-amber-700 text-white shadow-amber-200" 
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200 hover:shadow-lg"
                  }`}
                >
                  {isQuotaExhausted ? (
                    <>
                      <Crown className="h-4 w-4 text-amber-200" />
                      <span>{isIndonesian ? "Kuota Habis (0/2) • Upgrade ke Talent Pro untuk Audit AI Tanpa Batas" : "Quota Used (0/2) • Upgrade to Talent Pro for Unlimited Scans"}</span>
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4" />
                      <span>
                        {isAILoading 
                          ? (isIndonesian ? "Menganalisis dengan Model Gemini Server..." : "Querying Server Gemini Model...") 
                          : (isIndonesian 
                              ? `Analisis Kepatuhan ATS Resume (${membershipPlan === "Pro" ? "Tanpa Batas" : `Sisa ${quotaRemaining} Scan Gratis`})` 
                              : `Analyze ATS Resume Compliance (${membershipPlan === "Pro" ? "Unlimited" : `${quotaRemaining} Scans Left`})`)}
                      </span>
                    </>
                  )}
                </button>
              </div>

              {/* Rendering Real Gemini Output */}
              {aiResult && (
                <div className="border border-slate-200 bg-slate-50/50 p-5 rounded-2xl space-y-5 animate-fade-in" id="ats-scan-results">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <span className="text-xs font-extrabold text-slate-700 uppercase tracking-widest flex items-center">
                      <FileCheck className="h-4 w-4 mr-1 text-blue-600" />
                      {isIndonesian ? "Hasil Evaluasi ATS" : "ATS Scan Feedback"}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${
                      aiResult.score >= 85 
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
                        : aiResult.score >= 70 
                        ? "bg-amber-50 text-amber-800 border-amber-200" 
                        : "bg-red-50 text-red-800 border-red-200"
                    }`}>
                      {isIndonesian ? "Skor:" : "Score:"} {aiResult.score}/100
                    </span>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div className="space-y-1">
                      <span className="font-extrabold text-slate-800">{isIndonesian ? "Ringkasan Evaluasi:" : "Summary Review:"}</span>
                      <p className="text-slate-600 font-medium leading-relaxed bg-white p-3 rounded-xl border border-slate-100">{aiResult.analysis?.summary}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="font-extrabold text-slate-800">{isIndonesian ? "Penilaian Format & Tata Letak:" : "Layout & Formatting Rating:"}</span>
                      <p className="text-slate-600 font-semibold">{aiResult.analysis?.formattingScore}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <span className="font-extrabold text-emerald-700">{isIndonesian ? "Kata Kunci Cocok:" : "Matched Keywords:"}</span>
                        <div className="flex flex-wrap gap-1">
                          {(aiResult.analysis?.atsKeywordsMatched || []).map((k: string) => (
                            <span key={k} className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded text-[10px] font-bold">{k}</span>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <span className="font-extrabold text-red-700">{isIndonesian ? "Kata Kunci Kurang:" : "Missing Core Keywords:"}</span>
                        <div className="flex flex-wrap gap-1">
                          {(aiResult.analysis?.atsKeywordsMissing || []).map((k: string) => (
                            <span key={k} className="bg-red-50 text-red-700 border border-red-100 px-2 py-0.5 rounded text-[10px] font-bold">{k}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="font-extrabold text-slate-800 block">{isIndonesian ? "Langkah Perbaikan ATS:" : "Required ATS Action Items:"}</span>
                      <ul className="space-y-1.5 list-disc pl-4 text-slate-600 font-semibold">
                        {(aiResult.analysis?.improvements || []).map((imp: string, i: number) => (
                          <li key={i}>{imp}</li>
                        ))}
                      </ul>
                    </div>

                    {aiResult.simulated && (
                      <p className="text-[10px] text-slate-400 font-bold pt-2 border-t border-slate-200">
                        {isIndonesian ? "* Catatan: Berjalan dalam mode diagnostik simulasi offline." : "* Note: Running in Offline-Simulated diagnostic mode."}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Col: Skill Gap Analyzer */}
            <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-6">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  {isIndonesian ? "Analisis Kesenjangan Keahlian Gemini" : "Gemini Skill Gap Analysis"}
                </h3>
                <p className="text-xs text-slate-500 font-semibold">
                  {isIndonesian 
                    ? "Masukkan target posisi impian Anda untuk mengetahui keahlian teknologi yang perlu Anda pelajari." 
                    : "Provide your ideal next job and find your technology gaps immediately."}
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">
                    {isIndonesian ? "Target Posisi Impian" : "Ideal Target Role"}
                  </label>
                  <input
                    type="text"
                    id="skill-gap-target-role"
                    value={skillGapRole}
                    onChange={(e) => setSkillGapRole(e.target.value)}
                    placeholder="e.g. Lead Cloud Architect, Director of Engineering"
                    className="w-full border border-slate-200 rounded-xl p-3 text-xs text-slate-800 font-semibold bg-slate-50 focus:bg-white focus:outline-blue-500"
                  />
                </div>

                <div className="space-y-1.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/50">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-2">
                    {isIndonesian ? "Menganalisis Keahlian Profil Saat Ini:" : "Analyzing Current Profile Skills:"}
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {candidate.skills.map(s => (
                      <span key={s.id} className="bg-white border border-slate-200 px-2.5 py-1 rounded-md text-[10px] font-bold text-slate-700">{s.name}</span>
                    ))}
                  </div>
                </div>

                <button
                  id="skill-gap-analyze-btn"
                  onClick={handleSkillGapAnalysis}
                  disabled={isSkillGapLoading}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-bold text-xs shadow-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer disabled:bg-slate-400"
                >
                  <Target className="h-4 w-4" />
                  <span>
                    {isSkillGapLoading 
                      ? (isIndonesian ? "Meminta Analisis Model Gemini Server..." : "Querying Server Gemini Model...") 
                      : (isIndonesian ? "Hitung Kesenjangan Keahlian" : "Calculate Skill Gaps")}
                  </span>
                </button>
              </div>

              {/* Skill Gap Results */}
              {skillGapResult && (
                <div className="border border-slate-200 bg-slate-50/50 p-5 rounded-2xl space-y-4 animate-fade-in" id="skill-gap-results">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="text-xs font-bold text-slate-800 flex items-center uppercase tracking-widest">
                      <Target className="h-4 w-4 mr-1 text-amber-500" />
                      {isIndonesian ? "Laporan Analisis Kesenjangan" : "Gap Analysis Report"}
                    </span>
                    <span className="text-xs font-extrabold text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
                      {isIndonesian ? "Kecocokan:" : "Match:"} {skillGapResult.matchPercentage}%
                    </span>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div className="space-y-1.5">
                      <span className="font-extrabold text-slate-800">{isIndonesian ? "Keahlian yang Sudah Dimiliki:" : "Skills Acquired:"}</span>
                      <div className="flex flex-wrap gap-1">
                        {(skillGapResult.skillsAcquired || []).map((s: string) => (
                          <span key={s} className="bg-emerald-50 text-emerald-800 border border-emerald-150 px-2 py-0.5 rounded text-[10px] font-bold">{s}</span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <span className="font-extrabold text-amber-800">{isIndonesian ? "Teknologi Kesenjangan Utama:" : "Critical Gap Technology:"}</span>
                      <div className="flex flex-wrap gap-1">
                        {(skillGapResult.gapSkills || []).map((s: string) => (
                          <span key={s} className="bg-amber-50 text-amber-800 border border-amber-150 px-2 py-0.5 rounded text-[10px] font-bold">{s}</span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="font-extrabold text-slate-800 block">{isIndonesian ? "Rekomendasi Pembelajaran:" : "Learning Actions:"}</span>
                      <ul className="space-y-1.5 list-disc pl-4 text-slate-600 font-semibold">
                        {(skillGapResult.recommendations || []).map((rec: string, i: number) => (
                          <li key={i}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>
      )}

      {/* ----------------- TAB: INVITATIONS & INBOX ----------------- */}
      {innerTab === "invitations" && (
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Left: Active Pitch Lists */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-100 p-5 shadow-sm space-y-4 max-h-[600px] overflow-y-auto">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
              {isIndonesian ? "Daftar Tawaran Perekrut Aktif" : "Active Recruiter Pitches"}
            </h3>
            
            {invitations.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs font-semibold">
                {isIndonesian ? "Belum ada tawaran wawancara aktif yang diterima." : "No active interview invitations received yet."}
              </div>
            ) : (
              <div className="space-y-2">
                {invitations.map((inv) => (
                  <button
                    key={inv.id}
                    id={`select-inv-msg-card-${inv.id}`}
                    onClick={() => setActiveInvitationId(inv.id)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start space-x-3 ${
                      activeInvitationId === inv.id 
                        ? "bg-blue-50 border-blue-200 shadow-xs" 
                        : "border-slate-100 hover:bg-slate-50 bg-white"
                    }`}
                  >
                    <img
                      src={inv.companyLogo}
                      alt={inv.companyName}
                      className="h-9 w-9 rounded-xl object-cover border border-slate-100 shrink-0"
                    />
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-slate-900 text-xs truncate">{inv.position}</h4>
                        <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                          inv.status === "pending" 
                            ? "bg-amber-100 text-amber-800" 
                            : inv.status === "accepted" || inv.status === "scheduled"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {inv.status === "pending" 
                            ? (isIndonesian ? "Menunggu" : "Pending") 
                            : inv.status === "accepted" 
                            ? (isIndonesian ? "Diterima" : "Accepted")
                            : inv.status === "scheduled"
                            ? (isIndonesian ? "Terjadwal" : "Scheduled")
                            : (isIndonesian ? "Ditolak" : "Rejected")}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-bold">{inv.companyName} • {formatCurrency(inv.salaryOffer)}</p>
                      <p className="text-[11px] text-slate-400 font-medium truncate mt-1">{inv.message}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Message dialogue */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between min-h-[500px]">
            
            {activeInvitation ? (
              <>
                {/* Header info */}
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 rounded-t-3xl flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={activeInvitation.companyLogo}
                      alt={activeInvitation.companyName}
                      className="h-10 w-10 rounded-xl object-cover border border-slate-200"
                    />
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-sm">{activeInvitation.position} {isIndonesian ? "Wawancara" : "Interview Pitch"}</h3>
                      <p className="text-xs text-slate-500 font-bold">{activeInvitation.companyName} • {activeInvitation.recruiterName}</p>
                    </div>
                  </div>

                  <div className="flex space-x-1.5">
                    {activeInvitation.status === "pending" ? (
                      <>
                        <button
                          id="chat-header-accept"
                          onClick={() => onUpdateInvitationStatus(activeInvitation.id, "accepted")}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-extrabold px-3 py-1.5 rounded-xl shadow-xs cursor-pointer"
                        >
                          {isIndonesian ? "Terima Tawaran" : "Accept Pitch"}
                        </button>
                        <button
                          id="chat-header-reject"
                          onClick={() => onUpdateInvitationStatus(activeInvitation.id, "rejected")}
                          className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-[11px] font-extrabold px-3 py-1.5 rounded-xl cursor-pointer transition-colors"
                        >
                          {isIndonesian ? "Tolak" : "Reject"}
                        </button>
                      </>
                    ) : (
                      <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-xl uppercase">
                        {activeInvitation.status === "accepted" 
                          ? (isIndonesian ? "Diterima" : "Accepted")
                          : activeInvitation.status === "scheduled"
                          ? (isIndonesian ? "Terjadwal" : "Scheduled")
                          : (isIndonesian ? "Ditolak" : "Rejected")}
                      </span>
                    )}
                  </div>
                </div>

                {/* Chat feed */}
                <div className="p-5 flex-1 overflow-y-auto space-y-4 max-h-[350px]">
                  
                  {/* First pitch system message */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-600 space-y-2.5">
                    <p className="font-bold text-slate-800">{isIndonesian ? "Surat Undangan Tawaran Perekrut:" : "Recruiter Pitch Invitation Letter:"}</p>
                    <p className="italic font-medium leading-relaxed">"{activeInvitation.message}"</p>
                    <div className="border-t border-slate-200 pt-2 flex justify-between text-[11px] text-slate-400 font-bold">
                      <span>{isIndonesian ? "Penawaran Gaji:" : "Salary Offer:"} {formatCurrency(activeInvitation.salaryOffer)}</span>
                      <span>{isIndonesian ? "Dikirim via Mesin Sourcing TalentHub" : "Sent via TalentHub Active Sourcing Engine"}</span>
                    </div>
                  </div>

                  {activeInvitation.interviewLink && (
                    <div className="p-3.5 bg-blue-50 text-blue-900 border border-blue-150 rounded-2xl flex items-center justify-between text-xs font-bold">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        <span>
                          {isIndonesian ? "Jadwal Google Meet:" : "Google Meet Scheduled:"} {activeInvitation.scheduledDate ? new Date(activeInvitation.scheduledDate).toLocaleString(isIndonesian ? 'id-ID' : 'en-US') : (isIndonesian ? "Detail terlampir" : "Details attached")}
                        </span>
                      </div>
                      <a 
                        href={activeInvitation.interviewLink} 
                        target="_blank" 
                        rel="noreferrer"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-[10px] uppercase font-extrabold flex items-center"
                      >
                        {isIndonesian ? "Masuk Ruangan" : "Join Room"} <ArrowUpRight className="h-3.5 w-3.5 ml-0.5" />
                      </a>
                    </div>
                  )}

                  {/* Interleaved messages */}
                  {activeChatMessages.map((msg) => {
                    const isCandidate = msg.senderRole === "candidate";
                    return (
                      <div 
                        key={msg.id}
                        className={`flex ${isCandidate ? "justify-end" : "justify-start"}`}
                      >
                        <div className={`p-3 max-w-[80%] rounded-2xl text-xs font-semibold leading-relaxed ${
                          isCandidate 
                            ? "bg-blue-600 text-white rounded-br-none" 
                            : "bg-slate-100 text-slate-800 rounded-bl-none"
                        }`}>
                          <p>{msg.content}</p>
                          <span className={`text-[9px] block text-right mt-1.5 font-bold ${
                            isCandidate ? "text-blue-200" : "text-slate-400"
                          }`}>
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    );
                  })}

                </div>

                {/* Send input */}
                <form onSubmit={handleSendMessage} className="p-3.5 border-t border-slate-100 bg-slate-50/20 rounded-b-3xl flex items-center space-x-2.5">
                  <input
                    type="text"
                    id="chat-message-input-field"
                    value={chatInputValue}
                    onChange={(e) => setChatInputValue(e.target.value)}
                    placeholder={isIndonesian ? "Ketik pesan balasan Anda ke perekrut..." : "Type your message to the recruiter..."}
                    className="flex-1 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-blue-500 bg-white"
                  />
                  <button
                    type="submit"
                    id="send-chat-message-btn"
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-xl cursor-pointer"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col justify-center items-center text-slate-400 p-8 text-center space-y-2">
                <FileText className="h-10 w-10 text-slate-300" />
                <h4 className="font-bold text-slate-700 text-sm">{isIndonesian ? "Belum Ada Percakapan Terpilih" : "No Active Pitch Conversation Selected"}</h4>
                <p className="text-xs text-slate-400 max-w-xs font-semibold">
                  {isIndonesian 
                    ? "Klik salah satu tawaran aktif di sebelah kiri untuk melihat rincian undangan dan mengirim pesan ke perekrut." 
                    : "Click on any active pitch from the list on the left to review the invitation details and message recruiters."}
                </p>
              </div>
            )}

          </div>

        </div>
      )}

      {/* ----------------- TAB: PORTFOLIO ----------------- */}
      {innerTab === "portfolio" && (
        <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">
                {isIndonesian ? "Studi Kasus Proyek Portofolio" : "Portfolio Project Case Studies"}
              </h3>
              <p className="text-xs text-slate-500 font-semibold">
                {isIndonesian 
                  ? "Tampilkan karya produksi terbaik Anda kepada perekrut terverifikasi di platform." 
                  : "Showcase your best production work to verified recruiters on the platform."}
              </p>
            </div>
            <button
              id="add-portfolio-trigger"
              onClick={() => setAddingPortfolio(!addingPortfolio)}
              className={`${
                addingPortfolio 
                  ? "bg-red-50 hover:bg-red-100 text-red-600 border border-red-200" 
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              } text-xs font-bold px-4 py-2 rounded-xl cursor-pointer transition-colors`}
            >
              {addingPortfolio 
                ? (isIndonesian ? "Batal" : "Cancel") 
                : (isIndonesian ? "+ Tambah Proyek" : "Add Project")}
            </button>
          </div>

          {addingPortfolio && (
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/50 space-y-5">
              {/* Hidden file input for portfolio tab cover upload */}
              <input
                type="file"
                ref={projThumbnailFileInputRef}
                onChange={handleProjThumbnailFileUpload}
                accept="image/png,image/jpeg,image/webp,image/gif"
                className="hidden"
                id="proj-tab-cover-file-input"
              />

              {/* Portfolio Cover Image Upload & Selection Section */}
              <div className="space-y-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 text-blue-600" />
                      <span>{isIndonesian ? "Foto / Gambar Sampul Portofolio (Cover Image)" : "Portfolio Cover Image"}</span>
                    </label>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                      {isIndonesian 
                        ? "Pilih gambar sampul menarik untuk merepresentasikan studi kasus proyek Anda." 
                        : "Choose an engaging cover image to represent your project case study."}
                    </p>
                  </div>
                  {newProjThumbnail && (
                    <button
                      type="button"
                      id="proj-tab-clear-thumbnail-btn"
                      onClick={() => setNewProjThumbnail("")}
                      className="text-xs font-bold text-red-600 hover:text-red-700 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <X className="h-3.5 w-3.5" />
                      <span>{isIndonesian ? "Hapus Sampul" : "Remove Cover"}</span>
                    </button>
                  )}
                </div>

                {/* Live Preview or Drag-Drop Zone */}
                {newProjThumbnail ? (
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 group/thumb h-48 bg-slate-900 shadow-inner">
                    <img
                      src={newProjThumbnail}
                      alt="Cover Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end justify-between p-4">
                      <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
                        <Check className="h-3.5 w-3.5" />
                        <span>{isIndonesian ? "Sampul Aktif Terpilih" : "Active Cover Selected"}</span>
                      </span>
                      <button
                        type="button"
                        id="proj-tab-change-cover-btn"
                        onClick={() => projThumbnailFileInputRef.current?.click()}
                        className="bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold px-3.5 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <Camera className="h-3.5 w-3.5 text-blue-600" />
                        <span>{isIndonesian ? "Ganti File Gambar" : "Change Image File"}</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsDraggingProjThumbnail(true); }}
                    onDragLeave={() => setIsDraggingProjThumbnail(false)}
                    onDrop={handleProjThumbnailDrop}
                    onClick={() => projThumbnailFileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-2 ${
                      isDraggingProjThumbnail 
                        ? "border-blue-500 bg-blue-50/50" 
                        : "border-slate-300 hover:border-blue-400 hover:bg-slate-50/80"
                    }`}
                    id="proj-tab-dropzone"
                  >
                    <div className="h-10 w-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Upload className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-700">
                        {isIndonesian ? "Klik untuk unggah file foto sampul atau seret file ke sini" : "Click to browse cover image or drag & drop file here"}
                      </p>
                      <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                        Mendukung format JPG, PNG, WebP (Maksimum 5MB) • Rekomendasi rasio 16:9
                      </p>
                    </div>
                  </div>
                )}

                {/* Quick Presets Gallery */}
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    {isIndonesian ? "Atau pilih dari koleksi template sampul siap pakai:" : "Or pick from curated cover templates:"}
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                    {PORTFOLIO_COVER_PRESETS.map((preset) => {
                      const isSelected = newProjThumbnail === preset.url;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          id={`proj-tab-preset-${preset.id}`}
                          onClick={() => setNewProjThumbnail(preset.url)}
                          className={`group relative rounded-xl overflow-hidden border text-left p-1 cursor-pointer transition-all ${
                            isSelected 
                              ? "border-blue-600 ring-2 ring-blue-500/30 shadow-xs" 
                              : "border-slate-200 hover:border-slate-400"
                          }`}
                        >
                          <img
                            src={preset.url}
                            alt={preset.label}
                            className="w-full h-12 object-cover rounded-lg"
                          />
                          <p className="text-[9.5px] font-bold text-slate-700 truncate mt-1 px-0.5">
                            {preset.label}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                    {isIndonesian ? "Judul Proyek" : "Project Title"} *
                  </label>
                  <input
                    type="text"
                    id="input-proj-title"
                    value={newProjTitle}
                    onChange={(e) => setNewProjTitle(e.target.value)}
                    placeholder="e.g. Distributed Analytics Portal"
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                    {isIndonesian ? "Peran Anda" : "Your Role"} *
                  </label>
                  <input
                    type="text"
                    id="input-proj-role"
                    value={newProjRole}
                    onChange={(e) => setNewProjRole(e.target.value)}
                    placeholder="e.g. Lead Architect"
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                    {isIndonesian ? "Teknologi (dipisahkan koma)" : "Technologies (comma-separated)"}
                  </label>
                  <input
                    type="text"
                    id="input-proj-tech"
                    value={newProjTechs}
                    onChange={(e) => setNewProjTechs(e.target.value)}
                    placeholder="React, Next.js, Docker, GCP"
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                    {isIndonesian ? "URL Demo / Website" : "Live Demo / Website URL"}
                  </label>
                  <input
                    type="text"
                    id="input-proj-url"
                    value={newProjUrl}
                    onChange={(e) => setNewProjUrl(e.target.value)}
                    placeholder="https://myanalytics.app"
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                    {isIndonesian ? "URL Repositori GitHub" : "GitHub Repository URL"}
                  </label>
                  <input
                    type="text"
                    id="input-proj-github"
                    value={newProjGithubUrl}
                    onChange={(e) => setNewProjGithubUrl(e.target.value)}
                    placeholder="https://github.com/alex/analytics"
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                    {isIndonesian ? "URL Desain Figma" : "Figma Design URL"}
                  </label>
                  <input
                    type="text"
                    id="input-proj-figma"
                    value={newProjFigmaUrl}
                    onChange={(e) => setNewProjFigmaUrl(e.target.value)}
                    placeholder="https://figma.com/file/..."
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                  {isIndonesian ? "Deskripsi Proyek" : "Project Description"} *
                </label>
                <textarea
                  id="input-proj-desc"
                  value={newProjDesc}
                  onChange={(e) => setNewProjDesc(e.target.value)}
                  placeholder={isIndonesian ? "Jelaskan pilihan arsitektur, pencapaian teknis, dan skalabilitas solusi..." : "Describe your design choices, technical accomplishments, and scaling achievements..."}
                  rows={4}
                  className="w-full border border-slate-200 rounded-xl p-3 text-xs text-slate-800"
                />
              </div>
              <div className="text-right">
                <button
                  id="save-new-proj-btn"
                  onClick={handleAddPortfolio}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors shadow-sm"
                >
                  {isIndonesian ? "Simpan Studi Kasus Proyek" : "Save Project Case Study"}
                </button>
              </div>
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-6">
            {candidate.portfolio.map((proj) => (
              <div key={proj.id} className="border border-slate-150 rounded-2xl overflow-hidden hover:border-blue-300 transition-all bg-white p-5 space-y-4 relative group shadow-2xs">
                <button
                  id={`delete-proj-${proj.id}`}
                  onClick={() => handleRemovePortfolio(proj.id)}
                  className="absolute top-4 right-4 bg-white hover:bg-red-50 text-red-500 hover:text-red-700 p-2 rounded-full border border-red-200 shadow-sm transition-colors cursor-pointer z-10"
                  title={isIndonesian ? "Hapus proyek" : "Delete project"}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <div className="w-full h-48 rounded-xl overflow-hidden bg-slate-100 border border-slate-100 relative">
                  <img
                    src={proj.thumbnail || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600"}
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600";
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <h4 className="font-extrabold text-slate-800 text-base">{proj.title}</h4>
                  <p className="text-xs text-blue-600 font-bold">{proj.role}</p>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed mt-2">{proj.description}</p>
                  
                  {/* Technology Tags */}
                  {proj.technology && proj.technology.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {proj.technology.map((tech) => (
                        <span key={tech} className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded text-[10px] font-bold">{tech}</span>
                      ))}
                    </div>
                  )}

                  {/* Project Links (Live Demo, GitHub, Figma) */}
                  {(proj.websiteUrl || proj.githubUrl || proj.figmaUrl) && (
                    <div className="flex flex-wrap items-center gap-2 pt-3 mt-3 border-t border-slate-100">
                      {proj.websiteUrl && (
                        <a
                          href={proj.websiteUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50/80 hover:bg-blue-100 px-3 py-1 rounded-lg transition-colors"
                        >
                          <Globe className="h-3.5 w-3.5" />
                          <span>Live Demo</span>
                          <ExternalLink className="h-3 w-3 opacity-70" />
                        </a>
                      )}
                      {proj.githubUrl && (
                        <a
                          href={proj.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-lg transition-colors"
                        >
                          <FileText className="h-3.5 w-3.5" />
                          <span>Source Code</span>
                          <ExternalLink className="h-3 w-3 opacity-70" />
                        </a>
                      )}
                      {proj.figmaUrl && (
                        <a
                          href={proj.figmaUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-3 py-1 rounded-lg transition-colors"
                        >
                          <Award className="h-3.5 w-3.5" />
                          <span>Figma UI</span>
                          <ExternalLink className="h-3 w-3 opacity-70" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ----------------- TAB: CERTIFICATES ----------------- */}
      {innerTab === "certificates" && (
        <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">
                {isIndonesian ? "Sertifikasi & Lencana Kredensial" : "Certified Credentials & Badges"}
              </h3>
              <p className="text-xs text-slate-500 font-semibold">
                {isIndonesian 
                  ? "Sertifikasi profesional dan pelatihan yang terhubung langsung dengan profil Anda." 
                  : "Government-validated and professional certifications linked with your profile."}
              </p>
            </div>
            <button
              id="add-cert-trigger"
              onClick={() => setAddingCert(!addingCert)}
              className={`${
                addingCert 
                  ? "bg-red-50 hover:bg-red-100 text-red-600 border border-red-200" 
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              } text-xs font-bold px-4 py-2 rounded-xl cursor-pointer transition-colors`}
            >
              {addingCert 
                ? (isIndonesian ? "Batal" : "Cancel") 
                : (isIndonesian ? "+ Tambah Sertifikat" : "Add Certificate")}
            </button>
          </div>

          {addingCert && (
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/50 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                    {isIndonesian ? "Nama Sertifikat" : "Certificate Name"}
                  </label>
                  <input
                    type="text"
                    id="input-cert-name"
                    value={newCertName}
                    onChange={(e) => setNewCertName(e.target.value)}
                    placeholder="e.g. AWS Certified Solutions Architect"
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                    {isIndonesian ? "Lembaga Penerbit" : "Issuing Organization"}
                  </label>
                  <input
                    type="text"
                    id="input-cert-issuer"
                    value={newCertIssuer}
                    onChange={(e) => setNewCertIssuer(e.target.value)}
                    placeholder="e.g. Amazon Web Services"
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                    {isIndonesian ? "Tanggal Penerbitan (YYYY-MM)" : "Issue Date (YYYY-MM)"}
                  </label>
                  <input
                    type="month"
                    id="input-cert-issue"
                    value={newCertIssueDate}
                    onChange={(e) => setNewCertIssueDate(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                    {isIndonesian ? "Tanggal Kedaluwarsa (atau 'Never')" : "Expiration Date (or 'Never')"}
                  </label>
                  <input
                    type="text"
                    id="input-cert-expiry"
                    value={newCertExpiryDate}
                    onChange={(e) => setNewCertExpiryDate(e.target.value)}
                    placeholder="Never or YYYY-MM"
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800"
                  />
                </div>
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                    {isIndonesian ? "ID / Hash Kredensial" : "Credential ID / Hash"}
                  </label>
                  <input
                    type="text"
                    id="input-cert-id"
                    value={newCertId}
                    onChange={(e) => setNewCertId(e.target.value)}
                    placeholder="e.g. AWS-SEC-993819"
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800"
                  />
                </div>
              </div>
              <div className="text-right">
                <button
                  id="save-new-cert-btn"
                  onClick={handleAddCertificate}
                  className="bg-blue-600 text-white px-5 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  {isIndonesian ? "Simpan Lencana Sertifikat" : "Save Certificate Badge"}
                </button>
              </div>
            </div>
          )}
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(candidate.certificates || []).map((cert) => (
              <div key={cert.id} className="p-5 border border-slate-200 rounded-2xl bg-slate-50/50 flex items-start justify-between hover:border-slate-300 transition-colors relative">
                <div className="flex items-start space-x-3.5">
                  <div className="bg-blue-50 p-2.5 rounded-xl border border-blue-100 text-blue-600 shrink-0">
                    <Award className="h-5 w-5" />
                  </div>
                  <div className="space-y-1 pr-6">
                    <h4 className="font-extrabold text-slate-800 text-xs">{cert.name}</h4>
                    <p className="text-[11px] text-slate-500 font-bold">{cert.issuer}</p>
                    <div className="flex flex-col text-[10px] text-slate-400 font-bold pt-1">
                      <span>{isIndonesian ? "Diterbitkan:" : "Issued:"} {cert.issueDate}</span>
                      {cert.expirationDate && <span>{isIndonesian ? "Berlaku Hingga:" : "Expires:"} {cert.expirationDate}</span>}
                    </div>
                  </div>
                </div>
                <button
                  id={`delete-cert-${cert.id}`}
                  onClick={() => handleRemoveCertificate(cert.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition-colors cursor-pointer absolute top-4 right-4"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            {(candidate.certificates || []).length === 0 && (
              <div className="col-span-full py-12 text-center text-slate-400 text-xs font-bold bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                {isIndonesian ? "Belum ada sertifikat terverifikasi yang diunggah. Klik 'Tambah Sertifikat' untuk menampilkan pencapaian Anda." : "No verified certificates uploaded yet. Click \"Add Certificate\" to showcase your achievements."}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ----------------- TAB: TRAINING ----------------- */}
      {innerTab === "training" && (
        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-6">
          
          {/* Main Sub-view Selector */}
          <div className="border-b border-slate-100 pb-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">
                    {isIndonesian ? "Pusat Pembelajaran & Beasiswa Saya" : "My Learning & Scholarship Hub"}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  {isIndonesian 
                    ? "Kelola kelas online/offline, tonton rekaman video instruktur, dan pantau status seleksi beasiswa Anda." 
                    : "Manage active courses, watch recorded sessions with instructors, and track your scholarship applications."}
                </p>
              </div>

              {/* View Toggle (Courses vs Scholarships) */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shrink-0">
                <button
                  type="button"
                  onClick={() => setTrainingSubTab("courses")}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
                    trainingSubTab === "courses"
                      ? "bg-white text-slate-900 shadow-sm border border-slate-200/80"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <BookOpen className="h-3.5 w-3.5 text-blue-600" />
                  <span>{isIndonesian ? "Pelatihan Terdaftar" : "Enrolled Courses"}</span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded-full font-black">
                    {(candidate.enrolledTrainings || []).length || 2}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setTrainingSubTab("scholarships")}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
                    trainingSubTab === "scholarships"
                      ? "bg-white text-slate-900 shadow-sm border border-slate-200/80"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <GraduationCap className="h-3.5 w-3.5 text-purple-600" />
                  <span>{isIndonesian ? "Pengajuan Beasiswa Saya" : "My Scholarships"}</span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded-full font-black">
                    {candidate.scholarshipApplications !== undefined ? candidate.scholarshipApplications.length : 1}
                  </span>
                </button>
              </div>
            </div>

            {/* If in courses view, show filter */}
            {trainingSubTab === "courses" && (
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-bold text-slate-500">
                  {isIndonesian ? "Filter status kursus:" : "Filter course status:"}
                </span>
                <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200">
                  {[
                    { id: "all", label: isIndonesian ? "Semua" : "All" },
                    { id: "in_progress", label: isIndonesian ? "Sedang Berjalan" : "In Progress" },
                    { id: "completed", label: isIndonesian ? "Selesai" : "Completed" }
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setTrainingStatusFilter(f.id as any)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        trainingStatusFilter === f.id
                          ? "bg-slate-900 text-white shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* VIEW A: ENROLLED COURSES */}
          {trainingSubTab === "courses" && (() => {
            const allTrainings: EnrolledTraining[] = (candidate.enrolledTrainings && candidate.enrolledTrainings.length > 0)
              ? candidate.enrolledTrainings
              : [
                  {
                    id: "enr_default_1",
                    trainingId: "tr_1",
                    trainingTitle: "Full-Stack Enterprise Applications with React & Node",
                    provider: "Digital Talent Academy",
                    format: "Online",
                    type: "Government",
                    price: 0,
                    platformFee: 0,
                    providerShare: 0,
                    paymentStatus: "free",
                    paymentMethod: "Beasiswa Kominfo",
                    invoiceNumber: "INV-FREE-849201",
                    enrolledAt: "2026-07-01",
                    status: "in_progress",
                    progressPercentage: 85,
                    completedModulesCount: 5,
                    totalModulesCount: 6,
                    schedule: "Selasa & Kamis, 19:30 - 21:30 WIB",
                    onlineMeetingPlatform: "Google Meet",
                    onlineMeetingUrl: "https://meet.google.com/dts-talenthub-2026",
                    lmsUrl: "https://talenthub.id/lms/react-node"
                  },
                  {
                    id: "enr_default_2",
                    trainingId: "tr_2",
                    trainingTitle: "Advanced Cloud Infrastructure & DevOps",
                    provider: "Kominfo x AWS",
                    format: "Offline",
                    type: "Government",
                    price: 0,
                    platformFee: 0,
                    providerShare: 0,
                    paymentStatus: "free",
                    paymentMethod: "Beasiswa Kominfo",
                    invoiceNumber: "INV-FREE-394810",
                    enrolledAt: "2026-06-15",
                    status: "completed",
                    progressPercentage: 100,
                    completedModulesCount: 4,
                    totalModulesCount: 4,
                    completedAt: "2026-07-28",
                    certificateId: "CERT-KOMINFO-2026-9482",
                    schedule: "Sabtu & Minggu, 09:00 - 16:00 WIB",
                    qrTicketCode: "TICKET-OFFLINE-784920",
                    venueName: "TalentHub Training Center - Menara Cyber 2",
                    venueRoom: "Auditorium Lantai 15, Lab 3",
                    venueAddress: "Jl. H.R. Rasuna Said Blok X-5 No. 13, Kuningan, Jakarta Selatan 12950",
                    venueCity: "Jakarta Selatan",
                    venueGoogleMapsUrl: "https://maps.google.com/?q=Menara+Cyber+2+Jakarta"
                  }
                ];

            const filteredList = allTrainings.filter(t => {
              if (trainingStatusFilter === "all") return true;
              return t.status === trainingStatusFilter;
            });

            if (filteredList.length === 0) {
              return (
                <div className="py-12 text-center text-slate-400 text-xs font-bold bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 space-y-2">
                  <p>{isIndonesian ? "Tidak ada pelatihan yang cocok dengan filter status saat ini." : "No enrolled trainings match the selected status filter."}</p>
                </div>
              );
            }

            return (
              <div className="grid md:grid-cols-2 gap-6">
                {filteredList.map((enr) => {
                  const isOffline = enr.format === "Offline";
                  const isCompleted = enr.status === "completed" || enr.progressPercentage >= 100;
                  const isPaid = (enr.price ?? 0) > 0;

                  return (
                    <div 
                      key={enr.id}
                      className={`p-6 rounded-3xl border transition-all space-y-5 relative overflow-hidden ${
                        isCompleted 
                          ? "bg-emerald-50/40 border-emerald-200" 
                          : isOffline 
                          ? "bg-amber-50/30 border-amber-200" 
                          : "bg-blue-50/30 border-blue-200"
                      }`}
                    >
                      {/* Top Badges */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          {/* Format Badge */}
                          <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg uppercase flex items-center gap-1 ${
                            isOffline ? "bg-amber-600 text-white" : "bg-blue-600 text-white"
                          }`}>
                            {isOffline ? <MapPin className="h-3 w-3" /> : <Video className="h-3 w-3" />}
                            <span>{isOffline ? (isIndonesian ? "Tatap Muka (Offline)" : "In-Person (Offline)") : (isIndonesian ? "Daring (Online Live)" : "Online Live Class")}</span>
                          </span>

                          {/* Payment / Sponsor Badge */}
                          <span className="text-[10px] font-black bg-slate-900 text-white px-2 py-1 rounded-lg uppercase">
                            {isPaid ? (isIndonesian ? "Berbayar (Lunas)" : "Paid") : (isIndonesian ? "Beasiswa (Gratis)" : "Free")}
                          </span>
                        </div>

                        {/* Status pill */}
                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase ${
                          isCompleted ? "bg-emerald-100 text-emerald-800" : "bg-blue-100 text-blue-800"
                        }`}>
                          {isCompleted ? (isIndonesian ? "Selesai ✓" : "Completed ✓") : `${enr.progressPercentage}% Progres`}
                        </span>
                      </div>

                      {/* Course Title & Provider */}
                      <div className="space-y-1">
                        <h4 className="font-black text-slate-900 text-base leading-snug">
                          {enr.trainingTitle}
                        </h4>
                        <p className="text-xs text-slate-500 font-bold">
                          {isIndonesian ? "Penyelenggara:" : "Provider:"} <span className="text-slate-800">{enr.provider}</span>
                        </p>
                      </div>

                      {/* Schedule / Venue Specific Details */}
                      <div className="bg-white/90 p-3.5 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
                        {enr.schedule && (
                          <div className="flex items-center gap-2 text-slate-700 font-bold">
                            <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                            <span>{enr.schedule}</span>
                          </div>
                        )}

                        {isOffline && enr.venueName && (
                          <div className="flex items-start gap-2 text-amber-900 font-semibold text-[11px] pt-1 border-t border-slate-100">
                            <MapPin className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-extrabold block">{enr.venueName}</span>
                              <span className="text-slate-500 block">{enr.venueRoom || enr.venueAddress}</span>
                            </div>
                          </div>
                        )}

                        {!isOffline && enr.onlineMeetingPlatform && (
                          <div className="flex items-center gap-2 text-blue-900 font-semibold text-[11px] pt-1 border-t border-slate-100">
                            <Video className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                            <span>Platform: <strong>{enr.onlineMeetingPlatform}</strong></span>
                          </div>
                        )}
                      </div>

                      {/* Progress Bar & Module counter */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs font-bold text-slate-600">
                          <span>{isIndonesian ? "Progres Kurikulum" : "Curriculum Progress"}</span>
                          <span>{enr.completedModulesCount || 0} / {enr.totalModulesCount || 4} {isIndonesian ? "Modul Selesai" : "Modules Done"}</span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-200/70 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              isCompleted ? "bg-emerald-500" : "bg-blue-600"
                            }`}
                            style={{ width: `${Math.min(100, Math.max(5, enr.progressPercentage))}%` }}
                          />
                        </div>
                      </div>

                      {/* INSTRUCTOR REPLAY ACTION BUTTON (HIGHLIGHTED) */}
                      <button
                        type="button"
                        onClick={() => setSelectedReplayTraining(enr)}
                        className="w-full py-2.5 px-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                      >
                        <Video className="h-4 w-4 text-blue-400" />
                        <span>{isIndonesian ? "Tonton Rekaman Video Instruktur & Q&A" : "Watch Instructor Replay & Q&A"}</span>
                      </button>

                      {/* Action Buttons Row */}
                      <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200/60">
                        {/* Offline Action: View E-Ticket */}
                        {isOffline && (
                          <button
                            type="button"
                            onClick={() => setViewingTicket(enr)}
                            className="flex-1 py-2 px-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-black transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                          >
                            <QrCode className="h-3.5 w-3.5" />
                            <span>{isIndonesian ? "QR Tiket Masuk" : "View E-Ticket"}</span>
                          </button>
                        )}

                        {/* Online Action: Join Meeting / Classroom */}
                        {!isOffline && (
                          <button
                            type="button"
                            onClick={() => setViewingClassroom(enr)}
                            className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                          >
                            <Video className="h-3.5 w-3.5" />
                            <span>{isIndonesian ? "Masuk Ruang Kelas" : "Open Classroom"}</span>
                          </button>
                        )}

                        {/* Fee Breakdown / Invoice Button */}
                        <button
                          type="button"
                          onClick={() => setViewingInvoice(enr)}
                          className="py-2 px-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <CreditCard className="h-3.5 w-3.5 text-slate-500" />
                          <span>{isPaid ? (isIndonesian ? "Bukti Bayar" : "Receipt") : (isIndonesian ? "Info Biaya" : "Billing")}</span>
                        </button>

                        {/* Complete Next Module Trigger */}
                        {!isCompleted && (
                          <button
                            type="button"
                            onClick={() => {
                              const totalMods = enr.totalModulesCount || 4;
                              const currentDone = enr.completedModulesCount || 0;
                              const nextDone = Math.min(totalMods, currentDone + 1);
                              const nextPct = Math.round((nextDone / totalMods) * 100);
                              const nextStat = nextPct >= 100 ? "completed" : "in_progress";

                              const updated = (candidate.enrolledTrainings || allTrainings).map(t => {
                                if (t.id === enr.id || t.trainingId === enr.trainingId) {
                                  return {
                                    ...t,
                                    completedModulesCount: nextDone,
                                    progressPercentage: nextPct,
                                    status: nextStat as any,
                                    completedAt: nextStat === "completed" ? new Date().toISOString().split("T")[0] : t.completedAt,
                                    certificateId: nextStat === "completed" ? (t.certificateId || `CERT-${Math.floor(100000 + Math.random() * 900000)}`) : t.certificateId
                                  };
                                }
                                return t;
                              });

                              onUpdateCandidate({
                                ...candidate,
                                enrolledTrainings: updated
                              });
                            }}
                            className="w-full py-1.5 text-[11px] font-bold text-slate-600 hover:text-blue-600 bg-white hover:bg-blue-50 border border-slate-200 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1"
                          >
                            <CheckCircle2 className="h-3 w-3 text-blue-600" />
                            <span>{isIndonesian ? "Tandai Modul Berikutnya Selesai ✓" : "Mark Next Module Completed ✓"}</span>
                          </button>
                        )}
                      </div>

                      {/* Verified Certificate Notification if Completed */}
                      {isCompleted && enr.certificateId && (
                        <div className="bg-emerald-100/80 p-3 rounded-2xl border border-emerald-300/80 flex items-center justify-between text-xs text-emerald-950 font-bold">
                          <div className="flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-emerald-700" />
                            <span>ID Sertifikat: <strong className="font-mono">{enr.certificateId}</strong></span>
                          </div>
                          <span className="text-[10px] uppercase font-black bg-emerald-700 text-white px-2 py-0.5 rounded">
                            {isIndonesian ? "Terverifikasi" : "Verified"}
                          </span>
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            );
          })()}

          {/* VIEW B: SCHOLARSHIP APPLICATIONS TRACKER */}
          {trainingSubTab === "scholarships" && (() => {
            const apps: CandidateScholarshipApplication[] = (candidate.scholarshipApplications && candidate.scholarshipApplications.length > 0)
              ? candidate.scholarshipApplications
              : [
                  {
                    id: "sch_mock_1",
                    candidateId: candidate.id || "cand_1",
                    candidateName: candidate.fullName || "Alex Rivera",
                    candidateEmail: candidate.email || "alex.rivera@example.com",
                    candidatePhone: candidate.phone || "+62 811-9876-5432",
                    trainingId: "tr_1",
                    trainingTitle: "Digital Talent Scholarship (DTS) - Full Stack Engineering",
                    provider: "Kementerian Komunikasi dan Informatika (Kominfo)",
                    format: "Online",
                    motivationEssay: "Saya sangat berkomitmen memperdalam arsitektur TypeScript tingkat lanjut dan arsitektur database modern untuk membangun solusi teknologi inklusif di Indonesia.",
                    careerGoals: "Menjadi Principal Cloud Architect yang memimpin modernisasi sistem digital publik dan membimbing generasi junior developer.",
                    portfolioUrl: candidate.github || "https://github.com/alexrivera",
                    linkedinUrl: candidate.linkedin || "https://linkedin.com/in/alex-rivera-dev",
                    gpaOrAchievement: "IPK 3.89 / Cumlaude - Teknik Informatika",
                    weeklyCommitmentHours: 15,
                    submittedAt: "2026-08-28",
                    status: "approved",
                    adminFeedback: "Aplikasi beasiswa Anda telah disetujui oleh Panitia Seleksi DTS Kominfo. Kuota resmi dan kredensial ruang kelas telah diterbitkan ke dasbor Anda.",
                    reviewedAt: "2026-08-30",
                    reviewedBy: "Super Admin TalentHub"
                  }
                ];

            return (
              <div className="space-y-6">
                <div className="bg-purple-50/60 border border-purple-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full border border-purple-200">
                      {isIndonesian ? "Transparansi Alur Seleksi Beasiswa" : "Scholarship Application Lifecycle"}
                    </span>
                    <h4 className="text-sm font-black text-slate-900">
                      {isIndonesian ? "Status Kurasi & Hasil Beasiswa Kandidat" : "Curated Candidate Scholarship Tracking"}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-xl">
                      {isIndonesian
                        ? "Setiap pengajuan beasiswa ditinjau langsung oleh tim kurator TalentHub dan lembaga mitra penyedia program beasiswa resmi."
                        : "Every application is evaluated directly by the TalentHub admission committee and the official scholarship partner."}
                    </p>
                  </div>

                  <div className="shrink-0">
                    <span className="text-xs font-black text-purple-800 bg-purple-100/90 px-3.5 py-1.5 rounded-xl border border-purple-200">
                      {apps.length} {isIndonesian ? "Pengajuan Aktif" : "Active Submissions"}
                    </span>
                  </div>
                </div>

                {apps.length === 0 ? (
                  <div className="py-14 text-center text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200 p-8 space-y-3">
                    <GraduationCap className="h-8 w-8 text-purple-400 mx-auto" />
                    <p className="font-extrabold text-slate-700 text-sm">
                      {isIndonesian ? "Belum Ada Pengajuan Beasiswa Aktif" : "No Active Scholarship Submissions"}
                    </p>
                    <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                      {isIndonesian 
                        ? "Anda belum mengajukan beasiswa. Buka katalog Pelatihan bersertifikat gratis & beasiswa untuk mengirimkan berkas aplikasi Anda."
                        : "You have not submitted any scholarship applications yet. Explore the Training catalog to apply for free seats."}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {apps.map((app) => {
                      const statusConfig = {
                      submitted: {
                        label: isIndonesian ? "Diajukan (Menunggu Review)" : "Submitted",
                        color: "bg-blue-100 text-blue-800 border-blue-200",
                        step: 1
                      },
                      under_review: {
                        label: isIndonesian ? "Sedang Ditinjau Tim Kurator" : "Under Review",
                        color: "bg-amber-100 text-amber-800 border-amber-200",
                        step: 2
                      },
                      interview_scheduled: {
                        label: isIndonesian ? "Tahap Wawancara / Uji Teknis" : "Interview Stage",
                        color: "bg-purple-100 text-purple-800 border-purple-200",
                        step: 3
                      },
                      approved: {
                        label: isIndonesian ? "Disetujui Beasiswa Penuh ✓" : "Fully Funded Approved ✓",
                        color: "bg-emerald-100 text-emerald-800 border-emerald-300",
                        step: 4
                      },
                      rejected: {
                        label: isIndonesian ? "Belum Lolos Seleksi" : "Not Selected",
                        color: "bg-rose-100 text-rose-800 border-rose-200",
                        step: 4
                      }
                    }[app.status] || {
                      label: app.status,
                      color: "bg-slate-100 text-slate-800 border-slate-200",
                      step: 1
                    };

                    return (
                      <div 
                        key={app.id} 
                        className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs hover:border-slate-300 transition-all space-y-5"
                      >
                        {/* Application Header */}
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 pb-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-lg bg-slate-900 text-white uppercase">
                                {app.format}
                              </span>
                              <span className="text-xs text-slate-400 font-bold">
                                {isIndonesian ? "Diajukan pada:" : "Submitted on:"} {app.submittedAt}
                              </span>
                            </div>
                            <h4 className="text-base font-black text-slate-900">
                              {app.trainingTitle}
                            </h4>
                            <p className="text-xs font-bold text-slate-500">
                              {isIndonesian ? "Lembaga Penyedia:" : "Partner Provider:"} <span className="text-blue-600">{app.provider}</span>
                            </p>
                          </div>

                          {/* Status Badge */}
                          <div className="shrink-0">
                            <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black border ${statusConfig.color}`}>
                              {app.status === "approved" && <CheckCircle2 className="h-3.5 w-3.5" />}
                              {app.status === "under_review" && <Clock className="h-3.5 w-3.5" />}
                              <span>{statusConfig.label}</span>
                            </span>
                          </div>
                        </div>

                        {/* Progress Stepper Milestone Bar */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-[11px] font-bold text-slate-500">
                            <span className={statusConfig.step >= 1 ? "text-purple-700 font-black" : ""}>1. Diajukan</span>
                            <span className={statusConfig.step >= 2 ? "text-purple-700 font-black" : ""}>2. Kurasi Dokumen</span>
                            <span className={statusConfig.step >= 3 ? "text-purple-700 font-black" : ""}>3. Wawancara</span>
                            <span className={statusConfig.step >= 4 ? (app.status === "approved" ? "text-emerald-700 font-black" : "text-rose-700 font-black") : ""}>4. Hasil Akhir</span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex">
                            <div 
                              className={`h-full transition-all duration-500 ${app.status === "approved" ? "bg-emerald-500" : app.status === "rejected" ? "bg-rose-500" : "bg-purple-600"}`}
                              style={{ width: `${(statusConfig.step / 4) * 100}%` }}
                            />
                          </div>
                        </div>

                        {/* Details Excerpt */}
                        <div className="grid sm:grid-cols-2 gap-4 bg-slate-50/70 p-4 rounded-2xl border border-slate-150 text-xs">
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold uppercase text-slate-400 block">
                              {isIndonesian ? "Ringkasan Esai Motivasi" : "Motivation Essay"}
                            </span>
                            <p className="text-slate-700 font-medium line-clamp-3 leading-relaxed">
                              "{app.motivationEssay}"
                            </p>
                          </div>
                          <div className="space-y-2">
                            <div>
                              <span className="text-[10px] font-bold uppercase text-slate-400 block">
                                {isIndonesian ? "Target Karir & Komitmen" : "Career Goals & Commitment"}
                              </span>
                              <p className="text-slate-700 font-medium line-clamp-2">
                                {app.careerGoals}
                              </p>
                              <span className="text-[11px] font-bold text-blue-600 block mt-1">
                                ⏱ {app.weeklyCommitmentHours} {isIndonesian ? "Jam per minggu" : "Hours/week"} • {app.gpaOrAchievement}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Admin / Selection Committee Feedback */}
                        {app.adminFeedback && (
                          <div className={`p-4 rounded-2xl border text-xs font-semibold leading-relaxed flex items-start gap-2.5 ${
                            app.status === "approved" 
                              ? "bg-emerald-50/70 border-emerald-200 text-emerald-900" 
                              : "bg-blue-50/70 border-blue-200 text-blue-900"
                          }`}>
                            <Info className="h-4 w-4 shrink-0 mt-0.5 text-blue-600" />
                            <div className="space-y-0.5">
                              <span className="font-black block">
                                {isIndonesian ? "Catatan Tim Seleksi / Admin:" : "Selection Committee Feedback:"}
                              </span>
                              <p>{app.adminFeedback}</p>
                              {app.reviewedBy && (
                                <span className="text-[10px] font-bold text-slate-400 block pt-1">
                                  Diverifikasi oleh: {app.reviewedBy} {app.reviewedAt ? `pada ${app.reviewedAt}` : ""}
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* If approved: Official Cost & Funding Award Breakdown (Revealed Post-Selection) */}
                        {app.status === "approved" ? (
                          <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                              <span className="text-[11px] font-black text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                                <Award className="h-4 w-4 text-emerald-600 shrink-0" />
                                {isIndonesian ? "Rincian Resmi Penerimaan Beasiswa (Kandidat Terpilih)" : "Official Award & Funding Breakdown (Selected Awardee)"}
                              </span>
                              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-200/80 text-emerald-900 self-start sm:self-auto">
                                {isIndonesian ? "Lolos Seleksi Terbatas: 1 dari 50 Kuota" : "Selected: 1 of 50 Limited Spots"}
                              </span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                              <div className="bg-white p-3 rounded-xl border border-emerald-100 space-y-0.5">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{isIndonesian ? "Alokasi Biaya Kursus" : "Tuition Allocation"}</span>
                                <span className="text-xs font-black text-emerald-700 block">Rp 0 (100% Ditanggung Mitra)</span>
                              </div>
                              <div className="bg-white p-3 rounded-xl border border-emerald-100 space-y-0.5">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{isIndonesian ? "Fasilitas Lab & LMS" : "LMS & Lab Facilities"}</span>
                                <span className="text-xs font-black text-slate-900 block">{isIndonesian ? "Akses Penuh Tanpa Batas" : "Full Unlimited Access"}</span>
                              </div>
                              <div className="bg-white p-3 rounded-xl border border-emerald-100 space-y-0.5">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{isIndonesian ? "Mentoring & Sertifikasi" : "Mentorship & Certificate"}</span>
                                <span className="text-xs font-black text-slate-900 block">{isIndonesian ? "Termasuk Resmi" : "Fully Included"}</span>
                              </div>
                            </div>
                            <div className="pt-1 flex justify-end">
                              <button
                                type="button"
                                onClick={() => setTrainingSubTab("courses")}
                                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                              >
                                <BookOpen className="h-4 w-4" />
                                <span>{isIndonesian ? "Mulai Belajar di Pelatihan Saya" : "Start Learning in My Courses"}</span>
                              </button>
                            </div>
                          </div>
                        ) : app.status !== "rejected" ? (
                          <div className="p-3.5 bg-purple-50/70 border border-purple-100 rounded-2xl flex items-start gap-2.5 text-xs text-purple-950">
                            <Info className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
                            <div className="space-y-0.5">
                              <span className="font-extrabold text-purple-950 block">
                                {isIndonesian ? "Tahap Kurasi & Kuota Terbatas (50 Kursi)" : "Competitive Selection & Limited Spots (50 Seats)"}
                              </span>
                              <p className="text-[11px] text-purple-900/90 leading-relaxed font-medium">
                                {isIndonesian
                                  ? "Rincian alokasi biaya dan fasilitas beasiswa tidak ditampilkan pada tahap pengajuan awal. Mengingat pendaftar mencapai 1.000+ untuk 50 kuota terpilih, panitia sedang menyaring berkas & esai motivasi. Rincian pendanaan lengkap resmi akan dibuka setelah Anda dinyatakan terpilih."
                                  : "Funding details are not revealed during the initial application. Because spots are limited (e.g., 50 spots for 1,000+ applicants), our committee is reviewing submissions. Official grant allocation details will be granted once you are selected."}
                              </p>
                            </div>
                          </div>
                        ) : null}

                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            );
          })()}

          {/* ------------------------------------------------------------------ */}
          {/* MODAL 1: OFFLINE E-TICKET & QR CHECK-IN MODAL */}
          {/* ------------------------------------------------------------------ */}
          {viewingTicket && (
            <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-7 space-y-5 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-extrabold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200 uppercase">
                      {isIndonesian ? "Tiket Masuk Presensi Tatap Muka" : "Onsite Admission E-Ticket"}
                    </span>
                    <h3 className="text-base font-black text-slate-900 tracking-tight">
                      {isIndonesian ? "Tiket Kehadiran Offline" : "Offline Entry Pass"}
                    </h3>
                  </div>
                  <button
                    onClick={() => setViewingTicket(null)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Simulated E-Ticket Physical Card */}
                <div className="bg-gradient-to-b from-amber-50/90 to-amber-100/60 border-2 border-dashed border-amber-300 rounded-3xl p-5 space-y-4 text-slate-900">
                  <div className="flex justify-between items-center border-b border-amber-200 pb-3">
                    <div>
                      <span className="text-[10px] font-extrabold text-amber-800 uppercase tracking-widest block">
                        KODE TIKET RESMI
                      </span>
                      <span className="font-mono text-sm font-black text-slate-950">
                        {viewingTicket.qrTicketCode || "TICKET-OFFLINE-784920"}
                      </span>
                    </div>
                    <div className="h-12 w-12 bg-white rounded-xl border border-amber-200 flex items-center justify-center p-1 shadow-2xs">
                      <QrCode className="h-10 w-10 text-slate-900" />
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">{isIndonesian ? "Nama Peserta" : "Attendee"}</span>
                      <span className="font-extrabold text-slate-900 text-sm block">{candidate.fullName}</span>
                      <span className="text-slate-500 text-[11px] font-medium">{candidate.email}</span>
                    </div>

                    <div className="pt-2 border-t border-amber-200/60">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">{isIndonesian ? "Program & Penyelenggara" : "Course & Provider"}</span>
                      <span className="font-extrabold text-slate-900 block">{viewingTicket.trainingTitle}</span>
                      <span className="text-slate-600 font-bold text-[11px]">{viewingTicket.provider}</span>
                    </div>

                    <div className="pt-2 border-t border-amber-200/60">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">{isIndonesian ? "Lokasi Gedung & Ruangan" : "Venue & Room"}</span>
                      <span className="font-extrabold text-amber-950 block">{viewingTicket.venueName || "TalentHub Training Center - Menara Cyber 2"}</span>
                      <span className="text-slate-600 block text-[11px] font-medium">{viewingTicket.venueRoom || "Auditorium Lantai 15, Lab 3"}</span>
                      <span className="text-slate-500 block text-[10px] mt-0.5">{viewingTicket.venueAddress || "Jl. H.R. Rasuna Said Blok X-5 No. 13, Kuningan, Jakarta Selatan"}</span>
                    </div>

                    {viewingTicket.schedule && (
                      <div className="pt-2 border-t border-amber-200/60 flex items-center gap-1.5 font-bold text-amber-900">
                        <Calendar className="h-3.5 w-3.5 text-amber-700" />
                        <span>{viewingTicket.schedule}</span>
                      </div>
                    )}
                  </div>

                  {/* QR Presentation note */}
                  <div className="p-2.5 bg-amber-100/80 rounded-xl border border-amber-300 text-[11px] text-amber-950 font-medium">
                    {isIndonesian
                      ? "Tunjukkan kode QR ini ke staf presensi di meja registrasi lantai 15 untuk verifikasi kehadiran dan akses lab."
                      : "Present this QR ticket at the 15th floor reception desk for automated attendance check-in."}
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <a
                    href={viewingTicket.venueGoogleMapsUrl || `https://maps.google.com/?q=${encodeURIComponent(viewingTicket.venueAddress || "Menara Cyber 2 Jakarta")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-black transition-colors flex items-center justify-center gap-2 shadow-xs"
                  >
                    <MapPin className="h-4 w-4" />
                    <span>{isIndonesian ? "Buka Navigasi di Google Maps" : "Open in Google Maps"}</span>
                    <ExternalLink className="h-3.5 w-3.5 opacity-75" />
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      window.print();
                    }}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    <span>{isIndonesian ? "Cetak / Simpan PDF Tiket" : "Print / Save PDF Ticket"}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------------ */}
          {/* MODAL 2: ONLINE CLASSROOM & GOOGLE MEET PORTAL */}
          {/* ------------------------------------------------------------------ */}
          {viewingClassroom && (
            <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-7 space-y-5 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-extrabold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200 uppercase">
                      {isIndonesian ? "Ruang Kelas Daring Interaktif" : "Online Live Classroom"}
                    </span>
                    <h3 className="text-base font-black text-slate-900 tracking-tight">
                      {viewingClassroom.trainingTitle}
                    </h3>
                  </div>
                  <button
                    onClick={() => setViewingClassroom(null)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between text-blue-950 font-bold">
                      <span className="flex items-center gap-1.5">
                        <Video className="h-4 w-4 text-blue-600" />
                        <span>Sesi Live: {viewingClassroom.onlineMeetingPlatform || "Google Meet"}</span>
                      </span>
                      <span className="text-[10px] font-extrabold bg-blue-200 text-blue-900 px-2 py-0.5 rounded">
                        Link Aktif
                      </span>
                    </div>
                    {viewingClassroom.schedule && (
                      <p className="text-slate-600 text-[11px] font-medium">🗓️ Jadwal: {viewingClassroom.schedule}</p>
                    )}
                    <div className="pt-2">
                      <a
                        href={viewingClassroom.onlineMeetingUrl || "https://meet.google.com/dts-talenthub-2026"}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-xs transition-colors shadow-xs"
                      >
                        <Video className="h-4 w-4" />
                        <span>{isIndonesian ? "Masuk ke Sesi Google Meet Sekarang" : "Join Google Meet Now"}</span>
                        <ExternalLink className="h-3.5 w-3.5 opacity-75" />
                      </a>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                    <h4 className="font-extrabold text-slate-900">{isIndonesian ? "Portal LMS & Rekaman Video" : "LMS Video Archive"}</h4>
                    <p className="text-slate-600 text-[11px]">
                      {isIndonesian
                        ? "Akses rekaman modul, repositori GitHub latihan, dan kuis pemahaman konsep."
                        : "Access lesson video recordings, practice code repos, and knowledge quizzes."}
                    </p>
                    <a
                      href={viewingClassroom.lmsUrl || "https://talenthub.id/lms"}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-bold text-xs"
                    >
                      <span>{isIndonesian ? "Buka Portal Materi & Kuis" : "Open Learning Materials"}</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setViewingClassroom(null)}
                    className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 cursor-pointer"
                  >
                    {isIndonesian ? "Tutup" : "Close"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------------ */}
          {/* MODAL 3: INVOICE & FEE BREAKDOWN (10% TALENTHUB SHARE) */}
          {/* ------------------------------------------------------------------ */}
          {viewingInvoice && (
            <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-7 space-y-5 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200 uppercase">
                      {viewingInvoice.paymentStatus === "paid" ? (isIndonesian ? "Faktur Pembayaran Resmi" : "Official Invoice") : (isIndonesian ? "Rincian Biaya Beasiswa" : "Funded Breakdown")}
                    </span>
                    <h3 className="text-base font-black text-slate-900 tracking-tight">
                      {isIndonesian ? "Bukti Transaksi & Rincian Biaya" : "Transaction Details"}
                    </h3>
                  </div>
                  <button
                    onClick={() => setViewingInvoice(null)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">{isIndonesian ? "Nomor Invoice" : "Invoice No"}</span>
                      <span className="font-mono font-black text-slate-900 text-xs">{viewingInvoice.invoiceNumber || "INV-PAY-849201"}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(viewingInvoice.invoiceNumber || "INV-PAY-849201");
                        setCopiedInvoiceNumber(true);
                        setTimeout(() => setCopiedInvoiceNumber(false), 1500);
                      }}
                      className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded hover:bg-blue-100 cursor-pointer"
                    >
                      {copiedInvoiceNumber ? (isIndonesian ? "Tersalin!" : "Copied!") : (isIndonesian ? "Salin No." : "Copy")}
                    </button>
                  </div>

                  <div className="space-y-1 text-slate-600">
                    <div className="flex justify-between">
                      <span>{isIndonesian ? "Metode Pembayaran:" : "Payment Method:"}</span>
                      <span className="font-bold text-slate-900">{viewingInvoice.paymentMethod || "QRIS Instant"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{isIndonesian ? "Tanggal Pendaftaran:" : "Date:"}</span>
                      <span className="font-bold text-slate-900">{viewingInvoice.enrolledAt || "2026-08-01"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{isIndonesian ? "Status:" : "Status:"}</span>
                      <span className="font-black text-emerald-700 uppercase text-[11px]">{isIndonesian ? "Lunas Terverifikasi ✓" : "Paid ✓"}</span>
                    </div>
                  </div>

                  {/* 10% Fee Breakdown Breakdown Section */}
                  <div className="pt-2 border-t border-slate-200 space-y-1 text-slate-700">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                      {isIndonesian ? "Struktur Biaya Transparan:" : "Fee Architecture:"}
                    </span>
                    <div className="flex justify-between">
                      <span>{isIndonesian ? `Biaya Pelatihan Mitra (${viewingInvoice.provider} - 90%):` : "Course Provider (90%):"}</span>
                      <span className="font-bold">Rp {Math.round((viewingInvoice.price ?? 0) * 0.9).toLocaleString("id-ID")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1">
                        <span>{isIndonesian ? "Biaya Layanan TalentHub (10%):" : "TalentHub Platform Fee (10%):"}</span>
                        <Info className="h-3 w-3 text-slate-400" />
                      </span>
                      <span className="font-bold text-blue-600">Rp {Math.round((viewingInvoice.price ?? 0) * 0.1).toLocaleString("id-ID")}</span>
                    </div>
                    <div className="flex justify-between font-black text-slate-900 text-sm pt-2 border-t border-slate-200">
                      <span>{isIndonesian ? "Total Pembayaran:" : "Total Paid:"}</span>
                      <span className="text-emerald-700">Rp {(viewingInvoice.price ?? 0).toLocaleString("id-ID")}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setViewingInvoice(null)}
                    className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 cursor-pointer text-center"
                  >
                    {isIndonesian ? "Tutup Rincian" : "Close"}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ----------------- TAB: NOTIFICATIONS ----------------- */}
      {innerTab === "notifications" && (
        <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">
                {isIndonesian ? "Log Notifikasi & Aktivitas" : "Notification Logs"}
              </h3>
              <p className="text-xs text-slate-500 font-semibold">
                {isIndonesian ? "Riwayat interaksi perekrut dan kunjungan ke profil Anda." : "Historical audit trail of recruiter interactions and profile visits."}
              </p>
            </div>
            <span className="bg-blue-50 text-blue-700 text-xs font-black px-3 py-1 rounded-full border border-blue-100">
              {isIndonesian ? "Log Aktif" : "Active Logs"}
            </span>
          </div>

          <div className="space-y-3">
            {(isIndonesian ? [
              { title: "Elena melihat portofolio Anda", body: "Elena Rostova dari TechCorp Global baru saja melihat studi kasus payment-hub Anda.", time: "1 jam lalu", type: "view" },
              { title: "Tawaran Wawancara Baru Diterima!", body: "GoVentures Tech mengirimkan undangan sourcing langsung untuk posisi Frontend Engineer.", time: "1 hari lalu", type: "pitch" },
              { title: "Lencana Verifikasi Disetujui!", body: "Admin TalentHub memverifikasi kredensial dan sertifikat bootcamp resmi Anda.", time: "3 hari lalu", type: "system" }
            ] : [
              { title: "Elena viewed your portfolio", body: "Elena Rostova from TechCorp Global recently reviewed your payment-hub case study.", time: "1 hr ago", type: "view" },
              { title: "New Interview Pitch Received!", body: "GoVentures Tech sent you a direct Sourcing Invitation for a Frontend Internship.", time: "1 day ago", type: "pitch" },
              { title: "Verification badge Approved!", body: "TalentHub admin verified your credentials and government bootcamp certificates.", time: "3 days ago", type: "system" }
            ]).map((n, i) => (
              <div key={i} className="p-4 border border-slate-100 bg-slate-50/50 rounded-2xl flex items-start space-x-3 text-xs">
                <div className="bg-white p-2 rounded-xl border border-slate-200 text-blue-600 shrink-0">
                  <Bell className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-slate-900">{n.title}</h4>
                  <p className="text-slate-500 font-semibold">{n.body}</p>
                  <span className="text-[10px] text-slate-400 font-bold block pt-1">{n.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ----------------- TAB: SETTINGS ----------------- */}
      {innerTab === "settings" && (
        <div className="space-y-8">
          
          {/* Success / Feedback Toast Banner */}
          {photoFeedbackMsg && (
            <div className="bg-emerald-600 text-white px-5 py-3.5 rounded-2xl shadow-md flex items-center justify-between animate-fade-in text-xs font-extrabold">
              <div className="flex items-center space-x-2">
                <Check className="h-4 w-4 bg-white/20 p-0.5 rounded-full" />
                <span>{photoFeedbackMsg}</span>
              </div>
              <button 
                onClick={() => setPhotoFeedbackMsg(null)}
                className="text-white/80 hover:text-white p-1 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Section 1: Profile Photo & Visual Branding */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <Camera className="h-5 w-5 text-blue-600" />
                  <span>{isIndonesian ? "Foto Profil & Visual Ruang Kerja" : "Profile Photo & Visual Branding"}</span>
                </h3>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  {isIndonesian 
                    ? "Unggah foto profil profesional berkualitas tinggi langsung dari perangkat Anda." 
                    : "Upload a high-resolution professional headshot directly from your local device."}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-xl border border-slate-100">
                  {isIndonesian ? "Maksimal 5MB (JPG, PNG, WebP)" : "Max 5MB (JPG, PNG, WebP)"}
                </span>
              </div>
            </div>

            {/* Visual Editor Grid */}
            <div className="grid lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Col: Current Photo Preview Card */}
              <div className="lg:col-span-4 bg-slate-50/80 rounded-2xl border border-slate-200/70 p-5 space-y-4">
                <div className="text-center space-y-3">
                  <div className="relative inline-block mx-auto">
                    <img 
                      src={getProfileAvatar(candidate.avatar)} 
                      alt={candidate.fullName} 
                      className="h-32 w-32 rounded-3xl object-cover border-4 border-white shadow-md ring-1 ring-slate-200 bg-white"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = DEFAULT_PROFILE_IMAGE;
                      }}
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      title={isIndonesian ? "Pilih berkas foto baru" : "Choose new photo file"}
                      className="absolute -bottom-2 -right-2 bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-2xl shadow-md border-2 border-white cursor-pointer transition-all hover:scale-105"
                    >
                      <Camera className="h-4 w-4" />
                    </button>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">{candidate.fullName}</h4>
                    <p className="text-[11px] text-slate-500 font-bold">{candidate.headline}</p>
                    <div className="mt-2 inline-flex items-center space-x-1 text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>
                        {!isDefaultAvatar(candidate.avatar)
                          ? (isIndonesian ? "Foto Khusus Terpasang" : "Custom Photo Active")
                          : (isIndonesian ? "Foto Profil Standar" : "Standard Default Photo")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Reset or Remove Option */}
                <div className="pt-3 border-t border-slate-200/70 flex flex-col gap-2">
                  <button
                    onClick={handleResetAvatar}
                    className="w-full py-2 px-3 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 cursor-pointer transition-all flex items-center justify-center space-x-1.5"
                  >
                    <RefreshCw className="h-3.5 w-3.5 text-slate-400" />
                    <span>{isIndonesian ? "Atur Ulang ke Foto Standar" : "Reset to Default Photo"}</span>
                  </button>
                </div>
              </div>

              {/* Right Col: Pure File Upload */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* File Upload (Drag & Drop or Browse) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                      {isIndonesian ? "Unggah Berkas Foto Profil" : "Upload Profile Headshot"}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">
                      {isIndonesian ? "JPG, PNG, WebP (Maks. 5MB)" : "JPG, PNG, WebP (Max 5MB)"}
                    </span>
                  </div>
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsDraggingAvatar(true); }}
                    onDragLeave={() => setIsDraggingAvatar(false)}
                    onDrop={handleAvatarDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-3 ${
                      isDraggingAvatar 
                        ? "border-blue-500 bg-blue-50/70 scale-[1.01]" 
                        : "border-slate-200 bg-slate-50/50 hover:bg-slate-100/50 hover:border-slate-300"
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png, image/jpeg, image/webp"
                      onChange={handleAvatarFileUpload}
                      className="hidden"
                    />
                    <div className="h-12 w-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-xs">
                      <Upload className="h-6 w-6" />
                    </div>
                    <div className="space-y-1 max-w-md">
                      <p className="text-sm font-extrabold text-slate-800">
                        {isIndonesian 
                          ? "Klik untuk telusuri foto atau seret & lepas gambar ke sini" 
                          : "Click to browse or drag and drop your photo here"}
                      </p>
                      <p className="text-xs text-slate-400 font-semibold">
                        {isIndonesian ? "Mendukung PNG, JPG, JPEG, WebP • Rekomendasi rasio 1:1 (persegi)" : "Supports PNG, JPG, JPEG, WebP • 1:1 square ratio recommended"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="mt-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      <span>{isIndonesian ? "Pilih Berkas dari Perangkat" : "Select File from Device"}</span>
                    </button>
                  </div>
                </div>

                {/* Cover Banner Customizer Section */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Image className="h-3.5 w-3.5 text-slate-500" />
                        <span>{isIndonesian ? "Gambar Sampul Ruang Kerja (Banner)" : "Workspace Header Cover Banner"}</span>
                      </span>
                      <p className="text-[11px] text-slate-400 font-medium">
                        {isIndonesian ? "Kustomisasi gambar latar belakang di atas profil Anda." : "Customize the hero background header shown on your profile."}
                      </p>
                    </div>
                    <button
                      onClick={() => coverFileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center space-x-1"
                    >
                      <Upload className="h-3 w-3" />
                      <span>{isIndonesian ? "Unggah Sampul" : "Upload Cover"}</span>
                    </button>
                    <input
                      ref={coverFileInputRef}
                      type="file"
                      accept="image/png, image/jpeg, image/webp"
                      onChange={handleCoverFileUpload}
                      className="hidden"
                    />
                  </div>

                  {/* Preset Covers row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {PRESET_COVERS.map((cov) => {
                      const isSelected = candidate.coverImage === cov.url;
                      return (
                        <button
                          key={cov.id}
                          onClick={() => {
                            onUpdateCandidate({ ...candidate, coverImage: cov.url });
                            setPhotoFeedbackMsg(isIndonesian ? "Gambar sampul berhasil diperbarui!" : "Header cover updated successfully!");
                            setTimeout(() => setPhotoFeedbackMsg(null), 4000);
                          }}
                          className={`h-14 rounded-xl overflow-hidden border-2 relative cursor-pointer group transition-all ${
                            isSelected ? "border-blue-600 ring-2 ring-blue-200" : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <img src={cov.url} alt={cov.name} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-slate-900/30 group-hover:bg-slate-900/10 flex items-end p-1.5 transition-all">
                            <span className="text-[9px] font-bold text-white truncate drop-shadow-sm">{cov.name}</span>
                          </div>
                          {isSelected && (
                            <div className="absolute top-1 right-1 bg-blue-600 text-white rounded-full p-0.5">
                              <Check className="h-3 w-3" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Section 2: Discoverability & Account Parameters */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">
                {isIndonesian ? "Parameter Visibilitas & Informasi Akun" : "Visibility Parameters & Account Information"}
              </h3>
              <p className="text-xs text-slate-500 font-semibold">
                {isIndonesian ? "Kelola visibilitas pencarian profil dan informasi kontak akun Anda." : "Manage your discoverability settings and contact credentials."}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 text-xs font-semibold text-slate-600">
              <div className="space-y-4">
                <h4 className="font-extrabold text-slate-900 text-sm">
                  {isIndonesian ? "Parameter Visibilitas & Ketersediaan" : "Discoverability Parameters"}
                </h4>
                
                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-200/50">
                  <div>
                    <span className="font-extrabold text-slate-800 block">
                      {isIndonesian ? "Status Terbuka untuk Bekerja (Open to Work)" : "Open to Work Toggle"}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {isIndonesian ? "Membuat profil Anda dapat ditemukan oleh semua perekrut perusahaan." : "Makes your profile searchable to all corporate recruiters."}
                    </span>
                  </div>
                  <button 
                    onClick={() => onUpdateCandidate({ ...candidate, openToWork: !candidate.openToWork })}
                    className={`px-3 py-1.5 rounded-xl font-bold text-[10px] uppercase tracking-wider cursor-pointer ${
                      candidate.openToWork ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {candidate.openToWork 
                      ? (isIndonesian ? "Aktif" : "Active") 
                      : (isIndonesian ? "Jeda" : "Paused")}
                  </button>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                    {isIndonesian ? "Rentang Ekspektasi Gaji" : "Expected Salary Range"}
                  </label>
                  <input 
                    type="text" 
                    value={candidate.expectedSalary} 
                    onChange={(e) => onUpdateCandidate({ ...candidate, expectedSalary: e.target.value })}
                    placeholder={isIndonesian ? "cth. Rp 25.000.000 - Rp 35.000.000 / bln" : "e.g. Rp 25.000.000 - Rp 35.000.000 / bln"}
                    className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 text-xs font-bold text-slate-800 focus:bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                    {isIndonesian ? "Status Ketersediaan" : "Availability Status"}
                  </label>
                  <select 
                    value={candidate.availability} 
                    onChange={(e) => onUpdateCandidate({ ...candidate, availability: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 text-xs font-bold text-slate-800 focus:bg-white"
                  >
                    <option value="Immediate">{isIndonesian ? "Segera Tersedia" : "Immediate Availability"}</option>
                    <option value="1 Month Notice">{isIndonesian ? "Notice 1 Bulan" : "1 Month Notice Period"}</option>
                    <option value="3 Months Notice">{isIndonesian ? "Notice 3 Bulan" : "3 Months Notice Period"}</option>
                    <option value="Flexible">{isIndonesian ? "Fleksibel / Terbuka Paruh Waktu" : "Flexible / Open to Part-time"}</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-extrabold text-slate-900 text-sm">
                  {isIndonesian ? "Informasi Kontak & Identitas" : "Contact & Identity Info"}
                </h4>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                    {isIndonesian ? "Nama Lengkap Profil" : "Profile Name"}
                  </label>
                  <input 
                    type="text" 
                    value={candidate.fullName} 
                    onChange={(e) => onUpdateCandidate({ ...candidate, fullName: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 text-xs font-bold text-slate-800 focus:bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                    {isIndonesian ? "Headline Profesional" : "Professional Headline"}
                  </label>
                  <input 
                    type="text" 
                    value={candidate.headline} 
                    onChange={(e) => onUpdateCandidate({ ...candidate, headline: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 text-xs font-bold text-slate-800 focus:bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                    {isIndonesian ? "Nomor Telepon / WhatsApp" : "Phone / WhatsApp Number"}
                  </label>
                  <input 
                    type="text" 
                    value={candidate.phone} 
                    onChange={(e) => onUpdateCandidate({ ...candidate, phone: e.target.value })}
                    placeholder="+62 811-XXXX-XXXX"
                    className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 text-xs font-bold text-slate-800 focus:bg-white"
                  />
                </div>

                <div className="pt-2">
                  <button 
                    onClick={() => {
                      setPhotoFeedbackMsg(isIndonesian ? "Parameter profil berhasil disimpan!" : "Profile parameters saved successfully!");
                      setTimeout(() => setPhotoFeedbackMsg(null), 4000);
                    }}
                    className="bg-slate-900 text-white font-bold px-5 py-3 rounded-xl hover:bg-slate-800 cursor-pointer shadow-sm transition-all"
                  >
                    {isIndonesian ? "Simpan Parameter Profil" : "Save Profile Parameters"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Priority 1 - Email Verification & Contact Status */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-blue-600" />
                  <span>{isIndonesian ? "Verifikasi Email & Lencana Kredibilitas" : "Email Verification & Credibility Badging"}</span>
                </h3>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  {isIndonesian 
                    ? "Alamat email terverifikasi meningkatkan skor ATS Anda dan memprioritaskan profil Anda pada pencarian HR." 
                    : "A verified email address boosts your ATS credibility score and prioritizes your profile in recruiter searches."}
                </p>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2 shrink-0">
                {isEmailVerified ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    <span>{isIndonesian ? "Email Terverifikasi" : "Email Verified"}</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-50 text-amber-700 border border-amber-200 shadow-xs">
                    <AlertCircle className="h-3.5 w-3.5 text-amber-600" />
                    <span>{isIndonesian ? "Belum Terverifikasi" : "Verification Pending"}</span>
                  </span>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-12 gap-6 items-start">
              {/* Left Column: Email Verification Control Card */}
              <div className="md:col-span-7 bg-slate-50/80 rounded-2xl border border-slate-200/70 p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="h-11 w-11 rounded-2xl bg-blue-100/80 text-blue-600 flex items-center justify-center shrink-0 shadow-xs">
                      <MailCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                        {isIndonesian ? "Alamat Email Utama" : "Primary Email Address"}
                      </span>
                      <span className="text-sm font-extrabold text-slate-900 break-all">{candidate.email}</span>
                    </div>
                  </div>

                  {/* Toggle status simulation for demo testing */}
                  <button
                    onClick={() => {
                      const nextStatus = !isEmailVerified;
                      onUpdateCandidate({ ...candidate, emailVerified: nextStatus });
                      setPhotoFeedbackMsg(
                        isIndonesian 
                          ? `Status verifikasi email diubah menjadi: ${nextStatus ? "Terverifikasi" : "Belum Terverifikasi"}`
                          : `Email status toggled to: ${nextStatus ? "Verified" : "Unverified"}`
                      );
                      setTimeout(() => setPhotoFeedbackMsg(null), 3000);
                    }}
                    title={isIndonesian ? "Klik untuk mensimulasikan status email" : "Toggle status simulation"}
                    className="text-[10px] font-bold text-slate-400 hover:text-slate-600 underline cursor-pointer shrink-0"
                  >
                    {isIndonesian ? "Uji Status" : "Toggle State"}
                  </button>
                </div>

                {/* Verification Action Box */}
                {!isEmailVerified ? (
                  <div className="bg-amber-500/10 border border-amber-200 rounded-2xl p-4 space-y-3">
                    <div className="flex items-start space-x-2.5">
                      <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                      <p className="text-xs font-semibold text-amber-900 leading-relaxed">
                        {isIndonesian
                          ? "Email Anda belum diverifikasi. Kirim kode verifikasi untuk mengonfirmasi kepemilikan akun."
                          : "Your email is pending verification. Request a one-time security code to verify your ownership."}
                      </p>
                    </div>

                    {!emailVerifyModalOpen ? (
                      <button
                        onClick={() => {
                          setEmailVerifyModalOpen(true);
                          handleSendVerificationEmail();
                        }}
                        disabled={isSendingOtp}
                        className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                      >
                        <Send className="h-3.5 w-3.5" />
                        <span>
                          {isSendingOtp 
                            ? (isIndonesian ? "Mengirim Kode..." : "Sending Code...") 
                            : (isIndonesian ? "Kirim Kode Verifikasi Email" : "Send Email Verification Code")}
                        </span>
                      </button>
                    ) : (
                      <div className="space-y-3 pt-1 border-t border-amber-200/60">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-extrabold text-amber-900 uppercase tracking-widest block">
                            {isIndonesian ? "Masukkan 6-Digit Kode Verifikasi" : "Enter 6-Digit Verification Code"}
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              maxLength={6}
                              value={inputOtpCode}
                              onChange={(e) => setInputOtpCode(e.target.value.replace(/\D/g, ""))}
                              placeholder="849201"
                              className="flex-1 border border-amber-300 rounded-xl px-3.5 py-2 bg-white text-sm font-extrabold text-center tracking-widest text-slate-900 focus:outline-amber-500"
                            />
                            <button
                              onClick={() => handleConfirmOtpCode()}
                              disabled={inputOtpCode.length < 6}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0"
                            >
                              {isIndonesian ? "Verifikasi" : "Verify"}
                            </button>
                          </div>
                        </div>

                        {otpError && (
                          <p className="text-[11px] font-bold text-rose-600">{otpError}</p>
                        )}

                        <div className="flex items-center justify-between text-[11px] font-bold text-amber-900 pt-1">
                          <button
                            onClick={() => handleConfirmOtpCode("849201")}
                            className="text-blue-600 hover:underline cursor-pointer"
                          >
                            {isIndonesian ? "Gunakan Kode Sampel (849201)" : "Use Sample Code (849201)"}
                          </button>

                          <button
                            onClick={handleSendVerificationEmail}
                            disabled={otpCooldown > 0 || isSendingOtp}
                            className="text-slate-500 hover:text-slate-800 disabled:opacity-50 cursor-pointer"
                          >
                            {otpCooldown > 0 
                              ? (isIndonesian ? `Kirim ulang (${otpCooldown}s)` : `Resend (${otpCooldown}s)`)
                              : (isIndonesian ? "Kirim Ulang Kode" : "Resend Code")}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-emerald-500/10 border border-emerald-200 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span className="text-xs font-extrabold text-emerald-900">
                        {isIndonesian ? "Status Keamanan: Terverifikasi Tingkat 1" : "Security Status: Tier 1 Verified"}
                      </span>
                    </div>
                    <p className="text-[11px] font-semibold text-emerald-800 leading-relaxed">
                      {isIndonesian 
                        ? "Email Anda telah terotentikasi. Semua undangan wawancara dan notifikasi resmi dikirimkan langsung ke kotak masuk ini." 
                        : "Your email is securely authenticated. Official interview requests and alerts are directly routed to your inbox."}
                    </p>
                  </div>
                )}
              </div>

              {/* Right Column: Credibility Highlights */}
              <div className="md:col-span-5 space-y-3">
                <div className="bg-white rounded-2xl border border-slate-200/70 p-4 space-y-2">
                  <div className="flex items-center space-x-2 text-slate-800">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <span className="text-xs font-extrabold">{isIndonesian ? "Keuntungan Akun Terverifikasi" : "Verified Account Benefits"}</span>
                  </div>
                  <ul className="text-[11px] font-semibold text-slate-500 space-y-1.5 pl-1">
                    <li className="flex items-center space-x-1.5">
                      <Check className="h-3 w-3 text-emerald-500 shrink-0" />
                      <span>{isIndonesian ? "Prioritas dalam pencarian talenta HR" : "Top priority in recruiter search index"}</span>
                    </li>
                    <li className="flex items-center space-x-1.5">
                      <Check className="h-3 w-3 text-emerald-500 shrink-0" />
                      <span>{isIndonesian ? "Lencana centang biru di profil publik" : "Blue verification badge on public profile"}</span>
                    </li>
                    <li className="flex items-center space-x-1.5">
                      <Check className="h-3 w-3 text-emerald-500 shrink-0" />
                      <span>{isIndonesian ? "Notifikasi real-time via email" : "Instant direct-to-inbox alerts"}</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-blue-50/60 rounded-2xl border border-blue-100 p-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold text-blue-500 uppercase tracking-wider block">
                      {isIndonesian ? "Skor Kredibilitas ATS" : "ATS Credibility Rating"}
                    </span>
                    <span className="text-sm font-extrabold text-blue-950">
                      {isEmailVerified ? "100% Terverifikasi" : "75% Parsial"}
                    </span>
                  </div>
                  <div className="h-9 w-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xs">
                    {isEmailVerified ? "A+" : "B"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Priority 2 - Notification Preferences */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Bell className="h-5 w-5 text-blue-600" />
                <span>{isIndonesian ? "Preferensi Notifikasi & Saluran Komunikasi" : "Notification & Communication Preferences"}</span>
              </h3>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                {isIndonesian 
                  ? "Atur jenis notifikasi email dan peringatan langsung yang ingin Anda terima dari platform." 
                  : "Choose which email notifications and direct alerts you would like to receive from the platform."}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Toggle 1: Interview Invitations */}
              <div className="p-4 rounded-2xl border border-slate-200/70 bg-slate-50/60 flex items-start justify-between gap-3 transition-all hover:bg-slate-50">
                <div className="flex items-start space-x-3">
                  <div className="h-9 w-9 rounded-xl bg-blue-100/70 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-slate-900 block">
                      {isIndonesian ? "Undangan Wawancara Resmi" : "Official Interview Invitations"}
                    </span>
                    <p className="text-[11px] text-slate-500 font-semibold leading-relaxed mt-0.5">
                      {isIndonesian 
                        ? "Pemberitahuan instan via email saat HR mengirim undangan jadwal interview." 
                        : "Instant email alert when a corporate recruiter schedules an interview."}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleNotification("interviewInvites")}
                  className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors shrink-0 ${
                    notificationPrefs.interviewInvites ? "bg-blue-600" : "bg-slate-300"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      notificationPrefs.interviewInvites ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Toggle 2: Direct Messages */}
              <div className="p-4 rounded-2xl border border-slate-200/70 bg-slate-50/60 flex items-start justify-between gap-3 transition-all hover:bg-slate-50">
                <div className="flex items-start space-x-3">
                  <div className="h-9 w-9 rounded-xl bg-purple-100/70 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Send className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-slate-900 block">
                      {isIndonesian ? "Pesan Langsung Perekrut (Direct Chat)" : "Direct Recruiter Chat Messages"}
                    </span>
                    <p className="text-[11px] text-slate-500 font-semibold leading-relaxed mt-0.5">
                      {isIndonesian 
                        ? "Notifikasi pesan obrolan langsung dari perekrut terakreditasi." 
                        : "Real-time notifications for direct conversations from verified HR."}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleNotification("directMessages")}
                  className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors shrink-0 ${
                    notificationPrefs.directMessages ? "bg-blue-600" : "bg-slate-300"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      notificationPrefs.directMessages ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Toggle 3: AI Smart Job Recommendations */}
              <div className="p-4 rounded-2xl border border-slate-200/70 bg-slate-50/60 flex items-start justify-between gap-3 transition-all hover:bg-slate-50">
                <div className="flex items-start space-x-3">
                  <div className="h-9 w-9 rounded-xl bg-amber-100/70 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Target className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-slate-900 block">
                      {isIndonesian ? "Rekomendasi Lowongan AI (>85% Match)" : "AI Smart Job Matches (>85% Match)"}
                    </span>
                    <p className="text-[11px] text-slate-500 font-semibold leading-relaxed mt-0.5">
                      {isIndonesian 
                        ? "Pemberitahuan otomatis lowongan baru dengan skor kecocokan keahlian tinggi." 
                        : "Alerts for new job openings highly matched to your skill profile."}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleNotification("jobRecommendations")}
                  className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors shrink-0 ${
                    notificationPrefs.jobRecommendations ? "bg-blue-600" : "bg-slate-300"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      notificationPrefs.jobRecommendations ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Toggle 4: Urgent Sourcing Pings */}
              <div className="p-4 rounded-2xl border border-slate-200/70 bg-slate-50/60 flex items-start justify-between gap-3 transition-all hover:bg-slate-50">
                <div className="flex items-start space-x-3">
                  <div className="h-9 w-9 rounded-xl bg-rose-100/70 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Activity className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-slate-900 block">
                      {isIndonesian ? "Perekrutan Mendesak (Urgent Hiring)" : "Urgent Sourcing & Fast-Track Alerts"}
                    </span>
                    <p className="text-[11px] text-slate-500 font-semibold leading-relaxed mt-0.5">
                      {isIndonesian 
                        ? "Pemberitahuan prioritas tinggi saat perusahaan membutuhkan kandidat segera." 
                        : "Priority alerts for fast-track immediate-start opportunities."}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleNotification("urgentSourcingAlerts")}
                  className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors shrink-0 ${
                    notificationPrefs.urgentSourcingAlerts ? "bg-blue-600" : "bg-slate-300"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      notificationPrefs.urgentSourcingAlerts ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Toggle 5: Weekly Career Digest (Full Width on Desktop) */}
              <div className="md:col-span-2 p-4 rounded-2xl border border-slate-200/70 bg-slate-50/60 flex items-start justify-between gap-3 transition-all hover:bg-slate-50">
                <div className="flex items-start space-x-3">
                  <div className="h-9 w-9 rounded-xl bg-emerald-100/70 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-slate-900 block">
                      {isIndonesian ? "Ringkasan Mingguan Pasar Kerja (Weekly Talent Digest)" : "Weekly Talent & Market Digest"}
                    </span>
                    <p className="text-[11px] text-slate-500 font-semibold leading-relaxed mt-0.5">
                      {isIndonesian 
                        ? "Laporan mingguan tentang tren gaji, statistik tayangan profil oleh HR, dan ringkasan lowongan terbaru." 
                        : "Weekly report on salary benchmarks, HR profile view metrics, and curated positions."}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleNotification("weeklyDigest")}
                  className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors shrink-0 ${
                    notificationPrefs.weeklyDigest ? "bg-blue-600" : "bg-slate-300"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      notificationPrefs.weeklyDigest ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Section 5: Priority 3 - Account Security & Change Password */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Lock className="h-5 w-5 text-blue-600" />
                <span>{isIndonesian ? "Keamanan Akun & Ubah Kata Sandi" : "Account Security & Change Password"}</span>
              </h3>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                {isIndonesian 
                  ? "Pastikan akun Anda terlindungi dengan kata sandi yang kuat dan belum pernah digunakan sebelumnya." 
                  : "Ensure your account is protected with a strong, unique password."}
              </p>
            </div>

            <form onSubmit={handleChangePasswordSubmit} className="max-w-2xl space-y-5">
              {/* Current Password */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                  {isIndonesian ? "Kata Sandi Saat Ini" : "Current Password"}
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 pr-10 bg-slate-50 text-xs font-bold text-slate-800 focus:bg-white focus:outline-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4 text-slate-400" />}
                  </button>
                </div>
              </div>

              {/* New Password + Strength Meter */}
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                  {isIndonesian ? "Kata Sandi Baru" : "New Password"}
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder={isIndonesian ? "Minimal 8 karakter unik..." : "At least 8 unique characters..."}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 pr-10 bg-slate-50 text-xs font-bold text-slate-800 focus:bg-white focus:outline-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4 text-slate-400" />}
                  </button>
                </div>

                {/* Strength Meter Bar */}
                {newPassword.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between text-[10px] font-extrabold">
                      <span className="text-slate-400 uppercase tracking-wider">
                        {isIndonesian ? "Kekuatan Kata Sandi:" : "Password Strength:"}
                      </span>
                      <span className={
                        passwordStrengthScore <= 1 ? "text-rose-600" :
                        passwordStrengthScore === 2 ? "text-amber-600" :
                        passwordStrengthScore === 3 ? "text-blue-600" : "text-emerald-600"
                      }>
                        {passwordStrengthScore <= 1 ? (isIndonesian ? "Lemah" : "Weak") :
                         passwordStrengthScore === 2 ? (isIndonesian ? "Sedang" : "Fair") :
                         passwordStrengthScore === 3 ? (isIndonesian ? "Kuat" : "Good") :
                         (isIndonesian ? "Sangat Kuat" : "Very Strong")}
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-1.5 h-1.5">
                      <div className={`rounded-full ${passwordStrengthScore >= 1 ? (passwordStrengthScore === 1 ? "bg-rose-500" : passwordStrengthScore === 2 ? "bg-amber-500" : passwordStrengthScore === 3 ? "bg-blue-500" : "bg-emerald-500") : "bg-slate-200"}`} />
                      <div className={`rounded-full ${passwordStrengthScore >= 2 ? (passwordStrengthScore === 2 ? "bg-amber-500" : passwordStrengthScore === 3 ? "bg-blue-500" : "bg-emerald-500") : "bg-slate-200"}`} />
                      <div className={`rounded-full ${passwordStrengthScore >= 3 ? (passwordStrengthScore === 3 ? "bg-blue-500" : "bg-emerald-500") : "bg-slate-200"}`} />
                      <div className={`rounded-full ${passwordStrengthScore >= 4 ? "bg-emerald-500" : "bg-slate-200"}`} />
                    </div>

                    {/* Criteria Badges */}
                    <div className="flex flex-wrap gap-2 pt-1 text-[10px] font-bold text-slate-500">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md ${newPassword.length >= 8 ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-400"}`}>
                        {newPassword.length >= 8 && <Check className="h-3 w-3" />}
                        {isIndonesian ? "8+ Karakter" : "8+ Chars"}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md ${/[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword) ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-400"}`}>
                        {/[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword) && <Check className="h-3 w-3" />}
                        {isIndonesian ? "Huruf Besar & Kecil" : "Upper & Lowercase"}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md ${/\d/.test(newPassword) ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-400"}`}>
                        {/\d/.test(newPassword) && <Check className="h-3 w-3" />}
                        {isIndonesian ? "Angka" : "Numbers"}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md ${/[^A-Za-z0-9]/.test(newPassword) ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-400"}`}>
                        {/[^A-Za-z0-9]/.test(newPassword) && <Check className="h-3 w-3" />}
                        {isIndonesian ? "Simbol" : "Symbols"}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm New Password */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                  {isIndonesian ? "Konfirmasi Kata Sandi Baru" : "Confirm New Password"}
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 pr-10 bg-slate-50 text-xs font-bold text-slate-800 focus:bg-white focus:outline-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4 text-slate-400" />}
                  </button>
                </div>
                {confirmPassword && newPassword && (
                  <p className={`text-[10px] font-bold ${newPassword === confirmPassword ? "text-emerald-600" : "text-rose-600"}`}>
                    {newPassword === confirmPassword 
                      ? (isIndonesian ? "✓ Kata sandi baru cocok" : "✓ Passwords match") 
                      : (isIndonesian ? "✕ Kata sandi belum cocok" : "✕ Passwords do not match")}
                  </p>
                )}
              </div>

              {/* Error Message */}
              {passwordError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-bold flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              {/* Success Message */}
              {passwordSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs font-bold flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{passwordSuccess}</span>
                </div>
              )}

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs cursor-pointer shadow-sm transition-all flex items-center space-x-2"
                >
                  <Key className="h-3.5 w-3.5" />
                  <span>{isIndonesian ? "Perbarui Kata Sandi" : "Update Password"}</span>
                </button>
              </div>
            </form>
          </div>

        </div>
      )}

      {/* [PAID_FEATURE_TOGGLE] Candidate Membership & Quota Upgrade Modal (Payment Checkout)
          Commented out for Free Trial. Uncomment below to re-enable paid checkout modal:
      <CandidatePlanModal
        isOpen={showPlanModal}
        onClose={() => setShowPlanModal(false)}
        candidate={candidate}
        onUpdateCandidate={onUpdateCandidate}
        isIndonesian={isIndonesian}
        onSuccessNotification={(msg) => {
          setQuotaToast(msg);
          setTimeout(() => setQuotaToast(null), 6000);
        }}
      />
      */}

      {/* Instructor Video Replay & Learning Archive Modal */}
      {selectedReplayTraining && (
        <InstructorVideoReplayModal
          isOpen={!!selectedReplayTraining}
          onClose={() => setSelectedReplayTraining(null)}
          training={selectedReplayTraining}
        />
      )}

    </div>
  );
}
