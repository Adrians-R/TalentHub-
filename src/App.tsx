/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import CandidateDashboard from "./components/CandidateDashboard";
import RecruiterDashboard from "./components/RecruiterDashboard";
import AdminPanel from "./components/AdminPanel";
import DatabaseSchemaView from "./components/DatabaseSchemaView";
import ApiReferenceView from "./components/ApiReferenceView";
import TrainingView from "./components/TrainingView";
import CareerArticlesView from "./components/CareerArticlesView";
import ProgramsView from "./components/ProgramsView";
import BrowseTalentView from "./components/BrowseTalentView";
import CandidateJobSearchView from "./components/CandidateJobSearchView";
import DeveloperDocsView from "./components/DeveloperDocsView";
import LoginView from "./components/auth/LoginView";
import RegisterView from "./components/auth/RegisterView";
import ForgotPasswordView from "./components/auth/ForgotPasswordView";
import ResetPasswordView from "./components/auth/ResetPasswordView";
import EmailVerificationView from "./components/auth/EmailVerificationView";
import SupportChatWidget from "./components/SupportChatWidget";
// [PAID_FEATURE_TOGGLE] PricingView import commented out for Free Trial. Uncomment below to restore:
// import PricingView from "./components/PricingView";

import { 
  MOCK_CANDIDATES, 
  MOCK_RECRUITERS, 
  MOCK_INVITATIONS, 
  MOCK_MESSAGES, 
  MOCK_TRAININGS, 
  MOCK_SCHOLARSHIPS,
  MOCK_INTERNSHIPS,
  MOCK_ARTICLES,
  MOCK_SCHOLARSHIP_APPLICATIONS
} from "./data/mockData";
import { Candidate, Recruiter, Invitation, Message, TrainingProgram, Scholarship, Internship, CareerArticle, EnrolledTraining, CandidateScholarshipApplication } from "./types";
import { Bell, X, Check, ArrowRight } from "lucide-react";

interface NotificationItem {
  id: string;
  title: string;
  body: string;
  time: string;
  unread: boolean;
}

export default function App() {
  // Global Roles & Tab States
  const [currentRole, setCurrentRole] = useState<"candidate" | "recruiter" | "admin">("candidate");
  const [activeTab, setActiveTab] = useState<string>("landing");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Authentication Module States
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try {
      const stored = localStorage.getItem("talenthub_user");
      return !!stored;
    } catch {
      return false;
    }
  });
  const [currentUser, setCurrentUser] = useState<any | null>(() => {
    try {
      const stored = localStorage.getItem("talenthub_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [authLoading, setAuthLoading] = useState(true);

  // Parse state-based route path and query parameters
  const getTabPathAndParams = (tabString: string) => {
    const [path, paramStr] = tabString.split("?");
    const params: Record<string, string> = {};
    if (paramStr) {
      paramStr.split("&").forEach((p) => {
        const [k, v] = p.split("=");
        if (k && v) {
          params[k] = decodeURIComponent(v);
        }
      });
    }
    return { path, params };
  };

  const { path: tabPath, params: tabParams } = getTabPathAndParams(activeTab);

  // Authenticate user session on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("talenthub_session_token");
    const headers: Record<string, string> = {};
    if (savedToken) {
      headers["Authorization"] = `Bearer ${savedToken}`;
      headers["X-Session-Id"] = savedToken;
    }

    fetch("/api/auth/me", {
      headers,
      credentials: "include"
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("No active session");
      })
      .then((data) => {
        setIsLoggedIn(true);
        setCurrentUser(data.user);
        setCurrentRole(data.user.role);
        try {
          localStorage.setItem("talenthub_user", JSON.stringify(data.user));
          if (data.token || data.sessionId) {
            localStorage.setItem("talenthub_session_token", data.token || data.sessionId);
          }
        } catch {}
        // Automatically route to workspace dashboard from landing or auth
        if (activeTab === "landing" || activeTab === "login" || activeTab === "register") {
          setActiveTab(`${data.user.role}-dashboard`);
        }
      })
      .catch(() => {
        const stored = localStorage.getItem("talenthub_user");
        if (!stored) {
          setIsLoggedIn(false);
          setCurrentUser(null);
        }
      })
      .finally(() => {
        setAuthLoading(false);
      });
  }, []);

  // DB Collection States
  const [candidates, setCandidates] = useState<Candidate[]>(MOCK_CANDIDATES);
  const [recruiters, setRecruiters] = useState<Recruiter[]>(MOCK_RECRUITERS);
  const [invitations, setInvitations] = useState<Invitation[]>(MOCK_INVITATIONS);
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [trainings, setTrainings] = useState<TrainingProgram[]>(MOCK_TRAININGS);
  const [scholarships, setScholarships] = useState<Scholarship[]>(MOCK_SCHOLARSHIPS);
  const [internships, setInternships] = useState<Internship[]>(MOCK_INTERNSHIPS);
  const [articles] = useState<CareerArticle[]>(MOCK_ARTICLES);
  const [scholarshipApplications, setScholarshipApplications] = useState<CandidateScholarshipApplication[]>(MOCK_SCHOLARSHIP_APPLICATIONS);

  // Floating Notifications state
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    { id: "notif_1", title: "Elena viewed your portfolio", body: " Elena Rostova from TechCorp Global recently reviewed your payment-hub case study.", time: "1 hr ago", unread: true },
    { id: "notif_2", title: "New Interview Pitch Received!", body: "GoVentures Tech sent you a direct Sourcing Invitation for a Frontend Internship.", time: "1 day ago", unread: true }
  ]);

  // Load data dynamically from backend database
  useEffect(() => {
    // Load programs (trainings, scholarships, internships)
    fetch("/api/programs")
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.trainings && data.trainings.length > 0) setTrainings(data.trainings);
        if (data?.scholarships && data.scholarships.length > 0) setScholarships(data.scholarships);
        if (data?.internships && data.internships.length > 0) setInternships(data.internships);
      })
      .catch(() => {
        // Fallbacks silently maintained
      });
    // Always load all candidates for search and landing catalog
    fetch("/api/candidates/all")
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.candidates && data.candidates.length > 0) {
          setCandidates(data.candidates);
        }
      })
      .catch(() => {
        // Keep default fallback candidates silently
      });

    // Load invitations
    fetch("/api/candidates/invitations")
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.invitations) {
          setInvitations(data.invitations);
        }
      })
      .catch(() => {
        // Keep default fallback invitations silently
      });

    // Load notifications
    fetch("/api/candidates/notifications")
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.notifications) {
          setNotifications(data.notifications);
        }
      })
      .catch(() => {
        // Keep default fallback notifications silently
      });

    // Load messages
    fetch("/api/candidates/messages")
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.messages && data.messages.length > 0) {
          setMessages(data.messages);
        }
      })
      .catch(() => {});

    // Load recruiters
    fetch("/api/admin/recruiters")
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.recruiters && data.recruiters.length > 0) {
          setRecruiters(data.recruiters);
        }
      })
      .catch(() => {
        // Keep default fallback recruiters silently
      });
  }, [isLoggedIn]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Sync unread notification counts
  const unreadCount = notifications.filter(n => n.unread).length;

  // Handler: Update Candidate profile metrics
  const handleUpdateCandidate = (updated: Candidate) => {
    // Optimistic local state update
    setCandidates(prev => prev.map(c => c.id === updated.id ? updated : c));

    fetch(`/api/candidates/${updated.id || "me"}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated)
    })
      .then(res => {
        if (!res.ok) {
          return fetch("/api/candidates/me", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updated)
          }).then(r => r.json());
        }
        return res.json();
      })
      .then(data => {
        if (data?.candidate) {
          setCandidates(prev => prev.map(c => c.id === data.candidate.id ? data.candidate : c));
        }
      })
      .catch(e => {
        console.warn("Notice: Candidate persistence fallback engaged:", e);
      });
  };

  // Handler: Verify Candidate (Admin feature)
  const handleVerifyCandidate = (candidateId: string) => {
    setCandidates(prev => prev.map(c => {
      if (c.id === candidateId) {
        return { 
          ...c, 
          verified: true,
          profileCompletion: 100 // Boost completion upon verification
        };
      }
      return c;
    }));

    // Post system notification
    const targetCand = candidates.find(c => c.id === candidateId);
    if (targetCand) {
      setNotifications(prev => [
        {
          id: `notif_sys_${Date.now()}`,
          title: "Identity Verified Badged!",
          body: `Congratulations ${targetCand.fullName}! Our moderation team verified your credentials. Your profile ranking is boosted.`,
          time: "Just now",
          unread: true
        },
        ...prev
      ]);
    }
  };

  // Handler: Verify Recruiter / HR Accreditation (Admin feature)
  const handleVerifyRecruiter = (recruiterId: string, action: "approve" | "reject", updatedRecruiter?: Recruiter) => {
    const isApproved = action === "approve";
    setRecruiters(prev => prev.map(r => {
      if (r.id === recruiterId || r.email.toLowerCase() === recruiterId.toLowerCase()) {
        return updatedRecruiter || {
          ...r,
          hrVerified: isApproved,
          hrVerificationStatus: isApproved ? "verified" : "pending_review",
          hrVerificationTier: isApproved ? "verified_admin" : "pending_manual_review"
        };
      }
      return r;
    }));

    if (currentUser && (currentUser.id === recruiterId || currentUser.email.toLowerCase() === recruiterId.toLowerCase())) {
      setCurrentUser(prev => prev ? {
        ...prev,
        hrVerified: isApproved,
        hrVerificationStatus: isApproved ? "verified" : "pending_review",
        hrVerificationTier: isApproved ? "verified_admin" : "pending_manual_review"
      } : prev);
    }
  };

  // Handler: Update Recruiter profile/subscription
  const handleUpdateRecruiter = (updated: Recruiter) => {
    setRecruiters(prev => prev.map(r => r.id === updated.id ? updated : r));
    setCurrentUser(prev => prev ? ({ ...prev, ...updated }) : null);
  };

  // Handler: Enroll Candidate into Training Program
  const handleEnrollTraining = (
    training: TrainingProgram,
    paymentDetails?: { method: string; amount: number; platformFee: number }
  ) => {
    const targetCand = candidates.find(
      c => c.id === currentUser?.id || (currentUser?.email && c.email?.toLowerCase() === currentUser.email.toLowerCase())
    ) || candidates.find(c => c.id === "cand_1") || candidates[0];

    if (!targetCand) return;

    const isPaid = (training.price ?? 0) > 0;
    const platformFee = isPaid ? (paymentDetails?.platformFee ?? Math.round((training.price ?? 0) * (training.platformFeeRate ?? 0.10))) : 0;
    const providerShare = isPaid ? (training.price ?? 0) - platformFee : 0;
    const invNumber = isPaid 
      ? `INV-PAY-${Date.now().toString().slice(-6)}` 
      : `INV-FREE-${Date.now().toString().slice(-6)}`;

    const newEnrollment: EnrolledTraining = {
      id: `enr_${Date.now()}`,
      trainingId: training.id,
      trainingTitle: training.title,
      provider: training.provider,
      providerLogo: training.providerLogo,
      format: training.format,
      type: training.type,
      price: training.price ?? 0,
      platformFee,
      providerShare,
      paymentStatus: isPaid ? "paid" : "free",
      paymentMethod: paymentDetails?.method || (isPaid ? "QRIS Instant" : "Beasiswa"),
      invoiceNumber: invNumber,
      enrolledAt: new Date().toISOString().split("T")[0],
      status: "in_progress",
      progressPercentage: 15,
      completedModulesCount: 1,
      totalModulesCount: training.syllabus?.length || 4,
      schedule: training.schedule,
      startDate: training.startDate,

      // Offline credentials
      qrTicketCode: training.format !== "Online" ? `TICKET-OFFLINE-${Math.floor(100000 + Math.random() * 900000)}` : undefined,
      venueName: training.venueName,
      venueRoom: training.venueRoom,
      venueAddress: training.venueAddress,
      venueCity: training.venueCity,
      venueGoogleMapsUrl: training.venueGoogleMapsUrl,
      venueGuidelines: training.venueGuidelines,

      // Online credentials
      onlineMeetingPlatform: training.onlineMeetingPlatform || (training.format !== "Offline" ? "Google Meet" : undefined),
      onlineMeetingUrl: training.onlineMeetingUrl || (training.format !== "Offline" ? "https://meet.google.com/dts-talenthub-2026" : undefined),
      lmsUrl: training.lmsUrl || (training.format !== "Offline" ? "https://talenthub.id/lms" : undefined),
      communityGroupUrl: training.communityGroupUrl
    };

    const existing = targetCand.enrolledTrainings || [];
    const updatedCandidate: Candidate = {
      ...targetCand,
      enrolledTrainings: [newEnrollment, ...existing.filter(e => e.trainingId !== training.id)]
    };

    handleUpdateCandidate(updatedCandidate);

    // Floating Notification
    const notifMsg: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: isPaid ? "Pembayaran & Pendaftaran Berhasil!" : "Pendaftaran Pelatihan Berhasil!",
      body: `Anda resmi terdaftar di ${training.title} (${training.format}). ${training.format === "Offline" ? "Lihat QR Tiket Masuk di dasbor Anda." : "Akses ruang kelas Google Meet siap digunakan."}`,
      time: "Baru saja",
      unread: true
    };
    setNotifications(prev => [notifMsg, ...prev]);
  };

  // Handler: Candidate Submits Official Scholarship Application
  const handleApplyScholarship = (newApp: CandidateScholarshipApplication) => {
    setScholarshipApplications(prev => [newApp, ...prev.filter(a => a.id !== newApp.id)]);

    // Attach to candidate's profile
    setCandidates(prev => prev.map(c => {
      if (c.id === newApp.candidateId || (currentUser?.email && c.email?.toLowerCase() === currentUser.email.toLowerCase())) {
        const existingApps = c.scholarshipApplications || [];
        return {
          ...c,
          scholarshipApplications: [newApp, ...existingApps.filter(a => a.id !== newApp.id)]
        };
      }
      return c;
    }));

    // Floating Notification
    const notifMsg: NotificationItem = {
      id: `notif_sch_${Date.now()}`,
      title: "Pengajuan Beasiswa Diterima!",
      body: `Aplikasi Anda untuk "${newApp.trainingTitle}" berhasil dikirim dan dalam antrean kurasi.`,
      time: "Baru saja",
      unread: true
    };
    setNotifications(prev => [notifMsg, ...prev]);
  };

  // Handler: Admin Reviews Scholarship Application
  const handleUpdateScholarshipApplication = (
    appId: string, 
    status: "under_review" | "interview_scheduled" | "approved" | "rejected", 
    adminFeedback?: string
  ) => {
    setScholarshipApplications(prev => prev.map(a => {
      if (a.id === appId) {
        const updated: CandidateScholarshipApplication = {
          ...a,
          status,
          adminFeedback: adminFeedback || a.adminFeedback,
          reviewedAt: new Date().toISOString().split("T")[0],
          reviewedBy: "Super Admin TalentHub"
        };

        // If approved, automatically enroll the candidate into the training
        if (status === "approved") {
          const targetTraining = trainings.find(t => t.id === a.trainingId);
          if (targetTraining) {
            handleEnrollTraining(targetTraining, { method: "Beasiswa Penuh (Funded)", amount: 0, platformFee: 0 });
          }
        }
        return updated;
      }
      return a;
    }));

    // Also sync candidate profile
    setCandidates(prev => prev.map(c => {
      if (c.scholarshipApplications && c.scholarshipApplications.some(a => a.id === appId)) {
        return {
          ...c,
          scholarshipApplications: c.scholarshipApplications.map(a => 
            a.id === appId 
              ? { ...a, status, adminFeedback: adminFeedback || a.adminFeedback, reviewedAt: new Date().toISOString().split("T")[0], reviewedBy: "Super Admin TalentHub" } 
              : a
          )
        };
      }
      return c;
    }));
  };

  const activeCandidate = candidates.find(c => c.id === currentUser?.id || (currentUser?.email && c.email?.toLowerCase() === currentUser.email.toLowerCase())) || candidates[0];
  const activeRecruiter = recruiters.find(r => r.id === currentUser?.id || (currentUser?.email && r.email?.toLowerCase() === currentUser.email.toLowerCase())) || recruiters[0];

  // Handler: Update Invitation Status (Accept/Reject)
  const handleUpdateInvitationStatus = (invitationId: string, status: "accepted" | "rejected" | "scheduled") => {
    // Optimistic UI update
    setInvitations(prev => prev.map(i => {
      if (i.id === invitationId) {
        return { 
          ...i, 
          status,
          interviewLink: status === "accepted" ? "https://meet.google.com/xyz-pdqr-abc" : i.interviewLink
        };
      }
      return i;
    }));

    fetch(`/api/candidates/invitations/${invitationId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        status,
        scheduledDate: status === "accepted" ? new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 16) : undefined,
        interviewLink: status === "accepted" ? "https://meet.google.com/xyz-pdqr-abc" : undefined
      })
    })
      .then(res => {
        if (!res.ok) throw new Error("Status update failed");
        return res.json();
      })
      .then(data => {
        if (data.invitation) {
          setInvitations(prev => prev.map(i => i.id === data.invitation.id ? data.invitation : i));
          
          // Force refresh dynamic notifications
          fetch("/api/candidates/notifications")
            .then(r => r.json())
            .then(nData => {
              if (nData.notifications) setNotifications(nData.notifications);
            });
        }
      })
      .catch(e => console.error("Error accepting/declining invitation:", e));
  };

  // Handler: Send Sourcing chat messages
  const handleSendMessage = (invitationId: string, content: string) => {
    if (!content || !content.trim()) return;

    const isRecruiter = currentUser?.role === "recruiter" || currentRole === "recruiter";
    const senderRole: "candidate" | "recruiter" = isRecruiter ? "recruiter" : "candidate";
    const tempId = `msg_temp_${Date.now()}`;
    const newMsg: Message = {
      id: tempId,
      invitationId,
      senderRole,
      content: content.trim(),
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, newMsg]);

    const primaryEndpoint = isRecruiter ? "/api/recruiters/messages" : "/api/candidates/messages";
    const fallbackEndpoint = isRecruiter ? "/api/candidates/messages" : "/api/recruiters/messages";

    fetch(primaryEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ invitationId, content: content.trim(), senderRole })
    })
      .then(res => {
        if (!res.ok) {
          return fetch(fallbackEndpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ invitationId, content: content.trim(), senderRole })
          });
        }
        return res;
      })
      .then(res => {
        if (!res.ok) throw new Error("Transmit message failed");
        return res.json();
      })
      .then(data => {
        if (data?.message) {
          setMessages(prev => prev.map(m => m.id === tempId ? data.message : m));

          // Refresh counterpart messages and notifications after simulation
          setTimeout(() => {
            fetch(`/api/candidates/messages/${invitationId}`)
              .then(r => r.ok ? r.json() : null)
              .then(mData => {
                if (mData?.messages) setMessages(mData.messages);
              })
              .catch(() => {});

            fetch("/api/candidates/notifications")
              .then(r => r.ok ? r.json() : null)
              .then(nData => {
                if (nData?.notifications) setNotifications(nData.notifications);
              })
              .catch(() => {});
          }, 2200);
        }
      })
      .catch(e => {
        console.warn("Notice sending message:", e);
      });
  };

  // Handler: Recruiter dispatches a new direct invitation pitch
  const handleSendInvitation = (newInv: Omit<Invitation, "id" | "createdAt" | "status">) => {
    const inviteId = `inv_gen_${Date.now()}`;
    const formattedInvite: Invitation = {
      ...newInv,
      id: inviteId,
      createdAt: new Date().toISOString(),
      status: "pending"
    };

    setInvitations(prev => [formattedInvite, ...prev]);

    // Persist to backend
    fetch("/api/recruiters/invitations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: inviteId,
        candidateId: newInv.candidateId,
        position: newInv.position,
        message: newInv.message,
        salaryOffer: newInv.salaryOffer,
        interviewLink: newInv.interviewLink,
        scheduledDate: newInv.scheduledDate
      })
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.invitation) {
          setInvitations(prev => prev.map(i => i.id === inviteId ? data.invitation : i));
        }
      })
      .catch(() => {});

    // Trigger a matching candidate inbox notification
    const candidateObj = candidates.find(c => c.id === newInv.candidateId);
    if (candidateObj) {
      setNotifications(prev => [
        {
          id: `notif_dispatch_${Date.now()}`,
          title: "Pitch Sent Successfully",
          body: `Direct Interview Invitation dispatched to ${candidateObj.fullName} for position: ${newInv.position}.`,
          time: "Just now",
          unread: true
        },
        ...prev
      ]);
    }
  };

  // Clear or read notifications
  const handleMarkNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans text-slate-800 antialiased" id="auth-loading-screen">
        <div className="flex flex-col items-center space-y-4">
          <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Initializing Secure Workspace...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased" id="talenthub-app-container">
      
      {/* Dynamic Header / Navigation */}
      <Navbar
        currentRole={currentRole as any}
        onRoleChange={setCurrentRole}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isLoggedIn={isLoggedIn}
        onLogout={async () => {
          try {
            await fetch("/api/auth/logout", { method: "POST" });
          } catch (e) {
            console.error("Logout request failed:", e);
          }
          try {
            localStorage.removeItem("talenthub_session_token");
            localStorage.removeItem("talenthub_user");
          } catch {}
          setIsLoggedIn(false);
          setCurrentUser(null);
          setActiveTab("landing");
        }}
        onLogin={(role) => {
          if (isLoggedIn && currentUser?.role === role) {
            setActiveTab(`${role}-dashboard`);
          } else {
            setActiveTab("login");
          }
        }}
        notificationsCount={unreadCount}
        onOpenNotifications={() => setNotificationsOpen(true)}
      />

      {/* Primary Workspace Sections */}
      <main className="flex-1">
        
        {tabPath === "landing" && (
          <LandingPage
            candidates={candidates}
            trainings={trainings}
            articles={articles}
            onSearch={setSearchQuery}
            onSelectCandidate={(id) => {
              if (isLoggedIn) {
                setActiveTab("recruiter-dashboard");
              } else {
                setActiveTab("login");
              }
            }}
            onTabChange={setActiveTab}
          />
        )}

        {/* Authentication Module Pages */}
        {tabPath === "login" && (
          <LoginView
            initialEmail={tabParams.email || ""}
            onSuccess={(user, token) => {
              setIsLoggedIn(true);
              setCurrentUser(user);
              setCurrentRole(user.role);
              try {
                localStorage.setItem("talenthub_user", JSON.stringify(user));
                if (token) localStorage.setItem("talenthub_session_token", token);
              } catch {}
              setActiveTab(`${user.role}-dashboard`);
            }}
            onNavigate={setActiveTab}
          />
        )}

        {tabPath === "register" && (
          <RegisterView
            onSuccess={(email, code) => {
              setActiveTab(`verify-email?email=${encodeURIComponent(email)}${code ? `&hint=${encodeURIComponent(code)}` : ""}`);
            }}
            onNavigate={setActiveTab}
          />
        )}

        {tabPath === "forgot-password" && (
          <ForgotPasswordView
            onSuccess={(email) => {
              setActiveTab(`reset-password?email=${encodeURIComponent(email)}`);
            }}
            onNavigate={setActiveTab}
          />
        )}

        {tabPath === "reset-password" && (
          <ResetPasswordView
            initialToken={tabParams.token || ""}
            onNavigate={setActiveTab}
          />
        )}

        {tabPath === "verify-email" && (
          <EmailVerificationView
            initialEmail={tabParams.email || ""}
            initialCodeHint={tabParams.hint || ""}
            onNavigate={setActiveTab}
            onSuccess={(user, token) => {
              setIsLoggedIn(true);
              setCurrentUser(user);
              setCurrentRole(user.role);
              try {
                localStorage.setItem("talenthub_user", JSON.stringify(user));
                if (token) localStorage.setItem("talenthub_session_token", token);
              } catch {}
              setActiveTab(`${user.role}-dashboard`);
            }}
          />
        )}

        {tabPath === "candidate-dashboard" && (
          isLoggedIn && currentUser?.role === "candidate" ? (
            <CandidateDashboard
              candidate={
                candidates.find(c => c.id === currentUser?.id || (currentUser?.email && c.email.toLowerCase() === currentUser.email.toLowerCase())) || 
                candidates.find(c => c.id === "cand_1") || 
                candidates[0]
              }
              onUpdateCandidate={handleUpdateCandidate}
              invitations={invitations.filter(i => i.candidateId === (currentUser?.id || "cand_1") || i.candidateId === "cand_1")}
              onUpdateInvitationStatus={handleUpdateInvitationStatus}
              messages={messages}
              onSendMessage={handleSendMessage}
              isLoggedIn={isLoggedIn}
              currentUser={currentUser}
            />
          ) : (
            <LoginView
              onSuccess={(user, token) => {
                setIsLoggedIn(true);
                setCurrentUser(user);
                setCurrentRole(user.role);
                try {
                  localStorage.setItem("talenthub_user", JSON.stringify(user));
                  if (token) localStorage.setItem("talenthub_session_token", token);
                } catch {}
                setActiveTab("candidate-dashboard");
              }}
              onNavigate={setActiveTab}
            />
          )
        )}

        {tabPath === "recruiter-dashboard" && (
          isLoggedIn && currentUser?.role === "recruiter" ? (
            <RecruiterDashboard
              recruiter={
                recruiters.find(r => r.id === currentUser.id || (currentUser.email && r.email.toLowerCase() === currentUser.email.toLowerCase())) || {
                  id: currentUser.id || "rec_1",
                  fullName: currentUser.fullName || "HR Lead",
                  email: currentUser.email || "hr@company.com",
                  hrJobTitle: currentUser.hrJobTitle || "Lead Technical Recruiter",
                  phone: currentUser.phone || "+62 812-3456-7890",
                  companyName: currentUser.companyName || "TechCorp Global",
                  companyLogo: currentUser.companyLogo || recruiters[0]?.companyLogo || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=100&h=100",
                  companyWebsite: currentUser.companyWebsite || "https://techcorp.com",
                  location: currentUser.location || "Jakarta, Indonesia",
                  companySize: currentUser.companySize || "51-200 Karyawan",
                  companyRegistrationNumber: currentUser.companyRegistrationNumber || "",
                  hrLinkedInUrl: currentUser.hrLinkedInUrl || "",
                  companyLinkedInUrl: currentUser.companyLinkedInUrl || "",
                  companyIdDocName: currentUser.companyIdDocName || "",
                  subscriptionTier: "Premium",
                  savedCandidateIds: [],
                  hrVerified: currentUser.hrVerified ?? true,
                  hrVerificationStatus: currentUser.hrVerificationStatus ?? "verified",
                  hrVerificationTier: currentUser.hrVerificationTier,
                  hrVerificationMethod: currentUser.hrVerificationMethod,
                  authorizedDeclarationAccepted: true
                }
              }
              candidates={candidates}
              invitations={invitations}
              onSendInvitation={handleSendInvitation}
              messages={messages}
              onSendMessage={handleSendMessage}
              onUpdateCandidate={handleUpdateCandidate}
              initialSearchSkill={searchQuery}
              onUpdateRecruiter={(updated) => {
                setRecruiters(prev => prev.map(r => r.id === updated.id ? updated : r));
                setCurrentUser(prev => prev ? ({ ...prev, ...updated }) : null);
              }}
            />
          ) : (
            <LoginView
              onSuccess={(user, token) => {
                setIsLoggedIn(true);
                setCurrentUser(user);
                setCurrentRole(user.role);
                try {
                  localStorage.setItem("talenthub_user", JSON.stringify(user));
                  if (token) localStorage.setItem("talenthub_session_token", token);
                } catch {}
                setActiveTab("recruiter-dashboard");
              }}
              onNavigate={setActiveTab}
            />
          )
        )}

        {tabPath === "admin-dashboard" && (
          isLoggedIn && currentUser?.role === "admin" ? (
            <AdminPanel
              candidates={candidates}
              onVerifyCandidate={handleVerifyCandidate}
              recruiters={recruiters}
              onVerifyRecruiter={handleVerifyRecruiter}
              trainings={trainings}
              onUpdateTrainings={setTrainings}
              scholarships={scholarships}
              onUpdateScholarships={setScholarships}
              internships={internships}
              onUpdateInternships={setInternships}
              articles={articles}
              scholarshipApplications={scholarshipApplications}
              onUpdateScholarshipApplication={handleUpdateScholarshipApplication}
            />
          ) : (
            <LoginView
              onSuccess={(user, token) => {
                setIsLoggedIn(true);
                setCurrentUser(user);
                setCurrentRole(user.role);
                try {
                  localStorage.setItem("talenthub_user", JSON.stringify(user));
                  if (token) localStorage.setItem("talenthub_session_token", token);
                } catch {}
                setActiveTab("admin-dashboard");
              }}
              onNavigate={setActiveTab}
            />
          )
        )}

        {tabPath === "browse" && (
          <BrowseTalentView
            candidates={candidates}
            isLoggedIn={isLoggedIn}
            currentUser={currentUser}
            onSendInvitation={handleSendInvitation}
            onTabChange={setActiveTab}
          />
        )}

        {tabPath === "jobs" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
            <CandidateJobSearchView
              candidate={candidates.find(c => c.id === currentUser?.id) || candidates[0]}
              isLoggedIn={isLoggedIn}
              currentUser={currentUser}
              onNavigateToTab={(tab) => {
                if (tab === "dashboard" || tab === "profile" || tab === "resume") {
                  if (isLoggedIn && currentUser?.role === "candidate") {
                    setActiveTab("candidate-dashboard");
                  } else {
                    setActiveTab("login");
                  }
                } else {
                  setActiveTab(tab);
                }
              }}
            />
          </div>
        )}

        {tabPath === "dev-docs" && <DeveloperDocsView />}
        {tabPath === "erd" && <DatabaseSchemaView />}
        {tabPath === "api" && <ApiReferenceView />}
        {tabPath === "training" && (
          <TrainingView 
            trainings={trainings} 
            onTabChange={setActiveTab} 
            isLoggedIn={isLoggedIn}
            currentUser={currentUser}
            onEnrollCourse={handleEnrollTraining}
            onApplyScholarship={handleApplyScholarship}
          />
        )}
        {tabPath === "articles" && (
          <CareerArticlesView 
            articles={articles} 
            onTabChange={setActiveTab} 
          />
        )}
        {(tabPath === "programs" || tabPath === "programs-scholarships" || tabPath === "programs-internships") && (
          <ProgramsView 
            trainings={trainings} 
            scholarships={scholarships}
            internships={internships}
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
          />
        )}
        {/* [PAID_FEATURE_TOGGLE] PricingView route commented out for Free Trial. Uncomment below to restore:
        {tabPath === "pricing" && (
          <PricingView
            onTabChange={setActiveTab}
            currentUser={currentUser}
            candidate={activeCandidate}
            onUpdateCandidate={handleUpdateCandidate}
            recruiter={activeRecruiter}
            onUpdateRecruiter={handleUpdateRecruiter}
            onOpenCandidatePlanModal={() => {
              setActiveTab("candidate-dashboard");
            }}
          />
        )}
        */}
        {tabPath === "about" && (
          <div className="max-w-4xl mx-auto px-6 py-24 text-center space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="space-y-4">
              <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full uppercase tracking-widest">
                Our Mission
              </span>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight sm:text-5xl">
                Reversing the Recruitment Paradigm
              </h1>
            </div>
            <p className="text-slate-600 font-medium text-lg leading-relaxed max-w-2xl mx-auto">
              TalentHub is built for high-performance discovery. We believe elite builders shouldn't spend their days sending hundreds of cold CVs. By reversing the pipeline, we enable verified professionals to build high-contrast profiles, while allowing vetted recruiters to send direct sourcing invitations with transparent offers.
            </p>
            <div className="grid sm:grid-cols-3 gap-6 pt-8 max-w-3xl mx-auto">
              <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-xs text-left space-y-2">
                <span className="text-2xl font-black text-slate-900">100%</span>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Vetted Profiles</p>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">Every candidate's skills are verified by NGO and platform coaches.</p>
              </div>
              <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-xs text-left space-y-2">
                <span className="text-2xl font-black text-slate-900">3.4 Days</span>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg Response Time</p>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">Direct communication lines drastically cut traditional sourcing loops.</p>
              </div>
              <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-xs text-left space-y-2">
                <span className="text-2xl font-black text-slate-900">Transparent</span>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Direct Offers</p>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">No generic pitches. Every sourcing invitation specifies real salary metrics.</p>
              </div>
            </div>
            <div className="pt-8">
              <button 
                onClick={() => setActiveTab("landing")} 
                className="bg-slate-950 text-white font-semibold text-xs px-6 py-3 rounded-xl hover:bg-slate-800 shadow-xs transition-colors cursor-pointer"
              >
                Return to Home
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Floating Notifications Side drawer */}
      {notificationsOpen && (
        <div className="fixed inset-0 bg-slate-950/20 backdrop-blur-xs z-50 flex justify-end" id="notifications-overlay">
          <div className="bg-white w-full max-w-sm h-full shadow-2xl border-l border-slate-100 p-6 flex flex-col justify-between animate-slide-left">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-blue-600 animate-swing" />
                  <h3 className="font-extrabold text-slate-900 text-base">Hiring Notifications</h3>
                </div>
                <button
                  id="close-notifications-drawer"
                  onClick={() => setNotificationsOpen(false)}
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full cursor-pointer transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {notifications.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs font-semibold">
                  You are completely caught up! No new notifications.
                </div>
              ) : (
                <div className="space-y-3 max-h-[65vh] overflow-y-auto pr-1">
                  {notifications.map((n) => (
                    <div 
                      key={n.id}
                      className={`p-4 rounded-2xl border text-xs font-medium space-y-1 relative ${
                        n.unread 
                          ? "bg-blue-50/50 border-blue-150 shadow-2xs" 
                          : "bg-white border-slate-100"
                      }`}
                    >
                      {n.unread && (
                        <span className="absolute top-4 right-4 h-2 w-2 rounded-full bg-blue-600" />
                      )}
                      <h4 className="font-extrabold text-slate-900 pr-4">{n.title}</h4>
                      <p className="text-slate-500 leading-relaxed font-semibold">{n.body}</p>
                      <span className="text-[10px] text-slate-400 font-bold block pt-1">{n.time}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-3 border-t border-slate-100 pt-4">
              <button
                id="mark-all-read-btn"
                onClick={() => {
                  handleMarkNotificationsRead();
                }}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer text-center"
              >
                Mark All as Read
              </button>
              <button
                id="clear-notifications-btn"
                onClick={() => setNotifications([])}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold cursor-pointer text-center"
              >
                Clear Notification History
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Support & Inquiries Chat Bubble (Only on homepage / landing page) */}
      {tabPath === "landing" && (
        <SupportChatWidget currentUser={currentUser} />
      )}

    </div>
  );
}
