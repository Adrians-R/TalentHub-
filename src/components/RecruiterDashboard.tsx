/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from "react";
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Banknote, 
  Award, 
  ShieldCheck, 
  Bookmark, 
  Plus, 
  FileText, 
  Video, 
  Clock, 
  ArrowRight, 
  Send, 
  Check, 
  Inbox, 
  LineChart, 
  Filter, 
  HelpCircle,
  ExternalLink,
  Github,
  Linkedin,
  Calendar,
  X,
  Settings,
  Building2,
  User,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Camera,
  Upload,
  Image,
  RefreshCw,
  Eye,
  EyeOff,
  Lock,
  Bell,
  Shield,
  Mail,
  MailCheck,
  AlertCircle,
  AlertTriangle,
  Globe,
  KeyRound
} from "lucide-react";
import { 
  Candidate, 
  Recruiter, 
  Invitation, 
  Message,
  Skill,
  WorkExperience,
  DEFAULT_PROFILE_IMAGE,
  getProfileAvatar
} from "../types";
import SearchTalentView from "./search/SearchTalentView";
import RecruiterJobManagementView from "./RecruiterJobManagementView";
import { useLanguage } from "../context/LanguageContext";

interface RecruiterDashboardProps {
  recruiter: Recruiter;
  candidates: Candidate[];
  invitations: Invitation[];
  onSendInvitation: (invitation: Omit<Invitation, "id" | "createdAt" | "status">) => void;
  messages: Message[];
  onSendMessage: (invitationId: string, content: string) => void;
  onUpdateCandidate: (updated: Candidate) => void;
  initialSearchSkill?: string;
  onUpdateRecruiter?: (updated: Recruiter) => void;
}

export default function RecruiterDashboard({
  recruiter,
  candidates,
  invitations,
  onSendInvitation,
  messages,
  onSendMessage,
  onUpdateCandidate,
  initialSearchSkill = "",
  onUpdateRecruiter,
}: RecruiterDashboardProps) {
  const { isIndonesian, formatCurrency } = useLanguage();
  const [subTab, setSubTab] = useState<string>("dashboard");

  const [profileLocation, setProfileLocation] = useState(recruiter ? recruiter.location : "");
  const [profileFullName, setProfileFullName] = useState(recruiter ? recruiter.fullName : "");
  const [profileAvatar, setProfileAvatar] = useState(recruiter ? (recruiter.avatar || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300&h=300") : "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300&h=300");
  const [profileCompanyLogo, setProfileCompanyLogo] = useState(recruiter ? recruiter.companyLogo : "");
  const [profileHrJobTitle, setProfileHrJobTitle] = useState(recruiter ? (recruiter.hrJobTitle || "Talent Acquisition Lead") : "Talent Acquisition Lead");
  const [profilePhone, setProfilePhone] = useState(recruiter ? (recruiter.phone || "") : "");
  const [profileCompanyWebsite, setProfileCompanyWebsite] = useState(recruiter ? (recruiter.companyWebsite || "") : "");
  const [profileCompanySize, setProfileCompanySize] = useState(recruiter ? (recruiter.companySize || "51-200 Karyawan") : "51-200 Karyawan");
  const [profileCompanyReg, setProfileCompanyReg] = useState(recruiter ? (recruiter.companyRegistrationNumber || "") : "");
  const [profileHrLinkedIn, setProfileHrLinkedIn] = useState(recruiter ? (recruiter.hrLinkedInUrl || "") : "");
  const [profileCompanyLinkedIn, setProfileCompanyLinkedIn] = useState(recruiter ? (recruiter.companyLinkedInUrl || "") : "");
  const [profileCompanyIdDoc, setProfileCompanyIdDoc] = useState(recruiter ? (recruiter.companyIdDocName || "") : "");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [recruiterPhotoFeedbackMsg, setRecruiterPhotoFeedbackMsg] = useState<string | null>(null);
  const [isDraggingRecruiterAvatar, setIsDraggingRecruiterAvatar] = useState(false);
  const [isDraggingCompanyLogo, setIsDraggingCompanyLogo] = useState(false);
  
  // Helper to validate email format
  const isValidEmailFormat = (emailStr: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(emailStr.trim());
  };

  // Helper to detect if email domain is generic free (e.g. Gmail/Yahoo) vs corporate
  const isGenericFreeEmail = (emailStr: string): boolean => {
    const genericDomains = [
      "gmail.com", "yahoo.com", "yahoo.co.id", "hotmail.com", "outlook.com", 
      "live.com", "icloud.com", "aol.com", "mail.com", "proton.me", "protonmail.com"
    ];
    const parts = emailStr.trim().toLowerCase().split("@");
    if (parts.length < 2) return false;
    const domain = parts[1];
    return genericDomains.includes(domain);
  };

  // HR Work Email Validation & Verification State
  const [hrEmail, setHrEmail] = useState(recruiter ? recruiter.email : "");
  const [editHrEmail, setEditHrEmail] = useState(recruiter ? recruiter.email : "");
  const [isEditingHrEmail, setIsEditingHrEmail] = useState(false);
  const [isHrEmailVerified, setIsHrEmailVerified] = useState(recruiter?.emailVerified !== false);
  const [hrEmailError, setHrEmailError] = useState<string | null>(null);
  const [hrEmailOtpModalOpen, setHrEmailOtpModalOpen] = useState(false);
  const [inputHrEmailOtp, setInputHrEmailOtp] = useState("");
  const [isSendingHrEmailOtp, setIsSendingHrEmailOtp] = useState(false);
  const [generatedHrEmailOtp, setGeneratedHrEmailOtp] = useState("849201");
  const [hrEmailFeedbackMsg, setHrEmailFeedbackMsg] = useState<{ text: string; isError: boolean } | null>(null);

  const handleSendHrEmailVerification = () => {
    const targetEmail = isEditingHrEmail ? editHrEmail.trim() : hrEmail.trim();
    if (!targetEmail) {
      setHrEmailError(isIndonesian ? "Alamat email tidak boleh kosong." : "Email address cannot be empty.");
      return;
    }
    if (!isValidEmailFormat(targetEmail)) {
      setHrEmailError(isIndonesian ? "Format email tidak valid (contoh: name@company.co.id)." : "Invalid email format (e.g. name@company.co.id).");
      return;
    }
    setHrEmailError(null);
    setIsSendingHrEmailOtp(true);
    setTimeout(() => {
      setIsSendingHrEmailOtp(false);
      setHrEmailOtpModalOpen(true);
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedHrEmailOtp(code);
      setHrEmailFeedbackMsg({
        text: isIndonesian 
          ? `Kode verifikasi 6 digit telah dikirimkan ke ${targetEmail}!`
          : `6-digit verification code sent to ${targetEmail}!`,
        isError: false
      });
      setTimeout(() => setHrEmailFeedbackMsg(null), 5000);
    }, 700);
  };

  const handleConfirmHrEmailOtp = () => {
    if (inputHrEmailOtp.trim().length !== 6 || (generatedHrEmailOtp && inputHrEmailOtp.trim() !== generatedHrEmailOtp)) {
      setHrEmailFeedbackMsg({
        text: isIndonesian ? "Kode verifikasi tidak valid. Silakan coba lagi." : "Invalid verification code. Please try again.",
        isError: true
      });
      return;
    }
    const finalEmail = isEditingHrEmail ? editHrEmail.trim() : hrEmail.trim();
    setHrEmail(finalEmail);
    setIsHrEmailVerified(true);
    setIsEditingHrEmail(false);
    setHrEmailOtpModalOpen(false);
    setInputHrEmailOtp("");
    if (onUpdateRecruiter && recruiter) {
      onUpdateRecruiter({
        ...recruiter,
        email: finalEmail,
        emailVerified: true,
        hrVerified: true,
      });
    }
    setHrEmailFeedbackMsg({
      text: isIndonesian 
        ? "Email kerja resmi HR berhasil diverifikasi! Lencana akun HR terverifikasi telah aktif." 
        : "Official HR work email successfully verified! Verified HR badge is now active.",
      isError: false
    });
    setTimeout(() => setHrEmailFeedbackMsg(null), 5000);
  };

  const handleSaveHrEmail = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = editHrEmail.trim();
    if (!trimmed) {
      setHrEmailError(isIndonesian ? "Alamat email kerja tidak boleh kosong." : "Work email address cannot be empty.");
      return;
    }
    if (!isValidEmailFormat(trimmed)) {
      setHrEmailError(isIndonesian ? "Format email tidak valid (contoh: hr.officer@perusahaan.co.id)." : "Invalid email format (e.g. hr.officer@company.co.id).");
      return;
    }
    setHrEmailError(null);
    const emailChanged = trimmed !== hrEmail;
    setHrEmail(trimmed);
    setIsEditingHrEmail(false);
    const nextVerified = emailChanged ? false : isHrEmailVerified;
    if (emailChanged) {
      setIsHrEmailVerified(false);
    }
    if (onUpdateRecruiter && recruiter) {
      onUpdateRecruiter({
        ...recruiter,
        email: trimmed,
        emailVerified: nextVerified,
      });
    }
    setHrEmailFeedbackMsg({
      text: isIndonesian
        ? emailChanged
          ? "Alamat email kerja berhasil diperbarui. Silakan lakukan verifikasi email untuk mengaktifkan lencana."
          : "Alamat email kerja berhasil disimpan."
        : emailChanged
          ? "Work email updated. Please verify your new email to activate credibility badge."
          : "Work email saved successfully.",
      isError: false
    });
    setTimeout(() => setHrEmailFeedbackMsg(null), 4500);
  };

  const handleToggleHrEmailVerificationStatus = () => {
    const nextStatus = !isHrEmailVerified;
    setIsHrEmailVerified(nextStatus);
    if (onUpdateRecruiter && recruiter) {
      onUpdateRecruiter({
        ...recruiter,
        emailVerified: nextStatus,
        hrVerified: nextStatus ? true : recruiter.hrVerified,
      });
    }
    setHrEmailFeedbackMsg({
      text: isIndonesian 
        ? `Status verifikasi email diubah menjadi: ${nextStatus ? "Terverifikasi" : "Belum Terverifikasi"}`
        : `Email verification status toggled to: ${nextStatus ? "Verified" : "Unverified"}`,
      isError: false
    });
    setTimeout(() => setHrEmailFeedbackMsg(null), 3000);
  };
  
  // Password & Security state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordFeedbackMsg, setPasswordFeedbackMsg] = useState<{ text: string; isError: boolean } | null>(null);

  // Notification Preferences state
  const [notifyInterviewAccepts, setNotifyInterviewAccepts] = useState(true);
  const [notifyCandidateMessages, setNotifyCandidateMessages] = useState(true);
  const [notifyWeeklyDigest, setNotifyWeeklyDigest] = useState(false);
  const [notifyNewApplications, setNotifyNewApplications] = useState(true);
  const [notifyFeedbackMsg, setNotifyFeedbackMsg] = useState<string | null>(null);

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword.trim()) {
      setPasswordFeedbackMsg({
        text: isIndonesian ? "Harap masukkan kata sandi saat ini." : "Please enter your current password.",
        isError: true,
      });
      return;
    }
    if (newPassword.length < 8) {
      setPasswordFeedbackMsg({
        text: isIndonesian ? "Kata sandi baru minimal harus 8 karakter." : "New password must be at least 8 characters.",
        isError: true,
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordFeedbackMsg({
        text: isIndonesian ? "Konfirmasi kata sandi baru tidak cocok." : "Password confirmation does not match.",
        isError: true,
      });
      return;
    }
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordFeedbackMsg({
      text: isIndonesian ? "Kata sandi akun HR berhasil diperbarui!" : "HR account password updated successfully!",
      isError: false,
    });
    setTimeout(() => setPasswordFeedbackMsg(null), 4500);
  };

  const handleSaveNotificationPreferences = () => {
    setNotifyFeedbackMsg(isIndonesian ? "Preferensi notifikasi perekrutan berhasil disimpan!" : "Recruitment notification preferences saved successfully!");
    setTimeout(() => setNotifyFeedbackMsg(null), 4000);
  };

  const recruiterFileInputRef = useRef<HTMLInputElement>(null);
  const companyLogoFileInputRef = useRef<HTMLInputElement>(null);

  const handleRecruiterAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        setProfileAvatar(resultUrl);
        if (onUpdateRecruiter && recruiter) {
          onUpdateRecruiter({ ...recruiter, avatar: resultUrl });
        }
        setRecruiterPhotoFeedbackMsg(isIndonesian ? "Foto profil HR berhasil diperbarui!" : "HR profile photo updated successfully!");
        setTimeout(() => setRecruiterPhotoFeedbackMsg(null), 4000);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRecruiterAvatarDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingRecruiterAvatar(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert(isIndonesian ? "Harap pilih file gambar (JPG, PNG, WebP)." : "Please select an image file (JPG, PNG, WebP).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert(isIndonesian ? "Ukuran file gambar maksimal 5MB." : "Maximum image file size is 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const resultUrl = event.target?.result as string;
      if (resultUrl) {
        setProfileAvatar(resultUrl);
        if (onUpdateRecruiter && recruiter) {
          onUpdateRecruiter({ ...recruiter, avatar: resultUrl });
        }
        setRecruiterPhotoFeedbackMsg(isIndonesian ? "Foto profil HR berhasil diperbarui!" : "HR profile photo updated successfully!");
        setTimeout(() => setRecruiterPhotoFeedbackMsg(null), 4000);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetRecruiterAvatar = () => {
    const defaultAvatar = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300&h=300";
    setProfileAvatar(defaultAvatar);
    if (onUpdateRecruiter && recruiter) {
      onUpdateRecruiter({ ...recruiter, avatar: defaultAvatar });
    }
    setRecruiterPhotoFeedbackMsg(isIndonesian ? "Foto profil HR diatur ulang ke default." : "HR profile photo reset to default.");
    setTimeout(() => setRecruiterPhotoFeedbackMsg(null), 4000);
  };

  const handleCompanyLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        setProfileCompanyLogo(resultUrl);
        if (onUpdateRecruiter && recruiter) {
          onUpdateRecruiter({ ...recruiter, companyLogo: resultUrl });
        }
        setRecruiterPhotoFeedbackMsg(isIndonesian ? "Logo perusahaan berhasil diperbarui!" : "Company logo updated successfully!");
        setTimeout(() => setRecruiterPhotoFeedbackMsg(null), 4000);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCompanyLogoDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingCompanyLogo(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert(isIndonesian ? "Harap pilih file gambar (JPG, PNG, WebP)." : "Please select an image file (JPG, PNG, WebP).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert(isIndonesian ? "Ukuran file gambar maksimal 5MB." : "Maximum image file size is 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const resultUrl = event.target?.result as string;
      if (resultUrl) {
        setProfileCompanyLogo(resultUrl);
        if (onUpdateRecruiter && recruiter) {
          onUpdateRecruiter({ ...recruiter, companyLogo: resultUrl });
        }
        setRecruiterPhotoFeedbackMsg(isIndonesian ? "Logo perusahaan berhasil diperbarui!" : "Company logo updated successfully!");
        setTimeout(() => setRecruiterPhotoFeedbackMsg(null), 4000);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetCompanyLogo = () => {
    const defaultLogo = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=100&h=100";
    setProfileCompanyLogo(defaultLogo);
    if (onUpdateRecruiter && recruiter) {
      onUpdateRecruiter({ ...recruiter, companyLogo: defaultLogo });
    }
    setRecruiterPhotoFeedbackMsg(isIndonesian ? "Logo perusahaan diatur ulang ke default." : "Company logo reset to default.");
    setTimeout(() => setRecruiterPhotoFeedbackMsg(null), 4000);
  };

  // Sub-tabs scroll state & affordance tracking
  const tabsScrollRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftPos, setScrollLeftPos] = useState(0);

  const checkTabsScroll = React.useCallback(() => {
    const el = tabsScrollRef.current;
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
    const timer = setTimeout(checkTabsScroll, 50);
    const el = tabsScrollRef.current;
    
    let observer: ResizeObserver | null = null;
    if (el && typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(() => {
        checkTabsScroll();
      });
      observer.observe(el);
    }

    window.addEventListener("resize", checkTabsScroll);
    return () => {
      clearTimeout(timer);
      if (observer) observer.disconnect();
      window.removeEventListener("resize", checkTabsScroll);
    };
  }, [checkTabsScroll, subTab]);

  const handleTabsScroll = (direction: "left" | "right") => {
    if (!tabsScrollRef.current) return;
    const amount = direction === "left" ? -280 : 280;
    tabsScrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    setTimeout(checkTabsScroll, 320);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!tabsScrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - tabsScrollRef.current.offsetLeft);
    setScrollLeftPos(tabsScrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !tabsScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - tabsScrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    tabsScrollRef.current.scrollLeft = scrollLeftPos - walk;
    checkTabsScroll();
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const handleSelectTab = (tabId: string) => {
    setSubTab(tabId);
    setTimeout(() => {
      const btn = document.getElementById(`recruiter-sub-tab-btn-${tabId}`);
      btn?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      checkTabsScroll();
    }, 50);
  };

  React.useEffect(() => {
    if (recruiter) {
      setProfileLocation(recruiter.location);
      setProfileFullName(recruiter.fullName);
      setProfileCompanyLogo(recruiter.companyLogo);
      setProfileHrJobTitle(recruiter.hrJobTitle || "Talent Acquisition Lead");
      setProfilePhone(recruiter.phone || "");
      setProfileCompanyWebsite(recruiter.companyWebsite || "");
      setProfileCompanySize(recruiter.companySize || "51-200 Karyawan");
      setProfileCompanyReg(recruiter.companyRegistrationNumber || "");
      setProfileHrLinkedIn(recruiter.hrLinkedInUrl || "");
      setProfileCompanyLinkedIn(recruiter.companyLinkedInUrl || "");
      setProfileCompanyIdDoc(recruiter.companyIdDocName || "");
    }
  }, [recruiter]);

  // Filter States
  const [searchSkill, setSearchSkill] = useState(initialSearchSkill);

  // Sync initialSearchSkill if updated from landing search
  React.useEffect(() => {
    if (initialSearchSkill) {
      setSearchSkill(initialSearchSkill);
      setSubTab("search");
    }
  }, [initialSearchSkill]);
  const [filterLocation, setFilterLocation] = useState("");
  const [filterVerified, setFilterVerified] = useState(false);
  const [filterOpenToWork, setFilterOpenToWork] = useState(true);
  const [filterSalaryMin, setFilterSalaryMin] = useState<number | "">("");
  const [filterExpMin, setFilterExpMin] = useState<number | "">("");

  // Saved/Bookmarked Candidates
  const [savedCandidateIds, setSavedCandidateIds] = useState<string[]>(recruiter.savedCandidateIds);

  // Active Selected Candidate Profile details modal
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  // Invitation Modal Form State
  const [invitingCandidate, setInvitingCandidate] = useState<Candidate | null>(null);
  const [invitePosition, setInvitePosition] = useState("Software Engineer II (React/TypeScript)");
  const [inviteSalary, setInviteSalary] = useState(isIndonesian ? "Rp 25.000.000 / bulan" : "Rp 25.000.000 / month");
  const [inviteMessage, setInviteMessage] = useState(
    isIndonesian 
      ? "Halo, kami telah memeriksa portofolio terverifikasi Anda dan sangat terkesan dengan proyek teknik Anda. Kami ingin mengundang Anda untuk wawancara langsung."
      : "Hi, we checked your verified portfolio and we are extremely excited about your engineering projects. We'd love to schedule a discovery conversation."
  );
  const [inviteMeetLink, setInviteMeetLink] = useState("");
  const [inviteDate, setInviteDate] = useState("2026-07-22T14:30");

  React.useEffect(() => {
    setInviteSalary(isIndonesian ? "Rp 25.000.000 / bulan" : "Rp 25.000.000 / month");
    setInviteMessage(
      isIndonesian 
        ? "Halo, kami telah memeriksa portofolio terverifikasi Anda dan sangat terkesan dengan proyek teknik Anda. Kami ingin mengundang Anda untuk wawancara langsung."
        : "Hi, we checked your verified portfolio and we are extremely excited about your engineering projects. We'd love to schedule a discovery conversation."
    );
  }, [isIndonesian]);

  // Inbox active conversation
  const recruiterInvitations = invitations.filter(i => i.recruiterId === recruiter.id);
  const [activeInboxInvitationId, setActiveInboxInvitationId] = useState<string | null>(
    recruiterInvitations.length > 0 ? recruiterInvitations[0].id : null
  );
  const [chatInput, setChatInput] = useState("");

  const handleToggleBookmark = (candId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (savedCandidateIds.includes(candId)) {
      setSavedCandidateIds(savedCandidateIds.filter(id => id !== candId));
    } else {
      setSavedCandidateIds([...savedCandidateIds, candId]);
    }
  };

  const handleSendInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invitingCandidate) return;

    if (!inviteMeetLink.trim()) {
      alert(isIndonesian 
        ? "Tautan Google Meet wajib dibuat dan diisi secara manual oleh perwakilan HR."
        : "Google Meet link must be manually generated and provided by HR.");
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
      salaryOffer: inviteSalary,
      interviewLink: inviteMeetLink.trim(),
      scheduledDate: inviteDate || undefined,
    });

    setInvitingCandidate(null);
    setInviteMeetLink("");
    alert(isIndonesian ? `Berhasil! Undangan wawancara telah dikirim langsung ke ${invitingCandidate.fullName}!` : `Success! Pitch Invitation sent directly to ${invitingCandidate.fullName}!`);
  };

  const handleSendMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeInboxInvitationId) return;
    onSendMessage(activeInboxInvitationId, chatInput.trim());
    setChatInput("");
  };

  // Filtering Logic
  const filteredCandidates = candidates.filter((cand) => {
    // 1. Skill keyword match (either skill name or category)
    if (searchSkill) {
      const match = cand.skills.some((s) => s.name.toLowerCase().includes(searchSkill.toLowerCase()));
      if (!match) return false;
    }
    // 2. Location match
    if (filterLocation && !cand.location.toLowerCase().includes(filterLocation.toLowerCase())) {
      return false;
    }
    // 3. Verified only filter
    if (filterVerified && !cand.verified) {
      return false;
    }
    // 4. Open to work filter
    if (filterOpenToWork && !cand.openToWork) {
      return false;
    }
    // 5. Min experience filter
    if (filterExpMin !== "") {
      const maxExp = Math.max(0, ...cand.skills.map((s) => s.yearsOfExperience), ...cand.experience.map(() => 1));
      if (maxExp < Number(filterExpMin)) return false;
    }
    return true;
  });

  const activeInboxInvitation = invitations.find(i => i.id === activeInboxInvitationId);
  const activeInboxMessages = messages.filter(m => m.invitationId === activeInboxInvitationId);

  // Pipeline Stats
  const pipelineStats = [
    { 
      title: isIndonesian ? "Profil Terindeks" : "Sourced Profiles", 
      count: candidates.length, 
      desc: isIndonesian ? "Kandidat dalam basis data" : "Indexed database matches" 
    },
    { 
      title: isIndonesian ? "Tawaran Terkirim" : "Active Pitches Sent", 
      count: recruiterInvitations.length, 
      desc: isIndonesian ? "Proposal wawancara dikirim" : "Interview proposals dispatched" 
    },
    { 
      title: isIndonesian ? "Wawancara Dijadwalkan" : "Interviews Scheduled", 
      count: recruiterInvitations.filter(i => i.status === "scheduled").length, 
      desc: isIndonesian ? "Ruang Google Meet disiapkan" : "Google Meet rooms reserved" 
    },
    { 
      title: isIndonesian ? "Tawaran Diterima" : "Offers Accepted", 
      count: recruiterInvitations.filter(i => i.status === "accepted").length, 
      desc: isIndonesian ? "Talenta siap bergabung" : "Candidates secured" 
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="recruiter-workspace">
      
      {/* Top Banner Recruiter Details Card */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <img
            src={recruiter.companyLogo}
            alt={recruiter.companyName}
            className="h-16 w-16 rounded-2xl object-cover border border-slate-150 shrink-0 bg-slate-50"
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900 truncate">
                {recruiter.companyName}
              </h1>
              {/* [PAID_FEATURE_TOGGLE] In Free Trial mode, tier badge shows Free Trial Access. Uncomment below to restore tier badge:
              <span className="text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                {recruiter.subscriptionTier} {isIndonesian ? "Tier" : "tier"}
              </span>
              */}
              <span className="inline-flex items-center space-x-1 text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{isIndonesian ? "Free Trial (Akses Penuh)" : "Free Trial (Full Access)"}</span>
              </span>
              {recruiter.hrVerificationStatus === "verified" || recruiter.hrVerificationTier === "verified_domain" || recruiter.hrVerificationTier === "verified_admin" || (recruiter.hrVerified && recruiter.hrVerificationStatus !== "pending_review") ? (
                <span className="inline-flex items-center space-x-1 text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full shadow-2xs">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>
                    {recruiter.hrVerificationTier === "verified_domain" 
                      ? (isIndonesian ? "HR Terverifikasi (Domain Kantor)" : "HR Verified (Work Domain)")
                      : (isIndonesian ? "HR Terakreditasi (Super Admin)" : "HR Accredited (Super Admin)")}
                  </span>
                </span>
              ) : (
                <span className="inline-flex items-center space-x-1 text-[10px] font-extrabold bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full shadow-2xs">
                  <Clock className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                  <span>{isIndonesian ? "Verifikasi Ditinjau" : "HR Review Pending"}</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              {recruiter.location} • {isIndonesian ? "Perwakilan HR:" : "HR Representative:"} <span className="text-slate-800 font-bold">{recruiter.fullName}</span> ({recruiter.hrJobTitle || (isIndonesian ? "Lead Rekruter" : "Talent Lead")})
            </p>
            <p className="text-xs text-slate-400 font-medium mt-1">
              {isIndonesian ? "Portal Perekrutan: Mesin Penemuan & Penjadwalan Wawancara Talenta" : "Recruiting Portal: Active Talent Sourcing & Interview Pipeline"}
            </p>
          </div>
        </div>

        {/* Quick Access Badges on Header */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-start md:justify-end shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
          <div className="bg-slate-50 border border-slate-150/80 px-3 py-2 rounded-2xl text-center">
            <span className="text-[9px] uppercase font-extrabold text-slate-400 block tracking-wider">
              {isIndonesian ? "Kandidat Disimpan" : "Saved"}
            </span>
            <span className="text-xs font-black text-slate-800">{savedCandidateIds.length}</span>
          </div>
          <div className="bg-slate-50 border border-slate-150/80 px-3 py-2 rounded-2xl text-center">
            <span className="text-[9px] uppercase font-extrabold text-slate-400 block tracking-wider">
              {isIndonesian ? "Undangan Aktif" : "Invites"}
            </span>
            <span className="text-xs font-black text-blue-600">{recruiterInvitations.length}</span>
          </div>
          <div className="bg-slate-50 border border-slate-150/80 px-3 py-2 rounded-2xl text-center">
            <span className="text-[9px] uppercase font-extrabold text-slate-400 block tracking-wider">
              {isIndonesian ? "Talenta Terverifikasi" : "Verified Pool"}
            </span>
            <span className="text-xs font-black text-emerald-600">{candidates.filter(c => c.verified).length}</span>
          </div>
        </div>
      </div>

      {/* Dedicated Full-Width Navigation Bar with Horizontal Scroll Affordances */}
      <div className="relative mb-8 bg-white p-2.5 rounded-2xl border border-slate-200/80 shadow-xs group">
        <div className="relative flex items-center">
          {/* Left Scroll Trigger Button */}
          {canScrollLeft && (
            <button
              type="button"
              onClick={() => handleTabsScroll("left")}
              aria-label="Scroll left"
              className="absolute left-1 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-xl bg-white/95 backdrop-blur-xs border border-slate-200 text-slate-700 shadow-md flex items-center justify-center hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 cursor-pointer transition-all hover:scale-105 active:scale-95"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}

          {/* Left Edge Gradient Fade */}
          {canScrollLeft && (
            <div className="absolute left-0 top-0 bottom-0 w-14 bg-gradient-to-r from-white via-white/90 to-transparent pointer-events-none rounded-l-2xl z-10" />
          )}

          {/* Horizontal Scrollable Tabs Container */}
          <div
            ref={tabsScrollRef}
            onScroll={checkTabsScroll}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            className={`flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-1 px-1 scroll-smooth w-full select-none ${
              isDragging ? "cursor-grabbing" : hasOverflow ? "cursor-grab" : "cursor-default"
            }`}
          >
            {[
              { id: "dashboard", label: isIndonesian ? "Dasbor" : "Dashboard", icon: Clock },
              { id: "jobs", label: isIndonesian ? "Lowongan & Pelamar" : "Jobs & Applicants", icon: Briefcase },
              { id: "search", label: isIndonesian ? "Cari Talenta" : "Search Talent", icon: Search },
              { id: "saved", label: isIndonesian ? "Kandidat Tersimpan" : "Saved Candidates", icon: Bookmark, badge: savedCandidateIds.length },
              { id: "invitations", label: isIndonesian ? "Undangan & Pesan" : "Invitations", icon: Inbox, badge: recruiterInvitations.length },
              { id: "profile", label: isIndonesian ? "Profil Perusahaan" : "Company Profile", icon: Building2 },
              { id: "analytics", label: isIndonesian ? "Analitik" : "Analytics", icon: LineChart },
              // [PAID_FEATURE_TOGGLE] Paid billing & plan tab commented out for Free Trial period. Uncomment below to restore:
              // { id: "billing", label: isIndonesian ? "Paket & Tagihan" : "Billing & Plan", icon: Banknote },
              { id: "settings", label: isIndonesian ? "Pengaturan Akun" : "Settings", icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = subTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`recruiter-sub-tab-btn-${tab.id}`}
                  onClick={() => handleSelectTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                    active 
                      ? "bg-blue-600 text-white shadow-xs font-extrabold ring-2 ring-blue-600/20" 
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${active ? "text-white" : "text-slate-400"}`} />
                  <span>{tab.label}</span>
                  {typeof tab.badge === "number" && tab.badge > 0 && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black leading-tight ${
                      active ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
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
            <div className="absolute right-0 top-0 bottom-0 w-14 bg-gradient-to-l from-white via-white/90 to-transparent pointer-events-none rounded-r-2xl z-10" />
          )}

          {/* Right Scroll Trigger Button */}
          {canScrollRight && (
            <button
              type="button"
              onClick={() => handleTabsScroll("right")}
              aria-label="Scroll right"
              className="absolute right-1 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-xl bg-white/95 backdrop-blur-xs border border-slate-200 text-slate-700 shadow-md flex items-center justify-center hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 cursor-pointer transition-all hover:scale-105 active:scale-95"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Horizontal Scroll Track Progress Indicator */}
        {hasOverflow && (
          <div className="w-full bg-slate-100 h-1 rounded-full mt-2 overflow-hidden px-1">
            <div 
              className="bg-blue-500 h-full rounded-full transition-all duration-150"
              style={{
                width: `${Math.max(15, 100 * (tabsScrollRef.current ? tabsScrollRef.current.clientWidth / tabsScrollRef.current.scrollWidth : 0.3))}%`,
                transform: `translateX(${(scrollProgress * (100 - Math.max(15, 100 * (tabsScrollRef.current ? tabsScrollRef.current.clientWidth / tabsScrollRef.current.scrollWidth : 0.3)))) / 100}%)`,
              }}
            />
          </div>
        )}
      </div>

      {/* ----------------- SUB TAB: DASHBOARD OVERVIEW ----------------- */}
      {subTab === "dashboard" && (
        <div className="space-y-8" id="recruiter-overview-panel">
          {/* Quick Metrics */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pipelineStats.map((stat, i) => (
              <div key={i} className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">{stat.title}</span>
                <span className="text-3xl font-extrabold text-slate-900 block mt-2">{stat.count}</span>
                <span className="text-xs text-slate-500 font-semibold block mt-1.5">{stat.desc}</span>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
              {/* Sourcing Overview Banner */}
              <div className="bg-slate-900 text-white p-6 rounded-3xl relative overflow-hidden border border-slate-800">
                <div className="space-y-2 max-w-lg">
                  <span className="inline-block text-[9px] font-black uppercase tracking-widest bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-1 rounded">
                    {isIndonesian ? "Mesin Perekrutan Aktif" : "Active Sourcing Engine"}
                  </span>
                  <h3 className="text-base font-extrabold">
                    {isIndonesian ? "Penemuan Cepat & Talenta Terverifikasi" : "Instant Discovery & Verified Leads"}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                    {isIndonesian 
                      ? "Basis data kandidat kami terverifikasi secara ketat berdasarkan sertifikat dan portofolio teknis nyata. Temukan, saring, dan kirim undangan wawancara dengan mudah."
                      : "Our candidate database relies strictly on government-verified certificates and bootcamps, ensuring high quality profile score filters. Discover, screen, and send pitch invitations seamlessly."}
                  </p>
                </div>
              </div>

              {/* Verified recommendations */}
              <div className="bg-white rounded-3xl border border-slate-100 p-5 sm:p-6 shadow-sm space-y-4 overflow-hidden">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  {isIndonesian ? "Rekomendasi Kandidat Skor Tinggi" : "High Scoring Candidates Pool"}
                </h3>
                <div className="divide-y divide-slate-100">
                  {candidates.slice(0, 3).map((cand) => (
                    <div key={cand.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 overflow-hidden">
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <div className="bg-slate-100 h-10 w-10 rounded-xl flex items-center justify-center font-bold text-slate-700 shrink-0">
                          {cand.fullName[0]}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center space-x-1.5 flex-wrap">
                            <h4 className="font-bold text-slate-800 text-xs truncate max-w-[160px] sm:max-w-xs">{cand.fullName}</h4>
                            {cand.verified && (
                              <span className="bg-emerald-50 text-emerald-700 text-[9px] px-1.5 py-0.5 rounded border border-emerald-100 font-extrabold uppercase shrink-0">
                                {isIndonesian ? "Terverifikasi" : "Verified"}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 font-bold truncate">
                            {cand.headline} • {isIndonesian ? "Skor:" : "Score:"} <span className="text-blue-600 font-extrabold">{cand.atsScore} {isIndonesian ? "poin" : "pts"}</span>
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={() => { setSubTab("search"); setSearchSkill(cand.skills[0]?.name || ""); }}
                        className="text-blue-600 hover:text-blue-700 text-xs font-black flex items-center cursor-pointer shrink-0 self-start sm:self-auto"
                      >
                        {isIndonesian ? "Lihat Profil" : "Inspect Profile"} <ArrowRight className="h-3.5 w-3.5 ml-1" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
              {/* Quick statistics / Sourcing Privileges Checklist */}
              <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    {isIndonesian ? "Daftar Hak Akses Rekruter" : "Sourcing Privileges Checklist"}
                  </h3>
                  <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                    {isIndonesian ? "3/3 Aktif" : "3/3 Active"}
                  </span>
                </div>
                <div className="space-y-3.5 text-xs font-semibold text-slate-600">
                  <div className="flex items-start space-x-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100/80">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-800 font-bold block">
                        {isIndonesian ? "Verifikasi Legalitas & Akreditasi HR" : "HR Legal & Accreditation Verification"}
                      </span>
                      <span className="text-[11px] text-slate-500 font-normal mt-0.5 block">
                        {isIndonesian 
                          ? "Disetujui oleh Super Admin berdasarkan validasi NIB/SIUP & email domain perusahaan resmi." 
                          : "Approved by Super Admin upon review of official business registration (NIB/SIUP) & corporate email domain."}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100/80">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-800 font-bold block">
                        {isIndonesian ? "Kelengkapan Profil & Aset Brand" : "Brand Profile & Assets Setup"}
                      </span>
                      <span className="text-[11px] text-slate-500 font-normal mt-0.5 block">
                        {isIndonesian 
                          ? "Nama perusahaan, logo resmi, lokasi kantor, dan deskripsi profil telah terkonfigurasi 100%." 
                          : "Company name, official logo avatar, HQ location, and corporate bio are 100% complete."}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100/80">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-800 font-bold block">
                        {isIndonesian ? "Paket Berlangganan Enterprise Aktif" : "Enterprise Subscription Tier Active"}
                      </span>
                      <span className="text-[11px] text-slate-500 font-normal mt-0.5 block">
                        {isIndonesian 
                          ? "Memberikan kuota direct sourcing tak terbatas, direct chat, dan pencarian basis data talenta." 
                          : "Grants unlimited talent discovery, direct chat invitations, and candidate pipeline sourcing."}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- SUB TAB: JOB OPENINGS & APPLICANTS ----------------- */}
      {subTab === "jobs" && (
        <RecruiterJobManagementView recruiter={recruiter} />
      )}

      {/* ----------------- SUB TAB: SEARCH DIRECTORY ----------------- */}
      {subTab === "search" && (
        <SearchTalentView
          recruiter={recruiter}
          candidates={candidates}
          onSendInvitation={onSendInvitation}
          initialSearchSkill={searchSkill}
        />
      )}

      {/* ----------------- SUB TAB: INBOX / MESSAGING ----------------- */}
      {subTab === "invitations" && (
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Sourcing proposals (Left 4) */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-100 p-4 shadow-sm space-y-4 max-h-[550px] overflow-y-auto">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
              {isIndonesian ? "Saluran Undangan Keluar" : "Outbox Pitch Channels"}
            </h3>
            
            {recruiterInvitations.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs font-semibold">
                {isIndonesian ? "Anda belum mengirimkan undangan wawancara langsung." : "You haven't dispatched any direct candidate invitations yet."}
              </div>
            ) : (
              <div className="space-y-1.5">
                {recruiterInvitations.map((inv) => {
                  const candidateObj = candidates.find(c => c.id === inv.candidateId);
                  return (
                    <button
                      key={inv.id}
                      id={`recruiter-select-inv-card-${inv.id}`}
                      onClick={() => setActiveInboxInvitationId(inv.id)}
                      className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center space-x-3 cursor-pointer ${
                        activeInboxInvitationId === inv.id 
                          ? "bg-blue-50 border-blue-200 shadow-2xs" 
                          : "border-slate-100 hover:bg-slate-50 bg-white"
                      }`}
                    >
                      <img
                        src={getProfileAvatar(candidateObj?.avatar)}
                        alt={candidateObj?.fullName}
                        className="h-9 w-9 rounded-xl object-cover border border-slate-100 shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = DEFAULT_PROFILE_IMAGE;
                        }}
                      />
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex justify-between items-center">
                          <h4 className="font-bold text-slate-900 text-xs truncate">{candidateObj?.fullName}</h4>
                          <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded-full uppercase ${
                            inv.status === "pending" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
                          }`}>
                            {inv.status === "pending" ? (isIndonesian ? "Menunggu" : "Pending") : inv.status === "accepted" ? (isIndonesian ? "Diterima" : "Accepted") : inv.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold truncate">{inv.position}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Chat Feed (Right 8) */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between min-h-[500px]">
            {activeInboxInvitation ? (
              <>
                <div className="p-4 border-b border-slate-100 bg-slate-50/40 rounded-t-3xl flex items-center space-x-3">
                  <img
                    src={getProfileAvatar(candidates.find(c => c.id === activeInboxInvitation.candidateId)?.avatar)}
                    alt="Active candidate avatar"
                    className="h-10 w-10 rounded-xl object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = DEFAULT_PROFILE_IMAGE;
                    }}
                  />
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm">
                      {isIndonesian ? "Obrolan Wawancara:" : "Sourcing Chat:"} {candidates.find(c => c.id === activeInboxInvitation.candidateId)?.fullName}
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold">
                      {activeInboxInvitation.position} • {isIndonesian ? "Status:" : "Status:"} <span className="capitalize font-bold text-blue-600">
                        {activeInboxInvitation.status === "pending" ? (isIndonesian ? "Menunggu respon" : "Pending") : activeInboxInvitation.status === "accepted" ? (isIndonesian ? "Diterima" : "Accepted") : activeInboxInvitation.status}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Messages feed */}
                <div className="p-5 flex-1 overflow-y-auto space-y-4 max-h-[380px]">
                  
                  {/* Base proposal pitch message */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-150 text-xs space-y-2 text-slate-600">
                    <p className="font-bold text-slate-800">
                      {isIndonesian ? "Proposal Wawancara yang Anda Kirimkan:" : "Your Dispatched Sourcing Proposal:"}
                    </p>
                    <p className="italic font-medium">"{activeInboxInvitation.message}"</p>
                    <div className="border-t border-slate-200 pt-2 flex justify-between text-[11px] text-slate-400 font-bold">
                      <span>{isIndonesian ? "Tawaran Gaji:" : "Salary Routing Offer:"} {activeInboxInvitation.salaryOffer}</span>
                      <span>Google Meet: {activeInboxInvitation.interviewLink || (isIndonesian ? "Menunggu persetujuan" : "Pending approval")}</span>
                    </div>
                  </div>

                  {/* Dynamic user and candidate comments */}
                  {activeInboxMessages.map((msg) => {
                    const isRecruiter = msg.senderRole === "recruiter";
                    return (
                      <div 
                        key={msg.id}
                        className={`flex ${isRecruiter ? "justify-end" : "justify-start"}`}
                      >
                        <div className={`p-3 max-w-[80%] rounded-2xl text-xs font-semibold leading-relaxed ${
                          isRecruiter 
                            ? "bg-blue-600 text-white rounded-br-none" 
                            : "bg-slate-150 text-slate-800 rounded-bl-none"
                        }`}>
                          <p>{msg.content}</p>
                          <span className={`text-[9px] block text-right mt-1.5 font-bold ${
                            isRecruiter ? "text-blue-200" : "text-slate-400"
                          }`}>
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    );
                  })}

                </div>

                {/* Send action bar */}
                <form onSubmit={handleSendMessageSubmit} className="p-3.5 border-t border-slate-100 bg-slate-50/20 rounded-b-3xl flex items-center space-x-2.5">
                  <input
                    type="text"
                    id="recruiter-chat-input-field"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder={isIndonesian ? "Tulis pesan atau rincian untuk wawancara..." : "Enter message or details for scheduled interview room..."}
                    className="flex-1 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 bg-white"
                  />
                  <button
                    type="submit"
                    id="recruiter-send-msg-btn"
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-xl cursor-pointer"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col justify-center items-center text-slate-400 p-8 text-center space-y-2">
                <Inbox className="h-10 w-10 text-slate-300" />
                <h4 className="font-bold text-slate-700 text-sm">
                  {isIndonesian ? "Belum Ada Percakapan yang Dipilih" : "No Inbox Thread Selected"}
                </h4>
                <p className="text-xs text-slate-400 max-w-xs font-semibold">
                  {isIndonesian ? "Pilih saluran kandidat di sebelah kiri untuk melihat pesan atau jadwal wawancara." : "Select an outbox thread channel on the left to handle communication with that candidate."}
                </p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ----------------- SUB TAB: ANALYTICS ----------------- */}
      {subTab === "analytics" && (
        <div className="space-y-8">
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pipelineStats.map((stat, i) => (
              <div key={i} className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">{stat.title}</span>
                <span className="text-3xl font-extrabold text-slate-900 block mt-2">{stat.count}</span>
                <span className="text-xs text-slate-500 font-semibold block mt-1.5">{stat.desc}</span>
              </div>
            ))}
          </div>

          {/* Hiring pipeline visualizer */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-slate-900">
              {isIndonesian ? "Efisiensi Corong Akuisisi Talenta" : "Acquisition Pipeline Funnel Efficiency"}
            </h3>
            <p className="text-xs text-slate-500 font-semibold">
              {isIndonesian 
                ? "Pantau bagaimana kandidat bertransisi dari pencarian terindeks hingga penerimaan kerja penuh waktu."
                : "Track how candidates transition from indexed sourcing discovery to full-time hires."}
            </p>
            
            <div className="space-y-4 max-w-2xl">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                  <span>{isIndonesian ? "1. Kandidat Ditemukan (Kecocokan Database)" : "1. Discovered Candidates (Database match)"}</span>
                  <span>100% ({candidates.length} {isIndonesian ? "Profil" : "Profiles"})</span>
                </div>
                <div className="w-full bg-slate-100 h-6 rounded-lg overflow-hidden">
                  <div className="bg-blue-600 h-full w-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                  <span>{isIndonesian ? "2. Undangan Wawancara Dikirim" : "2. Sourced Direct Pitches Sent"}</span>
                  <span>26% ({recruiterInvitations.length || 12} {isIndonesian ? "Proposal" : "Proposals"})</span>
                </div>
                <div className="w-full bg-slate-100 h-6 rounded-lg overflow-hidden">
                  <div className="bg-blue-500 h-full w-[26%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                  <span>{isIndonesian ? "3. Wawancara Terjadwal Aktif" : "3. Active Scheduled Interviews"}</span>
                  <span>11% ({recruiterInvitations.filter(i => i.status === "scheduled").length || 5} {isIndonesian ? "Kandidat" : "Candidates"})</span>
                </div>
                <div className="w-full bg-slate-100 h-6 rounded-lg overflow-hidden">
                  <div className="bg-blue-400 h-full w-[11%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                  <span>{isIndonesian ? "4. Penempatan / Diterima Bekerja" : "4. Successful Placements"}</span>
                  <span>4% ({recruiterInvitations.filter(i => i.status === "accepted").length || 2} {isIndonesian ? "Diterima" : "Hired"})</span>
                </div>
                <div className="w-full bg-slate-100 h-6 rounded-lg overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[4%]" />
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ----------------- MODAL: DETAILED PROFILE VIEW ----------------- */}
      {selectedCandidate && (
        <div className="fixed inset-0 bg-slate-950/45 backdrop-blur-xs flex items-center justify-center z-50 p-3 sm:p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-4xl w-full max-h-[88vh] flex flex-col overflow-hidden relative animate-in zoom-in-95 duration-150">
            <button
              id="close-candidate-modal"
              onClick={() => setSelectedCandidate(null)}
              className="absolute top-4 right-4 bg-slate-100 hover:bg-slate-200 text-slate-500 p-2 rounded-full cursor-pointer transition-colors z-20"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Profile fixed header */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-5 border-b border-slate-100 p-5 sm:p-6 shrink-0 relative pr-12 sm:pr-14 bg-white">
              <img
                src={getProfileAvatar(selectedCandidate.avatar)}
                alt={selectedCandidate.fullName}
                className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl object-cover border border-slate-100 shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = DEFAULT_PROFILE_IMAGE;
                }}
              />
              <div className="space-y-1 text-center sm:text-left flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 justify-center sm:justify-start">
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 truncate">{selectedCandidate.fullName}</h2>
                  {selectedCandidate.verified && (
                    <span className="bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-blue-100 w-fit">
                      {isIndonesian ? "TERVERIFIKASI" : "VERIFIED"}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 font-semibold truncate">{selectedCandidate.headline}</p>
                <p className="text-[11px] text-slate-400 font-bold">
                  {selectedCandidate.location} • {isIndonesian ? "Kewarganegaraan:" : "Nationality:"} {selectedCandidate.nationality}
                </p>
              </div>

              <button
                id="modal-direct-pitch-btn"
                onClick={() => {
                  setInvitingCandidate(selectedCandidate);
                  setSelectedCandidate(null);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md cursor-pointer transition-all shrink-0"
              >
                {isIndonesian ? "Kirim Proposal Wawancara" : "Send Direct Sourcing Proposal"}
              </button>
            </div>

            {/* Modal scrollable body with custom-scrollbar */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-5 sm:p-6 space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                
                {/* Left sidebar info (Skills, stats, details) */}
                <div className="space-y-6">
                  <div className="bg-slate-50 p-4 rounded-2xl space-y-4 border border-slate-200/50">
                    <div className="text-xs">
                      <span className="text-slate-400 uppercase font-bold text-[9px] block">
                        {isIndonesian ? "Target Kompensasi" : "Compensation Target"}
                      </span>
                      <span className="font-extrabold text-slate-800 text-sm">
                        {formatCurrency(selectedCandidate.expectedSalary)}
                      </span>
                    </div>
                    <div className="text-xs">
                      <span className="text-slate-400 uppercase font-bold text-[9px] block">
                        {isIndonesian ? "Periode Pemberitahuan / Ketersediaan" : "Notice Period / Availability"}
                      </span>
                      <span className="font-extrabold text-slate-800 text-sm">{selectedCandidate.availability}</span>
                    </div>
                    <div className="text-xs">
                      <span className="text-slate-400 uppercase font-bold text-[9px] block">
                        {isIndonesian ? "Skor Evaluasi ATS" : "ATS Evaluation Score"}
                      </span>
                      <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-100">{selectedCandidate.atsScore}/100</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="font-extrabold text-slate-900 text-xs uppercase tracking-wider block">
                      {isIndonesian ? "Matriks Keterampilan" : "Skill Matrices"}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {selectedCandidate.skills.map(s => (
                        <span key={s.id} className="bg-slate-50 border border-slate-100 px-2 py-0.5 rounded text-[10px] font-bold text-slate-600" title={`${s.level} • ${s.yearsOfExperience} yrs`}>
                          {s.name} ({s.yearsOfExperience}{isIndonesian ? "thn" : "y"})
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Social references */}
                  <div className="space-y-2.5 border-t border-slate-100 pt-4 text-xs font-semibold text-slate-500">
                    <span className="font-bold text-slate-800 text-[10px] uppercase">
                      {isIndonesian ? "Tautan Terverifikasi" : "Validated Links"}
                    </span>
                    <div className="flex flex-col space-y-1.5">
                      {selectedCandidate.github && <a href={selectedCandidate.github} target="_blank" rel="noreferrer" className="flex items-center space-x-1.5 text-blue-600 hover:underline"><Github className="h-3.5 w-3.5" /> <span>Github Repository</span></a>}
                      {selectedCandidate.linkedin && <a href={selectedCandidate.linkedin} target="_blank" rel="noreferrer" className="flex items-center space-x-1.5 text-blue-600 hover:underline"><Linkedin className="h-3.5 w-3.5" /> <span>LinkedIn Network</span></a>}
                    </div>
                  </div>
                </div>

                {/* Middle and Right: Work history, Portfolio projects, certifications */}
                <div className="md:col-span-2 space-y-6">
                  
                  {/* About Bio */}
                  <div className="space-y-1.5">
                    <h3 className="font-extrabold text-slate-900 text-xs uppercase">
                      {isIndonesian ? "Tentang Latar Belakang Profesional" : "About Professional background"}
                    </h3>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed bg-slate-50/50 p-3.5 rounded-2xl border border-slate-100">{selectedCandidate.aboutMe}</p>
                  </div>

                  {/* Work Experiences */}
                  <div className="space-y-3">
                    <h3 className="font-extrabold text-slate-900 text-xs uppercase">
                      {isIndonesian ? "Riwayat Pengalaman Kerja" : "Work History"}
                    </h3>
                    <div className="space-y-4 pl-4 border-l-2 border-slate-100">
                      {selectedCandidate.experience.map(exp => (
                        <div key={exp.id} className="space-y-1 relative">
                          <span className="h-2.5 w-2.5 rounded-full bg-blue-600 border border-white absolute -left-[21.5px] top-1" />
                          <div className="flex justify-between items-start">
                            <h4 className="font-bold text-slate-800 text-xs">{exp.position}</h4>
                            <span className="text-[9px] font-bold text-slate-400">{exp.startDate} – {exp.endDate}</span>
                          </div>
                          <p className="text-[10px] text-slate-500 font-bold">{exp.company} • {exp.employmentType}</p>
                          {exp.responsibilities && exp.responsibilities.length > 0 && (
                            <p className="text-[11px] text-slate-600 font-medium leading-relaxed">{exp.responsibilities[0]}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Portfolio Showcase */}
                  {selectedCandidate.portfolio && selectedCandidate.portfolio.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-extrabold text-slate-900 text-xs uppercase">
                        {isIndonesian ? "Proyek Portofolio Aktif" : "Active Portfolio Projects"}
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {selectedCandidate.portfolio.map(proj => (
                          <div key={proj.id} className="p-3 border border-slate-150 rounded-xl space-y-2 bg-slate-50/30">
                            <img src={proj.thumbnail} alt={proj.title} className="w-full h-24 object-cover rounded-lg" />
                            <h4 className="font-bold text-slate-800 text-[11px]">{proj.title}</h4>
                            <p className="text-[10px] text-slate-500 font-medium leading-relaxed line-clamp-2">{proj.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- MODAL: INVITATION WRITING FORM ----------------- */}
      {invitingCandidate && (
        <div className="fixed inset-0 bg-slate-950/45 backdrop-blur-xs flex items-center justify-center z-50 p-3 sm:p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full max-h-[88vh] flex flex-col overflow-hidden relative animate-in zoom-in-95 duration-150">
            <button
              id="close-invitation-modal"
              onClick={() => setInvitingCandidate(null)}
              className="absolute top-4 right-4 bg-slate-100 hover:bg-slate-200 text-slate-500 p-2 rounded-full cursor-pointer transition-colors z-20"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Modal Fixed Header */}
            <div className="flex items-center space-x-3.5 border-b border-slate-100 p-5 sm:p-6 pb-4 shrink-0 relative pr-12 bg-white">
              <img
                src={getProfileAvatar(invitingCandidate.avatar)}
                alt={invitingCandidate.fullName}
                className="h-11 w-11 rounded-xl object-cover border border-slate-100 shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = DEFAULT_PROFILE_IMAGE;
                }}
              />
              <div className="min-w-0">
                <h3 className="font-extrabold text-slate-900 text-sm truncate">
                  {isIndonesian ? "Kirim Proposal Wawancara Langsung" : "Send Direct Interview Proposal"}
                </h3>
                <p className="text-xs text-slate-500 font-semibold truncate">
                  {isIndonesian ? "Kepada:" : "Pitching to:"} <span className="font-bold text-blue-600">{invitingCandidate.fullName}</span>
                </p>
              </div>
            </div>

            {/* Form scrollable body */}
            <form onSubmit={handleSendInviteSubmit} className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto custom-scrollbar p-5 sm:p-6 space-y-4 text-xs font-semibold">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase font-extrabold">
                    {isIndonesian ? "Judul Posisi Pekerjaan" : "Target Job Position Title"}
                  </label>
                  <input
                    type="text"
                    id="invite-position-field"
                    required
                    value={invitePosition}
                    onChange={(e) => setInvitePosition(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 uppercase font-extrabold">
                      {isIndonesian ? "Tawaran Kompensasi / Gaji" : "Compensation Route Offer"}
                    </label>
                    <input
                      type="text"
                      id="invite-salary-field"
                      required
                      value={inviteSalary}
                      onChange={(e) => setInviteSalary(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 uppercase font-extrabold">
                      {isIndonesian ? "Tautan Jadwal Google Meet" : "Google Meet Schedule Link"}
                    </label>
                    <input
                      type="text"
                      id="invite-meet-field"
                      required
                      placeholder="https://meet.google.com/..."
                      value={inviteMeetLink}
                      onChange={(e) => setInviteMeetLink(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl p-2.5 text-slate-800 font-mono text-[11px] focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase font-extrabold">
                    {isIndonesian ? "Usulan Tanggal Wawancara" : "Interview Proposed Date"}
                  </label>
                  <input
                    type="datetime-local"
                    id="invite-date-field"
                    required
                    value={inviteDate}
                    onChange={(e) => setInviteDate(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase font-extrabold">
                    {isIndonesian ? "Pesan / Surat Penawaran" : "Pitch Message Letter"}
                  </label>
                  <textarea
                    id="invite-message-field"
                    required
                    value={inviteMessage}
                    onChange={(e) => setInviteMessage(e.target.value)}
                    rows={3}
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-slate-800 leading-relaxed font-medium resize-none focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Fixed Modal Footer */}
              <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setInvitingCandidate(null)}
                  className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors cursor-pointer text-center"
                >
                  {isIndonesian ? "Batal" : "Cancel"}
                </button>
                <button
                  type="submit"
                  id="send-final-proposal-btn"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-xl font-bold text-xs shadow-md shadow-blue-200 transition-all cursor-pointer text-center"
                >
                  {isIndonesian ? "Kirim Proposal" : "Send Proposal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------- SUB TAB: SAVED CANDIDATES ----------------- */}
      {subTab === "saved" && (
        <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">
                {isIndonesian ? "Profil Kandidat Tersimpan" : "Saved Candidate Profiles"}
              </h3>
              <p className="text-xs text-slate-500 font-semibold">
                {isIndonesian 
                  ? "Talenta rekayasa perangkat lunak terpilih yang disimpan untuk proses rekrutmen saat ini atau mendatang."
                  : "Shortlisted engineering talents saved for current or upcoming hiring pipeline roles."}
              </p>
            </div>
            <span className="bg-blue-50 text-blue-700 text-xs font-black px-3 py-1 rounded-full border border-blue-100">
              {candidates.filter(c => c.verified).length} {isIndonesian ? "Terpilih" : "Shortlisted"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {candidates.filter(c => c.verified).map((cand) => (
              <div key={cand.id} className="p-4 sm:p-5 border border-slate-150 rounded-2xl bg-slate-50/20 hover:border-blue-200 transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-3 overflow-hidden">
                <div className="flex items-start space-x-3.5 min-w-0 flex-1">
                  <div className="bg-slate-200 text-slate-700 h-11 w-11 rounded-xl flex items-center justify-center font-black shrink-0">
                    {cand.fullName[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-extrabold text-slate-800 text-sm truncate">{cand.fullName}</h4>
                    <p className="text-xs text-slate-500 font-bold truncate">{cand.headline}</p>
                    <div className="flex items-center space-x-1.5 mt-1 flex-wrap gap-y-1">
                      <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-extrabold shrink-0">{cand.availability}</span>
                      <span className="text-[10px] text-slate-500 font-bold shrink-0">{isIndonesian ? "Skor:" : "Score:"} {cand.atsScore} {isIndonesian ? "poin" : "pts"}</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => { setSubTab("search"); setSearchSkill(cand.skills[0]?.name || ""); }}
                  className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl px-3.5 py-1.5 text-xs font-bold shadow-xs cursor-pointer shrink-0 self-start sm:self-auto"
                >
                  {isIndonesian ? "Periksa" : "Inspect"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ----------------- SUB TAB: COMPANY PROFILE ----------------- */}
      {subTab === "profile" && (
        <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6" id="recruiter-company-profile-tab">
          <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">
                {isIndonesian ? "Identitas & Verifikasi HR Perusahaan" : "Company & HR Verification Identity"}
              </h3>
              <p className="text-xs text-slate-500 font-semibold">
                {isIndonesian 
                  ? "Informasi legalitas perusahaan, wewenang HR resmi, dan metadata merek yang ditampilkan kepada kandidat."
                  : "Company legal details, official HR authority credentials, and brand metadata visible to candidates."}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center space-x-1.5 text-xs font-black bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>{isIndonesian ? "Status: Terverifikasi Resmi" : "Status: Officially Verified"}</span>
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 text-xs font-semibold text-slate-600">
            {/* Column 1: Company Legal & Corporate Profile */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
                <Building2 className="h-4 w-4 text-blue-600" />
                <h4 className="font-extrabold text-slate-900 text-sm">
                  {isIndonesian ? "Informasi Badan Usaha / Perusahaan" : "Company & Legal Entity"}
                </h4>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                  {isIndonesian ? "Nama Badan Hukum / Perusahaan" : "Legal Entity Name"}
                </label>
                <input 
                  type="text" 
                  value={recruiter.companyName} 
                  disabled
                  className="w-full border border-slate-200 rounded-xl p-3 bg-slate-100 text-xs font-bold text-slate-700 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                  {isIndonesian ? "Website / Tautan Karier Resmi" : "Official Website / Career Link"}
                </label>
                <input 
                  type="text" 
                  value={profileCompanyWebsite} 
                  onChange={(e) => setProfileCompanyWebsite(e.target.value)}
                  placeholder="https://company.com"
                  className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 text-xs font-bold text-slate-800 focus:bg-white font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                  {isIndonesian ? "LinkedIn Perusahaan / Halaman Karier" : "Company LinkedIn / Career URL"}
                </label>
                <input 
                  type="url" 
                  value={profileCompanyLinkedIn} 
                  onChange={(e) => setProfileCompanyLinkedIn(e.target.value)}
                  placeholder="https://linkedin.com/company/techcorp"
                  className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 text-xs font-bold text-slate-800 focus:bg-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                    {isIndonesian ? "Skala Karyawan" : "Company Size"}
                  </label>
                  <select 
                    value={profileCompanySize} 
                    onChange={(e) => setProfileCompanySize(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 text-xs font-bold text-slate-800 focus:bg-white"
                  >
                    <option value="1-10 Karyawan">1-10 {isIndonesian ? "Karyawan" : "Employees"}</option>
                    <option value="11-50 Karyawan">11-50 {isIndonesian ? "Karyawan" : "Employees"}</option>
                    <option value="51-200 Karyawan">51-200 {isIndonesian ? "Karyawan" : "Employees"}</option>
                    <option value="201-1000 Karyawan">201-1000 {isIndonesian ? "Karyawan" : "Employees"}</option>
                    <option value="1000+ Karyawan">1000+ {isIndonesian ? "Karyawan" : "Employees"}</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                    {isIndonesian ? "Nomor Registrasi / NIB" : "Company Reg / Tax ID"}
                  </label>
                  <input 
                    type="text" 
                    value={profileCompanyReg} 
                    onChange={(e) => setProfileCompanyReg(e.target.value)}
                    placeholder="098234710129"
                    className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 text-xs font-bold text-slate-800 focus:bg-white font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                  {isIndonesian ? "Lokasi Kantor Pusat" : "Office Location HQ"}
                </label>
                <input 
                  type="text" 
                  value={profileLocation} 
                  onChange={(e) => setProfileLocation(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 text-xs font-bold text-slate-800 focus:bg-white"
                />
              </div>

              {/* HR Verification Status Overview Box */}
              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">
                    {isIndonesian ? "Status Akreditasi HR" : "HR Verification Status"}
                  </span>
                  {recruiter.hrVerificationStatus === "verified" || recruiter.hrVerificationTier === "verified_domain" || recruiter.hrVerificationTier === "verified_admin" || (recruiter.hrVerified && recruiter.hrVerificationStatus !== "pending_review") ? (
                    <span className="inline-flex items-center space-x-1 text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                      <Check className="h-3 w-3" />
                      <span>{recruiter.hrVerificationTier === "verified_domain" ? (isIndonesian ? "Domain Terverifikasi" : "Domain Verified") : (isIndonesian ? "Terakreditasi Admin" : "Admin Accredited")}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 text-[10px] font-extrabold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md">
                      <Clock className="h-3 w-3" />
                      <span>{isIndonesian ? "Dalam Peninjauan" : "In Review"}</span>
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                  {recruiter.hrVerificationStatus === "verified" || recruiter.hrVerificationTier === "verified_domain" || recruiter.hrVerificationTier === "verified_admin" || (recruiter.hrVerified && recruiter.hrVerificationStatus !== "pending_review")
                    ? (isIndonesian ? "Kredensial korporat dan pejabat HR telah terverifikasi. Akun HR Anda memiliki hak penuh mengundang kandidat dan menjadwalkan interview langsung." : "Corporate and HR credentials authenticated. Your HR account holds full privileges to pitch candidates and schedule direct interviews.")
                    : (isIndonesian ? "Akun sedang ditinjau manual oleh Super Admin berdasarkan data identitas kerja & profil LinkedIn Anda." : "Account under manual review by Super Admin based on your work proof & LinkedIn profile.")}
                </p>
              </div>
            </div>

            {/* Column 2: HR Representative & Sourcing Authority */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
                <User className="h-4 w-4 text-blue-600" />
                <h4 className="font-extrabold text-slate-900 text-sm">
                  {isIndonesian ? "Identitas & Kontak Petugas HR" : "HR Representative & Contact"}
                </h4>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                    {isIndonesian ? "Nama Lengkap Petugas HR" : "HR Officer Full Name"}
                  </label>
                  <input 
                    type="text" 
                    value={profileFullName} 
                    onChange={(e) => setProfileFullName(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 text-xs font-bold text-slate-800 focus:bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                    {isIndonesian ? "Jabatan / Posisi Resmi" : "Official HR Job Title"}
                  </label>
                  <input 
                    type="text" 
                    value={profileHrJobTitle} 
                    onChange={(e) => setProfileHrJobTitle(e.target.value)}
                    placeholder="Talent Acquisition Lead"
                    className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 text-xs font-bold text-slate-800 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                      {isIndonesian ? "Email Kerja Resmi" : "Official Work Email"}
                    </label>
                    <button
                      type="button"
                      onClick={() => setSubTab("settings")}
                      className="text-[10px] font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                    >
                      {isIndonesian ? "Validasi di Pengaturan" : "Validate in Settings"}
                    </button>
                  </div>
                  <div className="relative">
                    <input 
                      type="email" 
                      value={hrEmail} 
                      disabled
                      className="w-full border border-slate-200 rounded-xl p-3 pr-24 bg-slate-100 text-xs font-bold text-slate-600 focus:outline-none"
                    />
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
                      {isHrEmailVerified ? (
                        <span className="text-[9.5px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="h-2.5 w-2.5 text-emerald-600" />
                          <span>{isIndonesian ? "Terverifikasi" : "Verified"}</span>
                        </span>
                      ) : (
                        <span className="text-[9.5px] font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 flex items-center gap-1">
                          <AlertCircle className="h-2.5 w-2.5 text-amber-600" />
                          <span>{isIndonesian ? "Belum Verifikasi" : "Unverified"}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                    {isIndonesian ? "Nomor Telepon / WhatsApp HR" : "HR Phone / Contact"}
                  </label>
                  <input 
                    type="tel" 
                    value={profilePhone} 
                    onChange={(e) => setProfilePhone(e.target.value)}
                    placeholder="+62 812-3456-7890"
                    className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 text-xs font-bold text-slate-800 focus:bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                  {isIndonesian ? "Profil LinkedIn Pribadi HR" : "HR Personal LinkedIn Profile"}
                </label>
                <input 
                  type="url" 
                  value={profileHrLinkedIn} 
                  onChange={(e) => setProfileHrLinkedIn(e.target.value)}
                  placeholder="https://linkedin.com/in/elena-recruiter"
                  className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 text-xs font-bold text-slate-800 focus:bg-white font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                  {isIndonesian ? "URL Logo Perusahaan" : "Company Logo URL"}
                </label>
                <input 
                  type="text" 
                  value={profileCompanyLogo} 
                  onChange={(e) => setProfileCompanyLogo(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 text-xs font-bold text-slate-800 focus:bg-white font-mono"
                />
              </div>

              <div className="pt-3 flex items-center space-x-3">
                <button 
                  onClick={() => {
                    if (onUpdateRecruiter) {
                      onUpdateRecruiter({
                        ...recruiter,
                        location: profileLocation,
                        fullName: profileFullName,
                        companyLogo: profileCompanyLogo,
                        hrJobTitle: profileHrJobTitle,
                        phone: profilePhone,
                        companyWebsite: profileCompanyWebsite,
                        companySize: profileCompanySize,
                        companyRegistrationNumber: profileCompanyReg,
                        hrLinkedInUrl: profileHrLinkedIn,
                        companyLinkedInUrl: profileCompanyLinkedIn
                      });
                      setSaveSuccess(true);
                      setTimeout(() => setSaveSuccess(false), 3000);
                    }
                  }}
                  className="bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-200 cursor-pointer flex items-center space-x-2"
                >
                  <Check className="h-4 w-4" />
                  <span>{isIndonesian ? "Simpan Perubahan Data HR & Merek" : "Save HR & Brand Changes"}</span>
                </button>
                {saveSuccess && (
                  <span className="text-emerald-600 font-extrabold text-xs flex items-center space-x-1">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>{isIndonesian ? "Data HR berhasil diperbarui ✓" : "HR data updated successfully ✓"}</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- SUB TAB: BILLING ----------------- */}
      {/* [PAID_FEATURE_TOGGLE] Paid billing sub-tab section commented out for Free Trial period.
          Uncomment below to re-enable recruiter subscription & invoice management:
      {subTab === "billing" && (
        <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-lg font-extrabold text-slate-900">
              {isIndonesian ? "Tagihan & Kuota Perekrutan" : "Billing & Sourcing Seats"}
            </h3>
            <p className="text-xs text-slate-500 font-semibold">
              {isIndonesian ? "Kelola paket langganan aktif dan batas penggunaan API perusahaan Anda." : "Manage your company active subscription package and API usage limits."}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 border border-blue-150 bg-blue-50/20 rounded-2xl md:col-span-1 space-y-4">
              <span className="text-[9px] font-black text-blue-700 bg-blue-100 px-2.5 py-1 rounded-full uppercase">
                {isIndonesian ? "Paket Saat Ini" : "Current Plan"}
              </span>
              <h4 className="font-extrabold text-slate-900 text-base">{recruiter.subscriptionTier} Tier</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                {isIndonesian 
                  ? "Pencarian kandidat tanpa batas, pengindeksan cerdas, dan hingga 50 kredit proposal undangan langsung per bulan."
                  : "Unlimited active candidate searches, meilisearch querying indexes, and up to 50 active direct pitch proposal credits per month."}
              </p>
              <div className="pt-2 border-t border-blue-100 text-xs font-extrabold text-blue-700">
                <span>{isIndonesian ? "Perpanjangan: 15 Ags 2026 (Rp 3.900.000 / bln)" : "Renews: Aug 15, 2026 (Rp 3,900,000 / mo)"}</span>
              </div>
            </div>

            <div className="md:col-span-2 border border-slate-150 p-6 rounded-2xl space-y-4">
              <h4 className="font-extrabold text-slate-900 text-sm">
                {isIndonesian ? "Buku Besar Faktur Transaksi Langsung" : "Direct Transaction Invoices Ledger"}
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-150 text-slate-400 font-bold uppercase tracking-widest text-[9px]">
                      <th className="pb-2">{isIndonesian ? "ID Faktur" : "Invoice ID"}</th>
                      <th className="pb-2">{isIndonesian ? "Tanggal Diterbitkan" : "Date Issued"}</th>
                      <th className="pb-2">{isIndonesian ? "Total Dibayar" : "Total Paid"}</th>
                      <th className="pb-2">{isIndonesian ? "Metode Pembayaran" : "Billing Method"}</th>
                      <th className="pb-2 text-right">{isIndonesian ? "Kuitansi" : "Receipt"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                    <tr>
                      <td className="py-3 font-mono">INV-9824-A</td>
                      <td className="py-3">{isIndonesian ? "15 Juli 2026" : "July 15, 2026"}</td>
                      <td className="py-3 font-bold">{isIndonesian ? "Rp 3.900.000" : "Rp 3,900,000"}</td>
                      <td className="py-3">MasterCard •••• 4242</td>
                      <td className="py-3 text-right text-blue-600 hover:underline cursor-pointer">{isIndonesian ? "Unduh pdf" : "Download pdf"}</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-mono">INV-8711-B</td>
                      <td className="py-3">{isIndonesian ? "15 Juni 2026" : "June 15, 2026"}</td>
                      <td className="py-3 font-bold">{isIndonesian ? "Rp 3.900.000" : "Rp 3,900,000"}</td>
                      <td className="py-3">MasterCard •••• 4242</td>
                      <td className="py-3 text-right text-blue-600 hover:underline cursor-pointer">{isIndonesian ? "Unduh pdf" : "Download pdf"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
      */}

      {/* ----------------- SUB TAB: SETTINGS ----------------- */}
      {subTab === "settings" && (
        <div className="space-y-8">
          
          {/* Success / Feedback Toast Banner */}
          {recruiterPhotoFeedbackMsg && (
            <div className="bg-emerald-600 text-white px-5 py-3.5 rounded-2xl shadow-md flex items-center justify-between animate-fade-in text-xs font-extrabold">
              <div className="flex items-center space-x-2">
                <Check className="h-4 w-4 bg-white/20 p-0.5 rounded-full" />
                <span>{recruiterPhotoFeedbackMsg}</span>
              </div>
              <button 
                onClick={() => setRecruiterPhotoFeedbackMsg(null)}
                className="text-white/80 hover:text-white p-1 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {notifyFeedbackMsg && (
            <div className="bg-emerald-600 text-white px-5 py-3.5 rounded-2xl shadow-md flex items-center justify-between animate-fade-in text-xs font-extrabold">
              <div className="flex items-center space-x-2">
                <Check className="h-4 w-4 bg-white/20 p-0.5 rounded-full" />
                <span>{notifyFeedbackMsg}</span>
              </div>
              <button 
                onClick={() => setNotifyFeedbackMsg(null)}
                className="text-white/80 hover:text-white p-1 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {hrEmailFeedbackMsg && (
            <div className={`px-5 py-3.5 rounded-2xl shadow-md flex items-center justify-between animate-fade-in text-xs font-extrabold text-white ${
              hrEmailFeedbackMsg.isError ? "bg-rose-600" : "bg-emerald-600"
            }`}>
              <div className="flex items-center space-x-2">
                {hrEmailFeedbackMsg.isError ? (
                  <AlertCircle className="h-4 w-4 bg-white/20 p-0.5 rounded-full" />
                ) : (
                  <Check className="h-4 w-4 bg-white/20 p-0.5 rounded-full" />
                )}
                <span>{hrEmailFeedbackMsg.text}</span>
              </div>
              <button 
                onClick={() => setHrEmailFeedbackMsg(null)}
                className="text-white/80 hover:text-white p-1 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Upper Summary Card: HR Representative & Company Info */}
          <div className="bg-white rounded-3xl border border-slate-150 p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex items-center space-x-4">
              <div className="relative group shrink-0">
                <img
                  src={profileAvatar}
                  alt={profileFullName}
                  className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl object-cover border-2 border-white shadow-md ring-1 ring-slate-200"
                />
                <button
                  onClick={() => recruiterFileInputRef.current?.click()}
                  title={isIndonesian ? "Ganti foto profil HR" : "Change HR photo"}
                  className="absolute -bottom-1 -right-1 bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-xl shadow-xs border border-white cursor-pointer transition-all"
                >
                  <Camera className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                    {profileFullName}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-extrabold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3 text-blue-600" />
                    <span>{recruiter.hrVerified ? (isIndonesian ? "Akun HR Terverifikasi" : "Verified HR Account") : (isIndonesian ? "Akun HR" : "HR Recruiter")}</span>
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-600 flex items-center gap-2">
                  <span>{profileHrJobTitle}</span>
                  <span className="text-slate-300">•</span>
                  <span className="font-extrabold text-slate-800">{recruiter.companyName}</span>
                </p>
                <div className="flex items-center gap-3 text-[11px] text-slate-400 font-bold flex-wrap">
                  <span className="flex items-center"><MapPin className="h-3 w-3 mr-1 text-slate-400" /> {profileLocation}</span>
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-3 w-3 text-slate-400" />
                    <span>{hrEmail}</span>
                    {isHrEmailVerified ? (
                      <span className="inline-flex items-center gap-1 text-[9.5px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        <CheckCircle2 className="h-2.5 w-2.5 text-emerald-600" />
                        <span>{isIndonesian ? "Terverifikasi" : "Verified"}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[9.5px] font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                        <AlertCircle className="h-2.5 w-2.5 text-amber-600" />
                        <span>{isIndonesian ? "Belum Verifikasi" : "Unverified"}</span>
                      </span>
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 self-start md:self-center shrink-0">
              <button
                onClick={() => setSubTab("profile")}
                className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5"
              >
                <Building2 className="h-3.5 w-3.5 text-slate-500" />
                <span>{isIndonesian ? "Edit Profil Perusahaan" : "Edit Company Profile"}</span>
              </button>
            </div>
          </div>

          {/* Section 1: Official HR Work Email & Domain Validation */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-blue-600" />
                  <span>{isIndonesian ? "Validasi Email Kerja Resmi HR & Verifikasi Domain" : "HR Official Work Email & Domain Validation"}</span>
                </h3>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  {isIndonesian 
                    ? "Email kerja terverifikasi dengan domain korporat meningkatkan reputasi perusahaan dan memastikan undangan interview terkirim langsung ke kandidat." 
                    : "Verified corporate work email authenticates your recruiter identity and ensures seamless interview delivery to talent."}
                </p>
              </div>

              {/* Verification Status Badge */}
              <div className="flex items-center gap-2 shrink-0">
                {isHrEmailVerified ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    <span>{isIndonesian ? "Email Kerja Terverifikasi" : "Corporate Email Verified"}</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-50 text-amber-700 border border-amber-200 shadow-2xs">
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
                    <div className="h-11 w-11 rounded-2xl bg-blue-100/80 text-blue-600 flex items-center justify-center shrink-0 shadow-2xs">
                      <MailCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                        {isIndonesian ? "Alamat Email Kerja Resmi Aktif" : "Active Official Work Email"}
                      </span>
                      <span className="text-sm font-extrabold text-slate-900 break-all">{hrEmail}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Toggle status simulation for demo testing */}
                    <button
                      type="button"
                      onClick={handleToggleHrEmailVerificationStatus}
                      title={isIndonesian ? "Klik untuk mensimulasikan status email" : "Toggle status simulation"}
                      className="text-[10px] font-bold text-slate-400 hover:text-slate-600 underline cursor-pointer"
                    >
                      {isIndonesian ? "Uji Status" : "Toggle State"}
                    </button>
                    
                    {!isEditingHrEmail && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditHrEmail(hrEmail);
                          setHrEmailError(null);
                          setIsEditingHrEmail(true);
                        }}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50/80 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                      >
                        {isIndonesian ? "Ubah Email" : "Change Email"}
                      </button>
                    )}
                  </div>
                </div>

                {/* Domain Analysis Pill */}
                <div className="pt-1">
                  {isGenericFreeEmail(isEditingHrEmail ? editHrEmail : hrEmail) ? (
                    <div className="flex items-start gap-2.5 p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-amber-800 text-xs">
                      <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <span className="font-bold block">
                          {isIndonesian ? "Domain Publik Terdeteksi (Non-Korporat)" : "Public Free Email Domain Detected"}
                        </span>
                        <p className="text-[11px] text-amber-700 leading-relaxed font-medium">
                          {isIndonesian
                            ? "Penggunaan domain korporat (contoh: @perusahaan.com) sangat disarankan untuk validasi resmi HR dan meningkatkan kepercayaan talenta hingga 3x lipat."
                            : "We recommend using a corporate work email (e.g. @company.com) for official HR verification and higher candidate response rates."}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 p-2.5 bg-emerald-50 rounded-xl border border-emerald-200/80 text-emerald-800 text-xs font-bold">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>
                        {isIndonesian 
                          ? "Domain Korporat Resmi Terverifikasi (Tingkat Kepercayaan Tinggi)" 
                          : "Official Corporate Domain Verified (High Talent Trust Level)"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Inline Edit Form when editing email */}
                {isEditingHrEmail && (
                  <form onSubmit={handleSaveHrEmail} className="pt-2 border-t border-slate-200 space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest block">
                        {isIndonesian ? "Masukkan Alamat Email Kerja Baru" : "Enter New Official Work Email"} *
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          id="input-hr-settings-email"
                          value={editHrEmail}
                          onChange={(e) => {
                            setEditHrEmail(e.target.value);
                            if (hrEmailError) setHrEmailError(null);
                          }}
                          placeholder="elena.recruiter@company.com"
                          className={`w-full border rounded-xl p-2.5 text-xs font-bold text-slate-800 focus:outline-none ${
                            hrEmailError 
                              ? "border-rose-400 bg-rose-50/50 focus:border-rose-500" 
                              : isValidEmailFormat(editHrEmail)
                                ? "border-emerald-400 bg-emerald-50/30 focus:border-emerald-500"
                                : "border-slate-200 bg-white focus:border-blue-500"
                          }`}
                        />
                        {editHrEmail && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            {isValidEmailFormat(editHrEmail) ? (
                              <Check className="h-4 w-4 text-emerald-600" />
                            ) : (
                              <X className="h-4 w-4 text-rose-500" />
                            )}
                          </div>
                        )}
                      </div>
                      
                      {/* Real-time validation message */}
                      {hrEmailError ? (
                        <p className="text-[11px] font-bold text-rose-600 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          <span>{hrEmailError}</span>
                        </p>
                      ) : editHrEmail && !isValidEmailFormat(editHrEmail) ? (
                        <p className="text-[11px] font-bold text-amber-600 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          <span>{isIndonesian ? "Format email belum lengkap (contoh: name@domain.com)" : "Email format incomplete (e.g. name@domain.com)"}</span>
                        </p>
                      ) : editHrEmail && isValidEmailFormat(editHrEmail) ? (
                        <p className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                          <Check className="h-3 w-3" />
                          <span>{isIndonesian ? "Format email valid ✓" : "Valid email format ✓"}</span>
                        </p>
                      ) : null}
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setEditHrEmail(hrEmail);
                          setHrEmailError(null);
                          setIsEditingHrEmail(false);
                        }}
                        className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                      >
                        {isIndonesian ? "Batal" : "Cancel"}
                      </button>
                      <button
                        type="submit"
                        disabled={!isValidEmailFormat(editHrEmail)}
                        className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer inline-flex items-center gap-1"
                      >
                        <Check className="h-3.5 w-3.5" />
                        <span>{isIndonesian ? "Simpan Email" : "Save Email"}</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* Verification Action Box */}
                {!isHrEmailVerified ? (
                  <div className="bg-amber-500/10 border border-amber-200 rounded-2xl p-4 space-y-3">
                    <div className="flex items-start space-x-2.5">
                      <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                      <p className="text-xs font-semibold text-amber-900 leading-relaxed">
                        {isIndonesian
                          ? "Email kerja Anda belum terverifikasi. Kirimkan kode verifikasi 6-digit untuk mengonfirmasi keabsahan akun perekrut resmi."
                          : "Your official work email is pending verification. Request a 6-digit security code to verify authorized recruiter ownership."}
                      </p>
                    </div>

                    {!hrEmailOtpModalOpen ? (
                      <button
                        type="button"
                        onClick={handleSendHrEmailVerification}
                        disabled={isSendingHrEmailOtp}
                        className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                      >
                        <Send className="h-3.5 w-3.5" />
                        <span>
                          {isSendingHrEmailOtp 
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
                              id="input-hr-email-otp"
                              value={inputHrEmailOtp}
                              onChange={(e) => setInputHrEmailOtp(e.target.value.replace(/\D/g, ""))}
                              placeholder="849201"
                              className="flex-1 border border-amber-300 rounded-xl px-3.5 py-2 bg-white text-sm font-extrabold text-center tracking-widest text-slate-900 focus:outline-amber-500"
                            />
                            <button
                              type="button"
                              onClick={handleConfirmHrEmailOtp}
                              disabled={inputHrEmailOtp.length < 6}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 inline-flex items-center gap-1"
                            >
                              <Check className="h-3.5 w-3.5" />
                              <span>{isIndonesian ? "Verifikasi" : "Verify"}</span>
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-amber-800 font-semibold pt-1">
                          <span>{isIndonesian ? "Periksa kotak masuk email kerja Anda" : "Check your work email inbox"}</span>
                          <button
                            type="button"
                            onClick={handleSendHrEmailVerification}
                            className="text-amber-700 font-bold hover:underline cursor-pointer"
                          >
                            {isIndonesian ? "Kirim ulang kode" : "Resend code"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-emerald-500/10 border border-emerald-200 rounded-2xl p-4 flex items-start space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
                    <div className="space-y-1">
                      <h5 className="font-extrabold text-emerald-950 text-xs">
                        {isIndonesian ? "Email Kerja Terautentikasi Resmi" : "Work Email Officially Authenticated"}
                      </h5>
                      <p className="text-[11px] text-emerald-800 font-medium leading-relaxed">
                        {isIndonesian
                          ? "Identitas akun HR Anda telah terverifikasi secara penuh. Undangan wawancara dan komunikasi kandidat terkirim dengan jaminan reputasi kredibel."
                          : "Your official HR recruiter account is securely authenticated. Candidate messages and interview invitations are delivered with full verified status."}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: HR Credibility Benefits & Domain Rules */}
              <div className="md:col-span-5 bg-white rounded-2xl border border-slate-150 p-5 space-y-4 shadow-2xs">
                <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-blue-600" />
                  <span>{isIndonesian ? "Keuntungan Validasi Email HR" : "HR Email Validation Benefits"}</span>
                </h4>

                <ul className="space-y-3 text-xs">
                  <li className="flex items-start space-x-2.5">
                    <div className="h-5 w-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="h-3 w-3" />
                    </div>
                    <div>
                      <strong className="text-slate-800 block text-[11.5px]">
                        {isIndonesian ? "Lencana HR Terverifikasi" : "Verified HR Recruiter Badge"}
                      </strong>
                      <span className="text-slate-500 text-[11px] leading-relaxed block">
                        {isIndonesian ? "Meningkatkan rasio respons kandidat top-tier hingga 85%." : "Increases top-tier candidate response rate up to 85%."}
                      </span>
                    </div>
                  </li>

                  <li className="flex items-start space-x-2.5">
                    <div className="h-5 w-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="h-3 w-3" />
                    </div>
                    <div>
                      <strong className="text-slate-800 block text-[11.5px]">
                        {isIndonesian ? "Aman dari Spam & Peniruan Identitas" : "Spam & Impersonation Protection"}
                      </strong>
                      <span className="text-slate-500 text-[11px] leading-relaxed block">
                        {isIndonesian ? "Mencegah penyalahgunaan nama perusahaan oleh pihak luar." : "Prevents unauthorized third parties from spoofing your corporate brand."}
                      </span>
                    </div>
                  </li>

                  <li className="flex items-start space-x-2.5">
                    <div className="h-5 w-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="h-3 w-3" />
                    </div>
                    <div>
                      <strong className="text-slate-800 block text-[11.5px]">
                        {isIndonesian ? "Pengiriman Notifikasi Instan" : "Instant Direct-to-Inbox Alerts"}
                      </strong>
                      <span className="text-slate-500 text-[11px] leading-relaxed block">
                        {isIndonesian ? "Menerima konfirmasi jadwal interview langsung di inbox email." : "Receive calendar invites and candidate RSVPs directly to your work inbox."}
                      </span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 2: Visual Branding & Assets (HR Photo & Company Logo) */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <Camera className="h-5 w-5 text-blue-600" />
                  <span>{isIndonesian ? "Foto Profil HR & Identitas Visual Perusahaan" : "HR Profile Photo & Company Visual Branding"}</span>
                </h3>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  {isIndonesian 
                    ? "Unggah foto profil perwakilan HR dan logo resmi perusahaan langsung dari perangkat Anda." 
                    : "Upload your HR representative headshot and official company logo directly from your device."}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-xl border border-slate-100">
                  {isIndonesian ? "Maksimal 5MB (JPG, PNG, WebP)" : "Max 5MB (JPG, PNG, WebP)"}
                </span>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 items-start">
              
              {/* Card 1: HR Recruiter Headshot */}
              <div className="bg-slate-50/80 rounded-2xl border border-slate-200/70 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                    {isIndonesian ? "Foto Profil Perwakilan HR" : "HR Representative Headshot"}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">Rasio 1:1</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  <div className="relative group shrink-0">
                    <img 
                      src={profileAvatar} 
                      alt={profileFullName} 
                      className="h-24 w-24 rounded-2xl object-cover border-2 border-white shadow-md ring-1 ring-slate-200"
                    />
                    <button
                      onClick={() => recruiterFileInputRef.current?.click()}
                      title={isIndonesian ? "Pilih foto HR baru" : "Select new HR photo"}
                      className="absolute -bottom-2 -right-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-xl shadow-md border border-white cursor-pointer transition-all hover:scale-105"
                    >
                      <Camera className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="flex-1 text-center sm:text-left space-y-1">
                    <h4 className="font-extrabold text-slate-900 text-sm">{profileFullName}</h4>
                    <p className="text-[11px] text-slate-500 font-bold">{profileHrJobTitle}</p>
                    <div className="pt-1 flex flex-wrap justify-center sm:justify-start gap-2">
                      <button
                        onClick={handleResetRecruiterAvatar}
                        className="py-1 px-2.5 text-[11px] font-bold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 cursor-pointer transition-all inline-flex items-center gap-1"
                      >
                        <RefreshCw className="h-3 w-3 text-slate-400" />
                        <span>{isIndonesian ? "Reset Default" : "Reset Default"}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Dropzone for HR Photo */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDraggingRecruiterAvatar(true); }}
                  onDragLeave={() => setIsDraggingRecruiterAvatar(false)}
                  onDrop={handleRecruiterAvatarDrop}
                  onClick={() => recruiterFileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-2 ${
                    isDraggingRecruiterAvatar 
                      ? "border-blue-500 bg-blue-50/70 scale-[1.01]" 
                      : "border-slate-200 bg-white hover:bg-slate-100/60 hover:border-slate-300"
                  }`}
                >
                  <input
                    ref={recruiterFileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleRecruiterAvatarFileUpload}
                    className="hidden"
                  />
                  <div className="h-9 w-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-2xs">
                    <Upload className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-slate-800">
                      {isIndonesian ? "Klik atau seret foto HR ke sini" : "Click or drag HR photo here"}
                    </p>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                      {isIndonesian ? "PNG, JPG, WebP (Maks. 5MB)" : "PNG, JPG, WebP (Max 5MB)"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 2: Company Official Logo */}
              <div className="bg-slate-50/80 rounded-2xl border border-slate-200/70 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                    {isIndonesian ? "Logo Resmi Perusahaan" : "Official Corporate Logo"}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">Square / Transparent</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  <div className="relative group shrink-0">
                    <img 
                      src={profileCompanyLogo} 
                      alt={recruiter.companyName} 
                      className="h-24 w-24 rounded-2xl object-cover border-2 border-white shadow-md ring-1 ring-slate-200 bg-white"
                    />
                    <button
                      onClick={() => companyLogoFileInputRef.current?.click()}
                      title={isIndonesian ? "Pilih logo perusahaan baru" : "Select new company logo"}
                      className="absolute -bottom-2 -right-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-xl shadow-md border border-white cursor-pointer transition-all hover:scale-105"
                    >
                      <Camera className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="flex-1 text-center sm:text-left space-y-1">
                    <h4 className="font-extrabold text-slate-900 text-sm">{recruiter.companyName}</h4>
                    <p className="text-[11px] text-slate-500 font-bold">{profileLocation}</p>
                    <div className="pt-1 flex flex-wrap justify-center sm:justify-start gap-2">
                      <button
                        onClick={handleResetCompanyLogo}
                        className="py-1 px-2.5 text-[11px] font-bold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 cursor-pointer transition-all inline-flex items-center gap-1"
                      >
                        <RefreshCw className="h-3 w-3 text-slate-400" />
                        <span>{isIndonesian ? "Reset Default" : "Reset Default"}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Dropzone for Company Logo */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDraggingCompanyLogo(true); }}
                  onDragLeave={() => setIsDraggingCompanyLogo(false)}
                  onDrop={handleCompanyLogoDrop}
                  onClick={() => companyLogoFileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-2 ${
                    isDraggingCompanyLogo 
                      ? "border-blue-500 bg-blue-50/70 scale-[1.01]" 
                      : "border-slate-200 bg-white hover:bg-slate-100/60 hover:border-slate-300"
                  }`}
                >
                  <input
                    ref={companyLogoFileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleCompanyLogoFileUpload}
                    className="hidden"
                  />
                  <div className="h-9 w-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-2xs">
                    <Upload className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-slate-800">
                      {isIndonesian ? "Klik atau seret logo perusahaan ke sini" : "Click or drag company logo here"}
                    </p>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                      {isIndonesian ? "PNG Transparan, JPG, WebP (Maks. 5MB)" : "Transparent PNG, JPG, WebP (Max 5MB)"}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Section 3: Recruitment Notifications & Sourcing Alerts */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Bell className="h-4 w-4 text-blue-600" />
                  <span>{isIndonesian ? "Preferensi Notifikasi & Peringatan Perekrutan" : "Recruitment Notification & Sourcing Alerts"}</span>
                </h3>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  {isIndonesian 
                    ? "Kelola bagaimana Anda menerima pemberitahuan tanggapan kandidat, wawancara, dan lowongan kerja." 
                    : "Manage how you receive real-time notifications for candidate responses, interviews, and applications."}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              
              {/* Toggle 1: Interview Accepts */}
              <div className="flex items-start justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200/60">
                <div className="space-y-1 pr-3">
                  <span className="font-extrabold text-slate-900 text-xs block">
                    {isIndonesian ? "Pemberitahuan Tawaran Wawancara" : "Interview Proposal Alerts"}
                  </span>
                  <span className="text-[11px] text-slate-500 font-semibold leading-relaxed block">
                    {isIndonesian ? "Kirimkan email instan saat kandidat menerima, menjadwalkan, atau menolak undangan wawancara." : "Send email alerts when candidates accept, reschedule, or decline interview proposals."}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setNotifyInterviewAccepts(!notifyInterviewAccepts)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    notifyInterviewAccepts ? "bg-blue-600" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      notifyInterviewAccepts ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Toggle 2: Candidate Messages */}
              <div className="flex items-start justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200/60">
                <div className="space-y-1 pr-3">
                  <span className="font-extrabold text-slate-900 text-xs block">
                    {isIndonesian ? "Pesan & Tanggapan Langsung Kandidat" : "Direct Candidate Inquiries"}
                  </span>
                  <span className="text-[11px] text-slate-500 font-semibold leading-relaxed block">
                    {isIndonesian ? "Beri tahu saya saat ada pesan baru atau pertanyaan langsung dari talenta." : "Notify me immediately on new direct messages or questions from sourced talent."}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setNotifyCandidateMessages(!notifyCandidateMessages)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    notifyCandidateMessages ? "bg-blue-600" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      notifyCandidateMessages ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Toggle 3: New Applications */}
              <div className="flex items-start justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200/60">
                <div className="space-y-1 pr-3">
                  <span className="font-extrabold text-slate-900 text-xs block">
                    {isIndonesian ? "Lamaran Masuk pada Lowongan Terbuka" : "New Candidate Job Applications"}
                  </span>
                  <span className="text-[11px] text-slate-500 font-semibold leading-relaxed block">
                    {isIndonesian ? "Pemberitahuan saat ada kandidat baru yang melamar pada lowongan aktif perusahaan." : "Receive alerts when candidates submit new applications to your active job postings."}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setNotifyNewApplications(!notifyNewApplications)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    notifyNewApplications ? "bg-blue-600" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      notifyNewApplications ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Toggle 4: Weekly Digest */}
              <div className="flex items-start justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200/60">
                <div className="space-y-1 pr-3">
                  <span className="font-extrabold text-slate-900 text-xs block">
                    {isIndonesian ? "Ringkasan Mingguan Kumpulan Talenta" : "Weekly Talent Pool Digest"}
                  </span>
                  <span className="text-[11px] text-slate-500 font-semibold leading-relaxed block">
                    {isIndonesian ? "Dapatkan email berkala berisi kandidat baru dengan skor kecocokan tinggi setiap pekan." : "Receive a weekly curated email of newly available top-tier candidates matching your industry."}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setNotifyWeeklyDigest(!notifyWeeklyDigest)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    notifyWeeklyDigest ? "bg-blue-600" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      notifyWeeklyDigest ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleSaveNotificationPreferences}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer inline-flex items-center gap-1.5"
              >
                <Check className="h-4 w-4" />
                <span>{isIndonesian ? "Simpan Preferensi Notifikasi" : "Save Notification Preferences"}</span>
              </button>
            </div>
          </div>

          {/* Section 4: Password & Account Security */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <KeyRound className="h-4 w-4 text-blue-600" />
                  <span>{isIndonesian ? "Keamanan Akun & Perubahan Kata Sandi" : "Account Security & Password Management"}</span>
                </h3>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  {isIndonesian 
                    ? "Perbarui kata sandi akun rekruter Anda secara berkala untuk menjaga keamanan data perusahaan." 
                    : "Regularly update your recruiter account password to safeguard corporate data."}
                </p>
              </div>
            </div>

            {passwordFeedbackMsg && (
              <div className={`p-4 rounded-2xl text-xs font-bold flex items-center space-x-2 animate-fade-in ${
                passwordFeedbackMsg.isError 
                  ? "bg-rose-50 text-rose-700 border border-rose-200" 
                  : "bg-emerald-50 text-emerald-700 border border-emerald-200"
              }`}>
                {passwordFeedbackMsg.isError ? (
                  <X className="h-4 w-4 text-rose-600 shrink-0" />
                ) : (
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                )}
                <span>{passwordFeedbackMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleUpdatePassword} className="grid md:grid-cols-3 gap-5">
              
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
                    placeholder="••••••••"
                    className="w-full border border-slate-200 rounded-xl p-3 pr-10 bg-slate-50 text-xs font-bold text-slate-800 focus:bg-white focus:outline-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                  {isIndonesian ? "Kata Sandi Baru" : "New Password"}
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder={isIndonesian ? "Minimal 8 karakter" : "Min. 8 characters"}
                    className="w-full border border-slate-200 rounded-xl p-3 pr-10 bg-slate-50 text-xs font-bold text-slate-800 focus:bg-white focus:outline-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                  {isIndonesian ? "Konfirmasi Kata Sandi Baru" : "Confirm New Password"}
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={isIndonesian ? "Ulangi kata sandi baru" : "Repeat new password"}
                    className="w-full border border-slate-200 rounded-xl p-3 pr-10 bg-slate-50 text-xs font-bold text-slate-800 focus:bg-white focus:outline-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="md:col-span-3 pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-[11px] text-slate-400 font-semibold">
                  {isIndonesian 
                    ? "Gunakan kombinasi huruf besar, angka, dan simbol untuk keamanan maksimal." 
                    : "Use a strong combination of uppercase letters, numbers, and symbols for best security."}
                </p>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer inline-flex items-center justify-center gap-1.5"
                >
                  <Lock className="h-3.5 w-3.5" />
                  <span>{isIndonesian ? "Perbarui Kata Sandi" : "Update Password"}</span>
                </button>
              </div>

            </form>
          </div>

          {/* Section 5: Company Profile & Legal Identity Overview */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-blue-600" />
                  <span>{isIndonesian ? "Ringkasan Data Legalitas & Perusahaan" : "Corporate Profile & Legal Identity Overview"}</span>
                </h3>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  {isIndonesian 
                    ? "Informasi profil perusahaan yang tampil pada lowongan kerja dan dilihat oleh talenta kandidat." 
                    : "Company parameters and official information displayed across job postings to candidates."}
                </p>
              </div>
              <button
                onClick={() => setSubTab("profile")}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 cursor-pointer"
              >
                <span>{isIndonesian ? "Kelola di Profil Lengkap" : "Manage in Full Profile"}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-semibold">
              
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 space-y-1">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                  {isIndonesian ? "Nama Perusahaan" : "Company Name"}
                </span>
                <p className="font-extrabold text-slate-900 text-sm truncate">{recruiter.companyName}</p>
                <p className="text-[10px] text-slate-500 font-bold">{recruiter.industry || "Teknologi & Produk Digital"}</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 space-y-1">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                  {isIndonesian ? "Nomor Legalitas (NIB)" : "Registration (NIB)"}
                </span>
                <p className="font-mono font-bold text-slate-800 truncate">{recruiter.companyRegistrationNumber || "NIB-8829471920"}</p>
                <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>{isIndonesian ? "Terverifikasi Resmi" : "Officially Verified"}</span>
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 space-y-1">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                  {isIndonesian ? "Ukuran Perusahaan" : "Company Size"}
                </span>
                <p className="font-bold text-slate-800">{profileCompanySize}</p>
                <p className="text-[10px] text-slate-500 font-bold">{profileLocation}</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 space-y-1">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                  {isIndonesian ? "Website & Brand" : "Website & Brand"}
                </span>
                <p className="font-bold text-slate-800 truncate">{profileCompanyWebsite || "https://company.id"}</p>
                <a 
                  href={profileCompanyWebsite ? (profileCompanyWebsite.startsWith("http") ? profileCompanyWebsite : `https://${profileCompanyWebsite}`) : "#"} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-[10px] text-blue-600 hover:underline font-bold inline-flex items-center gap-0.5"
                >
                  <span>{isIndonesian ? "Kunjungi Website" : "Visit Website"}</span>
                  <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
}
