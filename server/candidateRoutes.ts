import { Router, Request, Response } from "express";
import { readDb, writeDb, NotificationItem } from "./authDb";
import { extractSessionId, parseCookies } from "./authRoutes";
import { Candidate, Invitation, Message, JobOpening, JobApplication, DEFAULT_PROFILE_IMAGE } from "../src/types";

const router = Router();

// Middleware: Authenticate Session and retrieve User
function getSessionUser(req: Request, db: any) {
  const sessionId = extractSessionId(req);
  if (sessionId) {
    const session = db.sessions?.find((s: any) => s.id === sessionId);
    if (session) {
      if (new Date(session.expiresAt).getTime() > Date.now()) {
        const user = db.users?.find((u: any) => u.id === session.userId);
        if (user) return user;
      }
    }
    const directUser = db.users?.find((u: any) => u.id === sessionId || u.email?.toLowerCase() === sessionId.toLowerCase());
    if (directUser) return directUser;
  }

  // Fallback for iframe environments with blocked 3rd-party cookies
  const candidateId = (req.headers["x-candidate-id"] as string) || req.body?.candidateId || (req.query?.candidateId as string);
  const candidateEmail = (req.headers["x-candidate-email"] as string) || req.body?.candidateEmail || (req.query?.candidateEmail as string);

  if (candidateId) {
    const user = db.users?.find((u: any) => u.id === candidateId);
    if (user) return user;
    const cand = db.candidates?.find((c: any) => c.id === candidateId);
    if (cand) {
      return {
        id: cand.id,
        fullName: cand.fullName,
        email: cand.email,
        role: "candidate"
      };
    }
  }

  if (candidateEmail) {
    const lowerEmail = candidateEmail.toLowerCase().trim();
    const user = db.users?.find((u: any) => u.email?.toLowerCase() === lowerEmail);
    if (user) return user;
    const cand = db.candidates?.find((c: any) => c.email?.toLowerCase() === lowerEmail);
    if (cand) {
      return {
        id: cand.id,
        fullName: cand.fullName,
        email: cand.email,
        role: "candidate"
      };
    }
  }

  return null;
}

// 1. GET ALL CANDIDATES (Used for landing catalog and search engine)
router.get("/all", (req: Request, res: Response) => {
  const db = readDb();
  return res.json({ candidates: db.candidates });
});

// 1b. GET CANDIDATE PROFILE BY ID
router.get("/profile/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const db = readDb();
  const candidate = (db.candidates || []).find((c: Candidate) => c.id === id);
  if (!candidate) {
    return res.status(404).json({ error: "Candidate not found" });
  }
  return res.json({ candidate });
});

// 2. GET CURRENT LOGGED-IN CANDIDATE PROFILE
router.get("/me", (req: Request, res: Response) => {
  const db = readDb();
  const user = getSessionUser(req, db);

  if (!user) {
    // Return default sandbox profile if unauthenticated
    const defaultCand = db.candidates.find(c => c.id === "cand_1") || db.candidates[0];
    return res.json({ candidate: defaultCand, isGuest: true });
  }

  // Find candidate by matching user.id, email, or cand_1
  let candidate = db.candidates.find(c => 
    c.id === user.id || 
    c.email.toLowerCase() === user.email.toLowerCase() || 
    (user.id === "cand_1" && c.id === "cand_1")
  );

  // If new candidate registered but has no profile, initialize default profile
  if (!candidate) {
    candidate = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: "",
      headline: "Aspiring Professional",
      aboutMe: "I am a newly registered candidate on TalentHub. I'm excited to showcase my skills and connect with top recruiters.",
      location: "Jakarta, Indonesia",
      nationality: "Indonesian",
      avatar: DEFAULT_PROFILE_IMAGE,
      coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200&h=400",
      website: "",
      github: "",
      linkedin: "",
      expectedSalary: "Rp 15.000.000 / bulan",
      availability: "Immediate",
      employmentType: ["Full-time"],
      preferredLocation: "Remote",
      openToWork: true,
      remote: true,
      hybrid: true,
      onsite: false,
      relocation: false,
      profileCompletion: 40,
      verified: false,
      atsScore: 50,
      skills: [],
      experience: [],
      education: [],
      certificates: [],
      portfolio: []
    };
    db.candidates.push(candidate);
    writeDb(db);
  }

  return res.json({ candidate });
});

// 3. UPDATE CURRENT CANDIDATE PROFILE (Full edit support for experience, education, skills, certificates, and settings)
router.put("/me", (req: Request, res: Response) => {
  const db = readDb();
  const user = getSessionUser(req, db);
  const updatedData = req.body || {};

  // Find candidate by user ID, updatedData ID, email, or cand_1
  let index = -1;
  if (user) {
    index = db.candidates.findIndex(c => 
      c.id === user.id || 
      c.email.toLowerCase() === user.email.toLowerCase() || 
      (user.id === "cand_1" && c.id === "cand_1")
    );
  }

  if (index === -1 && updatedData.id) {
    index = db.candidates.findIndex(c => c.id === updatedData.id);
  }

  if (index === -1 && updatedData.email) {
    index = db.candidates.findIndex(c => c.email.toLowerCase() === updatedData.email.toLowerCase());
  }

  if (index === -1) {
    index = db.candidates.findIndex(c => c.id === "cand_1");
  }

  if (index !== -1) {
    const existingCandidate = db.candidates[index];
    const mergedCandidate: Candidate = {
      ...existingCandidate,
      ...updatedData,
      id: existingCandidate.id || updatedData.id || "cand_1",
      email: existingCandidate.email || updatedData.email || "alex@rivera.com"
    };

    db.candidates[index] = mergedCandidate;
    writeDb(db);

    return res.json({ success: true, candidate: mergedCandidate });
  }

  // If candidate profile not found, create it seamlessly
  const newCandidate: Candidate = {
    ...updatedData,
    id: updatedData.id || user?.id || `cand_${Date.now()}`,
    email: updatedData.email || user?.email || "candidate@talenthub.com",
    fullName: updatedData.fullName || user?.fullName || "Candidate"
  };

  db.candidates.push(newCandidate);
  writeDb(db);

  return res.json({ success: true, candidate: newCandidate });
});

// 3b. UPDATE SPECIFIC CANDIDATE PROFILE BY ID
router.put("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const updatedData = req.body || {};
  const db = readDb();

  let index = db.candidates.findIndex(c => c.id === id);

  if (index === -1 && updatedData.id) {
    index = db.candidates.findIndex(c => c.id === updatedData.id);
  }

  if (index === -1 && updatedData.email) {
    index = db.candidates.findIndex(c => c.email.toLowerCase() === updatedData.email.toLowerCase());
  }

  if (index !== -1) {
    const existingCandidate = db.candidates[index];
    const mergedCandidate: Candidate = {
      ...existingCandidate,
      ...updatedData,
      id: existingCandidate.id
    };

    db.candidates[index] = mergedCandidate;
    writeDb(db);

    return res.json({ success: true, candidate: mergedCandidate });
  }

  const newCandidate: Candidate = {
    ...updatedData,
    id: id && id !== "me" ? id : (updatedData.id || `cand_${Date.now()}`)
  };

  db.candidates.push(newCandidate);
  writeDb(db);

  return res.json({ success: true, candidate: newCandidate });
});

// 4. GET DIRECT RECRUITER INVITATIONS
router.get("/invitations", (req: Request, res: Response) => {
  const db = readDb();
  const user = getSessionUser(req, db);

  const candidateId = user ? (user.id === "cand_1" ? "cand_1" : user.id) : "cand_1";
  const invitations = db.invitations.filter(i => i.candidateId === candidateId);

  return res.json({ invitations, isGuest: !user });
});

// 5. UPDATE INVITATION STATUS (Accept / Reject / Schedule Interview)
router.put("/invitations/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, scheduledDate, interviewLink } = req.body;
  
  const db = readDb();
  const user = getSessionUser(req, db);

  if (!user) {
    return res.status(401).json({ error: "Unauthorized." });
  }

  const index = db.invitations.findIndex(i => i.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Invitation not found." });
  }

  const invitation = db.invitations[index];

  // Verify ownership of invitation
  const candidateId = user.id === "cand_1" ? "cand_1" : user.id;
  if (invitation.candidateId !== candidateId) {
    return res.status(403).json({ error: "Forbidden. Invitation belongs to another candidate." });
  }

  invitation.status = status;
  if (scheduledDate) {
    invitation.scheduledDate = scheduledDate;
  }
  if (interviewLink) {
    invitation.interviewLink = interviewLink;
  }

  db.invitations[index] = invitation;

  // Log a custom notification item in history
  const newNotification: NotificationItem = {
    id: "notif_" + Date.now(),
    title: `Pitch status updated!`,
    body: `You updated the interview pitch for ${invitation.position} at ${invitation.companyName} to: ${status.toUpperCase()}.`,
    time: "Just now",
    unread: true
  };
  db.notifications.unshift(newNotification);

  writeDb(db);

  return res.json({ success: true, invitation });
});

// 10. GET ALL MESSAGES
router.get("/messages", (req: Request, res: Response) => {
  const db = readDb();
  return res.json({ messages: db.messages || [] });
});

// 6. GET MESSAGE FEED FOR INVITATION CHAT
router.get("/messages/:invitationId", (req: Request, res: Response) => {
  const { invitationId } = req.params;
  const db = readDb();
  const messages = (db.messages || []).filter(m => m.invitationId === invitationId);
  return res.json({ messages });
});

// 7. SEND MESSAGE TO RECRUITER / CHAT THREAD
router.post("/messages", (req: Request, res: Response) => {
  const { invitationId, content, attachmentName, senderRole: incomingRole } = req.body;
  const db = readDb();
  const user = getSessionUser(req, db);

  if (!content || !content.trim()) {
    return res.status(400).json({ error: "Message content is required." });
  }

  if (!invitationId) {
    return res.status(400).json({ error: "invitationId is required." });
  }

  // Ensure conversation invitation exists or create a virtual entry to avoid blocking conversation
  let invitation = (db.invitations || []).find(i => i.id === invitationId);
  if (!invitation) {
    invitation = {
      id: invitationId,
      recruiterId: user?.role === "recruiter" ? user.id : "rec_1",
      recruiterName: user?.role === "recruiter" ? (user.fullName || "Elena Rostova") : "Elena Rostova",
      companyName: user?.role === "recruiter" ? (user.companyName || "TechCorp Global") : "TechCorp Global",
      companyLogo: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&q=80&w=100&h=100",
      candidateId: user?.role === "candidate" ? user.id : "cand_1",
      position: "Senior Full-Stack Architect",
      message: "Direct chat session",
      salaryOffer: "Kompetitif",
      status: "pending",
      createdAt: new Date().toISOString()
    };
    if (!db.invitations) db.invitations = [];
    db.invitations.unshift(invitation);
  }

  // Determine sender role: explicit senderRole passed, or user's session role, default to candidate
  const isRecruiterSender = incomingRole === "recruiter" || user?.role === "recruiter";
  const senderRole: "candidate" | "recruiter" = isRecruiterSender ? "recruiter" : "candidate";

  const newMessage: Message = {
    id: "msg_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
    invitationId,
    senderRole,
    content: content.trim(),
    timestamp: new Date().toISOString(),
    attachmentName
  };

  if (!db.messages) db.messages = [];
  db.messages.push(newMessage);

  // Auto-respond with counterpart simulation for highly interactive and satisfying demo experience!
  setTimeout(() => {
    try {
      const refreshedDb = readDb();
      if (!refreshedDb.messages) refreshedDb.messages = [];
      if (!refreshedDb.notifications) refreshedDb.notifications = [];

      if (senderRole === "candidate") {
        // Recruiter replies back to candidate
        const recruiterResponse: Message = {
          id: "msg_rec_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
          invitationId,
          senderRole: "recruiter",
          content: `Terima kasih atas responnya! Saya akan meninjau hal ini bersama tim hiring kami dan segera mengabarkan langkah selanjutnya.`,
          timestamp: new Date().toISOString()
        };
        refreshedDb.messages.push(recruiterResponse);
        
        const recNotification: NotificationItem = {
          id: "notif_msg_" + Date.now(),
          title: `Pesan baru dari ${invitation.recruiterName || "HR Recruiter"}`,
          body: `${invitation.companyName || "Perusahaan"} membalas obrolan Anda di posisi ${invitation.position}.`,
          time: "Baru saja",
          unread: true
        };
        refreshedDb.notifications.unshift(recNotification);
      } else {
        // Candidate replies back to recruiter
        const candObj = (refreshedDb.candidates || []).find(c => c.id === invitation.candidateId);
        const candidateResponse: Message = {
          id: "msg_cand_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
          invitationId,
          senderRole: "candidate",
          content: `Halo ${invitation.recruiterName}! Terima kasih banyak atas undangannya. Saya sangat tertarik dengan posisi ${invitation.position} dan siap melanjutkan ke sesi wawancara.`,
          timestamp: new Date().toISOString()
        };
        refreshedDb.messages.push(candidateResponse);

        const candNotif: NotificationItem = {
          id: "notif_cand_" + Date.now(),
          title: `Pesan baru dari talenta ${candObj?.fullName || "Alex Rivera"}`,
          body: `${candObj?.fullName || "Kandidat"} membalas obrolan posisi ${invitation.position}.`,
          time: "Baru saja",
          unread: true
        };
        refreshedDb.notifications.unshift(candNotif);
      }

      writeDb(refreshedDb);
    } catch (e) {
      console.error("Failed to auto-simulate chat response:", e);
    }
  }, 1500);

  writeDb(db);

  return res.json({ success: true, message: newMessage });
});

// 8. GET NOTIFICATION LOGS FOR AUDIT TRAIL
router.get("/notifications", (req: Request, res: Response) => {
  const db = readDb();
  const user = getSessionUser(req, db);

  return res.json({ notifications: db.notifications || [], isGuest: !user });
});

// 9. MARK NOTIFICATIONS AS READ
router.post("/notifications/read", (req: Request, res: Response) => {
  const db = readDb();

  db.notifications.forEach(n => {
    n.unread = false;
  });

  writeDb(db);
  return res.json({ success: true });
});

// 10. GET ALL ACTIVE JOB OPENINGS WITH FILTERING & SEARCH
router.get("/jobs", (req: Request, res: Response) => {
  const db = readDb();
  const { query, location, workplaceType, employmentType, experienceLevel } = req.query;

  let rawJobs = (db.jobOpenings || []).filter(j => j.status === "active");

  if (query && typeof query === "string" && query.trim() !== "") {
    const q = query.toLowerCase().trim();
    rawJobs = rawJobs.filter(j => 
      j.title.toLowerCase().includes(q) ||
      j.companyName.toLowerCase().includes(q) ||
      (j.department && j.department.toLowerCase().includes(q)) ||
      (j.description && j.description.toLowerCase().includes(q)) ||
      (j.skills && j.skills.some(s => s.toLowerCase().includes(q)))
    );
  }

  if (location && typeof location === "string" && location.trim() !== "") {
    const loc = location.toLowerCase().trim();
    rawJobs = rawJobs.filter(j => j.location.toLowerCase().includes(loc));
  }

  if (workplaceType && typeof workplaceType === "string" && workplaceType !== "All") {
    rawJobs = rawJobs.filter(j => j.workplaceType.toLowerCase() === workplaceType.toLowerCase());
  }

  if (employmentType && typeof employmentType === "string" && employmentType !== "All") {
    rawJobs = rawJobs.filter(j => j.employmentType.toLowerCase() === employmentType.toLowerCase());
  }

  if (experienceLevel && typeof experienceLevel === "string" && experienceLevel !== "All") {
    rawJobs = rawJobs.filter(j => j.experienceLevel.toLowerCase() === experienceLevel.toLowerCase());
  }

  const jobs = rawJobs.map(j => ({
    ...j,
    applicantCount: (db.jobApplications || []).filter(a => a.jobId === j.id).length
  }));

  return res.json({ jobs });
});

// 11. GET SPECIFIC JOB OPENING DETAILS
router.get("/jobs/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const db = readDb();
  const rawJob = (db.jobOpenings || []).find(j => j.id === id);

  if (!rawJob) {
    return res.status(404).json({ error: "Job opening not found." });
  }

  const job = {
    ...rawJob,
    applicantCount: (db.jobApplications || []).filter(a => a.jobId === rawJob.id).length
  };

  return res.json({ job });
});

// 12. GET CANDIDATE'S SUBMITTED JOB APPLICATIONS
router.get("/applications", (req: Request, res: Response) => {
  const db = readDb();
  const user = getSessionUser(req, db);

  const queryCandId = (req.query.candidateId as string) || (req.headers["x-candidate-id"] as string);
  const queryCandEmail = (req.query.candidateEmail as string) || (req.headers["x-candidate-email"] as string);

  const targetId = user?.id || queryCandId;
  const targetEmail = user?.email || queryCandEmail;

  if (!targetId && !targetEmail) {
    return res.json({ applications: [], isGuest: true });
  }

  const applications = (db.jobApplications || []).filter(
    a => (targetId && (a.candidateId === targetId || a.candidateId === "cand_1")) || 
         (targetEmail && a.candidateEmail?.toLowerCase() === targetEmail.toLowerCase())
  );

  return res.json({ applications, isGuest: false });
});

// 13. APPLY TO A JOB OPENING
router.post("/jobs/:id/apply", (req: Request, res: Response) => {
  const { id } = req.params;
  const db = readDb();
  const user = getSessionUser(req, db);

  // Authentication validation check: MUST BE LOGGED IN
  if (!user) {
    return res.status(401).json({
      error: "Silakan login terlebih dahulu untuk mengajukan lamaran pekerjaan ke tim HR.",
      requireAuth: true
    });
  }

  // Role validation check: ONLY CANDIDATES OR ADMINS
  if (user.role !== "candidate" && user.role !== "admin") {
    return res.status(403).json({
      error: "Hanya akun Kandidat / Pencari Kerja yang dapat mengirimkan lamaran pekerjaan.",
      requireCandidate: true
    });
  }

  const job = (db.jobOpenings || []).find(j => j.id === id);
  if (!job) {
    return res.status(404).json({ error: "Lowongan pekerjaan tidak ditemukan." });
  }

  // Find or synthesize candidate profile for logged in candidate
  let candidate = db.candidates.find(c => c.id === user.id || c.email.toLowerCase() === user.email.toLowerCase());
  if (!candidate) {
    candidate = {
      id: user.id,
      fullName: user.fullName || "Candidate",
      email: user.email,
      phone: req.body?.candidatePhone || "+62 811-9876-5432",
      headline: "Professional Talent",
      aboutMe: "Pencari kerja aktif dan talenta terdaftar di TalentHub.",
      location: "Jakarta, Indonesia",
      nationality: "Indonesian",
      avatar: DEFAULT_PROFILE_IMAGE,
      expectedSalary: req.body?.expectedSalary || "Rp 15.000.000 / bulan",
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
    db.candidates.push(candidate);
  }

  const { coverNote, expectedSalary, resumeUrl, portfolioUrl, candidateName, candidateEmail, candidatePhone } = req.body || {};

  // Check if candidate already applied
  const existingApp = (db.jobApplications || []).find(
    a => a.jobId === id && (a.candidateId === candidate!.id || a.candidateEmail?.toLowerCase() === user.email.toLowerCase())
  );

  if (existingApp) {
    existingApp.coverNote = (coverNote && coverNote.trim()) || existingApp.coverNote;
    existingApp.expectedSalary = (expectedSalary && expectedSalary.trim()) || existingApp.expectedSalary;
    existingApp.portfolioUrl = (portfolioUrl && portfolioUrl.trim()) || existingApp.portfolioUrl;
    existingApp.appliedAt = new Date().toISOString().split("T")[0];
    existingApp.status = "reviewing";
    writeDb(db);
    return res.json({
      success: true,
      updated: true,
      message: "Lamaran pekerjaan Anda telah berhasil diperbarui dan dikirimkan kembali ke tim HR.",
      application: existingApp,
      job
    });
  }

  const newApplication: JobApplication = {
    id: `app_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    jobId: job.id,
    jobTitle: job.title,
    companyName: job.companyName,
    companyLogo: job.companyLogo,
    recruiterId: job.recruiterId,
    candidateId: candidate.id,
    candidateName: candidateName || candidate.fullName || user.fullName,
    candidateEmail: candidateEmail || candidate.email || user.email,
    candidatePhone: candidatePhone || candidate.phone || "+62 811-9876-5432",
    candidateAvatar: candidate.avatar || DEFAULT_PROFILE_IMAGE,
    candidateHeadline: candidate.headline || "Talent Candidate",
    expectedSalary: expectedSalary || candidate.expectedSalary || job.salaryFormatted,
    coverNote: coverNote || "",
    resumeUrl: resumeUrl || candidate.resumeUrl || "https://alexrivera.dev/resume.pdf",
    portfolioUrl: portfolioUrl || candidate.website || candidate.portfolio?.[0]?.websiteUrl || "https://alexrivera.dev",
    appliedAt: new Date().toISOString().split("T")[0],
    status: "applied"
  };

  if (!db.jobApplications) {
    db.jobApplications = [];
  }
  db.jobApplications.unshift(newApplication);

  // Increment applicant count on the job
  job.applicantCount = (job.applicantCount || 0) + 1;

  // Add Notification for candidate and recruiter
  const candidateNotif: NotificationItem = {
    id: "notif_app_" + Date.now(),
    title: `Lamaran Terkirim: ${job.title}`,
    body: `Lamaran Anda untuk ${job.title} di ${job.companyName} telah berhasil terkirim ke HR.`,
    time: "Just now",
    unread: true
  };
  db.notifications.unshift(candidateNotif);

  const recruiterNotif: NotificationItem = {
    id: "notif_rec_app_" + Date.now(),
    title: `Pelamar Baru: ${newApplication.candidateName}`,
    body: `${newApplication.candidateName} baru saja melamar posisi ${job.title}.`,
    time: "Just now",
    unread: true
  };
  db.notifications.unshift(recruiterNotif);

  writeDb(db);

  return res.status(201).json({
    success: true,
    message: "Lamaran pekerjaan berhasil dikirim ke tim HR.",
    application: newApplication,
    job
  });
});

// 14. ACCEPT FORMAL JOB OFFER (CANDIDATE ACTION)
router.post("/applications/:appId/accept", (req: Request, res: Response) => {
  const { appId } = req.params;
  const db = readDb();
  const user = getSessionUser(req, db);

  const appIndex = (db.jobApplications || []).findIndex(a => a.id === appId);
  if (appIndex === -1) {
    return res.status(404).json({ error: "Lamaran pekerjaan tidak ditemukan." });
  }

  const app = db.jobApplications[appIndex];

  // Validate that user is the candidate or admin
  if (user && user.role !== "admin" && app.candidateId !== user.id && app.candidateEmail?.toLowerCase() !== user.email.toLowerCase()) {
    return res.status(403).json({ error: "Anda tidak memiliki akses untuk menerima tawaran ini." });
  }

  if (app.status !== "offered") {
    return res.status(400).json({ error: "Tawaran kerja belum diberikan untuk lamaran ini." });
  }

  app.status = "accepted";
  db.jobApplications[appIndex] = app;

  // Add notification to recruiter
  const recruiterNotif: NotificationItem = {
    id: "notif_rec_accept_" + Date.now(),
    title: `Tawaran Diterima: ${app.candidateName}`,
    body: `${app.candidateName} telah resmi menerima tawaran kerja untuk posisi ${app.jobTitle}!`,
    time: "Just now",
    unread: true
  };
  db.notifications.unshift(recruiterNotif);

  // Add notification to candidate
  const candidateNotif: NotificationItem = {
    id: "notif_cand_accept_" + Date.now(),
    title: `Selamat! Tawaran Diterima`,
    body: `Anda telah resmi menerima tawaran kerja dari ${app.companyName} untuk posisi ${app.jobTitle}.`,
    time: "Just now",
    unread: true
  };
  db.notifications.unshift(candidateNotif);

  writeDb(db);

  return res.json({
    success: true,
    message: "Selamat! Anda telah menerima penawaran kerja resmi.",
    application: app
  });
});

export default router;
